// pages/contact.tsx (ou /components/ContactForm.tsx selon ton organisation)
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    object: '',
    email: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/contact/contact', form)
      toast.success('✅ Message envoyé avec succès.')
      setForm({ name: '',object: '', email: '', message: '' })
    } catch (err) {
      toast.error('❌ Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contactez-nous</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nom</label>
          <input
            type="text"
            name="name"
            placeholder='Entrez votre nom'
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
           <div>
          <label className="block mb-1">Object</label>
          <input
            type="text"
            name="object"
            placeholder="Objet de votre message"
            value={form.object}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder='Votre email'
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Message</label>
          <textarea
            name="message"
            placeholder='Votre message'
            value={form.message}
            onChange={handleChange}
            rows={5}
            required
            className="w-full border px-3 py-2 rounded"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Envoi en cours…' : 'Envoyer'}
        </button>
      </form>
    </div>
  )
}
