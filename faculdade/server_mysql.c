/*
 * ══════════════════════════════════════════════
 *  ABRE & REZA — Backend em C
 *  server.c  (versão MySQL)
 *
 *  Dependências:
 *    - mongoose.h / mongoose.c   (HTTP server, arquivo único)
 *    - mysql.h                   (cliente MySQL — vem com MySQL Connector/C)
 *
 *  Compilar no Windows (MinGW):
 *    gcc server.c mongoose.c -o server.exe ^
 *        -I"C:/Program Files/MySQL/MySQL Connector C 6.1/include" ^
 *        -L"C:/Program Files/MySQL/MySQL Connector C 6.1/lib" ^
 *        -lmysql -lws2_32 -Wall
 *
 *  Rodar:
 *    server.exe
 *    Acesse: http://localhost:8080
 * ══════════════════════════════════════════════
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "mongoose.h"
#include <mysql.h>

/* ── Porta do servidor ── */
#define SERVER_PORT "http://0.0.0.0:8080"

/* ── Configurações de conexão MySQL ── */
#define DB_HOST     "localhost"
#define DB_USER     "root"
#define DB_PASS     "macacos"   /* <- senha do servidor, mude se quiser*/
#define DB_NAME     "abreereza"
#define DB_PORT     3306

/* ── Tamanho máximo do buffer de resposta JSON ── */
#define JSON_BUF 8192

/* Instância global da conexão MySQL */
static MYSQL *db;

/* ══════════════════════════════════════════════
   BANCO DE DADOS — Conexão
   ══════════════════════════════════════════════ */
static int db_connect(void) {
    db = mysql_init(NULL);
    if (!db) {
        fprintf(stderr, "[DB] Falha ao inicializar MySQL\n");
        return 0;
    }

    if (!mysql_real_connect(db, DB_HOST, DB_USER, DB_PASS,
                            DB_NAME, DB_PORT, NULL, 0)) {
        fprintf(stderr, "[DB] Erro de conexão: %s\n", mysql_error(db));
        return 0;
    }

    /* Força UTF-8 para suporte a caracteres especiais (ç, ã, etc.) */
    mysql_set_character_set(db, "utf8mb4");

    printf("[DB] Conectado ao MySQL: %s@%s/%s\n", DB_USER, DB_HOST, DB_NAME);
    return 1;
}

/* ══════════════════════════════════════════════
   HELPERS — JSON e HTTP
   ══════════════════════════════════════════════ */

/* Envia resposta JSON com CORS habilitado */
static void send_json(struct mg_connection *c, int status, const char *body) {
    mg_http_reply(c, status,
        "Content-Type: application/json\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
        "Access-Control-Allow-Headers: Content-Type\r\n",
        "%s", body
    );
}

/* Escapa string para evitar SQL Injection */
static void db_escape(char *out, size_t out_sz, const char *in) {
    mysql_real_escape_string(db, out, in, (unsigned long)strlen(in));
    (void)out_sz;
}

/* ══════════════════════════════════════════════
   ROTA: GET /api/produtos
   SELECT * FROM produtos
   ══════════════════════════════════════════════ */
static void route_get_produtos(struct mg_connection *c) {
    char buf[JSON_BUF];
    int  pos   = 0;
    int  first = 1;

    const char *sql = "SELECT id, nome, descricao, preco, categoria, badge "
                      "FROM produtos ORDER BY id ASC";

    if (mysql_query(db, sql) != 0) {
        fprintf(stderr, "[DB] Erro: %s\n", mysql_error(db));
        send_json(c, 500, "{\"erro\":\"Erro ao buscar produtos\"}");
        return;
    }

    MYSQL_RES *res = mysql_store_result(db);
    MYSQL_ROW  row;

    pos += snprintf(buf + pos, sizeof(buf) - pos, "{\"produtos\":[");

    while ((row = mysql_fetch_row(res)) != NULL) {
        if (!first) pos += snprintf(buf + pos, sizeof(buf) - pos, ",");

        pos += snprintf(buf + pos, sizeof(buf) - pos,
            "{\"id\":%s,\"nome\":\"%s\",\"descricao\":\"%s\","
            "\"preco\":%s,\"categoria\":\"%s\",\"badge\":\"%s\"}",
            row[0],                    /* id      */
            row[1] ? row[1] : "",      /* nome    */
            row[2] ? row[2] : "",      /* descricao */
            row[3] ? row[3] : "0",     /* preco   */
            row[4] ? row[4] : "",      /* categoria */
            row[5] ? row[5] : "");     /* badge   */
        first = 0;
    }

    mysql_free_result(res);
    pos += snprintf(buf + pos, sizeof(buf) - pos, "]}");
    send_json(c, 200, buf);
}

