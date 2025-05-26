# blog-app

## Initialiser le repôt :

- Installer les dépendances : `npm i`,

- Avoir la BDD Prisma : `npx prisma generate`,

- Créer le fichier `.env` :

```
DATABASE_URL="mysql://root:@localhost:3306/blog-app"
GITHUB_ID=
GITHUB_SECRET=
NEXTAUTH_SECRET=
```

## Configuer l'Auth avec Github :

- Va sur GitHub Developer Settings : 🔗 https://github.com/settings/developers

- Clique sur "OAuth Apps" → puis "New OAuth App"

- Renseigne :

    -> Application name : Site Club Pierrelaye

    -> Homepage URL : http://localhost:3000 (ou l’URL de ton site en prod)

    -> Authorization callback URL :
        ➜ http://localhost:3000/api/auth/callback/github

    -> Clique sur Register application

- GitHub te donne :

    -> Client ID = GITHUB_ID

    -> Clique sur "Generate a new client secret" → Client Secret = GITHUB_SECRET

## Configuer l'Auth Next :

Aller sur un site de générateur de mot de passe aléatoire [Exemple](https://www.dashlane.com/fr/features/password-generator)

Et copier/coller le "le mot de passe" générée en tant que clé secrète.

## Lancer l'application :

- Lancer l'application Next.js :  `npx run dev`
- Lancer l'interface web de Prisma : `npx prisma studio`
