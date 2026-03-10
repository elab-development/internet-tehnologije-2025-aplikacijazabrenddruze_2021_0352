import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import Link from "next/link";
import { revalidatePath } from 'next/cache';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function PorudzbinePanel() {
  
  const porudzbine = await prisma.order.findMany({
    include: {
      user: true
    },
    orderBy: {
      datum: 'desc'
    }
  });

  async function promeniStatusPorudzbineAction(formData) {
    'use server';
    const id = parseInt(formData.get('id'));
    const noviStatus = formData.get('status');

    try {
      const porudzbina = await prisma.order.findUnique({
        where: { id: id },
        include: { order_items: true }
      });

      if (!porudzbina) return;

      if (noviStatus === 'poslato' && porudzbina.status !== 'poslato') {
        await prisma.$transaction([
          prisma.order.update({
            where: { id: id },
            data: { status: 'poslato' }
          }),
          ...porudzbina.order_items.map((stavka) => 
            prisma.product.update({
              where: { id: stavka.product_id },
              data: {
                lager: { decrement: stavka.kolicina }
              }
            })
          )
        ]);
      } else {
        await prisma.order.update({
          where: { id: id },
          data: { status: noviStatus }
        });
      }

      revalidatePath('/admin/porudzbine'); 
    } catch (error) {
      console.error(" GREŠKA U ADMIN PANELU:", error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans py-12">
      <main className="w-full max-w-5xl flex-col items-start py-12 px-8 bg-white shadow-xl border-x border-zinc-100 relative">
        
        <div className="mb-10 border-b-4 border-black pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-black uppercase">
              Sve <span className="text-[var(--color-druze-roze)]">Porudžbine</span>
            </h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">
              Upravljanje statusima i pregled narudžbina
            </p>
          </div>
          <span className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--color-druze-roze)]">
            Ukupno: {porudzbine.length}
          </span>
        </div>

        <div className="grid gap-6 w-full">
          {porudzbine.length === 0 ? (
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-center py-12 border-2 border-dashed border-zinc-200">
              Trenutno nema aktivnih porudžbina.
            </p>
          ) : (
            porudzbine.map((porudzbina) => (
              <div key={porudzbina.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 border-2 border-black bg-zinc-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all gap-6">
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-black text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest">
                      #{porudzbina.id}
                    </span>
                    <p className="font-black text-lg text-black uppercase tracking-tight">
                      {Number(porudzbina.ukupna_cena)} RSD
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-bold text-sm text-zinc-800 uppercase">{porudzbina.user?.ime_prezime || 'Nepoznat korisnik'}</p>
                    <p className="text-xs font-bold text-zinc-500">📍 {porudzbina.user?.adresa || 'Nema adrese'}</p>
                    <p className="text-xs font-bold text-zinc-500">📞 {porudzbina.user?.kontakt_telefon || 'Nema telefona'}</p>
                  </div>
                </div>
                
                <form action={promeniStatusPorudzbineAction} className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 items-center">
                  <input type="hidden" name="id" value={porudzbina.id} />
                  
                  <select 
                    name="status" 
                    defaultValue={porudzbina.status} 
                    className="h-10 px-4 border-2 border-black text-xs font-bold uppercase outline-none focus:border-[var(--color-druze-roze)] bg-white cursor-pointer"
                  >
                    <option value="na obradi">Na obradi</option>
                    <option value="poslato">Poslato</option>
                    <option value="isporučeno">Isporučeno</option>
                    <option value="otkazano">Otkazano</option>
                  </select>

                  <button type="submit" className="h-10 px-6 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-druze-roze)] transition-colors cursor-pointer w-full sm:w-auto">
                    Ažuriraj
                  </button>
                </form>

              </div>
            ))
          )}
        </div>

        <div className="mt-12 pt-6 flex justify-center">
          <Link href="/admin" className="text-sm font-bold text-zinc-500 hover:text-black uppercase tracking-widest transition-colors">
            ← Nazad na Admin Panel
          </Link>
        </div>

      </main>
    </div>
  );
}