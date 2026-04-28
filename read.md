# 🎁 Abre & Reza — Caixas Surpresa

> Projeto de Extensão em Desenvolvimento de Software — UNINOVE 2026  
> Prof.ª Priscilla Viana Cunha

O projeto **Abre & Reza** é um sistema de e-commerce de caixas surpresa desenvolvido como trabalho integrador das disciplinas do semestre. A proposta conecta um **frontend web** em HTML, CSS e JavaScript a um **servidor backend em C** com **API RESTful** integrada ao **MySQL**, criando uma solução completa de cadastro, consulta e compra.

---

## 👥 Equipe

| Nome | Função | Responsabilidades |
| --- | --- | --- |
| Alana Vitorino Guimarães | Engenheira de Frontend | Desenvolvimento da interface do site |
| David Auleir de Lima Oliveira | CTO / Diretor de Tecnologia | Arquitetura do sistema e backend em C |
| Guilherme Ferreira Sindice | Engenheiro de Dados | Modelagem e estrutura do banco de dados |
| Gustavo Canevazzi da Silva | Engenheiro de Dados | Modelagem e estrutura do banco de dados |
| Kaique Silva Neves | Product Lead | Gestão do produto e suporte ao backend |
| Kleber Augusto Brilhante de Morais | Project Manager | Planejamento estratégico e documentação |
| Mariana Batista de Paula Vieira | QA & Quality Manager | Garantia de qualidade e organização do projeto |
| Thierry Fernando Magalhaes | Engenheiro de Dados | Modelagem e estrutura do banco de dados |

---

## 🏗️ Arquitetura do Projeto

```text
┌─────────────────────┐        HTTP / REST        ┌──────────────────────┐
│   Frontend (JS)     │ ◄───────────────────────► │   Servidor C         │
│   index.html        │   GET /api/produtos        │   server_mysql.c     │
│   style.css         │   POST /api/clientes       │   mongoose.h/.c      │
│   script.js         │   POST /api/pedidos        └──────────┬───────────┘
└─────────────────────┘   GET /api/pedidos                    │ MySQL Connector/C
                                                              ▼
                                                   ┌──────────────────────┐
                                                   │   MySQL              │
                                                   │   banco: abreereza    │
                                                   │   schema.sql          │
                                                   └──────────────────────┘
```

---

## 📁 Estrutura de Arquivos

```text
projeto-da-faculdade/
│
├── public/                  # Frontend (servido pelo servidor C)
│   ├── index.html           # Site principal (SPA)
│   ├── style.css            # Estilização e layout responsivo
│   └── script.js            # Lógica do e-commerce (carrinho, filtros, API)
│
├── server_mysql.c           # Servidor HTTP em C + integração MySQL
├── mongoose.c               # Biblioteca Mongoose (HTTP server, arquivo único)
├── mongoose.h               # Header da biblioteca Mongoose
├── schema.sql               # Criação do banco, tabelas e dados iniciais
├── Makefile_mysql           # Makefile para compilação no Windows (MinGW)
└── README.md                # Este arquivo
```

---

## 🌐 Site (Frontend)

Desenvolvido em **HTML**, **CSS** e **JavaScript puro** (sem frameworks).  
Funciona como SPA — todas as seções são navegadas sem recarregar a página.

### Seções

| Âncora | Nome | Descrição |
| --- | --- | --- |
| `#home` | Início | Hero, estatísticas e chamadas para ação |
| `#sobre` | Sobre | História, missão, seleção e entrega |
| `#produtos` | Produtos | Catálogo com filtros, carrinho e checkout |
| `#contato` | Contato | Formulário e informações de contato |

### Funcionalidades JavaScript (`script.js`)

- **Catálogo dinâmico** — produtos renderizados a partir de objeto `db` em memória.
- **Filtros por categoria** — Tecnologia, Games e Estilo de vida.
- **Carrinho de compras** — adicionar, remover itens, calcular total e abrir modal.
- **Finalizar pedido** — simula `INSERT INTO pedidos` com id autoincremental.
- **Formulário de contato** — simula `INSERT INTO clientes`.
- **Banco simulado** — objeto `db` espelha a estrutura das tabelas MySQL (produtos, clientes, pedidos).
- **Toast notifications** — feedback visual para ações do usuário.
- **Menu hamburger** — navegação responsiva para mobile.

---

## ⚙️ Servidor Backend em C

