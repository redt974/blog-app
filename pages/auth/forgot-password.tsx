import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="w-full p-8 bg-white rounded-2xl shadow-lg space-y-6 border border-gray-100 transition-all duration-300 hover:shadow-xl"
        >
          <div className="space-y-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
              Mot de passe oublié
            </h1>
            <p className="text-center text-gray-500 text-sm md:text-base">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nom@example.com"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 placeholder:text-gray-400 text-gray-800"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Envoyer le lien de réinitialisation
          </button>

          {message && (
            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 text-sm animate-fade-in">
              <p className="text-center">{message}</p>
            </div>
          )}

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
