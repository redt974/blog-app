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
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Abonnement à la newsletter</h1>
      <div className="flex items-center justify-between">
        <span>Recevoir les actualités et communications</span>
        <Switch
          checked={enabled}
          onChange={handleToggle}
          disabled={loading}
          className={classNames(
            enabled ? 'bg-green-600' : 'bg-gray-300',
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none'
          )}
        >
          <span
            className={classNames(
              enabled ? 'translate-x-6' : 'translate-x-1',
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform'
            )}
          />
        </Switch>
      </div>
    </div>
  )
}
