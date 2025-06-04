## 🔐 Tests de sécurité OWASP Top 10 (Next.js + Prisma)

### 1. **Broken Access Control (A01:2021)**

➡️ *Exemples : accès non autorisé à une route admin ou à des fichiers*

✅ **Tests** :

* [ ] Accéder à une route API admin (`/api/admin/...`) sans être connecté → renvoi 403 ?
* [ ] Accéder à un post ou une ressource d’un autre utilisateur ?
* [ ] Changer l’`id` ou `slug` dans un formulaire ou une requête (`POST`, `GET`) ?
* [ ] Voir si l’upload de fichier est possible sans être admin ?

---

### 2. **Cryptographic Failures (A02:2021)**

➡️ *Exemples : absence de HTTPS, stockage de mots de passe non sécurisé*

✅ **Tests** :

* [ ] Ton site force-t-il bien **HTTPS** (via `next.config.js`, proxies, headers) ?
* [ ] Les mots de passe sont-ils hashés (si tu gères l'inscription) ? → (NextAuth utilise bcrypt par défaut)
* [ ] Est-ce que les tokens JWT ou sessions sont bien sécurisés (signés et expirent) ?

---

### 3. **Injection (A03:2021)**

➡️ *Exemples : SQL injection, NoSQL injection, Command Injection*

✅ **Tests** :

* [ ] Tente une injection via les champs texte (`title`, `content`, etc.) :

  ```json
  {"title": "'; DROP TABLE users; --"}
  ```

  → Est-ce que l’API plante ou filtre ?
* [ ] Prisma protège bien des injections, **mais attention si tu construis des requêtes dynamiques**.
* [ ] Upload de fichier : tente de renommer une image en `.php` ou `.js`, et vérifie s’il est servi depuis `/uploads`.

---

### 4. **Insecure Design (A04:2021)**

➡️ *Exemples : absence de vérification logique dans l’API, erreurs de conception métier*

✅ **Tests** :

* [ ] Est-ce qu’un utilisateur peut poster sans catégorie ?
* [ ] Est-ce que l’API permet de publier plusieurs posts avec le **même slug** ?
* [ ] Est-ce que des fichiers sont laissés dans `.tmp` si le process crash ?

---

### 5. **Security Misconfiguration (A05:2021)**

➡️ *Exemples : headers de sécurité manquants, mauvaise config des permissions, etc.*

✅ **Tests** :

* [ ] Analyse avec [https://securityheaders.com](https://securityheaders.com)
* [ ] Est-ce que tu as les headers suivants dans les réponses HTTP ?

  * `Content-Security-Policy`
  * `X-Content-Type-Options: nosniff`
  * `X-Frame-Options: DENY`
* [ ] Dossiers sensibles accessibles (`.env`, `.git`, `public/uploads/.tmp/` ?)

---

### 6. **Vulnerable and Outdated Components (A06:2021)**

➡️ *Exemples : dépendances vulnérables dans `package.json`*

✅ **Tests** :

* [ ] Exécute `npm audit` ou `pnpm audit` régulièrement
* [ ] Vérifie avec `npm outdated` si des dépendances critiques ne sont pas à jour
* [ ] Utilise [Snyk](https://snyk.io/) ou GitHub Dependabot pour automatiser

---

### 7. **Identification and Authentication Failures (A07:2021)**

➡️ *Exemples : auth mal configurée, brute-force possible*

✅ **Tests** :

* [ ] Teste des logins avec un mauvais mot de passe plusieurs fois → y a-t-il un blocage ?
* [ ] Si tu fais des connexions email/password custom : y a-t-il du **rate limiting** ou un captcha ?
* [ ] Vérifie que **l’auth middleware NextAuth protège bien les routes sensibles** (frontend + backend)

---

### 8. **Software and Data Integrity Failures (A08:2021)**

➡️ *Exemples : absence de signature de fichiers, injection de code dans uploads*

✅ **Tests** :

* [ ] Uploads : empêche-t-on les `.exe`, `.php`, `.js` déguisés en `.jpg` ?
* [ ] Fichiers uploaded exécutés dans `public/` ? (ne jamais autoriser !)
* [ ] Si tu fais des `eval()` ou du `dynamic import()` dynamique, assure-toi qu’aucun utilisateur ne peut en contrôler la source.

---

### 9. **Security Logging and Monitoring Failures (A09:2021)**

➡️ *Exemples : absence de logs d'erreurs, pas de détection des anomalies*

✅ **Tests** :

* [ ] En cas d'erreur (upload invalide, accès refusé), un log est-il généré côté serveur ?
* [ ] Est-ce que tu enregistres les erreurs critiques (ex. tentative d’accès à une ressource interdite) ?
* [ ] En prod, les erreurs doivent être loggées **sans exposer la stack complète à l'utilisateur**.

---

### 10. **Server-Side Request Forgery (SSRF) (A10:2021)**

➡️ *Peu probable ici, sauf si tu fais des appels HTTP côté serveur avec des URLs utilisateur*

✅ **Tests** *(uniquement si tu as du fetch vers des URLs saisies par l’utilisateur)* :

* [ ] Est-ce qu’un utilisateur peut te forcer à faire un `fetch('http://127.0.0.1:3000/internal')` ?
* [ ] Vérifie tous les `fetch`, `axios`, etc. dans ton backend pour t’assurer que l'URL ne vient **jamais** directement d’un champ utilisateur.

---

## 🧪 Bonus : outils d’analyse

* [ZAP](https://owasp.org/www-project-zap/) (scanner OWASP officiel)
* [SecurityHeaders](https://securityheaders.com)
* [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
* [Snyk](https://snyk.io/)
* [Nikto](https://github.com/sullo/nikto) ou [nmap](https://nmap.org/) pour scanner les ports et services backend (si tu exposes un serveur public)