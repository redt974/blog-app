export default function Support() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-black-800 mb-8">Support</h1>
      
      <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
        <h2 className="text-xl font-semibold text-black-900 mb-4">Comment pouvons-nous vous aider ?</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-black-900 mb-2">Contact direct</h3>
            <p className="text-black-700">
              Notre équipe support est disponible à{' '}
              <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-700 font-medium">
                support@example.com
              </a>
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-black-900 mb-2">Centre d'aide</h3>
            <p className="text-black-700">
              Consultez notre{' '}
              <a href="/faq" className="text-blue-600 hover:text-blue-700 font-medium">
                FAQ
              </a>
              {' '}pour des réponses rapides à vos questions.
            </p>
          </div>
          
          <div className="pt-4 border-t border-blue-200">
            <p className="text-sm text-black-600">
              Temps de réponse moyen : 24 heures 
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}