/* ══════════════════════════════════════════════
   ROTA: GET /api/produtos/:id
   SELECT * FROM produtos WHERE id = ?
   ══════════════════════════════════════════════ */
static void route_get_produto_by_id(struct mg_connection *c, int id) {
    char sql[256];
    char buf[JSON_BUF];

    snprintf(sql, sizeof(sql),
        "SELECT id, nome, descricao, preco, categoria, badge "
        "FROM produtos WHERE id = %d", id);

    if (mysql_query(db, sql) != 0) {
        send_json(c, 500, "{\"erro\":\"Erro ao buscar produto\"}");
        return;
    }

    MYSQL_RES *res = mysql_store_result(db);
    MYSQL_ROW  row = mysql_fetch_row(res);

    if (row) {
        snprintf(buf, sizeof(buf),
            "{\"id\":%s,\"nome\":\"%s\",\"descricao\":\"%s\","
            "\"preco\":%s,\"categoria\":\"%s\",\"badge\":\"%s\"}",
            row[0], row[1] ? row[1] : "", row[2] ? row[2] : "",
            row[3] ? row[3] : "0", row[4] ? row[4] : "",
            row[5] ? row[5] : "");
        send_json(c, 200, buf);
    } else {
        send_json(c, 404, "{\"erro\":\"Produto não encontrado\"}");
    }

    mysql_free_result(res);
}

/* ══════════════════════════════════════════════
   ROTA: POST /api/clientes
   Body: {"nome":"João gay","email":"joaoembaixadinha@email.com"}
   INSERT INTO clientes ...
   ══════════════════════════════════════════════ */
static void route_post_clientes(struct mg_connection *c, struct mg_http_message *hm) {
    char nome[128]       = {0};
    char email[128]      = {0};
    char nome_esc[257]   = {0};
    char email_esc[257]  = {0};
    char sql[512];
    char buf[512];

    /* Extrai campos do JSON */
    mg_json_get_str(hm->body, "$.nome",  nome,  sizeof(nome));
    mg_json_get_str(hm->body, "$.email", email, sizeof(email));

    if (strlen(nome) == 0 || strlen(email) == 0) {
        send_json(c, 400, "{\"erro\":\"Nome e email são obrigatórios\"}");
        return;
    }

    /* Escapa para evitar SQL Injection */
    db_escape(nome_esc,  sizeof(nome_esc),  nome);
    db_escape(email_esc, sizeof(email_esc), email);

    snprintf(sql, sizeof(sql),
        "INSERT INTO clientes (nome, email) VALUES ('%s', '%s')",
        nome_esc, email_esc);

    if (mysql_query(db, sql) == 0) {
        unsigned long long new_id = mysql_insert_id(db);
        snprintf(buf, sizeof(buf),
            "{\"sucesso\":true,\"id\":%llu,\"nome\":\"%s\",\"email\":\"%s\"}",
            new_id, nome, email);
        send_json(c, 201, buf);
        printf("[DB] Novo cliente: id=%llu nome=%s\n", new_id, nome);
    } else {
        /* Erro 1062 = Duplicate entry (email já existe) */
        if (mysql_errno(db) == 1062) {
            send_json(c, 409, "{\"erro\":\"Email já cadastrado\"}");
        } else {
            fprintf(stderr, "[DB] Erro: %s\n", mysql_error(db));
            send_json(c, 500, "{\"erro\":\"Erro ao cadastrar cliente\"}");
        }
    }
}

