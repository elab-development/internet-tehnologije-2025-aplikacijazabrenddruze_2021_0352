'use server';

import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

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
    redirect('/products');
  } else {
    redirect('/');
  }

}
export async function kreirajPorudzbinu(ukupnaCena, cartItems) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('korisnik_id')?.value;

  if (!userId) return { success: false, error: "Niste ulogovani" };

  const connection = await mysql.createConnection(dbConfig);

  try {
    await connection.beginTransaction();


    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, ukupna_cena, status) VALUES (?, ?, ?)',
      [userId, ukupnaCena, 'na obradi']
    );


    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, kolicina, cena_komad) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.kolicina, item.cena]
      );
    }

    await connection.commit();
    return { success: true };

  } catch (error) {
    await connection.rollback();
    console.error("Greška pri kreiranju porudžbine:", error);
    return { success: false, error: "Sistem nije uspeo da zapiše stavke." };
  } finally {
    await connection.end();
  }
}
export async function azurirajProfil(formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('korisnik_id')?.value;

  if (!userId) return { error: "Niste ulogovani" };

  const ime_prezime = formData.get('ime_prezime');
  const adresa = formData.get('adresa');
  const kontakt_telefon = formData.get('kontakt_telefon');
  const novaLozinka = formData.get('password');

  const connection = await mysql.createConnection(dbConfig);

  try {
    await connection.execute(
      'UPDATE users SET ime_prezime = ?, adresa = ?, kontakt_telefon = ? WHERE id = ?',
      [ime_prezime, adresa, kontakt_telefon, userId]
    );

    if (novaLozinka && novaLozinka.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(novaLozinka, salt);
      await connection.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    }

    return { success: true };
  } catch (error) {
    return { error: "Greska pri azuriranju" };
  } finally {
    await connection.end();
  }
}
export async function otkaziPorudzbinu(orderId) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('korisnik_id')?.value;

  if (!userId) return { error: "Niste ulogovani" };

  const connection = await mysql.createConnection(dbConfig);

  try {
    const [rows] = await connection.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ? AND status = ?',
      [orderId, userId, 'na obradi']
    );

    if (rows.length === 0) {
      return { error: "Porudžbina se ne može otkazati jer je već poslata ili ne postoji." };
    }


    await connection.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      ['otkazano', orderId]
    );

    return { success: true };
  } catch (error) {
    return { error: "Greška pri otkazivanju" };
  } finally {
    await connection.end();
  }
}