-- Rummet där felet finns (story 5, #14), t.ex. "Kök". Fritt textfält.
-- Får vara NULL i databasen så att äldre ärenden fungerar; nya ärenden kräver rum i API:t.
ALTER TABLE tickets ADD COLUMN room varchar(50);
