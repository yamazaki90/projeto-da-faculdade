/* ══════════════════════════════════════
   ABRE & REZA — script.js
   ══════════════════════════════════════ */

/* ──────────────────────────────────────
   BANCO DE DADOS SIMULADO
   ────────────────────────────────────── */
const db = {
  produtos: [
    {
      id: 1,
      nome: "Tech Box Starter",
      descricao: "Acessórios tech essenciais: cabo USB-C, hub portátil e mais surpresas do universo digital.",
      preco: 89.90,
      categoria: "tech",
      badge: "Popular",
      badgeClass: ""
    },
    {
      id: 2,
      nome: "Gamer Box Pro",
      descricao: "Itens gamer exclusivos: mousepad, chaveiros colecionáveis e periféricos surpresa.",
      preco: 149.90,
      categoria: "games",
      badge: "🔥 Hot",
      badgeClass: "hot"
    },
    {
      id: 3,
      nome: "Lifestyle Essentials",
      descricao: "Produtos de bem-estar, papelaria premium e itens de decoração para o seu espaço.",
      preco: 99.90,
      categoria: "lifestyle",
      badge: "",
      badgeClass: ""
    },
    {
      id: 4,
      nome: "Premium Box Ultra",
      descricao: "Nossa caixa mais exclusiva. Produtos de alto valor, edições limitadas e itens raros.",
      preco: 249.90,
      categoria: "tech",
      badge: "⭐ Premium",
      badgeClass: ""
    },
    {
      id: 5,
      nome: "Kids Adventure Box",
      descricao: "Diversão garantida para os pequenos! Brinquedos, jogos e surpresas educativas.",
      preco: 79.90,
      categoria: "lifestyle",
      badge: "Novo",
      badgeClass: ""
    },
    {
      id: 6,
      nome: "Colecionador Box",
      descricao: "Itens de coleção de games, anime e cultura pop. Cada caixa é única e irrepetível.",
      preco: 189.90,
      categoria: "games",
      badge: "Exclusivo",
      badgeClass: ""
    },
  ],

  // Tabela clientes — preenchida via formulário de contato
  clientes: [],

  // Tabela pedidos — preenchida ao finalizar compra
  pedidos: [],

  // Contadores de auto-incremento (simulam SERIAL/AUTO_INCREMENT do SQL)
  nextClienteId: 1,
  nextPedidoId: 1,
};

/* ──────────────────────────────────────
   CLASSES DE COR DOS CARDS
   ────────────────────────────────────── */
const cardClasses = [
  "card-tech",
  "card-games",
  "card-lifestyle",
  "card-premium",
  "card-kids",
  "card-colecao"
];

/* ──────────────────────────────────────
   CARRINHO (estado em memória)
   ────────────────────────────────────── */
let carrinho = [];

/* ──────────────────────────────────────
   RENDERIZAR PRODUTOS
   SELECT * FROM produtos [WHERE categoria = ?]
   ────────────────────────────────────── */
function renderProdutos(lista) {
  const grid = document.getElementById("produtosGrid");
  grid.innerHTML = "";

  lista.forEach((p, i) => {
    const cc = cardClasses[i % cardClasses.length];
    grid.innerHTML += `
      <div class="produto-card ${cc}" data-id="${p.id}">
        ${p.badge ? `<div class="produto-badge ${p.badgeClass}">${p.badge}</div>` : ""}
        <div class="produto-visual">
          <div class="box-illustration">
            <div class="box-body"></div>
            <div class="box-lid"></div>
            <div class="box-ribbon-h"></div>
            <div class="box-ribbon-v"></div>
            <div class="box-bow">🎀</div>
          </div>
        </div>
        <div class="produto-info">
          <div class="produto-cat">${p.categoria.toUpperCase()}</div>
          <div class="produto-nome">${p.nome}</div>
          <div class="produto-desc">${p.descricao}</div>
          <div class="produto-footer">
            <div class="produto-preco">R$ ${p.preco.toFixed(2).replace(".", ",")}</div>
            <button class="btn-comprar" onclick="adicionarCarrinho(${p.id})">
              🛒 Comprar
            </button>
          </div>
        </div>
      </div>`;
  });
}

/* ──────────────────────────────────────
   FILTRAR PRODUTOS POR CATEGORIA
   ────────────────────────────────────── */
function filtrarProdutos(cat, btn) {
  document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");

  const lista = cat === "todos"
    ? db.produtos
    : db.produtos.filter(p => p.categoria === cat);

  renderProdutos(lista);
}

/* ──────────────────────────────────────
   CARRINHO — ADICIONAR ITEM
   ────────────────────────────────────── */
