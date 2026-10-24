const intro = document.getElementById("intro");
const soundGate = document.getElementById("sound-gate");
const background = document.getElementById("background");
const zuko = document.getElementById("zuko");
const fireball = document.getElementById("fireball");
const katara = document.getElementById("katara");
const ice = document.getElementById("ice");
const toph = document.getElementById("toph");
const rock = document.getElementById("rock");
const elementName = document.getElementById("element-name");
const skip = document.getElementById("skip");
const start = document.getElementById("start");

const fireSound = document.getElementById("fire-sound");
const fireWaveSound = document.getElementById("fire-wave-sound");
const footstepSound = document.getElementById("footstep-sound");
const typeSound = document.getElementById("type-sound");
const clickSound = document.getElementById("click-sound");
const stompSound = document.getElementById("stomp-sound");
const eightBitSound = document.getElementById("eightbit-sound");
const jumpSound = document.getElementById("jump-sound");
const landSound = document.getElementById("land-sound");
const iceSound = document.getElementById("ice-sound");
const splashSound = document.getElementById("splash-sound");
const splash2Sound = document.getElementById("splash2-sound");
const earthPullSound = document.getElementById("earth-pull-sound");
const earthHitSound = document.getElementById("earth-hit-sound");
const earthSmashSound = document.getElementById("earth-smash-sound");
const aang = document.getElementById("aang");
const airShot = document.getElementById("air-shot");
const airKickSound = document.getElementById("air-kick-sound");
const airProjectileSound = document.getElementById("air-projectile-sound");
const airPushSound = document.getElementById("air-push-sound");

// phone check and fix
const IS_PHONE = /iPhone|iPod|Android/i.test(navigator.userAgent);
const K = IS_PHONE ? 0.6 : 1;
if (IS_PHONE) document.documentElement.classList.add("phone");

const SLOWDOWN = 2;
const DECAY_MS = 2500;     
const DECAY_CELL = 20;     
const FLAME_MS = 1000;      
const KATARA_CENTER = 50;  
const KATARA_RIGHT = 68;   
const TOPH_CENTER = 50;    
const TOPH_RIGHT = 58;      
const ROCK_FAR = "95vw";                   
const ROCK_NEAR = `calc(50vw + ${170 * K}px)`;   
const ROCK_GONE = "130vw";                  
const EARTH_BG = ["assets/images/Earthbending.png", "assets/images/Earthbending2.png"];
const AIR_BG = ["assets/images/Airbending.png", "assets/images/Airbending2.png"];
const AANG_START = 85;  
const AANG_CENTER = 50;     
let stopped = false;

// Volumes
fireSound.volume = 0.5;
fireWaveSound.volume = 0.5;
footstepSound.volume = 0.6;
typeSound.volume = 0.5;
clickSound.volume = 0.9;
stompSound.volume = 0.5;
eightBitSound.volume = 0.5;
jumpSound.volume = 0.5;
landSound.volume = 0.5;
iceSound.volume = 0.5;
splashSound.volume = 0.5;
splash2Sound.volume = 0.5;
earthPullSound.volume = 0.5;
earthHitSound.volume = 0.5;
earthSmashSound.volume = 0.5;
airKickSound.volume = 0.5;
airProjectileSound.volume = 0.5;
airPushSound.volume = 0.5;


document.querySelectorAll("audio").forEach(audio => {
    audio.addEventListener("error", () => {
        console.warn(`Could not load audio: ${audio.getAttribute("src")}`);
    });
});
const wait = ms => new Promise(resolve => setTimeout(resolve, ms * SLOWDOWN));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// preloading

["01", "02", "03", "04", "06", "07", "08", "09"].forEach(frame => {
    const image = new Image();
    image.src = `assets/zuko/${frame}.png`;
});

["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].forEach(frame => {
    const image = new Image();
    image.src = `assets/katara/${frame}.png`;
});

["01", "02", "03", "04", "05", "06", "07", "08", "09"].forEach(frame => {
    const image = new Image();
    image.src = `assets/toph/${frame}.png`;
});

["01", "02", "03", "04", "05", "06", "07"].forEach(frame => {
    const image = new Image();
    image.src = `assets/aang/${frame}.png`;
});

[...EARTH_BG, ...AIR_BG].forEach(src => {
    const image = new Image();
    image.src = src;
});
// background

const ZUKO_BG = ["assets/zuko/10-1.png", "assets/zuko/10-2.png"];
const KATARA_BG = ["assets/katara/bg-1.png", "assets/katara/bg-2.png"];
let flameTimer = null;

[...ZUKO_BG, ...KATARA_BG].forEach(src => {
    const image = new Image();
    image.src = src;
});

function setBackground(frames, ms = FLAME_MS) {
    clearInterval(flameTimer);

    let index = 0;
    background.src = frames[0];

    flameTimer = setInterval(() => {
        index = (index + 1) % frames.length;
        background.src = frames[index];
    }, ms);
}

setBackground(ZUKO_BG);

// helpers

function showFrame(frame) {
    zuko.src = `assets/zuko/${frame}.png`;
}

function showKatara(frame) {
    katara.src = `assets/katara/${frame}.png`;
}

function showToph(frame) {
    toph.src = `assets/toph/${frame}.png`;
}
function showAang(frame) {
    aang.src = `assets/aang/${frame}.png`;
}

function launchAirShot() {
    if (stopped) return;
    airShot.classList.remove("fly");
    airShot.style.transition = "none";
    airShot.style.display = "block";
    airShot.getBoundingClientRect();
    airShot.style.transition = "";
    airShot.classList.add("fly");
}

function hideAirShot() {
    airShot.style.display = "none";
    airShot.classList.remove("fly");
}
function playSound(sound) {
    if (!sound || stopped) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
}

function stopSound(sound) {
    if (!sound) return;
    sound.pause();
    sound.currentTime = 0;
}

function fadeOutSound(sound, ms = 800) {
    if (!sound || sound.paused) return;

    const startVolume = sound.volume;
    const startedAt = performance.now();

    function step(now) {
        const progress = Math.min((now - startedAt) / ms, 1);
        sound.volume = startVolume * (1 - progress);

        if (progress < 1 && !stopped) {
            requestAnimationFrame(step);
        } else {
            sound.pause();
            sound.currentTime = 0;
            sound.volume = startVolume;
        }
    }

    requestAnimationFrame(step);
}

