'use server';
import mysql from 'mysql2/promise';
import { revalidatePath } from 'next/cache';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

export async function dodajAdminAction(formData) {
  const ime = formData.get('ime_prezime');
  const connection = await mysql.createConnection(dbConfig);
  await connection.execute('INSERT INTO users (ime_prezime) VALUES (?)', [ime]);
  await connection.end();
  revalidatePath('/admin');
}

export async function obrisiAdminAction(id) {
  const connection = await mysql.createConnection(dbConfig);
  await connection.execute('DELETE FROM users WHERE id = ?', [id]);
  await connection.end();
  revalidatePath('/admin');
}