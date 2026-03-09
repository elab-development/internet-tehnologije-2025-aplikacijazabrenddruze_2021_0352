import mysql from 'mysql2/promise';
import Link from "next/link";

export default async function Home() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'roottam1',
    database: process.env.DB_NAME || 'druze_shop'
  });
  const [proizvodi] = await connection.execute('SELECT * FROM products');
  await connection.end();

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
       <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            <span className="text-[var(--color-druze-roze)]">Druže</span> <br />
            Kolekcija 2026
          </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {proizvodi.map((proizvod) => (
            <Link href={`/products/${proizvod.id}`} key={proizvod.id} className="group">
              <div className="aspect-[3/4] border-2 border-black overflow-hidden relative bg-zinc-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(255,0,255,1)] transition-all">
                <img 
                  src={proizvod.slika_url || "/images/placeholder.jpg"} 
                  alt={proizvod.naziv}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="mt-4 flex justify-between items-start font-black uppercase italic">
                <div>
                  <h3 className="text-lg leading-none">{proizvod.naziv}</h3>
                  <p className="text-zinc-400 text-xs mt-1">{proizvod.kategorija}</p>
                </div>
                <p className="text-lg">{proizvod.cena} RSD</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}