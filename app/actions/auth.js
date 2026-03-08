'use server';

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

/*
// Tvoja lokalna konekcija za Sequel Ace
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'roottam1',
  database: 'druze_shop'
};
*/
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};


// --- FUNKCIJA ZA REGISTRACIJU ---
export async function registrujKorisnika(formData) {
  const ime_prezime = formData.get('ime_prezime');
  const email = formData.get('email');
  const password = formData.get('password');
  const adresa = formData.get('adresa'); 
  const kontakt_telefon = formData.get('kontakt_telefon'); 

  // Kriptovanje lozinke
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const connection = await mysql.createConnection(dbConfig);

  try {
    // Proširen SQL upit sa nove dve kolone
    await connection.execute(
      'INSERT INTO users (ime_prezime, email, password, uloga, adresa, kontakt_telefon) VALUES (?, ?, ?, ?, ?, ?)',
      [ime_prezime, email, hashedPassword, 'kupac', adresa, kontakt_telefon]
    );
  } catch (error) {
    console.error("Greška pri registraciji:", error);
  } finally {
    await connection.end();
  }

  // Preusmeravanje na prijavu nakon uspešne registracije
  redirect('/login');
}

// --- FUNKCIJA ZA PRIJAVU (LOGIN) ---
export async function ulogujKorisnika(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const connection = await mysql.createConnection(dbConfig);
  
  // Ovu promenljivu pravimo ovde da bismo je koristili van try bloka
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

    // Sačuvaj ulogu za kasnije preusmeravanje
    ulogaKorisnika = korisnik.uloga;

    const cookieStore = await cookies();
    cookieStore.set('korisnik_id', korisnik.id, { httpOnly: true, secure: true });
    cookieStore.set('korisnik_uloga', korisnik.uloga, { httpOnly: true, secure: true });

  } catch (error) {
    console.error("Greška pri logovanju:", error);
    return; // Ako je stvarno greška u bazi, stani ovde
  } finally {
    await connection.end();
  }

  // --- KLJUČNA IZMENA: REDIRECT MORA BITI OVDE (VAN TRY-CATCH) ---
  if (ulogaKorisnika === 'admin') {
    redirect('/'); 
  } else {
    redirect('/products'); 
  }
}