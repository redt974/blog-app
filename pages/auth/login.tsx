import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    })
  }

  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessages: Record<string, string> = {
    CredentialsSignin: "Email ou mot de passe invalide",
    EmailSignin: "Lien invalide",
    OAuthAccountNotLinked: "Ce compte est déjà lié à un autre mode de connexion.",
    OAuthCallback: "Erreur de connexion avec Google",
    default: "Une erreur est survenue",
  }
  const errorMessage = error ? (errorMessages[error] || errorMessages.default) : ""

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-xl font-bold">Connexion</h1>
      <input
        className="border p-2 w-full"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white p-2 w-full">
        Se connecter
      </button>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Connexion avec Google
        </button>
        <button
          type="button"
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Connexion avec Github
        </button>
        {/* <button
          type="button"
          onClick={() => signIn("apple", { callbackUrl: "/" })}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Connexion avec Apple
        </button> */}
      </div>
      {error && <p className="text-red-500">{errorMessage}</p>}
      {error === "OAuthAccountNotLinked" && (
        <div className="text-sm text-red-600">
          Ce compte est déjà lié à un autre mode de connexion.<br />
          Veuillez vous connecter avec l’autre méthode ou{" "}
          <a href="/contact" className="underline text-blue-600">contactez-nous</a>.
        </div>
      )}
    </form>
  )
}
