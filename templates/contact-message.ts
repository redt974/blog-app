export function contactMessageTemplate(name: string, object: string, email: string, message: string) {
  return {
    subject: `📩 Nouveau message : ${object}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #374151;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(to right, #2563eb, #3b82f6);
              color: white;
              padding: 24px;
              border-radius: 12px 12px 0 0;
              margin-bottom: 0;
            }
            .content {
              background: white;
              padding: 24px;
              border: 1px solid #e5e7eb;
              border-top: none;
              border-radius: 0 0 12px 12px;
            }
            .field {
              margin-bottom: 16px;
            }
            .label {
              font-weight: 600;
              color: #4b5563;
              margin-bottom: 4px;
            }
            .value {
              color: #111827;
            }
            .message-box {
              background-color: #f9fafb;
              padding: 16px;
              border-radius: 8px;
              margin-top: 8px;
              white-space: pre-line;
            }
            .footer {
              margin-top: 24px;
              padding-top: 16px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0;">Nouveau message depuis le formulaire de contact</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Nom</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">Email</div>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <div class="label">Objet</div>
              <div class="value">${object}</div>
            </div>
            <div class="field">
              <div class="label">Message</div>
              <div class="message-box">${message}</div>
            </div>
            <div class="footer">
              Ce message a été envoyé automatiquement depuis le formulaire de contact.
            </div>
          </div>
        </body>
      </html>
    `,
  }
}