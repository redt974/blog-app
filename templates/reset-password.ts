export function passwordResetConfirmationTemplate({ email }: { email: string }) {
  return {
    subject: "Votre mot de passe a été réinitialisé",
    html: `
      <div style="font-family: sans-serif;">
        <h2>Mot de passe réinitialisé</h2>
        <p>Bonjour,</p>
        <p>Votre mot de passe pour l’adresse <strong>${email}</strong> a été réinitialisé avec succès.</p>
        <p>Si vous n’êtes pas à l’origine de cette opération, veuillez contacter le support immédiatement.</p>
        <p>Merci,<br>L’équipe MonApp</p>
      </div>
    `,
  }
}
