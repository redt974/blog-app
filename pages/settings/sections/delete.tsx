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
    <div>
      <h1 className="text-2xl font-bold mb-4">Suppression de compte</h1>
      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Supprimer mon compte
      </button>
    </div>
  )
}
