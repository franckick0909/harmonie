/**
 * Script pour nettoyer les utilisateurs de la base de données
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function cleanUsers() {
  try {
    console.log("🧹 Nettoyage des utilisateurs...\n");

    // Supprimer toutes les sessions
    const deletedSessions = await prisma.session.deleteMany({});
    console.log(`✓ ${deletedSessions.count} session(s) supprimée(s)`);

    // Supprimer tous les comptes (accounts)
    const deletedAccounts = await prisma.account.deleteMany({});
    console.log(`✓ ${deletedAccounts.count} compte(s) supprimé(s)`);

    // Supprimer toutes les vérifications
    const deletedVerifications = await prisma.verification.deleteMany({});
    console.log(`✓ ${deletedVerifications.count} vérification(s) supprimée(s)`);

    // Supprimer tous les utilisateurs
    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`✓ ${deletedUsers.count} utilisateur(s) supprimé(s)`);

    console.log("\n✅ Nettoyage terminé !");
    console.log("\n📝 Vous pouvez maintenant vous réinscrire sur /login");
    console.log(
      "💡 N'oubliez pas d'exécuter 'npm run set-admin votre-email@example.com' après inscription pour devenir admin."
    );
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage :", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanUsers();
