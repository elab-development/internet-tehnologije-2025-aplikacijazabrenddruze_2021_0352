
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    naziv VARCHAR(255) NOT NULL
);


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    ime_prezime VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    uloga VARCHAR(50) DEFAULT 'kupac', 
    adresa TEXT,
    kontakt_telefon VARCHAR(50)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    naziv VARCHAR(255) NOT NULL,
    opis TEXT,
    cena DECIMAL(10,2) NOT NULL,
    slika_url VARCHAR(255),
    lager INT DEFAULT 0,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL
);


CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    datum TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ukupna_cena DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'na obradi'
);


CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    kolicina INT NOT NULL,
    cena_komad DECIMAL(10,2) NOT NULL
);


CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);