# Configuration OAuth - Google & Apple

## 📌 Variables d'environnement requises

Ajoutez ces variables dans votre fichier `.env` :

```env
# Google OAuth
GOOGLE_CLIENT_ID=votre_client_id_google
GOOGLE_CLIENT_SECRET=votre_client_secret_google

# Apple OAuth
APPLE_CLIENT_ID=votre_client_id_apple
APPLE_CLIENT_SECRET=votre_client_secret_apple
```

---

## 🔵 Configuration Google OAuth

### Étape 1 : Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez-en un existant
3. Donnez-lui un nom (ex: "Harmonie")

### Étape 2 : Activer l'API OAuth

1. Dans le menu latéral, allez dans **"APIs & Services"** > **"OAuth consent screen"**
2. Choisissez **"External"** (ou "Internal" si vous avez un compte Google Workspace)
3. Remplissez les informations requises :
   - **App name** : Harmonie
   - **User support email** : votre email
   - **Developer contact email** : votre email
4. Cliquez sur **"Save and Continue"**

### Étape 3 : Créer les credentials

1. Allez dans **"APIs & Services"** > **"Credentials"**
2. Cliquez sur **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
3. Sélectionnez **"Web application"**
4. Configurez :
   - **Name** : Harmonie Web
   - **Authorized JavaScript origins** :
     - `http://localhost:3000` (développement)
     - `https://votre-domaine.com` (production)
   - **Authorized redirect URIs** :
     - `http://localhost:3000/api/auth/callback/google`
     - `https://votre-domaine.com/api/auth/callback/google`
5. Cliquez sur **"Create"**
6. Copiez le **Client ID** et **Client Secret**

---

## 🍎 Configuration Apple OAuth

### Étape 1 : Compte Apple Developer

1. Vous devez avoir un compte [Apple Developer](https://developer.apple.com/) ($99/an)
2. Allez dans **"Certificates, Identifiers & Profiles"**

### Étape 2 : Créer un App ID

1. Allez dans **"Identifiers"** > **"+"**
2. Sélectionnez **"App IDs"** > **"Continue"**
3. Sélectionnez **"App"** > **"Continue"**
4. Remplissez :
   - **Description** : Harmonie
   - **Bundle ID** : `com.harmonie.app` (Explicit)
5. Cochez **"Sign in with Apple"** dans les capabilities
6. Cliquez sur **"Continue"** puis **"Register"**

### Étape 3 : Créer un Services ID

1. Allez dans **"Identifiers"** > **"+"**
2. Sélectionnez **"Services IDs"** > **"Continue"**
3. Remplissez :
   - **Description** : Harmonie Web
   - **Identifier** : `com.harmonie.web` (c'est votre **APPLE_CLIENT_ID**)
4. Cochez **"Sign in with Apple"**
5. Cliquez sur **"Configure"** :
   - **Primary App ID** : Sélectionnez votre App ID créé
   - **Domains and Subdomains** : `votre-domaine.com`, `localhost`
   - **Return URLs** :
     - `http://localhost:3000/api/auth/callback/apple`
     - `https://votre-domaine.com/api/auth/callback/apple`
6. Cliquez sur **"Save"** puis **"Continue"** puis **"Register"**

### Étape 4 : Créer une clé privée

1. Allez dans **"Keys"** > **"+"**
2. Remplissez :
   - **Key Name** : Harmonie Sign in with Apple
3. Cochez **"Sign in with Apple"** > **"Configure"**
4. Sélectionnez votre **Primary App ID**
5. Cliquez sur **"Save"** puis **"Continue"** puis **"Register"**
6. **Téléchargez la clé** (vous ne pourrez le faire qu'une seule fois!)
7. Notez le **Key ID**

### Étape 5 : Générer le Client Secret

Le Client Secret Apple est un JWT que vous devez générer. Voici un script Node.js :

```javascript
// scripts/generate-apple-secret.js
const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync("./AuthKey_XXXXXXXXXX.p8");

const teamId = "VOTRE_TEAM_ID"; // Visible dans le coin supérieur droit de developer.apple.com
const keyId = "VOTRE_KEY_ID"; // Noté lors de la création de la clé
const clientId = "com.harmonie.web"; // Votre Services ID

const token = jwt.sign({}, privateKey, {
  algorithm: "ES256",
  expiresIn: "180d", // Maximum 6 mois
  audience: "https://appleid.apple.com",
  issuer: teamId,
  subject: clientId,
  keyid: keyId,
});

console.log("APPLE_CLIENT_SECRET=", token);
```

> ⚠️ Le secret Apple expire après 6 mois maximum. Vous devrez le régénérer périodiquement.

---

## ✅ Vérification

Une fois configuré, vous devriez voir les boutons Google et Apple sur la page de connexion :

1. Lancez l'application : `npm run dev`
2. Allez sur `/login`
3. Les boutons "Continuer avec Google" et "Continuer avec Apple" devraient être fonctionnels

---

## 🔧 Dépannage

### Erreur "redirect_uri_mismatch" (Google)

- Vérifiez que l'URI de redirection dans la console Google correspond exactement à celle de votre app
- Attention aux `/` finaux et au protocole (http vs https)

### Erreur "invalid_client" (Apple)

- Vérifiez que le Services ID est bien configuré
- Vérifiez que le Client Secret n'est pas expiré
- Vérifiez les domaines et URLs de redirection

### Boutons non visibles

- Vérifiez que les variables d'environnement sont bien définies
- Redémarrez le serveur de développement après modification du `.env`
