import { createHash } from "crypto"
import { Session } from "next-auth"

export function hashEmail(email: string) {
  return createHash("sha256").update(email.toLowerCase().trim()).digest("hex")
}

export function isAdminFromEmail(email: string | undefined | null): boolean {
  if (!email) return false
  return hashEmail(email) === process.env.ADMIN_EMAIL_HASH
}

export function isAdmin(session: Session | null): boolean {
  return isAdminFromEmail(session?.user?.email)
}