/* ══════════════════════════════════════════════
   ROTA: POST /api/pedidos
   Body: {"id_cliente":1,"id_produto":2}
   INSERT INTO pedidos ...
   ══════════════════════════════════════════════ */
static void route_post_pedidos(struct mg_connection *c, struct mg_http_message *hm) {
    double id_cliente_d = 0, id_produto_d = 0;
    char sql[512];
    char buf[256];

    mg_json_get_num(hm->body, "$.id_cliente", &id_cliente_d);
    mg_json_get_num(hm->body, "$.id_produto", &id_produto_d);

    int id_produto  = (int)id_produto_d;
    int id_cliente  = (int)id_cliente_d;

    if (id_produto <= 0) {
        send_json(c, 400, "{\"erro\":\"id_produto é obrigatório\"}");
        return;
    }

    /* id_cliente pode ser 0 (pedido anônimo) — usa NULL no banco */
    if (id_cliente > 0) {
        snprintf(sql, sizeof(sql),
            "INSERT INTO pedidos (id_cliente, id_produto, data_pedido) "
            "VALUES (%d, %d, NOW())",
            id_cliente, id_produto);
    } else {
        snprintf(sql, sizeof(sql),
            "INSERT INTO pedidos (id_cliente, id_produto, data_pedido) "
            "VALUES (NULL, %d, NOW())",
            id_produto);
    }

    if (mysql_query(db, sql) == 0) {
        unsigned long long new_id = mysql_insert_id(db);
        snprintf(buf, sizeof(buf),
            "{\"sucesso\":true,\"id\":%llu,\"id_produto\":%d}",
            new_id, id_produto);
        send_json(c, 201, buf);
        printf("[DB] Novo pedido: id=%llu produto=%d\n", new_id, id_produto);
    } else {
        fprintf(stderr, "[DB] Erro: %s\n", mysql_error(db));
        send_json(c, 500, "{\"erro\":\"Erro ao registrar pedido\"}");
    }
}

/* ══════════════════════════════════════════════
   ROTA: GET /api/pedidos
   SELECT com JOIN em clientes e produtos
   ══════════════════════════════════════════════ */
static void route_get_pedidos(struct mg_connection *c) {
    char buf[JSON_BUF];
    int  pos   = 0;
    int  first = 1;

    const char *sql =
        "SELECT p.id, p.data_pedido, "
        "       pr.nome AS produto, pr.preco, "
        "       COALESCE(c.nome, 'Anônimo') AS cliente "
        "FROM pedidos p "
        "JOIN produtos pr ON pr.id = p.id_produto "
        "LEFT JOIN clientes c ON c.id = p.id_cliente "
        "ORDER BY p.id DESC";

    if (mysql_query(db, sql) != 0) {
        fprintf(stderr, "[DB] Erro: %s\n", mysql_error(db));
        send_json(c, 500, "{\"erro\":\"Erro ao buscar pedidos\"}");
        return;
    }

    MYSQL_RES *res = mysql_store_result(db);
    MYSQL_ROW  row;

    pos += snprintf(buf + pos, sizeof(buf) - pos, "{\"pedidos\":[");

    while ((row = mysql_fetch_row(res)) != NULL) {
        if (!first) pos += snprintf(buf + pos, sizeof(buf) - pos, ",");

        pos += snprintf(buf + pos, sizeof(buf) - pos,
            "{\"id\":%s,\"data\":\"%s\",\"produto\":\"%s\","
            "\"preco\":%s,\"cliente\":\"%s\"}",
            row[0],
            row[1] ? row[1] : "",
            row[2] ? row[2] : "",
            row[3] ? row[3] : "0",
            row[4] ? row[4] : "Anônimo");
        first = 0;
    }

    mysql_free_result(res);
    pos += snprintf(buf + pos, sizeof(buf) - pos, "]}");
    send_json(c, 200, buf);
}

