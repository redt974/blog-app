import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import useIsAdmin from "@/lib/hooks/use-is-admin";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdmin();
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Logo */}
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
              <span className="font-bold text-lg tracking-tight text-black">Club Sportif de Pierrelaye</span>
            </Link>

            {/* Navigation */}
            <div className="flex items-center space-x-6">
              {session?.user && isAdmin && (
                <Link
                  href="/admin/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full 
                  text-white bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-yellow-400 transition-colors duration-200 shadow-sm hover:shadow-md">
                  <span className="mr-2">+</span>
                  Ajouter
                </Link>
              )}

              {session?.user ? (
                <button
                  onClick={() => signOut()}
                  className="text-blue-100 hover:text-white transition-colors duration-200 text-sm font-medium
                  hover:underline decoration-2 underline-offset-4"
                >
                  Déconnexion
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
                  rounded-full text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Connexion
                </button>
              )}
            </div>

            {/* Decorative bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 opacity-50"></div>
          </div>
        </div>
      </header>

      <main className="pb-12 flex-grow">
        {children}
      </main>

      {/* Footer Apple-style */}
      <footer className="bg-gray-100 text-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 text-sm">
            <div>
              <h4 className="font-semibold mb-3">Activités</h4>
              <ul className="space-y-1">
                <li>Basket</li>
                <li>Football</li>
                <li>Danse</li>
                <li>Musculation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Nos Sites</h4>
              <ul className="space-y-1">
                <li >Site du basket</li>
                <li>Site du Tenis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Infos pratiques</h4>
              <ul className="space-y-1">
                <li>Horaires</li>
                <li>Tarifs</li>
                <li>Adhésion</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Événements</h4>
              <ul className="space-y-1">
                <li>Tournois</li>
                <li>Stages</li>
                <li>Compétitions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Suivez-nous</h4>
              <ul className="space-y-1">
                <li>Facebook</li>
                <li>Instagram</li>
                <li>YouTube</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-1">
                <li>Président du CSP</li>
                <li>Président du VTT</li>
                <li>Président des Boules bretonne</li>
                <li>Président du Basket-Ball</li>
                <li>Président du Tennis</li>
                <li>Président de la Gym</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Club Sportif de Pierrelaye. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
