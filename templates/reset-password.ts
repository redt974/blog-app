export function passwordResetConfirmationTemplate({ email }: { email: string }) {
  return {
    subject: "Votre mot de passe a été réinitialisé",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc; font-family: 'Helvetica Neue', Arial, sans-serif;">
        <div style="background-color: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 8px;">Mot de passe réinitialisé</h1>
            <p style="color: #64748b; font-size: 16px; margin: 0;">Confirmation de changement</p>
          </div>

          <div style="color: #334155; font-size: 16px; line-height: 1.6;">
            <p>Bonjour,</p>
            <p>Votre mot de passe pour l'adresse <strong style="color: #0f172a;">${email}</strong> a été réinitialisé avec succès.</p>
            <p>Si vous êtes à l'origine de cette modification, aucune action supplémentaire n'est requise.</p>
          </div>

          <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 16px; margin: 32px 0; color: #991b1b;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Important :</strong> Si vous n'êtes pas à l'origine de cette opération, veuillez contacter le support immédiatement.
            </p>
          </div>

          <div style="color: #64748b; font-size: 14px; line-height: 1.6; border-top: 1px solid #e2e8f0; margin-top: 32px; padding-top: 32px;">
            <p style="margin: 0;">Merci de votre confiance,</p>
            <p style="margin: 8px 0 0; font-weight: 600; color: #334155;">L'équipe MonApp</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #94a3b8; font-size: 14px;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
        </div>
      </div>
    `,
  }
}