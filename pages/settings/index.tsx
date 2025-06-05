import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getSession, useSession } from 'next-auth/react'
import { Menu, X } from 'lucide-react'

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-lg text-gray-600 animate-pulse">Chargement…</p>
    </div>
  )
  
  if (!session) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-lg text-gray-600">Vous devez être connecté·e</p>
    </div>
  )

  const SectionComponent = require(`./sections/${section}`).default as () => ReactNode

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Tel Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 relative p-4 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center space-x-2 text-white transform hover:scale-105 transition-transform duration-200"
          rel="stylesheet"
        >
          <img
            src="/C.S.P-removebg-preview.png"
            alt="Logo CSP"
            className="w-10 h-10 object-contain"
          />
          <span className="font-bold text-lg tracking-tight text-white">Club Sportif de Pierrelaye</span>
        </Link>
        <button
          onClick={toggleMenu}
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors md:hidden"
        >
          {isMenuOpen ? <X size={24} className="text-black" /> : <Menu size={24} className="text-black" />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className={`
            ${isMenuOpen ? 'block' : 'hidden'}
            md:block
            w-full md:w-72 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
            text-white p-6 md:min-h-screen
            transition-all duration-300 ease-in-out
          `}
        >
           <div className="hidden md:block mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">Paramètres</h2>
            <div className="h-1 w-12 bg-blue-300 rounded"></div>
          </div>
          <nav className="space-y-1">
            {sections.map(s => (
              <Link
                key={s.key}
                href={{ pathname: '/settings', query: { section: s.key } }}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                  section === s.key 
                    ? 'bg-blue-200 text-blue-900 shadow-lg transform scale-105' 
                    : 'text-white hover:bg-blue-400/50 hover:text-white'
                }`}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Contenu */}
        <main className="flex-1 p-4 md:p-10 max-w-5xl mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <SectionComponent />
          </div>
        </main>
      </div>
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