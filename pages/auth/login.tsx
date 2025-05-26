import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { GithubIcon } from "lucide-react";
import { Mail, Lock, User, Github } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  };

  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    CredentialsSignin: "Email ou mot de passe invalide",
    EmailSignin: "Lien invalide",
    OAuthAccountNotLinked:
      "Ce compte est déjà lié à un autre mode de connexion.",
    OAuthCallback: "Erreur de connexion avec Google",
    default: "Une erreur est survenue",
  };
  const errorMessage = error
    ? errorMessages[error] || errorMessages.default
    : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/50 to-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-card p-8 rounded-lg shadow-md overflow-hidden space-y-6"
        >
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Connectez-vous à votre compte
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <Mail size={18} />
              </span>
              <input
                className="w-full py-3 px-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <Lock size={18} />
              </span>
              <input
                className="w-full py-3 px-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Se connecter
          </motion.button>

          <div className="space-y-3 pt-3">
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full h-11 px-4 py-2 bg-white text-black border border-input rounded-md font-medium flex items-center justify-center gap-2 transition-colors hover:bg-slate-50"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0353 3.12C17.9503 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70998C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.29C5.02498 13.57 4.88501 12.8 4.88501 12C4.88501 11.2 5.01998 10.43 5.26498 9.71001L1.275 6.61C0.46 8.23 0 10.06 0 12C0 13.94 0.46 15.77 1.28 17.39L5.26498 14.29Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.285L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z"
                  fill="#34A853"
                />
              </svg>
              Connexion avec Google
            </button>
            <button
              type="button"
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="w-full h-11 px-4 py-2 bg-[#24292F] text-white rounded-md font-medium flex items-center justify-center gap-2 transition-colors hover:bg-[#24292F]/90"
            >
              <GithubIcon className="h-5 w-5" />
              Connexion avec Github
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-md bg-destructive/10 text-destructive text-sm"
            >
              <p>{errorMessage}</p>
            </motion.div>
          )}

          {error === "OAuthAccountNotLinked" && (
            <div className="text-sm text-destructive">
              Ce compte est déjà lié à un autre mode de connexion.
              <br />
              Veuillez vous connecter avec l'autre méthode ou{" "}
              <a href="/contact" className="text-primary hover:underline">
                contactez-nous
              </a>
              .
            </div>
          )}

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Pas encore de compte ?
            </span>{" "}
            <a
              href="/auth/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              S'inscrire
            </a>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
