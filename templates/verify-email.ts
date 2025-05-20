export function verifyEmailTemplate(link: string, name?: string) {
  return {
    subject: "Confirmez votre inscription",
    html: `
      <h2>Bienvenue${name ? ` ${name}` : ""},</h2>
      <p>Merci de vous être inscrit. Cliquez sur le lien ci-dessous pour confirmer votre adresse email :</p>
      <p><a href="${link}">Confirmer mon adresse</a></p>
      <p>Ce lien expire dans 24 heures.</p>
    `,
  }
}
