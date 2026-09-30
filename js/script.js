// Micklu Chocolates — interações da página.
// O conteúdo (cardápio, fotos, contatos) fica em js/config.js.
(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const esc = (v) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const waLink = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

  // ---- Links do WhatsApp e do iFood (usam o config.js) ----
  function wireLinks() {
    $$(".wa").forEach((a) => {
      a.href = waLink("Olá, Micklu! Vim pelo site e gostaria de fazer um pedido. 🍫");
      a.target = "_blank";
      a.rel = "noopener";
    });
    $$(".ifood").forEach((a) => {
      a.href = IFOOD_URL;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  // ---- Efeito de entrada (só se o navegador permitir) ----
  let io = null;
  function observeReveal() {
    const items = $$(".reveal:not(.show)");
    if (!("IntersectionObserver" in window)) {
      items.forEach((x) => x.classList.add("show"));
      return;
    }
    io = io || new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
      }),
      { threshold: 0.08 }
    );
    items.forEach((x) => io.observe(x));
  }

  // ---- Cardápio ----
  function cardHtml(x) {
    const img = x.foto
      ? `<img loading="lazy" decoding="async" width="900" height="1200" src="${esc(x.foto)}" alt="${esc(x.alt || x.nome)}">`
      : `<div class="card-noimg" aria-hidden="true">🍫</div>`;
    return `<article class="card reveal">
      ${img}
      <div class="card-body">
        ${x.tag ? `<span class="tag">${esc(x.tag)}</span>` : ""}
        <h3>${esc(x.nome)}</h3>
        <p>${esc(x.descricao)}</p>
      </div>
    </article>`;
  }

  function renderMenu(items) {
    const grid = $("#menuGrid");
    if (!grid) return;
    grid.setAttribute("aria-busy", "false");
    grid.innerHTML = items.map(cardHtml).join("");
    observeReveal();
  }

  // Lê CSV (aspas, vírgulas e quebras de linha dentro de campo, BOM).
  function parseCsv(text) {
    text = text.replace(/^\uFEFF/, "");
    const rows = []; let row = [], field = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
        else field += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field); field = ""; rows.push(row); row = [];
      } else field += c;
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  const norm = (h) => h.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const FALSE_WORDS = ["false", "nao", "não", "n", "0", "pausado", "indisponivel", "indisponível", "esgotado"];

  function formatPrice(v) {
    v = (v || "").trim();
    if (!v) return "Sob consulta";
    if (/^\d+([.,]\d{1,2})?$/.test(v)) return "R$ " + Number(v.replace(",", ".")).toFixed(2).replace(".", ",");
    return v;
  }

  // Converte as linhas da planilha em itens do cardápio.
  function menuFromCsv(text) {
    const rows = parseCsv(text).filter((r) => r.some((c) => c.trim()));
    if (rows.length < 2) return [];
    const head = rows.shift().map(norm);
    const col = (name) => head.indexOf(name);
    const idx = { nome: col("nome"), descricao: col("descricao"), preco: col("preco"), foto: col("foto"), alt: col("alt"), disponivel: col("disponivel"), tag: col("tag") };
    if (idx.nome < 0) return [];
    const get = (r, k) => (idx[k] >= 0 ? (r[idx[k]] || "").trim() : "");
    return rows
      .filter((r) => get(r, "nome"))
      .map((r) => {
        const disp = get(r, "disponivel").toLowerCase();
        return {
          nome: get(r, "nome"),
          descricao: get(r, "descricao"),
          preco: formatPrice(get(r, "preco")),
          foto: get(r, "foto"),
          alt: get(r, "alt"),
          disponivel: !FALSE_WORDS.includes(disp),
          tag: get(r, "tag")
        };
      });
  }

  const CACHE_KEY = "mickluMenuCache";
  const readCache = () => { try { return JSON.parse(localStorage.getItem(CACHE_KEY)); } catch (e) { return null; } };
  const writeCache = (items) => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(items)); } catch (e) { /* ok */ } };

  async function loadMenu() {
    if (typeof GOOGLE_SHEETS_CSV !== "string" || !GOOGLE_SHEETS_CSV.trim()) return renderMenu(MENU);
    const grid = $("#menuGrid");
    if (grid) { grid.setAttribute("aria-busy", "true"); grid.innerHTML = '<p class="menu-loading">Carregando o cardápio…</p>'; }
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 7000);
      const res = await fetch(GOOGLE_SHEETS_CSV, { signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const items = menuFromCsv(await res.text());
      if (!items.length) throw new Error("planilha vazia ou sem a coluna 'nome'");
      writeCache(items);
      renderMenu(items);
    } catch (err) {
      console.warn("Cardápio: não foi possível ler a planilha —", err.message);
      const cached = readCache();
      renderMenu(Array.isArray(cached) && cached.length ? cached : MENU);
    }
  }

  // ---- Carrossel ----
  function renderCarousel() {
    const c = $("#photoCarousel");
    if (!c) return;
    c.innerHTML = GALLERY.map((g) =>
      `<figure class="carousel-item"><img loading="lazy" decoding="async" width="900" height="1200" src="${esc(g.src)}" alt="${esc(g.alt)}"><figcaption class="carousel-caption">${esc(g.legenda || "")}</figcaption></figure>`
    ).join("");
    const move = (dir) => {
      const card = c.querySelector(".carousel-item");
      if (card) c.scrollBy({ left: dir * (card.offsetWidth + 14), behavior: "smooth" });
    };
    $("#carouselPrev")?.addEventListener("click", () => move(-1));
    $("#carouselNext")?.addEventListener("click", () => move(1));
  }

  // ---- Carrossel da Estação Micklu ----
  function setupStationCarousel() {
    const c = $("#stationCarousel");
    if (!c) return;
    const move = (dir) => {
      const card = c.querySelector(".station-slide");
      if (card) c.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: "smooth" });
    };
    $("#stationPrev")?.addEventListener("click", () => move(-1));
    $("#stationNext")?.addEventListener("click", () => move(1));
  }

  // ---- Depoimentos (só aparecem se houver itens reais em config.js) ----
  function renderTestimonials() {
    const sec = $("#depoimentos");
    if (!sec || !Array.isArray(DEPOIMENTOS) || !DEPOIMENTOS.length) return;
    $("#testimonialList").innerHTML = DEPOIMENTOS.map(
      (d) => `<blockquote>“${esc(d.texto)}”<small>— ${esc(d.autor)}</small></blockquote>`
    ).join("");
    sec.hidden = false;
  }

  // ---- Dados do negócio (só o que estiver preenchido) ----
  function renderBusinessInfo() {
    const rows = [
      ["Horário", NEGOCIO.horario],
      ["Pagamento", NEGOCIO.pagamento],
      ["Entrega e retirada", NEGOCIO.entrega]
    ].filter(([, v]) => v);
    const list = $("#infoNegocio");
    if (list && rows.length) {
      list.innerHTML = rows.map(([k, v]) => `<li><b>${esc(k)}:</b> ${esc(v)}</li>`).join("");
      list.hidden = false;
    }
    const legal = [NEGOCIO.razaoOuNome, NEGOCIO.cnpj ? `CNPJ ${NEGOCIO.cnpj}` : ""].filter(Boolean).join(" • ");
    const el = $("#legal");
    if (el && legal) { el.textContent = legal; el.hidden = false; }
    const note = $("#menuNote");
    if (note) note.textContent = NEGOCIO.observacaoCardapio || "";
  }

  // ---- Menu no celular ----
  function setupNav() {
    const btn = $("#menuToggle"), nav = $("#mainNav");
    if (!btn || !nav) return;
    const close = () => { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.textContent = "☰"; };
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "✕" : "☰";
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  // ---- Botão "orçamento para a Estação" já preenche o interesse ----
  function setupStationBudget() {
    $(".station-budget")?.addEventListener("click", () => {
      const i = $("#interesse");
      if (i && !i.value.trim()) i.value = "Estação Micklu";
    });
  }

  // ---- Formulário de orçamento → mensagem pronta no WhatsApp ----
  function setupQuoteForm() {
    const form = $("#quoteForm");
    if (!form) return;
    const dateInput = $("#data");
    if (dateInput) {
      const t = new Date();
      dateInput.min = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = (id) => ($(id)?.value || "").trim();
      const [y, m, d] = v("#data").split("-");
      const data = y ? `${d}/${m}/${y}` : "A combinar";
      const msg = [
        "Olá, Micklu! Gostaria de solicitar um orçamento para festa.",
        "",
        `*Nome:* ${v("#nome")}`,
        `*Telefone:* ${v("#tel")}`,
        `*Data:* ${data}`,
        `*Evento:* ${v("#tipo")}`,
        `*Convidados:* ${v("#convidados")}`,
        `*Interesses:* ${v("#interesse") || "A definir"}`,
        `*Observações:* ${v("#obs") || "Sem observações"}`
      ].join("\n");
      const url = waLink(msg);
      const win = window.open(url, "_blank");
      if (!win) window.location.href = url; // pop-up bloqueado: abre na mesma aba
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireLinks();
    loadMenu();
    renderCarousel();
    setupStationCarousel();
    renderTestimonials();
    renderBusinessInfo();
    setupNav();
    setupStationBudget();
    setupQuoteForm();
    observeReveal();
  });

  // ---- Datas especiais ----
  const SEASONS = {
    pascoa:{title:"Páscoa",text:"Produtos e presentes especiais para celebrar a Páscoa. Consulte disponibilidade, opções e encomendas.",imgs:["images/novas/pascoa-ovos.webp","images/novas/doces-gourmet.webp","images/novas/cookie-lotus.webp"]},
    maes:{title:"Dia das Mães",text:"Presentes e doces preparados para tornar o Dia das Mães ainda mais especial.",imgs:["images/novas/mae-filha-nova.webp","images/novas/morango-chocolate-branco.webp","images/novas/lembrancinhas-personalizadas.webp"]},
    namorados:{title:"Dia dos Namorados",text:"Opções especiais para presentear e compartilhar momentos a dois.",imgs:["images/novas/morango-especial.webp","images/novas/cookie-red-velvet.webp","images/novas/doces-gourmet.webp"]},
    pais:{title:"Dia dos Pais",text:"Presentes artesanais para celebrar o Dia dos Pais com sabor e carinho.",imgs:["images/novas/brownie-novo.webp","images/novas/cookie-recheado.webp","images/novas/cookie-lotus.webp"]},
    criancas:{title:"Dia das Crianças",text:"Doces e lembranças especiais para uma comemoração ainda mais divertida.",imgs:["images/novas/cookie-copo.webp","images/novas/sobremesas-potes.webp","images/novas/copo-morango.webp"]},
    natal:{title:"Natal",text:"Presentes, lembranças e opções sazonais para celebrar e compartilhar no fim do ano.",imgs:["images/novas/lembrancinhas-personalizadas.webp","images/novas/doces-gourmet.webp","images/novas/cookie-classico.webp"]},
    corporativo:{title:"Corporativo & confraternizações",text:"Opções para presentear equipes, clientes e parceiros ou compor confraternizações.",imgs:["images/novas/lembrancinhas-personalizadas.webp","images/novas/estacao-carrinho.webp","images/novas/doces-gourmet.webp"]}
  };
  function renderSeason(key){
    const d=SEASONS[key]||SEASONS.pascoa, c=$("#seasonCarousel");
    if(!c) return;
    $("#seasonTitle").textContent=d.title; $("#seasonText").textContent=d.text;
    c.innerHTML=d.imgs.map((src,i)=>`<figure class="season-slide"><img loading="lazy" src="${src}" alt="${esc(d.title)} — imagem ${i+1}"><figcaption>${esc(d.title)}</figcaption></figure>`).join("");
    c.scrollLeft=0;
  }
  const seasonSelect=$("#seasonSelect");
  if(seasonSelect){ seasonSelect.addEventListener("change",e=>renderSeason(e.target.value)); renderSeason(seasonSelect.value); }
  [["#seasonPrev",-1],["#seasonNext",1]].forEach(([sel,dir])=>{const b=$(sel); if(b)b.addEventListener("click",()=>{const c=$("#seasonCarousel"), card=c?.querySelector(".season-slide"); if(card)c.scrollBy({left:dir*(card.offsetWidth+12),behavior:"smooth"});});});
})();
