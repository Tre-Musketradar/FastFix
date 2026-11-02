-- Testanvändare: en per roll, så att man kan logga in direkt efter `docker compose up`
-- (beslut #8 i docs/beslutslogg.md). Lösenord för alla: test1234.
--
-- Samma namn, e-post och BCrypt-hash som i db/testdata.sql. Har databasen redan
-- testdatan hoppar migrationen över det som finns, i stället för att krocka.
--
-- Måste tas bort eller få nya lösenord innan deploy (T2).

INSERT INTO users (name, email, password_hash, role) VALUES
    ('Maria Lindqvist', 'forvaltare@felanmalan.se', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'MANAGER'),
    ('Ali Hassan', 'tekniker@felanmalan.se', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TECHNICIAN'),
    ('Anna Karlsson', 'hyresgast@felanmalan.se', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TENANT')
ON CONFLICT (email) DO NOTHING;

-- Förvaltarens fastighet
INSERT INTO properties (name, address, owner_id)
SELECT 'Solrosen', 'Solrosvägen 12, 123 45 Stockholm', id
FROM users
WHERE email = 'forvaltare@felanmalan.se'
  AND NOT EXISTS (SELECT 1 FROM properties WHERE name = 'Solrosen');

-- Hyresgästens lägenhet
INSERT INTO apartments (property_id, number, floor, tenant_id)
SELECT p.id, '1001', 0, u.id
FROM properties p, users u
WHERE p.id = (SELECT min(id) FROM properties WHERE name = 'Solrosen')
  AND u.email = 'hyresgast@felanmalan.se'
ON CONFLICT DO NOTHING;
