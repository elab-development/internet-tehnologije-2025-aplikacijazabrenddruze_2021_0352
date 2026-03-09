import { revalidatePath } from 'next/cache';
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

  const [products] = await connection.execute('SELECT * FROM products');
  await connection.end();

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
    
    revalidatePath('/products');
  }

  // Server Action za brisanje (Prisma verzija)
  async function obrisiProizvod(formData) {
    'use server';
    const id = parseInt(formData.get('id'));
    
    await prisma.product.delete({
      where: { id: id }
    });
    
    revalidatePath('/products');
  }

  return (
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

      <div className="p-8 border-t border-zinc-200 mt-10">
        <h2 className="text-sm font-bold uppercase mb-4 text-zinc-400 italic">Administracija:</h2>
        <ClientProductsUI 
          products={products} 
          dodajAction={dodajProizvod} 
          obrisiAction={obrisiProizvod} 
        />
      </div>
    </main>
  );
}