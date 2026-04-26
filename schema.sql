CREATE DATABASE IF NOT EXISTS mystery_box_db;
USE mystery_box_db;

-- Tabela de Usuários (Com data de cadastro e saldo)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    saldo DECIMAL(10, 2) DEFAULT 0.00,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Itens (Com raridades diferentes)
CREATE TABLE IF NOT EXISTS itens (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    nome_item VARCHAR(100) NOT NULL,
    raridade ENUM('Comum', 'Raro', 'Épico', 'Lendário') NOT NULL,
    valor_estimado DECIMAL(10, 2) NOT NULL
);

-- Tabela de Caixas (Com descrição do que vem nela)
CREATE TABLE IF NOT EXISTS caixas (
    id_caixa INT AUTO_INCREMENT PRIMARY KEY,
    nome_caixa VARCHAR(50) NOT NULL,
    preco_caixa DECIMAL(10, 2) NOT NULL,
    descricao TEXT
);

-- Relacionamento entre as tabelas
CREATE TABLE IF NOT EXISTS itens_na_caixa (
    id_caixa INT,
    id_item INT,
    PRIMARY KEY (id_caixa, id_item),
    FOREIGN KEY (id_caixa) REFERENCES caixas(id_caixa) ON DELETE CASCADE,
    FOREIGN KEY (id_item) REFERENCES itens(id_item) ON DELETE CASCADE
);

-- DADOS DE TESTE (Para o grupo ter o que mostrar na apresentação)
INSERT INTO caixas (nome_caixa, preco_caixa, descricao) VALUES 
('Caixa Gamer Especial', 50.00, 'Pode conter acessórios de PC'),
('Caixa Mystery Luxo', 150.00, 'Itens de alta raridade');

INSERT INTO itens (nome_item, raridade, valor_estimado) VALUES 
('Mouse Pad RGB', 'Comum', 30.00),
('Keycap Artesanal', 'Raro', 80.00),
('Headset Wireless', 'Épico', 350.00),
('Placa de Vídeo RTX', 'Lendário', 2500.00);

-- Vinculando os itens às caixas
INSERT INTO itens_na_caixa (id_caixa, id_item) VALUES (1, 1), (1, 2), (2, 3), (2, 4);