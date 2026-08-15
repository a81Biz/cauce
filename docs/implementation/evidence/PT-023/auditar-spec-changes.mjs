// PT-023 · PHASE 2 — cada fila de cada spec-changes.md, contra los archivos que el PT tocó
// de verdad segun git. No infiere: compara la declaracion con el diff.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const git = (...a) => {
  try { return execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }); }
  catch { return ''; }
};

// Los commits de un PT: los que lo nombran en el mensaje.
const archivosDe = (pt) => {
  const shas = git('log', '--all', '--format=%H', `--grep=${pt}`).trim().split('\n').filter(Boolean);
  const set = new Set();
  for (const sha of shas) {
    for (const f of git('show', '--name-only', '--format=', sha).trim().split('\n')) {
      if (f) set.add(f.trim());
    }
  }
  return set;
};

// La primera celda de cada fila de la tabla nombra un documento; a veces con « · ancla».
const filasDe = (txt) => {
  const filas = [];
  for (const linea of txt.split('\n')) {
    const m = linea.match(/^\|\s*`?([^|`]+?)`?\s*(?:·[^|]*)?\|\s*(.+?)\s*\|\s*$/);
    if (!m) continue;
    const doc = m[1].trim();
    if (!doc || /^:?-+:?$/.test(doc) || /^documento$/i.test(doc)) continue;
    if (!/\.(md|json|mjs|sh|ya?ml)$/i.test(doc)) continue;
    filas.push({ doc, cambio: m[2].trim() });
  }
  return filas;
};

// Donde puede vivir un documento nombrado a secas.
const CARPETAS = ['docs/methodology', 'docs/methodology/INTAKE', 'docs/methodology/QA',
  'docs/methodology/PTSA', 'docs/methodology/FIDE', 'docs/methodology/tools',
  'docs/implementation', 'docs/enterprise-documentation', '.', '.github/workflows'];
const resolverDoc = (doc) => {
  const d = doc.replace(/^\.\//, '');
  if (existsSync(join(ROOT, d))) return d;
  for (const c of CARPETAS) {
    if (existsSync(join(ROOT, c, d))) return `${c}/${d}`.replace(/^\.\//, '');
  }
  return null;
};

const pts = readdirSync(join(ROOT, 'changes'))
  .filter((d) => existsSync(join(ROOT, 'changes', d, 'spec-changes.md')))
  .sort();

let totalFilas = 0, sinTocar = [], sinResolver = [];
for (const dir of pts) {
  const pt = dir.slice(0, 6);
  const filas = filasDe(readFileSync(join(ROOT, 'changes', dir, 'spec-changes.md'), 'utf8'));
  if (!filas.length) continue;
  const tocados = archivosDe(pt);
  for (const f of filas) {
    totalFilas++;
    const ruta = resolverDoc(f.doc);
    if (!ruta) { sinResolver.push({ pt, doc: f.doc }); continue; }
    if (!tocados.has(ruta)) sinTocar.push({ pt, doc: f.doc, ruta, cambio: f.cambio.slice(0, 90) });
  }
}

console.log(`PTs con spec-changes.md: ${pts.length}`);
console.log(`Filas que nombran un documento: ${totalFilas}`);
console.log(`Filas cuyo documento NO aparece en ningun commit del PT: ${sinTocar.length}`);
console.log(`Filas cuyo documento no se pudo localizar: ${sinResolver.length}`);
console.log();
if (sinTocar.length) {
  console.log('DECLARADO Y NO TOCADO');
  for (const s of sinTocar) console.log(`  ${s.pt}  ${s.ruta}`.padEnd(58) + `${s.cambio}`);
}
if (sinResolver.length) {
  console.log();
  console.log('NO SE PUDO LOCALIZAR EL DOCUMENTO (RULE-06: se dice, no se cuenta como bueno)');
  for (const s of sinResolver) console.log(`  ${s.pt}  ${s.doc}`);
}
