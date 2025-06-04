import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import useIsAdmin from "@/lib/hooks/use-is-admin";
import { useState } from "react";
import { Menu, User, LogOut, LogIn, Plus } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdmin();

  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900 relative">
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
              <span className="font-bold text-lg tracking-tight text-white">
                Club Sportif de Pierrelaye
              </span>
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {session?.user && isAdmin && (
                <Link
                  href="/admin/new"
                  className="text-white bg-blue-700 hover:bg-blue-800 hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all duration-200 text-sm font-medium px-4 py-2 rounded inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Link>
              )}

              {session?.user && (
                <Link
                  href="/settings"
                  className="text-white bg-blue-700 hover:bg-blue-800 hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all duration-200 text-sm font-medium px-4 py-2 rounded inline-flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Link>
              )}

              {session?.user ? (
                <button
                  onClick={() => signOut()}
                  className="text-white bg-blue-700 hover:bg-blue-800 hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all duration-200 text-sm font-medium px-4 py-2 rounded inline-flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="text-white bg-blue-700 hover:bg-blue-800 hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all duration-200 text-sm font-medium px-4 py-2 rounded inline-flex items-center"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Connexion
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} pb-3`}>
            <div className="flex flex-col space-y-2">
              {session?.user && isAdmin && (
                <Link
                  href="/admin/new"
                  className="text-white bg-blue-700 hover:bg-blue-800 hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all duration-200 text-sm font-medium px-4 py-2 rounded inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Link>
              )}

              {session?.user && (
                <Link
                  href="/settings"
                  className="text-white bg-blue-700 hover:bg-blue-800 hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all duration-200 text-sm font-medium px-4 py-2 rounded inline-flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Link>
              )}

              {session?.user ? (
                <button
                  onClick={() => signOut()}
                  className="text-white bg-blue-700 hover:bg-blue-800 hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all duration-200 text-sm font-medium px-4 py-2 rounded inline-flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="text-white bg-blue-700 hover:bg-blue-800 hover:shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-all duration-200 text-sm font-medium px-4 py-2 rounded inline-flex items-center"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Connexion
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900 opacity-50"></div>
      </header>

      <main className="pb-12 flex-grow">{children}</main>

      <footer className="bg-slate-100 text-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 text-sm">
            <div>
              <h4 className="font-semibold mb-3">Activités</h4>
              <ul className="space-y-1">
                <li>
                  <a
                    href="https://pierrelaye.fr/animations-et-associations/cs-pierrelaye-basketball"
                    className="text-blue-800 hover:underline"
                  >
                    Basket
                  </a>
                </li>
                <li>
                  <a
                    href="https://pierrelaye.fr/animations-et-associations/cs-pierrelaye-basketball"
                    className="text-blue-800 hover:underline"
                  >
                    Tennis
                  </a>
                </li>
                <li>
                  <a
                    href="https://pierrelaye.fr/animations-et-associations/csp-gym-sport-et-convivialite"
                    className="text-blue-800 hover:underline"
                  >
                    Gym
                  </a>
                </li>
                <li>
                  <a
                    href="https://pierrelaye.fr/animations-et-associations/csp-boules-bretonnes"
                    className="text-blue-800 hover:underline"
                  >
                    Boule Bretonne
                  </a>
                </li>
                <li>
                  <a
                    href="https://pierrelaye.fr/animations-et-associations/csp-vtt"
                    className="text-blue-800 hover:underline"
                  >
                    VTT
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Nos Sites</h4>
              <ul className="space-y-1">
                <li>
                  <a
                    href="https://www.cspierrelaye-basketball.com"
                    className="text-blue-800 hover:underline"
                  >
                    Site du basket
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-800 hover:underline">
                    Site du Tennis
                  </a>
                </li>
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
              <h4 className="font-semibold mb-3">Suivez-nous</h4>
              <ul className="space-y-1">
                <li>
                  <a
                    href="https:https://www.facebook.com/PierrelayeBasket"
                    className="text-blue-800 hover:underline"
                  >
                    Facebook Basket
                  </a>
                </li>
                <li>Facebook Boule Bretonne</li>
                <li>
                  <a
                    href="https://www.facebook.com/GVPIERRELAYE"
                    className="text-blue-800 hover:underline"
                  >
                    Facebook GYM Volontaire
                  </a>
                </li>

                <li>
                  <a
                    href="https://www.facebook.com/cspierrelaye"
                    className="text-blue-800 hover:underline"
                  >
                    Facebook Tennis
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/cs_pierrelaye_tennis/"
                    className="text-blue-800 hover:underline"
                  >
                    Instagram Tennis
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/pierrelayebasketball/"
                    className="text-blue-800 hover:underline"
                  >
                    Instagram Basket
                  </a>
                </li>
                <li>YouTube</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-1">
                <li>Les Président du CSP</li>
                <li>Les secrétaire du CSP</li>
                <li>Les Trésorier du CSP</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Club Sportif de Pierrelaye. Tous droits
            réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}