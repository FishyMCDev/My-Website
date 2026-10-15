/* Spirit world */
(function () {
    "use strict";
    var doc = document, root = doc.documentElement;
    var reduce = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    function $$(s) { return Array.prototype.slice.call(doc.querySelectorAll(s)); }
    var cv = doc.getElementById("fx"), ctx = cv.getContext("2d"), S = 4, W = 0, H = 0, sp = [], COLS = ["#e8e2f7", "#e8e2f7", "#e8e2f7", "#e8e2f7", "#b9a2f2", "#8a63e8"];
    function size() {
        W = Math.ceil(window.innerWidth / S); H = Math.ceil(window.innerHeight / S); cv.width = W; cv.height = H;
        var n = Math.round(W * H / 520), i; sp = [];
        for (i = 0; i < n; i++) sp.push({ x: Math.random() * W, y: Math.random() * H, v: .1 + Math.random() * .5, c: COLS[Math.floor(Math.random() * COLS.length)], p: Math.random() * 6.28, s: Math.random() < .2 ? 2 : 1, w: Math.random() * 2 - 1 });
    }
    var lastY = window.pageYOffset, boost = 0, t = 0, last = 0;
    function draw(ts) {
        var dt = Math.min(.05, (ts - last) / 1000 || .016), i, p, a; last = ts; t += dt;
        boost *= .92;
        ctx.clearRect(0, 0, W, H);
        for (i = 0; i < sp.length; i++) {
            p = sp[i];
            p.y -= (p.v + boost) * 30 * dt; p.x += Math.sin(t * .8 + p.p) * .12 + p.w * .03;
            if (p.y < -2) { p.y = H + 2; p.x = Math.random() * W; }
            if (p.x < -2) p.x = W + 1; if (p.x > W + 2) p.x = -1;
            a = .25 + .6 * (.5 + .5 * Math.sin(t * 2 + p.p));
            ctx.globalAlpha = a; ctx.fillStyle = p.c; ctx.fillRect(p.x | 0, p.y | 0, p.s, p.s);
            if (p.s === 2) { ctx.globalAlpha = a * .35; ctx.fillRect((p.x | 0) - 1, p.y | 0, 1, 2); ctx.fillRect((p.x | 0) + 2, p.y | 0, 1, 2); ctx.fillRect(p.x | 0, (p.y | 0) - 1, 2, 1); ctx.fillRect(p.x | 0, (p.y | 0) + 2, 2, 1); }
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }
    size(); window.addEventListener("resize", size);
    if (reduce) { draw(16); } else { requestAnimationFrame(draw); }

    /* timeline */
    var tl = doc.getElementById("timeline"), eras = $$(".era");
    function onScroll() {
        var y = window.pageYOffset, r = tl.getBoundingClientRect(), vh = window.innerHeight, prog, mid = vh * .55;
        boost = Math.min(2.5, boost + Math.abs(y - lastY) * .01); lastY = y;
        prog = Math.max(0, Math.min(1, (mid - r.top) / r.height));
        tl.style.setProperty("--prog", prog.toFixed(4));
        eras.forEach(function (e) { e.classList.toggle("lit", e.getBoundingClientRect().top + e.offsetHeight / 2 < mid + 40); });
    }
    window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll); onScroll();
    if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("open"); io.unobserve(e.target); } }); }, { threshold: .3 });
        eras.forEach(function (el) { io.observe(el); });
        var io2 = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io2.unobserve(e.target); } }); }, { threshold: .15 });
        $$(".end").forEach(function (el) { io2.observe(el); });
    } else { eras.forEach(function (el) { el.classList.add("open"); }); $$(".end").forEach(function (el) { el.classList.add("in"); }); }
    var PAL = ["#08070c", "#08070c", "#08070c", "#1b1a26", "#8a63e8", "#6a45c9"];
    function pixelCanvas() {
        var c = doc.createElement("canvas"); c.width = window.innerWidth; c.height = window.innerHeight;
        c.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:3000;pointer-events:none";
        doc.body.appendChild(c);
        var C = 20, cols = Math.ceil(c.width / C), rows = Math.ceil(c.height / C), cells = [], i, k, x;
        for (i = 0; i < cols * rows; i++) cells.push(i);
        for (i = cells.length - 1; i > 0; i--) { k = Math.floor(Math.random() * (i + 1)); x = cells[i]; cells[i] = cells[k]; cells[k] = x; }
        return { cv: c, ctx: c.getContext("2d"), cells: cells, cols: cols, C: C };
    }
    function run(p, ms, paint, done) {
        var t0 = performance.now(), drawn = 0, n = p.cells.length;
        (function step(now) {
            var target = Math.floor(Math.min((now - t0) / ms, 1) * n), c;
            while (drawn < target) { c = p.cells[drawn++]; paint(p.ctx, (c % p.cols) * p.C, Math.floor(c / p.cols) * p.C, p.C); }
            if (drawn < n) requestAnimationFrame(step); else done();
        })(t0);
    }
    if (!reduce) {
        var pin = pixelCanvas(); pin.ctx.fillStyle = "#08070c"; pin.ctx.fillRect(0, 0, pin.cv.width, pin.cv.height);
        run(pin, 900, function (c, x, y, C) { c.clearRect(x, y, C, C); }, function () { pin.cv.remove(); });
    }
    function leave(e) {
        var href = this.getAttribute("href");
        e.preventDefault();
        if (reduce) { location.href = href; return; }
        var p = pixelCanvas();
        run(p, 900, function (c, x, y, C) { c.fillStyle = PAL[Math.floor(Math.random() * PAL.length)]; c.fillRect(x, y, C, C); }, function () { location.href = href; });
    }
    $$("#return, #return2").forEach(function (a) { a.addEventListener("click", leave); });
    window.addEventListener("pageshow", function (e) { if (e.persisted) $$("canvas[style*='z-index:3000']").forEach(function (c) { c.remove(); }); });
})();