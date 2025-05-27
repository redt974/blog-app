export function passwordResetTemplate({ url, email }: { url: string; email: string }) {
  return {
    subject: "Réinitialisez votre mot de passe",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc; font-family: 'Helvetica Neue', Arial, sans-serif;">
        <div style="background-color: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 8px;">Réinitialisation du mot de passe</h1>
            <p style="color: #64748b; font-size: 16px; margin: 0;">Suivez les instructions ci-dessous</p>
          </div>

          <div style="color: #334155; font-size: 16px; line-height: 1.6;">
            <p>Bonjour,</p>
            <p>Vous avez demandé à réinitialiser votre mot de passe pour l'adresse <strong style="color: #0f172a;">${email}</strong>.</p>
            <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
          </div>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${url}" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; transition: background-color 0.2s ease;">
              Réinitialiser le mot de passe
            </a>
          </div>

          <div style="color: #64748b; font-size: 14px; line-height: 1.6; border-top: 1px solid #e2e8f0; margin-top: 32px; padding-top: 32px;">
            <p style="margin: 0 0 8px;">Ce lien est valable pendant 1 heure.</p>
            <p style="margin: 0;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message.</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #94a3b8; font-size: 14px;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    `,
  }
}
