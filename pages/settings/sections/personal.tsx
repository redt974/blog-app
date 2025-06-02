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
      toast.error('❌ Erreur lors du téléchargement de l\'image.')
    } finally {
      setUploading(false)
    }
  }

  const imageSrc = form.image || '/default-avatar.jpg'

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-black-800 mb-8 w-full text-center md:text-left">Informations Personnelles</h1>

      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto">
            <img
              src={imageSrc}
              alt="Photo de profil"
              className="w-32 h-32 rounded-full object-cover ring-4 ring-black-200 shadow-lg"
            />
            <label
              htmlFor="upload-image"
              className="absolute inset-0 flex items-center justify-center bg-black-900/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer group"
            >
              <span className="text-white text-sm font-medium px-3 py-2 bg-black-800/70 rounded-lg transform group-hover:scale-105 transition-transform">
                Changer
              </span>
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
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { name: 'name', label: 'Nom complet', type: 'text' },
            { name: 'email', label: 'Adresse email', type: 'email' },
            { name: 'phone', label: 'Téléphone', type: 'tel' }
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-black-800 mb-2">
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-yellow-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-yellow-50"
              />
            </div>
          ))}

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
    </div>
  )
}