function launchFireball() {
    if (stopped) return;
    fireball.style.display = "block";
    fireball.getBoundingClientRect();
    fireball.classList.add("fly");
}

function launchIce() {
    if (stopped) return;
    // in launchIce():
    ice.style.left = `calc(${KATARA_RIGHT}vw + ${140 * K}px)`;
    ice.style.display = "block";
    ice.getBoundingClientRect();
    ice.classList.add("fly");
}

function pullRock(ms) {
    if (stopped) return;
    rock.style.transition = "none";
    rock.style.left = ROCK_FAR;
    rock.style.display = "block";
    rock.getBoundingClientRect();
    rock.style.transition = `left ${ms * SLOWDOWN}ms ease-out`;
    rock.style.left = ROCK_NEAR;
}

function shootRock(ms) {
    if (stopped) return;
    rock.style.transition = `left ${ms * SLOWDOWN}ms ease-in`;
    rock.style.left = ROCK_GONE;
}

function hideRock() {
    rock.style.display = "none";
    rock.style.transition = "none";
}

// movement

async function walkTo(target, duration) {
    const startPosition = parseFloat(getComputedStyle(zuko).left) / window.innerWidth * 100;
    const distance = target - startPosition;
    const startedAt = performance.now();
    const totalDuration = duration * SLOWDOWN;

    playSound(footstepSound);

    while (!stopped) {
        const progress = Math.min((performance.now() - startedAt) / totalDuration, 1);
        zuko.style.left = `${startPosition + distance * progress}vw`;

        if (progress >= 1) break;

        showFrame(Math.floor((performance.now() - startedAt) / (180 * SLOWDOWN)) % 2 === 0 ? "01" : "02");
        await wait(30);
    }

    stopSound(footstepSound);
}

async function jumpTo(character, setFrame, frames, target, duration, height) {
    const startPosition = parseFloat(getComputedStyle(character).left) / window.innerWidth * 100;
    const distance = target - startPosition;
    const startedAt = performance.now();
    const totalDuration = duration * SLOWDOWN;
    let shown = null;

    while (!stopped) {
        const progress = Math.min((performance.now() - startedAt) / totalDuration, 1);
        const arc = Math.sin(progress * Math.PI) * height;
        const frame = frames[Math.min(Math.floor(progress * frames.length), frames.length - 1)];

        if (frame !== shown) {
            shown = frame;
            setFrame(frame);
        }

        character.style.left = `${startPosition + distance * progress}vw`;
        character.style.bottom = `calc(8% + ${arc}px)`;

        if (progress >= 1) break;
        await wait(16);
    }

    character.style.bottom = "8%";
}

// fire text (not using it but keeping it here)

async function revealFire() {
    if (stopped) return;

    await sleep(1500);   
    if (stopped) return;

    elementName.textContent = "";
    elementName.style.opacity = "1";

    for (const letter of "FIRE") {
        if (stopped) return;

        elementName.textContent += letter;
        playSound(typeSound);
        await wait(250);
    }

    stopSound(typeSound);
}

// ezzz pixel decay

