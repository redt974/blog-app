import { useEffect, useState } from "react"

export default function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const res = await fetch("/api/auth/is-admin")
        const data = await res.json()
        setIsAdmin(data.isAdmin)
      } catch (err) {
        console.error("Erreur lors de la vérification admin :", err)
        setIsAdmin(false)
      }
    }

    fetchAdminStatus()
  }, [])

  return isAdmin
}