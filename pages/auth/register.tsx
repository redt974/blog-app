import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Github, Check, X } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import Captcha from "@/components/Captcha";

interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [requirements, setRequirements] = useState<PasswordRequirements>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const router = useRouter();

  const validatePassword = (pwd: string) => {
    const newRequirements = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[@#!%&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    };
    setRequirements(newRequirements);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    validatePassword(pwd);
  };

  const handlePasswordFocus = () => {
    setShowPasswordRequirements(true);
  };

  const handlePasswordBlur = () => {
    setTimeout(() => {
      setShowPasswordRequirements(false);
    }, 200);
  };

  const isPasswordValid =
    Object.values(requirements).filter(Boolean).length >= 3 &&
    requirements.length;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Le mot de passe ne respecte pas les critères requis.");
      return;
    }

    setLoading(true);
    toast.error(null);

    const form = e.currentTarget;

    const formData = {
      name: form.name.valueOf,
      email: form.email.value,
      password: form.password.value,
      captcha: captcha,
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Affichage de l'erreur côté frontend
        toast.error(data.message || "Erreur inconnue.");
        setLoading(false);
        return;
      }

      // Optionnel : tu peux ici gérer un message de succès ou directement rediriger
      router.push("/auth/login?verify=email");
    } catch (err) {
      toast.error("Une erreur est survenue, veuillez réessayer plus tard.");
      setLoading(false);
    }
  };

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div
      className={`flex items-center gap-2 text-sm transition-colors duration-200 ${met ? "text-green-600" : "text-red-500"}`}
    >
      {met ? <Check size={16} /> : <X size={16} />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 relative">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">Créer un compte</h1>
        <p className="text-center text-gray-600 mb-6">Inscrivez-vous pour accéder à votre espace</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <User size={18} />
              </span>
              <input
                type="text"
                name="name"
                placeholder="Nom"
                required
                className="w-full py-3 px-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full py-3 px-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-1 relative">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={password}
                onChange={handlePasswordChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                required
                className={`w-full py-3 px-10 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                  password && isPasswordValid 
                    ? 'border-green-300 focus:ring-green-500' 
                    : password 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            </div>

            {/* Popup des exigences du mot de passe */}
            {showPasswordRequirements && (
              <div className="absolute left-full top-0 ml-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-left-2 duration-200">
                <div className="absolute left-0 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white -ml-2"></div>
                <div className="absolute left-0 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-gray-200 -ml-2.5"></div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Exigences du mot de passe</h3>
                <div className="space-y-3">
                  <RequirementItem 
                    met={requirements.length} 
                    text="Au moins 8 caractères" 
                  />
                  <RequirementItem 
                    met={requirements.uppercase} 
                    text="Une lettre majuscule (A-Z)" 
                  />
                  <RequirementItem 
                    met={requirements.lowercase} 
                    text="Une lettre minuscule (a-z)" 
                  />
                  <RequirementItem 
                    met={requirements.number} 
                    text="Un chiffre (0-9)" 
                  />
                  <RequirementItem 
                    met={requirements.special} 
                    text="Un caractère spécial (@, #, !, %, etc.)" 
                  />
                </div>
                
                {password && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isPasswordValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-sm font-medium ${isPasswordValid ? 'text-green-600' : 'text-red-600'}`}>
                        {isPasswordValid ? 'Mot de passe valide' : 'Mot de passe invalide'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Captcha onVerify={setCaptcha} />

          <button
            type="submit"
            disabled={loading || !captcha || !isPasswordValid}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Création..." : "Créer le compte"}
          </button>
        </form>

        <div className="relative flex items-center justify-center mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative px-4 bg-white text-sm text-gray-500">
            ou continuer avec
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
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
            Google
          </button>
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="w-full flex justify-center items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            <Github size={20} />
            GitHub
          </button>
        </div>

        <p className="mt-8 text-center text-gray-600 text-sm">
          Déjà inscrit ? <a onClick={() => signIn()} className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">Se connecter</a>
        </p>
      </div>
    </div>
  );
}
