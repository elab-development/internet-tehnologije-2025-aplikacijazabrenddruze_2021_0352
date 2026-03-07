import mysql from 'mysql2/promise';
import { revalidatePath } from 'next/cache';
import ClientProductsUI from './ClientProductsUI'; 
import ProductCard from "../..//components/ProductCard";

export default async function ProductsPage() {
  
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'druze_shop'
  });

  const [products] = await connection.execute('SELECT * FROM products');
  await connection.end();

  
  async function dodajProizvod(formData) {
    'use server';
    const connection = await mysql.createConnection({
      host: 'localhost', 
      user: 'root', 
      password: "", 
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
      password: "", 
      database: 'druze_shop'
    });
    await connection.execute('DELETE FROM products WHERE id = ?', [id]);
    await connection.end();
    revalidatePath('/products');
  }

  
  return (
    <main className="min-h-screen bg-white">
           


      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={{
              id: product.id,
              name: product.naziv,    
              price: product.cena,    
              category: product.opis, 
              image_url: product.slika_url || "/images/placeholder.jpg" 
            }} 
          />
        ))}
      </div>

      <div className="p-8 border-t border-zinc-200 mt-10">
        <h2 className="text-sm font-bold uppercase mb-4 text-zinc-400 italic">Administracija (Mirov deo):</h2>
        <ClientProductsUI 
          products={products} 
          dodajAction={dodajProizvod} 
          obrisiAction={obrisiProizvod} 
        />
      </div>
    </main>
  );
}