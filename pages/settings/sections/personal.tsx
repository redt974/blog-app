"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Camera, User, Mail, Phone } from 'lucide-react'

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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Informations Personnelles</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et votre photo de profil</p>
      </div>

      {/* Photo de profil */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
            <img
              src={imageSrc}
              alt="Photo de profil"
              className="w-full h-full object-cover"
            />
          </div>
          <label
            htmlFor="upload-image"
            className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg"
          >
            <Camera size={16} />
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

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="mr-2 text-gray-500" />
              Nom complet
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Votre nom complet"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} className="mr-2 text-gray-500" />
              Adresse email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Phone size={16} className="mr-2 text-gray-500" />
            Téléphone
          </label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="+33 1 23 45 67 89"
          />
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-8 py-3 text-white font-medium rounded-lg transition-all duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'
            }`}
          >
            {loading ? 'Enregistrement…' : 'Sauvegarder les modifications'}
          </button>
        </div>
      </form>
    </div>
  )
}