function adicionarCarrinho(prodId) {
  const prod = db.produtos.find(p => p.id === prodId);
  // Cada item recebe um ID único de carrinho para permitir remoção individual
  carrinho.push({ ...prod, carrinhoId: Date.now() + Math.random() });
  atualizarBadge();
  showToast("cart", "🎁 Adicionado!", `${prod.nome} foi para o carrinho!`);
}

/* ──────────────────────────────────────
   CARRINHO — ATUALIZAR BADGE NO NAV
   ────────────────────────────────────── */
function atualizarBadge() {
  document.getElementById("cartBadge").textContent = carrinho.length;
}

/* ──────────────────────────────────────
   CARRINHO — ABRIR MODAL
   ────────────────────────────────────── */
function openCart() {
  const body = document.getElementById("cartBody");

  if (carrinho.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="icon">🎁</div>
        Seu carrinho está vazio.<br>Que tal dar uma olhada nos produtos?
      </div>`;
  } else {
    const total = carrinho.reduce((soma, item) => soma + item.preco, 0);

    body.innerHTML =
      carrinho.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.nome}</div>
            <div class="cart-item-price">R$ ${item.preco.toFixed(2).replace(".", ",")}</div>
          </div>
          <button class="cart-item-remove" onclick="removerItem('${item.carrinhoId}')">🗑️</button>
        </div>`
      ).join("") +
      `<div class="cart-total">
        <span class="cart-total-label">Total</span>
        <span class="cart-total-value">R$ ${total.toFixed(2).replace(".", ",")}</span>
      </div>
      <button
        class="btn-primary"
        style="width:100%; justify-content:center; margin-top:20px;"
        onclick="finalizarCompra()"
      >
        ✅ Finalizar pedido
      </button>`;
  }

  document.getElementById("cartModal").classList.add("open");
}

/* ──────────────────────────────────────
   CARRINHO — FECHAR MODAL
   ────────────────────────────────────── */
function closeCart() {
  document.getElementById("cartModal").classList.remove("open");
}

/* ──────────────────────────────────────
   CARRINHO — REMOVER ITEM
   ────────────────────────────────────── */
function removerItem(cid) {
  carrinho = carrinho.filter(i => String(i.carrinhoId) !== String(cid));
  atualizarBadge();
  openCart(); // re-renderiza o modal
}

/* ──────────────────────────────────────
   CARRINHO — FINALIZAR PEDIDO
   INSERT INTO pedidos (id_cliente, produtos, data_pedido, total)
   ────────────────────────────────────── */
function finalizarCompra() {
  if (carrinho.length === 0) return;

  const pedido = {
    id: db.nextPedidoId++,
    id_cliente: null, // seria preenchido após login/cadastro real
    produtos: carrinho.map(i => i.id), // array de id_produto (chave estrangeira)
    data_pedido: new Date().toISOString(),
    total: carrinho.reduce((soma, i) => soma + i.preco, 0),
  };

  db.pedidos.push(pedido);

  // Limpa o carrinho
  carrinho = [];
  atualizarBadge();
  closeCart();

  showToast("success", "🎉 Pedido confirmado!", `Pedido #${pedido.id} realizado com sucesso!`);
}

/* ──────────────────────────────────────
   FORMULÁRIO DE CONTATO
   INSERT INTO clientes (nome, email)
   ────────────────────────────────────── */
function enviarContato(e) {
  e.preventDefault();

  const nome  = document.getElementById("contato-nome").value;
  const email = document.getElementById("contato-email").value;

  // Simula INSERT INTO clientes
  const cliente = {
    id: db.nextClienteId++,
    nome,
    email
  };

  db.clientes.push(cliente);

  document.getElementById("contatoForm").reset();
  showToast("success", "✉️ Mensagem enviada!", "Em breve entraremos em contato. Obrigado!");
}

/* ──────────────────────────────────────
   TOAST — NOTIFICAÇÃO
   ────────────────────────────────────── */
function showToast(type, title, msg) {
  const toast = document.getElementById("toast");
  const icon  = document.getElementById("toastIcon");

  document.getElementById("toastTitle").textContent = title;
  document.getElementById("toastMsg").textContent   = msg;

  icon.className   = `toast-icon ${type}`;
  icon.textContent = type === "success" ? "✅" : "🛒";

  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

/* ──────────────────────────────────────
   NAV MOBILE — MENU HAMBÚRGUER
   ────────────────────────────────────── */
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}

// Fecha menu ao clicar em um link
document.querySelectorAll(".nav-links a").forEach(a => {
  a.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("open");
  });
});

/* ──────────────────────────────────────
   MODAL — FECHAR AO CLICAR NO OVERLAY
   ────────────────────────────────────── */
document.getElementById("cartModal").addEventListener("click", function(e) {
  if (e.target === this) closeCart();
});

/* ──────────────────────────────────────
   INIT — Carrega produtos ao abrir a página
   ────────────────────────────────────── */
renderProdutos(db.produtos);
