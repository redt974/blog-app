import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { token, email } = router.query

  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    if (typeof token === "string" && typeof email === "string") {
      setIsValid(true)
    }
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, password }),
    })
    const data = await res.json()
    setMessage(data.message)
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center text-red-600">
          Lien de réinitialisation invalide ou expiré.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Réinitialiser le mot de passe</h1>

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Nouveau mot de passe"
          required
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
        >
          Réinitialiser
        </button>

        {message && <p className="text-center text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  )
}
