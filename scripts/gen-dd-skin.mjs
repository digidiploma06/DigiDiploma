// Generates src/styles/dd-skin.generated.css
//
// The redesign's dark theme is applied to the public and student pages by
// putting `dd-skin` on <body>. Those pages were written with light Tailwind
// colour classes (bg-white, text-slate-900, from-blue-600 …). Instead of
// editing thousands of class names, this script scans the source for every
// colour class in use and emits a dark-theme override for each one.
//
// Run: node scripts/gen-dd-skin.mjs   (re-run after adding new colour classes)

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const twColors = require("tailwindcss/colors");

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "src");
const OUT = path.join(SRC, "styles", "dd-skin.generated.css");

// Admin screens keep the old light theme, so their classes are not scanned.
const SKIP = /(^|\/)(Admin|EnhancedAdmin|ModernAdmin|MobileAdmin|AnalyticsDashboard)[A-Za-z]*\.tsx$/;
// The new home page and site chrome are already dark-native.
const SKIP_DIRS = [path.join(SRC, "components", "site")];
const SKIP_FILES = [path.join(SRC, "pages", "Index.tsx")];

const INK = "#0b0b14";
const SURFACE = "#161624";
const TEXT = "#f3f2ee";
const VIOLET = "#7c5cff";

const GRAY_FAMILIES = new Set(["slate", "gray", "zinc", "neutral", "stone"]);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.includes(p)) walk(p, out);
    } else if (/\.(tsx|ts)$/.test(e.name) && !SKIP.test(p) && !SKIP_FILES.includes(p)) {
      out.push(p);
    }
  }
  return out;
}

function hexToRgb(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
}

function rgba(rgb, a) {
  const alpha = Math.round(a * 1000) / 1000;
  return alpha >= 1 ? `rgb(${rgb.join(" ")})` : `rgb(${rgb.join(" ")} / ${alpha})`;
}

// hue bucket -> { tint rgb for translucent fills, light text colour, dark gradient stop }
function bucket(h) {
  if (h >= 200 && h < 275) return { tint: [124, 92, 255], text: "#a892ff", stop: "#14102a" };
  if (h >= 275 && h < 310) return { tint: [160, 110, 255], text: "#c9b8ff", stop: "#1a1028" };
  if (h >= 310 && h < 340) return { tint: [255, 95, 162], text: "#ff9cc8", stop: "#1d1020" };
  if (h >= 340 || h < 18) return { tint: [255, 95, 120], text: "#ff8a9a", stop: "#1d1114" };
  if (h >= 18 && h < 38) return { tint: [255, 164, 92], text: "#ffb37a", stop: "#1d1512" };
  if (h >= 38 && h < 70) return { tint: [255, 215, 106], text: "#ffd76a", stop: "#1c1810" };
  if (h >= 170 && h < 200) return { tint: [45, 226, 238], text: "#7fe9f2", stop: "#0d1a1d" };
  return { tint: [93, 255, 176], text: "#6ee7a8", stop: "#0d1a16" };
}

function isGray(family, s, l) {
  if (family) return GRAY_FAMILIES.has(family);
  return s < 0.3 || l < 0.16;
}

function isBlue(h, s) {
  return h >= 200 && h < 275 && s > 0.35;
}

