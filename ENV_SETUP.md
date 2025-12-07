# Configuration Environnement - Harmonie

## Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Neon PostgreSQL
# Récupérez cette URL depuis le dashboard Neon (https://neon.tech)
DATABASE_URL="postgresql://user:password@ep-xxx.region.neon.tech/harmonie?sslmode=require"

# Better Auth
# Générez une clé secrète d'au moins 32 caractères
# Vous pouvez utiliser: openssl rand -base64 32
BETTER_AUTH_SECRET="votre-cle-secrete-de-32-caracteres-minimum"
BETTER_AUTH_URL="http://localhost:3000"
```

## Configuration Neon

1. Créez un compte sur [Neon](https://neon.tech)
2. Créez un nouveau projet
3. Copiez la chaîne de connexion PostgreSQL
4. Collez-la dans `DATABASE_URL`

## Génération de la clé secrète

```bash
# Sur Linux/Mac
openssl rand -base64 32

# Ou utilisez un générateur en ligne sécurisé
```
