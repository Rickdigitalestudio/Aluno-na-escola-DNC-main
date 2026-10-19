/* ============================================================
   main.js — interatividade do portfólio
   Responsável por: loading, renderização dinâmica, filtros,
   contadores, relógio, tilt 3D, tema, música, atalhos.
   ============================================================ */
(function () {
    "use strict";

    const SITE = window.SITE || {};
    const $ = (s, c) => (c || document).querySelector(s);
    const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;

    /* =========================================================
       1. TELA DE CARREGAMENTO
       ========================================================= */
    const loader = {
        screen: $("#loading-screen"),
        bar: $("#loading-bar"),
        text: $("#loading-text"),
        label: $("#loading-label"),
        target: 18,
        current: 0,
        done: false
    };

    const labels = [
        [35, "carregando seu estilo…"],
        [60, "montando a cena 3D…"],
        [85, "organizando os projetos…"],
        [100, "pronto!"]
    ];

    function bump(to) { loader.target = Math.max(loader.target, to); }

    function loaderTick() {
        if (loader.done) return;
        const diff = loader.target - loader.current;
        loader.current += diff > 1 ? Math.max(0.6, diff * 0.12) : 0.45;
        if (loader.current > 100) loader.current = 100;

        const v = Math.floor(loader.current);
        loader.text.textContent = v + "%";
        loader.bar.style.width = v + "%";
        for (const [n, t] of labels) { if (v >= n && loader.label.textContent !== t) loader.label.textContent = t; }

        if (loader.target >= 100 && loader.current >= 99.4) finishLoading();
        else requestAnimationFrame(loaderTick);
    }

    function finishLoading() {
        loader.done = true;
        loader.text.textContent = "100%";
        loader.bar.style.width = "100%";
        loader.label.textContent = "pronto!";
        const smiley = $("#smiley"), mouth = $("#smile-mouth");
        if (mouth) mouth.setAttribute("d", "M30 58 Q50 78 70 58");
        if (smiley) smiley.classList.add("happy");

        setTimeout(() => {
            loader.screen.classList.add("hide");
            document.body.classList.add("is-loaded");
            startTypewriter();
            setTimeout(() => loader.screen.remove(), 700);
        }, 520);
    }

    // Tarefas reais de carregamento
    const photo = $(".photo-frame img") || $("img");
    if (photo) {
        if (photo.complete) bump(45);
        else {
            photo.addEventListener("load", () => bump(45), { once: true });
            photo.addEventListener("error", () => bump(45), { once: true });
        }
    } else bump(45);

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => bump(75)).catch(() => bump(75));
    } else bump(75);

    // A cena 3D avisa quando estiver pronta (com teto de segurança)
    window.addEventListener("scene:ready", () => bump(100), { once: true });
    setTimeout(() => bump(100), 3500);
    setTimeout(() => { if (!loader.done) { bump(100); loader.current = 100; finishLoading(); } }, 6000);

    requestAnimationFrame(loaderTick);

    /* =========================================================
       2. HERO — letras + máquina de escrever
       ========================================================= */
    function splitHeroName() {
        const h = $("#heroName");
        if (!h) return;
        const text = h.textContent.trim();
        h.textContent = "";
        [...text].forEach((ch, i) => {
            const span = document.createElement("span");
            if (ch === " ") { span.className = "space"; span.innerHTML = "&nbsp;"; }
            else { span.className = "ltr"; span.textContent = ch; span.style.animationDelay = (0.35 + i * 0.045) + "s"; }
            h.appendChild(span);
        });
    }
    splitHeroName();

    let twIndex = 0, twChar = 0, twDeleting = false, twStarted = false;
    function startTypewriter() {
        if (twStarted) return;
        twStarted = true;
        const el = $("#typed");
        const lines = (SITE.profile && SITE.profile.taglines) || [];
        if (!el || !lines.length) return;

        (function type() {
            const line = lines[twIndex % lines.length];
            twChar += twDeleting ? -1 : 1;
            el.textContent = line.slice(0, twChar);

            let delay = twDeleting ? 26 : 52;
            if (!twDeleting && twChar === line.length) { delay = 1900; twDeleting = true; }
            else if (twDeleting && twChar === 0) { twDeleting = false; twIndex++; delay = 320; }
            setTimeout(type, delay);
        })();
    }

    /* =========================================================
       3. RENDERIZAÇÃO DINÂMICA
       ========================================================= */
    const catNames = { front: "Front-end", back: "Back-end & dados", tool: "Ferramentas", design: "Design" };

    function renderSkillFilters() {
        const box = $("#skillFilters");
        if (!box) return;
        box.innerHTML = SITE.skillFilters.map((f, i) =>
            `<button role="tab" data-filter="${f.id}" class="${i === 0 ? "active" : ""}" aria-selected="${i === 0}">${f.label}</button>`
        ).join("");
        box.addEventListener("click", (e) => {
            const btn = e.target.closest("button");
            if (!btn) return;
            $$("button", box).forEach(b => { b.classList.toggle("active", b === btn); b.setAttribute("aria-selected", b === btn); });
            const f = btn.dataset.filter;
            $$(".skill-card").forEach(card => {
                card.classList.toggle("is-hidden", f !== "todos" && card.dataset.cat !== f);
            });
        });
    }

    function renderSkills() {
        const grid = $("#skillsGrid");
        if (!grid) return;
        grid.innerHTML = SITE.skills.map(s => `
            <article class="skill-card reveal" data-cat="${s.cat}" data-skill="${s.name}" style="--c:${s.color}" data-tilt>
                <div class="skill-top">
                    <span class="skill-icon"><i class="${s.icon}"></i></span>
                    <div>
                        <div class="skill-name">${s.name}</div>
                        ${s.note ? `<div class="skill-note">${s.note}</div>` : ""}
                    </div>
                </div>
                <div class="skill-bar"><span data-level="${s.level}"></span></div>
                <div class="skill-foot"><span>${catNames[s.cat] || ""}</span><span>${s.level}%</span></div>
            </article>`).join("");
    }

    function renderTrilha() {
        const grid = $("#trilhaGrid");
        if (!grid) return;
        grid.innerHTML = SITE.trilha.map(t => `
            <article class="trilha-card reveal ${t.status}">
                <span class="trilha-tag">${t.tag}</span>
                <div class="trilha-icon"><i class="${t.icon}"></i></div>
                <h3>${t.title}</h3>
                <p>${t.desc}</p>
                <ul class="trilha-mods">${t.mods.map(m => `<li>${m}</li>`).join("")}</ul>
            </article>`).join("");
    }

    function projectCard(p, extra) {
        const live = p.url
            ? `<a href="${p.url}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Ver no ar</a>`
            : `<span class="pending"><i class="fa-solid fa-lock"></i> só repositório</span>`;
        const repo = p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Código</a>` : "";
        const meta = extra
            ? `<span class="project-lang">${extra.lang || "repositório"}${extra.stars ? ` · ★ ${extra.stars}` : ""}</span>`
            : `<span class="project-lang">${p.lang}</span>`;
        return `
        <article class="project-card reveal ${p.featured ? "featured" : ""}" data-cat="${p.cat}" data-tilt>
            <div class="project-head">
                <span class="project-icon"><i class="${p.icon || "fa-solid fa-code"}"></i></span>
                ${p.featured ? `<span class="project-flag">destaque</span>` : (extra && extra.stars ? `<span class="project-flag">★ ${extra.stars}</span>` : "")}
            </div>
            ${meta}
            <h3 class="project-title">${p.title}</h3>
            <p class="project-desc">${p.desc || "Repositório público com o código-fonte do projeto."}</p>
            <div class="project-actions">${live}${repo}</div>
        </article>`;
    }

    function renderProjects() {
        const grid = $("#projectsGrid");
        if (!grid) return;
        grid.innerHTML = SITE.projects.map(p => projectCard(p)).join("");

        const fbox = $("#projectFilters");
        fbox.innerHTML = SITE.projectFilters.map((f, i) =>
            `<button role="tab" data-filter="${f.id}" class="${i === 0 ? "active" : ""}" aria-selected="${i === 0}">${f.label}</button>`
        ).join("");
        fbox.addEventListener("click", (e) => {
            const btn = e.target.closest("button");
            if (!btn) return;
            $$("button", fbox).forEach(b => { b.classList.toggle("active", b === btn); b.setAttribute("aria-selected", b === btn); });
            const f = btn.dataset.filter;
            $$(".project-card").forEach(card => {
                card.classList.toggle("is-hidden", f !== "todos" && card.dataset.cat !== f);
            });
        });
    }

    function renderTimeline() {
        const tl = $("#timeline");
        if (!tl) return;
        tl.innerHTML = SITE.timeline.map(t => `
            <li class="tl-item reveal ${t.now ? "now" : ""}">
                <div class="tl-card">
                    <span class="tl-year">${t.year}</span>
                    <span class="tl-icon"><i class="${t.icon}"></i></span>
                    <div class="tl-body"><h3>${t.title}</h3><p>${t.text}</p></div>
                </div>
            </li>`).join("");
    }

    function renderServices() {
        const list = $("#serviceList");
        if (list) {
            list.innerHTML = SITE.services.map(s => `
                <li class="service-item reveal"><i class="${s.icon}"></i>
                    <div><b>${s.title}</b><span>${s.text}</span></div></li>`).join("");
        }
        const proc = $("#processList");
        if (proc) {
            proc.innerHTML = SITE.process.map(p => `
                <li class="reveal"><b>${p.step}</b><strong>${p.title}</strong><span>${p.text}</span></li>`).join("");
        }
    }

    function renderSocials() {
        const box = $("#socials");
        if (!box) return;
        box.innerHTML = SITE.socials.map(s => `
            <a class="social-btn" href="${s.url}" target="_blank" rel="noopener" style="--c:${s.color}">
                <i class="${s.icon}"></i> ${s.label}
            </a>`).join("");
    }

    function renderMarquee() {
        const track = $("#marqueeTrack");
        if (!track) return;
        const words = SITE.skills.map(s => s.name);
        const html = words.map(w => `<span>${w}</span>`).join("");
        track.innerHTML = html + html; // duplicado para loop contínuo
    }

    renderSkillFilters();
    renderSkills();
    renderTrilha();
    renderProjects();
    renderTimeline();
    renderServices();
    renderSocials();
    renderMarquee();

    /* =========================================================
       4. REVELAÇÃO NO SCROLL + CONTADORES + BARRAS
       ========================================================= */
    function activate(el) {
        if (el.classList.contains("in")) return;
        el.classList.add("in");
        $$("[data-count]", el).forEach(runCounter);
        if (el.matches("[data-count]")) runCounter(el);
        $$(".skill-bar span", el).forEach(bar => { bar.style.width = bar.dataset.level + "%"; });
    }

    const hasIO = "IntersectionObserver" in window;
    const revealObserver = hasIO ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            activate(entry.target);
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }) : null;

    function observeReveals() {
        $$(".reveal:not(.in)").forEach((el, i) => {
            if (!el.style.transitionDelay) el.style.transitionDelay = Math.min(i % 8, 7) * 0.06 + "s";
            if (revealObserver) revealObserver.observe(el);
            else activate(el);
        });
    }

    // Rede de segurança: se o observer não disparar (aba oculta, navegador
    // antigo, etc.) tudo que estiver na tela é revelado mesmo assim.
    function revealVisible() {
        $$(".reveal:not(.in)").forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.top < window.innerHeight * 1.05 && r.bottom > -50) activate(el);
        });
    }
    setTimeout(revealVisible, 2600);
    window.addEventListener("load", () => setTimeout(revealVisible, 800));

    function runCounter(el) {
        if (el.dataset.done) return;
        el.dataset.done = "1";
        const target = parseFloat(el.dataset.count) || 0;
        const suffix = el.dataset.suffix || "";
        if (reduceMotion) { el.textContent = target + suffix; return; }
        const dur = 1400, t0 = performance.now();
        (function step(now) {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(step);
        })(t0);
    }

    observeReveals();
    // reposiciona observações após qualquer render atrasado
    new MutationObserver(observeReveals).observe(document.body, { childList: true, subtree: true });

    /* =========================================================
       5. NAVEGAÇÃO, PONTOS E PROGRESSO
       ========================================================= */
    const nav = $("#nav");
    const progress = $("#scroll-progress span");

    function onScroll() {
        const y = window.scrollY;
        nav.classList.toggle("scrolled", y > 40);
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const burger = $("#burger"), navLinks = $("#navLinks");
    burger.addEventListener("click", () => {
        const open = navLinks.classList.toggle("open");
        burger.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", open);
    });
    navLinks.addEventListener("click", (e) => {
        if (e.target.tagName === "A") { navLinks.classList.remove("open"); burger.classList.remove("open"); }
    });

    // Pontos laterais + link ativo
    const sections = $$("main section[id]");
    const dotsBox = $("#dots");
    dotsBox.innerHTML = sections.map(s =>
        `<button data-target="${s.id}" data-label="${s.dataset.title || s.id}" aria-label="Ir para ${s.dataset.title || s.id}"></button>`
    ).join("");
    dotsBox.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (b) document.getElementById(b.dataset.target).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            $$(".dots button").forEach(b => b.classList.toggle("active", b.dataset.target === id));
            $$(".nav-links a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
        });
    }, { threshold: 0.35 });
    sections.forEach(s => sectionObserver.observe(s));

    /* =========================================================
       6. RELÓGIO, SAUDAÇÃO, PUSH E TEMPO DE PÁGINA
       ========================================================= */
    const clock = $("#liveClock"), dateEl = $("#liveDate"), greet = $("#greeting"),
        greetIcon = $("#greetIcon"), sessionEl = $("#sessionTime"), footClock = $("#footerClock");
    const start = Date.now();

    setInterval(() => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        if (clock) clock.textContent = `${hh}:${mm}:${ss}`;
        if (footClock) footClock.textContent = `${hh}:${mm}`;
        if (dateEl) dateEl.textContent = now.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });

        const h = now.getHours();
        let g = "Boa noite", ic = "fa-solid fa-moon";
        if (h >= 5 && h < 12) { g = "Bom dia"; ic = "fa-solid fa-sun"; }
        else if (h >= 12 && h < 18) { g = "Boa tarde"; ic = "fa-solid fa-cloud-sun"; }
        if (greet) greet.textContent = g;
        if (greetIcon) greetIcon.className = ic;

        const secs = Math.floor((Date.now() - start) / 1000);
        if (sessionEl) sessionEl.textContent =
            String(Math.floor(secs / 60)).padStart(2, "0") + ":" + String(secs % 60).padStart(2, "0");
    }, 1000);

    // Último push + contagem real de repositórios (GitHub API, com fallback)
    (async function githubLive() {
        const user = SITE.profile && SITE.profile.githubUser;
        if (!user) return;
        try {
            const [uRes, rRes] = await Promise.all([
                fetch(`https://api.github.com/users/${user}`),
                fetch(`https://api.github.com/users/${user}/repos?per_page=5&sort=pushed`)
            ]);
            if (uRes.ok) {
                const u = await uRes.json();
                const dt = $$("#heroStats dt").find(d => d.dataset.count === "22");
                if (dt) { dt.dataset.count = u.public_repos; delete dt.dataset.done; dt.textContent = u.public_repos; }
            }
            if (rRes.ok) {
                const repos = await rRes.json();
                if (repos && repos.length && repos[0].pushed_at) {
                    const d = new Date(repos[0].pushed_at);
                    const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
                    const text = diff <= 0 ? "hoje" : diff === 1 ? "há 1 dia" : `há ${diff} dias`;
                    const el = $("#lastPush");
                    if (el) el.textContent = `${text} · ${repos[0].name}`;
                }
            }
        } catch (e) {
            const el = $("#lastPush");
            if (el) el.textContent = "offline no momento";
        }
    })();

    /* =========================================================
       7. TILT 3D + BOTÕES MAGNÉTICOS + CURSOR
       ========================================================= */
    if (!isTouch && !reduceMotion) {
        $$("[data-tilt]").forEach(el => {
            el.addEventListener("pointermove", (e) => {
                const r = el.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                el.style.transform = `perspective(900px) rotateY(${px * 11}deg) rotateX(${-py * 11}deg) translateY(-6px)`;
            });
            el.addEventListener("pointerleave", () => { el.style.transform = ""; });
        });

        $$("[data-magnetic]").forEach(el => {
            el.addEventListener("pointermove", (e) => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) * 0.22;
                const y = (e.clientY - r.top - r.height / 2) * 0.3;
                el.style.transform = `translate(${x}px, ${y}px)`;
            });
            el.addEventListener("pointerleave", () => { el.style.transform = ""; });
        });

        const glow = $("#cursor-glow");
        let gx = 0, gy = 0, tx = 0, ty = 0;
        window.addEventListener("pointermove", (e) => {
            document.body.classList.add("has-cursor");
            tx = e.clientX; ty = e.clientY;
        }, { passive: true });
        (function follow() {
            gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
            glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
            requestAnimationFrame(follow);
        })();
    }

    /* =========================================================
       8. TEMA (COR DE DESTAQUE) — também muda a cena 3D
       ========================================================= */
    const savedAccent = localStorage.getItem("hl-accent");
    if (savedAccent) document.body.dataset.accent = savedAccent;
    $$(".accent-dot").forEach(d => d.classList.toggle("is-active", d.dataset.accent === (savedAccent || "verde")));

    $$(".accent-dot").forEach(dot => {
        dot.addEventListener("click", () => {
            const name = dot.dataset.accent;
            document.body.dataset.accent = name;
            localStorage.setItem("hl-accent", name);
            $$(".accent-dot").forEach(d => d.classList.toggle("is-active", d === dot));
            const color = getComputedStyle(dot).getPropertyValue("--c").trim();
            if (window.Scene3D && window.Scene3D.setAccent) window.Scene3D.setAccent(color);
            toast("Tema " + name + " aplicado ✨");
        });
    });

    /* =========================================================
       9. MÚSICA
       ========================================================= */
    const musicBtn = $("#musicBtn"), musicPanel = $("#musicPanel"),
        cd = $("#cdMini"), frame = $("#spotifyFrame"), musicClose = $("#musicClose");
    // Guarda a URL base sem o autoplay, para não duplicar o parâmetro
    const baseSrc = frame ? frame.src.replace(/[?&]autoplay=1/g, "") : "";

    function setMusic(open) {
        musicPanel.hidden = !open;
        musicBtn.setAttribute("aria-expanded", open);
        cd.classList.toggle("spinning", open);
        if (frame) frame.src = open ? baseSrc + "&autoplay=1" : baseSrc;
    }
    if (musicBtn) musicBtn.addEventListener("click", () => setMusic(musicPanel.hidden));
    if (musicClose) musicClose.addEventListener("click", () => setMusic(false));

    // Música já liga no carregamento. Como navegadores podem bloquear o autoplay
    // sem interação, tentamos de novo no primeiro clique/tecla do visitante.
    const pageStart = Date.now();
    let musicRetried = false;
    function retryMusicOnGesture() {
        if (musicRetried) return;
        musicRetried = true;
        if (frame && !musicPanel.hidden && Date.now() - pageStart < 15000) {
            frame.src = baseSrc + "&autoplay=1";
        }
        window.removeEventListener("pointerdown", retryMusicOnGesture);
        window.removeEventListener("keydown", retryMusicOnGesture);
        window.removeEventListener("touchstart", retryMusicOnGesture);
    }
    window.addEventListener("pointerdown", retryMusicOnGesture);
    window.addEventListener("keydown", retryMusicOnGesture);
    window.addEventListener("touchstart", retryMusicOnGesture);

    /* =========================================================
       10. COPIAR, TOAST, CONFETE E EASTER EGGS
       ========================================================= */
    const toastEl = $("#toast");
    let toastTimer;
    function toast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
    }

    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-copy]");
        if (!btn) return;
        const text = btn.dataset.copy;
        const done = () => toast("Copiado: " + text);
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
        } else fallbackCopy(text, done);
    });

    function fallbackCopy(text, cb) {
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); cb(); } catch (e) { toast("Não consegui copiar :("); }
        ta.remove();
    }

    function confetti(count) {
        if (reduceMotion) return;
        const colors = ["#8FE20E", "#ffffff", "#22e0ff", "#ff4dd8", "#ff8a2b"];
        const n = count || 44;
        for (let i = 0; i < n; i++) {
            const c = document.createElement("i");
            c.className = "confetti";
            c.style.left = Math.random() * 100 + "vw";
            c.style.background = colors[i % colors.length];
            c.style.animationDuration = 1.8 + Math.random() * 1.6 + "s";
            c.style.setProperty("--drift", (Math.random() * 220 - 110) + "px");
            c.style.animationDelay = Math.random() * 0.25 + "s";
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 3800);
        }
    }

    // 1) clique na marca
    $("#brand").addEventListener("click", () => {
        confetti(36);
        toast("Bora codar 🚀");
    });

    // 2) digitar "rick"
    let buffer = "";
    window.addEventListener("keydown", (e) => {
        if (e.key.length !== 1) return;
        buffer = (buffer + e.key.toLowerCase()).slice(-6);
        if (buffer === "rick") {
            confetti(90);
            toast("Modo Rick ativado ⚡");
            if (window.Scene3D && window.Scene3D.burst) window.Scene3D.burst();
        }
    });

    /* =========================================================
       11. CARREGAR MAIS PROJETOS (GitHub ao vivo)
       ========================================================= */
    const loadMore = $("#loadMore");
    if (loadMore) {
        let loaded = false;
        loadMore.addEventListener("click", async () => {
            if (loaded) { toast("Todos os repositórios já estão aqui 🙂"); return; }
            loadMore.disabled = true;
            loadMore.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Buscando…';
            try {
                const user = SITE.profile.githubUser;
                const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`);
                if (!res.ok) throw new Error("status " + res.status);
                const repos = await res.json();
                const known = new Set(SITE.projects.map(p => (p.repo || "").toLowerCase()));
                const grid = $("#projectsGrid");
                let added = 0;
                repos.forEach(r => {
                    if (r.fork) return;
                    if (known.has(r.html_url.toLowerCase())) return;
                    grid.insertAdjacentHTML("beforeend", projectCard({
                        title: r.name.replace(/[-_]/g, " "),
                        desc: r.description || "Repositório público no meu GitHub.",
                        cat: "outros",
                        lang: r.language || "código",
                        icon: "fa-brands fa-github",
                        url: r.has_pages ? `https://${user}.github.io/${r.name}/` : "",
                        repo: r.html_url
                    }, { lang: r.language || "repositório", stars: r.stargazers_count }));
                    added++;
                });
                observeReveals();
                const fbox = $("#projectFilters");
                const active = $("button.active", fbox).dataset.filter;
                if (active !== "todos") {
                    $$(".project-card").forEach(c => c.classList.toggle("is-hidden", active !== "todos" && c.dataset.cat !== active));
                }
                loaded = true;
                loadMore.innerHTML = '<i class="fa-solid fa-check"></i> ' + added + " repositórios adicionados";
                toast(added + " projetos puxados do GitHub 🎉");
            } catch (err) {
                loadMore.disabled = false;
                loadMore.innerHTML = '<i class="fa-brands fa-github"></i> Tentar de novo';
                toast("Não consegui falar com o GitHub agora 😕");
            }
        });
    }

    /* =========================================================
       12. DIVERSÃO AO CHEGAR AO FIM
       ========================================================= */
    const contactObs = new IntersectionObserver((entries) => {
        entries.forEach(en => { if (en.isIntersecting) { confetti(30); contactObs.disconnect(); } });
    }, { threshold: 0.4 });
    const cc = $(".contact-card");
    if (cc) contactObs.observe(cc);

    /* =========================================================
       13. AJUSTES FINAIS
       ========================================================= */
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Seta a meta de estudo caso o GitHub falhe (mantém os números coerentes)
    window.addEventListener("load", () => observeReveals());
})();
