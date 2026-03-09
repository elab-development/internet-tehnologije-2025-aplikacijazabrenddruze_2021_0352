import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import Link from 'next/link';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function SingleProductPage({ params }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const product = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!product) {
    return <div className="p-10 text-center">Proizvod nije pronađen.</div>;
  }

  const cena = Number(product.cena);

  return (
    <main className="min-h-screen bg-white p-10">
      <Link href="/products" className="text-zinc-400 hover:text-black mb-10 inline-block">
        ← Nazad na sve proizvode
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        <div className="bg-zinc-100 aspect-square rounded-2xl flex items-center justify-center overflow-hidden">
           <img 
            src={product.slika_url || "/images/placeholder.jpg"} 
            alt={product.naziv}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-black uppercase mb-4">{product.naziv}</h1>
          <p className="text-2xl font-bold text-[var(--color-druze-roze)] mb-6">{cena} RSD</p>
          <p className="text-zinc-600 text-lg leading-relaxed mb-8">
            {product.opis}
          </p>
          <div className="border-t border-zinc-200 pt-6">
            <p className="text-sm text-zinc-400 uppercase font-bold">Na stanju:</p>
            <p className="text-xl">{product.lager} komada</p>
          </div>
        </div>
      </div>
    </main>
  );
}