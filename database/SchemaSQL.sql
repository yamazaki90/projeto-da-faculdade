CREATE DATABASE IF NOT EXISTS mystery_box_db;
USE mystery_box_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    saldo DECIMAL(10, 2) DEFAULT 0.00,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS itens (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    nome_item VARCHAR(100) NOT NULL,
    raridade ENUM('Comum', 'Raro', 'Épico', 'Lendário') NOT NULL,
    valor_estimado DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS caixas (
    id_caixa INT AUTO_INCREMENT PRIMARY KEY,
    nome_caixa VARCHAR(50) NOT NULL,
    preco_caixa DECIMAL(10, 2) NOT NULL,
    descricao TEXT
);

CREATE TABLE IF NOT EXISTS itens_na_caixa (
    id_caixa INT,
    id_item INT,
    PRIMARY KEY (id_caixa, id_item),
    FOREIGN KEY (id_caixa) REFERENCES caixas(id_caixa) ON DELETE CASCADE,
    FOREIGN KEY (id_item) REFERENCES itens(id_item) ON DELETE CASCADE
);

INSERT INTO caixas (nome_caixa, preco_caixa, descricao) VALUES 
('Caixa Gamer Especial', 50.00, 'Pode conter acessórios de PC'),
('Caixa Mystery Luxo', 150.00, 'Itens de alta raridade');

INSERT INTO itens (nome_item, raridade, valor_estimado) VALUES 
('Mouse Pad RGB', 'Comum', 30.00),
('Keycap Artesanal', 'Raro', 80.00),
('Headset Wireless', 'Épico', 350.00),
('Placa de Vídeo RTX', 'Lendário', 2500.00);

INSERT INTO itens_na_caixa (id_caixa, id_item) VALUES (1, 1), (1, 2), (2, 3), (2, 4);

INSERT INTO usuarios (nome, email, senha, saldo) VALUES 
('Thierry Magalhaes', 'tmagalhaes@email.com', 'senha123', 200.00),
('Usuario Teste', 'aluno@email.com', 'estudante2026', 10.00);

UPDATE usuarios SET saldo = saldo - 50.00 WHERE id_usuario = 1;

SELECT c.nome_caixa, i.nome_item, i.raridade, i.valor_estimado
FROM caixas c
JOIN itens_na_caixa ic ON c.id_caixa = ic.id_caixa
JOIN itens i ON ic.id_item = i.id_item
WHERE c.id_caixa = 1;

SELECT raridade, COUNT(*) AS total_itens 
FROM itens 
GROUP BY raridade;

SELECT nome, saldo FROM usuarios WHERE saldo < 150.00;