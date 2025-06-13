import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { signIn, useSession } from "next-auth/react"
import Loader from "@/components/Loader";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { status } = useSession(); // `status` can be "loading", "authenticated", or "unauthenticated"

  const { token, email } = router.query
  const [checkStatus, setCheckStatus] = useState("Vérification...")
  const [verificationState, setVerificationState] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/"); // Redirect to home if already logged in
    }
  }, [status, router]);

  if (status === "loading") return <Loader />;
  if (status === "authenticated") return null; // Prevent rendering if already authenticated

  useEffect(() => {
    if (token && email) {
      fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      }).then(async (res) => {
        const data = await res.json()
        if (res.ok) {
          setCheckStatus("Adresse email vérifiée ! Vous pouvez maintenant vous connecter.")
          setVerificationState('success');
        } else {
          setCheckStatus(data.message || "Erreur de vérification.")
          setVerificationState('error');
        }
      })
    }
  }, [token, email])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`p-6 ${
          verificationState === 'verifying' ? 'bg-blue-50 border-b border-blue-100' : 
          verificationState === 'success' ? 'bg-green-50 border-b border-green-100' : 
          'bg-red-50 border-b border-red-100'
        }`}>
          <h1 className="text-2xl font-semibold text-center mb-2">
            Vérification de l'Email
          </h1>
          <p className="text-gray-500 text-center text-sm">
            {email}
          </p>
        </div>
        
        <div className="p-8 flex flex-col items-center justify-center">
          {verificationState === 'verifying' && (
            <div className="animate-spin mb-4 text-blue-500">
              <Loader2 size={48} />
            </div>
          )}
          
          {verificationState === 'success' && (
            <div className="mb-4 text-green-500">
              <CheckCircle size={48} />
            </div>
          )}
          
          {verificationState === 'error' && (
            <div className="mb-4 text-red-500">
              <AlertCircle size={48} />
            </div>
          )}
          
          <p className={`text-lg text-center font-medium ${
            verificationState === 'verifying' ? 'text-blue-700' : 
            verificationState === 'success' ? 'text-green-700' : 
            'text-red-700'
          }`}>
            {checkStatus}
          </p>
          
          {verificationState === 'success' && (
            <a 
              onClick={() => signIn()}
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            >
              Se connecter
            </a>
          )}
          
          {verificationState === 'error' && (
            <a 
              
              href="/auth/login"
              className="mt-6 px-6 py-2.5 bg-gray-600 text-white font-medium text-sm rounded-lg shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            >
              Retour à l'accueil
            </a>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        © 2025 Club Sportif de Pierrelaye . Tous droits réservés
      </div>
    </div>
  );
}
