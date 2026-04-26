-- =====================================================================
-- SEED COMPLETO — Dados de simulação para Gestão de Condomínio
-- =====================================================================
-- O script popula:
--   • 2 condomínios
--   • 1 admin global, 2 síndicos, 1 porteiro, 8 moradores
--   • 16 unidades (8 por condomínio, em 2 blocos de 4)
--   • Vínculos ocupante (proprietários e locatários)
--   • Papéis (gc_usuario_condominio)
--   • 8 áreas comuns + turnos
--   • Reservas (pendentes, aprovadas, concluídas)
--   • Visitantes, encomendas, ocorrências e comunicados de exemplo
--
-- IDIOMA DO BANCO: PostgreSQL
-- ENCODING: UTF-8
--
-- COMO RODAR:
--   psql -h <host> -U <user> -d <db> -f sql/seed-completo.sql
--
-- IDEMPOTÊNCIA: o script usa ON CONFLICT DO NOTHING quando possível,
-- então pode ser executado mais de uma vez sem duplicar dados.
--
-- SENHA DE LOGIN PADRÃO: 123456
--   Hash bcrypt cost 10: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
--   Se o login não autenticar, gere um novo hash com o comando abaixo
--   e substitua todas as ocorrências no arquivo:
--     node -e "console.log(require('bcrypt').hashSync('123456', 10))"
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1) PESSOAS
-- ---------------------------------------------------------------------

INSERT INTO gc_pessoa
  (pes_nome, pes_cpf_cnpj, pes_tipo, pes_email, pes_telefone, pes_ativo,
   pes_senha_login, pes_is_global_admin)
