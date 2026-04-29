-- ══════════════════════════════════════════════
--  ABRE & REZA — schema.sql
--  Execute este arquivo no MySQL antes de rodar o servidor
--
--  Como executar:
--    mysql -u root -p < schema.sql
--  Ou pelo MySQL Workbench: File > Run SQL Script
-- ══════════════════════════════════════════════

-- Cria o banco se não existir
CREATE DATABASE IF NOT EXISTS abreereza
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE abreereza;

-- ──────────────────────────────────────
-- Tabela: produtos
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS produtos (
  id        INT           NOT NULL AUTO_INCREMENT,
  nome      VARCHAR(120)  NOT NULL,
  descricao TEXT          NOT NULL,
  preco     DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(50)   NOT NULL DEFAULT 'geral',
  badge     VARCHAR(50)            DEFAULT '',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────
-- Tabela: clientes
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS clientes (
  id    INT          NOT NULL AUTO_INCREMENT,
  nome  VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────
-- Tabela: pedidos
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS pedidos (
  id          INT      NOT NULL AUTO_INCREMENT,
  id_cliente  INT               DEFAULT NULL,
  id_produto  INT      NOT NULL,
  data_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_pedido_cliente FOREIGN KEY (id_cliente) REFERENCES clientes (id) ON DELETE SET NULL,
  CONSTRAINT fk_pedido_produto FOREIGN KEY (id_produto) REFERENCES produtos  (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ──────────────────────────────────────
-- Seed: produtos iniciais
-- INSERT IGNORE evita duplicata se rodar o script mais de uma vez
-- ──────────────────────────────────────
INSERT IGNORE INTO produtos (id, nome, descricao, preco, categoria, badge) VALUES
  (1, 'Tech Box Starter',    'Acessórios tech essenciais: cabo USB-C, hub portátil e mais surpresas do universo digital.', 89.90,  'tech',      'Popular'),
  (2, 'Gamer Box Pro',       'Itens gamer exclusivos: mousepad, chaveiros colecionáveis e periféricos surpresa.',          149.90, 'games',     'Hot'),
  (3, 'Lifestyle Essentials','Produtos de bem-estar, papelaria premium e itens de decoração para o seu espaço.',           99.90,  'lifestyle', ''),
  (4, 'Premium Box Ultra',   'Nossa caixa mais exclusiva. Produtos de alto valor, edições limitadas e itens raros.',       249.90, 'tech',      'Premium'),
  (5, 'Kids Adventure Box',  'Diversão garantida para os pequenos! Brinquedos, jogos e surpresas educativas.',             79.90,  'lifestyle', 'Novo'),
  (6, 'Colecionador Box',    'Itens de coleção de games, anime e cultura pop. Cada caixa é única e irrepetível.',         189.90, 'games',     'Exclusivo');

-- ──────────────────────────────────────
-- Verifica o resultado
-- ──────────────────────────────────────
SELECT 'Banco criado com sucesso!' AS status;
SELECT COUNT(*) AS total_produtos FROM produtos;
