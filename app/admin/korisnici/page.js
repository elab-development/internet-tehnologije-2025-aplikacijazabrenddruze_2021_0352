import mysql from 'mysql2/promise';
import Link from "next/link";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { obrisiKorisnikaAction } from '../actions'; 

export default async function KupciPanel() {
  const cookieStore = await cookies();
  const uloga = cookieStore.get('korisnik_uloga')?.value;

  
  if (uloga !== 'admin') {
    redirect('/');
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'roottam1',
    database: process.env.DB_NAME || 'druze_shop'
  });

  
  const [kupci] = await connection.execute('SELECT * FROM users WHERE uloga = "kupac"');
  await connection.end();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans py-12">
      <main className="w-full max-w-4xl flex-col items-start py-12 px-8 bg-white shadow-xl border-x border-zinc-100 relative">
        
        <div className="mb-10 border-b-4 border-black pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-black uppercase">
              Registrovani <span className="text-[#ff00ff]">Kupci</span>
            </h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">
              Upravljanje korisničkim nalozima baze
            </p>
          </div>
          <span className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_var(--color-druze-roze)]">
            Ukupno: {kupci.length}
          </span>
        </div>

        <div className="grid gap-4 w-full">
          {kupci.length === 0 ? (
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-center py-12 border-2 border-dashed border-zinc-200">
              Trenutno nema registrovanih kupaca.
            </p>
          ) : (
            kupci.map((kupac) => (
              <div key={kupac.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 border-2 border-zinc-100 hover:border-black transition-all bg-zinc-50 hover:bg-white gap-4 group">
                
                <div className="flex flex-col gap-1">
                  <p className="font-black text-lg text-black uppercase tracking-tight">{kupac.ime_prezime}</p>
                  <p className="text-sm font-bold text-zinc-500">{kupac.email}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    <span className="bg-zinc-100 px-2 py-1 text-black">📍 {kupac.adresa || 'Nema adrese'}</span>
                    <span className="bg-zinc-100 px-2 py-1 text-black">📞 {kupac.kontakt_telefon || 'Nema telefona'}</span>
                  </div>
                </div>
                
               
                <form action={obrisiKorisnikaAction} className="mt-4 md:mt-0">
                  <input type="hidden" name="id" value={kupac.id} />
                  <button type="submit" className="h-10 px-6 border-2 border-black text-black text-[10px] font-black uppercase hover:bg-red-500 hover:text-white hover:border-red-500 transition-all tracking-widest cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
                    Obriši
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