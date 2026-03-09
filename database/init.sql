
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




INSERT INTO categories (naziv) VALUES ('Cegeri'), ('Majice');


INSERT INTO products (naziv, opis, cena, lager, category_id) VALUES 
('Ceger "Brend Druze" - Klasik', 'Ekološki pamučni ceger sa logoom.', 1200.00, 50, 1),
('Ceger "Umetnost na ramenu"', 'Specijalna edicija sa ilustracijom.', 1500.00, 30, 1),
('Majica "Druze" Bela', 'Kvalitetna 100% pamučna majica.', 1800.00, 20, 2),
('Majica "Druze" Crna', 'Oversized model sa printom.', 2200.00, 15, 2);

INSERT INTO users (ime_prezime, email, password, uloga, adresa, kontakt_telefon) 
VALUES ('Tamara Drca', 'tamara@druze.rs', '$2b$10$6Jojqg34/alw45DutoL.VeAOo/pmfSR8RNhfzfh6FbS.fWk3yS4Ii', 'admin', 'Beogradska 1', '060123456');

INSERT INTO users (ime_prezime, email, password, uloga, adresa, kontakt_telefon) 
VALUES ('Anastasija Knezevic', 'anastasija@druze.rs', '$2b$10$nvokcfhLQPx1yMyffUmtl.W/huDPRbXO6XF6t4M7EhB2vNILc5.T2', 'admin', 'Beogradska 2', '060123457');

INSERT INTO users (ime_prezime, email, password, uloga, adresa, kontakt_telefon) 
VALUES ('Miro Rakocevic', 'miro@druze.rs', '$2b$10$lRPd76Mt46w5KRTcS7lKB.p75snVo.xG6evcwT2TmPQcSgGmIlRg6', 'admin', 'Beogradska 3', '060123458');


UPDATE products SET slika_url = '/images/cegerDruze.jpg' WHERE id = 1;
UPDATE products SET slika_url = '/images/cegerDizvines.jpg' WHERE id = 2;
UPDATE products SET slika_url = '/images/aStaAkoUspeMajica2.jpg' WHERE id = 3;
UPDATE products SET slika_url = '/images/koZna.jpg' WHERE id = 4;

