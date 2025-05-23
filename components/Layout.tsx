import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
  href="/" 
  className="flex items-center space-x-2 text-white transform hover:scale-105 transition-transform duration-200"
>
  <img 
    src="/C.S.P.png" 
    alt="Logo CSP" 
    className="w-10 h-10 object-contain"
  />
  <span className="font-bold text-lg tracking-tight">Club Sportif de Pierrelaye</span>
</Link>


            {/* Navigation */}
            <div className="flex items-center space-x-6">
              {session ? (
                <>
                  <Link 
                    href="/admin/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full 
                             text-white bg-blue-500 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 
                             focus:ring-blue-400 transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    <span className="mr-2">+</span>
                    Ajouter
                  </Link>
                  <button 
                    onClick={() => signOut()} 
                    className="text-blue-100 hover:text-white transition-colors duration-200 text-sm font-medium
                             hover:underline decoration-2 underline-offset-4"
                  >
                    Déconnexion
                  </button>
                </>
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
          </div>
        </div>

        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 opacity-50"></div>
      </header>

      <main className="pb-12">
        {children}
      </main>

      {/* Footer with subtle gradient */}
      <footer className="bg-gradient-to-b from-transparent to-gray-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Club Sportif de Pierrelaye. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
