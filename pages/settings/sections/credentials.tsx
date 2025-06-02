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
    <>
      <h1 className="text-2xl font-bold mb-4">Changer de mot de passe</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block mb-1">Mot de passe actuel</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Nouveau mot de passe</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Confirmer le mot de passe</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Enregistrement…' : 'Sauvegarder'}
        </button>
      </form>
    </>
  )
}
