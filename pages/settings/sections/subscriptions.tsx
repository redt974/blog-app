import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Switch } from '@headlessui/react'
import { toast } from 'react-toastify'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

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
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-black-800 mb-8">Abonnement à la newsletter</h1>
      
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-medium text-blue-900">Recevoir les actualités et communications</h2>
            <p className="text-blue-700 mt-1">Restez informé des dernières nouvelles et mises à jour</p>
          </div>
          <div className="flex justify-start sm:justify-end">
            <Switch
              checked={enabled}
              onChange={handleToggle}
              disabled={loading}
              className={classNames(
                enabled ? 'bg-blue-500' : 'bg-blue-200',
                'relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              )}
            >
              <span
                className={classNames(
                  enabled ? 'translate-x-7' : 'translate-x-1',
                  'inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  )
}