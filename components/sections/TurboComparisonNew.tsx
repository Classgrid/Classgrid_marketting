"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// PART 1: LEFT COLUMN — Monitor nodes + Terminal boxes (from mock_code.tsx)
// ─────────────────────────────────────────────────────────────────────────────

// ── Monitor SVG ──────────────────────────────────────────────
function MonitorIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="26" height="17" rx="2.5" stroke="white" strokeWidth="1.6" fill="none" />
            <line x1="16" y1="21" x2="16" y2="25" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="9" y1="25" x2="23" y2="25" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

// ── Animation variants ────────────────────────────────────────
const monitorVariants = {
    cardHidden: { opacity: 0, y: -20, scale: 0.6 },
    cardVisible: (delay: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    }),
};

const vlineVariants = {
    cardHidden: { scaleY: 0, opacity: 0 },
    cardVisible: (delay: number) => ({
        scaleY: 1,
        opacity: 1,
        transition: { delay, duration: 1.2, ease: [0.22, 1, 0.36, 1] },
    }),
};

const terminalVariants = {
    cardHidden: { opacity: 0, y: 20 },
    cardVisible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    }),
};

const lineVariants = {
    cardHidden: { opacity: 0, x: -10 },
    cardVisible: (delay: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay, duration: 0.6, ease: "easeOut" },
    }),
};

const bottomVariants = {
    cardHidden: { opacity: 0, y: 20 },
    cardVisible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay, duration: 0.8, ease: "easeOut" },
    }),
};

// ── Per-card stagger offsets (seconds) ───────────────────────
// Sequence: Node appears -> Line slowly draws -> Terminal fades in -> Text types out.
// Card 2 starts shortly after Card 1's terminal box appears.
function cardDelays(cardIndex: number) {
    const base = cardIndex * 2.5; // Card 2 starts 2.5s after Card 1
    return {
        monitor: base + 0.0,       // Monitor appears first
        vline: base + 0.8,         // Line draws after monitor settles
        terminal: base + 2.0,      // Terminal fades in after line finishes drawing
        line0: base + 2.8,         // "excel..."
        line1: base + 3.4,         // "Verifying..."
        line2: base + 4.0,         // "Building..."
        line3: base + 4.6,         // "Creating..."
    };
}

