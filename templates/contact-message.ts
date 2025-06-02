export function contactMessageTemplate(name: string, object: string, email: string, message: string) {
  return {
    subject: `📩 Nouveau message : ${object}`,
    html: `
      <h2>Nouveau message depuis le formulaire de contact</h2>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Objet :</strong> ${object}</p>
      <p><strong>Message :</strong></p>
      <p style="white-space: pre-line;">${message}</p>
    `,
  }
}
