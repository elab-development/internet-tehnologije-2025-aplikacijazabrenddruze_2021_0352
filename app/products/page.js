import { revalidatePath } from 'next/cache';
import ClientProductsUI from './ClientProductsUI'; 
import ProductCard from "../../components/ProductCard";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function ProductsPage() {
  
  const rawProducts = await prisma.product.findMany();

  const products = rawProducts.map(p => ({
    ...p,
    cena: Number(p.cena) 
  }));
  
  async function dodajProizvod(formData) {
    'use server';
    await prisma.product.create({
      data: {
        naziv: formData.get('naziv'),
        opis: formData.get('opis'),
        cena: parseFloat(formData.get('cena')), 
        lager: parseInt(formData.get('lager')), 
        category_id: parseInt(formData.get('category_id')),
      }
    });
    revalidatePath('/products');
  }

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