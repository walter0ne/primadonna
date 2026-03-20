const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin
  const hashedPassword = await bcrypt.hash('Primadonna2024!', 12);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@primadonna.it' },
    update: {},
    create: {
      email: 'admin@primadonna.it',
      password: hashedPassword,
      name: 'Admin Primadonna',
    },
  });
  console.log('Admin created:', admin.email);

  // Services
  const services = [
    { name: 'Taglio Donna',           duration: 45,  price: 30.00, sortOrder: 1, description: 'Taglio personalizzato per capelli donna' },
    { name: 'Taglio Uomo',            duration: 30,  price: 20.00, sortOrder: 2, description: 'Taglio classico o moderno per uomo' },
    { name: 'Piega',                  duration: 30,  price: 25.00, sortOrder: 3, description: 'Piega professionale con phon e spazzola' },
    { name: 'Colore',                 duration: 90,  price: 55.00, sortOrder: 4, description: 'Colorazione completa con prodotti di qualità' },
    { name: 'Colpi di Sole',          duration: 120, price: 75.00, sortOrder: 5, description: 'Schiariture e colpi di luce naturali' },
    { name: 'Trattamento Cheratina',  duration: 60,  price: 45.00, sortOrder: 6, description: 'Trattamento lisciante e nutriente' },
    { name: 'Taglio + Piega Donna',   duration: 60,  price: 45.00, sortOrder: 7, description: 'Taglio e piega in unico servizio' },
    { name: 'Barba',                  duration: 20,  price: 12.00, sortOrder: 8, description: 'Rifinitura e modellatura barba' },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: `seed-${service.sortOrder}` },
      update: {},
      create: { id: `seed-${service.sortOrder}`, ...service },
    });
  }
  console.log(`${services.length} services created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