**Arquivo:** `server_mysql.c`  
**Biblioteca HTTP:** [Mongoose](https://mongoose.ws) (arquivo único, sem dependências extras)  
**Banco de dados:** MySQL via MySQL Connector/C

### Rotas da API

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/produtos` | Lista todos os produtos (`SELECT * FROM produtos`) |
| `GET` | `/api/produtos/:id` | Busca produto por id (`SELECT ... WHERE id = ?`) |
| `POST` | `/api/clientes` | Cadastra cliente (`INSERT INTO clientes`) |
| `POST` | `/api/pedidos` | Registra pedido (`INSERT INTO pedidos`) |
| `GET` | `/api/pedidos` | Lista pedidos com JOIN de clientes e produtos |

### Características do servidor

- CORS habilitado para comunicação com o frontend.
- Sanitização de entradas com `mysql_real_escape_string()` para reduzir risco de SQL Injection.
- Tratamento de e-mail duplicado (erro MySQL 1062).
- Suporte a pedidos anônimos (`id_cliente = NULL`).
- Serve arquivos estáticos da pasta `./public`.

---

## 🗄️ Banco de Dados (MySQL)

**Arquivo:** `schema.sql`  
**Banco:** `abreereza`

### Diagrama Entidade-Relacionamento

```text
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   clientes   │         │   pedidos    │         │   produtos   │
│──────────────│         │──────────────│         │──────────────│
│ id (PK)      │ 1     N │ id (PK)      │ N     1 │ id (PK)      │
│ nome         ├────────►│ id_cliente   │◄────────┤ nome         │
│ email UNIQUE │ SET NULL│ id_produto   │ CASCADE │ descricao    │
└──────────────┘         │ data_pedido  │         │ preco        │
                         └──────────────┘         │ categoria    │
                                                  │ badge        │
                                                  └──────────────┘
```

### Tabelas

**`produtos`** — catálogo de caixas surpresa.  
**`clientes`** — clientes cadastrados via formulário (e-mail único).  
**`pedidos`** — pedidos realizados, relacionados a cliente (opcional) e produto.

### Produtos cadastrados no seed

| # | Nome | Categoria | Preço | Badge |
| --- | --- | --- | --- | --- |
| 1 | Caixa Tech Starter | Tecnologia | R$ 89,90 | Popular |
| 2 | Caixa Gamer Pro | Games | R$ 149,90 | Hot |
| 3 | Caixa Essenciais | Estilo de vida | R$ 99,90 | — |
| 4 | Caixa Premium Ultra | Tecnologia | R$ 249,90 | Premium |
| 5 | Caixa Kids Adventure | Estilo de vida | R$ 79,90 | Novo |
| 6 | Caixa Colecionador | Games | R$ 189,90 | Exclusivo |

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- [MinGW-w64](https://www.mingw-w64.org/) com `gcc` no PATH.
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) rodando localmente.
- [MySQL Connector/C 6.1](https://dev.mysql.com/downloads/connector/c/) instalado em `C:/Program Files/MySQL/MySQL Connector C 6.1`.
- Arquivos `mongoose.c` e `mongoose.h` na raiz do projeto ([download aqui](https://github.com/cesanta/mongoose)).

### Passo a passo

**1. Criar o banco de dados**

```bash
mysql -u root -p < schema.sql
```

**2. Ajustar a senha do MySQL no código**  
Abra `server_mysql.c` e edite a linha:

```c
#define DB_PASS "macacos"   // ← coloque sua senha aqui
```

**3. Compilar o servidor**

```bash
mingw32-make
```

**4. Rodar o servidor**

```bash
server.exe
```

ou

```bash
mingw32-make run
```

**5. Acessar o site**  
Abra o navegador em: [http://localhost:8080](http://localhost:8080)

---

## 🛠️ Comandos úteis

```bash
mingw32-make          # compila o servidor
mingw32-make run      # compila e executa
mingw32-make clean    # remove o executável gerado
```

Consultas SQL úteis para verificar o banco:

```sql
-- Ver todos os produtos
SELECT * FROM produtos;

-- Ver pedidos com nome do cliente e produto
SELECT p.id, p.data_pedido,
       pr.nome AS produto, pr.preco,
       COALESCE(c.nome, 'Anônimo') AS cliente
FROM pedidos p
JOIN produtos pr ON pr.id = p.id_produto
LEFT JOIN clientes c ON c.id = p.id_cliente
ORDER BY p.id DESC;

-- Faturamento por produto
SELECT pr.nome, COUNT(p.id) AS pedidos, SUM(pr.preco) AS total
FROM pedidos p
JOIN produtos pr ON pr.id = p.id_produto
GROUP BY pr.id, pr.nome
ORDER BY total DESC;
```

---

## 📚 Disciplinas integradas

| Disciplina | Aplicação no projeto |
| --- | --- |
| Desenvolvimento para Internet | Site HTML/CSS/JS com SPA, filtros, carrinho e formulário |
| Algoritmos e Práticas de Programação | Servidor HTTP em C com API REST e integração MySQL |
| Modelagem de Banco de Dados | DER com 3 entidades, chaves primárias/estrangeiras e cardinalidades |
| Desenvolvimento em Banco de Dados | schema.sql, seed, scripts INSERT e consultas SELECT com JOIN |

---

_UNINOVE — Projeto de Extensão em Desenvolvimento de Software — 2026_
```

Se você quiser, eu posso agora montar a **versão final com tom mais acadêmico e formal**, mantendo exatamente o mesmo conteúdo.

Fontes
[1] Code-index.html-projeto-da-faculdade.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/79762756/04f26bb2-d9ee-4605-99d9-ae4c54fea1e2/Code-index.html-projeto-da-faculdade.jpeg
[2] doc_abreereza_v2.docx https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/79762756/397361eb-5ceb-4204-a2f6-765d10dddd2e/doc_abreereza_v2.docx
