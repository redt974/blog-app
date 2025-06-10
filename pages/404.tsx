import React from 'react';
import Link from 'next/link'
import { Home, ArrowLeft, Shield } from 'lucide-react';

const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-4">
        <Link
          href="/"
          className="flex items-center space-x-2 text-white transform hover:scale-105 transition-transform duration-200"
        >
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-700 font-bold">CSP</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-white">Club Sportif de Pierrelaye</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield size={48} className="text-blue-600" />
              </div>
            </div>
            <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Introuvable</h2>
            <p className="text-gray-600 text-lg mb-8">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Home size={20} />
              <span>Retour à l'accueil</span>
            </Link>
            
            <div className="block">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                <ArrowLeft size={20} />
                <span>Retour à la page précédente</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;