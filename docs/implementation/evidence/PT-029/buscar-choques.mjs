// PT-029 · PHASE 2 — buscar choques de forma REPETIBLE.
//
// La forma del defecto: una comprobacion exige, en la fase N, un artefacto que el procedimiento
// escribe en la fase M > N. El estado intermedio se vuelve imposible de atravesar.
//
// Se cruzan dos hechos que ya existen y nadie habia cruzado:
//   1. PHASES.md dice que artefacto PRODUCE cada fase.
//   2. tracker.mjs FASES lo declara como dato (produce: [...]), y las compuertas por fase.
//   3. verify-fdge.mjs dice que exige, y CUANDO — con `gate` o a partir de que fase.
import { readFileSync } from 'node:fs';

const V = readFileSync('docs/methodology/tools/verify-fdge.mjs', 'utf8');
const T = readFileSync('docs/methodology/tools/tracker.mjs', 'utf8');

// ── 1 · que produce cada fase, segun el unico sitio donde es un DATO ────────
const FASES = {};
for (const m of T.matchAll(/^\s*(\d+):\s*\{\s*nombre:\s*'([^']+)',\s*produce:\s*\[([^\]]*)\](?:,\s*cierra:\s*'([^']*)')?/gm)) {
  FASES[+m[1]] = {
    nombre: m[2],
    produce: [...m[3].matchAll(/'([^']+)'/g)].map((x) => x[1]),
    cierra: m[4] ?? null,
  };
}

// ── 2 · en que fase se produce cada artefacto ───────────────────────────────
const faseDe = {};
for (const [n, f] of Object.entries(FASES)) for (const a of f.produce) if (!(a in faseDe)) faseDe[a] = +n;

// ── 3 · las comprobaciones que se activan con `gate` ────────────────────────
// La forma peligrosa: `if (gate) fail(...)` sin distinguir CUAL. Una compuerta temprana
// hereda las exigencias de la ultima.
const lineas = V.split('\n');
const conGate = [];
for (let i = 0; i < lineas.length; i++) {
  const l = lineas[i];
  // `if (gate) fail('X', ...)` o `if (gate || algo) fail(...)`
  const m = l.match(/if\s*\(\s*gate\s*(\|\|[^)]*)?\)\s*fail\('([A-Z]+-R\d+)'/);
  if (m) conGate.push({ linea: i + 1, regla: m[2], texto: l.trim() });
}
// `gate === 'G4'` es lo CORRECTO: distingue. Se cuenta para contrastar.
const conG4 = [...V.matchAll(/gate\s*===\s*'G4'/g)].length;

console.log('=== FASES declaradas como dato en tracker.mjs ===');
for (const [n, f] of Object.entries(FASES)) {
  console.log(`  PHASE ${n.padStart(2)} ${f.nombre.padEnd(16)} produce: ${f.produce.join(' · ') || '—'}` +
    (f.cierra ? `   cierra: ${f.cierra.split('·')[0].trim()}` : ''));
}

console.log();
console.log('=== CHOQUE · comprobaciones que se activan con CUALQUIER compuerta ===');
console.log(`  (frente a ${conG4} que distinguen gate === 'G4', que es la forma correcta)`);
if (!conGate.length) console.log('  ninguna');
for (const c of conGate) {
  console.log(`  verify-fdge.mjs:${c.linea}  ${c.regla}`);
  console.log(`      ${c.texto.slice(0, 110)}`);
}

console.log();
console.log('=== Cruce: que compuerta cierra cada fase, y que artefacto se exige ===');
for (const [n, f] of Object.entries(FASES)) {
  if (!f.cierra) continue;
  const g = f.cierra.match(/\bG\d\b/)?.[0];
  if (!g) continue;
  const posteriores = Object.entries(FASES).filter(([m]) => +m > +n).flatMap(([m, x]) => x.produce.map((a) => ({ a, m: +m })));
  console.log(`  PHASE ${n} cierra con ${g}. Artefactos que aun NO existen: ${posteriores.map((p) => `${p.a}(P${p.m})`).join(' ') || '—'}`);
}