function shuffledCells(cols, rows) {
    const cells = Array.from({ length: cols * rows }, (_, i) => i);

    for (let i = cells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    return cells;
}

async function pixelPass(canvas, paintCell) {
    const ctx = canvas.getContext("2d");
    const cols = Math.ceil(canvas.width / DECAY_CELL);
    const rows = Math.ceil(canvas.height / DECAY_CELL);
    const cells = shuffledCells(cols, rows);

    playSound(eightBitSound);

    const startedAt = performance.now();
    let drawn = 0;

    await new Promise(resolve => {
        function step(now) {
            if (stopped) return resolve();

            const progress = Math.min((now - startedAt) / DECAY_MS, 1);
            const target = Math.floor(progress * cells.length);

            while (drawn < target) {
                const cell = cells[drawn++];
                paintCell(ctx, (cell % cols) * DECAY_CELL, Math.floor(cell / cols) * DECAY_CELL);
            }

            if (progress >= 1) return resolve();
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    });
}

async function pixelCover() {
    if (stopped) return null;

    const canvas = document.createElement("canvas");
    canvas.id = "decay";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    intro.appendChild(canvas);

    await pixelPass(canvas, (ctx, x, y) => {
        ctx.fillStyle = "#000";
        ctx.fillRect(x, y, DECAY_CELL, DECAY_CELL);
    });

    return canvas;
}

async function pixelReveal(canvas) {
    if (stopped || !canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await pixelPass(canvas, (ctx, x, y) => {
        ctx.clearRect(x, y, DECAY_CELL, DECAY_CELL);
    });

    canvas.remove();
}

// zuko

async function zukoAnimation() {
    elementName.textContent = "";
    elementName.style.opacity = "0";
    fireball.style.display = "none";
    fireball.classList.remove("fly");

    zuko.style.bottom = "8%";
    zuko.style.left = "-15vw";
    showFrame("01");
    await walkTo(35, 1800);
    if (stopped) return;

    showFrame("02");
    await sleep(1000);
    if (stopped) return;

    await jumpTo(zuko, showFrame, ["03"], 50, 600, 120 * K);
    if (stopped) return;

    showFrame("04");
    playSound(stompSound);

    intro.classList.remove("shake");
    void intro.offsetWidth;
    intro.classList.add("shake");

    await wait(400);
    stopSound(stompSound);   // stomp ends when 04 ends
    if (stopped) return;

    showFrame("06");
    await wait(700);
    if (stopped) return;

    showFrame("07");
    playSound(fireSound);
    launchFireball();

    await wait(1000);
    if (stopped) return;

    showFrame("08");
    await wait(600);
    if (stopped) return;

    showFrame("09");
    playSound(fireWaveSound);
    await wait(700);
    if (stopped) return;

    fadeOutSound(fireSound, 800);
    fadeOutSound(fireWaveSound, 800);
    fireball.style.display = "none";
    fireball.classList.remove("fly");

    //cba asked to make a switch for the typewrtier effect which writes "FIRE" 
    // so i deleted it
    await sleep(2000);
    const cover = await pixelCover();
    if (stopped) return;

    switchToKatara();
    await pixelReveal(cover);
    if (stopped) return;

    await kataraAnimation();
}

// Katara

function switchToKatara() {
    intro.classList.add("scene-katara");
    clearInterval(flameTimer);
    background.src = KATARA_BG[0];

    ice.style.display = "none";
    ice.classList.remove("fly");

    katara.style.left = `${KATARA_CENTER}vw`;
    katara.style.bottom = "8%";
    showKatara("01");
}

async function kataraAnimation() {
    const idleFrames = ["01", "02", "01", "02"];

    for (let i = 0; i < idleFrames.length; i++) {
        showKatara(idleFrames[i]);
        background.src = KATARA_BG[i % 2];
        await sleep(FLAME_MS);
        if (stopped) return;
    }
    setBackground(KATARA_BG);
    playSound(jumpSound);
    await jumpTo(katara, showKatara, ["03", "04"], KATARA_RIGHT, 700, 140 * K);
    stopSound(jumpSound);
    if (stopped) return;

    showKatara("05");
    playSound(landSound);

    await wait(250);
    if (stopped) return;

    playSound(iceSound);
    launchIce();

    await wait(600);
    if (stopped) return;

    showKatara("07");
    playSound(splashSound);
    await wait(700);
    if (stopped) return;

    showKatara("08");
    await wait(600);
    if (stopped) return;

    ice.style.display = "none";
    ice.classList.remove("fly");
    fadeOutSound(iceSound, 800);   

    playSound(jumpSound);
    await jumpTo(katara, showKatara, ["09"], KATARA_CENTER, 600, 140 * K);
    stopSound(jumpSound);
    if (stopped) return;

    showKatara("10");
    playSound(landSound);
    await wait(500);
    if (stopped) return;

    showKatara("11");
    await wait(600);
    if (stopped) return;

    showKatara("12");
    playSound(splash2Sound);
    await wait(900);
    if (stopped) return;

    await sleep(2000);
    const cover = await pixelCover();
    if (stopped) return;

    switchToToph();
    await pixelReveal(cover);
    if (stopped) return;

    await tophAnimation();
}

//  toph

function switchToToph() {
    intro.classList.remove("scene-katara");
    intro.classList.add("scene-toph");
    setBackground(EARTH_BG);

    hideRock();

    toph.style.left = `${TOPH_CENTER}vw`;
    toph.style.bottom = "8%";
    showToph("01");
}

async function tophAnimation() {
    const idleFrames = ["01", "02", "01", "02"];

    for (const frame of idleFrames) {
        showToph(frame);
        await sleep(FLAME_MS);
        if (stopped) return;
    }

    showToph("03");
    playSound(earthPullSound);
    pullRock(1400);

    await wait(1400);
    if (stopped) return;

    showToph("05");
    await sleep(1000);
    if (stopped) return;

    showToph("06");
    fadeOutSound(earthPullSound, 300);
    playSound(earthHitSound);
    shootRock(800);

    await wait(700);
    if (stopped) return;

    showToph("07");
    await wait(600);
    if (stopped) return;

    hideRock();

    toph.style.left = `${TOPH_RIGHT}vw`;
    showToph("08");
    playSound(earthSmashSound);
    await wait(600);
    if (stopped) return;

    showToph("09");
    await sleep(2000);
    if (stopped) return;

    const cover = await pixelCover();
    if (stopped) return;

    switchToAang();
    await pixelReveal(cover);
    if (stopped) return;

    await aangAnimation();
}

// Aang
function switchToAang() {
    intro.classList.remove("scene-toph");
    intro.classList.add("scene-aang");
    setBackground(AIR_BG);

    hideRock();
    hideAirShot();
    aang.style.visibility = "hidden";
    aang.style.left = `${AANG_START}vw`;
    aang.style.bottom = "8%";
    showAang("01");
}

async function aangAnimation() {
    aang.style.visibility = "visible";
    showAang("01");
    playSound(airKickSound);
    await jumpTo(aang, showAang, ["01"], AANG_CENTER, 450, 0);
    if (stopped) return;

    showAang("02");
    await wait(800);
    if (stopped) return;
    showAang("03");
    playSound(airProjectileSound);
    launchAirShot();
    await wait(800);
    if (stopped) return;
    hideAirShot();

    showAang("05");
    await wait(600);
    if (stopped) return;

    showAang("06");
    await wait(600);
    if (stopped) return;

    showAang("07");
    playSound(airPushSound);
    launchAirShot();
    await wait(1000);
    if (stopped) return;
    hideAirShot();

    await sleep(2000);
    await pixelCover();
    if (stopped) return;

    finishIntro();
}

function finishIntro() {
    clearInterval(flameTimer);
    stopped = true;
    intro.style.display = "none";
}

function endIntro() {
    clearInterval(flameTimer);
    stopped = true;
    intro.style.display = "none";

    [
        fireSound, fireWaveSound, footstepSound, typeSound, clickSound, stompSound,
        eightBitSound, jumpSound, landSound, iceSound, splashSound, splash2Sound,
        earthPullSound, earthHitSound, earthSmashSound, airKickSound, airProjectileSound, airPushSound
    ].forEach(stopSound);
}


function closeSoundGate() {
    soundGate.style.display = "none";
    document.removeEventListener("keydown", onGateKey);
}

function onGateKey(event) {
    if (event.key === "Enter" || event.key === " ") closeSoundGate();
}

soundGate.addEventListener("click", closeSoundGate);
document.addEventListener("keydown", onGateKey);

let clickPlayedOnPress = false;

function unlockAudio() {
    const jobs = [...document.querySelectorAll("audio")]
        .filter(a => a !== clickSound)
        .map(a => {
            a.muted = true;
            return Promise.resolve(a.play())
                .then(() => { a.pause(); a.currentTime = 0; })
                .catch(() => {})
                .then(() => { a.muted = false; });
        });
    return Promise.race([Promise.all(jobs), sleep(800)]);
}

start.addEventListener("pointerdown", () => {
    playSound(clickSound);
    clickPlayedOnPress = true;
});

start.addEventListener("click", () => {
    if (stopped) return;

    if (!clickPlayedOnPress) playSound(clickSound);
    clickPlayedOnPress = false;

    intro.classList.remove("pre-start");
    start.style.display = "none";

    unlockAudio().then(zukoAnimation);
});

skip.addEventListener("click", endIntro);

(function () {
    "use strict";

    var WEATHER = true;   // the weather / effect switch 

    var doc = document, root = doc.documentElement;
    root.classList.add("js");

    var reduce = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    var behavior = reduce ? "auto" : "smooth";
    var isOpen = false;

    function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
    function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
    function rnd() { return Math.random(); }

    /* ---------- pixel icons ---------- */
    function svgFromRows(rows) {
        var h = rows.length, w = 0, s = "", x, y;
        for (y = 0; y < h; y++) if (rows[y].length > w) w = rows[y].length;
        for (y = 0; y < h; y++) for (x = 0; x < rows[y].length; x++) {
            var c = rows[y].charAt(x);
            if (c === "#") s += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="currentColor"/>';
            else if (c === "o") s += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="currentColor" fill-opacity="0.45"/>';
        }
        return '<svg viewBox="0 0 ' + w + " " + h + '" shape-rendering="crispEdges" aria-hidden="true">' + s + "</svg>";
    }
    function spiralRows() {
        var n = 26, c = (n - 1) / 2, g = [], x, y, t, px, py;
        for (y = 0; y < n; y++) { g.push([]); for (x = 0; x < n; x++) g[y].push("."); }
        for (t = 0.3; t < 17.5; t += 0.04) {
            px = Math.round(c + Math.cos(t) * t * 0.6); py = Math.round(c + Math.sin(t) * t * 0.6);
            if (g[py] && g[py][px] !== undefined) { g[py][px] = "#"; if (g[py][px + 1] !== undefined) g[py][px + 1] = "#"; }
        }
        return g.map(function (r) { return r.join(""); });
    }
    var ICONS = {
        air: spiralRows(),
        fire: [".....#......", "....##......", "....###.....", "...####.#...", "...#####.#..", "..######.##.", "..#######.#.", ".#########..", ".####oo####.", ".###oooo###.", "..###oo###..", "...##oo##..."],
        earth: ["....####....", "....####....", "....####....", "..########..", "..########..", "..########..", "############", "############", "############"],
        water: [".....##.....", ".....##.....", "....####....", "....####....", "...######...", "..########..", ".##########.", ".####o#####.", ".###oo#####.", ".##########.", "..########..", "...######..."],
        mail: ["############", "#..........#", "##........##", "#.##....##.#", "#...####...#", "#..........#", "############"],
        face: ["...######...", "..########..", ".##########.", ".##..##..##.", ".##..##..##.", ".##########.", ".##########.", ".###....###.", ".##########.", "..########..", "...######..."]
    };
    $$("[data-emblem]").forEach(function (el) { el.innerHTML = svgFromRows(ICONS[el.getAttribute("data-emblem")]); });
    $$("[data-img]").forEach(function (el) {   // real image if it loads, pixel glyph otherwise
        var im = new Image();
        im.alt = ""; im.onload = function () { el.innerHTML = ""; el.appendChild(im); };
        im.src = el.getAttribute("data-img");
    });
    $$('[data-icon="face"]').forEach(function (el) { el.innerHTML = svgFromRows(ICONS.face); });


    $$(".tape").forEach(function (t) {
        var w = t.getAttribute("data-t").toUpperCase();
        t.innerHTML = '<div class="tape-in"><span>' + w + "</span><span>" + w + "</span><span>" + w + "</span></div>";
    });
    function fitTapes() {
        $$(".tape").forEach(function (t) {
            var spans = t.getElementsByTagName("span"), sp = spans[0], W = t.parentNode.offsetWidth, n = sp.textContent.length, cap = W < 700 ? 32 : 80, fs, w, extra, gap, i;
            if (!W) return;
            for (i = 0; i < spans.length; i++) { spans[i].style.letterSpacing = "0px"; spans[i].style.paddingRight = "0px"; spans[i].style.fontSize = "96px"; }
            w = sp.getBoundingClientRect().width || 1;
            fs = Math.max(16, Math.min(cap, Math.floor(96 * W * 0.98 / w / 8) * 8));   // whole multiples of 8px keep the pixel font crisp
            for (i = 0; i < spans.length; i++) spans[i].style.fontSize = fs + "px";
            w = sp.getBoundingClientRect().width;
            extra = W * 0.98 - w; gap = Math.round(fs * 1.2);
            for (i = 0; i < spans.length; i++) { spans[i].style.letterSpacing = (extra > 0 ? extra / n : 0) + "px"; spans[i].style.paddingRight = gap + "px"; }
            t.style.setProperty("--unit", (sp.getBoundingClientRect().width) + "px");
            t.style.height = Math.round(fs * 1.4) + "px";
        });
    }
    var slabs = $$(".slab"), biomes = $$(".slab .biome, .slab .contact"), T = 80;
    function tear() {
        T = Math.round(Math.min(150, Math.max(44, root.clientWidth * 0.09)));
        root.style.setProperty("--tear", T + "px");
        slabs.forEach(function (s, i) {
            var b = s.querySelector(".biome"); if (!b) return;
            var W = b.offsetWidth, H = b.offsetHeight, dir = (i % 2 === 0) ? 1 : -1;
            var step = W < 700 ? 12 : 16, J = W < 700 ? 8 : 24, r = mulberry(i * 977 + 13);
            var pts = ["0px 0px", W + "px 0px"], n = Math.ceil(W / step), k, x0, x1, t, base, jag, y;
            for (k = n; k >= 1; k--) {
                x1 = Math.min(W, k * step); x0 = (k - 1) * step; t = ((x0 + x1) / 2) / W;
                base = H - T + (dir > 0 ? T * t : T * (1 - t));
                jag = Math.round((r() - 0.5) * 2 * J / 8) * 8;
                if (r() < 0.06) jag += Math.round(r() * J * 2 / 8) * 8 * (r() < 0.5 ? -1 : 1);
                y = Math.round(Math.max(H - T - J * 2, Math.min(H, base + jag)));
                pts.push(x1 + "px " + y + "px", x0 + "px " + y + "px");
            }
            var cp = "polygon(" + pts.join(",") + ")";
            b.style.clipPath = cp; b.style.webkitClipPath = cp;
            s.style.setProperty("--ang", (Math.atan2(T, W) * 180 / Math.PI * dir).toFixed(2) + "deg");
        });
    }

    /* ---------- pixel weather ---------- */
    var S = 5, COL = { ink: "#ece9f5", air: "#cfd8ff", fire: "#ff5a1f", hot: "#ffc233", earth: "#97c25c", water: "#22c4ff" };
    var L = 26, PAL = (function () {
        var st = [[0, 0, 0, 0, 0], [.05, 90, 14, 8, 36], [.3, 200, 40, 12, 105], [.58, 255, 90, 31, 150], [.85, 255, 194, 51, 165], [1, 255, 236, 170, 175]], p = [], i, j, f, a, b, u;
        for (i = 0; i <= L; i++) {
            f = i / L;
            for (j = 1; j < st.length; j++) if (f <= st[j][0]) {
                a = st[j - 1]; b = st[j]; u = (f - a[0]) / (b[0] - a[0]);
                p.push([a[1] + (b[1] - a[1]) * u | 0, a[2] + (b[2] - a[2]) * u | 0, a[3] + (b[3] - a[3]) * u | 0, a[4] + (b[4] - a[4]) * u | 0]);
                break;
            }
        }
        return p;
    })();

    var FX = {
        air: {
            init: function (f) { var n = Math.round(f.w * f.h / 520), a = [], i; for (i = 0; i < n; i++) a.push({ x: rnd() * f.w, y: rnd() * f.h, l: 3 + Math.floor(rnd() * 14), s: 6 + rnd() * 26, a: .12 + rnd() * .4, p: rnd() * 6.28 }); return a; },
            draw: function (f, dt, t) {
                var c = f.ctx, a = f.st, i, p, g = 1 + 2.2 * Math.pow(Math.max(0, Math.sin(t * .45)), 8);
                c.clearRect(0, 0, f.w, f.h); c.fillStyle = COL.air;
                for (i = 0; i < a.length; i++) {
                    p = a[i]; p.x += p.s * g * dt; p.y -= p.s * g * dt * .3 - Math.sin(t * 1.3 + p.p) * .12;
                    if (p.x > f.w || p.y < -2) { p.x = -p.l - rnd() * 12; p.y = rnd() * f.h * 1.3; }
                    c.globalAlpha = Math.min(1, p.a * (g > 1.6 ? 1.5 : 1)); c.fillRect(p.x | 0, p.y | 0, p.l * (g > 1.6 ? 1.6 : 1) | 0, 1);
                }
                c.globalAlpha = 1;
            }
        },
        fire: {
            init: function (f) {
                var fh = Math.min(f.h, Math.round(f.h * .42)), em = [], i;
                for (i = 0; i < 22; i++) em.push({ x: rnd() * f.w, y: f.h - rnd() * fh, vy: 10 + rnd() * 28, ph: rnd() * 6.28, life: rnd() * 3, max: 3 });
                return { fh: fh, heat: new Uint8Array(f.w * fh), img: f.ctx.createImageData(f.w, fh), em: em, acc: 0 };
            },
            draw: function (f, dt, t) {
                var s = f.st, w = f.w, fh = s.fh, c = f.ctx, heat = s.heat, d = s.img.data, i, x, y, src, r, dst, l, p, n, e, u, steps = 0;
                s.acc += dt;
                while (s.acc >= .033 && steps < 3) {
                    s.acc -= .033; steps++;
                    for (x = 0; x < w; x++) { n = .5 + .5 * Math.sin(x * .09 + t * 2.2) * Math.sin(x * .037 - t * 1.1 + 1.3); heat[(fh - 1) * w + x] = Math.round(L * (.3 + .7 * n)); }
                    for (y = 1; y < fh; y++) for (x = 0; x < w; x++) {
                        src = y * w + x; l = heat[src];
                        if (l === 0) { heat[src - w] = 0; } else { r = (rnd() * 3) | 0; dst = src - r + 1; heat[dst - w] = l - (r === 1 ? 1 : (rnd() < .25 ? 1 : 0)); }
                    }
                }
                for (i = 0; i < heat.length; i++) { p = PAL[heat[i]]; d[i * 4] = p[0]; d[i * 4 + 1] = p[1]; d[i * 4 + 2] = p[2]; d[i * 4 + 3] = p[3]; }
                c.clearRect(0, 0, w, f.h); c.putImageData(s.img, 0, f.h - fh);
                for (i = 0; i < s.em.length; i++) {
                    e = s.em[i]; e.y -= e.vy * dt; e.x += Math.sin(t * 2 + e.ph) * 9 * dt; e.life -= dt;
                    if (e.life <= 0 || e.y < 0) { e.x = rnd() * w; e.y = f.h - rnd() * fh * .5; e.vy = 10 + rnd() * 28; e.life = e.max = 2 + rnd() * 3; }
                    u = e.life / e.max; c.globalAlpha = Math.min(1, u * 1.6) * (.6 + .4 * Math.sin(t * 20 + e.ph));
                    c.fillStyle = u > .6 ? COL.hot : (u > .3 ? COL.fire : "#a8260e"); c.fillRect(e.x | 0, e.y | 0, 1, 1);
                }
                c.globalAlpha = 1;
            }
        },
        earth: {
            init: function (f) { var a = [], n = Math.round(f.w * f.h / 800), i, d; for (i = 0; i < n; i++) { d = Math.floor(rnd() * 3); a.push({ x: rnd() * f.w, y: rnd() * f.h, d: d, s: 5 + d * 9 + rnd() * 4, z: d === 2 ? 2 : 1, a: .18 + d * .2 }); } return a; },
            draw: function (f, dt, t) {
                var c = f.ctx, a = f.st, i, p, x, y, rum = ((t % 11) > 10.2) ? 1 : 0;
                c.clearRect(0, 0, f.w, f.h); c.fillStyle = COL.earth; c.globalAlpha = .08;
                for (i = 0; i < 7; i++) { y = (f.h * (i + .5) / 7 + Math.sin(t * .1 + i) * 2) | 0; for (x = 0; x < f.w; x += 8) c.fillRect(x, y, 5, 1); }
                for (i = 0; i < a.length; i++) {
                    p = a[i]; p.y += p.s * dt; p.x += Math.sin(t * .6 + p.y * .05) * 3 * dt;
                    if (p.y > f.h) { p.y = -2; p.x = rnd() * f.w; }
                    c.globalAlpha = p.a; c.fillRect((p.x + (rum ? (rnd() * 3 | 0) - 1 : 0)) | 0, p.y | 0, p.z, p.z);
                }
                c.globalAlpha = 1;
            }
        },
        water: {
            init: function (f) { var b = [], i; for (i = 0; i < 14; i++) b.push({ x: rnd() * f.w, y: rnd() * f.h, s: 4 + rnd() * 10, p: rnd() * 6.28 }); return { rip: [], nx: .6, b: b, lastPtr: 0 }; },
            draw: function (f, dt, t) {
                var c = f.ctx, s = f.st, i, j, r, a, x, y, base, life;
                function add(px, py) { if (s.rip.length < 8) s.rip.push({ x: px, y: py, r: 1, max: 28 + rnd() * 34, sp: 16 + rnd() * 8 }); }
                c.clearRect(0, 0, f.w, f.h);
                s.nx -= dt; if (s.nx <= 0) { s.nx = 1.4 + rnd() * 1.8; add(rnd() * f.w, rnd() * f.h * .85); }
                c.fillStyle = COL.water;
                for (i = s.rip.length - 1; i >= 0; i--) {
                    r = s.rip[i]; r.r += r.sp * dt; life = 1 - r.r / r.max;
                    if (life <= 0) { s.rip.splice(i, 1); continue; }
                    for (j = 0; j < 2; j++) {
                        c.globalAlpha = (j ? .25 : .55) * life;
                        for (a = 0; a < 6.2832; a += 1 / (r.r + 2)) c.fillRect(Math.round(r.x + Math.cos(a) * (r.r - j * 3)), Math.round(r.y + Math.sin(a) * (r.r - j * 3) * .5), 1, 1);
                    }
                }
                for (i = 0; i < s.b.length; i++) {
                    r = s.b[i]; r.y -= r.s * dt; r.x += Math.sin(t + r.p) * 3 * dt;
                    if (r.y < 0) { r.y = f.h; r.x = rnd() * f.w; }
                    c.globalAlpha = .45; c.fillRect(r.x | 0, r.y | 0, 1, 1);
                }
                for (j = 0; j < 3; j++) {
                    base = f.h - Math.round(f.h * .1) - j * 4;
                    for (x = 0; x < f.w; x++) {
                        y = base + Math.round(Math.sin(x * .09 + t * 1.3 + j) * 2);
                        c.globalAlpha = .4 - j * .1; c.fillRect(x, y, 1, 1);
                        if (j === 0) { c.globalAlpha = .07; c.fillRect(x, y + 1, 1, f.h - y); }
                    }
                }
                c.globalAlpha = 1;
            }
        },
        stars: {
            init: function (f) { var a = [], n = Math.round(f.w * f.h / 380), i, cs = [COL.air, COL.fire, COL.earth, COL.water]; for (i = 0; i < n; i++) a.push({ x: rnd() * f.w | 0, y: rnd() * f.h | 0, ph: rnd() * 6.28, sp: .5 + rnd() * 2, c: (i % 5 === 0) ? cs[(i / 5) % 4 | 0] : COL.ink }); return { a: a, st: [], nx: 1.2 }; },
            draw: function (f, dt, t) {
                var c = f.ctx, s = f.st, i, p, k, cs = [COL.air, COL.fire, COL.earth, COL.water];
                c.clearRect(0, 0, f.w, f.h);
                for (i = 0; i < s.a.length; i++) { p = s.a[i]; c.fillStyle = p.c; c.globalAlpha = .12 + .5 * (.5 + .5 * Math.sin(t * p.sp + p.ph)); c.fillRect(p.x, p.y, 1, 1); }
                c.globalAlpha = 1;
            }
        }
    };

    var fxs = $$(".fx").map(function (cv) { return { cv: cv, ctx: cv.getContext("2d"), kind: cv.getAttribute("data-fx"), host: cv.parentNode, vis: false, w: 0, h: 0, st: null, ptr: null }; });
    function staticFrame(f) { var i; for (i = 0; i < 60; i++) FX[f.kind].draw(f, .033, 2 + i * .033); }
    function sizeFx() {
        if (!WEATHER) { fxs.forEach(function (f) { f.cv.style.display = "none"; }); return; }
        S = root.clientWidth < 700 ? 4 : 5;
        fxs.forEach(function (f) {
            var w = Math.max(8, Math.ceil(f.host.offsetWidth / S)), h = Math.max(8, Math.ceil(f.host.offsetHeight / S));
            if (w === f.w && h === f.h && f.st) return;
            f.cv.width = w; f.cv.height = h; f.w = w; f.h = h; f.st = FX[f.kind].init(f);
            if (reduce) staticFrame(f);
        });
    }
    var last = 0, tt = 0;
    function frame(ts) {
        requestAnimationFrame(frame);
        var dt = Math.min(.05, (ts - last) / 1000 || .016); last = ts; tt += dt;
        fxs.forEach(function (f) { if (f.vis && f.st) FX[f.kind].draw(f, dt, tt); });
    }

    function layout() { tear(); fitTapes(); sizeFx(); }
    layout();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(layout);
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(layout, 150); });
    if (window.ResizeObserver) { var ro = new ResizeObserver(function () { clearTimeout(rt); rt = setTimeout(layout, 80); }); biomes.forEach(function (b) { ro.observe(b); }); }

    if ("IntersectionObserver" in window) {
        var vio = new IntersectionObserver(function (es) { es.forEach(function (e) { fxs.forEach(function (f) { if (f.host === e.target) f.vis = e.isIntersecting; }); }); }, { rootMargin: "120px" });
        biomes.forEach(function (b) { vio.observe(b); });
    } else { fxs.forEach(function (f) { f.vis = true; }); }
    var tabs = $$(".tabs a"), ticking = false;
    function onScroll() {
        if (ticking) return; ticking = true;
            requestAnimationFrame(function () {
                ticking = false;
                var vh = window.innerHeight, mid = vh * .42, cur = null;
                biomes.forEach(function (b, i) {
                    var r = b.getBoundingClientRect();
                    if (!reduce) b.style.setProperty("--p", Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2))).toFixed(3));
                    if (r.top + (i ? T : 0) <= mid && r.bottom > mid) cur = b;
                });
                var id = cur ? cur.parentNode.id : "";
                tabs.forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-go") === id); });
            });
        }
        window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll);

        $$("[data-go]").forEach(function (a) {
            a.addEventListener("click", function (e) {
                e.preventDefault();
                var id = a.getAttribute("data-go");
                if (id === "top") { window.scrollTo({ top: 0, behavior: behavior }); return; }
                var s = doc.getElementById(id); if (!s) return;
                window.scrollTo({ top: s.getBoundingClientRect().top + window.pageYOffset + (slabs.indexOf(s) > 0 ? T + 10 : 0), behavior: behavior });
            });
        });
        $$("[data-placeholder]").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); }); });
        var copy = doc.getElementById("copy"), mail = doc.getElementById("mail"), lab = copy.querySelector("span");
        function flash(m) { lab.textContent = m; setTimeout(function () { lab.textContent = "Copy"; }, 1800); }
        function pick() { var r = doc.createRange(), s = window.getSelection(); r.selectNodeContents(mail); s.removeAllRanges(); s.addRange(r); }
        copy.addEventListener("click", function () {
            try { navigator.clipboard.writeText(mail.textContent.trim()).then(function () { flash("Copied"); }, function () { pick(); flash("Selected"); }); }
            catch (e) { pick(); flash("Selected"); }
        });

        /* ---------- Fire project expand effect ---------- */
        var fireSlab = doc.getElementById("fire"), fireBiome = fireSlab.querySelector(".biome"), viewing = null, closeT;
        function rowInset(id) {
            var btn = doc.querySelector('[data-open="' + id + '"]'), r = btn.getBoundingClientRect(), br = fireBiome.getBoundingClientRect();
            return "inset(" + Math.max(0, r.top - br.top) + "px " + Math.max(0, br.right - r.right) + "px " + Math.max(0, br.bottom - r.bottom) + "px " + Math.max(0, r.left - br.left) + "px)";
        }
        function lockRest(on) {
            $$(".biome > .wrap", fireBiome.parentNode).forEach(function (w) { if (on) w.setAttribute("inert", ""); else w.removeAttribute("inert"); });
        }
        // put the project content where the visitor is already looking (the page itself never scrolls)
        function placeProject(pv) {
            var inn = pv.firstElementChild, br = fireBiome.getBoundingClientRect(), lo = T + 14 + 50, top, need;
            fireBiome.style.minHeight = "";
            top = Math.max(lo, 110 - br.top);
            inn.style.setProperty("--pvt", Math.round(top) + "px");
            need = top + inn.offsetHeight + T + 40;
            if (need > br.height) { fireBiome.style.minHeight = Math.ceil(need) + "px"; layout(); }
        }
        function openProject(id) {
            var pv = doc.getElementById(id); if (!pv || viewing) return;
            clearTimeout(closeT); viewing = pv;
            fireSlab.classList.add("viewing");
            pv.style.transition = "none"; pv.hidden = false; pv.classList.remove("show");
            placeProject(pv);
            pv.style.clipPath = rowInset(id);
            void pv.offsetWidth;
            pv.style.transition = "";
            if (reduce) pv.style.transition = "none";
            pv.classList.add("show"); pv.style.clipPath = "inset(0px)";
            lockRest(true);
        }
        function closeProject() {
            var pv = viewing; if (!pv) return;
            viewing = null; pv.classList.remove("show");
            pv.style.clipPath = rowInset(pv.id);
            lockRest(false);
            closeT = setTimeout(function () { pv.hidden = true; pv.style.transition = ""; fireSlab.classList.remove("viewing"); fireBiome.style.minHeight = ""; layout(); }, reduce ? 0 : 520);
        }
        $$("[data-open]").forEach(function (b) { b.addEventListener("click", function () { openProject(b.getAttribute("data-open")); }); });
        $$("[data-back]").forEach(function (b) { b.addEventListener("click", closeProject); });
        doc.addEventListener("keydown", function (e) { if (e.key === "Escape") closeProject(); });

        /* ---------- pixel page transition ---------- */
        function pixelCanvas() {
            var cv = doc.createElement("canvas"); cv.width = window.innerWidth; cv.height = window.innerHeight;
            cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:3000;pointer-events:none";
            doc.body.appendChild(cv);
            var C = 20, cols = Math.ceil(cv.width / C), rows = Math.ceil(cv.height / C), cells = [], i, k, x;
            for (i = 0; i < cols * rows; i++) cells.push(i);
            for (i = cells.length - 1; i > 0; i--) { k = Math.floor(Math.random() * (i + 1)); x = cells[i]; cells[i] = cells[k]; cells[k] = x; }
            return { cv: cv, ctx: cv.getContext("2d"), cells: cells, cols: cols, C: C };
        }
        var SPIRIT = ["#2de2c8", "#9a7bff", "#ff6bd6", "#08070c", "#08070c", "#1b1a26"];
        function pixelRun(p, ms, paint, done) {
            var t0 = performance.now(), drawn = 0, n = p.cells.length;
            (function step(now) {
                var target = Math.floor(Math.min((now - t0) / ms, 1) * n), c, cx, cy;
                while (drawn < target) { c = p.cells[drawn++]; cx = (c % p.cols) * p.C; cy = Math.floor(c / p.cols) * p.C; paint(p.ctx, cx, cy, p.C); }
                if (drawn < n) requestAnimationFrame(step); else done();
            })(t0);
        }
        function pixelNavigate(url) {
            if (reduce) { location.href = url; return; }
            var p = pixelCanvas();
            pixelRun(p, 900, function (ctx, x, y, C) { ctx.fillStyle = SPIRIT[Math.floor(Math.random() * SPIRIT.length)]; ctx.fillRect(x, y, C, C); }, function () { location.href = url; });
        }
        function pixelIn() {
            if (reduce) return;
            var p = pixelCanvas(); p.ctx.fillStyle = "#08070c"; p.ctx.fillRect(0, 0, p.cv.width, p.cv.height);
            pixelRun(p, 900, function (ctx, x, y, C) { ctx.clearRect(x, y, C, C); }, function () { p.cv.remove(); });
        }
        var portal = doc.getElementById("past-work");
        if (portal) portal.addEventListener("click", function (e) { e.preventDefault(); pixelNavigate(portal.getAttribute("href")); });
        window.addEventListener("pageshow", function (e) { if (e.persisted) $$("canvas[style*='z-index:3000']").forEach(function (c) { c.remove(); }); });
        function startReveal() {
            if ("IntersectionObserver" in window) {
                var io = new IntersectionObserver(function (es) {
                    es.forEach(function (e) {
                        if (!e.isIntersecting) return;
                        e.target.classList.add("in"); io.unobserve(e.target);
                    });
                }, { threshold: .12, rootMargin: "0px 0px -6% 0px" });
                $$(".rv").forEach(function (el) { io.observe(el); });
            } else { $$(".rv").forEach(function (el) { el.classList.add("in"); }); }
        }
        function openPortfolio() {
            if (isOpen) return; isOpen = true;
            root.classList.add("portfolio-open");
            window.scrollTo(0, 0);
            layout(); onScroll(); startReveal();
            if (WEATHER && !reduce) requestAnimationFrame(frame);
        }
        window.openPortfolio = openPortfolio;

        var INTRO_LINES = [
            "For centuries, people believed that everything in the world was made from four elements: Fire, Water, Earth, and Air.",
            "These elements helped people make sense of the world around them.",
            "Today, we continue to use these elements to understand nature, inspire new ideas, and explore the world around us.",
            "Inspired by the four elements, this portfolio brings together my work, skills and future."
        ];
        var TYPE_MS = 55;        
        var HOLD_BASE_MS = 1600; 
        var GAP_MS = 700;       
        function pause(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
        var typePool = [], typePoolI = 0;
        function typeClick() {
            var a;
            if (!typePool.length) {
                for (var k = 0; k < 6; k++) { a = typeSound.cloneNode(); a.volume = typeSound.volume; typePool.push(a); }
            }
            a = typePool[typePoolI++ % typePool.length]; a.currentTime = 0; a.play().catch(function () {});
        }
        function typeLoop(on) {
            if (on) { typeSound.loop = true; typeSound.currentTime = 0; typeSound.play().catch(function () {}); }
            else { typeSound.loop = false; typeSound.pause(); typeSound.currentTime = 0; }
        }
        async function typeLine(el, text) {
            var on, off, i, loop = isFinite(typeSound.duration) && typeSound.duration > 1.2;
            el.innerHTML = '<span class="t-on"></span><i class="caret"></i><span class="t-off"></span>';
            on = el.firstChild; off = el.lastChild;
            if (loop) typeLoop(true);
            for (i = 0; i < text.length; i++) {
                if (stopped) { typeLoop(false); return false; }
                on.textContent = text.slice(0, i + 1);
                off.textContent = text.slice(i + 1);
                if (!loop && text.charAt(i) !== " ") typeClick();
                await pause(TYPE_MS);
            }
            typeLoop(false);
            return true;
        }
        async function playIntroText() {
            var el = doc.getElementById("intro-text"), i, ok;
            if (!el) return;
            el.classList.add("on");
            fadeOutSound(eightBitSound, 600);
            for (i = 0; i < INTRO_LINES.length; i++) {
                if (stopped) break;
                ok = await typeLine(el, INTRO_LINES[i]);
                if (!ok) break;
                await pause(HOLD_BASE_MS + INTRO_LINES[i].length * 20);   
                if (stopped) break;
                el.innerHTML = "";                                          
                await pause(GAP_MS);
            }
            el.classList.remove("on"); el.innerHTML = "";
        }
        function fade(s, ms) { fadeOutSound(s, ms || 350); }
        function wrap(name, before) {
            var orig = window[name]; if (typeof orig !== "function") return;
            window[name] = function () { before.apply(null, arguments); return orig.apply(this, arguments); };
        }
        wrap("showKatara", function (f) {
            if (f === "07") fade(landSound);
            else if (f === "08") fade(splashSound);
            else if (f === "09") { fade(iceSound); fade(splashSound); }
            else if (f === "11") fade(landSound);
        });
        wrap("launchIce", function () { fade(landSound, 200); });
        wrap("pixelCover", function () {
            [fireSound, fireWaveSound, footstepSound, stompSound, jumpSound, landSound, iceSound, splashSound, splash2Sound].forEach(function (s) { fade(s, 500); });
        });


        if (typeof window.finishIntro === "function" && typeof window.pixelReveal === "function") {
            window.finishIntro = async function () {
                var cover = doc.getElementById("decay");
                clearInterval(flameTimer);
                function done() { stopped = true; intro.style.display = "none"; }
                if (cover) await playIntroText();
                if (stopped) return;                 
                openPortfolio();
                if (!cover) { done(); return; }
                intro.classList.add("revealing");
                pixelReveal(cover).then(done, done);
            };
        }
        var skipBtn = doc.getElementById("skip");
        if (skipBtn) skipBtn.addEventListener("click", openPortfolio);
        if (location.hash === "#past-work" && skipBtn) {
            var gate = doc.getElementById("sound-gate"); if (gate) gate.style.display = "none";
            intro.classList.remove("pre-start");
            skipBtn.click();
            if (portal) portal.scrollIntoView({ block: "center" });
            pixelIn();
        }
    })();
    const replayBtn = document.getElementById("replay");
if (replayBtn) replayBtn.addEventListener("click", () => {
    try { sessionStorage.setItem("replayIntro", "1"); } catch (e) {}
    location.assign(location.pathname + location.search);
});


try {
    if (sessionStorage.getItem("replayIntro")) {
        sessionStorage.removeItem("replayIntro");
        closeSoundGate();
    }
} catch (e) {}
