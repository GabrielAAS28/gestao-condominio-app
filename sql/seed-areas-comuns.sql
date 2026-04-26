-- =====================================================================
-- SEED: Áreas Comuns + Turnos para um condomínio
-- =====================================================================
-- INSTRUÇÕES:
--   1) Descubra o con_cod do condomínio onde quer cadastrar:
--        SELECT con_cod, con_nome FROM gc_condominio;
--   2) Substitua 1 (na linha "SET @CON := 1;" abaixo) pelo con_cod desejado.
--   3) Execute o script no banco da API.
--
-- Compatível com: PostgreSQL (via prisma).
-- Para rodar em PostgreSQL substitua "@CON" por uma variável psql ou
-- troque cada referência por o número diretamente.
-- =====================================================================

-- ============ AJUSTE AQUI O ID DO CONDOMÍNIO ============
-- Postgres não tem variáveis de sessão como @, então vamos inline com 1.
-- Troque todos os "1::int" abaixo pelo seu con_cod desejado, OU rode
-- num client que aceite \set, por exemplo:
--   \set con_cod 1
--   ... e depois use :con_cod nas inserts.
-- ========================================================

-- ---------- Salão de Festas ----------
INSERT INTO gc_area_comum
  (con_cod, nome, descricao, termos_uso, capacidade_maxima, permite_convidados,
   limite_convidados, dias_antecedencia_min, dias_antecedencia_max, ativa, taxa_valor)
VALUES
  (1, 'Salão de Festas',
   'Espaço para eventos e festas particulares dos moradores.',
   'O morador é responsável pela limpeza e por danos. Limite de convidados conforme cadastro.',
   80, true, 50, 2, 60, true, 250.00)
RETURNING are_cod;

-- ---------- Piscina ----------
INSERT INTO gc_area_comum
  (con_cod, nome, descricao, termos_uso, capacidade_maxima, permite_convidados,
   limite_convidados, dias_antecedencia_min, dias_antecedencia_max, ativa, taxa_valor)
VALUES
  (1, 'Piscina',
   'Área de lazer com piscina adulto e infantil.',
   'Uso somente com traje de banho. Crianças apenas acompanhadas. Sem festas.',
   30, true, 6, 1, 30, true, NULL)
RETURNING are_cod;

-- ---------- Churrasqueira ----------
INSERT INTO gc_area_comum
  (con_cod, nome, descricao, termos_uso, capacidade_maxima, permite_convidados,
   limite_convidados, dias_antecedencia_min, dias_antecedencia_max, ativa, taxa_valor)
VALUES
  (1, 'Churrasqueira',
   'Área externa com churrasqueira a carvão.',
   'Limpeza obrigatória após o uso. Proibido som alto após as 22h.',
   25, true, 15, 1, 30, true, 80.00)
RETURNING are_cod;

-- ---------- Academia ----------
INSERT INTO gc_area_comum
  (con_cod, nome, descricao, termos_uso, capacidade_maxima, permite_convidados,
   limite_convidados, dias_antecedencia_min, dias_antecedencia_max, ativa, taxa_valor)
VALUES
  (1, 'Academia',
   'Equipamentos de musculação e cardio.',
   'Uso individual. Limpeza dos equipamentos após o uso.',
   10, false, 0, 0, 7, true, NULL)
RETURNING are_cod;


-- =====================================================================
-- TURNOS
-- =====================================================================
-- Os are_cod abaixo assumem ordem e numeração consecutiva começando em 1.
-- Após rodar os INSERTs acima e ver os are_cod retornados,
-- TROQUE os 4 valores (1, 2, 3, 4) abaixo pelos are_cod reais.
-- =====================================================================

-- Turnos do Salão de Festas (are_cod=1)
INSERT INTO gc_area_comum_turno (are_cod, nome, hora_inicio, hora_fim, ativo) VALUES
  (1, 'Tarde',  '14:00:00', '18:00:00', true),
  (1, 'Noite',  '19:00:00', '23:00:00', true);

-- Turnos da Piscina (are_cod=2)
INSERT INTO gc_area_comum_turno (are_cod, nome, hora_inicio, hora_fim, ativo) VALUES
  (2, 'Manhã',   '08:00:00', '12:00:00', true),
  (2, 'Tarde',   '13:00:00', '18:00:00', true);

-- Turnos da Churrasqueira (are_cod=3)
INSERT INTO gc_area_comum_turno (are_cod, nome, hora_inicio, hora_fim, ativo) VALUES
  (3, 'Almoço',  '11:00:00', '16:00:00', true),
  (3, 'Jantar',  '18:00:00', '23:00:00', true);

-- Turnos da Academia (are_cod=4)
INSERT INTO gc_area_comum_turno (are_cod, nome, hora_inicio, hora_fim, ativo) VALUES
  (4, 'Manhã',  '06:00:00', '11:00:00', true),
  (4, 'Tarde',  '14:00:00', '18:00:00', true),
  (4, 'Noite',  '19:00:00', '22:00:00', true);

-- =====================================================================
-- CONFERÊNCIA
-- =====================================================================
-- SELECT a.are_cod, a.nome, a.taxa_valor, a.capacidade_maxima,
--        COUNT(t.tur_cod) AS qtd_turnos
-- FROM gc_area_comum a
-- LEFT JOIN gc_area_comum_turno t ON t.are_cod = a.are_cod
-- WHERE a.con_cod = 1
-- GROUP BY a.are_cod
-- ORDER BY a.are_cod;
