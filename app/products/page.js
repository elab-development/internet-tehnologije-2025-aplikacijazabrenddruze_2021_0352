import { revalidatePath } from 'next/cache';
<<<<<<< HEAD
import Link from 'next/link';
import ClientProductsUI from './ClientProductsUI';

export default async function ProductsPage() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
=======
import ClientProductsUI from './ClientProductsUI'; 
import ProductCard from "../../components/ProductCard";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Inicijalizujemo našu Prismu (umesto njenog MySQL-a)
const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });

export default async function ProductsPage() {
  
<<<<<<< HEAD
  // 2. Povlačimo sve proizvode na Prisma način
  const products = await prisma.product.findMany();
=======
  const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'roottam1',
      database: process.env.DB_NAME || 'druze_shop'
    });
/*
const connection = await mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'roottam1',
  database : 'druze_shop'

});
*/
>>>>>>> be48da83e0b95e9193baf3b2927011bc939d04d0

  const [products] = await connection.execute('SELECT * FROM products');
  await connection.end();

<<<<<<< HEAD
  async function dodajProizvod(formData) {
    'use server';
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await connection.execute(
      'INSERT INTO products (naziv, opis, cena, lager, category_id) VALUES (?, ?, ?, ?, ?)',
      [
        formData.get('naziv'),
        formData.get('opis'),
        formData.get('cena'),
        formData.get('lager'),
        formData.get('category_id')
      ]
    );
    await connection.end();
=======
>>>>>>> 9cc19304360d5bcb8833b500e1fd59fe1f2260c3
  
  // Server Action za dodavanje (Prisma verzija)
  async function dodajProizvod(formData) {
    'use server';
    
    await prisma.product.create({
      data: {
        naziv: formData.get('naziv'),
        opis: formData.get('opis'),
        cena: parseFloat(formData.get('cena')), // Pretvaramo u broj
        lager: parseInt(formData.get('lager')), // Pretvaramo u broj
        category_id: parseInt(formData.get('category_id')),
      }
    });
    
>>>>>>> be48da83e0b95e9193baf3b2927011bc939d04d0
    revalidatePath('/products');
  }

  // Server Action za brisanje (Prisma verzija)
  async function obrisiProizvod(formData) {
    'use server';
<<<<<<< HEAD
    const id = formData.get('id');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    await connection.execute('DELETE FROM products WHERE id = ?', [id]);
    await connection.end();
=======
    const id = parseInt(formData.get('id'));
    
    await prisma.product.delete({
      where: { id: id }
    });
    
>>>>>>> be48da83e0b95e9193baf3b2927011bc939d04d0
    revalidatePath('/products');
  }

  return (
<<<<<<< HEAD
    <main className="min-h-screen bg-white p-8 md:p-16">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-black">
            BREND <span className="text-[var(--color-druze-roze)]">DRUŽE</span> - INVENTAR
          </h1>

          <Link
            href="/admin"
            className="px-6 py-3 border-4 border-black font-black text-[10px] uppercase tracking-widest bg-black text-white hover:bg-[var(--color-druze-roze)] hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            Upravljaj adminima
          </Link>
        </div>
=======
    <main className="min-h-screen bg-white">
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={{
              id: product.id,
              name: product.naziv,    
              price: product.cena,    
              category: product.opis, 
              image_url: product.slika_url || "/images/placeholder.jpg" 
            }} 
          />
        ))}
      </div>
>>>>>>> be48da83e0b95e9193baf3b2927011bc939d04d0

        <ClientProductsUI
          products={products}
          dodajAction={dodajProizvod}
          obrisiAction={obrisiProizvod}
        />

      </div>
    </main>
  );
}