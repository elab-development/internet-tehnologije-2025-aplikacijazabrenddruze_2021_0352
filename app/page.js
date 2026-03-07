import Image from "next/image";
import mysql from 'mysql2/promise';
import Link from "next/link";

export default async function Home() {
  const connection = await mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : "",
    database : 'druze_shop'


  });

  const [users] = await connection.execute('SELECT * FROM users');

  await connection.end();
  return (
  <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    
    <main className="flex min-h-screen w-full max-w-3xl flex-col items-start py-20 px-12 bg-white dark:bg-zinc-900 shadow-xl border-x border-zinc-100 dark:border-zinc-800">
      
      
      <div className="flex flex-col gap-4 w-full border-b pb-8 border-zinc-100 dark:border-zinc-800">
        <h1 className="text-4xl font-black tracking-tighter text-black dark:text-zinc-50 uppercase">
          Brend <span className="text-druze-roze">Druže</span>
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
          Admin Panel — Upravljanje bazom podataka
        </p>
      </div>

      
      <div className="mt-12 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
            Aktivni Administratori
          </h2>
          <span className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {users.length} Ukupno
          </span>
        </div>

        <div className="grid gap-3 w-full">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="group flex items-center justify-between p-5 border border-zinc-100 rounded-2xl bg-zinc-50/50 hover:bg-white hover:shadow-md transition-all dark:bg-zinc-800/50 dark:border-zinc-700"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-400">
                  {user.ime_prezime[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">
                    {user.ime_prezime}
                  </p>
                  <p className="text-xs text-zinc-400 italic font-mono">ID: #{user.id}</p>
                </div>
              </div>
              <button className="text-xs font-bold text-zinc-400 hover:text-red-500 transition-colors uppercase tracking-tight">
                Ukloni
              </button>
            </div>
          ))}
        </div>
      </div>

    
      <div className="mt-16 flex flex-col gap-4 w-full sm:flex-row">
        <button className="h-14 flex-1 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
          DODAJ NOVOG ADMINA +
        </button>
        <Link 
    href="/products" 
    className="h-14 flex-1 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 font-bold text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 transition-colors flex items-center justify-center uppercase tracking-widest"
  >
    VIDI PROIZVODE 
  </Link>
</div>

    </main>
  </div>
);
}
