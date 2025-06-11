# blog-app

## 🚀 Initialiser le projet

1. **Installer les dépendances :**

```bash
npm install
```

2. **Générer le client Prisma et Récupérer les migrations:**

```bash
npx prisma generate
npx prisma migrate dev
```

3. **Créer le fichier `.env` à la racine ou renomme le fichier `.env-default` en `.env`:**

```env
# Environnement
NODE_ENV=development
# NODE_ENV=production

DATABASE_URL="mysql://root:@localhost:3306/blog-app"

# Admin credentials
ADMIN_EMAIL_HASH=

# Authentification GitHub
GITHUB_ID=
GITHUB_SECRET=

# Authentification Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Captcha
NEXT_PUBLIC_CAPTCHA_SITE_KEY=
CAPTCHA_SECRET_KEY=

# Resend
RESEND_API_KEY=
EMAIL_FROM_NAME="MyApp"
EMAIL_FROM_ADDRESS="onboarding@resend.dev"

# Contact
CONTACT_TO_EMAIL=

# Redis (For development only)
REDIS_URL=redis://localhost:6379

# Redis (For production)
UPSTASH_REDIS_URL=https://[your-projet].upstash.io
UPSTASH_REDIS_SECRET=
```

---

## 🛠️ **Génération du hash d'email admin** :

### 1. 📁 Crée un dossier

```bash
mkdir hash-email && cd hash-email
```

### 2. 📦 Initialise un projet Node

```bash
npm init -y
```

### 3. 🛠️ Installe TypeScript (optionnel mais recommandé)

```bash
npm install typescript ts-node @types/node --save-dev
npx tsc --init
```

---

### 4. 📝 Crée le fichier `hash-email.ts`

```bash
touch hash-email.ts
```

Colle dedans :

```ts
import { createHash } from "crypto"
import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question("Entrez l'email à hasher (ex: admin@example.com) : ", (email) => {
  const hash = createHash("sha256").update(email.toLowerCase().trim()).digest("hex")
  console.log(`\n✅ Hash SHA-256 :\n${hash}\n`)
  rl.close()
})
```

---

### 5. ▶️ Lance le script

```bash
npx ts-node hash-email.ts
```

Tu verras :

```
Entrez l'email à hasher (ex: admin@example.com) : admin@example.com

✅ Hash SHA-256 :
2e40174d68d208e69c3f7076502a3e88ae6c0c1b8a10ff237f4152e9d153ab0f
```

---

### ✅ Tu peux maintenant copier ce hash dans ton fichier `.env` :

```env
ADMIN_EMAIL_HASH = "2e40174d68d208e69c3f7076502a3e88ae6c0c1b8a10ff237f4152e9d153ab0f"
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

## 🔐 Générer le `NEXTAUTH_SECRET`

Utilise un générateur de mot de passe sécurisé (ex : [Dashlane](https://www.dashlane.com/fr/features/password-generator))
ou en ligne de commande :

```bash
openssl rand -base64 32
```

OU

```bash
node -e "console.log(require('crypto').randomBytes(256).toString('hex'))"
```

---

## 🧠 Configuration de reCAPTCHA

Va sur https://www.google.com/recaptcha/admin/create

Crée un site avec les bons paramètres (v2)

Récupère :

```env
NEXT_PUBLIC_CAPTCHA_SITE_KEY=clé_site
CAPTCHA_SECRET_KEY=clé_secrète
```

---

## 📧 Configuration de Resend pour l’envoi d’e-mails

1. Va sur https://resend.com et crée un compte

2. Crée une API Key depuis ton tableau de bord Resend

3. Renseigne-la dans ton fichier .env et modifier les informations d'expédition :

```env
RESEND_API_KEY=ta_clé_api_resend
EMAIL_FROM_NAME="MyApp"
EMAIL_FROM_ADDRESS="onboarding@resend.dev"
```
⚠️ Assure-toi d’avoir configuré un domaine et qu’il est validé pour l’envoi d’e-mails via Resend.

---

## 📨 Configuration du formulaire de contact

* Renseigne l’email de destination :

```env
CONTACT_TO_EMAIL=ton.email@exemple.com
```
Ce champ est utilisé pour envoyer les messages du formulaire de contact.

---

## 🛑 Configuration de la BDD Redis :

1. Va sur https://upstash.com et crée un compte

2. Crée une base de données depuis ton tableau de bord Upstash

3. Renseigne les informations nécessaires et clique sur créer

* Renseigne l’url de connexion Redis dans le .env :

```env
# Redis (For production)
UPSTASH_REDIS_URL=https://[your-projet].upstash.io
UPSTASH_REDIS_SECRET=
```
⚠️ Assure-toi d’avoir préciser le chiffrement TLS pour une connexion avec [Redis Insight](https://redis.io/insight/)

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

## ✅ Fonctionnalités intégrées

* Authentification admin
* Authentification GitHub et Google via NextAuth
* Réinitialisation de mot de passe par email
* Emails envoyés via SMTP Gmail ou Resend
* Formulaire de contact
* Protection par Captcha (reCAPTCHA)
* ORM via Prisma avec MySQL
* Cache ou sessions via Redis