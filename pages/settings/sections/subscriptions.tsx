"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { Bell, Mail, Settings } from 'lucide-react'

export default function Subscriptions() {
  const { data: session } = useSession()
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/settings/subscriptions')
        setEnabled(res.data.newsletterSubscribed)
      } catch {
        toast.error("❌ Impossible de charger l'état de l'abonnement")
      }
    }

    fetchData()
  }, [])

  const handleToggle = async (value: boolean) => {
    setLoading(true)
    try {
      await axios.put('/api/settings/subscriptions', { subscribed: value })
      setEnabled(value)
      toast.success(value ? '✅ Abonné à la newsletter.' : '🛑 Désabonnement effectué.')
    } catch {
      toast.error('❌ Erreur lors de la mise à jour de votre abonnement.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Communications de l'Association</h1>
        <p className="text-gray-600">Gérez vos préférences de communication et notifications</p>
      </div>

      <div className="space-y-6">
        {/* Newsletter */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Mail className="text-blue-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Newsletter du club</h3>
                <p className="text-gray-600 mb-4">
                  Recevez les dernières actualités, événements et informations importantes du Club Sportif de Pierrelaye.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Bell size={16} />
                  <span>Fréquence : Hebdomadaire</span>
                </div>
              </div>
            </div>
            <div className="ml-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => handleToggle(e.target.checked)}
                  disabled={loading}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Informations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Settings className="text-blue-600 mt-1 mr-3" size={20} />
            <div>
              <h3 className="text-blue-900 font-medium mb-1">À propos de vos préférences</h3>
              <p className="text-blue-700 text-sm">
                Vous pouvez modifier ces paramètres à tout moment. Les notifications importantes restent toujours activées pour votre sécurité et celle des autres membres.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}