VALUES
  ('Administrador Global', '00000000000', 'F', 'admin@condigtal.com', '11999990000', true,
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', true),

  ('Carlos Síndico Silva',     '11111111111', 'F', 'sindico1@condigtal.com', '11988880001', true,
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', false),
  ('Marina Síndica Souza',     '22222222222', 'F', 'sindico2@condigtal.com', '11988880002', true,
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', false),

  ('José Porteiro Santos',     '33333333333', 'F', 'porteiro1@condigtal.com', '11988880003', true,
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', false),

  ('Ana Beatriz Almeida',      '44444444444', 'F', 'ana.almeida@email.com',   '11977770001', true,
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', false),
  ('Bruno Costa',              '55555555555', 'F', 'bruno.costa@email.com',   '11977770002', true,
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', false),
  ('Carla Dias',               '66666666666', 'F', 'carla.dias@email.com',    '11977770003', true,
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', false),
  ('Diego Esteves',            '77777777777', 'F', 'diego.esteves@email.com', '11977770004', true,
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', false),
  ('Eliana Ferreira',          '88888888888', 'F', 'eliana.ferreira@email.com','11977770005', true,
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', false),
  ('Fábio Gonçalves',          '99999999999', 'F', 'fabio.goncalves@email.com','11977770006', true,
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', false),
  ('Giovana Henriques',        '12312312312', 'F', 'giovana.henriques@email.com','11977770007', true,
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', false),
  ('Henrique Iglesias',        '23423423423', 'F', 'henrique.iglesias@email.com','11977770008', true,
   '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', false)
ON CONFLICT (pes_cpf_cnpj) DO NOTHING;


-- ---------------------------------------------------------------------
-- 2) CONDOMÍNIOS
-- ---------------------------------------------------------------------

INSERT INTO gc_condominio
  (con_nome, con_logradouro, con_numero, con_bairro, con_cidade, con_estado, con_cep,
   con_pais, con_numero_unidades, con_tipologia, con_dt_vencimento_taxa, con_ativo)
VALUES
  ('Residencial Jardim das Flores', 'Rua das Acácias',  '500', 'Jardim Paulista',
   'São Paulo', 'SP', '01453000', 'Brasil', 8, 'RESIDENCIAL', 10, true),
  ('Edifício Parque Verde',         'Av. Paulista',     '2200', 'Bela Vista',
   'São Paulo', 'SP', '01310100', 'Brasil', 8, 'MISTO',       15, true)
ON CONFLICT DO NOTHING;


-- ---------------------------------------------------------------------
-- 3) UNIDADES (usando subqueries por con_nome)
-- ---------------------------------------------------------------------

-- Jardim das Flores: Bloco A (4 ap.) + Bloco B (4 ap.)
INSERT INTO gc_unidade
  (con_cod, uni_numero, uni_bloco, uni_andar, uni_status_ocupacao,
   uni_fracao_ideal, uni_area_privada, uni_tipo, uni_ativa)
SELECT c.con_cod, u.numero, u.bloco, u.andar, u.status::"UnidadeStatusOcupacao",
       u.fracao, u.area, u.tipo::"UnidadeTipo", true
FROM gc_condominio c,
  (VALUES
    ('101','A','1','OCUPADA',12.50,68.00,'APARTAMENTO'),
    ('102','A','1','OCUPADA',12.50,68.00,'APARTAMENTO'),
    ('201','A','2','OCUPADA',12.50,68.00,'APARTAMENTO'),
    ('202','A','2','VAZIA',  12.50,68.00,'APARTAMENTO'),
    ('101','B','1','OCUPADA',12.50,72.00,'APARTAMENTO'),
    ('102','B','1','OCUPADA',12.50,72.00,'APARTAMENTO'),
    ('201','B','2','OCUPADA',12.50,72.00,'APARTAMENTO'),
    ('202','B','2','EM_REFORMA',12.50,72.00,'APARTAMENTO')
  ) AS u(numero, bloco, andar, status, fracao, area, tipo)
WHERE c.con_nome = 'Residencial Jardim das Flores'
  AND NOT EXISTS (
    SELECT 1 FROM gc_unidade x
    WHERE x.con_cod = c.con_cod AND x.uni_numero = u.numero AND x.uni_bloco = u.bloco
  );

-- Parque Verde: Torre Única (apartamentos)
INSERT INTO gc_unidade
  (con_cod, uni_numero, uni_bloco, uni_andar, uni_status_ocupacao,
   uni_fracao_ideal, uni_area_privada, uni_tipo, uni_ativa)
SELECT c.con_cod, u.numero, u.bloco, u.andar, u.status::"UnidadeStatusOcupacao",
       u.fracao, u.area, u.tipo::"UnidadeTipo", true
FROM gc_condominio c,
  (VALUES
    ('301',NULL,'3','OCUPADA',12.50,90.00,'APARTAMENTO'),
    ('302',NULL,'3','OCUPADA',12.50,90.00,'APARTAMENTO'),
    ('401',NULL,'4','OCUPADA',12.50,90.00,'APARTAMENTO'),
    ('402',NULL,'4','VAZIA',  12.50,90.00,'APARTAMENTO'),
    ('501',NULL,'5','OCUPADA',12.50,110.00,'APARTAMENTO'),
    ('502',NULL,'5','OCUPADA',12.50,110.00,'APARTAMENTO'),
    ('LOJA1',NULL,'T','OCUPADA',8.00,45.00,'COMERCIAL'),
    ('LOJA2',NULL,'T','VAZIA',  8.00,45.00,'COMERCIAL')
  ) AS u(numero, bloco, andar, status, fracao, area, tipo)
WHERE c.con_nome = 'Edifício Parque Verde'
  AND NOT EXISTS (
    SELECT 1 FROM gc_unidade x
    WHERE x.con_cod = c.con_cod AND x.uni_numero = u.numero
      AND COALESCE(x.uni_bloco,'-') = COALESCE(u.bloco,'-')
  );


-- ---------------------------------------------------------------------
-- 4) PAPÉIS (gc_usuario_condominio)
-- ---------------------------------------------------------------------

-- Síndicos
INSERT INTO gc_usuario_condominio (pes_cod, con_cod, usc_papel, usc_ativo_associacao)
SELECT p.pes_cod, c.con_cod, 'SINDICO', true
FROM gc_pessoa p, gc_condominio c
WHERE p.pes_cpf_cnpj = '11111111111' AND c.con_nome = 'Residencial Jardim das Flores'
ON CONFLICT DO NOTHING;

INSERT INTO gc_usuario_condominio (pes_cod, con_cod, usc_papel, usc_ativo_associacao)
SELECT p.pes_cod, c.con_cod, 'SINDICO', true
FROM gc_pessoa p, gc_condominio c
WHERE p.pes_cpf_cnpj = '22222222222' AND c.con_nome = 'Edifício Parque Verde'
ON CONFLICT DO NOTHING;

-- Porteiro (atende ambos)
INSERT INTO gc_usuario_condominio (pes_cod, con_cod, usc_papel, usc_ativo_associacao)
SELECT p.pes_cod, c.con_cod, 'PORTEIRO', true
FROM gc_pessoa p, gc_condominio c
WHERE p.pes_cpf_cnpj = '33333333333'
ON CONFLICT DO NOTHING;

-- Moradores
INSERT INTO gc_usuario_condominio (pes_cod, con_cod, usc_papel, usc_ativo_associacao)
SELECT p.pes_cod, c.con_cod, 'MORADOR', true
FROM gc_pessoa p, gc_condominio c
WHERE p.pes_cpf_cnpj IN ('44444444444','55555555555','66666666666','77777777777')
  AND c.con_nome = 'Residencial Jardim das Flores'
ON CONFLICT DO NOTHING;

INSERT INTO gc_usuario_condominio (pes_cod, con_cod, usc_papel, usc_ativo_associacao)
SELECT p.pes_cod, c.con_cod, 'MORADOR', true
FROM gc_pessoa p, gc_condominio c
WHERE p.pes_cpf_cnpj IN ('88888888888','99999999999','12312312312','23423423423')
  AND c.con_nome = 'Edifício Parque Verde'
ON CONFLICT DO NOTHING;


-- ---------------------------------------------------------------------
-- 5) OCUPANTES (vínculo pessoa <-> unidade)
-- ---------------------------------------------------------------------

-- Helper: cada morador em uma unidade, alguns como proprietário, outros como locatário.

INSERT INTO gc_ocupante (pes_cod, uni_cod, ocu_vinculo, ocu_dt_inicio_ocupacao)
SELECT p.pes_cod, u.uni_cod, 'PROPRIETARIO', DATE '2024-01-15'
FROM gc_pessoa p
JOIN gc_unidade u ON u.uni_numero = '101' AND u.uni_bloco = 'A'
JOIN gc_condominio c ON c.con_cod = u.con_cod AND c.con_nome = 'Residencial Jardim das Flores'
WHERE p.pes_cpf_cnpj = '44444444444'
ON CONFLICT (pes_cod, uni_cod) DO NOTHING;

INSERT INTO gc_ocupante (pes_cod, uni_cod, ocu_vinculo, ocu_dt_inicio_ocupacao)
SELECT p.pes_cod, u.uni_cod, 'LOCATARIO', DATE '2024-06-01'
FROM gc_pessoa p
JOIN gc_unidade u ON u.uni_numero = '102' AND u.uni_bloco = 'A'
JOIN gc_condominio c ON c.con_cod = u.con_cod AND c.con_nome = 'Residencial Jardim das Flores'
WHERE p.pes_cpf_cnpj = '55555555555'
ON CONFLICT (pes_cod, uni_cod) DO NOTHING;

INSERT INTO gc_ocupante (pes_cod, uni_cod, ocu_vinculo, ocu_dt_inicio_ocupacao)
SELECT p.pes_cod, u.uni_cod, 'PROPRIETARIO', DATE '2023-11-20'
FROM gc_pessoa p
JOIN gc_unidade u ON u.uni_numero = '201' AND u.uni_bloco = 'A'
JOIN gc_condominio c ON c.con_cod = u.con_cod AND c.con_nome = 'Residencial Jardim das Flores'
WHERE p.pes_cpf_cnpj = '66666666666'
ON CONFLICT (pes_cod, uni_cod) DO NOTHING;

INSERT INTO gc_ocupante (pes_cod, uni_cod, ocu_vinculo, ocu_dt_inicio_ocupacao)
SELECT p.pes_cod, u.uni_cod, 'PROPRIETARIO', DATE '2024-03-10'
FROM gc_pessoa p
JOIN gc_unidade u ON u.uni_numero = '101' AND u.uni_bloco = 'B'
JOIN gc_condominio c ON c.con_cod = u.con_cod AND c.con_nome = 'Residencial Jardim das Flores'
WHERE p.pes_cpf_cnpj = '77777777777'
ON CONFLICT (pes_cod, uni_cod) DO NOTHING;

INSERT INTO gc_ocupante (pes_cod, uni_cod, ocu_vinculo, ocu_dt_inicio_ocupacao)
SELECT p.pes_cod, u.uni_cod, 'PROPRIETARIO', DATE '2024-02-01'
FROM gc_pessoa p
JOIN gc_unidade u ON u.uni_numero = '301'
JOIN gc_condominio c ON c.con_cod = u.con_cod AND c.con_nome = 'Edifício Parque Verde'
WHERE p.pes_cpf_cnpj = '88888888888'
ON CONFLICT (pes_cod, uni_cod) DO NOTHING;

INSERT INTO gc_ocupante (pes_cod, uni_cod, ocu_vinculo, ocu_dt_inicio_ocupacao)
SELECT p.pes_cod, u.uni_cod, 'LOCATARIO', DATE '2024-08-15'
FROM gc_pessoa p
JOIN gc_unidade u ON u.uni_numero = '302'
JOIN gc_condominio c ON c.con_cod = u.con_cod AND c.con_nome = 'Edifício Parque Verde'
WHERE p.pes_cpf_cnpj = '99999999999'
ON CONFLICT (pes_cod, uni_cod) DO NOTHING;

INSERT INTO gc_ocupante (pes_cod, uni_cod, ocu_vinculo, ocu_dt_inicio_ocupacao)
SELECT p.pes_cod, u.uni_cod, 'PROPRIETARIO', DATE '2023-05-20'
FROM gc_pessoa p
JOIN gc_unidade u ON u.uni_numero = '401'
JOIN gc_condominio c ON c.con_cod = u.con_cod AND c.con_nome = 'Edifício Parque Verde'
WHERE p.pes_cpf_cnpj = '12312312312'
ON CONFLICT (pes_cod, uni_cod) DO NOTHING;

INSERT INTO gc_ocupante (pes_cod, uni_cod, ocu_vinculo, ocu_dt_inicio_ocupacao)
SELECT p.pes_cod, u.uni_cod, 'PROPRIETARIO', DATE '2023-09-05'
FROM gc_pessoa p
JOIN gc_unidade u ON u.uni_numero = '501'
JOIN gc_condominio c ON c.con_cod = u.con_cod AND c.con_nome = 'Edifício Parque Verde'
WHERE p.pes_cpf_cnpj = '23423423423'
ON CONFLICT (pes_cod, uni_cod) DO NOTHING;


-- ---------------------------------------------------------------------
-- 6) ÁREAS COMUNS + TURNOS
-- ---------------------------------------------------------------------

-- Jardim das Flores
INSERT INTO gc_area_comum
  (con_cod, nome, descricao, termos_uso, capacidade_maxima, permite_convidados,
   limite_convidados, dias_antecedencia_min, dias_antecedencia_max, ativa, taxa_valor)
SELECT c.con_cod, a.nome, a.desc, a.termos, a.cap, a.conv, a.limconv, a.min, a.max, true, a.taxa
FROM gc_condominio c,
  (VALUES
    ('Salão de Festas', 'Espaço para eventos particulares.',
     'Limpeza obrigatória após o uso. Sem som alto após 22h.', 80, true, 50, 2, 60, 250.00),
    ('Piscina', 'Piscina adulto e infantil.',
     'Crianças apenas acompanhadas. Traje de banho obrigatório.', 30, true, 6, 1, 30, NULL),
    ('Churrasqueira', 'Área externa com churrasqueira a carvão.',
     'Limpeza após uso. Carvão por conta do morador.', 25, true, 15, 1, 30, 80.00),
    ('Academia', 'Equipamentos de musculação e cardio.',
     'Uso individual. Limpeza dos equipamentos após o uso.', 10, false, 0, 0, 7, NULL)
  ) AS a(nome, "desc", termos, cap, conv, limconv, min, max, taxa)
WHERE c.con_nome = 'Residencial Jardim das Flores'
  AND NOT EXISTS (
    SELECT 1 FROM gc_area_comum x WHERE x.con_cod = c.con_cod AND x.nome = a.nome
  );

-- Parque Verde
INSERT INTO gc_area_comum
  (con_cod, nome, descricao, termos_uso, capacidade_maxima, permite_convidados,
   limite_convidados, dias_antecedencia_min, dias_antecedencia_max, ativa, taxa_valor)
SELECT c.con_cod, a.nome, a.desc, a.termos, a.cap, a.conv, a.limconv, a.min, a.max, true, a.taxa
FROM gc_condominio c,
  (VALUES
    ('Salão Gourmet', 'Cozinha completa para até 30 pessoas.',
     'Aceito termo de uso e responsabilidade pela limpeza.', 30, true, 25, 3, 45, 180.00),
    ('Espaço Kids', 'Brinquedoteca para crianças.',
     'Crianças sempre acompanhadas. Sem alimentos.', 20, true, 10, 1, 20, NULL),
    ('Sala de Reuniões', 'Sala equipada com TV e mesa para 10 pessoas.',
     'Reservas em horário comercial. Sem alimentos.', 10, true, 8, 1, 15, NULL),
    ('Quadra Poliesportiva', 'Quadra coberta para esportes.',
     'Calçado adequado obrigatório. Sem som alto após 22h.', 20, true, 12, 1, 30, 50.00)
  ) AS a(nome, "desc", termos, cap, conv, limconv, min, max, taxa)
WHERE c.con_nome = 'Edifício Parque Verde'
  AND NOT EXISTS (
    SELECT 1 FROM gc_area_comum x WHERE x.con_cod = c.con_cod AND x.nome = a.nome
  );

-- Turnos
INSERT INTO gc_area_comum_turno (are_cod, nome, hora_inicio, hora_fim, ativo)
SELECT a.are_cod, t.nome, t.ini::time, t.fim::time, true
FROM gc_area_comum a
JOIN gc_condominio c ON c.con_cod = a.con_cod,
  (VALUES
    ('Salão de Festas',     'Tarde',  '14:00:00', '18:00:00'),
    ('Salão de Festas',     'Noite',  '19:00:00', '23:00:00'),
    ('Piscina',             'Manhã',  '08:00:00', '12:00:00'),
    ('Piscina',             'Tarde',  '13:00:00', '18:00:00'),
    ('Churrasqueira',       'Almoço', '11:00:00', '16:00:00'),
    ('Churrasqueira',       'Jantar', '18:00:00', '23:00:00'),
    ('Academia',            'Manhã',  '06:00:00', '11:00:00'),
    ('Academia',            'Tarde',  '14:00:00', '18:00:00'),
    ('Academia',            'Noite',  '19:00:00', '22:00:00'),
    ('Salão Gourmet',       'Almoço', '11:00:00', '16:00:00'),
    ('Salão Gourmet',       'Jantar', '18:00:00', '23:00:00'),
    ('Espaço Kids',         'Tarde',  '14:00:00', '18:00:00'),
    ('Sala de Reuniões',    'Manhã',  '08:00:00', '12:00:00'),
    ('Sala de Reuniões',    'Tarde',  '13:00:00', '18:00:00'),
    ('Quadra Poliesportiva','Tarde',  '14:00:00', '18:00:00'),
    ('Quadra Poliesportiva','Noite',  '19:00:00', '22:00:00')
  ) AS t(area_nome, nome, ini, fim)
WHERE a.nome = t.area_nome
  AND NOT EXISTS (
    SELECT 1 FROM gc_area_comum_turno x WHERE x.are_cod = a.are_cod AND x.nome = t.nome
  );


-- ---------------------------------------------------------------------
-- 7) RESERVAS
-- ---------------------------------------------------------------------

-- Reserva PENDENTE: Ana (44444444444) reservou o Salão de Festas
INSERT INTO gc_reserva
  (are_cod, tur_cod, uni_cod, pes_cod_morador, data, status, termos_aceitos)
SELECT
  a.are_cod,
  (SELECT t.tur_cod FROM gc_area_comum_turno t WHERE t.are_cod = a.are_cod AND t.nome = 'Noite'),
  o.uni_cod,
  p.pes_cod,
  CURRENT_DATE + INTERVAL '15 days',
  'PENDENTE_APROVACAO',
  true
FROM gc_pessoa p
JOIN gc_ocupante o ON o.pes_cod = p.pes_cod
JOIN gc_unidade u ON u.uni_cod = o.uni_cod
JOIN gc_area_comum a ON a.con_cod = u.con_cod AND a.nome = 'Salão de Festas'
WHERE p.pes_cpf_cnpj = '44444444444'
  AND NOT EXISTS (
    SELECT 1 FROM gc_reserva r
    WHERE r.pes_cod_morador = p.pes_cod AND r.are_cod = a.are_cod
      AND r.data = CURRENT_DATE + INTERVAL '15 days'
  );

-- Reserva APROVADA: Bruno (55555555555) reservou a Churrasqueira
INSERT INTO gc_reserva
  (are_cod, tur_cod, uni_cod, pes_cod_morador, pes_cod_aprovador,
   data, status, termos_aceitos)
SELECT
  a.are_cod,
  (SELECT t.tur_cod FROM gc_area_comum_turno t WHERE t.are_cod = a.are_cod AND t.nome = 'Almoço'),
  o.uni_cod,
  p.pes_cod,
  (SELECT pes_cod FROM gc_pessoa WHERE pes_cpf_cnpj = '11111111111'),
  CURRENT_DATE + INTERVAL '7 days',
  'APROVADA',
  true
FROM gc_pessoa p
JOIN gc_ocupante o ON o.pes_cod = p.pes_cod
JOIN gc_unidade u ON u.uni_cod = o.uni_cod
JOIN gc_area_comum a ON a.con_cod = u.con_cod AND a.nome = 'Churrasqueira'
WHERE p.pes_cpf_cnpj = '55555555555'
  AND NOT EXISTS (
    SELECT 1 FROM gc_reserva r
    WHERE r.pes_cod_morador = p.pes_cod AND r.are_cod = a.are_cod
      AND r.data = CURRENT_DATE + INTERVAL '7 days'
  );

-- Reserva CONCLUÍDA: Carla (66666666666) usou a Piscina
INSERT INTO gc_reserva
  (are_cod, tur_cod, uni_cod, pes_cod_morador, pes_cod_aprovador,
   data, status, termos_aceitos)
SELECT
  a.are_cod,
  (SELECT t.tur_cod FROM gc_area_comum_turno t WHERE t.are_cod = a.are_cod AND t.nome = 'Tarde'),
  o.uni_cod,
  p.pes_cod,
  (SELECT pes_cod FROM gc_pessoa WHERE pes_cpf_cnpj = '11111111111'),
  CURRENT_DATE - INTERVAL '10 days',
  'CONCLUIDA',
  true
FROM gc_pessoa p
JOIN gc_ocupante o ON o.pes_cod = p.pes_cod
JOIN gc_unidade u ON u.uni_cod = o.uni_cod
JOIN gc_area_comum a ON a.con_cod = u.con_cod AND a.nome = 'Piscina'
WHERE p.pes_cpf_cnpj = '66666666666'
  AND NOT EXISTS (
    SELECT 1 FROM gc_reserva r
    WHERE r.pes_cod_morador = p.pes_cod AND r.are_cod = a.are_cod
      AND r.data = CURRENT_DATE - INTERVAL '10 days'
  );

-- Reserva PENDENTE: Eliana (88888888888) reservou Salão Gourmet
INSERT INTO gc_reserva
  (are_cod, tur_cod, uni_cod, pes_cod_morador, data, status, termos_aceitos)
SELECT
  a.are_cod,
  (SELECT t.tur_cod FROM gc_area_comum_turno t WHERE t.are_cod = a.are_cod AND t.nome = 'Jantar'),
  o.uni_cod,
  p.pes_cod,
  CURRENT_DATE + INTERVAL '20 days',
  'PENDENTE_APROVACAO',
  true
FROM gc_pessoa p
JOIN gc_ocupante o ON o.pes_cod = p.pes_cod
JOIN gc_unidade u ON u.uni_cod = o.uni_cod
JOIN gc_area_comum a ON a.con_cod = u.con_cod AND a.nome = 'Salão Gourmet'
WHERE p.pes_cpf_cnpj = '88888888888'
  AND NOT EXISTS (
    SELECT 1 FROM gc_reserva r
    WHERE r.pes_cod_morador = p.pes_cod AND r.are_cod = a.are_cod
      AND r.data = CURRENT_DATE + INTERVAL '20 days'
  );


-- ---------------------------------------------------------------------
-- 8) OCORRÊNCIAS
-- ---------------------------------------------------------------------

INSERT INTO gc_ocorrencia
  (con_cod, uni_cod, pes_cod_registro, titulo, descricao, tipo, status)
SELECT u.con_cod, u.uni_cod, p.pes_cod,
       'Vazamento no banheiro',
       'Cano do banheiro social está com vazamento contínuo. Já fechei o registro principal.',
       'MANUTENCAO', 'ABERTA'
FROM gc_pessoa p
JOIN gc_ocupante o ON o.pes_cod = p.pes_cod
JOIN gc_unidade u ON u.uni_cod = o.uni_cod
WHERE p.pes_cpf_cnpj = '44444444444'
  AND NOT EXISTS (SELECT 1 FROM gc_ocorrencia x WHERE x.titulo = 'Vazamento no banheiro' AND x.uni_cod = u.uni_cod);

INSERT INTO gc_ocorrencia
  (con_cod, uni_cod, pes_cod_registro, titulo, descricao, tipo, status)
SELECT u.con_cod, u.uni_cod, p.pes_cod,
       'Som alto vizinho',
       'Apartamento ao lado tem festas frequentes após meia-noite. Solicito providências.',
       'BARULHO', 'EM_ANALISE'
FROM gc_pessoa p
JOIN gc_ocupante o ON o.pes_cod = p.pes_cod
JOIN gc_unidade u ON u.uni_cod = o.uni_cod
WHERE p.pes_cpf_cnpj = '55555555555'
  AND NOT EXISTS (SELECT 1 FROM gc_ocorrencia x WHERE x.titulo = 'Som alto vizinho' AND x.uni_cod = u.uni_cod);

INSERT INTO gc_ocorrencia
  (con_cod, uni_cod, pes_cod_registro, titulo, descricao, tipo, status,
   parecer_final, pes_cod_finalizou, data_finalizacao)
SELECT u.con_cod, u.uni_cod, p.pes_cod,
       'Lâmpada queimada no hall',
       'Lâmpada do hall do 4º andar queimada há 3 dias.',
       'MANUTENCAO', 'RESOLVIDA',
       'Lâmpada substituída pelo zelador.',
       (SELECT pes_cod FROM gc_pessoa WHERE pes_cpf_cnpj = '11111111111'),
       NOW() - INTERVAL '2 days'
FROM gc_pessoa p
JOIN gc_ocupante o ON o.pes_cod = p.pes_cod
JOIN gc_unidade u ON u.uni_cod = o.uni_cod
WHERE p.pes_cpf_cnpj = '66666666666'
  AND NOT EXISTS (SELECT 1 FROM gc_ocorrencia x WHERE x.titulo = 'Lâmpada queimada no hall' AND x.uni_cod = u.uni_cod);


-- ---------------------------------------------------------------------
-- 9) ENCOMENDAS
-- ---------------------------------------------------------------------

INSERT INTO gc_encomenda
  (con_cod, uni_cod, pes_cod_registro, destinatario, nome_recebido_por,
   descricao, tipo, status, data_recebimento, observacoes)
SELECT u.con_cod, u.uni_cod,
       (SELECT pes_cod FROM gc_pessoa WHERE pes_cpf_cnpj = '33333333333'),
       'Ana Beatriz Almeida',
       'José Porteiro Santos',
       'Caixa pequena Mercado Livre - rastreio BR123456789ML',
       'TRANSPORTADORA', 'PENDENTE',
       NOW() - INTERVAL '1 day',
       'Retirar na portaria'
FROM gc_unidade u
JOIN gc_condominio c ON c.con_cod = u.con_cod
WHERE u.uni_numero = '101' AND u.uni_bloco = 'A'
  AND c.con_nome = 'Residencial Jardim das Flores'
  AND NOT EXISTS (
    SELECT 1 FROM gc_encomenda x
    WHERE x.uni_cod = u.uni_cod
      AND x.descricao LIKE '%BR123456789ML%'
  );

INSERT INTO gc_encomenda
  (con_cod, uni_cod, pes_cod_registro, destinatario, nome_recebido_por,
   descricao, tipo, status, data_recebimento,
   pes_cod_retirada, nome_retirada, data_retirada)
SELECT u.con_cod, u.uni_cod,
       (SELECT pes_cod FROM gc_pessoa WHERE pes_cpf_cnpj = '33333333333'),
       'Eliana Ferreira',
       'José Porteiro Santos',
       'Envelope SEDEX Receita Federal - rastreio PE111222333BR',
       'CORREIOS', 'RETIRADA',
       NOW() - INTERVAL '5 days',
       (SELECT p.pes_cod FROM gc_pessoa p WHERE p.pes_cpf_cnpj = '88888888888'),
       'Eliana Ferreira',
       NOW() - INTERVAL '4 days'
FROM gc_unidade u
JOIN gc_condominio c ON c.con_cod = u.con_cod
WHERE u.uni_numero = '301'
  AND c.con_nome = 'Edifício Parque Verde'
  AND NOT EXISTS (
    SELECT 1 FROM gc_encomenda x
    WHERE x.uni_cod = u.uni_cod
      AND x.descricao LIKE '%PE111222333BR%'
  );


-- ---------------------------------------------------------------------
-- 10) VISITANTES
-- ---------------------------------------------------------------------

INSERT INTO gc_visitante
  (con_cod, uni_cod, pes_cod_registro, pes_cod_morador, nome, cpf,
   telefone, observacoes, status, data_entrada)
SELECT u.con_cod, u.uni_cod,
       (SELECT pes_cod FROM gc_pessoa WHERE pes_cpf_cnpj = '33333333333'),
       (SELECT pes_cod FROM gc_pessoa WHERE pes_cpf_cnpj = '44444444444'),
       'João Pedro Visitante', '12345678900',
       '11955551111', 'Visita social', 'NO_LOCAL',
       NOW() - INTERVAL '2 hours'
FROM gc_unidade u
JOIN gc_condominio c ON c.con_cod = u.con_cod
WHERE u.uni_numero = '101' AND u.uni_bloco = 'A'
  AND c.con_nome = 'Residencial Jardim das Flores'
  AND NOT EXISTS (
    SELECT 1 FROM gc_visitante x
    WHERE x.cpf = '12345678900' AND x.uni_cod = u.uni_cod AND x.status = 'NO_LOCAL'
  );

INSERT INTO gc_visitante
  (con_cod, uni_cod, pes_cod_registro, pes_cod_morador, nome, cpf,
   telefone, observacoes, status, data_entrada, data_saida)
SELECT u.con_cod, u.uni_cod,
       (SELECT pes_cod FROM gc_pessoa WHERE pes_cpf_cnpj = '33333333333'),
       (SELECT pes_cod FROM gc_pessoa WHERE pes_cpf_cnpj = '88888888888'),
       'Maria Eletricista', '98765432100',
       '11955552222', 'Manutenção elétrica', 'SAIU',
       NOW() - INTERVAL '3 days',
       NOW() - INTERVAL '3 days' + INTERVAL '2 hours'
FROM gc_unidade u
JOIN gc_condominio c ON c.con_cod = u.con_cod
WHERE u.uni_numero = '301'
  AND c.con_nome = 'Edifício Parque Verde'
  AND NOT EXISTS (
    SELECT 1 FROM gc_visitante x
    WHERE x.cpf = '98765432100' AND x.uni_cod = u.uni_cod
  );


-- ---------------------------------------------------------------------
-- 11) COMUNICADOS
-- ---------------------------------------------------------------------

INSERT INTO gc_comunicado
  (com_titulo, com_mensagem, com_publico_destino, com_is_urgente, pes_cod_criador)
SELECT
  'Manutenção da bomba d''água',
  'Informamos que a bomba d''água será trocada na próxima quarta-feira, das 08h às 12h. Durante este período não haverá fornecimento de água nos blocos.',
  'TODOS', true,
  (SELECT pes_cod FROM gc_pessoa WHERE pes_cpf_cnpj = '11111111111')
WHERE NOT EXISTS (SELECT 1 FROM gc_comunicado WHERE com_titulo = 'Manutenção da bomba d''água');

INSERT INTO gc_comunicado
  (com_titulo, com_mensagem, com_publico_destino, com_is_urgente, pes_cod_criador)
SELECT
  'Assembleia ordinária 2026',
  'Convocamos todos os proprietários para a assembleia ordinária no dia 30/05/2026, às 19h, no salão de festas. Pauta: aprovação das contas e eleição do conselho.',
  'PROPRIETARIOS', false,
  (SELECT pes_cod FROM gc_pessoa WHERE pes_cpf_cnpj = '22222222222')
WHERE NOT EXISTS (SELECT 1 FROM gc_comunicado WHERE com_titulo = 'Assembleia ordinária 2026');

INSERT INTO gc_comunicado
  (com_titulo, com_mensagem, com_publico_destino, com_is_urgente, pes_cod_criador)
SELECT
  'Nova regra de uso da piscina',
  'A partir de 01/06, será obrigatório uso de touca para entrada na piscina. Crianças menores de 10 anos sempre acompanhadas por adulto.',
  'TODOS', false,
  (SELECT pes_cod FROM gc_pessoa WHERE pes_cpf_cnpj = '11111111111')
WHERE NOT EXISTS (SELECT 1 FROM gc_comunicado WHERE com_titulo = 'Nova regra de uso da piscina');


-- ---------------------------------------------------------------------
-- 12) Vínculo COMUNICADO <-> CONDOMÍNIO (tabela de junção implícita do Prisma)
--     Tabela: _ComunicadoCondominio (A=com_cod, B=con_cod)
-- ---------------------------------------------------------------------

