# blog-app

## 🚀 Initialiser le projet

1. **Installer les dépendances :**

```bash
npm install
```

2. **Générer le client Prisma et Récupérer les migrations:**

```bash
npx prisma generate
npx prisma migrate dev --name init
```

3. **Créer le fichier `.env` à la racine :**

```env
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

### 1. Activer la validation en deux étapes (obligatoire)

Avant de générer un mot de passe d’application, tu dois activer la validation en deux étapes sur ton compte Gmail :

* Va sur : [https://myaccount.google.com/security](https://myaccount.google.com/security)
* Dans la section **"Connexion à Google"**, clique sur **"Validation en deux étapes"**
* Suis les étapes pour l’activer (téléphone + SMS ou app Google Authenticator)

### 2. Générer un mot de passe d’application Gmail

Une fois la 2FA activée :

* Va sur : [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
* Choisis **"Sélectionner une application" → Autre (personnalisée)** → mets par ex. "blog-app"
* Clique sur **Générer**
* Copie le mot de passe généré

### 3. Remplir les variables dans `.env`

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
ADMIN_HASH = "2e40174d68d208e69c3f7076502a3e88ae6c0c1b8a10ff237f4152e9d153ab0f"
```

---

## ✅ Fonctionnalités intégrées

* Authentification en admin
* Authentification GitHub et Google via NextAuth
* Réinitialisation de mot de passe par email
* Emails envoyés via SMTP Gmail
* ORM via Prisma avec MySQL