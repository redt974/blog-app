import { signOut } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function DeleteAccount() {
  const handleDelete = async () => {
    const confirmed = confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')
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
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-black-800 mb-6">Suppression de compte</h1>
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-red-700 mb-4">⚠️ Zone dangereuse</h2>
        <p className="text-red-600 mb-6">
          La suppression de votre compte est une action irréversible. Toutes vos données seront définitivement effacées.
        </p>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 active:transform active:scale-95"
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  )
}