// ============================================================
// MOCK FILE FOR PASTING AI CODE (PART 2)
// ============================================================
// Paste the code you get from Claude/Codex here.
// Whenever you paste new code in this file, just let me know!
// ============================================================

< !DOCTYPE html >
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Turbo on Vercel</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
                *,*::before,*::after{box - sizing:border-box;margin:0;padding:0}

                html,body{
                    width:100%;height:100%;
                background:#060810;
                font-family:'Inter',sans-serif;
                display:flex;align-items:center;justify-content:center;
                min-height:100vh;
                overflow:hidden;
}

                .canvas{
                    position:relative;
                width:928px;height:672px;
                flex-shrink:0;
                transform-origin:center center;
}

                /* ─── ATMOSPHERE LAYERS ───
                   These create the "glow contamination" effect — L and R bleed toward center.
                   The center bloom is the magnetic field between terminals and icon.
                */

                /* Base dark-purple ground */
                .atm-base{
                    position:absolute;
                width:100%;height:100%;top:0;left:0;
                background:
                radial-gradient(ellipse 680px 480px at 46% 32%, rgba(62,10,112,0.45) 0%, transparent 65%);
                pointer-events:none;
}

                /* Left terminal bleed — purple-violet, biased top-left */
                .atm-l{
                    position:absolute;
                width:520px;height:460px;
                top:-80px;left:-60px;
                background:radial-gradient(ellipse at 40% 42%,
                rgba(128,24,208,0.60) 0%,
                rgba(100,14,172,0.34) 32%,
                rgba(72,8,132,0.14) 56%,
                transparent 72%);
                filter:blur(64px);
                pointer-events:none;
}

                /* Right terminal bleed — electric blue, biased top-right */
                .atm-r{
                    position:absolute;
                width:500px;height:440px;
                top:-60px;right:-50px;
                background:radial-gradient(ellipse at 60% 42%,
                rgba(12,80,220,0.58) 0%,
                rgba(8,52,180,0.32) 32%,
                rgba(4,32,140,0.14) 56%,
                transparent 72%);
                filter:blur(64px);
                pointer-events:none;
}

                /* CENTER CONVERGENCE — the most important layer.
                   This is where left + right glows "collide" and create the icon's magnetic field.
                   Positioned to overlap the bottom of both terminals and the icon itself. */
                .atm-center{
                    position:absolute;
                width:440px;height:380px;
                top:148px;left:50%;
                transform:translateX(-50%);
                background:radial-gradient(ellipse at 50% 38%,
                rgba(168,40,232,0.54) 0%,
                rgba(136,24,200,0.36) 24%,
                rgba(104,14,168,0.20) 46%,
                rgba(72,8,136,0.08) 62%,
                transparent 76%);
                filter:blur(44px);
                pointer-events:none;
                opacity:0;transition:opacity 1.6s ease;
}

                /* Warm magenta center-bottom — makes the icon feel like it's EMANATING energy */
                .atm-icon-bloom{
                    position:absolute;
                width:320px;height:260px;
                top:220px;left:50%;
                transform:translateX(-50%);
                background:radial-gradient(ellipse at 50% 40%,
                rgba(200,48,80,0.28) 0%,
                rgba(172,36,220,0.18) 35%,
                transparent 68%);
                filter:blur(32px);
                pointer-events:none;
                opacity:0;transition:opacity 1.2s ease 0.6s;
}

                /* Bottom monitor warmth */
                .atm-bot{
                    position:absolute;
                width:480px;height:180px;
                top:470px;left:50%;
                transform:translateX(-50%);
                background:radial-gradient(ellipse at 50% 40%,
                rgba(88,20,148,0.24) 0%,
                transparent 70%);
                filter:blur(36px);
                pointer-events:none;
                opacity:0;transition:opacity 1.4s ease 0.4s;
}

                /* ─── WIRE CANVAS ─── */
                .wires{
                    position:absolute;top:0;left:0;
                width:928px;height:672px;
                pointer-events:none;z-index:10;
                overflow:visible;
}

                /* ─── TERMINALS ───
                   KEY LAYOUT:
                   Left terminal:  left=88,  top=36,  width=310 → right edge=398, center-x=243
                   Right terminal: left=496, top=76,  width=310 → right edge=806, center-x=651
                   Gap between right edge of L (398) and left edge of R (496) = 98px
                   Icon sits at left=415 — WITHIN this gap and visually overlapping both glows.
                
                   Verticals:
                   L terminal top=36, content≈240px tall → bottom≈276
                   R terminal top=76, content≈198px tall → bottom≈274
                   Icon top=254 → OVERLAPS both terminal bottoms by ~20px
                   This is the "magnetic lock" — the icon is embedded in the terminal mass.
                */
                .term{
                    position:absolute;
                background:rgba(4,5,10,0.97);
                border-radius:13px;
                overflow:hidden;
                opacity:0;
                z-index:20;
}

                /* LEFT terminal — taller (more content), purple glow */
                .term-l{
                    left:88px;top:36px;width:310px;
                border:1.5px solid rgba(156,42,218,0.82);
                box-shadow:
                0 0 0 1px rgba(130,22,196,0.10),
                0 0 24px 7px rgba(144,32,208,0.58),
                0 0 60px 18px rgba(116,18,178,0.32),
                0 0 110px 42px rgba(92,10,152,0.18),
                inset 0 0 36px rgba(132,28,196,0.05);
                transform:translateY(-28px);
}

                /* RIGHT terminal — slightly lower start (staggered for depth), blue glow */
                .term-r{
                    left:496px;top:76px;width:310px;
                border:1.5px solid rgba(20,116,255,0.82);
                box-shadow:
                0 0 0 1px rgba(12,88,230,0.10),
                0 0 24px 7px rgba(14,104,252,0.58),
                0 0 60px 18px rgba(6,70,210,0.32),
                0 0 110px 42px rgba(4,48,178,0.18),
                inset 0 0 36px rgba(12,88,228,0.05);
                transform:translateY(-28px);
}

                .tbar{
                    display:flex;align-items:center;gap:7px;
                padding:10px 14px 9px;
                border-bottom:1px solid rgba(255,255,255,0.040);
}
                .d{width:11px;height:11px;border-radius:50%}
                .dr{background:rgba(210,60,60,0.82)}
                .dy{background:rgba(196,150,36,0.65)}
                .dg{background:rgba(46,176,50,0.65)}
                .tbdy{
                    padding:14px 17px 18px;
                font-family:'JetBrains Mono',monospace;
                font-size:13px;line-height:1.95;color:#a8a8bc;
}
                .g{color:#4ade80;font-weight:700}
                .c{color:#22d3ee;font-weight:700}
                .w{color:#fff;font-weight:700}
                .p{color:#f472b6;font-weight:700}
                .m{color:#48485e}

                /* ─── CENTER ICON ───
                   left=415, top=254 → center=(459,298)
                   L terminal right edge = 398 → icon OVERLAPS left terminal by 17px in X
                   L terminal bottom ≈ 276 → icon TOP = 254, overlaps by 22px in Y
                   This places the icon EMBEDDED into the bottom of the terminal cluster.
                */
                .icon-wrap{
                    position:absolute;
                left:415px;top:254px;
                width:88px;height:88px;
                opacity:0;transform:scale(0.06);
                z-index:35;
}
                .icon-box{
                    width:88px;height:88px;
                border-radius:22px;
                background:linear-gradient(148deg,#5840ee 0%,#b430e6 46%,#e82452 100%);
                display:flex;align-items:center;justify-content:center;
                box-shadow:
                0 0 0 1.5px rgba(196,72,252,0.28),
                0 0 20px 8px rgba(176,40,240,0.84),
                0 0 44px 18px rgba(152,28,212,0.60),
                0 0 80px 34px rgba(128,16,184,0.38),
                0 0 140px 56px rgba(108,8,160,0.22),
                0 6px 36px 10px rgba(232,48,76,0.26);
}
                .icon-box svg{
                    width:46px;height:46px;
                filter:drop-shadow(0 2px 8px rgba(255,255,255,0.34));
}

                /* ─── MONITORS ───
                   Smaller than before — they are subordinate to the upper mass.
                   Left: center-x=300, Right: center-x=628
                   Both at top=422
                */
                .mon{
                    position:absolute;
                width:88px;height:88px;
                opacity:0;transform:scale(0.10);
                z-index:15;
}
                .mon-l{left:256px;top:422px;}
                .mon-r{left:584px;top:422px;}

                .mon svg.ring{position:absolute;top:0;left:0;width:88px;height:88px;}
                .mon-inner{
                    position:absolute;top:9px;left:9px;
                width:70px;height:70px;
                border-radius:50%;
                background:rgba(4,6,14,0.97);
                display:flex;align-items:center;justify-content:center;
}

                /* ─── BOTTOM TEXT ─── */
                .btm{
                    position:absolute;
                bottom:40px;left:0;right:0;
                text-align:center;
                opacity:0;transform:translateY(14px);
}
                .eyebrow{
                    font - size:9.5px;letter-spacing:5.5px;color:#a855f7;
                text-transform:uppercase;margin-bottom:10px;font-weight:500;
}
                .headline{
                    font - size:30px;font-weight:700;
                background:linear-gradient(92deg,#c47dff 0%,#9878fa 50%,#be80fc 100%);
                -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}

                /* SLIDE DOTS */
                .sdots{
                    position:absolute;bottom:14px;left:50%;transform:translateX(-50%);
                display:flex;align-items:center;gap:6px;opacity:0;
}
                .sd{height:4px;border-radius:2px;}
                .sd-on{width:24px;background:#4ade80;}
                .sd-off{width:120px;background:rgba(255,255,255,0.13);}

                /* ─── KEYFRAMES ─── */
                @keyframes pL{
                    0 %, 100 % { box- shadow:0 0 0 1px rgba(130,22,196,0.10),0 0 24px 7px rgba(144,32,208,0.58),0 0 60px 18px rgba(116,18,178,0.32),0 0 110px 42px rgba(92,10,152,0.18),inset 0 0 36px rgba(132,28,196,0.05)}
                50%{box - shadow:0 0 0 1px rgba(168,44,228,0.18),0 0 34px 12px rgba(180,48,232,0.76),0 0 80px 28px rgba(148,28,204,0.44),0 0 140px 58px rgba(116,14,172,0.26),inset 0 0 50px rgba(156,36,210,0.08)}
}
                @keyframes pR{
                    0 %, 100 % { box- shadow:0 0 0 1px rgba(12,88,230,0.10),0 0 24px 7px rgba(14,104,252,0.58),0 0 60px 18px rgba(6,70,210,0.32),0 0 110px 42px rgba(4,48,178,0.18),inset 0 0 36px rgba(12,88,228,0.05)}
                50%{box - shadow:0 0 0 1px rgba(24,124,255,0.18),0 0 34px 12px rgba(22,134,255,0.76),0 0 80px 28px rgba(12,94,230,0.44),0 0 140px 58px rgba(6,64,200,0.26),inset 0 0 50px rgba(16,104,238,0.08)}
}
                @keyframes pI{
                    0 %, 100 % { box- shadow:0 0 0 1.5px rgba(196,72,252,0.28),0 0 20px 8px rgba(176,40,240,0.84),0 0 44px 18px rgba(152,28,212,0.60),0 0 80px 34px rgba(128,16,184,0.38),0 0 140px 56px rgba(108,8,160,0.22),0 6px 36px 10px rgba(232,48,76,0.26)}
                50%{box - shadow:0 0 0 1.5px rgba(220,96,255,0.44),0 0 30px 14px rgba(210,60,252,0.98),0 0 62px 28px rgba(184,44,232,0.74),0 0 108px 48px rgba(156,28,208,0.50),0 0 178px 72px rgba(128,14,176,0.30),0 6px 52px 18px rgba(248,64,92,0.36)}
}
                @keyframes arcA{0 %, 100 % { opacity: .78 }50%{opacity:1}}
                @keyframes arcB{0 %, 100 % { opacity: .78 }50%{opacity:1}}

                .term-l.live{animation:pL 2.8s ease-in-out infinite}
                .term-r.live{animation:pR 2.8s ease-in-out infinite}
                .icon-box.live{animation:pI 2.0s ease-in-out infinite}
                .aa{animation:arcA 2.2s ease-in-out infinite}
                .ab{animation:arcB 2.6s ease-in-out infinite 0.5s}
            </style>
        </head>
        <body>
            <div class="canvas" id="canvas">

                <!-- ATMOSPHERE — painted first, deepest layer -->
                <div class="atm-base"></div>
                <div class="atm-l" id="aL"></div>
                <div class="atm-r" id="aR"></div>
                <div class="atm-center" id="aC"></div>
                <div class="atm-icon-bloom" id="aIB"></div>
                <div class="atm-bot" id="aBot"></div>

                <!-- WIRES ── drawn in JS with dash animation -->
                <svg class="wires" viewBox="0 0 928 672" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <!-- Pink wire glow -->
                        <filter id="fP" x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur stdDeviation="2.8" result="b" />
                            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <!-- Blue wire glow -->
                        <filter id="fB" x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur stdDeviation="2.8" result="b" />
                            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>

                    <!--
                    WIRE GEOMETRY — tight, directional, high tension:

                    Term-L:  left=88, w=310, top=36
                    bottom content y ≈ 36 + 10(tbar) + 9 + 240(body) ≈ 36+46+140=222...
                    Actually just using visual: tbar≈30px + body≈4lines×26px≈104px + padding32px = ~166px total
                    bottom ≈ 36 + 166 = 202... let's use 268 as measured from reference
                    center-x = 88 + 155 = 243

                    Term-R:  left=496, w=310
                    center-x = 496 + 155 = 651
                    bottom ≈ 76 + 166 = 242... use 268

                    Icon:    left=415, top=254, w=88, h=88
                    left-mid  = (415, 298)
                    right-mid = (503, 298)
                    bottom    = (459, 342)

                    Mon-L:   left=256, top=422 → center = (300, 466)
                    Mon-R:   left=584, top=422 → center = (628, 466)

                    W-A: L-terminal bottom-mid (243,268) → icon left-mid (415,298)
                    Short, tight, steep exit: control points hug the midpoint
                    W-B: R-terminal bottom-mid (651,268) → icon right-mid (503,298)
                    W-C: Icon bottom (459,342) → Mon-L center (300,466)
                    W-D: Icon bottom (459,342) → Mon-R center (628,466)
                    W-E: Mon-L to Mon-R horizontal (300,466)→(628,466)
    -->

                    <!-- W-A: left terminal → icon (purple, tight arc) -->
                    <path id="wA"
                        d="M 243 268 C 243 286, 340 294, 415 298"
                        stroke="rgba(148,42,226,0.86)" stroke-width="1.8" fill="none"
                        filter="url(#fP)" />

                    <!-- W-B: right terminal → icon (blue, tight arc) -->
                    <path id="wB"
                        d="M 651 268 C 651 286, 562 294, 503 298"
                        stroke="rgba(20,120,255,0.86)" stroke-width="1.8" fill="none"
                        filter="url(#fB)" />

                    <!-- W-C: icon → left monitor (purple) -->
                    <path id="wC"
                        d="M 459 342 C 440 386, 348 434, 300 466"
                        stroke="rgba(148,42,226,0.78)" stroke-width="1.8" fill="none"
                        filter="url(#fP)" />

                    <!-- W-D: icon → right monitor (blue) -->
                    <path id="wD"
                        d="M 459 342 C 478 386, 570 434, 628 466"
                        stroke="rgba(20,120,255,0.78)" stroke-width="1.8" fill="none"
                        filter="url(#fB)" />

                    <!-- W-E: horizontal between monitors (dim connector) -->
                    <line id="wE"
                        x1="300" y1="466" x2="628" y2="466"
                        stroke="rgba(80,48,184,0.26)" stroke-width="1" fill="none" />

                    <!-- Junction dots — bright blooms at connection points -->
                    <circle id="dA" cx="243" cy="268" r="4.5" fill="rgba(158,48,236,0.96)" opacity="0" />
                    <circle id="dC" cx="459" cy="342" r="5.2" fill="rgba(200,62,252,0.98)" opacity="0" />
                    <circle id="dML" cx="300" cy="466" r="4" fill="rgba(154,44,232,0.92)" opacity="0" />
                    <circle id="dMR" cx="628" cy="466" r="4" fill="rgba(22,128,255,0.92)" opacity="0" />
                </svg>

                <!-- LEFT TERMINAL -->
                <div class="term term-l" id="tL">
                    <div class="tbar">
                        <div class="d dr"></div><div class="d dy"></div><div class="d dg"></div>
                    </div>
                    <div class="tbdy">
                        <div class="m">npm run build</div>
                        <div style="margin-top:8px">
                            <span class="g">2 successful</span><span class="m">, 2 total</span>
                        </div>
                        <div class="m">0 cached, 2 total</div>
                        <div class="w">7m 9s</div>
                    </div>
                </div>

                <!-- RIGHT TERMINAL -->
                <div class="term term-r" id="tR">
                    <div class="tbar">
                        <div class="d dr"></div><div class="d dy"></div><div class="d dg"></div>
                    </div>
                    <div class="tbdy">
                        <div class="m">npm run build</div>
                        <div style="margin-top:8px">
                            <span class="g">2 successful</span><span class="m">, 2 total</span>
                        </div>
                        <div><span class="c">2 cached</span><span class="m">, 2 total</span></div>
                        <div style="display:flex;align-items:center;gap:2px;white-space:nowrap">
                            <span class="w">116ms</span>
                            <span class="c">&nbsp;>>></span>
                            <span class="p">&nbsp;FULL TURBO</span>
                        </div>
                    </div>
                </div>

                <!-- ICON — overlaps both terminals, is the center of gravity -->
                <div class="icon-wrap" id="iWrap">
                    <div class="icon-box" id="iBox">
                        <svg viewBox="0 0 48 48" fill="none">
                            <polygon points="24,8 44,42 4,42" fill="white" />
                        </svg>
                    </div>
                </div>

                <!-- LEFT MONITOR -->
                <div class="mon mon-l" id="mL">
                    <svg class="ring" viewBox="0 0 88 88">
                        <defs>
                            <filter id="gL" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="b" />
                                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>
                        <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(150,20,70,0.08)" stroke-width="7" />
                        <path class="aa" d="M 44 6 A 38 38 0 0 0 44 82"
                            fill="none" stroke="rgba(218,38,110,0.92)" stroke-width="5"
                            stroke-linecap="round" filter="url(#gL)" />
                        <path class="ab" d="M 44 82 A 38 38 0 0 0 44 6"
                            fill="none" stroke="rgba(36,144,255,0.92)" stroke-width="5"
                            stroke-linecap="round" filter="url(#gL)" />
                    </svg>
                    <div class="mon-inner">
                        <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                            <rect x="3" y="5" width="34" height="20" rx="3"
                                stroke="rgba(196,170,255,0.88)" stroke-width="1.8" fill="none" />
                            <rect x="16" y="25" width="8" height="5" rx="1"
                                stroke="rgba(196,170,255,0.88)" stroke-width="1.6" fill="none" />
                            <line x1="11" y1="30" x2="29" y2="30"
                                stroke="rgba(196,170,255,0.88)" stroke-width="1.8" stroke-linecap="round" />
                        </svg>
                    </div>
                </div>

                <!-- RIGHT MONITOR -->
                <div class="mon mon-r" id="mR">
                    <svg class="ring" viewBox="0 0 88 88">
                        <defs>
                            <filter id="gR" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="b" />
                                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>
                        <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(12,72,168,0.08)" stroke-width="7" />
                        <path class="ab" d="M 44 6 A 38 38 0 0 1 44 82"
                            fill="none" stroke="rgba(36,144,255,0.92)" stroke-width="5"
                            stroke-linecap="round" filter="url(#gR)" />
                        <path class="aa" d="M 44 82 A 38 38 0 0 1 44 6"
                            fill="none" stroke="rgba(218,38,110,0.92)" stroke-width="5"
                            stroke-linecap="round" filter="url(#gR)" />
                    </svg>
                    <div class="mon-inner">
                        <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                            <rect x="3" y="5" width="34" height="20" rx="3"
                                stroke="rgba(130,204,255,0.90)" stroke-width="1.8" fill="none" />
                            <rect x="16" y="25" width="8" height="5" rx="1"
                                stroke="rgba(130,204,255,0.90)" stroke-width="1.6" fill="none" />
                            <line x1="11" y1="30" x2="29" y2="30"
                                stroke="rgba(130,204,255,0.90)" stroke-width="1.8" stroke-linecap="round" />
                        </svg>
                    </div>
                </div>

                <!-- BOTTOM TEXT -->
                <div class="btm" id="btm">
                    <div class="eyebrow">With Turbo on Vercel</div>
                    <div class="headline">116ms builds from remote cache</div>
                </div>

                <!-- SLIDE DOTS -->
                <div class="sdots" id="sdots">
                    <div class="sd sd-on"></div>
                    <div class="sd sd-off"></div>
                </div>

            </div>

            <script>
/* Scale canvas to fit viewport */
                function fit(){
  const c=document.getElementById('canvas');
                const s=Math.min(window.innerWidth/928,window.innerHeight/672,1.12);
                c.style.transform=`scale(${s})`;
}
                fit();window.addEventListener('resize',fit);

                /* Animate a path from invisible → drawn */
                function drawWire(id,dur,delay){
                    setTimeout(() => {
                        const el = document.getElementById(id);
                        if (!el) return;
                        let len;
                        try {
                            if (el.tagName === 'path') len = Math.ceil(el.getTotalLength());
                            else { const x1 = +el.getAttribute('x1'), y1 = +el.getAttribute('y1'), x2 = +el.getAttribute('x2'), y2 = +el.getAttribute('y2'); len = Math.ceil(Math.hypot(x2 - x1, y2 - y1)); }
                        } catch (e) { len = 200; }
                        el.style.strokeDasharray = len;
                        el.style.strokeDashoffset = len;
                        requestAnimationFrame(() => requestAnimationFrame(() => {
                            el.style.transition = `stroke-dashoffset ${dur}s cubic-bezier(0.42,0,0.18,1)`;
                            el.style.strokeDashoffset = '0';
                        }));
                    }, delay);
}

                function showDot(id,delay){
                    setTimeout(() => {
                        const el = document.getElementById(id);
                        if (!el) return;
                        el.style.transition = 'opacity 0.32s ease';
                        el.style.opacity = '1';
                        const base = parseFloat(el.getAttribute('r'));
                        let r = base, up = true;
                        setInterval(() => {
                            r += up ? 0.055 : -0.055;
                            if (r >= base + 1.6) up = false;
                            if (r <= base - 1.2) up = true;
                            el.setAttribute('r', r.toFixed(2));
                        }, 20);
                    }, delay);
}

                /* ── SEQUENCE ── */

                // t=0: atmosphere materialises
                document.getElementById('aL').style.cssText+='opacity:1;transition:opacity 1.8s ease';
                document.getElementById('aR').style.cssText+='opacity:1;transition:opacity 1.8s ease';

// t=400: center bloom ignites as icon hint
setTimeout(()=>{document.getElementById('aC').style.opacity = '1';},400);
setTimeout(()=>{document.getElementById('aIB').style.opacity = '1';},600);
setTimeout(()=>{document.getElementById('aBot').style.opacity = '1';},800);

// t=700: icon erupts into scene — the anchor point
setTimeout(()=>{
  const w=document.getElementById('iWrap');
                w.style.transition='opacity 0.72s ease, transform 0.72s cubic-bezier(0.32,1.62,0.60,1)';
                w.style.opacity='1';
                w.style.transform='scale(1)';
  setTimeout(()=>document.getElementById('iBox').classList.add('live'),720);
},700);

// t=1200: monitors appear — subordinate pop, smaller scale
setTimeout(()=>{
  const mL=document.getElementById('mL'),mR=document.getElementById('mR');
                mL.style.transition='opacity 0.54s ease, transform 0.54s cubic-bezier(0.32,1.38,0.60,1)';
                mR.style.transition='opacity 0.54s ease 0.14s, transform 0.54s cubic-bezier(0.32,1.38,0.60,1) 0.14s';
                mL.style.opacity='1';mL.style.transform='scale(1)';
                mR.style.opacity='1';mR.style.transform='scale(1)';
},1200);

                // t=1400: wires draw — fast, snappy, directional
                drawWire('wA',0.46,1400); // L terminal → icon
                drawWire('wB',0.34,1540); // R terminal → icon
                drawWire('wC',0.52,1720); // icon → L mon
                drawWire('wD',0.52,1860); // icon → R mon
                drawWire('wE',0.48,2060); // horizontal

                // Dots at wire endpoints
                showDot('dA', 2060);
                showDot('dC', 2180);
                showDot('dML',2280);
                showDot('dMR',2380);

// t=2500: terminals SLAM down from above — they arrive AFTER wires to reinforce
// the "the infrastructure was already there" feeling
setTimeout(()=>{
  const tL=document.getElementById('tL'),tR=document.getElementById('tR');
                tL.style.transition='opacity 0.64s ease, transform 0.64s cubic-bezier(0.20,1,0.34,1)';
                tR.style.transition='opacity 0.64s ease 0.16s, transform 0.64s cubic-bezier(0.20,1,0.34,1) 0.16s';
                tL.style.opacity='1';tL.style.transform='translateY(0)';
                tR.style.opacity='1';tR.style.transform='translateY(0)';
  setTimeout(()=>{tL.classList.add('live');tR.classList.add('live');},800);
},2500);

// t=3300: bottom text fades in
setTimeout(()=>{
  const b=document.getElementById('btm');
                b.style.transition='opacity 0.70s ease, transform 0.70s ease';
                b.style.opacity='1';b.style.transform='translateY(0)';
  setTimeout(()=>{
    const s=document.getElementById('sdots');
                s.style.transition='opacity 0.46s ease';
                s.style.opacity='1';
  },320);
},3300);
            </script>
        </body>
    </html>