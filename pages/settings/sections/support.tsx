"use client"

import { HelpCircle, Mail, Phone, MessageCircle, ExternalLink } from 'lucide-react'

export default function Support() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support et Assistance</h1>
        <p className="text-gray-600">Besoin d'aide ? Notre équipe est là pour vous accompagner</p>
      </div>

      <div className="space-y-6">
        {/* Contact direct */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Mail className="text-blue-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact par email</h3>
              <p className="text-gray-600 mb-4">
                Notre équipe support répond généralement sous 24 heures
              </p>
              <a
                href="mailto:support@clubsportifpierrelaye.fr"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                support@clubsportifpierrelaye.fr
                <ExternalLink size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </div>

        

        

        {/* Informations */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-center">
            <h3 className="text-gray-900 font-medium mb-2">Temps de réponse moyens</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Email :</span>
                <span className="font-medium text-gray-900 ml-1">24h</span>
              </div>
              <div>
                <span className="text-gray-600">Téléphone :</span>
                <span className="font-medium text-gray-900 ml-1">Immédiat</span>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}