/** Returns { css, kind } or null when the colour should be left alone. */
function remap(prop, family, hex, alpha) {
  const rgb = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(rgb);
  const gray = isGray(family, s, l);
  const b = bucket(h);
  const a = alpha ?? 1;

  if (family === "black") return null;

  if (prop === "text" || prop === "placeholder") {
    if (family === "white" || l >= 0.6) return null;
    if (gray) {
      const c = l < 0.25 ? TEXT : l < 0.4 ? "#d9d8e3" : l < 0.55 ? "#a4a3b5" : "#8a899c";
      return { css: rgba(hexToRgb(c), a), kind: "darktext" };
    }
    return { css: rgba(hexToRgb(b.text), a), kind: "tinttext" };
  }

  if (prop === "bg") {
    if (family === "white") {
      if (a < 0.5) return null; // translucent white on dark heroes already works
      return { css: rgba(hexToRgb(SURFACE), a >= 1 ? 1 : Math.max(a, 0.8)), kind: "surface" };
    }
    if (l >= 0.9) return { css: gray ? rgba([255, 255, 255], 0.05 * a) : rgba(b.tint, 0.13 * a), kind: "surface" };
    if (l >= 0.78) return { css: gray ? rgba([255, 255, 255], 0.1 * a) : rgba(b.tint, 0.2 * a), kind: "surface" };
    if (gray) {
      if (l >= 0.55) return { css: rgba([255, 255, 255], 0.18 * a), kind: "surface" };
      return null;
    }
    if (isBlue(h, s)) {
      const c = l >= 0.5 ? VIOLET : l >= 0.4 ? "#6a48f5" : l >= 0.2 ? "#3a1fb8" : "#15102e";
      return { css: rgba(hexToRgb(c), a), kind: "brand" };
    }
    return l >= 0.55 ? { css: null, kind: "bright" } : null;
  }

  if (prop === "border" || prop === "divide" || prop === "ring") {
    if (family === "white") return null;
    if (l >= 0.75) return { css: gray ? rgba([255, 255, 255], 0.1 * a) : rgba(b.tint, 0.35 * a), kind: "line" };
    if (gray) return l < 0.2 ? { css: rgba([255, 255, 255], 0.28 * a), kind: "line" } : null;
    if (isBlue(h, s)) return { css: rgba(hexToRgb(VIOLET), a), kind: "line" };
    return null;
  }

  // gradient stops: from / via / to
  if (family === "white") return { css: rgba(hexToRgb("#11111c"), a), kind: "stop" };
  if (l >= 0.78) return { css: rgba(hexToRgb(gray ? INK : b.stop), a), kind: "stop" };
  if (!gray && isBlue(h, s)) {
    // Blue/indigo gradients become violet; later stops go darker so the gradient keeps depth
    const step = prop === "to" ? 2 : prop === "via" ? 1 : 0;
    const ramp = [VIOLET, "#5b3fe0", "#3a1fb8", "#241370", "#15102e"];
    const start = l >= 0.5 ? 0 : l >= 0.4 ? 1 : l >= 0.2 ? 2 : 4;
    return { css: rgba(hexToRgb(ramp[Math.min(start + step, ramp.length - 1)]), a), kind: "stop" };
  }
  if (gray && l < 0.5) return { css: rgba(rgb, a), kind: "stop-darkgray" };
  return { css: rgba(rgb, a), kind: "stop-original" };
}

const esc = (cls) => cls.replace(/([^a-zA-Z0-9_-])/g, "\\$1");

const VARIANTS = {
  "": (c) => `.${c}`,
  "hover:": (c) => `.${c}:hover`,
  "focus:": (c) => `.${c}:focus`,
  "group-hover:": (c) => `.group:hover .${c}`,
};
const SCREENS = { "sm:": 640, "md:": 768, "lg:": 1024, "xl:": 1280 };

