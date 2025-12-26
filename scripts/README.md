# Scripts utilitaires

## Définir un utilisateur comme administrateur

Pour définir votre compte (ou celui d'un autre utilisateur) comme administrateur, utilisez l'un des scripts suivants :

### Méthode 1 : Script npm (recommandé)

```bash
npm run set-admin votre-email@example.com
```

### Méthode 2 : Script JavaScript direct

```bash
node scripts/set-admin.js votre-email@example.com
```

### Méthode 3 : Script TypeScript (si tsx est installé)

```bash
npx tsx scripts/set-admin.ts votre-email@example.com
```

## Étapes

1. **Créez d'abord un compte** en vous inscrivant sur `/login`
2. **Exécutez le script** avec votre email
3. **Reconnectez-vous** - vous aurez maintenant accès au dashboard admin

## Exemple

```bash
# 1. Inscrivez-vous sur http://localhost:3000/login avec votre email
# 2. Exécutez :
npm run set-admin mon-email@example.com

# 3. Reconnectez-vous - vous serez redirigé vers /dashboard
```

## Autres méthodes

### Via Prisma Studio

1. Lancez Prisma Studio : `npx prisma studio`
2. Ouvrez la table `User`
3. Trouvez votre utilisateur par email
4. Modifiez le champ `role` et mettez `ADMIN`
5. Sauvegardez

### Via SQL direct

Si vous avez accès à votre base de données PostgreSQL :

```sql
UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'votre-email@example.com';
```
