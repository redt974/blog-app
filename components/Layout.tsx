import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  return (
    <div>
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-lg">🏀 Groupe Sportif</Link>
        <div className="space-x-4">
          {session ? (
            <>
              <Link href="/admin/new">+ Ajouter</Link>
              <button onClick={() => signOut()} className="underline">Déconnexion</button>
            </>
          ) : (
            <button onClick={() => signIn()} className="underline">Connexion</button>
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
