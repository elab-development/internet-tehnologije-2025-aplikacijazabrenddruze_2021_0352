import mysql from 'mysql2/promise';
import { revalidatePath } from 'next/cache';
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
    <ClientProductsUI 
      products={products} 
      dodajAction={dodajProizvod} 
      obrisiAction={obrisiProizvod} 
    />
  );
}