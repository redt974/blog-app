// /lib/auth.ts
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { prisma } from "@/lib/prisma"

/**
 * Récupère la session et l'utilisateur courant depuis la BDD
 */
export async function getAuthUser(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    throw new Error("USER_NOT_FOUND")
  }

  return user
}
