import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Credentials() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.newPassword !== form.confirmPassword) {
      toast.error('❌ Le nouveau mot de passe ne correspond pas à la confirmation.')
      return
    }

    setLoading(true)
    try {
      await axios.put('/api/settings/credentials', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      toast.success('✅ Mot de passe mis à jour avec succès.')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error('❌ Erreur : mot de passe actuel invalide ou requête échouée.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-black-800 mb-8 w-full text-center md:text-left">Changer de mot de passe</h1>
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black-800 mb-2">
              Mot de passe actuel
            </label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-yellow-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-yellow-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black-800 mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-yellow-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-yellow-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black-800 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-yellow-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-yellow-50"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-3 text-black-900 font-medium rounded-lg transition-all duration-200 ${
            loading
              ? 'bg-yellow-200 cursor-not-allowed'
              : 'bg-yellow-400 hover:bg-yellow-500 active:transform active:scale-95'
          }`}
        >
          {loading ? 'Enregistrement…' : 'Sauvegarder'}
        </button>
      </form>
    </div>
  )
}