/* ══════════════════════════════════════════════
   HANDLER PRINCIPAL — Roteador HTTP
   ══════════════════════════════════════════════ */
static void fn(struct mg_connection *c, int ev, void *ev_data) {
    if (ev != MG_EV_HTTP_MSG) return;

    struct mg_http_message *hm = (struct mg_http_message *)ev_data;

    /* ── Preflight CORS (OPTIONS) ── */
    if (mg_match(hm->method, mg_str("OPTIONS"), NULL)) {
        mg_http_reply(c, 204,
            "Access-Control-Allow-Origin: *\r\n"
            "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
            "Access-Control-Allow-Headers: Content-Type\r\n", "");
        return;
    }

    /* ── GET /api/produtos ── */
    if (mg_match(hm->uri, mg_str("/api/produtos"), NULL) &&
        mg_match(hm->method, mg_str("GET"), NULL)) {
        route_get_produtos(c);
        return;
    }

    /* ── GET /api/produtos/:id ── */
    if (mg_match(hm->method, mg_str("GET"), NULL)) {
        struct mg_str cap = mg_str("");
        if (mg_match(hm->uri, mg_str("/api/produtos/*"), &cap)) {
            char id_str[16] = {0};
            snprintf(id_str, sizeof(id_str), "%.*s", (int)cap.len, cap.buf);
            route_get_produto_by_id(c, atoi(id_str));
            return;
        }
    }

    /* ── POST /api/clientes ── */
    if (mg_match(hm->uri, mg_str("/api/clientes"), NULL) &&
        mg_match(hm->method, mg_str("POST"), NULL)) {
        route_post_clientes(c, hm);
        return;
    }

    /* ── POST /api/pedidos ── */
    if (mg_match(hm->uri, mg_str("/api/pedidos"), NULL) &&
        mg_match(hm->method, mg_str("POST"), NULL)) {
        route_post_pedidos(c, hm);
        return;
    }

    /* ── GET /api/pedidos ── */
    if (mg_match(hm->uri, mg_str("/api/pedidos"), NULL) &&
        mg_match(hm->method, mg_str("GET"), NULL)) {
        route_get_pedidos(c);
        return;
    }

    /* ── Arquivos estáticos (HTML, CSS, JS) ── */
    struct mg_http_serve_opts opts = {.root_dir = "./public"};
    mg_http_serve_dir(c, hm, &opts);
}

/* ══════════════════════════════════════════════
   MAIN
   ══════════════════════════════════════════════ */
int main(void) {
    struct mg_mgr mgr;

    /* Conecta ao MySQL */
    if (!db_connect()) {
        fprintf(stderr, "[ERRO] Não foi possível conectar ao MySQL.\n");
        fprintf(stderr, "       Verifique DB_HOST, DB_USER, DB_PASS e DB_NAME em server.c\n");
        return 1;
    }

    /* Inicializa o event loop do mongoose */
    mg_mgr_init(&mgr);
    mg_http_listen(&mgr, SERVER_PORT, fn, NULL);

    printf("╔══════════════════════════════════════╗\n");
    printf("║   Abre & Reza — Backend C (MySQL)    ║\n");
    printf("║   http://localhost:8080               ║\n");
    printf("╚══════════════════════════════════════╝\n");
    printf("\nRotas disponíveis:\n");
    printf("  GET  /api/produtos\n");
    printf("  GET  /api/produtos/:id\n");
    printf("  POST /api/clientes\n");
    printf("  POST /api/pedidos\n");
    printf("  GET  /api/pedidos\n\n");

    /* Loop principal */
    for (;;) {
        mg_mgr_poll(&mgr, 1000);
    }

    /* Limpeza */
    mg_mgr_free(&mgr);
    mysql_close(db);
    return 0;
}
