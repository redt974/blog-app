import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'react-toastify'

type ProfileForm = {
  name: string
  email: string
  phone: string
  image: string
}

export default function PersonalSection() {
  const { data: session } = useSession()
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    email: '',
    phone: '',
    image: '',
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/settings/personal')
        setForm(res.data)
      } catch {
        toast.error("❌ Impossible de charger les informations")
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.put('/api/settings/personal', form)
      toast.success('✅ Informations mises à jour.')
    } catch {
      toast.error('❌ Erreur lors de la mise à jour.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      const res = await axios.post('/api/settings/upload-image', formData)
      const imageUrl = res.data.url
      setForm((prev) => ({ ...prev, image: imageUrl }))
      toast.success('✅ Photo mise à jour.')
    } catch {
      toast.error('❌ Erreur lors du téléchargement de l’image.')
    } finally {
      setUploading(false)
    }
  }

  const imageSrc = form.image || '/default-avatar.jpg' // ← image par défaut (à ajouter dans public/)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Informations Personnelles</h1>

      <div className="relative w-32 h-32 mb-6 mx-auto">
        <img
          src={imageSrc}
          alt="Photo de profil"
          className="w-32 h-32 rounded-full object-cover shadow-lg border"
        />
        <label htmlFor="upload-image">
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white text-sm font-medium opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
            Changer de photo
          </div>
        </label>
        <input
          id="upload-image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          disabled={uploading}
        />
      </div>


      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        {['name', 'email', 'phone'].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field}</label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Enregistrement…' : 'Sauvegarder'}
        </button>
      </form>
    </div>
  )
}
