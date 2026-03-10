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

export default async function AdminPanel() {
  const cookieStore = await cookies();
  const uloga = cookieStore.get('user_role')?.value;

  if (uloga !== 'admin') {
    redirect('/products');
  }

  const users = await prisma.user.findMany({
    where: { uloga: 'admin' }
  });

  async function obrisiAdminAction(formData) {
    'use server';
    const id = parseInt(formData.get('id'));
    
    await prisma.user.delete({
      where: { id: id }
    });
    
    revalidatePath('/admin');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-start py-20 px-12 bg-white shadow-xl border-x border-zinc-100">
        
        <div className="flex flex-col gap-4 w-full border-b pb-8 border-zinc-100">
          <h1 className="text-4xl font-black tracking-tighter text-black uppercase">
            Admin <span className="text-[var(--color-druze-roze)]">Panel</span>
          </h1>
          <p className="text-lg text-zinc-500 font-medium">
            Upravljanje administratorima i bazom
          </p>
        </div>

        <div className="mt-12 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-800">
              Aktivni Administratori
            </h2>
            <span className="bg-zinc-100 px-3 py-1 rounded-full text-xs font-bold text-zinc-500 uppercase tracking-widest">
              {users.length} Ukupno
            </span>
          </div>

          <div className="grid gap-3 w-full">
            {users.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-5 border border-zinc-100 rounded-2xl bg-zinc-50/50 hover:bg-white transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-600 uppercase">
                    {user.ime_prezime ? user.ime_prezime[0] : '?'}
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{user.ime_prezime}</p>
                    <p className="text-xs text-zinc-400 italic font-mono uppercase">ID: #{user.id}</p>
                  </div>
                </div>
                
                <form action={obrisiAdminAction}>
                  <input type="hidden" name="id" value={user.id} />
                  <button type="submit" className="px-4 py-2 border-2 border-black text-black text-[10px] font-black uppercase hover:bg-red-500 hover:text-white hover:border-red-500 transition-all tracking-widest cursor-pointer">
                    Ukloni
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          <Link 
            href="/admin/dodaj"
            className="h-14 bg-black text-white font-black text-xs uppercase tracking-widest flex items-center justify-center hover:bg-[var(--color-druze-roze)] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            Novi Admin
          </Link>
          <Link 
            href="/admin/korisnici"
            className="h-14 bg-white border-2 border-black text-black font-black text-xs uppercase tracking-widest flex items-center justify-center hover:bg-zinc-100 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            Kupci
          </Link>
          <Link 
            href="/admin/porudzbine"
            className="h-14 bg-white border-2 border-black text-black font-black text-xs uppercase tracking-widest flex items-center justify-center hover:bg-zinc-100 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            Porudžbine
          </Link>
          <Link 
            href="/admin/analitika"
            className="h-14 bg-white border-2 border-black text-[var(--color-druze-roze)] font-black text-xs uppercase tracking-widest flex items-center justify-center hover:bg-zinc-100 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            Analitika
          </Link>
          <Link 
            href="/" 
            className="h-14 border-2 border-zinc-300 font-black text-xs text-zinc-500 transition-colors flex items-center justify-center uppercase tracking-widest hover:border-black hover:text-black lg:col-span-2"
          >
            Nazad na Shop
          </Link>
        </div>
        
      </main>
    </div>
  );
}