/* ============================================================
   scene3d.js â€” cena 3D interativa de fundo (Three.js)
   NÃºcleo luminoso + anÃ©is + bolhas de skills orbitando +
   campo de partÃ­culas. Responde a mouse/scroll e conversa
   com a interface (main.js) via window.Scene3D.
   ============================================================ */
import * as THREE from "three";

const canvas = document.getElementById("bg3d");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Sinaliza para o loading que a cena estÃ¡ pronta (mesmo sem 3D)
const ready = () => window.dispatchEvent(new Event("scene:ready"));

if (!canvas || reduced || !window.WebGLRenderingContext) {
    ready();
} else {
    init().then(ready).catch(ready);
}

async function init() {
    /* ---------------- skills que viram bolhas ---------------- */
    const skills = (window.SITE && window.SITE.skills) || [];
    const want = ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "Python", "Git & GitHub", "TypeScript", "APIs REST", "UI / UX & Responsivo"];
    const chips = want.map(n => skills.find(s => s.name === n)).filter(Boolean);
    const fallback = [
        { name: "HTML5", color: "#e34f26" }, { name: "CSS3", color: "#1572b6" },
        { name: "JavaScript", color: "#f7df1e" }, { name: "React", color: "#61dafb" },
        { name: "Node.js", color: "#339933" }, { name: "Python", color: "#3776ab" }
    ];
    const chipData = chips.length ? chips : fallback;

    try {
        if (document.fonts && document.fonts.load) {
            await Promise.race([
                document.fonts.load('600 62px "Space Grotesk"'),
                new Promise(r => setTimeout(r, 1500))
            ]);
        }
    } catch (e) { /* segue com a fonte padrÃ£o */ }

    /* ---------------- renderer / cena / cÃ¢mera ---------------- */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 12);

    const world = new THREE.Group();
    scene.add(world);

    const accent = new THREE.Color(getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#8FE20E");
    const accentMats = []; // materiais que trocam de cor com o tema

    /* ---------------- nÃºcleo ---------------- */
    const coreGeo = new THREE.IcosahedronGeometry(1.7, 1);
    const coreMat = new THREE.MeshStandardMaterial({
        color: accent.clone().multiplyScalar(0.7),
        emissive: accent.clone(),
        emissiveIntensity: 0.45,
        metalness: 0.35, roughness: 0.3,
        flatShading: true, transparent: true, opacity: 0.34
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    world.add(core);
    accentMats.push(coreMat);

    const wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(coreGeo),
        new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.75 })
    );
    wire.scale.setScalar(1.02);
    world.add(wire);
    accentMats.push(wire.material);

    const shellMat = new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.1 });
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(2.9, 2), shellMat);
    world.add(shell);
    accentMats.push(shellMat);

    // anÃ©is orbitais
    const rings = [];
    [[3.6, 0.4], [4.4, -0.7], [5.3, 1.1]].forEach(([radius, tilt], i) => {
        const mat = new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.32 - i * 0.06 });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.012, 6, 220), mat);
        ring.rotation.x = Math.PI / 2 + tilt;
        ring.rotation.y = tilt * 0.6;
        world.add(ring);
        rings.push(ring);
        accentMats.push(mat);
    });

    /* ---------------- luzes ---------------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(6, 6, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(accent, 1.6);
    rim.position.set(-7, -3, 4);
    scene.add(rim);
    scene.add(rim.target);

    /* ---------------- partÃ­culas ---------------- */
    const COUNT = 1300;
    const pos = new Float32Array(COUNT * 3);
    const cols = new Float32Array(COUNT * 3);
    const cGreen = accent, cWhite = new THREE.Color(0xffffff);
    for (let i = 0; i < COUNT; i++) {
        // casca distante o suficiente para nunca cruzar a cÃ¢mera
        const r = 20 + Math.random() * 26;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.cos(phi) * 0.55;
        pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        const c = Math.random() > 0.72 ? cWhite : cGreen;
        cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
    const pMat = new THREE.PointsMaterial({
        size: 0.11, vertexColors: true, transparent: true, opacity: 0.85,
        depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ---------------- bolhas de skills ---------------- */
    function chipTexture(label, color) {
        const pad = 10, dotR = 22, left = 118;
        const measCanvas = document.createElement("canvas");
        const mg = measCanvas.getContext("2d");
        mg.font = '600 64px "Space Grotesk", Inter, sans-serif';
        const textW = Math.ceil(mg.measureText(label).width);
        const W = Math.max(360, left + textW + 60);
        const H = 168;

        const c = document.createElement("canvas");
        c.width = W; c.height = H;
        const g = c.getContext("2d");
        g.font = '600 64px "Space Grotesk", Inter, sans-serif';

        const r = 40;
        g.beginPath();
        g.moveTo(pad + r, pad);
        g.arcTo(W - pad, pad, W - pad, H - pad, r);
        g.arcTo(W - pad, H - pad, pad, H - pad, r);
        g.arcTo(pad, H - pad, pad, pad, r);
        g.arcTo(pad, pad, W - pad, pad, r);
        g.closePath();
        g.fillStyle = "rgba(9, 12, 9, 0.88)";
        g.fill();
        g.lineWidth = 5;
        g.strokeStyle = color;
        g.stroke();

        g.beginPath();
        g.arc(70, H / 2, dotR, 0, Math.PI * 2);
        g.fillStyle = color;
        g.fill();
        g.beginPath();
        g.arc(70, H / 2, dotR + 9, 0, Math.PI * 2);
        g.strokeStyle = color + "66";
        g.lineWidth = 4;
        g.stroke();

        g.fillStyle = "#f1f4ef";
        g.textBaseline = "middle";
        g.fillText(label, left, H / 2 + 4);

        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        return { tex, ratio: W / H };
    }

    const chipGroup = new THREE.Group();
    world.add(chipGroup);
    const chips3d = [];

    chipData.forEach((s, i) => {
        const { tex, ratio } = chipTexture(s.name, s.color || "#8FE20E");
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0.96 });
        const sprite = new THREE.Sprite(mat);
        const h = 0.72;
        sprite.scale.set(h * ratio, h, 1);
        sprite.renderOrder = 4;

        const data = {
            sprite,
            base: new THREE.Vector3(h * ratio, h, 1),
            radius: 6.6 + (i % 3) * 1.6,
            speed: (0.13 + (i % 4) * 0.035) * (i % 2 ? 1 : -1),
            phase: (i / chipData.length) * Math.PI * 2,
            y: Math.sin(i * 1.7) * 2.6,
            bob: 0.4 + Math.random() * 0.5,
            hover: 0,
            op: 0.95,
            name: s.name
        };
        chips3d.push(data);
        chipGroup.add(sprite);
    });

    /* ---------------- interaÃ§Ã£o ---------------- */
    const pointer = new THREE.Vector2(-10, -10);
    const ray = new THREE.Raycaster();
    const tooltip = document.getElementById("tooltip3d");
    let hovered = null;
    let dragging = false, lastX = 0, lastY = 0;
    const dragVel = { x: 0, y: 0 };
    const tilt = { x: 0, y: 0 };
    let scrollP = 0;
    let burstUntil = 0;

    const inHero = () => window.scrollY < window.innerHeight * 0.92;
    const isUI = (t) => !!(t && t.closest && t.closest("a, button, input, textarea, iframe, .skill-card, .project-card, .music-panel"));

    window.addEventListener("pointermove", (e) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
        tilt.x = pointer.x;
        tilt.y = pointer.y;
        if (dragging) {
            dragVel.y = (e.clientX - lastX) * 0.006;
            dragVel.x = (e.clientY - lastY) * 0.006;
            lastX = e.clientX; lastY = e.clientY;
        }
        if (hovered && tooltip) {
            tooltip.style.left = e.clientX + "px";
            tooltip.style.top = e.clientY + "px";
        }
    }, { passive: true });

    window.addEventListener("pointerdown", (e) => {
        if (!inHero() || isUI(e.target)) return;
        dragging = true;
        lastX = e.clientX; lastY = e.clientY;
        document.body.style.userSelect = "none";
    });

    window.addEventListener("pointerup", (e) => {
        if (dragging) {
            dragging = false;
            document.body.style.userSelect = "";
        }
    });

    window.addEventListener("click", (e) => {
        if (!inHero() || isUI(e.target) || !hovered) return;
        const alvo = document.querySelector('.skill-card[data-skill="' + hovered.name + '"]');
        if (alvo) {
            document.getElementById("skills").scrollIntoView({ behavior: "smooth", block: "start" });
            setTimeout(() => {
                alvo.classList.add("flash");
                setTimeout(() => alvo.classList.remove("flash"), 1300);
            }, 750);
        }
    });

    /* ---------------- tema + comemoraÃ§Ã£o ---------------- */
    window.Scene3D = {
        setAccent(hex) {
            if (!hex) return;
            const c = new THREE.Color(hex);
            accentMats.forEach(m => { if (m.color) m.color.copy(c); });
            if (coreMat.emissive) coreMat.emissive.copy(c);
            if (coreMat.color) coreMat.color.copy(c.clone().multiplyScalar(0.7));
            if (rim.color) rim.color.copy(c);
            // partÃ­culas
            const arr = pGeo.attributes.color.array;
            const white = new THREE.Color(0xffffff);
            for (let i = 0; i < COUNT; i++) {
                const useWhite = arr[i * 3] === white.r && arr[i * 3 + 1] === white.g && arr[i * 3 + 2] === white.b;
                const col = useWhite ? white : c;
                arr[i * 3] = col.r; arr[i * 3 + 1] = col.g; arr[i * 3 + 2] = col.b;
            }
            pGeo.attributes.color.needsUpdate = true;
        },
        burst() { burstUntil = performance.now() + 1600; }
    };

    /* ---------------- scroll ---------------- */
    let fadeSet = false;
    function onScroll() {
        const y = window.scrollY;
        scrollP = Math.min(y / (window.innerHeight * 1.4), 1);
        if (y > 20 && !fadeSet) { canvas.style.transition = "none"; fadeSet = true; }
        if (fadeSet) canvas.style.opacity = String(Math.max(1 - scrollP * 0.9, 0.1));
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------------- resize ---------------- */
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight, false);
    });

    /* ---------------- loop ---------------- */
    const clock = new THREE.Clock();
    const heroBox = document.querySelector(".hero-inner");
    const scratch = new THREE.Vector3();
    let heroRect = null, rectTick = 0;
    let visible = true;
    document.addEventListener("visibilitychange", () => { visible = !document.hidden; });

    function tick() {
        requestAnimationFrame(tick);
        if (!visible) return;

        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;
        const now = performance.now();
        const bursting = now < burstUntil;
        const speedBoost = bursting ? 3.4 : 1;

        // rotaÃ§Ã£o base + parallax + arrasto
        if (!dragging) { dragVel.x *= 0.94; dragVel.y *= 0.94; }
        world.rotation.y += dt * 0.11 * speedBoost + dragVel.y;
        world.rotation.x += dragVel.x;
        world.rotation.x += (tilt.y * 0.16 - world.rotation.x) * 0.045;
        world.rotation.y += (-tilt.x * 0.12 - (world.rotation.y % (Math.PI * 2)) * 0) * 0; // parallax aplicado via cÃ¢mera abaixo

        camera.position.x += (tilt.x * 1.5 - camera.position.x) * 0.05;
        camera.position.y += (tilt.y * 0.9 - scrollP * 1.6 - camera.position.y) * 0.05;
        camera.position.z = 12 + scrollP * 4.5;
        camera.lookAt(0, -scrollP * 0.8, 0);

        // nÃºcleo e anÃ©is
        core.rotation.y += dt * 0.35 * speedBoost;
        core.rotation.x += dt * 0.18;
        wire.rotation.y -= dt * 0.28 * speedBoost;
        shell.rotation.y += dt * 0.08;
        shell.rotation.z -= dt * 0.05;
        rings.forEach((ring, i) => {
            ring.rotation.z += dt * (0.12 + i * 0.05) * speedBoost;
            ring.rotation.y += dt * 0.04 * (i % 2 ? 1 : -1);
        });
        coreMat.emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.12 + (bursting ? 0.7 : 0);

        // partÃ­culas
        particles.rotation.y += dt * 0.014;
        particles.rotation.x = Math.sin(t * 0.1) * 0.05;

        // bolhas orbitando
        chips3d.forEach((c) => {
            const a = c.phase + t * c.speed * speedBoost;
            c.sprite.position.set(
                Math.cos(a) * c.radius,
                c.y + Math.sin(t * c.bob + c.phase) * 0.5,
                Math.sin(a) * c.radius
            );
        });

        // hover nas bolhas (sÃ³ na hero)
        if (inHero() && !dragging) {
            ray.setFromCamera(pointer, camera);
            const hits = ray.intersectObjects(chipGroup.children, false);
            const hit = hits.length ? hits[0].object : null;
            const found = chips3d.find(c => c.sprite === hit) || null;
            if (found !== hovered) {
                hovered = found;
                if (tooltip) {
                    tooltip.textContent = found ? found.name + " Â· clique para ver" : "";
                    tooltip.classList.toggle("show", !!found);
                }
                canvas.style.cursor = found ? "pointer" : "";
            }
        } else if (hovered) {
            hovered = null;
            if (tooltip) tooltip.classList.remove("show");
            canvas.style.cursor = "";
        }

        chips3d.forEach((c) => {
            const target = (c === hovered) ? 1 : 0;
            c.hover += (target - c.hover) * 0.14;
            const s = 1 + c.hover * 0.3;
            c.sprite.scale.set(c.base.x * s, c.base.y * s, 1);

            // some quando a bolha passa por cima do texto do hero
            let op = 0.95;
            scratch.copy(c.sprite.position).applyMatrix4(world.matrixWorld);
            const dist = Math.max(scratch.distanceTo(camera.position), 0.001);
            if (heroBox) {
                if (now - rectTick > 120) { heroRect = heroBox.getBoundingClientRect(); rectTick = now; }
                if (heroRect) {
                    scratch.project(camera);
                    if (scratch.z < 1) {
                        const sx = (scratch.x * 0.5 + 0.5) * window.innerWidth;
                        const sy = (-scratch.y * 0.5 + 0.5) * window.innerHeight;
                        // raio aproximado da bolha em pixels (cresce quando chega perto da câmera)
                        const pxPerUnit = (window.innerHeight * 0.5) /
                            (Math.tan((camera.fov * Math.PI / 180) / 2) * dist);
                        const rx = (c.base.x * 0.5 * s) * pxPerUnit + 24;
                        const ry = (c.base.y * 0.5 * s) * pxPerUnit + 24;
                        const pad = 60;
                        const over = (sx + rx > heroRect.left - pad) && (sx - rx < heroRect.right + pad) &&
                            (sy + ry > heroRect.top - pad) && (sy - ry < heroRect.bottom + pad);
                        if (over) op = (hovered === c) ? 0.55 : 0.1;
                    }
                }
            }

            // some também quando chega perto demais da câmera (evita virar gigante)
            const near = Math.min(Math.max((dist - 6) / 3.5, 0), 1);
            op *= 0.05 + near * 0.95;

            c.op += (op - c.op) * 0.3;
            c.sprite.material.opacity = c.op + c.hover * 0.1;
        });

        renderer.render(scene, camera);
    }
    tick();
}
