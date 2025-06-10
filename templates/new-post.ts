export function newPostTemplate(title: string, content: string, category: string) {
  return {
    subject: `🆕 Nouveau post : ${title}`,
    html: `
      <h2>Nouvelle annonce dans la catégorie <em>${category}</em></h2>
      <h3>${title}</h3>
      <p style="white-space: pre-line;">${content}</p>
      <p>Visitez le site pour en savoir plus.</p>
    `,
  }
}
