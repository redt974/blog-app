import { useRouter } from "next/router"
import { useEffect } from "react"
import useIsAdmin from "./use-is-admin"

export function useAdminRedirect() {
  const isAdmin = useIsAdmin()
  const router = useRouter()

  useEffect(() => {
    if (isAdmin === false) {
      router.replace("/")
    }
  }, [isAdmin, router])
}