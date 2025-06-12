import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Lock, Check, X } from "lucide-react";
import Captcha from "@/components/Captcha";

interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token, email } = router.query;

  const [captcha, setCaptcha] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [requirements, setRequirements] = useState<PasswordRequirements>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

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
    setNewPassword(pwd);
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

  useEffect(() => {
    if (typeof token === "string" && typeof email === "string") {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    try {
      if (
        !newPassword ||
        !confirmPassword ||
        newPassword !== confirmPassword ||
        !isPasswordValid
      ) {
        toast.error("Les mots de passe ne correspondent pas ou sont vides.");
        setLoading(false);
        return;
      }


      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password: newPassword , captcha}),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data.message || "Une erreur est survenue lors de la réinitialisation."
        );
        setLoading(false);
        return;
      }

      toast.success(data.message || "Mot de passe réinitialisé avec succès.");
      setLoading(false);

      // Rediriger après un délai
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (err) {
      toast.error("Erreur réseau, veuillez réessayer.");
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

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg text-center border border-red-100 space-y-2 transition-all duration-300 hover:shadow-xl">
          <p className="text-red-600 font-medium">
            Lien de réinitialisation invalide ou expiré.
          </p>
          <a
            href="/auth/login"
            className="block mt-4 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            Retour à la connexion
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="w-full p-8 bg-white rounded-2xl shadow-lg space-y-6 border border-gray-100 transition-all duration-300 hover:shadow-xl"
        >
          <div className="space-y-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
              Réinitialiser le mot de passe
            </h1>
            <p className="text-center text-gray-500 text-sm md:text-base">
              Entrez votre nouveau mot de passe ci-dessous
            </p>
          </div>

          <div className="space-y-1 relative">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <Lock size={18} />
              </span>
              <input
                id="password"
                type="password"
                value={newPassword}
                onChange={handlePasswordChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                required
                className={`w-full py-3 px-10 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                  newPassword && isPasswordValid
                    ? "border-green-300 focus:ring-green-500"
                    : newPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {/* Popup des exigences du mot de passe */}
            {showPasswordRequirements && (
              <div className="absolute left-full top-0 ml-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-left-2 duration-200">
                <div className="absolute left-0 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white -ml-2"></div>
                <div className="absolute left-0 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-gray-200 -ml-2.5"></div>

                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Exigences du mot de passe
                </h3>
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
                {newPassword && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${isPasswordValid ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <span
                        className={`text-sm font-medium ${isPasswordValid ? "text-green-600" : "text-red-600"}`}
                      >
                        {isPasswordValid
                          ? "Mot de passe valide"
                          : "Mot de passe invalide"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmer le mot de passe
            </label>
            <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <Lock size={18} />
              </span>
            <input
              id="password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              
              required
              className="w-full py-3 px-10 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all "
            />
            </div>
          </div>

          <Captcha onVerify={setCaptcha} />

          <button
            type="submit"
            disabled={!isPasswordValid}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
          </button>

          <div className="pt-2">
            <a
              href="/auth/login"
              className="block text-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Retour à la connexion
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
