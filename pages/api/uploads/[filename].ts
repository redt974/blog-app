import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.query;

  if (typeof filename !== "string") {
    return res.status(400).json({ error: "Nom de fichier invalide" });
  }

  const filePath = path.join(process.cwd(), "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Fichier non trouvé" });
  }

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}
