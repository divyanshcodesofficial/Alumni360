const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const deleted = await prisma.user.deleteMany({
    where: { role: { in: ['faculty', 'institution'] } }
  });
  console.log(`Deleted ${deleted.count} old users`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
