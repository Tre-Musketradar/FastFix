-- Testdata för Felanmälan (bara för utveckling och test, aldrig i produktion).
--
-- Läs in (från projektets rotmapp, när databasen kör):
--   docker compose exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /db/testdata.sql'
-- Se README, avsnittet "Testdata".
--
-- Filen tömmer ALLA tabeller först, så den kan köras hur många gånger som helst.
-- Alla användare har lösenordet: test1234 (BCrypt-hash nedan).
--
-- Inloggning, en per roll:
--   forvaltare@felanmalan.se  MANAGER     (Maria Lindqvist)
--   tekniker@felanmalan.se    TECHNICIAN  (Ali Hassan)
--   hyresgast@felanmalan.se   TENANT      (Anna Karlsson, Solrosen lgh 1001)
--
-- Innehåll: 16 användare (2 förvaltare, 3 tekniker, 11 hyresgäster, varav Nils Holm utan
-- lägenhet), 3 fastigheter, 13 lägenheter (3 lediga), 16 ärenden i alla statusar,
-- kategorier och prioriteter, statushistorik för varje ärende och kommentarer.
-- Inga bilagor (story 18, Bifoga bild, är inte byggd än).
--
-- Filen skapas av ett skript och ska stämma med Flyway-migrationerna. Ändras schemat
-- ska den här filen uppdateras i samma PR.

BEGIN;

TRUNCATE attachments, comments, status_history, tickets, apartments, properties, users RESTART IDENTITY CASCADE;

