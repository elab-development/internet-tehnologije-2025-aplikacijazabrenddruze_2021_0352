import { cookies } from 'next/headers';
import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('korisnik_id')?.value;

  if (!userId) return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [rows] = await connection.execute(
      'SELECT ime_prezime, email, adresa, kontakt_telefon FROM users WHERE id = ?', 
      [userId]
    );
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Greška sa bazom" }, { status: 500 });
  } finally {
    await connection.end();
  }
}