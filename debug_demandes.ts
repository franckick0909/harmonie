import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const demandes = await prisma.demande.findMany({
    include: {
      patient: true,
      ordonnance: true,
    },
  });
  console.log(JSON.stringify(demandes, null, 2));
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