-- Användare (lösenord: test1234)
INSERT INTO users (id, name, email, password_hash, role) VALUES
    (1, 'Maria Lindqvist', 'forvaltare@felanmalan.se', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'MANAGER'),
    (2, 'Johan Berg', 'johan.berg@felanmalan.se', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'MANAGER'),
    (3, 'Ali Hassan', 'tekniker@felanmalan.se', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TECHNICIAN'),
    (4, 'Sofia Nilsson', 'sofia.nilsson@felanmalan.se', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TECHNICIAN'),
    (5, 'Erik Johansson', 'erik.johansson@felanmalan.se', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TECHNICIAN'),
    (6, 'Anna Karlsson', 'hyresgast@felanmalan.se', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TENANT'),
    (7, 'Mohammed Ahmed', 'mohammed.ahmed@example.com', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TENANT'),
    (8, 'Lisa Andersson', 'lisa.andersson@example.com', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TENANT'),
    (9, 'Peter Svensson', 'peter.svensson@example.com', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TENANT'),
    (10, 'Fatima Ali', 'fatima.ali@example.com', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TENANT'),
    (11, 'Oskar Persson', 'oskar.persson@example.com', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TENANT'),
    (12, 'Emma Eriksson', 'emma.eriksson@example.com', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TENANT'),
    (13, 'Karin Larsson', 'karin.larsson@example.com', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TENANT'),
    (14, 'David Olsson', 'david.olsson@example.com', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TENANT'),
    (15, 'Sara Gustafsson', 'sara.gustafsson@example.com', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TENANT'),
    (16, 'Nils Holm', 'nils.holm@example.com', '$2a$10$OuxMlF3JqIvPO9jOakJy6u/cbtVkN4eKWPnwoFdDwviclQh1GEIIu', 'TENANT');

-- Fastigheter (owner_id = förvaltaren)
INSERT INTO properties (id, name, address, owner_id) VALUES
    (1, 'Solrosen', 'Solrosvägen 12, 123 45 Stockholm', 1),
    (2, 'Björken', 'Björkgatan 4, 753 20 Uppsala', 1),
    (3, 'Eken', 'Ekvägen 8, 412 58 Göteborg', 2);

-- Lägenheter (tenant_id NULL = ledig)
INSERT INTO apartments (id, property_id, number, floor, tenant_id) VALUES
    (1, 1, '1001', 0, 6),
    (2, 1, '1002', 0, 7),
    (3, 1, '1101', 1, 8),
    (4, 1, '1102', 1, NULL),
    (5, 1, '1201', 2, 9),
    (6, 1, '1202', 2, 10),
    (7, 2, '1001', 0, 11),
    (8, 2, '1002', 0, NULL),
    (9, 2, '1101', 1, 12),
    (10, 2, '1102', 1, 13),
    (11, 3, '1001', 0, 14),
    (12, 3, '1002', 0, 15),
    (13, 3, '1101', 1, NULL);

-- Ärenden
INSERT INTO tickets (id, apartment_id, created_by, assigned_to, category, priority, status, description, master_key_allowed, created_at, closed_at) VALUES
    (1, 1, 6, NULL, 'PLUMBING', 'NORMAL', 'NEW', 'Kranen i köket droppar hela tiden, även när den är helt avstängd.', TRUE, now() - interval '0 days', NULL),
    (2, 2, 7, NULL, 'ELECTRICAL', 'HIGH', 'NEW', 'Taklampan i hallen blinkar och slocknar ibland. Det luktar lite bränt.', FALSE, now() - interval '1 days', NULL),
    (3, 9, 12, NULL, 'VENTILATION', 'LOW', 'NEW', 'Fläkten i badrummet låter mycket och drar dåligt.', TRUE, now() - interval '2 days', NULL),
    (4, 3, 8, 3, 'APPLIANCES', 'NORMAL', 'ASSIGNED', 'Diskmaskinen tömmer inte ut vattnet. Det står vatten i botten efter varje körning.', TRUE, now() - interval '3 days', NULL),
    (5, 11, 14, 5, 'LOCKS_DOORS', 'HIGH', 'ASSIGNED', 'Ytterdörren går svårt att låsa. Nyckeln fastnar i låset.', FALSE, now() - interval '2 days', NULL),
    (6, 5, 9, 3, 'PLUMBING', 'URGENT', 'IN_PROGRESS', 'Det läcker vatten under handfatet i badrummet. Golvet är blött.', TRUE, now() - interval '1 days', NULL),
    (7, 7, 11, 4, 'ELECTRICAL', 'NORMAL', 'IN_PROGRESS', 'Två eluttag i vardagsrummet fungerar inte.', FALSE, now() - interval '4 days', NULL),
    (8, 10, 13, 4, 'APPLIANCES', 'NORMAL', 'WAITING', 'Kylskåpet håller inte kylan. Det är 12 grader inne i det.', TRUE, now() - interval '6 days', NULL),
    (9, 12, 15, 5, 'VENTILATION', 'NORMAL', 'WAITING', 'Det kommer kall luft från ventilen i sovrummet och det drar.', FALSE, now() - interval '8 days', NULL),
    (10, 6, 10, 3, 'OTHER', 'LOW', 'RESOLVED', 'Balkongdörrens list har lossnat.', TRUE, now() - interval '9 days', NULL),
    (11, 1, 6, 4, 'APPLIANCES', 'HIGH', 'RESOLVED', 'Spisen: två av plattorna blir inte varma.', FALSE, now() - interval '7 days', NULL),
    (12, 2, 7, 3, 'PLUMBING', 'NORMAL', 'CLOSED', 'Toaletten spolar hela tiden.', TRUE, now() - interval '20 days', now() - interval '20 days' + interval '70 hours'),
    (13, 9, 12, 5, 'LOCKS_DOORS', 'URGENT', 'CLOSED', 'Låset till lägenhetsdörren är trasigt, dörren går inte att låsa.', FALSE, now() - interval '15 days', now() - interval '15 days' + interval '70 hours'),
    (14, 11, 14, 4, 'ELECTRICAL', 'NORMAL', 'CLOSED', 'Jordfelsbrytaren löser ut när jag använder eluttaget i badrummet.', TRUE, now() - interval '30 days', now() - interval '30 days' + interval '146 hours'),
    (15, 3, 8, 3, 'OTHER', 'LOW', 'CLOSED', 'Brevinkastet har lossnat från dörren.', TRUE, now() - interval '25 days', now() - interval '25 days' + interval '70 hours'),
    (16, 12, 15, 5, 'PLUMBING', 'HIGH', 'IN_PROGRESS', 'Golvbrunnen i badrummet är stopp och det luktar.', FALSE, now() - interval '1 days', NULL);

-- Statushistorik (old_status NULL = ärendet skapades)
INSERT INTO status_history (ticket_id, old_status, new_status, changed_by, changed_at) VALUES
    (1, NULL, 'NEW', 6, now() - interval '0 days'),
    (2, NULL, 'NEW', 7, now() - interval '1 days'),
    (3, NULL, 'NEW', 12, now() - interval '2 days'),
    (4, NULL, 'NEW', 8, now() - interval '3 days'),
    (4, 'NEW', 'ASSIGNED', 1, now() - interval '3 days' + interval '2 hours'),
    (5, NULL, 'NEW', 14, now() - interval '2 days'),
    (5, 'NEW', 'ASSIGNED', 2, now() - interval '2 days' + interval '2 hours'),
    (6, NULL, 'NEW', 9, now() - interval '1 days'),
    (6, 'NEW', 'ASSIGNED', 1, now() - interval '1 days' + interval '2 hours'),
    (6, 'ASSIGNED', 'IN_PROGRESS', 3, now() - interval '1 days' + interval '22 hours'),
    (7, NULL, 'NEW', 11, now() - interval '4 days'),
    (7, 'NEW', 'ASSIGNED', 1, now() - interval '4 days' + interval '2 hours'),
    (7, 'ASSIGNED', 'IN_PROGRESS', 4, now() - interval '4 days' + interval '22 hours'),
    (8, NULL, 'NEW', 13, now() - interval '6 days'),
    (8, 'NEW', 'ASSIGNED', 1, now() - interval '6 days' + interval '2 hours'),
    (8, 'ASSIGNED', 'IN_PROGRESS', 4, now() - interval '6 days' + interval '22 hours'),
    (8, 'IN_PROGRESS', 'WAITING', 4, now() - interval '6 days' + interval '26 hours'),
    (9, NULL, 'NEW', 15, now() - interval '8 days'),
    (9, 'NEW', 'ASSIGNED', 2, now() - interval '8 days' + interval '2 hours'),
    (9, 'ASSIGNED', 'IN_PROGRESS', 5, now() - interval '8 days' + interval '22 hours'),
    (9, 'IN_PROGRESS', 'WAITING', 5, now() - interval '8 days' + interval '26 hours'),
    (10, NULL, 'NEW', 10, now() - interval '9 days'),
    (10, 'NEW', 'ASSIGNED', 1, now() - interval '9 days' + interval '2 hours'),
    (10, 'ASSIGNED', 'IN_PROGRESS', 3, now() - interval '9 days' + interval '22 hours'),
    (10, 'IN_PROGRESS', 'RESOLVED', 3, now() - interval '9 days' + interval '46 hours'),
    (11, NULL, 'NEW', 6, now() - interval '7 days'),
    (11, 'NEW', 'ASSIGNED', 1, now() - interval '7 days' + interval '2 hours'),
    (11, 'ASSIGNED', 'IN_PROGRESS', 4, now() - interval '7 days' + interval '22 hours'),
    (11, 'IN_PROGRESS', 'WAITING', 4, now() - interval '7 days' + interval '26 hours'),
    (11, 'WAITING', 'IN_PROGRESS', 4, now() - interval '7 days' + interval '98 hours'),
    (11, 'IN_PROGRESS', 'RESOLVED', 4, now() - interval '7 days' + interval '122 hours'),
    (12, NULL, 'NEW', 7, now() - interval '20 days'),
    (12, 'NEW', 'ASSIGNED', 1, now() - interval '20 days' + interval '2 hours'),
    (12, 'ASSIGNED', 'IN_PROGRESS', 3, now() - interval '20 days' + interval '22 hours'),
    (12, 'IN_PROGRESS', 'RESOLVED', 3, now() - interval '20 days' + interval '46 hours'),
    (12, 'RESOLVED', 'CLOSED', 1, now() - interval '20 days' + interval '70 hours'),
    (13, NULL, 'NEW', 12, now() - interval '15 days'),
    (13, 'NEW', 'ASSIGNED', 1, now() - interval '15 days' + interval '2 hours'),
    (13, 'ASSIGNED', 'IN_PROGRESS', 5, now() - interval '15 days' + interval '22 hours'),
    (13, 'IN_PROGRESS', 'RESOLVED', 5, now() - interval '15 days' + interval '46 hours'),
    (13, 'RESOLVED', 'CLOSED', 1, now() - interval '15 days' + interval '70 hours'),
    (14, NULL, 'NEW', 14, now() - interval '30 days'),
    (14, 'NEW', 'ASSIGNED', 2, now() - interval '30 days' + interval '2 hours'),
    (14, 'ASSIGNED', 'IN_PROGRESS', 4, now() - interval '30 days' + interval '22 hours'),
    (14, 'IN_PROGRESS', 'WAITING', 4, now() - interval '30 days' + interval '26 hours'),
    (14, 'WAITING', 'IN_PROGRESS', 4, now() - interval '30 days' + interval '98 hours'),
    (14, 'IN_PROGRESS', 'RESOLVED', 4, now() - interval '30 days' + interval '122 hours'),
    (14, 'RESOLVED', 'CLOSED', 2, now() - interval '30 days' + interval '146 hours'),
    (15, NULL, 'NEW', 8, now() - interval '25 days'),
    (15, 'NEW', 'ASSIGNED', 1, now() - interval '25 days' + interval '2 hours'),
    (15, 'ASSIGNED', 'IN_PROGRESS', 3, now() - interval '25 days' + interval '22 hours'),
    (15, 'IN_PROGRESS', 'RESOLVED', 3, now() - interval '25 days' + interval '46 hours'),
    (15, 'RESOLVED', 'CLOSED', 1, now() - interval '25 days' + interval '70 hours'),
    (16, NULL, 'NEW', 15, now() - interval '1 days'),
    (16, 'NEW', 'ASSIGNED', 2, now() - interval '1 days' + interval '2 hours'),
    (16, 'ASSIGNED', 'IN_PROGRESS', 5, now() - interval '1 days' + interval '22 hours');

-- Kommentarer
INSERT INTO comments (ticket_id, author_id, body, created_at) VALUES
    (6, 9, 'Jag har ställt en hink under och stängt av vattnet under handfatet.', now() - interval '1 days' + interval '1 hours'),
    (6, 3, 'Jag kommer inom en timme.', now() - interval '1 days' + interval '3 hours'),
    (8, 4, 'Kompressorn är trasig. Ny är beställd, leverans om ungefär en vecka.', now() - interval '6 days' + interval '30 hours'),
    (8, 13, 'Okej, tack. Kan jag få låna ett kylskåp under tiden?', now() - interval '6 days' + interval '32 hours'),
    (8, 1, 'Vi ställer in ett lånekylskåp i morgon.', now() - interval '6 days' + interval '34 hours'),
    (9, 5, 'Ventilen behöver bytas. Väntar på reservdel.', now() - interval '8 days' + interval '50 hours'),
    (11, 6, 'Det gäller de två främre plattorna.', now() - interval '7 days' + interval '2 hours'),
    (11, 4, 'Bytt två plattor. Hör av dig om något inte fungerar.', now() - interval '7 days' + interval '120 hours'),
    (13, 5, 'Låset är bytt. Nya nycklar finns hos förvaltaren.', now() - interval '15 days' + interval '23 hours'),
    (14, 4, 'Felet var en trasig kabel bakom spegelskåpet. Elektriker bokad.', now() - interval '30 days' + interval '40 hours'),
    (16, 15, 'Huvudnyckel får inte användas, jag är hemma efter kl. 16.', now() - interval '1 days' + interval '1 hours');

-- Sekvenserna fortsätter efter de id:n som används ovan, så att nya rader inte krockar.
SELECT setval('users_id_seq', (SELECT max(id) FROM users)),
       setval('properties_id_seq', (SELECT max(id) FROM properties)),
       setval('apartments_id_seq', (SELECT max(id) FROM apartments)),
       setval('tickets_id_seq', (SELECT max(id) FROM tickets));

COMMIT;
