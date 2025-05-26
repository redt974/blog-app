import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setMessage(data.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Mot de passe oublié</h1>

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Entrez votre email"
          required
          className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
        >
          Envoyer le lien de réinitialisation
        </button>

        {message && <p className="text-center text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  )
}
