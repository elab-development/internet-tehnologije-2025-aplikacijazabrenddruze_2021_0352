import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import Link from "next/link";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function AnalitikaPanel() {
  const stats = await prisma.order.aggregate({
    where: { NOT: { status: 'otkazano' } },
    _sum: { ukupna_cena: true },
    _count: { id: true }
  });

  const ukupanPrihod = stats._sum.ukupna_cena || 0;
  const brojPorudzbina = stats._count.id || 0;

  const proizvodiRaw = await prisma.product.findMany({
    include: {
      order_items: true
    }
  });

  const proizvodi = proizvodiRaw.map(p => ({
    naziv: p.naziv,
    prodato: p.order_items.reduce((acc, item) => acc + item.kolicina, 0)
  })).sort((a, b) => b.prodato - a.prodato).slice(0, 5);

  const maxProdato = Math.max(...proizvodi.map(p => p.prodato), 1);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans py-12">
      <main className="w-full max-w-5xl flex-col items-start py-12 px-8 bg-white shadow-xl border-x border-zinc-100 relative">
        <div className="mb-10 border-b-4 border-black pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-black uppercase">
              Biznis <span className="text-[var(--color-druze-roze)]">Analitika</span>
            </h1>
          </div>
          <a href="/admin/analitika/export" className="bg-black text-white px-6 py-3 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--color-druze-roze)] hover:bg-[var(--color-druze-roze)] transition-all">
            ↓ Preuzmi Izveštaj (CSV)
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="border-4 border-black p-8 bg-zinc-50 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-bold uppercase text-zinc-500 mb-2">Ukupan Prihod</p>
            <p className="text-5xl font-black text-[var(--color-druze-roze)]">{Number(ukupanPrihod)} <span className="text-2xl text-black">RSD</span></p>
          </div>
          <div className="border-4 border-black p-8 bg-zinc-50 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xs font-bold uppercase text-zinc-500 mb-2">Uspešne Porudžbine</p>
            <p className="text-5xl font-black text-black">{brojPorudzbina}</p>
          </div>
        </div>

        <div className="w-full border-2 border-zinc-100 p-8">
          <h2 className="text-xl font-bold uppercase mb-8">Top 5 Proizvoda</h2>
          <div className="flex flex-col gap-6">
            {proizvodi.map((proizvod, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold uppercase text-zinc-600">
                  <span>{proizvod.naziv}</span>
                  <span>{proizvod.prodato} komada</span>
                </div>
                <div className="w-full h-6 bg-zinc-100 relative">
                  <div className="absolute top-0 left-0 h-full bg-black transition-all duration-1000" style={{ width: `${(proizvod.prodato / maxProdato) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}