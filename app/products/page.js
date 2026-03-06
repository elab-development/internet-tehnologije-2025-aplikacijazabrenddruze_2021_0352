import mysql from 'mysql2/promise';
import { revalidatePath } from 'next/cache';
import ClientProductsUI from './ClientProductsUI'; 

export default async function ProductsPage() {
  
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'roottam1',
    database: 'druze_shop'
  });

  const [products] = await connection.execute('SELECT * FROM products');
  await connection.end();

  
  async function dodajProizvod(formData) {
    'use server';
    const connection = await mysql.createConnection({
      host: 'localhost', 
      user: 'root', 
      password: 'roottam1', 
      database: 'druze_shop'
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
      host: 'localhost', 
      user: 'root', 
      password: 'roottam1', 
      database: 'druze_shop'
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