const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL || "postgresql://admin:adminpassword@localhost:5432/brend_druze?schema=public" 
});

const prisma = new PrismaClient({ adapter });

async function main() {

  const katCegeri = await prisma.category.create({ data: { naziv: 'Cegeri' } });
  const katMajice = await prisma.category.create({ data: { naziv: 'Majice' } });

  await prisma.user.createMany({
    data: [
      { ime_prezime: 'Tamara Drca', email: 'tamara@druze.rs', password: 'sifra123', uloga: 'admin', adresa: 'Beogradska 1', kontakt_telefon: '060123456' },
      { ime_prezime: 'Anastasija Knezevic', email: 'anastasija@druze.rs', password: 'sifra123', uloga: 'admin', adresa: 'Beogradska 2', kontakt_telefon: '060123457' },
      { ime_prezime: 'Miro Rakocevic', email: 'miro@druze.rs', password: 'sifra123', uloga: 'admin', adresa: 'Beogradska 3', kontakt_telefon: '060123458' }
    ]
  });

  await prisma.product.createMany({
    data: [
      { naziv: 'Ceger "Brend Druze" - Klasik', opis: 'Ekološki pamučni ceger sa logoom.', cena: 1200.00, slika_url: '/images/cegerDruze.jpg', lager: 50, category_id: katCegeri.id },
      { naziv: 'Ceger "Umetnost na ramenu"', opis: 'Specijalna edicija sa ilustracijom.', cena: 1500.00, slika_url: '/images/dizvinesCeger.jpg', lager: 30, category_id: katCegeri.id },
      { naziv: 'Majica "Druze" Bela', opis: 'Kvalitetna 100% pamučna majica.', cena: 1800.00, slika_url: '/images/sveMajice.jpg', lager: 20, category_id: katMajice.id },
      { naziv: 'Majica "Druze" Crna', opis: 'Oversized model sa printom.', cena: 2200.00, slika_url: '/images/druyeFront.jpg', lager: 15, category_id: katMajice.id }
    ]
  });

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });