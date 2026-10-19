/* ============================================================
   data.js — TODO o conteúdo do site fica aqui.
   Edite este arquivo para atualizar textos, skills, projetos
   e contatos sem tocar no HTML.
   ============================================================ */

const SITE = {
    profile: {
        name: "Henrique Luiz",
        fullName: "Henrique Luiz Dutra de Lima Varela",
        role: "Dev Front-End & Web Designer",
        course: "Engenharia de Software · Escola DNC",
        photo: "img/IMG_0308.JPG",
        status: "Disponível para freelas",
        // Ano em que começou a estudar de verdade (alimenta os contadores)
        codingSince: "2024-01-01",

        // Frases que passam no efeito máquina de escrever do hero
        taglines: [
            "Construo interfaces que fazem o visitante clicar.",
            "Do layout ao deploy — HTML, CSS, JS e muito 3D.",
            "Estudante de Engenharia de Software na Escola DNC.",
            "Fanpages que vendem e sites com cara de grande marca.",
            "Meu GitHub é o meu diário de evolução."
        ],

        // Contatos reais (usados nos botões e no copiar)
        email: "estudiorickdigital@gmail.com",
        phone: "(11) 98942-6415",
        whatsapp: "https://wa.me/5511989426415?text=Ol%C3%A1%20Henrique!%20Vim%20pelo%20seu%20portf%C3%B3lio%203D%20e%20quero%20um%20or%C3%A7amento.",
        githubUser: "Rickdigitalestudio",
        github: "https://github.com/Rickdigitalestudio",
        linkedin: "https://linkedin.com/in/henrique-luiz-dutra-a10346146/",
        tiktok: "https://www.tiktok.com/@ricklima991",
        estudio: "https://rickdigitalestudio.github.io/profissional-rickdutra/",
        curriculo: "https://rickdigitalestudio.github.io/curr-culo/",
        escolaDnc: "https://escoladnc.com.br",
        local: "São Paulo · SP"
    },

    /* ---------------- SKILLS ---------------- */
    skillFilters: [
        { id: "todos", label: "Todas" },
        { id: "front", label: "Front-end" },
        { id: "back", label: "Back-end & Dados" },
        { id: "tool", label: "Ferramentas" },
        { id: "design", label: "Design" }
    ],

    skills: [
        { name: "HTML5", icon: "fa-brands fa-html5", color: "#e34f26", level: 95, cat: "front" },
        { name: "CSS3", icon: "fa-brands fa-css3-alt", color: "#1572b6", level: 92, cat: "front" },
        { name: "JavaScript", icon: "fa-brands fa-js", color: "#f7df1e", level: 88, cat: "front" },
        { name: "Bootstrap", icon: "fa-brands fa-bootstrap", color: "#7952b3", level: 85, cat: "front" },
        { name: "Sass / SCSS", icon: "fa-brands fa-sass", color: "#cd6799", level: 78, cat: "front" },
        { name: "React", icon: "fa-brands fa-react", color: "#61dafb", level: 62, cat: "front", note: "estudando" },
        { name: "TypeScript", icon: "fa-solid fa-code", color: "#2f7d8a", level: 60, cat: "front", note: "evoluindo" },
        { name: "Node.js", icon: "fa-brands fa-node", color: "#339933", level: 65, cat: "back" },
        { name: "PHP", icon: "fa-brands fa-php", color: "#777bb4", level: 70, cat: "back" },
        { name: "Java", icon: "fa-brands fa-java", color: "#007396", level: 58, cat: "back" },
        { name: "Python", icon: "fa-brands fa-python", color: "#3776ab", level: 72, cat: "back" },
        { name: "APIs REST", icon: "fa-solid fa-plug", color: "#8FE20E", level: 82, cat: "back" },
        { name: "Git & GitHub", icon: "fa-brands fa-github", color: "#fafafa", level: 86, cat: "tool" },
        { name: "Vercel", icon: "fa-solid fa-bolt", color: "#ffffff", level: 80, cat: "tool" },
        { name: "WordPress", icon: "fa-brands fa-wordpress", color: "#21759b", level: 74, cat: "tool" },
        { name: "Wix", icon: "fa-brands fa-wix", color: "#ff5722", level: 70, cat: "tool" },
        { name: "SEO & Performance", icon: "fa-solid fa-magnifying-glass-chart", color: "#8FE20E", level: 79, cat: "design" },
        { name: "UI / UX & Responsivo", icon: "fa-solid fa-bezier-curve", color: "#ff4dd8", level: 88, cat: "design" }
    ],

    /* ---------------- TRILHA DNC ---------------- */
    trilha: [
        {
            title: "Engenharia de Software",
            tag: "Cursando agora",
            status: "now",
            icon: "fa-solid fa-laptop-code",
            desc: "Fundamentos de lógica, estrutura de dados, APIs REST, bancos e arquitetura de aplicações.",
            mods: ["Lógica & algoritmos", "Banco de dados", "APIs REST", "Arquitetura"]
        },
        {
            title: "Desenvolvedor Front-End",
            tag: "Minha especialidade",
            status: "key",
            icon: "fa-solid fa-palette",
            desc: "HTML, CSS, JavaScript, componentes, responsividade e boas práticas de UI.",
            mods: ["HTML & CSS", "JavaScript", "Componentes", "Mobile first"]
        },
        {
            title: "Tech Lead",
            tag: "Próximo passo",
            status: "next",
            icon: "fa-solid fa-people-group",
            desc: "Liderança técnica, code review, estimativas e condução de times em metodologias ágeis.",
            mods: ["Scrum & Kanban", "Code review", "Gestão de time"]
        },
        {
            title: "Arquiteto de Software",
            tag: "Trilha avançada",
            status: "next",
            icon: "fa-solid fa-sitemap",
            desc: "Padrões de projeto, escalabilidade, segurança e decisões técnicas de longo prazo.",
            mods: ["Design patterns", "Escalabilidade", "Segurança"]
        }
    ],

    /* ---------------- PROJETOS ----------------
       url  = site publicado no GitHub Pages
       repo = repositório (sempre funciona) */
    projectFilters: [
        { id: "todos", label: "Todos" },
        { id: "3d", label: "3D & Interativo" },
        { id: "landing", label: "Landing pages" },
        { id: "produto", label: "Produtos & Sites" },
        { id: "dnc", label: "Desafios DNC" },
        { id: "ia", label: "IA & Automação" }
    ],

    projects: [
        {
            title: "Estúdio Rick Digital",
            desc: "CRM + gerador de leads do meu estúdio: cadastro, funil e acompanhamento de oportunidades.",
            cat: "produto", lang: "HTML · CSS · JS", icon: "fa-solid fa-chart-line",
            url: "https://rickdigitalestudio.github.io/estudio-rick-digital/",
            repo: "https://github.com/Rickdigitalestudio/estudio-rick-digital", featured: true
        },
        {
            title: "Portfólio do Estúdio",
            desc: "Meu site comercial com trabalhos, serviços, processo e orçamento direto no WhatsApp.",
            cat: "produto", lang: "HTML · CSS · JS", icon: "fa-solid fa-window-maximize",
            url: "https://rickdigitalestudio.github.io/profissional-rickdutra/",
            repo: "https://github.com/Rickdigitalestudio/profissional-rickdutra"
        },
        {
            title: "Chá de Casa Nova 3D",
            desc: "Convite interativo com Three.js: casa 3D guiada pelo scroll, paleta ao vivo e 2 formulários.",
            cat: "3d", lang: "Three.js · JS", icon: "fa-solid fa-cube",
            url: "https://rickdigitalestudio.github.io/cha-casa-nova-3d/",
            repo: "https://github.com/Rickdigitalestudio/cha-casa-nova-3d", featured: true
        },
        {
            title: "Residencial Tradição",
            desc: "Landing de incorporadora com arquitetura autoral, dados de empreendimento e captação de leads.",
            cat: "landing", lang: "JavaScript", icon: "fa-solid fa-building",
            url: "https://rickdigitalestudio.github.io/Landing-Page-Arquitetura/",
            repo: "https://github.com/Rickdigitalestudio/Landing-Page-Arquitetura"
        },
        {
            title: "Viver de Freelancer",
            desc: "Experiência 3D interativa sobre a vida de quem trabalha por conta — gamma → código.",
            cat: "3d", lang: "HTML · Three.js", icon: "fa-solid fa-vr-cardboard",
            url: "https://rickdigitalestudio.github.io/viverdefreelancer/",
            repo: "https://github.com/Rickdigitalestudio/viverdefreelancer"
        },
        {
            title: "New Vila Ema",
            desc: "Landing premium de imóveis com terraço, mapa e foco em conversão de visitantes.",
            cat: "landing", lang: "TypeScript", icon: "fa-solid fa-house-chimney",
            url: "https://rickdigitalestudio.github.io/vila-ema-living/",
            repo: "https://github.com/Rickdigitalestudio/vila-ema-living"
        },
        {
            title: "Pousada do Adão",
            desc: "Site institucional com suítes, cardápio e reservas — clima de férias desde a primeira tela.",
            cat: "produto", lang: "HTML · CSS", icon: "fa-solid fa-umbrella-beach",
            url: "https://rickdigitalestudio.github.io/pousada-do-adao/",
            repo: "https://github.com/Rickdigitalestudio/pousada-do-adao"
        },
        {
            title: "Nepofit Performance",
            desc: "Landing de academia com horários, endereço e chamada para matrícula.",
            cat: "landing", lang: "HTML · CSS", icon: "fa-solid fa-dumbbell",
            url: "https://rickdigitalestudio.github.io/nepofit-performance/",
            repo: "https://github.com/Rickdigitalestudio/nepofit-performance"
        },
        {
            title: "Festa das Crianças 2.0",
            desc: "Landing 3D de evento: flip 3D, mapa do tesouro, confete e contagem regressiva.",
            cat: "3d", lang: "HTML · CSS · JS", icon: "fa-solid fa-child-reaching",
            url: "https://rickdigitalestudio.github.io/festadascriacas2.0guileiros/",
            repo: "https://github.com/Rickdigitalestudio/festadascriacas2.0guileiros"
        },
        {
            title: "CrescerBem",
            desc: "Guia de desenvolvimento infantil: alimentação, rotina, atividades e especialistas.",
            cat: "produto", lang: "HTML · CSS · JS", icon: "fa-solid fa-seedling",
            url: "https://rickdigitalestudio.github.io/CrescerBem/",
            repo: "https://github.com/Rickdigitalestudio/CrescerBem"
        },
        {
            title: "DncWeather · Consumo de API",
            desc: "Desafio da DNC: previsão de 7 dias com Open-Meteo + busca de endereço por CEP (ViaCEP).",
            cat: "dnc", lang: "HTML · CSS · JS", icon: "fa-solid fa-cloud-sun",
            url: "https://rickdigitalestudio.github.io/Desafio-2-Dnc-consumo-de-API/",
            repo: "https://github.com/Rickdigitalestudio/Desafio-2-Dnc-consumo-de-API"
        },
        {
            title: "Portfólio com React",
            desc: "Construção de portfólio profissional em React: hooks, componentes e boas práticas.",
            cat: "dnc", lang: "React · SCSS", icon: "fa-brands fa-react",
            url: "https://rickdigitalestudio.github.io/portfolio-react-gamma/",
            repo: "https://github.com/Rickdigitalestudio/portfolio-react-gamma"
        },
        {
            title: "Interface em ReactJS (Desafio 3 e 4)",
            desc: "Desafio da DNC: interface responsiva construída do zero com ReactJS.",
            cat: "dnc", lang: "React · SCSS", icon: "fa-solid fa-code",
            url: "https://rickdigitalestudio.github.io/Desafio-03-e-04---Construa-uma-interface-utilizando-ReactJS---Escola-DNC-main/",
            repo: "https://github.com/Rickdigitalestudio/Desafio-03-e-04---Construa-uma-interface-utilizando-ReactJS---Escola-DNC-main"
        },
        {
            title: "Atendente de WhatsApp com IA",
            desc: "Bot em Python que agenda direto no Google Calendar usando Gemini/OpenAI + Evolution API.",
            cat: "ia", lang: "Python · Flask", icon: "fa-brands fa-whatsapp",
            url: "", featured: true,
            repo: "https://github.com/Rickdigitalestudio/atendente-whatsapp-ia"
        }
    ],

    /* ---------------- JORNADA ---------------- */
    timeline: [
        {
            year: "2021",
            title: "Primeiro commit",
            text: "Crio minha conta no GitHub (jul/2021) e começo a guardar cada experimento de código.",
            icon: "fa-brands fa-github"
        },
        {
            year: "2024",
            title: "Chegada na Escola DNC",
            text: "Entro na trilha de tecnologia e entrego os primeiros desafios em ReactJS direto no repositório.",
            icon: "fa-solid fa-graduation-cap"
        },
        {
            year: "2025",
            title: "Portfólio e currículo no ar",
            text: "Publico meu portfólio e currículo na web e começo a transformar estudo em trabalho real.",
            icon: "fa-solid fa-rocket"
        },
        {
            year: "2026",
            title: "Consumo de API & landing pages",
            text: "Desafios da DNC (previsão do tempo + CEP) e landing pages de clientes reais no ar.",
            icon: "fa-solid fa-plug"
        },
        {
            year: "2026",
            title: "Estúdio Rick Digital",
            text: "Estruturo o estúdio: 14 projetos publicados, serviços de web design e projetos 3D com Three.js.",
            icon: "fa-solid fa-wand-magic-sparkles", now: true
        }
    ],

    /* ---------------- SERVIÇOS ---------------- */
    services: [
        { icon: "fa-solid fa-bolt", title: "Fanpages que convertem", text: "Páginas diretas e persuasivas para campanhas e lançamentos." },
        { icon: "fa-solid fa-building", title: "Sites institucionais", text: "Site completo com credibilidade, WhatsApp e contato na palma da mão." },
        { icon: "fa-solid fa-bezier-curve", title: "UX/UI Design", text: "Layout bonito, intuitivo e idêntico no celular, tablet e desktop." },
        { icon: "fa-solid fa-magnifying-glass-chart", title: "SEO & performance", text: "Código otimizado para o Google encontrar e a página carregar rápido." },
        { icon: "fa-solid fa-pen-nib", title: "Logos & identidade", text: "Marca visual para o seu projeto nascer com cara profissional." },
        { icon: "fa-solid fa-screwdriver-wrench", title: "Manutenção & upgrade", text: "Modernizo sites antigos, corrijo e deixo no ar sem dor de cabeça." }
    ],

    process: [
        { step: "01", title: "Descoberta", text: "Entendo seu negócio e seu cliente." },
        { step: "02", title: "Escopo", text: "Defino páginas, prazo e valor fechado." },
        { step: "03", title: "Design", text: "Crio o layout com a sua cara." },
        { step: "04", title: "Código", text: "Transformo o design em site de verdade." },
        { step: "05", title: "Entrega", text: "Publico, testo e te entrego no ar." }
    ],

    /* ---------------- REDES ---------------- */
    socials: [
        { icon: "fa-brands fa-whatsapp", label: "WhatsApp", url: "https://wa.me/5511989426415", color: "#25D366" },
        { icon: "fa-brands fa-github", label: "GitHub", url: "https://github.com/Rickdigitalestudio", color: "#fafafa" },
        { icon: "fa-brands fa-linkedin-in", label: "LinkedIn", url: "https://linkedin.com/in/henrique-luiz-dutra-a10346146/", color: "#0a66c2" },
        { icon: "fa-brands fa-tiktok", label: "TikTok", url: "https://www.tiktok.com/@ricklima991", color: "#25f4ee" },
        { icon: "fa-brands fa-instagram", label: "Instagram DNC", url: "https://www.instagram.com/escoladnc/", color: "#E1306C" },
        { icon: "fa-solid fa-envelope", label: "E-mail", url: "mailto:estudiorickdigital@gmail.com", color: "#8FE20E" }
    ]
};

/* Bloqueia a página se data.js não carregar (evita tela em branco silenciosa) */
if (typeof window !== "undefined") window.SITE = SITE;
