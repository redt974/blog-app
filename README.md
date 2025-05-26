# blog-app

## 🚀 Initialiser le projet

1. **Installer les dépendances :**

```bash
npm install
```

2. **Générer le client Prisma :**

```bash
npx prisma generate
```

3. **Créer le fichier `.env` à la racine :**

```env
DATABASE_URL="mysql://root:@localhost:3306/blog-app"

# Authentification GitHub
GITHUB_ID=
GITHUB_SECRET=

# Authentification Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# NextAuth
NEXTAUTH_SECRET=

# Envoi d’e-mails via Gmail
GMAIL_HOST=smtp.gmail.com
GMAIL_USER=
GMAIL_PASSWORD=
GMAIL_PORT=587
GMAIL_USE_TLS=true
```

---

## 🔐 Configuration de l’authentification GitHub

1. Va sur [GitHub Developer Settings](https://github.com/settings/developers)

2. Clique sur **OAuth Apps** → puis **New OAuth App**

3. Remplis le formulaire :

* **Application name** : `Site Club Pierrelaye`
* **Homepage URL** : `http://localhost:3000`
* **Authorization callback URL** :
  `http://localhost:3000/api/auth/callback/github`

4. Clique sur **Register application**

5. Récupère :

* `Client ID` → à mettre dans `.env` en tant que `GITHUB_ID`
* `Client Secret` → clique sur "Generate a new client secret" → `GITHUB_SECRET`

---

## 🔐 Configuration de l’authentification Google (OAuth)

1. Va sur [Google Cloud Console](https://console.cloud.google.com/)

2. Crée un projet, puis va dans **API & Services > Identifiants**

3. Clique sur **Créer des identifiants > ID client OAuth**

4. Choisis **Application Web**, et configure :

* **Origine autorisée JavaScript** : `http://localhost:3000`
* **URI de redirection autorisé** :
  `http://localhost:3000/api/auth/callback/google`

5. Récupère :

* `Client ID` → `GOOGLE_CLIENT_ID`
* `Client Secret` → `GOOGLE_CLIENT_SECRET`

---

## 📧 Configuration de Gmail pour l’envoi d’e-mails

1. Active la validation en 2 étapes sur ton compte Gmail

2. Crée un mot de passe d'application depuis
   [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

3. Copie ce mot de passe et configure dans `.env` :

```env
GMAIL_USER=votreadresse@gmail.com
GMAIL_PASSWORD=mot_de_passe_application
```

---

## 🔐 Générer le `NEXTAUTH_SECRET`

Utilise un générateur de mot de passe sécurisé (ex : [Dashlane](https://www.dashlane.com/fr/features/password-generator))
ou en ligne de commande :

```bash
openssl rand -base64 32
```

---

## 🧪 Lancer l'application

* Démarrer le serveur Next.js :

```bash
npm run dev
```

* Ouvrir Prisma Studio pour explorer la BDD :

```bash
npx prisma studio
```

---

## ✅ Fonctionnalités intégrées

* Authentification GitHub et Google via NextAuth
* Réinitialisation de mot de passe par email
* Emails envoyés via SMTP Gmail
* ORM via Prisma avec MySQL
