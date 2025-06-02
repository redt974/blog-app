import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getSession, useSession } from 'next-auth/react'

const sections = [
  { key: 'personal', label: "Informations Personnelles" },
  { key: 'credentials', label: "Informations de Connexion" },
  { key: 'subscriptions', label: "Communications de l'Association" },
  { key: 'support', label: "Support et Assistance" },
  { key: 'delete', label: "Déconnexion et Suppression de Compte" },
]

export default function SettingsPage() {
  const router = useRouter()
  const { section = 'personal' } = router.query
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Chargement…</p>
  if (!session) return <p>Vous devez être connecté·e</p>

  const SectionComponent = require(`./sections/${section}`).default as () => ReactNode

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white px-4 py-6">
        <nav className="space-y-2">
          {sections.map(s => (
            <Link
              key={s.key}
              href={{ pathname: '/settings', query: { section: s.key } }}
              className={`block px-3 py-2 rounded hover:bg-gray-700 ${
                section === s.key ? 'bg-gray-800' : ''
              }`}
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-8 overflow-auto">
        <SectionComponent />
      </main>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  if (!session) {
    return { redirect: { destination: '/api/auth/signin', permanent: false } }
  }
  return { props: {} }
}
