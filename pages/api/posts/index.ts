import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import { isAdminFromSession } from "@/lib/auth/is-admin";
import fs from "fs";
import path from "path";
import type { File } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const formidable = require("formidable");
    const form = new formidable.IncomingForm({
      multiples: false,
      keepExtensions: true,
      maxFileSize: 20 * 1024 * 1024,
      uploadDir: path.join(process.cwd(), "public/uploads/tmp"),
      allowEmptyFiles: true,
      minFileSize: 0,
    });

    if (!fs.existsSync(form.uploadDir)) {
      fs.mkdirSync(form.uploadDir, { recursive: true });
    }

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

async function moveFile(oldPath: string, newPath: string) {
  try {
    if (fs.existsSync(newPath)) {
      await fs.promises.unlink(newPath);
    }
    await fs.promises.rename(oldPath, newPath);
  } catch (err) {
    console.error("Erreur déplacement fichier :", err);
    throw err;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: "Non autorisé" });

    const isAdmin = await isAdminFromSession(req, res);
    if (!isAdmin) return res.status(403).json({ error: "Accès interdit" });

    if (req.method === "POST") {
      const { fields, files } = await parseForm(req);

      const title = fields.title?.toString() || "";
      const content = fields.content?.toString() || "";
      const category = fields.category?.toString() || "";

      if (!title || !content || !category) {
        return res.status(400).json({ message: "Champs requis manquants" });
      }

      const slug = slugify(title, { lower: true, strict: true });

      const existing = await prisma.post.findUnique({ where: { slug } });
      if (existing) {
        return res.status(400).json({ error: "Un post avec ce titre existe déjà." });
      }

      const targetDir = path.join(process.cwd(), "public/uploads", slug);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      let imageUrl: string | null = null;
      let pdfUrl: string | null = null;

      // Après parseForm:
      const image = Array.isArray(files.image) ? files.image[0] : files.image;
      const pdf = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;

      if (image && image.filepath && image.originalFilename) {
        const newImagePath = path.join(targetDir, image.originalFilename);
        await moveFile(image.filepath, newImagePath);
        imageUrl = `/uploads/${slug}/${image.originalFilename}`;
      }

      if (pdf && pdf.filepath && pdf.originalFilename) {
        const newPdfPath = path.join(targetDir, pdf.originalFilename);
        await moveFile(pdf.filepath, newPdfPath);
        pdfUrl = `/uploads/${slug}/${pdf.originalFilename}`;
      }

      const post = await prisma.post.create({
        data: {
          title,
          content,
          category,
          slug,
          imageUrl,
          pdfUrl,
        },
      });

      return res.status(201).json(post);
    } else if (req.method === "GET") {
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(posts);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Méthode ${req.method} non autorisée.`);
    }
  } catch (error) {
    console.error("Erreur API /api/posts:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
