import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import ClientProductsUI from './ClientProductsUI'; 
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
    cena: Number(p.cena),
    slika_url: p.slika_url || "/images/placeholder.jpg" 
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
        slika_url: formData.get('slika_url') || "/images/placeholder.jpg"
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

        <ClientProductsUI
          products={products}
          dodajAction={dodajProizvod}
          obrisiAction={obrisiProizvod}
        />

      </div>
    </main>
  );
}