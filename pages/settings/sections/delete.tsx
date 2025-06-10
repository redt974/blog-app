"use client"

import { signOut } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AlertTriangle, LogOut, Trash2, Shield } from 'lucide-react'

export default function DeleteAccount() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleDelete = async () => {
    const confirmed = confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')
    if (!confirmed) return

    try {
      await axios.delete('/api/settings/delete')
      toast.success('✅ Compte supprimé.')
      signOut({ callbackUrl: '/' })
    } catch (err) {
      toast.error('❌ Une erreur est survenue lors de la suppression.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Déconnexion et Suppression</h1>
        <p className="text-gray-600">Gérez votre session et votre compte</p>
      </div>

      <div className="space-y-6">
        {/* Déconnexion */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <LogOut className="text-blue-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Se déconnecter</h3>
              <p className="text-gray-600 mb-4">
                Fermez votre session actuelle. Vous pourrez vous reconnecter à tout moment.
              </p>
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 active:transform active:scale-95"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>

        {/* Zone dangereuse */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Zone dangereuse</h3>
              <p className="text-red-700 mb-4">
                Les actions suivantes sont irréversibles. Assurez-vous de bien comprendre les conséquences.
              </p>
            </div>
          </div>
        </div>

        {/* Suppression de compte */}
        <div className="bg-white border border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <Trash2 className="text-red-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Supprimer mon compte</h3>
              <p className="text-gray-600 mb-4">
                Cette action supprimera définitivement votre compte et toutes vos données. Cette action ne peut pas être annulée.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-red-900 mb-2">Ce qui sera supprimé :</h4>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Votre profil et informations personnelles</li>
                  <li>• Votre historique d'activités</li>
                  <li>• Vos préférences et paramètres</li>
                  <li>• Toutes vos données associées</li>
                </ul>
              </div>

              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 active:transform active:scale-95 flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Supprimer définitivement mon compte
              </button>
            </div>
          </div>
        </div>

        {/* Informations de sécurité */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Shield className="text-blue-600 mt-1 mr-3" size={20} />
            <div>
              <h3 className="text-blue-900 font-medium mb-1">Protection de vos données</h3>
              <p className="text-blue-700 text-sm">
                Nous prenons la protection de vos données très au sérieux. Toute suppression est effectuée de manière sécurisée et conforme au RGPD.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}