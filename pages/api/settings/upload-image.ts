import { getAuthUser } from "@/lib/auth";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma"; // adapte ce chemin si besoin

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const user = await getAuthUser(req, res);
    if (!user) return res.status(401).json({ error: "Non autorisé" });

    const form = new IncomingForm();
    const uploadDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Erreur lors de l'upload" });

      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      // Vérification du type MIME
      const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
      const mimetype = file.mimetype || "";
      if (!allowedImageTypes.includes(mimetype)) {
        fs.unlinkSync(file.filepath); // Nettoyage immédiat du fichier non valide
        return res.status(400).json({ error: "Seules les images JPEG, PNG et WebP sont autorisées" });
      }

      // Vérification de la taille
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        fs.unlinkSync(file.filepath); // Supprimer l'image trop grande
        return res.status(400).json({ error: "Image trop volumineuse (max 5MB)" });
      }

      const fileName = path.basename(file.filepath);
      const publicUrl = `/api/uploads/${fileName}`;

      // Supprimer l'ancienne image de l'utilisateur s'il y en a une
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { image: true },
      });

      if (currentUser?.image) {
        const oldFilePath = currentUser.image.replace("/api/uploads/", "");
        const oldFullPath = path.join(uploadDir, oldFilePath);
        if (fs.existsSync(oldFullPath)) fs.unlinkSync(oldFullPath);
      }

      // Mettre à jour le chemin de l'image dans la base de données
      await prisma.user.update({
        where: { id: user.id },
        data: { image: publicUrl },
      });

      return res.status(200).json({ url: publicUrl });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
