export function passwordResetTemplate({ url, email }: { url: string; email: string }) {
  return {
    subject: "Réinitialisez votre mot de passe",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Bonjour,</h2>
        <p>Vous avez demandé à réinitialiser votre mot de passe pour l’adresse <strong>${email}</strong>.</p>
        <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
        <p>
          <a href="${url}" style="background-color: #0070f3; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none;">
            Réinitialiser le mot de passe
          </a>
        </p>
        <p>Ce lien est valable pendant 1 heure.</p>
        <p>Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer ce message.</p>
      </div>
    `,
  }
}
