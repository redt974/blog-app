import { getAuthUser } from "@/lib/auth";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import {prisma} from "@/lib/prisma"; // adapte ce chemin si besoin

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
      const fileName = path.basename(file.filepath);
      const publicUrl = `/api/uploads/${fileName}`;

      // 1. Récupérer l'image précédente de l'utilisateur
      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { image: true },
      });

      // 2. Supprimer l'ancienne image si elle existe
      if (currentUser?.image) {
        const oldFilePath = currentUser.image.replace("/api/uploads/", "");
        const oldFullPath = path.join(process.cwd(), "uploads", oldFilePath);

        if (fs.existsSync(oldFullPath)) {
          fs.unlinkSync(oldFullPath);
        }
      }

      // 3. Mettre à jour l'utilisateur avec le nouveau chemin
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
