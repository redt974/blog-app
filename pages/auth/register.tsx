import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const formData = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.message || "Erreur inconnue.")
      setLoading(false)
      return
    }

    router.push("/auth/login")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold">Créer un compte</h1>
      <input type="text" name="name" placeholder="Nom" required className="p-2 border w-full" />
      <input type="email" name="email" placeholder="Email" required className="p-2 border w-full" />
      <input type="password" name="password" placeholder="Mot de passe" required className="p-2 border w-full" />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? "Création..." : "Créer le compte"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}