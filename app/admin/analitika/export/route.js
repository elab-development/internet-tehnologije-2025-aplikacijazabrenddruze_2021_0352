import mysql from 'mysql2/promise';

export async function GET() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'roottam1',
    database: process.env.DB_NAME || 'druze_shop'
  });

  
  const [proizvodi] = await connection.execute(`
    SELECT p.naziv, p.cena, COALESCE(SUM(oi.kolicina), 0) as prodato
    FROM products p
    LEFT JOIN order_items oi ON p.id = oi.product_id
    GROUP BY p.id
    ORDER BY prodato DESC
  `);
  await connection.end();

  
  let csv = 'Naziv Proizvoda,Cena (RSD),Prodato Komada\n';
  proizvodi.forEach(p => {
    csv += `"${p.naziv}",${p.cena},${p.prodato}\n`;
  });

  
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="druze_poslovni_izvestaj.csv"',
    },
  });
}