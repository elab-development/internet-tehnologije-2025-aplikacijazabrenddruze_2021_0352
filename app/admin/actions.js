'use server';

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'roottam1',
  database: process.env.DB_NAME || 'druze_shop'
};


 
export async function dodajAdminAction(formData) {
  const ime_prezime = formData.get('ime_prezime');
  const email = formData.get('email');
  const password = formData.get('password');
  const adresa = formData.get('adresa'); 
  const kontakt_telefon = formData.get('kontakt_telefon'); 

  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const connection = await mysql.createConnection(dbConfig);
  
  
  await connection.execute(
    'INSERT INTO users (ime_prezime, email, password, uloga, adresa, kontakt_telefon) VALUES (?, ?, ?, ?, ?, ?)',
    [ime_prezime, email, hashedPassword, 'admin', adresa, kontakt_telefon]
  );
  
  await connection.end();

  
  revalidatePath('/admin');
  redirect('/admin');
}


export async function obrisiAdminAction(formData) {
  const id = formData.get('id'); 

  const connection = await mysql.createConnection(dbConfig);
  await connection.execute('DELETE FROM users WHERE id = ?', [id]);
  await connection.end();
  
  
  revalidatePath('/admin');
}


export async function obrisiKorisnikaAction(formData) {
  const id = formData.get('id'); 

  const connection = await mysql.createConnection(dbConfig);
  
  await connection.execute('DELETE FROM users WHERE id = ?', [id]);
  await connection.end();
  
  revalidatePath('/admin/korisnici');
}


export async function promeniStatusPorudzbineAction(formData) {
  const id = formData.get('id');
  const noviStatus = formData.get('status');

  const connection = await mysql.createConnection(dbConfig);
  await connection.execute('UPDATE orders SET status = ? WHERE id = ?', [noviStatus, id]);
  await connection.end();
  
  revalidatePath('/admin/porudzbine');
}