import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import useIsAdmin from "@/lib/hooks/use-is-admin";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdmin();

  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
     <header className="sticky top-0 z-50 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 relative">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
        
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

            
            <div className="flex items-center space-x-6">
              {session?.user && isAdmin && (
                <Link
                  href="/admin/new"
                  className="text-white bg-yellow-600 hover:shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all duration-200 text-sm font-medium px-4 py-2 rounded">
                  <span className="mr-2">+</span>
                  Ajouter
                </Link>
              )}

              {session?.user ? (
                <button
                  onClick={() => signOut()}
                   className="text-white bg-yellow-600 hover:shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all duration-200 text-sm font-medium px-4 py-2 rounded"
                >
                  Déconnexion
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="text-white bg-yellow-600 hover:shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all duration-200 text-sm font-medium px-4 py-2 rounded"
                >
                  Connexion
                </button>
              )}
            </div>

            
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 opacity-50"></div>
          </div>
        </div>
      </header>

      <main className="pb-12 flex-grow">
        {children}
      </main>

      
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
