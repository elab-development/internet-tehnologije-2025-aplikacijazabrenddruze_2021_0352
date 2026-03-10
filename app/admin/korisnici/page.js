import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import Link from "next/link";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function KupciPanel() {
  const cookieStore = await cookies();
  const uloga = cookieStore.get('user_role')?.value;

  if (uloga !== 'admin') {
    redirect('/');
  }

  const kupci = await prisma.user.findMany({
    where: { uloga: 'kupac' }
  });

  async function obrisiKorisnikaAction(formData) {
    'use server';
    const id = parseInt(formData.get('id'));
    await prisma.user.delete({ where: { id: id } });
    revalidatePath('/admin/korisnici');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans py-12">
      <main className="w-full max-w-4xl flex-col items-start py-12 px-8 bg-white shadow-xl border-x border-zinc-100 relative">
        <div className="mb-10 border-b-4 border-black pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-black uppercase">
              Registrovani <span className="text-[#ff00ff]">Kupci</span>
            </h1>
          </div>
          <span className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--color-druze-roze)]">
            Ukupno: {kupci.length}
          </span>
        </div>

        <div className="grid gap-4 w-full">
          {kupci.map((kupac) => (
            <div key={kupac.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 border-2 border-zinc-100 hover:border-black transition-all bg-zinc-50 hover:bg-white gap-4">
              <div className="flex flex-col gap-1">
                <p className="font-black text-lg text-black uppercase tracking-tight">{kupac.ime_prezime}</p>
                <p className="text-sm font-bold text-zinc-500">{kupac.email}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <span className="bg-zinc-100 px-2 py-1 text-black">📍 {kupac.adresa || 'Nema adrese'}</span>
                  <span className="bg-zinc-100 px-2 py-1 text-black">📞 {kupac.kontakt_telefon || 'Nema telefona'}</span>
                </div>
              </div>
              
              <form action={obrisiKorisnikaAction}>
                <input type="hidden" name="id" value={kupac.id} />
                <button type="submit" className="h-10 px-6 border-2 border-black text-black text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none">
                  Obriši
                </button>
              </form>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 flex justify-center">
          <Link href="/admin" className="text-sm font-bold text-zinc-500 hover:text-black uppercase tracking-widest">
            ← Nazad na Admin Panel
          </Link>
        </div>
      </main>
    </div>
  );
}