import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { isAdminFromSession } from "@/lib/auth/is-admin"
import formidable from "formidable"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export const config = {
  api: {
    bodyParser: false,
  },
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const formidable = require("formidable")
  const form = new formidable.IncomingForm({
    allowEmptyFiles: true,
    minFileSize: 0,
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const isAdmin = await isAdminFromSession(req, res)

  if (!session || !isAdmin) {
    return res.status(403).json({ error: "Forbidden" })
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

        const title = Array.isArray(titleRaw) ? titleRaw[0] : titleRaw
        const content = Array.isArray(contentRaw) ? contentRaw[0] : contentRaw
        const category = Array.isArray(categoryRaw) ? categoryRaw[0] : categoryRaw

        if (!title || !content || !category) {
          return res.status(400).json({ message: "Champs requis manquants" })
        }

        const existingPost = await prisma.post.findUnique({ where: { slug } })
        if (!existingPost) {
          return res.status(404).json({ message: "Post non trouvé" })
        }

        let newSlug = slug
        if (title !== existingPost.title) {
          newSlug = slugify(title)
          const existingSlug = await prisma.post.findUnique({ where: { slug: newSlug } })
          if (existingSlug && existingSlug.id !== existingPost.id) {
            return res.status(409).json({ message: "Ce titre génère un slug déjà existant" })
          }
        }

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

        // On garde les anciennes valeurs par défaut
        let imageUrl = existingPost.imageUrl || null
        let pdfUrl = existingPost.pdfUrl || null

        // Vérifie que imageUrl n’est pas null
        if (!imageUrl) {
          return res.status(400).json({ message: "L’image est obligatoire" })
        }

        if (files.image) {
          const imageFile = Array.isArray(files.image) ? files.image[0] : files.image

          // Si un champ image est présent mais vide, c’est une erreur
          if (imageFile.size === 0) {
            return res.status(400).json({ message: "L’image ne doit pas être vide !" })
          }

          imageUrl = await saveFile(imageFile)
        }

        if (files.pdf) {
          const pdfFile = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf
          if (pdfFile.size > 0) {
            pdfUrl = await saveFile(pdfFile)
          } else {
            pdfUrl = null // suppression du PDF si fichier vide
          }
        }

        const updatedPost = await prisma.post.update({
          where: { slug },
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
        const uploadDir = path.join(process.cwd(), "public", "uploads", slug)
        if (fs.existsSync(uploadDir)) {
          fs.rmSync(uploadDir, { recursive: true, force: true })
        }

        await prisma.post.delete({ where: { slug } })
        return res.status(204).end()
      }

      default:
        res.setHeader("Allow", ["PUT", "DELETE"])
        return res.status(405).end(`Méthode ${req.method} non autorisée`)
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Erreur serveur" })
  }
}
