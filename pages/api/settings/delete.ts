import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();

  try {
    const user = await getAuthUser(req, res);

    // Récupère l'utilisateur avec son image
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { image: true },
    });

    // Supprime le fichier image s'il existe
    if (dbUser?.image) {
      // L'URL est du type /api/uploads/filename.jpg => on enlève le prefix
      const fileName = dbUser.image.replace("/api/uploads/", "");
      const filePath = path.join(process.cwd(), "uploads", fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Supprime l'utilisateur
    await prisma.user.delete({
      where: { id: user.id },
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    if (err.message === "UNAUTHORIZED") return res.status(401).end();
    if (err.message === "USER_NOT_FOUND") return res.status(404).json({ error: "Utilisateur introuvable" });

    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
