UPDATE public.partners SET positioning_statement = v.txt FROM (VALUES
('87f98585-f1f6-48ed-bfab-34f8b7eb3bf8'::uuid,'Passar särskilt företag inom bygg, installation och service som söker full kontroll över projektens lönsamhet.'),
('67211d79-5e9e-4113-b6c2-ac77f54fc17b','Passar särskilt företag inom mode, sport och textil som söker en Business Central-specialist med djup branscherfarenhet.'),
('de93854a-6402-4f4a-8901-82bf355d0f0b','Passar särskilt medlemsorganisationer som vill effektivisera säljprocesser och kundrelationer med datadriven AI-funktionalitet.'),
('e97862ae-7d14-44da-9ea3-7e2de1140a10','Passar särskilt medelstora till stora grossister, tillverkare och retailaktörer som söker en stabil global Finance-implementation.'),
('d51765db-7ab6-4cb6-8c53-384f1ffee552','Passar särskilt medelstora grossist- och tillverkningsföretag i Norden som behöver effektiv affärsstyrning i Business Central.'),
('f89e80b2-a124-4768-8eaf-2b185b5bf093','Passar särskilt konsultföretag och grossister som vill effektivisera säljprocessen och stärka kundrelationerna.'),
('42f8b63b-a4c9-480d-81e5-a322652b3af4','Passar särskilt grossist-, retail- och tjänstebolag som behöver effektivisera sin verksamhet i Sverige eller internationellt.'),
('731f9c05-c293-4842-ac40-19fb610eaeac','Passar särskilt medelstora företag inom distribution, handel och konsulttjänster som behöver kontinuerligt stöd i Business Central.'),
('47db240f-0e3c-4ef7-8532-ddd914a990de','Passar särskilt företag inom tillverkningsindustri och grossistverksamhet som söker ett anpassat Business Central-system för effektiv processhantering.'),
('fe117b80-6acd-49c0-bab0-6fda75f25894','Passar särskilt företag inom tillverknings- och distributionsindustrin som vill modernisera sin finansiella styrning.'),
('4097cfef-2af6-4aaf-8fbe-69c388c16d8d','Passar särskilt grossist- och uthyrningsföretag som behöver en anpassningsbar affärslösning i Norden.'),
('674e19f3-b48c-4bf1-86ea-81c2170b178b','Passar särskilt tillverkande företag, grossister, distributörer och retailbolag som vill ha ett integrerat affärssystem som skalar i Sverige.'),
('5faf2ae1-e0a4-4481-a209-6e75e82c7efa','Passar särskilt konsult- och tjänsteföretag som söker en skalbar CRM-lösning med smarta AI-verktyg.'),
('f1947f70-3320-43b0-af09-8387d7546fa3','Passar särskilt företag inom tillverkning, bygg, entreprenad & installation samt energi & utilities som söker en helhetsleverantör.'),
('14adea7a-3dcb-403e-8d8e-0d8481e0fec4','Passar särskilt säljorganisationer inom livsmedels- och tillverkningsindustrin som vill effektivisera processer i Dynamics 365 Sales.'),
('cfe135f8-b2bf-4740-9f26-389bca040715','Passar särskilt företag inom transport, logistik, tillverkning och IT-konsulting som söker ett paketerat Business Central.'),
('d863d43e-f5a7-461a-a289-ba285b905d9e','Passar särskilt tillverkande företag, grossister och byggföretag som söker en trygg, lokalt förankrad partner för Business Central.')
) AS v(id, txt) WHERE public.partners.id = v.id;