INSERT INTO "_ComunicadoCondominio" ("A","B")
SELECT cm.com_cod, c.con_cod
FROM gc_comunicado cm
CROSS JOIN gc_condominio c
WHERE cm.com_titulo IN (
  'Manutenção da bomba d''água',
  'Nova regra de uso da piscina'
)
ON CONFLICT DO NOTHING;

INSERT INTO "_ComunicadoCondominio" ("A","B")
SELECT cm.com_cod, c.con_cod
FROM gc_comunicado cm
JOIN gc_condominio c ON c.con_nome = 'Edifício Parque Verde'
WHERE cm.com_titulo = 'Assembleia ordinária 2026'
ON CONFLICT DO NOTHING;


COMMIT;


-- =====================================================================
-- CONFERÊNCIA RÁPIDA
-- =====================================================================
-- Rode os SELECTs abaixo para validar:
--
-- SELECT con_cod, con_nome FROM gc_condominio ORDER BY con_cod;
-- SELECT pes_cod, pes_nome, pes_email FROM gc_pessoa ORDER BY pes_cod;
-- SELECT u.uni_cod, c.con_nome, u.uni_bloco, u.uni_numero
--   FROM gc_unidade u JOIN gc_condominio c USING (con_cod) ORDER BY c.con_nome, u.uni_bloco, u.uni_numero;
-- SELECT a.are_cod, c.con_nome, a.nome, COUNT(t.tur_cod) AS turnos
--   FROM gc_area_comum a JOIN gc_condominio c USING (con_cod)
--   LEFT JOIN gc_area_comum_turno t USING (are_cod)
--   GROUP BY a.are_cod, c.con_nome, a.nome ORDER BY c.con_nome, a.nome;
-- SELECT r.res_cod, c.con_nome, a.nome, p.pes_nome, r.data, r.status
--   FROM gc_reserva r
--   JOIN gc_area_comum a ON a.are_cod = r.are_cod
--   JOIN gc_condominio c ON c.con_cod = a.con_cod
--   JOIN gc_pessoa p ON p.pes_cod = r.pes_cod_morador
--   ORDER BY r.data;
--
-- LOGINS DE TESTE (todos com senha 123456):
--   admin@condigtal.com         -> Admin Global
--   sindico1@condigtal.com      -> Síndico Jardim das Flores
--   sindico2@condigtal.com      -> Síndico Parque Verde
--   porteiro1@condigtal.com     -> Porteiro
--   ana.almeida@email.com       -> Morador Jardim
--   bruno.costa@email.com       -> Morador Jardim
--   carla.dias@email.com        -> Morador Jardim
--   diego.esteves@email.com     -> Morador Jardim
--   eliana.ferreira@email.com   -> Morador Parque Verde
--   fabio.goncalves@email.com   -> Morador Parque Verde
--   giovana.henriques@email.com -> Morador Parque Verde
--   henrique.iglesias@email.com -> Morador Parque Verde
-- =====================================================================
