'use server';

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const dbConfig = {
  host : 'localhost',
  user : 'root',
  password : 'roottam1',
  database : 'druze_shop'
};


// --- FUNKCIJA ZA REGISTRACIJU ---
export async function registrujKorisnika(formData) {
  const ime_prezime = formData.get('ime_prezime');
  const email = formData.get('email');
  const password = formData.get('password');
  const adresa = formData.get('adresa');
  const kontakt_telefon = formData.get('kontakt_telefon');


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const connection = await mysql.createConnection(dbConfig);

  try {


    await connection.execute(
      'INSERT INTO users (ime_prezime, email, password, uloga, adresa, kontakt_telefon) VALUES (?, ?, ?, ?, ?, ?)',
      [ime_prezime, email, hashedPassword, 'kupac', adresa, kontakt_telefon]
    );
  } catch (error) {
    console.error("Greška pri registraciji:", error);
  } finally {
    await connection.end();
  }

  redirect('/login');
}


export async function ulogujKorisnika(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const connection = await mysql.createConnection(dbConfig);


  let ulogaKorisnika = '';

  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      console.log("Korisnik sa ovim emailom ne postoji!");
      return;
    }

    const korisnik = rows[0];
    const isPasswordValid = await bcrypt.compare(password, korisnik.password);

    if (!isPasswordValid) {
      console.log("Pogrešna šifra!");
      return;
    }

    ulogaKorisnika = korisnik.uloga;

    const cookieStore = await cookies();
    cookieStore.set('korisnik_id', korisnik.id, { httpOnly: true, secure: true });
    cookieStore.set('korisnik_uloga', korisnik.uloga, { httpOnly: true, secure: true });
    cookieStore.set('isLoggedIn', 'true', { httpOnly: false, secure: true, maxAge: 60 * 60 * 24 });
  } catch (error) {
    console.error("Greška pri logovanju:", error);
    return;
  } finally {
    await connection.end();
  }


  if (ulogaKorisnika === 'admin') {
    redirect('/'); 
  } else {
    redirect('/products'); 
  }
}