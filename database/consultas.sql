SELECT 
    c.nome_caixa, 
    i.nome_item, 
    i.raridade, 
    i.valor_estimado
FROM caixas c
JOIN itens_na_caixa ic ON c.id_caixa = ic.id_caixa
JOIN itens i ON ic.id_item = i.id_item
ORDER BY c.nome_caixa;

SELECT 
    nome, 
    email, 
    saldo 
FROM usuarios 
ORDER BY saldo DESC;

SELECT 
    raridade, 
    COUNT(*) AS total_itens 
FROM itens 
GROUP BY raridade;

SELECT 
    nome, 
    saldo 
FROM usuarios 
WHERE saldo < 150.00;

SELECT 
    i.nome_item, 
    i.raridade, 
    i.valor_estimado
FROM itens i
JOIN itens_na_caixa ic ON i.id_item = ic.id_item
JOIN caixas c ON ic.id_caixa = c.id_caixa
WHERE c.nome_caixa = 'Caixa Gamer Especial';