// ── Single terminal card ──────────────────────────────────────
function TerminalCard({ cardIndex, lines }: { cardIndex: number; lines: string[] }) {
    const d = cardDelays(cardIndex);

    return (
        <div className="flex flex-col items-center">
            {/* Monitor orb — plain grey orb */}
            <motion.div
                custom={d.monitor}
                variants={monitorVariants}
                initial="cardHidden"
                whileInView="cardVisible"
                viewport={{ once: true, amount: 0.3 }}
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
                style={{
                    background: "radial-gradient(circle at 45% 38%, #404040 0%, #1c1c1c 55%, #111 100%)",
                    boxShadow: "0 0 0 1.5px rgba(255,255,255,0.22), 0 0 18px 6px rgba(255,255,255,0.13), 0 0 40px 10px rgba(255,255,255,0.07)",
                }}
            >
                <MonitorIcon />
            </motion.div>

            {/* Vertical connector line */}
            <motion.div
                custom={d.vline}
                variants={vlineVariants}
                initial="cardHidden"
                whileInView="cardVisible"
                viewport={{ once: true, amount: 0.3 }}
                className="w-px h-[46px] bg-white/30 origin-top"
            />

            {/* Terminal window */}
            <motion.div
                custom={d.terminal}
                variants={terminalVariants}
                initial="cardHidden"
                whileInView="cardVisible"
                viewport={{ once: true, amount: 0.3 }}
                className="w-full sm:w-[220px] rounded-[14px] bg-[#0d0d0d] border border-white/10 relative overflow-visible"
            >
                {/* Title bar */}
                <div className="flex flex-row items-center px-4 pt-[14px] relative">
                    {/* Centre pip (connector dot) */}
                    <div
                        className="w-[9px] h-[9px] rounded-full bg-white border-[1.5px] border-black absolute -top-[5px] left-1/2 -translate-x-1/2"
                        style={{ boxShadow: "0 0 5px 1px rgba(255,255,255,0.25)" }}
                    />
                    {/* Left dim dot */}
                    <div className="w-[13px] h-[13px] rounded-full bg-[#2a2a2a] border border-white/[0.06] shrink-0" />
                </div>

                {/* Terminal content */}
                <div className="px-[22px] pt-[22px] pb-9 font-mono">
                    {/* line 0 */}
                    <motion.p
                        custom={d.line0}
                        variants={lineVariants}
                        initial="cardHidden"
                        whileInView="cardVisible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-[14px] sm:text-[15px] text-white/75 tracking-[0.01em] leading-none mb-[16px] sm:mb-[18px]"
                    >
                        {lines[0]}
                    </motion.p>

                    {/* line 1 */}
                    <motion.p
                        custom={d.line1}
                        variants={lineVariants}
                        initial="cardHidden"
                        whileInView="cardVisible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-[14px] sm:text-[15px] text-white/75 tracking-[0.01em] leading-none mb-[16px] sm:mb-[18px]"
                    >
                        {lines[1]}
                    </motion.p>

                    {/* line 2 */}
                    <motion.p
                        custom={d.line2}
                        variants={lineVariants}
                        initial="cardHidden"
                        whileInView="cardVisible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-[14px] sm:text-[15px] text-white/75 tracking-[0.01em] leading-none mb-[16px] sm:mb-[18px]"
                    >
                        {lines[2]}
                    </motion.p>
                    
                    {/* line 3 */}
                    <motion.p
                        custom={d.line3}
                        variants={lineVariants}
                        initial="cardHidden"
                        whileInView="cardVisible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-[14px] sm:text-[15px] text-white/75 tracking-[0.01em] leading-none mt-0.5"
                    >
                        {lines[3]}
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PART 2: RIGHT COLUMN — With ClassGrid OS
// Layout mirrors the HTML reference (928×672 canvas → % positions)
// ─────────────────────────────────────────────────────────────────────────────

// CSS keyframes for infinite pulse/arc animations (injected once)
// Exact brand colors from globals.css: --primary #34d399 = rgb(52,211,153) | --destructive #f43f5e = rgb(244,63,94)
const RC_CSS = `
.rc-pl {
    box-shadow: 0 0 0 1px rgba(52,211,153,.20), 0 0 20px 5px rgba(52,211,153,.45), 0 0 45px 12px rgba(52,211,153,.22), 0 0 90px 30px rgba(52,211,153,.10);
}
.rc-pr {
    box-shadow: 0 0 0 1px rgba(236,72,153,.20), 0 0 20px 5px rgba(236,72,153,.45), 0 0 45px 12px rgba(236,72,153,.22), 0 0 90px 30px rgba(236,72,153,.10);
}
.rc-pi {
    box-shadow: 0 0 0 1.5px rgba(236,72,153,.40), 0 0 24px 10px rgba(52,211,153,.80), 0 0 50px 18px rgba(236,72,153,.60), 0 0 80px 30px rgba(52,211,153,.35), 0 0 130px 50px rgba(236,72,153,.20), 0 6px 36px 10px rgba(236,72,153,.35);
}
@keyframes rcAA{0%,100%{opacity:.78}50%{opacity:1}}
@keyframes rcAB{0%,100%{opacity:.78}50%{opacity:1}}
.rc-aa{animation:rcAA 2.2s ease-in-out infinite}
.rc-ab{animation:rcAB 2.6s ease-in-out infinite .5s}
`;

// Inject CSS at module level so hot-reload always gets the latest colors
if (typeof window !== "undefined") {
    let _s = document.getElementById("rc-styles") as HTMLStyleElement | null;
    if (!_s) { _s = document.createElement("style"); _s.id = "rc-styles"; document.head.appendChild(_s); }
    _s.textContent = RC_CSS;
}

// Variant helpers — same cardHidden/cardVisible pattern as left column
const rcAtmV = {
    cardHidden: { opacity: 0 },
    cardVisible: (d: number) => ({ opacity: 1, transition: { delay: d, duration: 2.0, ease: "easeOut" } }),
};
const rcIconV = {
    cardHidden: { opacity: 0, scale: 0.06 },
    cardVisible: (d: number) => ({ opacity: 1, scale: 1, transition: { delay: d, duration: 1.0, type: "spring" as const, stiffness: 180, damping: 16 } }),
};
const rcMonV = {
    cardHidden: { opacity: 0, scale: 0.1 },
    cardVisible: (d: number) => ({ opacity: 1, scale: 1, transition: { delay: d, duration: 0.8, type: "spring" as const, stiffness: 220, damping: 20 } }),
};
const rcTermV = {
    cardHidden: { opacity: 0, y: -40, scale: 0.96 },
    cardVisible: (d: number) => ({ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { delay: d, duration: 1.4, type: "spring", stiffness: 100, damping: 24 } 
    }),
};
const rcBtmV = {
    cardHidden: { opacity: 0, y: 14 },
    cardVisible: (d: number) => ({ opacity: 1, y: 0, transition: { delay: d, duration: 0.80, ease: "easeOut" } }),
};
const rcWireV = {
    cardHidden: { pathLength: 0, opacity: 0 },
    cardVisible: (d: number) => ({ pathLength: 1, opacity: 1, transition: { delay: d, duration: 0.9, ease: [0.42, 0, 0.18, 1] } }),
};
const rcDotV = {
    cardHidden: { opacity: 0 },
    cardVisible: (d: number) => ({ opacity: 1, transition: { delay: d, duration: 0.6 } }),
};

// Absolute-position helper (converts 928×672 canvas px → %)
const px = (x: number) => `${(x / 928) * 100}%`;
const py = (y: number) => `${(y / 672) * 100}%`;

function RightColumn({ rightTermCmd, rightTermLine1, rightTermLine2, rightTermLine3, rightLabel, rightTime }: {
    rightTermCmd: string; rightTermLine1: string; rightTermLine2: string; rightTermLine3: string;
    rightLabel?: string; rightTime?: string;
}) {
    useEffect(() => {
        // CSS already injected at module level — nothing to do here
    }, []);

    // Spread delays to match left column total pacing (~7s)
    const D = {
        atmL: 0.0, atmR: 0.0, atmC: 0.3, atmIB: 0.5, atmBot: 0.7,
        icon: 1.5,
        monL: 2.5, monR: 2.5,
        wA: 3.0, wB: 3.0, wC: 3.6, wD: 3.6, wE: 4.2,
        dA: 3.8, dC: 4.0, dML: 4.4, dMR: 4.4,
        termL: 4.8, termR: 5.2,
        btm: 6.5,
    };

    const vp = { once: true, amount: 0.2 as const };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Fixed-aspect canvas — taller on mobile so terminals fit */}
            <div className="relative w-full aspect-[928/900] sm:aspect-[928/672]">

                {/* ── ATMOSPHERE LAYERS — emerald + pink glow ── */}
                <motion.div custom={D.atmL} variants={rcAtmV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                    style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 73% 71% at 46% 32%, rgba(52,211,153,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />
                <motion.div custom={D.atmL} variants={rcAtmV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                    style={{ position: "absolute", width: "56%", height: "68%", top: "-12%", left: "-6%", background: "radial-gradient(ellipse at 40% 42%, rgba(52,211,153,0.35) 0%, rgba(20,200,150,0.18) 32%, rgba(10,160,110,0.08) 56%, transparent 72%)", filter: "blur(50px)", pointerEvents: "none" }} />
                <motion.div custom={D.atmR} variants={rcAtmV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                    style={{ position: "absolute", width: "54%", height: "65%", top: "-9%", right: "-5%", background: "radial-gradient(ellipse at 60% 42%, rgba(236,72,153,0.35) 0%, rgba(220,40,80,0.18) 32%, rgba(180,20,50,0.08) 56%, transparent 72%)", filter: "blur(50px)", pointerEvents: "none" }} />
                <motion.div custom={D.atmC} variants={rcAtmV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                    style={{ position: "absolute", width: "47%", height: "57%", top: "22%", left: "48.2%", transform: "translateX(-50%)", background: "radial-gradient(ellipse at 50% 38%, rgba(52,211,153,0.22) 0%, rgba(236,72,153,0.18) 36%, rgba(52,211,153,0.08) 56%, transparent 76%)", filter: "blur(36px)", pointerEvents: "none" }} />
                <motion.div custom={D.atmIB} variants={rcAtmV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                    style={{ position: "absolute", width: "34%", height: "39%", top: "33%", left: "48.2%", transform: "translateX(-50%)", background: "radial-gradient(ellipse at 50% 40%, rgba(236,72,153,0.22) 0%, rgba(52,211,153,0.14) 35%, transparent 68%)", filter: "blur(28px)", pointerEvents: "none" }} />
                <motion.div custom={D.atmBot} variants={rcAtmV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                    style={{ position: "absolute", width: "52%", height: "27%", top: "70%", left: "48.2%", transform: "translateX(-50%)", background: "radial-gradient(ellipse at 50% 40%, rgba(52,211,153,0.16) 0%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />

                {/* ── SVG WIRES (viewBox matches 928×672 canvas) ── */}
                <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", zIndex: 10 }}
                    viewBox="0 0 928 672">
                    <defs>
                        <filter id="rcFP" x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur stdDeviation="2.8" result="b" />
                            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="rcFB" x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur stdDeviation="2.8" result="b" />
                            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="rcGL" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="b" />
                            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    {/* Wire A: left terminal → icon — emerald */}
                    <motion.path custom={D.wA} variants={rcWireV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                        d="M 243 268 C 243 286, 330 294, 403 298" stroke="rgba(52,211,153,0.90)" strokeWidth="1.8" fill="none" filter="url(#rcFP)" />
                    {/* Wire B: right terminal → icon — pink */}
                    <motion.path custom={D.wB} variants={rcWireV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                        d="M 651 268 C 651 286, 564 294, 491 298" stroke="rgba(236,72,153,0.90)" strokeWidth="1.8" fill="none" filter="url(#rcFB)" />
                    {/* Wire C: icon → left monitor — emerald */}
                    <motion.path custom={D.wC} variants={rcWireV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                        d="M 447 342 C 430 386, 348 434, 300 466" stroke="rgba(52,211,153,0.80)" strokeWidth="1.8" fill="none" filter="url(#rcFP)" />
                    {/* Wire D: icon → right monitor — pink */}
                    <motion.path custom={D.wD} variants={rcWireV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                        d="M 447 342 C 464 386, 570 434, 628 466" stroke="rgba(236,72,153,0.80)" strokeWidth="1.8" fill="none" filter="url(#rcFB)" />
                    {/* Wire E: horizontal between monitors */}
                    <motion.line custom={D.wE} variants={rcWireV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                        x1="300" y1="466" x2="628" y2="466" stroke="rgba(52,211,153,0.22)" strokeWidth="1" />
                    {/* Junction dots */}
                    <motion.circle custom={D.dA} variants={rcDotV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                        cx="243" cy="268" r="4.5" fill="rgba(52,211,153,0.96)" />
                    <motion.circle custom={D.dC} variants={rcDotV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                        cx="447" cy="342" r="5.2" fill="rgba(236,72,153,0.98)" />
                    <motion.circle custom={D.dML} variants={rcDotV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                        cx="300" cy="466" r="4" fill="rgba(52,211,153,0.92)" />
                    <motion.circle custom={D.dMR} variants={rcDotV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                        cx="628" cy="466" r="4" fill="rgba(236,72,153,0.92)" />
                </svg>

                {/* ── LEFT TERMINAL — emerald green border ── */}
                <motion.div custom={D.termL} variants={rcTermV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                    className="rc-pl"
                    style={{ position: "absolute", left: px(88), top: py(36), width: px(310), background: "rgba(4,5,10,0.97)", borderRadius: 13, overflow: "hidden", border: "1.5px solid rgba(52,211,153,0.82)", zIndex: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px 9px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(210,60,60,0.82)" }} />
                        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(196,150,36,0.65)" }} />
                        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(46,176,50,0.65)" }} />
                    </div>
                    <div style={{ padding: "14px 17px 18px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.7, color: "#a8a8bc" }}>
                        <div style={{ color: "#48485e" }}>{rightTermCmd}</div>
                        <div style={{ marginTop: 8 }}><span style={{ color: "#4ade80", fontWeight: 700 }}>{rightTermLine1}</span></div>
                        <div style={{ color: "#48485e" }}>{rightTermLine2}</div>
                        <div style={{ color: "#fff", fontWeight: 700 }}>{rightTermLine3}</div>
                    </div>
                </motion.div>

                {/* ── RIGHT TERMINAL — pink border ── */}
                <motion.div custom={D.termR} variants={rcTermV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                    className="rc-pr"
                    style={{ position: "absolute", left: px(496), top: py(76), width: px(310), background: "rgba(4,5,10,0.97)", borderRadius: 13, overflow: "hidden", border: "1.5px solid rgba(236,72,153,0.82)", zIndex: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px 9px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(210,60,60,0.82)" }} />
                        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(196,150,36,0.65)" }} />
                        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(46,176,50,0.65)" }} />
                    </div>
                    <div style={{ padding: "14px 17px 18px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.7, color: "#a8a8bc", letterSpacing: "-0.02em" }}>
                        <div style={{ color: "#48485e" }}>{rightTermCmd}</div>
                        <div style={{ marginTop: 8 }}><span style={{ color: "#4ade80", fontWeight: 700 }}>{rightTermLine1}</span></div>
                        <div><span style={{ color: "#22d3ee", fontWeight: 700 }}>{rightTermLine2}</span></div>
                        <div style={{ color: "#48485e" }}>{rightTermLine3}</div>
                        <div style={{ display: "flex", gap: 2, flexWrap: "nowrap", marginTop: 4 }}>
                            <span style={{ color: "#fff", fontWeight: 700 }}>116ms</span>
                            <span style={{ color: "#22d3ee", fontWeight: 700 }}>&nbsp;{">>>"}</span>
                            <span style={{ color: "#f472b6", fontWeight: 700 }}>&nbsp;CLASSGRID OS</span>
                        </div>
                    </div>
                </motion.div>

                {/* ── TRIANGLE ICON (centered X=447 -> left=403, top=254, w=88, h=88) ── */}
                <motion.div custom={D.icon} variants={rcIconV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                    style={{ position: "absolute", left: px(403), top: py(254), width: px(88), height: py(88), zIndex: 35 }}>
                    <div className="rc-pi" style={{ width: "100%", height: "100%", borderRadius: 22, background: "linear-gradient(148deg,#5840ee 0%,#b430e6 46%,#e82452 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg viewBox="0 0 48 48" fill="none" style={{ width: "52%", height: "52%", filter: "drop-shadow(0 2px 8px rgba(255,255,255,0.34))" }}>
                            <polygon points="24,8 44,42 4,42" fill="white" />
                        </svg>
                    </div>
                </motion.div>

                {/* ── LEFT MONITOR (left=256, top=422, w=88, h=88) ── */}
                <motion.div custom={D.monL} variants={rcMonV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                    style={{ position: "absolute", left: px(256), top: py(422), width: px(88), height: py(88), zIndex: 15 }}>
                    <svg viewBox="0 0 88 88" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                        <defs>
                            <filter id="rcGML" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="b" />
                                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>
                        <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(150,20,70,0.08)" strokeWidth="7" />
                        <path className="rc-aa" d="M 44 6 A 38 38 0 0 0 44 82" fill="none" stroke="rgba(52,211,153,0.92)" strokeWidth="5" strokeLinecap="round" filter="url(#rcGML)" />
                        <path className="rc-ab" d="M 44 82 A 38 38 0 0 0 44 6" fill="none" stroke="rgba(236,72,153,0.92)" strokeWidth="5" strokeLinecap="round" filter="url(#rcGML)" />
                    </svg>
                    <div style={{ position: "absolute", top: "10%", left: "10%", width: "80%", height: "80%", borderRadius: "50%", background: "rgba(4,6,14,0.97)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                            <rect x="3" y="5" width="34" height="20" rx="3" stroke="rgba(196,170,255,0.88)" strokeWidth="1.8" fill="none" />
                            <rect x="16" y="25" width="8" height="5" rx="1" stroke="rgba(196,170,255,0.88)" strokeWidth="1.6" fill="none" />
                            <line x1="11" y1="30" x2="29" y2="30" stroke="rgba(196,170,255,0.88)" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </div>
                </motion.div>

                {/* ── RIGHT MONITOR (left=584, top=422, w=88, h=88) ── */}
                <motion.div custom={D.monR} variants={rcMonV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                    style={{ position: "absolute", left: px(584), top: py(422), width: px(88), height: py(88), zIndex: 15 }}>
                    <svg viewBox="0 0 88 88" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                        <defs>
                            <filter id="rcGMR" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="b" />
                                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>
                        <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(12,72,168,0.08)" strokeWidth="7" />
                        <path className="rc-ab" d="M 44 6 A 38 38 0 0 1 44 82" fill="none" stroke="rgba(236,72,153,0.92)" strokeWidth="5" strokeLinecap="round" filter="url(#rcGMR)" />
                        <path className="rc-aa" d="M 44 82 A 38 38 0 0 1 44 6" fill="none" stroke="rgba(52,211,153,0.92)" strokeWidth="5" strokeLinecap="round" filter="url(#rcGMR)" />
                    </svg>
                    <div style={{ position: "absolute", top: "10%", left: "10%", width: "80%", height: "80%", borderRadius: "50%", background: "rgba(4,6,14,0.97)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                            <rect x="3" y="5" width="34" height="20" rx="3" stroke="rgba(130,204,255,0.90)" strokeWidth="1.8" fill="none" />
                            <rect x="16" y="25" width="8" height="5" rx="1" stroke="rgba(130,204,255,0.90)" strokeWidth="1.6" fill="none" />
                            <line x1="11" y1="30" x2="29" y2="30" stroke="rgba(130,204,255,0.90)" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </div>
                </motion.div>


            </div>

            {/* ── BOTTOM TEXT (outside canvas so it never gets clipped) ── */}
            <motion.div custom={D.btm} variants={rcBtmV} initial="cardHidden" whileInView="cardVisible" viewport={vp}
                style={{ marginTop: 24, textAlign: "center" }}
                className="hidden sm:block">
                <div style={{ fontSize: "9.5px", letterSpacing: "5.5px", color: "#a855f7", textTransform: "uppercase", marginBottom: 10, fontWeight: 500, fontFamily: "Inter, sans-serif" }}>
                    {rightLabel || "With ClassGrid OS"}
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, background: "linear-gradient(92deg,#c47dff 0%,#9878fa 50%,#be80fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontFamily: "Inter, sans-serif" }}>
                    {rightTime || "116ms instant sync"}
                </div>
            </motion.div>

        </div>
    );
}


// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

interface TurboComparisonNewProps {
    headline?: string;
    subheadline?: string;
    leftBox1Line0?: string;
    leftBox1Line1?: string;
    leftBox1Line2?: string;
    leftBox1Line3?: string;
    leftBox2Line0?: string;
    leftBox2Line1?: string;
    leftBox2Line2?: string;
    leftBox2Line3?: string;
    leftLabel?: string;
    leftTime?: string;
    rightTermCmd?: string;
    rightTermLine1?: string;
    rightTermLine2?: string;
    rightTermLine3?: string;
    rightLabel?: string;
    rightTime?: string;
}

export function TurboComparisonNew({
    headline, subheadline,
    leftBox1Line0, leftBox1Line1, leftBox1Line2, leftBox1Line3,
    leftBox2Line0, leftBox2Line1, leftBox2Line2, leftBox2Line3,
    leftLabel, leftTime,
    rightTermCmd: rightTermCmdProp, rightTermLine1: rightTermLine1Prop, rightTermLine2: rightTermLine2Prop, rightTermLine3: rightTermLine3Prop,
    rightLabel, rightTime,
}: TurboComparisonNewProps) {
    // Defaults for left boxes
    const box1Lines = [
        leftBox1Line0 || "school_with_div admission",
        leftBox1Line1 || "Checking required documents...",
        leftBox1Line2 || "Normalizing 10th merit...",
        leftBox1Line3 || "Allocating divisions...",
    ];
    const box2Lines = [
        leftBox2Line0 || "engineering cet_pipeline",
        leftBox2Line1 || "Validating EN numbers...",
        leftBox2Line2 || "Marking RLA reported...",
        leftBox2Line3 || "Generating DTE export...",
    ];
    // Defaults for right terminals
    const rightTermCmd = rightTermCmdProp || "classgrid admissions sync --all-tracks";
    const rightTermLine1 = rightTermLine1Prop || "school, junior college, engineering";
    const rightTermLine2 = rightTermLine2Prop || "PRNs issued, seats updated";
    const rightTermLine3 = rightTermLine3Prop || "DTE/SARAL exports ready";
    const [mounted, setMounted] = useState(false);

    // Wait for client hydration before showing animated content
    useEffect(() => {
        setMounted(true);
    }, []);

    // font injection (JetBrains Mono)
    useEffect(() => {
        if (document.getElementById("jb-mono-font")) return;
        const link = document.createElement("link");
        link.id = "jb-mono-font";
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap";
        document.head.appendChild(link);
    }, []);

    // bottom label appears after the last card line
    const bottomDelay = cardDelays(1).line3 + 0.23;

    return (
        <section
            style={{ backgroundColor: "var(--muted)" }}
            className="relative overflow-x-clip py-10 pb-44 md:py-24 lg:py-32"
        >
            <div className="relative mx-auto max-w-6xl px-6">

                {/* Heading */}
                <div className="mb-8 md:mb-16 text-center">
                    <div className="mx-auto mb-4 md:mb-6 h-1.5 w-16 md:w-24 rounded-full bg-orange-500" />
                    <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-5xl">
                        {headline || "Close Admissions in Minutes, Not Days"}
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-zinc-400 px-2">
                        {subheadline || "Classgrid verifies documents, builds merit lists, issues PRNs, links fee ledgers, and syncs every dashboard automatically."}
                    </p>
                </div>

                {/* Two Column Layout — only render after client mount to enable animations */}
                {mounted ? (
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-[45%_55%]">

                    {/* ── LEFT COLUMN — Without ClassGrid ── */}
                    <div className="flex flex-col items-center">
                        {/* Cards row — stacked on mobile, side-by-side on sm+ */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-6 sm:gap-12 w-full">
                            <TerminalCard cardIndex={0} lines={box1Lines} />
                            <TerminalCard cardIndex={1} lines={box2Lines} />
                        </div>

                        {/* Bottom label */}
                        <motion.div
                            custom={bottomDelay}
                            variants={bottomVariants}
                            initial="cardHidden"
                            whileInView="cardVisible"
                            viewport={{ once: true, amount: 0.3 }}
                            className="mt-[52px] hidden sm:flex flex-col items-center gap-2"
                        >
                            <span
                                className="text-[11.5px] font-medium text-white/40 tracking-[0.21em] uppercase"
                                style={{ fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif" }}
                            >
                                {leftLabel || "Without ClassGrid"}
                            </span>
                            <span
                                className="text-[32px] font-bold text-white tracking-[-0.015em] leading-[1.1]"
                                style={{ fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif" }}
                            >
                                {leftTime || "48h 12m"}
                            </span>
                        </motion.div>
                    </div>

                    {/* ── RIGHT COLUMN — With ClassGrid OS — full width on mobile ── */}
                    <div className="flex flex-col items-center w-full">
                        <RightColumn
                            rightTermCmd={rightTermCmd}
                            rightTermLine1={rightTermLine1}
                            rightTermLine2={rightTermLine2}
                            rightTermLine3={rightTermLine3}
                            rightLabel={rightLabel}
                            rightTime={rightTime}
                        />
                    </div>

                </div>
                ) : (
                    <div className="min-h-[400px]" /> 
                )}
            </div>
        </section>
    );
}
