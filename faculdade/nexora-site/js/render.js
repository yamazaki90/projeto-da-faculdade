// ============================================================
// render.js -- Funcoes que geram HTML a partir do banco de dados
// ============================================================

/** Escapa HTML para evitar XSS */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Renderiza os 3 primeiros servicos na Home */
function renderFeaturedServices() {
  const container = document.getElementById('featuredServices');
  if (!container) return;
  container.innerHTML = DB.services.slice(0, 3).map(s => `
    <div class="card reveal">
      <div class="card-icon">${s.icon}</div>
      <h3>${esc(s.name)}</h3>
      <p>${esc(s.desc)}</p>
      <span class="card-price">${esc(s.price)}</span>
    </div>
  `).join('');
  setTimeout(initReveal, 100);
}

/** Renderiza todos os servicos na pagina Servicos */
function renderServices() {
  const container = document.getElementById('servicesList');
  if (!container) return;
  container.innerHTML = DB.services.map(s => `
    <div class="card reveal">
      <div class="card-icon">${s.icon}</div>
      ${s.tag ? `<div class="project-tag">${esc(s.tag)}</div>` : ''}
      <h3>${esc(s.name)}</h3>
      <p>${esc(s.desc)}</p>
      <span class="card-price">${esc(s.price)}</span>
    </div>
  `).join('');
  setTimeout(initReveal, 100);
}

/** Renderiza os depoimentos na pagina Clientes */
function renderTestimonials() {
  const container = document.getElementById('testimonialsList');
  if (!container) return;
  container.innerHTML = DB.testimonials.map(t => `
    <div class="testimonial-card reveal">
      <div class="stars">${'★'.repeat(t.stars)}</div>
      <div class="project-tag">${esc(t.project)}</div>
      <p class="testimonial-text">"${esc(t.text)}"</p>
      <div class="client-info">
        <div class="client-avatar">${esc(t.avatar)}</div>
        <div>
          <div class="client-name">${esc(t.client)}</div>
          <div class="client-role">${esc(t.role)} · ${esc(t.company)}</div>
        </div>
      </div>
    </div>
  `).join('');
  setTimeout(initReveal, 100);
}

/** Renderiza a tabela de mensagens na pagina Contato */
function renderMessages() {
  const body  = document.getElementById('messagesBody');
  const noMsg = document.getElementById('noMessages');
  if (!body) return;

  if (DB.messages.length === 0) {
    body.innerHTML = '';
    noMsg.style.display = 'block';
    return;
  }

  noMsg.style.display = 'none';
  body.innerHTML = DB.messages.map(m => `
    <tr style="border-bottom:1px solid var(--border)">
      <td style="padding:.875rem 1rem;color:var(--muted);font-size:.8rem">#${m.id}</td>
      <td style="padding:.875rem 1rem;font-weight:500">${esc(m.name)}</td>
      <td style="padding:.875rem 1rem;color:var(--muted)">${esc(m.email)}</td>
      <td style="padding:.875rem 1rem"><span class="project-tag" style="margin:0">${esc(m.subject || '—')}</span></td>
      <td style="padding:.875rem 1rem;color:var(--muted);max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(m.message)}</td>
      <td style="padding:.875rem 1rem;color:var(--muted);font-size:.8rem;white-space:nowrap">${m.date}</td>
    </tr>
  `).join('');
}
