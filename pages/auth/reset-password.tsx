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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg text-center border border-red-100 space-y-2 transition-all duration-300 hover:shadow-xl">
          <p className="text-red-600 font-medium">Lien de réinitialisation invalide ou expiré.</p>
          <a 
            href="/auth/login" 
            className="block mt-4 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            Retour à la connexion
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="w-full p-8 bg-white rounded-2xl shadow-lg space-y-6 border border-gray-100 transition-all duration-300 hover:shadow-xl"
        >
          <div className="space-y-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
              Réinitialiser le mot de passe
            </h1>
            <p className="text-center text-gray-500 text-sm md:text-base">
              Entrez votre nouveau mot de passe ci-dessous
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Nouveau mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 placeholder:text-gray-400 text-gray-800"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Réinitialiser le mot de passe
          </button>

          {message && (
            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 text-sm animate-fade-in">
              <p className="text-center">{message}</p>
            </div>
          )}

          <div className="pt-2">
            <a 
              href="/auth/login" 
              className="block text-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Retour à la connexion
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
