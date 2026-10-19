# Henrique Luiz · Portfólio 3D Interativo

<p align="center">
  <b>Estudante de Engenharia de Software na Escola DNC · Dev Front-End & Web Designer</b><br>
  Uma página de links que virou um portfólio imersivo: cena 3D interativa, dados ao vivo do GitHub,
  trilha de estudos, projetos reais no ar e contato direto no WhatsApp.
</p>

---

## ✨ O que o site tem

| Seção | O que acontece |
|-------|----------------|
| **Loading** | Vinil girando + carinha + barra de progresso que acompanha o carregamento real (foto, fontes e cena 3D). |
| **Hero 3D** | Cena Three.js com núcleo luminoso, anéis e bolhas de skills orbitando. Dá para **arrastar, girar, passar o mouse e clicar** numa bolha — ela leva até a seção de skills. |
| **Sobre** | Foto com efeito de profundidade (tilt), bio e painel "Agora" com relógio, saudação por horário, **último push do GitHub** e tempo de visita. |
| **Skills** | 18 tecnologias com filtro por área, barras de domínio animadas e marquee. |
| **Trilha DNC** | As 4 formações (Engenheiro de Software, Front-End, Tech Lead, Arquiteto) + como funciona a metodologia da escola. |
| **Projetos** | 14 projetos reais, com link "no ar" e repositório, filtros por tipo e botão que **busca mais projetos na API do GitHub**. |
| **Jornada** | Linha do tempo de 2021 até hoje. |
| **Contato** | Serviços, processo em 5 passos, WhatsApp, e-mail (copiar com um clique), LinkedIn, TikTok e GitHub. |
| **Extras** | Troca de cor do tema (afeta também a cena 3D), player de música, confete no logo, relógio no rodapé. |

## 🛠 Tecnologias

- HTML5, CSS3 (variáveis, grid, glassmorphism) e JavaScript vanilla
- **Three.js** (cena 3D via CDN/import map)
- Font Awesome 6 · Google Fonts (Space Grotesk + Inter)
- API do GitHub (dados ao vivo, com fallback offline)

## 📁 Como editar o conteúdo

**Todo o texto, os projetos, as skills e os contatos estão em [`data.js`](data.js).**
É só abrir o arquivo e trocar o que quiser — nada de HTML para mexer.

- `SITE.profile` — nome, frases do hero, WhatsApp, e-mail, LinkedIn, TikTok
- `SITE.skills` / `SITE.skillFilters` — tecnologias e filtros
- `SITE.trilha` — formações da DNC
- `SITE.projects` / `SITE.projectFilters` — projetos (coloque `url` vazio se ainda não houver site publicado)
- `SITE.timeline`, `SITE.services`, `SITE.process`, `SITE.socials`

As cores do tema ficam no topo do [`style.css`](style.css) (`--accent`, `--accent-rgb`) e nos
tokens `data-accent` do HTML.

## ▶️ Como rodar

```bash
git clone <este-repositorio>
cd Aluno-na-escola-DNC
python -m http.server 8000   # ou use o Live Server do VS Code
# abra http://localhost:8000
```

> A cena 3D é um módulo ES (`scene3d.js`), então é preciso um servidor local
> (não funciona abrindo o `index.html` direto com `file://`). Se o Three.js não
> carregar, o site continua funcionando normalmente sem o fundo 3D.

## ♿ Acessibilidade

- Sem JavaScript o conteúdo aparece inteiro (só perde as animações)
- `prefers-reduced-motion` desliga animações e a cena 3D
- Navegação por teclado com foco visível, textos alternativos e `aria-label`s

---

Feito com 💚 por **Henrique Luiz** — [GitHub](https://github.com/Rickdigitalestudio) · [LinkedIn](https://linkedin.com/in/henrique-luiz-dutra-a10346146/) · [WhatsApp](https://wa.me/5511989426415)
