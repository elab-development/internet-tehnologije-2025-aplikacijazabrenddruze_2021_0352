import mysql from 'mysql2/promise';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import ClientProductsUI from './ClientProductsUI';

export default async function ProductsPage() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [products] = await connection.execute('SELECT * FROM products');
  await connection.end();

  async function dodajProizvod(formData) {
    'use server';
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await connection.execute(
      'INSERT INTO products (naziv, opis, cena, lager, category_id) VALUES (?, ?, ?, ?, ?)',
      [
        formData.get('naziv'),
        formData.get('opis'),
        formData.get('cena'),
        formData.get('lager'),
        formData.get('category_id')
      ]
    );
    await connection.end();
    revalidatePath('/products');
  }

  async function obrisiProizvod(formData) {
    'use server';
    const id = formData.get('id');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    await connection.execute('DELETE FROM products WHERE id = ?', [id]);
    await connection.end();
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