const TOKEN =
  /(?<![\w-])((?:hover:|focus:|group-hover:|sm:|md:|lg:|xl:)?)(bg|text|border|from|via|to|ring|divide|placeholder)-(?:(white|black)|([a-z]+)-(\d{2,3})|\[#([0-9A-Fa-f]{3,8})\])(?:\/(\d{1,3}))?(?![\w-])/g;

const found = new Map();
for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(TOKEN)) {
    const [cls, variant, prop, bw, family, shade, hexArb, alphaStr] = m;
    let hex, fam;
    if (bw) {
      hex = bw === "white" ? "#ffffff" : "#000000";
      fam = bw;
    } else if (hexArb) {
      hex = "#" + hexArb;
      fam = null;
    } else {
      const pal = twColors[family];
      if (!pal || typeof pal !== "object" || !pal[shade]) continue;
      hex = pal[shade];
      fam = family;
    }
    if (!/^#[0-9a-fA-F]{3,8}$/.test(hex)) continue;
    found.set(cls, { cls, variant, prop, fam, hex, alpha: alphaStr ? Number(alphaStr) / 100 : undefined });
  }
}

const P = ":where(.dd-skin)";
const order = { text: 0, placeholder: 0, bg: 1, border: 2, divide: 2, ring: 2, from: 3, via: 4, to: 5 };
const entries = [...found.values()].sort(
  (a, b) => order[a.prop] - order[b.prop] || (a.variant ? 1 : 0) - (b.variant ? 1 : 0) || a.cls.localeCompare(b.cls),
);

const rules = [];
const media = {};
const brights = [];
const darkTexts = [];
const clipRules = [];

for (const e of entries) {
  const r = remap(e.prop, e.fam, e.hex, e.alpha);
  if (!r) continue;
  const base = esc(e.cls);

  if (r.kind === "bright") {
    if (!e.variant) brights.push(`.${base}`);
    continue;
  }
  if (r.kind === "darktext" && !e.variant) darkTexts.push(`.${base}`);

  let decl;
  switch (e.prop) {
    case "text": decl = `color: ${r.css};`; break;
    case "placeholder": continue;
    case "bg": decl = `background-color: ${r.css};`; break;
    case "border": decl = `border-color: ${r.css};`; break;
    case "ring": decl = `--tw-ring-color: ${r.css};`; break;
    case "divide": decl = null; break;
    case "from":
      decl = `--tw-gradient-from: ${r.css} var(--tw-gradient-from-position); --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);`;
      break;
    case "via":
      decl = `--tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), ${r.css} var(--tw-gradient-via-position), var(--tw-gradient-to);`;
      break;
    case "to": decl = `--tw-gradient-to: ${r.css} var(--tw-gradient-to-position);`; break;
  }

  // Dark grey gradient used as clipped text ("bg-clip-text") must turn light to stay readable
  if (r.kind === "stop-darkgray" && !e.variant) {
    const light = e.prop === "from" ? TEXT : "#a4a3b5";
    const d =
      e.prop === "from"
        ? `--tw-gradient-from: ${light} var(--tw-gradient-from-position); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);`
        : e.prop === "to"
          ? `--tw-gradient-to: ${light} var(--tw-gradient-to-position);`
          : null;
    if (d) clipRules.push(`${P} .bg-clip-text.${base} { ${d} }`);
  }

  if (e.prop === "divide") {
    rules.push(`${P} .${base} > :not([hidden]) ~ :not([hidden]) { border-color: ${r.css}; }`);
    continue;
  }

  if (e.variant in SCREENS) {
    (media[e.variant] ||= []).push(`  ${P} .${base} { ${decl} }`);
  } else {
    rules.push(`${P} ${VARIANTS[e.variant](base)} { ${decl} }`);
  }
}

// Everything is screen-only so printed pages (exam timetable) stay black on white.
let css = `/* GENERATED by scripts/gen-dd-skin.mjs — do not edit by hand. */\n\n@media screen {\n${rules.join("\n")}\n`;
for (const [v, list] of Object.entries(media)) {
  css += `\n@media (min-width: ${SCREENS[v]}px) {\n${list.join("\n")}\n}\n`;
}
css += `\n${clipRules.join("\n")}\n`;
if (brights.length && darkTexts.length) {
  const B = `:is(${brights.join(", ")})`;
  const D = `:is(${darkTexts.join(", ")})`;
  css += `\n/* Dark text stays dark on bright fills (yellow CTAs, green pills …) */\n${P} ${B}${D},\n${P} ${B} ${D} { color: ${INK}; }\n`;
}
css += "}\n";

fs.writeFileSync(OUT, css);
console.log(`dd-skin: ${found.size} colour classes scanned, ${rules.length} rules written to ${path.relative(ROOT, OUT)}`);
