// ============================================================
// database.js -- Dados e persistencia (simula banco de dados)
// ============================================================

const DB = {

  // -- SERVICOS --
  services: [
    { id:1, icon:'💻', name:'Desenvolvimento Web',    desc:'Aplicacoes web modernas, escalaveis e de alta performance. React, Vue, Node.js e muito mais.',   price:'A partir de R$ 8.000',   tag:'Mais popular' },
    { id:2, icon:'📱', name:'Apps Mobile',            desc:'Apps nativos e cross-platform para iOS e Android com experiencias excepcionais ao usuario.',       price:'A partir de R$ 12.000',  tag:'' },
    { id:3, icon:'🎨', name:'UX/UI Design',           desc:'Design centrado no usuario, interfaces intuitivas e identidade visual que convertem.',             price:'A partir de R$ 4.500',   tag:'' },
    { id:4, icon:'🛒', name:'E-commerce',             desc:'Lojas virtuais completas com gestao de estoque, pagamentos integrados e painel administrativo.',   price:'A partir de R$ 15.000',  tag:'' },
    { id:5, icon:'☁️', name:'Cloud e DevOps',         desc:'Infraestrutura em nuvem, CI/CD, monitoramento e escalabilidade automatica para seu sistema.',     price:'A partir de R$ 5.000/mes',tag:'' },
    { id:6, icon:'🔒', name:'Seguranca Digital',      desc:'Auditoria de seguranca, pentest, LGPD e protecao de dados para sua empresa.',                     price:'A partir de R$ 6.000',   tag:'' },
    { id:7, icon:'📊', name:'Business Intelligence',  desc:'Dashboards, relatorios e analise de dados para tomada de decisao estrategica.',                   price:'A partir de R$ 7.500',   tag:'' },
    { id:8, icon:'🤖', name:'Inteligencia Artificial',desc:'Chatbots, automacao inteligente, visao computacional e modelos de ML sob medida.',                price:'A partir de R$ 20.000',  tag:'Novo' },
    { id:9, icon:'🔗', name:'Integracoes e APIs',     desc:'Conecte sistemas legados, ERPs, CRMs e servicos externos com APIs robustas e seguras.',           price:'A partir de R$ 3.500',   tag:'' },
  ],

  // -- DEPOIMENTOS --
  testimonials: [
    { id:1, client:'Ana Rodrigues',  role:'CEO',               company:'TechFarm',     project:'Plataforma SaaS',       text:'A Nexora transformou completamente nosso produto. A qualidade tecnica e o comprometimento da equipe superaram todas as expectativas.', stars:5, avatar:'AR' },
    { id:2, client:'Marcos Lima',    role:'Diretor de TI',     company:'GrupoSaude+',  project:'App Mobile',            text:'Entregaram um app mobile para 50 mil usuarios em apenas 4 meses. Processo organizado, comunicacao impecavel e resultado excelente.',   stars:5, avatar:'ML' },
    { id:3, client:'Fernanda Costa', role:'CMO',               company:'Varejo360',    project:'E-commerce',            text:'Nosso e-commerce triplicou as conversoes em 6 meses. O time de UX/UI da Nexora e simplesmente incrivel.',                              stars:5, avatar:'FC' },
    { id:4, client:'Ricardo Alves',  role:'CTO',               company:'FinTech Agil', project:'Integracao bancaria',   text:'Implementaram integracoes bancarias complexas com seguranca e eficiencia. Parceria de longo prazo garantida.',                         stars:5, avatar:'RA' },
    { id:5, client:'Juliana Mendes', role:'Fundadora',         company:'EduPlay',      project:'Plataforma educacional',text:'Do zero ao produto em 5 meses. A Nexora foi um parceiro estrategico fundamental para o lancamento da nossa startup.',                 stars:5, avatar:'JM' },
    { id:6, client:'Carlos Duarte',  role:'Gerente de Produto',company:'LogiFlow',     project:'Dashboard BI',          text:'Os dashboards de BI desenvolvidos pela Nexora mudaram a forma como tomamos decisoes. ROI percebido em semanas.',                      stars:5, avatar:'CD' },
  ],

  // -- MENSAGENS (armazenadas via localStorage) --
  messages:   [],
  nextMsgId:  1,

  /** Salva uma nova mensagem e persiste no localStorage */
  saveMessage(data) {
    const msg = { id: this.nextMsgId++, ...data, date: new Date().toLocaleString('pt-BR') };
    this.messages.push(msg);
    this._persist();
    return msg;
  },

  /** Persiste os dados no localStorage */
  _persist() {
    try {
      localStorage.setItem('nexora_messages', JSON.stringify(this.messages));
      localStorage.setItem('nexora_next_id',  String(this.nextMsgId));
    } catch (e) { console.warn('localStorage indisponivel', e); }
  },

  /** Carrega dados do localStorage na inicializacao */
  _load() {
    try {
      const msgs = localStorage.getItem('nexora_messages');
      const nid  = localStorage.getItem('nexora_next_id');
      if (msgs) this.messages  = JSON.parse(msgs);
      if (nid)  this.nextMsgId = parseInt(nid, 10);
    } catch (e) { console.warn('Erro ao carregar localStorage', e); }
  },
};

// Carrega mensagens salvas ao iniciar
DB._load();
