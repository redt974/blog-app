import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { GithubIcon, Mail, Lock } from "lucide-react";


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
              <a
              href="/auth/forgot-password"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Mot de passe oublié ?
            </a>
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

          <div className="relative flex items-center justify-center mt-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative px-4 bg-white text-sm text-gray-500">
              ou continuer avec
            </div>
          </div>

          <div className="space-y-3 pt-3">
            <button 
              type="button"
               onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex justify-center items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
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
