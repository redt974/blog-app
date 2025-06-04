import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { isAdminFromSession } from "@/lib/auth/is-admin"
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
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).end(`Méthode ${req.method} non autorisée`)
  }

  const session = await getServerSession(req, res, authOptions)
  const isAdmin = await isAdminFromSession(req, res)

  if (!session || !isAdmin) {
    return res.status(403).json({ error: "Forbidden" })
  }

  try {
    const { fields, files } = await parseForm(req)

    const titleRaw = fields.title
    const contentRaw = fields.content
    const categoryRaw = fields.category

    const title = Array.isArray(titleRaw) ? titleRaw[0] : titleRaw
    const content = Array.isArray(contentRaw) ? contentRaw[0] : contentRaw
    const category = Array.isArray(categoryRaw) ? categoryRaw[0] : categoryRaw

    if (!title || !content || !category) {
      return res.status(400).json({ message: "Champs requis manquants" })
    }

    const slug = slugify(title)
    let finalSlug = slug
    let counter = 1
    while (await prisma.post.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter++}`
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", slug)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    async function saveFile(file: formidable.File): Promise<string> {
      const ext = path.extname(file.originalFilename || "file")
      const fileName = uuidv4() + ext
      const destPath = path.join(uploadDir, fileName)
      await fs.promises.rename(file.filepath, destPath)
      return `/uploads/${slug}/${fileName}`
    }

    let imageUrl: string | null = null
    let pdfUrl: string | null = null

    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"]
    const allowedPdfTypes = ["application/pdf"]

    if (files.image) {
      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image
      if (imageFile.size > 5 * 1024 * 1024) { // 5 MB
        return res.status(400).json({ message: "Image trop volumineuse" })
      }
      const hasValidImage = imageFile.size > 0 && imageFile.originalFilename
      if (hasValidImage && allowedImageTypes.includes(imageFile.mimetype || "")) {
        imageUrl = await saveFile(imageFile)
      } else if (hasValidImage && !allowedImageTypes.includes(imageFile.mimetype || "")){
        return res.status(400).json({ message: "Seules les images JPEG, PNG et WebP sont autorisées" })
      }
    }

    if (files.pdf) {
      const pdfFile = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf
      if (pdfFile.size > 20 * 1024 * 1024) { // 20 MB
        return res.status(400).json({ message: "PDF trop volumineux" })
      }
      const hasValidPDF = pdfFile.size > 0 && pdfFile.originalFilename
      if (hasValidPDF && allowedPdfTypes.includes(pdfFile.mimetype || "")) {
        pdfUrl = await saveFile(pdfFile)
      } else if (hasValidPDF && !allowedPdfTypes.includes(pdfFile.mimetype || "")) {
        return res.status(400).json({ message: "Seuls les fichiers PDF sont autorisés" })
      }
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        category,
        slug,
        imageUrl,
        pdfUrl,
      },
    })

    return res.status(201).json(newPost)
  } catch (error) {
    console.error("Erreur serveur :", error)
    return res.status(500).json({ message: "Erreur serveur" })
  } finally {
    await cleanupTmpDir()
  }
}
