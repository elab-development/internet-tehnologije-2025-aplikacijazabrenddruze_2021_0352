import mysql from 'mysql2/promise';
import Link from "next/link";

export default async function Home() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [proizvodi] = await connection.execute('SELECT * FROM products');
  await connection.end();

  return (
    <main className="min-h-screen bg-white p-8 md:p-16 text-black">
      <div className="max-w-7xl mx-auto">

        <div className="mb-16">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            <span className="text-[var(--color-druze-roze)]">Druže</span> <br />
            Kolekcija 2026
          </h1>
          <div className="h-2 w-32 bg-black mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {proizvodi.map((proizvod) => (
            <Link href={`/products/${proizvod.id}`} key={proizvod.id} className="group">
              <div className="w-full aspect-[3/4] border-2 border-black overflow-hidden relative bg-zinc-50 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[10px_10px_0px_0px_var(--color-druze-roze)] transition-all duration-300">
                <img
                  src={proizvod.slika_url || "/images/placeholder.jpg"}
                  alt={proizvod.naziv}
                  className="w-full h-full object-cover transition-transform duration-500"
                />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10">
                  <div className="bg-white border-2 border-black px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Vidi detalje
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}