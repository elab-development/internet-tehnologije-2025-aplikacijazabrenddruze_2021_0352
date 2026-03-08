import mysql from 'mysql2/promise';
import AdminUI from './AdminUI';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
 /*
 const connection = await mysql.createConnection({
   host : 'localhost',
   user : 'root',
   password : 'roottam1',
   database : 'druze_shop'
 
 });
 */

  const [users] = await connection.execute('SELECT * FROM users');
  await connection.end();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <AdminUI users={users} />
    </div>
  );
}