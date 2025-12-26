/**
 * Script utilitaire pour définir un utilisateur comme administrateur (version JavaScript)
 *
 * Usage:
 *   node scripts/set-admin.js votre-email@example.com
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function setAdmin(email) {
  try {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ Utilisateur avec l'email "${email}" non trouvé.`);
      console.log(
        "\n💡 Assurez-vous d'avoir créé un compte en vous inscrivant d'abord."
      );
      process.exit(1);
    }

    // Mettre à jour le rôle
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    console.log("✅ Rôle administrateur défini avec succès !");
    console.log("\n📋 Détails de l'utilisateur :");
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Nom: ${updatedUser.name || "Non défini"}`);
    console.log(`   Rôle: ${updatedUser.role}`);
    console.log(`   ID: ${updatedUser.id}`);
    console.log(
      "\n🔐 Vous pouvez maintenant vous connecter et accéder au dashboard admin."
    );
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour :", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Récupérer l'email depuis les arguments de ligne de commande
const email = process.argv[2];

if (!email) {
  console.error("❌ Veuillez fournir un email.");
  console.log("\nUsage:");
  console.log("  node scripts/set-admin.js votre-email@example.com");
  process.exit(1);
}

// Valider le format de l'email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error(`❌ Format d'email invalide: "${email}"`);
  process.exit(1);
}

setAdmin(email);
