import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const { token, email } = router.query
  const [status, setStatus] = useState("Vérification...")

  useEffect(() => {
    if (token && email) {
      fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      }).then(async (res) => {
        const data = await res.json()
        if (res.ok) {
          setStatus("Adresse email vérifiée ! Vous pouvez maintenant vous connecter.")
        } else {
          setStatus(data.message || "Erreur de vérification.")
        }
      })
    }
  }, [token, email])

  return <div className="p-4 text-center">{status}</div>
}
