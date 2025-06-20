import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { isAdminFromSession } from "@/lib/auth/is-admin";
import { redis } from "@/lib/redis";
import slugify from "slugify";
import formidable from "formidable"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export const config = {
  api: {
    bodyParser: false,
  },
}

const tmpDir = path.join(process.cwd(), ".tmp")

function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  fs.mkdirSync(tmpDir, { recursive: true })

  const formidable = require("formidable")
  const form = new formidable.IncomingForm({
    allowEmptyFiles: true,
    minFileSize: 0,
    uploadDir: tmpDir,
    keepExtensions: true,
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

async function cleanupTmpDir() {
  try {
    if (fs.existsSync(tmpDir)) {
      await fs.promises.rm(tmpDir, { recursive: true, force: true })
    }
  } catch (err) {
    console.error("Échec du nettoyage du dossier .tmp :", err)
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const email = req?.body?.email || "unknown"; // ou extrait de session
  const isAdmin = await isAdminFromSession(req, res)

  const failKey = `admin-api:fail:${email}`;
  const blockKey = `admin-api:block:${email}`;

  const isBlocked = await redis.exists(blockKey);
  if (isBlocked) return res.status(403).end();

  if (!session || !isAdmin) {
    const attempts = await redis.incr(failKey);
    if (attempts === 1) await redis.expire(failKey, 300);
    if (attempts >= 5) await redis.set(blockKey, "1", "EX", 300);
    return res.status(403).end();
  }

  const slug = req.query.slug as string
  if (!slug) {
    return res.status(400).json({ message: "Slug manquant" })
  }

  try {
    switch (req.method) {
      case "PUT": {
        const { fields, files } = await parseForm(req)

        // S'assurer que ce sont des strings simples, pas des tableaux
        const titleRaw = fields.title
        const contentRaw = fields.content
        const categoryRaw = fields.category
        const filesToDeleteRaw = fields.filesToDelete;

        const title = Array.isArray(titleRaw) ? titleRaw[0] : titleRaw
        const content = Array.isArray(contentRaw) ? contentRaw[0] : contentRaw
        const category = Array.isArray(categoryRaw) ? categoryRaw[0] : categoryRaw
        const filesToDeleteStr = Array.isArray(filesToDeleteRaw) ? filesToDeleteRaw[0] : filesToDeleteRaw;
        const filesToDelete: string[] = filesToDeleteStr ? JSON.parse(filesToDeleteStr) : [];

        if (!title || !content || !category) {
          return res.status(400).json({ message: "Champs requis manquants" })
        }

        const existingPost = await prisma.post.findUnique({ where: { slug } })
        if (!existingPost) {
          return res.status(404).json({ message: "Post non trouvé" })
        }

        let newSlug = slug;
        if (title !== existingPost.title) {
          const baseSlug = slugify(title);
          let finalSlug = baseSlug;
          let counter = 1;

          while (true) {
            const existingSlug = await prisma.post.findUnique({ where: { slug: finalSlug } });
            if (!existingSlug || existingSlug.id === existingPost.id) {
              break;
            }
            finalSlug = `${baseSlug}-${counter++}`;
          }
          newSlug = finalSlug;
        }

        const slugChanged = newSlug !== slug
        const uploadDir = path.join(process.cwd(), "public", "uploads", newSlug)
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }

        async function saveFile(file: formidable.File): Promise<string> {
          const ext = path.extname(file.originalFilename || "file")
          const fileName = uuidv4() + ext
          const destPath = path.join(uploadDir, fileName)
          await fs.promises.rename(file.filepath, destPath)
          return `/uploads/${newSlug}/${fileName}`
        }

        // Valeurs par défaut issues de la BDD
        let imageUrl = existingPost.imageUrl || null
        let pdfUrl = existingPost.pdfUrl || null

        // Supprimer les fichiers listés dans filesToDelete
        for (const url of filesToDelete) {
          const filePath = path.join(process.cwd(), "public", url);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          // Réinitialise les URLs associées si elles correspondent
          if (url === existingPost.pdfUrl) pdfUrl = null;
          if (url === existingPost.imageUrl) imageUrl = null;
        }

        const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"]
        const allowedPdfTypes = ["application/pdf"]

        // --- 1) Traitement du fichier image ---
        if (files.image) {
          const imageFile = Array.isArray(files.image) ? files.image[0] : files.image
          if (imageFile.size > 5 * 1024 * 1024) { // 5 MB
            return res.status(400).json({ message: "Image trop volumineuse" })
          }
          const hasValidImage = imageFile.size > 0 && imageFile.originalFilename
          if (hasValidImage && allowedImageTypes.includes(imageFile.mimetype || "")) {
            // Supprimer l’ancienne image si elle existe
            if (existingPost.imageUrl) {
              const oldImagePath = path.join(process.cwd(), "public", existingPost.imageUrl)
              if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath)
            }
            imageUrl = await saveFile(imageFile)
          } else if (hasValidImage && !allowedImageTypes.includes(imageFile.mimetype || "")) {
            return res.status(400).json({ message: "Seules les images JPEG, PNG et WebP sont autorisées" })
          }
        }

        // --- 2) Traitement du fichier PDF ---
        if (files.pdf) {
          const pdfFile = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf
          if (pdfFile.size > 20 * 1024 * 1024) { // 20 MB
            return res.status(400).json({ message: "PDF trop volumineux" })
          }
          const hasValidPDF = pdfFile.size > 0 && pdfFile.originalFilename
          if (hasValidPDF && allowedPdfTypes.includes(pdfFile.mimetype || "")) {
            // Supprimer l’ancien PDF si existant
            if (existingPost.pdfUrl) {
              const oldPdfPath = path.join(process.cwd(), "public", existingPost.pdfUrl)
              if (fs.existsSync(oldPdfPath)) fs.unlinkSync(oldPdfPath)
            }
            pdfUrl = await saveFile(pdfFile)
          } else if (hasValidPDF && !allowedPdfTypes.includes(pdfFile.mimetype || "")) {
            return res.status(400).json({ message: "Seuls les fichiers PDF sont autorisés" })
          }
        }

        // --- 3) Renommage ou fusion du dossier si le slug a changé ---
        if (slugChanged) {
          const oldDir = path.join(process.cwd(), "public", "uploads", slug)
          const newDir = path.join(process.cwd(), "public", "uploads", newSlug)
          try {
            if (fs.existsSync(oldDir)) {
              if (!fs.existsSync(newDir)) {
                // Cas simple : on renomme directement le dossier
                fs.mkdirSync(path.dirname(newDir), { recursive: true })
                fs.renameSync(oldDir, newDir)
              } else {
                // Fusion fichier par fichier
                const existingFiles = fs.readdirSync(oldDir)
                for (const file of existingFiles) {
                  const oldFilePath = path.join(oldDir, file)
                  const newFilePath = path.join(newDir, file)
                  // Si le fichier n’existe pas déjà, on le déplace
                  if (!fs.existsSync(newFilePath)) {
                    fs.renameSync(oldFilePath, newFilePath)
                  } else {
                    // Sinon on supprime l’ancien doublon
                    fs.unlinkSync(oldFilePath)
                  }
                }
                // Supprimer l’ancien dossier une fois vide
                fs.rmdirSync(oldDir)
              }
            }
            // Corriger les URLs si on n’a pas uploadé de nouveau fichier dans ce dossier
            if (imageUrl) {
              imageUrl = imageUrl.replace(`/uploads/${slug}/`, `/uploads/${newSlug}/`)
            }
            if (pdfUrl) {
              pdfUrl = pdfUrl.replace(`/uploads/${slug}/`, `/uploads/${newSlug}/`)
            }
          } catch (err) {
            console.error("Erreur lors du renommage ou fusion du dossier :", err)
          }
        }

        // --- 4) Mise à jour en base (on se base sur l’ID, pas le slug) ---
        const updatedPost = await prisma.post.update({
          where: { id: existingPost.id },
          data: {
            title,
            content,
            category,
            slug: newSlug,
            imageUrl,
            pdfUrl,
          },
        })

        return res.status(200).json(updatedPost)
      }
      case "DELETE": {
        const slug = req.query.slug as string;
        if (!slug) {
          res.status(400).json({ message: "Slug manquant" });
          return;
        }

        try {
          const uploadDir = path.join(process.cwd(), "public", "uploads", slug);

          if (fs.existsSync(uploadDir)) {
            await fs.promises.rm(uploadDir, { recursive: true, force: true });
          }

          await prisma.post.delete({ where: { slug } });

          res.status(204).end(); // Ne pas faire "return"
        } catch (err) {
          console.error("Erreur suppression dossier ou post :", err);
          res.status(500).json({ message: "Erreur serveur" });
        }
        return; // Fin explicite du bloc
      }
      default:
        res.setHeader("Allow", ["PUT", "DELETE"])
        return res.status(405).end(`Méthode ${req.method} non autorisée`)
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Erreur serveur" })
  } finally {
    await cleanupTmpDir()
  }
}
