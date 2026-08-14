#!/usr/bin/env bash
# selftest — Prueba los verificadores contra un proyecto sintético.
#
# Existe porque la 4.0.0 salió con cuatro defectos críticos que solo eran visibles
# EJECUTANDO: los verificadores nunca se habían corrido contra PTs reales. Dos bloques:
#   A) cuatro casos límite bien formados → deben pasar en verde
#   B) once defectos inyectados → cada uno debe ser detectado
#
# Uso:  bash tools/selftest.sh [dir-temporal]
# Exit: 0 todo correcto · 1 algún caso falla
set -u
SUITE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# PT-034 · el binario publicado vive fuera de la suite: cauce start es su punto de entrada.
RAIZ="$(cd "$SUITE/../.." && pwd)"
WORK="${1:-$(mktemp -d)}/mth-selftest"
FAILED=0
# La versión vigente se DERIVA del CHANGELOG (`SUITE-R40`), también aquí: el fixture la tenía
# escrita a mano y era una copia más del número —la misma avería que este arnés existe para
# cazar, dentro del arnés—. Con la constante fijada en `verify-fdge` nadie lo notaba, porque
# las dos copias estaban equivocadas en la misma dirección.
VIGENTE="$(grep -m1 -oE '^## [0-9]+\.[0-9]+\.[0-9]+' "$SUITE/CHANGELOG.md" | cut -d' ' -f2)"

# Cuántos casos hay se CUENTA, no se escribe. Estaba escrito a mano en dos sitios —«105 casos»
# en el README y «130 casos» en el workflow— y ninguna de las dos cifras era la real: el mismo
# hecho copiado divergiendo, que es lo que este repositorio existe para eliminar. Ahora la única
# fuente es la ejecución.
TOTAL=0
pass() { TOTAL=$((TOTAL + 1)); printf "  \033[32m✓\033[0m %s\n" "$1"; }
bad()  { TOTAL=$((TOTAL + 1)); printf "  \033[31m✗\033[0m %s\n" "$1"; FAILED=1; }
# Una herramienta que REVIENTA no imprime el patron que se le busca, asi que chkno la daba
# por buena: el arnes certificaba un verificador roto. Se rompio verify-qa a proposito y dos
# casos siguieron en verde. Ahora un rastro de excepcion invalida el caso, pase lo que pase.
revento() { printf '%s' "$1" | grep -qE 'SyntaxError|ReferenceError|TypeError|RangeError|node:internal|at file:///'; }
chk() {
  local name="$1" pat="$2"; shift 2
  local out; out="$("$@" 2>&1)"
  if revento "$out"; then bad "$name  (la herramienta reventó: no verifica nada)"; return; fi
  if printf '%s' "$out" | grep -q -- "$pat"; then pass "$name"; else bad "$name  (no apareció: $pat)"; fi
}
chkno() {
  local name="$1" pat="$2"; shift 2
  local out; out="$("$@" 2>&1)"
  if revento "$out"; then bad "$name  (la herramienta reventó: no verifica nada)"; return; fi
  if printf '%s' "$out" | grep -q -- "$pat"; then bad "$name  (apareció: $pat)"; else pass "$name"; fi
}

V() { node "$WORK/docs/methodology/tools/verify-fdge.mjs" "$@"; }

# ─── Fixture ────────────────────────────────────────────────────────────────
build_fixture() {
  [ -n "${MTH_KEEP:-}" ] || rm -rf "$WORK"; mkdir -p "$WORK"; cd "$WORK"
  mkdir -p docs/enterprise-documentation docs/implementation/evidence docs/methodology/tools changes graphify-out
  for f in 02-PRD 03-TRD 06-Backend-Architecture; do echo "# $f" > "docs/enterprise-documentation/$f.md"; done
  printf '# Conventions\n\nRULE-01 a\nRULE-02 b\nRULE-03 c\n' > docs/enterprise-documentation/11-Conventions.md
  echo '{}' > graphify-out/graph.json
  cp "$SUITE"/tools/*.mjs docs/methodology/tools/
  # El CHANGELOG viaja con la suite instalada (`SUITE-R37`) y es de donde las herramientas leen
  # la versión vigente (`SUITE-R40`). Sin él en el fixture, la compuerta de migración quedaba
  # sin evaluar y el caso «versión desalineada ⇒ restringido» pasaba por no comprobar nada.
  cp "$SUITE"/CORE.md "$SUITE"/CORE-PTSA.md "$SUITE"/PHASES.md "$SUITE"/RULES.md "$SUITE"/LEXICON.md "$SUITE"/EXECUTION-MODES.md "$SUITE"/CHANGELOG.md docs/methodology/ 2>/dev/null || true
  mkdir -p docs/methodology/PTSA && cp "$SUITE"/PTSA/PTSA-V3-Especificacion-Oficial.md docs/methodology/PTSA/ 2>/dev/null || true

  cat > docs/implementation/REGISTRY.json <<'J'
{ "suite_version":"5.2.0","execution_mode":"SUPERVISED",
  "graph":{"generated":"2026-08-05","scope":"src/","pt_at_generation":4},
  "counters":{"PT":4,"EP":0,"QA":0,"QR":0,"QD":0,"H":0,"E":0,"P":0,"R":0,"INC":0},
  "allocations":[
    {"id":"PT-001","type":"BUG","severity":"S2","slug":"login","created":"2026-08-05","status":"DONE","phase":8,"structural":false,"suite_version":"5.2.0"},
    {"id":"PT-002","type":"INVESTIGATION","severity":"S3","slug":"pool","created":"2026-08-05","status":"CLOSED","phase":8,"structural":false,"suite_version":"5.2.0"},
    {"id":"PT-003","type":"CHORE","severity":"S4","slug":"typo","created":"2026-08-05","status":"DONE","phase":8,"structural":false,"suite_version":"5.2.0"},
    {"id":"PT-004","type":"FEATURE","severity":"S3","slug":"pdf","created":"2026-08-06","status":"IN_PROGRESS","phase":4,"structural":false,"suite_version":"5.2.0"}
  ] }
J
  # Solo la PRIMERA aparición: la del proyecto. Las de cada allocation se dejan como están —
  # un PT abierto bajo una versión la conserva hasta cerrar (`SUITE-R18`), y el fixture debe
  # poder representar eso.
  perl -0pi -e "s/\"suite_version\":\"[\d.]+\"/\"suite_version\":\"$VIGENTE\"/" docs/implementation/REGISTRY.json

  intake() { # $1 dir · $2 id · $3 type · $4 sev · $5 track · $6 complexity
    mkdir -p "changes/$1"
    { printf -- '---\nid: %s\ntype: %s\nseverity: %s\ntrack: %s\ncomplexity: %s\nstatus: READY\n---\n\n' "$2" "$3" "$4" "$5" "$6"
      cat <<'M'
## 10. Firma `[HUMANO]`

```
Reportado por: Ada Lovelace
Fecha: 2026-08-05
Confirmo que los comportamientos esperado y observado, la severidad y el out-of-scope
reflejan mi intención: SÍ
```

## 15. Resultado de la compuerta G1 `[AGENTE]`

```
VEREDICTO: PASS
```

## Cómo termina

Termina cuando: el comportamiento esperado se observa en el sistema real
M
    } > "changes/$1/intake.md"
  }

  intake PT-001-login       PT-001 BUG           S2 STANDARD STANDARD
  intake PT-002-pool        PT-002 INVESTIGATION S3 STANDARD STANDARD
  intake PT-003-typo        PT-003 CHORE         S4 EXPRESS  TRIVIAL
  intake PT-004-pdf         PT-004 FEATURE       S3 STANDARD MAJOR

  printf '| AC | C | TS | Test | Evidencia | QA | E |\n|:-|:-|:-|:-|:-|:-|:-|\n| AC-01 | login ok | TS-01 | tests/a.spec.ts:24 | api/ok.json | QA-014 | ✓ |\n' > changes/PT-001-login/traceability.md
  printf '## PT-002\n\n## Conclusión\nSe agota el pool.\nEvidencia: logs/pool.txt\nSin determinar: por qué no se libera.\nPT de seguimiento: PT-005.\n' > changes/PT-002-pool/discovery.md
  printf '| AC | C | TS | Test | Evidencia | QA | E |\n|:-|:-|:-|:-|:-|:-|:-|\n| AC-01 | etiqueta | TS-01 | — | shots/a.png | — | ✓ |\n' > changes/PT-003-typo/traceability.md
  printf 'Tests: ninguno — FDGE-R18.\n' > changes/PT-003-typo/strategy.md
  printf '| AC | C | TS | Test | Evidencia | QA | E |\n|:-|:-|:-|:-|:-|:-|:-|\n| AC-01 | pdf | TS-01 | | | | |\n' > changes/PT-004-pdf/traceability.md

  # Las reglas nuevas rigen para lo abierto bajo esta versión: el fixture las cumple.
  for d in PT-001-login PT-002-pool PT-003-typo PT-004-pdf; do
    printf '2026-08-05 · PHASE 1 → 2
cierro: intake
estoy en: análisis
sigue: estrategia

2026-08-05 · PHASE 2 → 3
cierro: análisis
estoy en: estrategia
sigue: propuesta

2026-08-05 · PHASE 3 → 4
cierro: estrategia
estoy en: propuesta
sigue: G2

2026-08-05 · PHASE 4 → 5
cierro: G2
estoy en: implementación
sigue: evidencia

2026-08-05 · PHASE 5 → 6
cierro: código
estoy en: evidencia
sigue: G3

2026-08-05 · PHASE 6 → 7
cierro: evidencia
estoy en: validación
sigue: persistencia

2026-08-05 · PHASE 7 → 8
cierro: G3
estoy en: persistencia
sigue: integración
' > "changes/$d/bitacora.md"
  done

  mkdir -p docs/implementation/evidence/PT-001/api docs/implementation/evidence/PT-003/shots
  echo '{"status":200}' > docs/implementation/evidence/PT-001/api/ok.json
  touch docs/implementation/evidence/PT-003/shots/a.png
  printf '{"pt":"PT-001","criteria":[{"ac":"AC-01","scenarios":["TS-01"],"tests":["tests/a.spec.ts:24"],"evidence":["api/ok.json"],"verified":true}],"suite":{"passed":40,"failed":0,"coverage":81,"baseline":80}}' > docs/implementation/evidence/PT-001/manifest.json
  printf '{"pt":"PT-003","criteria":[{"ac":"AC-01","scenarios":["TS-01"],"tests":[],"evidence":["shots/a.png"],"verified":true}],"suite":{"passed":40,"failed":0,"coverage":81,"baseline":80}}' > docs/implementation/evidence/PT-003/manifest.json
  printf 'SELF_REVIEW_COMPLETE\n' > docs/implementation/evidence/PT-001/self-review.md
  printf 'SELF_REVIEW_COMPLETE\n' > docs/implementation/evidence/PT-003/self-review.md

  cat > docs/implementation/HISTORY.log <<'M'
## PT-001 — BUG: login
Fecha: 2026-08-05
Estado: DONE
Estructural: no
Rama: fix/PT-001-login
Compuertas: G1 2026-08-05 Ada Lovelace · G2 2026-08-05 Ada Lovelace · G3 2026-08-05 Ada Lovelace · G4 pendiente

## PT-002 — INVESTIGATION: pool
Fecha: 2026-08-05
Estado: CLOSED
Estructural: no

## PT-003 — CHORE: typo
Fecha: 2026-08-05
Estado: DONE
Estructural: no
M
  printf '| PT-001 | BUG | S2 | DONE | login | changes/PT-001-login/ | 2026-08-05 |\n| PT-002 | INVESTIGATION | S3 | CLOSED | pool | changes/PT-002-pool/ | 2026-08-05 |\n' > docs/implementation/DISCOVERY.md
  printf '| PT-003 | CHORE | S4 | DONE | typo | changes/PT-003-typo/ | 2026-08-05 |\n' > docs/implementation/REFACTOR_SCOPE.md
  printf '| PT-004 | FEATURE | S3 | IN_PROGRESS | pdf | changes/PT-004-pdf/ | 2026-08-06 |\n' > docs/implementation/ENRICHMENT.md
}

# node en vez de python: en MSYS/Git-Bash, python no resuelve rutas /tmp/...
reg_set() { node -e "
const fs=require('fs'); const p=process.argv[1];
const r=JSON.parse(fs.readFileSync(p,'utf8'));
(new Function('r', process.argv[2]))(r);
fs.writeFileSync(p, JSON.stringify(r,null,2));
" "$WORK/docs/implementation/REGISTRY.json" "$1"; }

# ─── A · casos límite bien formados ─────────────────────────────────────────
echo "── A · casos límite (deben pasar en verde) ──"
build_fixture
chk  "BUG validado, listo para G4"   "Sin errores" V --gate G4 PT-001
chk  "INVESTIGATION sin AC"          "Sin errores" V PT-002
chk  "CHORE en EXPRESS sin tests"    "Sin errores" V PT-003
chk  "FEATURE a medio camino"        "Sin errores" V PT-004
chk  "MAJOR con grafo fresco"        "Grafo FRESH" V PT-004

# ─── B · defectos inyectados ────────────────────────────────────────────────
echo "── B · defectos inyectados (deben detectarse) ──"

build_fixture; rm -rf "$WORK/graphify-out"
chk "MAJOR sin grafo bloquea G2"        "✗ FDGE-R43"        V PT-004
build_fixture; reg_set "r.allocations.push({id:'PT-009',type:'REFACTOR',severity:'S3',slug:'x',created:'2026-08-06',status:'INTEGRATED',phase:9,structural:true}); r.counters.PT=9"
chk "grafo STALE tras PT estructural"   "Grafo STALE"       V PT-001
build_fixture; perl -0pi -e 's/^Estructural: no\n//m' "$WORK/docs/implementation/HISTORY.log"
chk "falta «Estructural:» en HISTORY"   "FDGE-R44"          V PT-001
build_fixture; perl -pi -e 's/reflejan mi intención: SÍ//' "$WORK/changes/PT-001-login/intake.md"
chk "Intake sin firmar"                 "INTAKE-R06"        V PT-001
build_fixture; perl -pi -e 's/^## Conclusión/## Notas/' "$WORK/changes/PT-002-pool/discovery.md"
chk "INVESTIGATION sin Conclusión"      "FDGE-R42"          V PT-002
build_fixture; perl -pi -e 's/^Estado: DONE$/Estado: VALIDATION_PENDING/ if $. < 6' "$WORK/docs/implementation/HISTORY.log"
chk "BUG sin validar intentando G4"     "FDGE-R34"          V --gate G4 PT-001
build_fixture; perl -pi -e 's/G3 2026-08-05 Ada Lovelace/G3 auto/' "$WORK/docs/implementation/HISTORY.log"
chk "BUG en DONE sin firma humana G3"   "FDGE-R26"          V --gate G4 PT-001
build_fixture; reg_set "r.counters.PT=1"
chk "contador bajo el ID ya asignado"   "LEX-R04"           V --all
build_fixture; perl -pi -e 's/IN_PROGRESS/PENDING/' "$WORK/docs/implementation/ENRICHMENT.md"
chk "estado derogado de v3 en índice"   "LEX-R07"           V PT-004
build_fixture; rm -f "$WORK/docs/implementation/evidence/PT-001/api/ok.json"
chk "evidencia declarada inexistente"   "inexistente en disco" V PT-001
build_fixture; rm -f "$WORK/docs/enterprise-documentation/11-Conventions.md"
chk "Foundation sin archivo del núcleo" "FND-R08"           V PT-001
build_fixture; reg_set "r.suite_version='4.2.0'"
chk "versión desalineada ⇒ restringido" "SUITE-R17"         V PT-001
# La versión vigente se DERIVA del CHANGELOG (`SUITE-R40`). Sin él no hay contra qué comparar,
# y lo que no puede comprobarse se declara: inventar un número —que es lo que hacía la constante
# fijada— convierte la compuerta en una que dice «todo bien» sobre nada.
build_fixture; reg_set "r.suite_version='4.2.0'"; rm -f "$WORK/docs/methodology/CHANGELOG.md"
chk "sin CHANGELOG ⇒ no evaluable"      "SUITE-R40"         V PT-001
build_fixture; reg_set "delete r.allocations[0].suite_version"
chk "allocation sin sello de versión"   "SUITE-R18"         V PT-001


# ─── D · migración desde cada versión ───────────────────────────────────────
echo "── D · migración ──"
MIG="$WORK-mig"

mk_v3() {   # proyecto v3 típico: sin REGISTRY, archivos globales, PTSA en español
  rm -rf "$MIG"; mkdir -p "$MIG"/{docs/implementation,docs/enterprise-documentation,PTSA/Hallazgos,PTSA/Fases,QA}
  cd "$MIG"
  printf '## PT-014 — BUG: x
Estado: CLOSED

## PT-021 — FEATURE: y
Estado: DONE
' > docs/implementation/HISTORY.log
  printf 'PT-021
Classification: FEATURE
' > docs/implementation/PLAN_ACTUAL.md
  printf 'PT-021.1
Status: PENDING
' > docs/implementation/PENDING_TASKS.md
  printf '## Session
' > docs/implementation/SESSION_SUMMARY.md
  printf '## PT-014
DISCOVERY_PENDING
' > docs/implementation/DISCOVERY.md
  touch docs/implementation/instrucctions.md PTSA/Motor-PTSA.md
  touch PTSA/Hallazgos/H-007.md PTSA/Fases/F4_Trazabilidad.md
  printf '## QD-003
Estado: OPEN
' > QA/QA-DEFECTS.md
  printf '# 01 PRD
' > docs/enterprise-documentation/01-PRD.md
}
mk_v40() {  # 4.0.x: REGISTRY sin graph ni structural, HISTORY sin «Estructural:»
  rm -rf "$MIG"; mkdir -p "$MIG"/docs/implementation "$MIG"/docs/methodology
  cd "$MIG"
  cat > docs/implementation/REGISTRY.json <<'J'
{ "suite_version":"4.0.1","execution_mode":"SUPERVISED",
  "counters":{"PT":7,"EP":0,"QA":0,"QR":0,"QD":0,"H":0,"E":0,"P":0,"R":0,"INC":0},
  "allocations":[{"id":"PT-007","type":"FEATURE","severity":"S3","slug":"x","created":"2026-08-01","status":"IN_PROGRESS","phase":5}] }
J
  printf '## PT-007 — FEATURE: x\nEstado: DONE\n' > docs/implementation/HISTORY.log
  mkdir -p docs/methodology/tools && cp "$SUITE"/tools/*.mjs docs/methodology/tools/
}
M() { node "$SUITE/tools/migrate.mjs" "$@" "$MIG"; }

mk_v3
chk "v3 detectada"                     "Versión detectada: 3.x"          M
chk "v3 · REGISTRY sembrado a PT=21"   "PT=21"                           M
chk "v3 · SESSION_SUMMARY renombrado"  "SESSION_LOG"                     M
chk "v3 · PTSA/Fases → Phases"         "PTSA/Fases → PTSA/Phases"        M
chk "v3 · instrucctions archivado"     "instrucctions.md"                M
chk "v3 · pide reconciliación"         "START RECONCILE"                 M
chk "v3 · pide Intake retroactivo"     "intake.md retroactivo"           M
chk "v3 · dry-run no toca nada"        "Nada se ha modificado"           M
chkno "v3 · dry-run: no creó REGISTRY" "x" test -f "$MIG/docs/implementation/REGISTRY.json"
M --apply > /dev/null 2>&1
chk "v3 · --apply crea REGISTRY"       "\"PT\": 21"                      cat "$MIG/docs/implementation/REGISTRY.json"
chkno "v3 · --apply movió Fases"       "x" test -d "$MIG/PTSA/Fases"

mk_v40
chk "4.0.x detectada"                  "Versión detectada: 4.0.1"        M
chk "4.0.x · pide grafo"               "REGISTRY.graph"                  M
chk "4.0.x · pide «Estructural:»"      "Estructural"                     M
M --apply > /dev/null 2>&1
chk "4.0.x · sella suite_version"      "4.0.1"                           cat "$MIG/docs/implementation/REGISTRY.json"
chk "4.0.x · PT en vuelo conservado"   "PT-007"                          cat "$MIG/docs/implementation/REGISTRY.json"

rm -rf "$MIG"


# PT-012 · el tramo 4.12 -> 6.x, que NO EXISTIA. Un proyecto en 4.12 recibia un informe de dos
# lineas y todo lo demas vivia en PROSA dentro del CHANGELOG de dos versiones atras. Se DETECTA,
# no se recita: un tramo que imprima siempre nueve pasos de los que te aplican dos ensena a no
# leerlo.
mk_v412() {  # 4.12: registro moderno, sin bloque ESTADO, sin fase y sin plataforma
  rm -rf "$MIG"; mkdir -p "$MIG"/docs/implementation "$MIG"/docs/methodology/tools
  cd "$MIG"
  cat > docs/implementation/REGISTRY.json <<'J'
{ "suite_version":"4.12.0","execution_mode":"SUPERVISED",
  "counters":{"PT":9,"EP":1,"QA":0,"QR":0,"QD":0,"H":0,"E":0,"P":0,"R":0,"INC":0},
  "allocations":[{"id":"PT-009","type":"BUG","severity":"S2","slug":"x","created":"2026-08-01","status":"IN_PROGRESS","suite_version":"4.12.0"}] }
J
  printf '# HANDOFF

Prosa, sin bloque de estado.
' > docs/implementation/HANDOFF.md
  printf '## PT-009 — BUG: x
Estado: DONE
Estructural: no
' > docs/implementation/HISTORY.log
  cp "$SUITE"/tools/*.mjs docs/methodology/tools/
  cp "$SUITE"/CHANGELOG.md docs/methodology/ 2>/dev/null || true
}

reg_mig() {   # $1 · cabecera del REGISTRY del fixture de migracion, sin tocar lo demas
  cat > "$MIG/docs/implementation/REGISTRY.json" <<J
{ $1,"execution_mode":"SUPERVISED",
  "counters":{"PT":9,"EP":1,"QA":0,"QR":0,"QD":0,"H":0,"E":0,"P":0,"R":0,"INC":0},
  "allocations":[{"id":"PT-009","type":"BUG","severity":"S2","slug":"x","created":"2026-08-01","status":"IN_PROGRESS","suite_version":"4.12.0"}] }
J
}

mk_v412
chk "4.12 ⇒ pide el bloque ESTADO"        "SUITE-R33"     M
chk "4.12 ⇒ pide declarar la fase"        "PT-009"        M
chk "4.12 ⇒ ofrece la plataforma"         "OPCIONAL"      M
chk "4.12 ⇒ enumera lo que llega"         "revisar-secretos"  M
chk "4.12 ⇒ menciona las excepciones"     "SECRETOS-EXCEPCIONES"  M

# Los inversos: lo que YA esta no se pide, y un proyecto en 6.x no ve el tramo.
mk_v412 && printf '# HANDOFF

<!-- ESTADO -->
implementación: ninguna
<!-- /ESTADO -->
' > "$MIG/docs/implementation/HANDOFF.md"
chkno "con ESTADO ya escrito, no lo pide"  "SUITE-R33"    M

mk_v412 && reg_mig '"suite_version":"6.0.1"'
chkno "ya en 6.x, el tramo no aparece"     "SUITE-R33"    M

# Con plataforma declarada cambia lo que se pide: aparecen el espejo y las dos reglas nuevas.
mk_v412 && reg_mig '"suite_version":"4.12.0","tracker":{"plataforma":"github"}'
chk   "con plataforma ⇒ pide sincronizar"  "abrir --aplicar"  M
chk   "con plataforma ⇒ avisa de R42"      "SUITE-R42"        M
# El inverso correcto NO es «no menciona SUITE-R42»: sin plataforma sí se menciona, dentro del
# mensaje que explica que activaria declararla. Lo que no debe aparecer es la EXIGENCIA. El
# aserto estaba mal escrito y lo dijo el propio caso.
mk_v412
chkno "sin plataforma ⇒ no exige el PR"    "G4 pasa a resolverse"  M

# PT-043 · SUITE-R55 — las decisiones humanas se CONDUCEN, no se enumeran. Instalar acompana en
# nueve fases conversacionales; migrar dejaba una lista y se iba, y migra quien NO eligio este
# marco: lo heredo, y la lista esta escrita en el vocabulario que todavia no conoce.
#
# Las dos comprobaciones de abajo se MIDEN sobre la salida real, no se buscan como literal: un
# `chk` de una frase concreta pasa aunque las otras ocho filas esten rotas. Los dos defectos que
# corrigio esta tarea —una fila sin motivo y tres titulares partidos a media palabra— habrian
# pasado por debajo de cualquier aserto de literal, y de hecho pasaron.
sin_motivo()     { M 2>&1 | grep -c 'No se reconoce el motivo' || true; }
codigo_migrate() { M >/dev/null 2>&1; echo $?; }
# El invariante NO es de longitud —contar caracteres sobre UTF-8 mide bytes y miente—: un titular
# que no se marca con «…» tiene que ser el texto COMPLETO de su accion, o su primera frase
# completa. El texto completo esta impreso arriba, bajo «REQUIERE UNA PERSONA», asi que la
# comprobacion es exacta y no depende de dónde se decidiera cortar.
parte_palabra() {
  M 2>&1 | awk '
    /^  ! / { full[substr($0, 5)] = 1; next }
    /^  [0-9]+\/[0-9]+ · / {
      t = $0; sub(/^  [0-9]+\/[0-9]+ · /, "", t);
      if (t ~ /…$/) next;
      ok = 0; for (f in full) if (f == t || index(f, t ". ") == 1) ok = 1;
      if (!ok) bad++;
    }
    END { print bad + 0 }'
}

mk_v412
chk   "migrar CONDUCE, no enumera"          "1/"                     M
chk   "el bloque se presenta por lo que es" "por que es tuyo"        M
chk   "cada decision dice por que es tuya"  "La maquina ve los archivos"  M
chk   "ninguna cae en el RULE-06 por defecto"  "^0$"                 sin_motivo
chk   "ningun titular parte una palabra"    "^0$"                    parte_palabra
chk   "el modo restringido se EXPLICA"      "No es un castigo"       M
chk   "y dice cual es, con su regla"        "SUITE-R17"              M
chk   "y el codigo de salida sigue siendo 1" "^1$"                   codigo_migrate
# El RULE-06 sigue existiendo: hoy no lo dispara ninguna accion emitida —todas se reconocen— y
# por eso se comprueba en el FUENTE. Se declara en el self-review: es la unica rama del conductor
# sin caso de ejecucion, y una rama que no puede fallar tampoco puede probarse.
chk   "el «no lo se» sigue en el codigo"    "No se reconoce el motivo"  cat "$SUITE/tools/migrate.mjs"

# La conduccion no es solo del tramo 4.12: los saltos desde 3.x y 4.0.x emiten OTRAS acciones, y
# cada una tiene que decir por que es tuya. Medirlo solo en 4.12 dejaba fuera a la mitad.
mk_v3
chk   "v3 tambien se conduce, sin huecos"   "^0$"                    sin_motivo
chk   "v3 sin titulares partidos"           "^0$"                    parte_palabra
mk_v40
chk   "4.0.x tambien se conduce, sin huecos" "^0$"                   sin_motivo
mk_v412 && reg_mig '"suite_version":"4.12.0","tracker":{"plataforma":"github"}'
chk   "con plataforma tambien se conduce"   "^0$"                    sin_motivo

# SUITE-R17 no se relaja: la lista queda EN EL REGISTRO, que es quien la hace cumplir despues.
mk_v412
M --apply > /dev/null 2>&1 || true
chk   "SUITE-R17 no se relaja: queda en el registro" "migration_pending"  cat "$MIG/docs/implementation/REGISTRY.json"

# Y el inverso: sin nada pendiente NO hay conductor. Recitar lo que no aplica ensena a no leerlo.
mk_v412 && reg_mig "\"suite_version\":\"$VIGENTE\""
printf '# HANDOFF\n\n<!-- ESTADO -->\nimplementación: ninguna\n<!-- /ESTADO -->\n' > "$MIG/docs/implementation/HANDOFF.md"
touch "$MIG/docs/methodology/CORE.md" "$MIG/docs/methodology/CORE-PTSA.md"
chkno "sin pendientes no hay conductor"     "por que es tuyo"        M

# La regla y sus citas. Sin regla esto es un texto en una salida que la siguiente edicion quita
# sin que nada lo note — que es como se perdio la mitad de lo que EP-011 esta recuperando.
chk   "SUITE-R55 existe en RULES"           "SUITE-R55"   cat "$SUITE/RULES.md"
chk   "y llega al nucleo"                   "SUITE-R55"   cat "$SUITE/CORE.md"
chk   "PHASES la cita"                      "SUITE-R55"   cat "$SUITE/PHASES.md"
chk   "FDGE-Prompts la cita"                "SUITE-R55"   cat "$SUITE/FDGE-Prompts.md"

rm -rf "$MIG"

# ─── E · integridad de la reconciliación y la migración verificada ──────────
echo "── E · reconciliación y migración verificada ──"
build_fixture
chk "sin baseline ⇒ avisa de RECONCILE"  "FND-R15"    V PT-001
build_fixture
printf '# 00 Baseline

## Inventario documental
Totales: 3

## Divergencias
ninguna

## Confianza de partida
Alta
' > "$WORK/docs/enterprise-documentation/00-Baseline.md"
chk "baseline completa ⇒ pasa"           "✓ FND-R13"  V PT-001
build_fixture
printf '# 00 Baseline

## Inventario documental
Totales: 3
' > "$WORK/docs/enterprise-documentation/00-Baseline.md"
chk "baseline incompleta ⇒ falla"        "✗ FND-R13"  V PT-001
build_fixture
printf '## 2026-08-01
docs/x.md → ARCHIVE
' > "$WORK/docs/implementation/RECONCILIATION.log"
chk "log sin baseline ⇒ falla"           "✗ FND-R13"  V PT-001
build_fixture
printf '# 01 PRD
' > "$WORK/docs/enterprise-documentation/01-PRD.md"
chk "numeración de FIDE v3 detectada"    "FND-R03"    V PT-001

mk_v40
M --apply > /tmp/mig.out 2>&1 || true
chk "migración encadena verify-fdge"     "verify-fdge --all"  cat /tmp/mig.out

# ─── F · instalación completa ────────────────────────────────────────────────
echo "── F · instalación ──"
build_fixture
rm -f "$WORK/docs/methodology/CORE.md"
chk "proyecto sin CORE.md ⇒ falla"        "SUITE-R15"   V --all
mk_v40
rm -f "$WORK/docs/methodology/CORE-PTSA.md"
M --apply > /tmp/mig2.out 2>&1 || true
chk "migración exige el overlay PTSA"    "SUITE-R25"   cat /tmp/mig2.out
build_fixture
chk "con CORE.md y fuentes ⇒ pasa"        "✓ SUITE-R15" V --all
build_fixture
rm -f "$WORK/docs/methodology/PHASES.md"
chk "CORE.md sin sus fuentes ⇒ falla"     "SUITE-R16"   V --all
build_fixture
perl -0pi -e 's/GENERADO por tools/EDITADO A MANO por/' "$WORK/docs/methodology/CORE.md"
chk "CORE.md editado a mano ⇒ falla"      "SUITE-R16"   V --all

# ─── G · robustez y seguridad ───────────────────────────────────────────────
echo "── G · robustez y seguridad ──"
build_fixture; reg_set "r.allocations='no-array'"
chk "allocations no-array sin crash"     "no es un array"    V --all
build_fixture; echo 'null' > "$WORK/docs/implementation/REGISTRY.json"
chk "REGISTRY null ⇒ mensaje correcto"   "no contiene un objeto" V --all
build_fixture; reg_set "r.counters='x'"
chk "counters no-objeto sin crash"       "no es un objeto"   V --all
build_fixture
echo '{"authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abcdefghijklmnop"}' > "$WORK/docs/implementation/evidence/PT-001/api/ok.json"
chk "JWT en la evidencia ⇒ falla"        "FDGE-R45"          V PT-001
build_fixture
echo '{"password":"hunter2secret"}' > "$WORK/docs/implementation/evidence/PT-001/api/ok.json"
chk "password en evidencia ⇒ falla"      "FDGE-R45"          V PT-001
build_fixture
chk "evidencia limpia ⇒ pasa"            "✓ FDGE-R45"        V PT-001
printf "  " ; cd /tmp && rm -rf bcx && mkdir bcx && cd bcx
if node "$SUITE/tools/build-core.mjs" . 2>&1 | grep -q 'Falta la fuente'; then pass "build-core sin fuentes ⇒ mensaje claro"; else bad "build-core sin fuentes"; fi
cd "$WORK" 2>/dev/null || true

# ─── H · lotes ───────────────────────────────────────────────────────────────
echo "── H · lotes ──"
mk_epic() {
  mkdir -p "$WORK/changes/EP-001-validacion"
  cat > "$WORK/changes/EP-001-validacion/intake.md" <<'M'
---
id: EP-001
---
## 1. Objetivo común
Toda la validación de formularios.

## 2. Criterio de éxito del lote
Ningún formulario acepta datos inválidos sin mensaje.

## 3. Qué NO entra en el lote
OUT: rediseño visual

## 4. Firma única
Solicitado por: Ada Lovelace
He leído el Intake de cada PT y confirmo que todos reflejan mi intención: SÍ

## 5. PTs
PT-001

## 6. Análisis de solapamiento
Pares que comparten archivos: ninguno
M
}
build_fixture; mk_epic
chk "lote sin «Firmado por lote» ⇒ falla" "INTAKE-R08"  V --all
build_fixture; mk_epic
perl -0pi -e 's/reflejan mi intención: SÍ/reflejan mi intención: SÍ
Firmado por lote: EP-001/' "$WORK/changes/PT-001-login/intake.md"
chk "lote bien formado ⇒ pasa"            "✓ INTAKE-R09" V --all
build_fixture; mk_epic
perl -0pi -e 's/## 6. Análisis de solapamiento.*//s' "$WORK/changes/EP-001-validacion/intake.md"
chk "lote sin solapamiento ⇒ falla"       "INTAKE-R09"  V --all


# PT-011 · los miembros de un lote se leen de las FILAS DE TABLA, no de todo el texto.
#
# Con el barrido completo, citar un PT anterior como precedente —«el metodo que ya funciono en
# PT-003»— lo convertia en miembro y disparaba un fallo sobre un PT cerrado. El coste no era el
# error: obligaba a escribir los intakes de lote SIN referencias cruzadas, que es justo lo que
# da trazabilidad. La correccion venia del proyecto legado (commit 760f790), y el CHANGELOG de
# la 4.13.0 la declaraba TRAIDA cuando el codigo nunca la llevo.
mk_epic_tabla() {
  mkdir -p "$WORK/changes/EP-001-validacion"
  cat > "$WORK/changes/EP-001-validacion/intake.md" <<'M'
---
id: EP-001
---
## 1. Objetivo común
Toda la validación de formularios.

## 2. Criterio de éxito del lote
Ningún formulario acepta datos inválidos sin mensaje.

## 3. Qué NO entra en el lote
OUT: rediseño visual

## 4. Firma única
Solicitado por: Ada Lovelace
He leído el Intake de cada PT y confirmo que todos reflejan mi intención: SÍ

## 5. PTs
| Orden | PT | Tipo |
|:--|:--|:--|
| 1 | PT-001 | BUG |

Se reutiliza el método que ya funcionó en PT-003, y se evita el error que PT-002 cometió.

## 6. Análisis de solapamiento
Pares que comparten archivos: ninguno
M
}

build_fixture; mk_epic_tabla
chkno "citar un PT en prosa no lo hace miembro"  "PT-003: pertenece"  V --all
chkno "ni siquiera al de al lado"                "PT-002: pertenece"  V --all
chk   "el de la tabla sí exige su firma"         "PT-001: pertenece"  V --all
build_fixture; mk_epic
chk   "sin tabla, respaldo al barrido completo"  "PT-001: pertenece"  V --all
# Se filtra en vez de volcar el CHANGELOG entero: el detector de «la herramienta revento» busca
# rastros de excepcion, y el CHANGELOG NARRA excepciones pasadas —«ReferenceError en cada
# ejecucion»— asi que volcarlo entero se acusaba a si mismo de haber reventado.
chk   "el CHANGELOG dice dónde estaba"           "PT-011"  grep -h "PT-011" "$SUITE/CHANGELOG.md"

# ─── I · auditoría PTSA por enumeración ──────────────────────────────────────
echo "── I · PTSA por enumeración ──"
VP() { node "$WORK/docs/methodology/tools/verify-ptsa.mjs" "$WORK"; }

mk_ptsa() {
  mkdir -p "$WORK/PTSA/Products" "$WORK/PTSA/Findings"
  printf -- '---\nestado: FINAL\n---\n# P-001\n' > "$WORK/PTSA/Products/P-001-checkout.md"
  printf 'auditoria_estado: COMPLETE\nHealth 95 · coverage 1.00 · freshness 0d\n' > "$WORK/PTSA/RESUMEN.md"
  cat > "$WORK/PTSA/COVERAGE.md" <<'M'
# Cobertura

coverage = 1.00

| Elemento | D1 | D2 | D3 | D4 |
|---|---|---|---|---|
| P-001 | PASS | PASS | PASS | PASS |
M
}

build_fixture; mk_ptsa
chk  "matriz completa ⇒ pasa"              "✓ PTSA-R77" VP
build_fixture; mk_ptsa
perl -0pi -e 's/\| P-001 \| PASS \| PASS \| PASS \| PASS \|/| P-001 | PASS |  | PASS | PASS |/' "$WORK/PTSA/COVERAGE.md"
chk  "celda en blanco ⇒ falla"             "✗ PTSA-R77" VP
build_fixture; mk_ptsa
rm "$WORK/PTSA/COVERAGE.md"
chk  "sin COVERAGE.md ⇒ falla"             "✗ PTSA-R77" VP
build_fixture; mk_ptsa
perl -0pi -e 's/\| PASS \| PASS \| PASS \| PASS \|/| PASS | PASS | PASS | NO_EVALUADA |/' "$WORK/PTSA/COVERAGE.md"
chk  "coverage inflado ⇒ falla"            "✗ PTSA-R78" VP
build_fixture; mk_ptsa
printf -- '---\nestado: DRAFT\n---\n# P-002\n' > "$WORK/PTSA/Products/P-002-pagos.md"
chk  "producto en DRAFT al cerrar ⇒ falla" "✗ PTSA-R37" VP
build_fixture; mk_ptsa
printf -- '---\ntipo: BUG\nestado: CLOSED\n---\n# H-001\n' > "$WORK/PTSA/Findings/H-001-x.md"
chk  "BUG cerrado sin humano ⇒ falla"      "✗ PTSA-R44" VP
build_fixture; mk_ptsa
perl -0pi -e 's/coverage 1\.00 · //' "$WORK/PTSA/RESUMEN.md"
chk  "score sin cobertura ⇒ falla"         "✗ PTSA-R21" VP
build_fixture; mk_ptsa
cp "$SUITE/PTSA/templates/COVERAGE.md" "$WORK/PTSA/COVERAGE.md"
chk  "plantilla sin completar ⇒ falla"     "✗ PTSA-R77" VP
build_fixture
chkno "proyecto sin PTSA/ ⇒ no rompe"      "✗"          VP
build_fixture; mkdir -p "$WORK/PTSA"
chkno "PTSA/ sin auditoría ⇒ no rompe"     "✗"          VP
build_fixture
perl -0pi -e 's/<!-- fuentes: PTSA[^>]*-->/<!-- fuentes: PTSA\/x.md:000000000000 -->/' "$WORK/docs/methodology/CORE-PTSA.md"
chk  "overlay PTSA obsoleto ⇒ falla"       "CORE-PTSA.md está DESINCRONIZADO" node "$WORK/docs/methodology/tools/build-core.mjs" --check "$WORK/docs/methodology"

# ─── K · integridad del núcleo, firmas e irreversibles ───────────────────────
echo "── K · integridad y firmas ──"
BC() { node "$WORK/docs/methodology/tools/build-core.mjs" --check "$WORK/docs/methodology"; }

build_fixture
perl -0pi -e 's/\*\*H\*\*/**S**/' "$WORK/docs/methodology/CORE.md"
chk   "CORE.md retocado en su cuerpo ⇒ falla"  "EDITADO A MANO"  BC
build_fixture
perl -0pi -e 's/`PTSA-R17`/`PTSA-R17` DEROGADA./' "$WORK/docs/methodology/CORE-PTSA.md"
chk   "overlay retocado ⇒ falla"               "EDITADO A MANO"  BC
build_fixture
printf 'password = SuperSecreta123
' >> "$WORK/changes/PT-001-login/intake.md"
chk   "secreto en el intake ⇒ falla"           "✗ FDGE-R45"  V PT-001
build_fixture
printf '| PT-050 | BUG | INTEGRATED | merge |
' >> "$WORK/docs/implementation/HISTORY.log"
chk   "integración sin nombre humano ⇒ falla"  "✗ SUITE-R06" V --all
build_fixture
reg_set "r.execution_mode='AUTONOMOUS'"
chk   "AUTONOMOUS sin lote ⇒ falla"            "✗ SUITE-R06" V --all
build_fixture
printf 'firmantes:
  - Nombre Apellido
' > "$WORK/CLAUDE.md"
chk   "firmantes sin personalizar ⇒ falla"     "✗ SUITE-R27" V --all
build_fixture
printf 'firmantes:
  - Ada Lovelace
' > "$WORK/CLAUDE.md"
printf '| PT-050 | BUG | INTEGRATED | integrado por: Impostor |
' >> "$WORK/docs/implementation/HISTORY.log"
chk   "firma ajena a la lista ⇒ falla"         "✗ SUITE-R27" V --all
build_fixture
chkno "sin CLAUDE.md ⇒ aviso, no crash"        "✗ SUITE-R27" V --all

# ─── J · QA y FPGE ───────────────────────────────────────────────────────────
echo "── J · QA y FPGE ──"
VQ() { node "$WORK/docs/methodology/tools/verify-qa.mjs" "$WORK"; }

mk_qa() {
  mkdir -p "$WORK/QA/cases" "$WORK/QA/reports/QR-001" "$WORK/qa/tests"
  mkdir -p "$WORK/QA/cases/evidence" && : > "$WORK/QA/cases/evidence/a.png"
  printf 'tipo: HP
resultado: PASS
Verifica AC-01
![paso](evidence/a.png)
' > "$WORK/QA/cases/QA-001-login.md"
  printf 'QA-A
' > "$WORK/QA/QA-LOG.md"
  printf 'await expect(page.getByRole("button")).toBeVisible();
' > "$WORK/qa/tests/QA-001-login.spec.ts"
  perl -0pi -e 's/"QR":0/"QR":1/' "$WORK/docs/implementation/REGISTRY.json" 2>/dev/null || true
}

build_fixture; mk_qa
chkno "ciclo QA correcto ⇒ pasa"           "✗ QA-"      VQ
build_fixture; mk_qa
perl -0pi -e 's/resultado: PASS/resultado: casi/' "$WORK/QA/cases/QA-001-login.md"
chk   "veredicto ambiguo ⇒ falla"          "✗ QA-R04"   VQ
build_fixture; mk_qa
perl -0pi -e 's/resultado: PASS/resultado: FAIL/' "$WORK/QA/cases/QA-001-login.md"
chk   "FAIL sin QD ⇒ falla"                "✗ QA-R06"   VQ
chk   "HP en fallo no es QA-A ⇒ falla"     "✗ QA-R09"   VQ
build_fixture; mk_qa
perl -0pi -e 's/!\[paso\]\(evidence\/a.png\)//' "$WORK/QA/cases/QA-001-login.md"
chk   "caso sin captura ⇒ falla"           "✗ QA-R03"   VQ
build_fixture; mk_qa
perl -0pi -e 's/Verifica AC-01//' "$WORK/QA/cases/QA-001-login.md"
chk   "caso sin AC-nn ⇒ falla"             "✗ QA-R19"   VQ
build_fixture; mk_qa
printf 'await page.waitForTimeout(3000);
' > "$WORK/qa/tests/QA-002-x.spec.ts"
chk   "espera fija ⇒ falla"                "✗ QA-R16"   VQ
build_fixture; mk_qa
printf '# ROADMAP
freshness: FRESH

| R-001 | FEATURE | prioridad 8 | sin origen |
' > "$WORK/docs/implementation/ROADMAP.md"
chk   "candidato sin evidencia ⇒ falla"    "✗ FPGE-R01" VQ
build_fixture; mk_qa
printf '# ROADMAP

| R-001 | FEATURE | prioridad 8 | evidencia H-001 |
' > "$WORK/docs/implementation/ROADMAP.md"
chk   "roadmap sin frescura ⇒ falla"       "✗ FPGE-R05" VQ
build_fixture; mk_qa
printf 'QA-F
' > "$WORK/QA/QA-LOG.md"
printf '# ROADMAP
freshness: FRESH

| R-001 | FEATURE | prioridad 8 | evidencia H-001 |
' > "$WORK/docs/implementation/ROADMAP.md"
chk   "QA-F con FEATURE libre ⇒ falla"     "✗ FPGE-R07" VQ
build_fixture
chkno "sin QA/ ni ROADMAP ⇒ no rompe"      "✗"          VQ

# ─── L · falsificación y ataques a los verificadores ─────────────────────────
echo "── L · falsificación ──"
BC2() { node "$WORK/docs/methodology/tools/build-core.mjs" --check "$WORK/docs/methodology"; }

# El sello de cuerpo protege del descuido; quien lo recalcula solo cae con la REGENERACIÓN.
# El forjador va en un archivo propio: meter regex por la línea de órdenes pierde los escapes.
build_fixture
cat > "$WORK/forjar.mjs" <<'FORJA'
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
const p = process.argv[2];
const t = readFileSync(p, 'utf8');
const c = t.split(/\r?\n/).filter((l) => !/^<!-- cuerpo: [0-9a-f]{12} -->$/.test(l)).join('|');
const h = createHash('sha1').update(c).digest('hex').slice(0, 12);
writeFileSync(p, t.replace(/<!-- cuerpo: [0-9a-f]{12} -->/, '<!-- cuerpo: ' + h + ' -->'));
FORJA
perl -0pi -e 's/\*\*H\*\*/**S**/' "$WORK/docs/methodology/CORE.md"
node "$WORK/forjar.mjs" "$WORK/docs/methodology/CORE.md"
chk   "sello recalculado a mano ⇒ falla"     "NO coincide con lo que generan" BC2

# QA: la palabra «captura» no es una captura.
build_fixture; mk_qa
printf 'tipo: HP
resultado: PASS
AC-01
Nota: no se pudo tomar captura
' > "$WORK/QA/cases/QA-001-login.md"
chk   "«no hay captura» no cuenta ⇒ falla"   "✗ QA-R03"   VQ
build_fixture; mk_qa
rm -f "$WORK/QA/cases/evidence/a.png"
chk   "captura inexistente ⇒ falla"          "✗ QA-R03"   VQ
build_fixture; mk_qa
printf 'tipo: HP
resultado: FAIL
AC-01
![p](evidence/a.png)
QD-999
' > "$WORK/QA/cases/QA-001-login.md"
chk   "QD sin libro de defectos ⇒ falla"     "✗ QA-R06"   VQ
build_fixture; mk_qa
printf 'tipo: HP
resultado: PASS
## Real
resultado: FAIL
AC-01
![p](evidence/a.png)
' > "$WORK/QA/cases/QA-001-login.md"
chk   "dos veredictos distintos ⇒ falla"     "✗ QA-R04"   VQ

# PTSA: agrupar productos, y esconder la matriz en un bloque de código.
build_fixture; mk_ptsa
printf -- '---
estado: FINAL
---
' > "$WORK/PTSA/Products/P-002-pagos.md"
printf 'coverage = 1.00
| E | D1 | D2 | D3 | D4 |
|---|---|---|---|---|
| P-001 y P-002 | PASS | PASS | PASS | PASS |
' > "$WORK/PTSA/COVERAGE.md"
chk   "fila que agrupa productos ⇒ falla"    "✗ PTSA-R77" VP
build_fixture; mk_ptsa
printf 'coverage = 1.00\n```\n| P-001 | PASS | PASS | PASS | PASS |\n```\n' > "$WORK/PTSA/COVERAGE.md"
chk   "matriz dentro de una valla ⇒ falla"   "✗ PTSA-R77" VP
build_fixture; mk_ptsa
printf 'coverage = 0.98
| E | D1 | D2 | D3 | D4 |
|---|---|---|---|---|
| P-001 | PASS | PASS | PASS | PASS |
' > "$WORK/PTSA/COVERAGE.md"
chk   "coverage inflado 2 puntos ⇒ falla"    "✗ PTSA-R78" VP

# Migración a medias: sellar la versión no puede levantar el modo restringido.
mk_v40
M --apply > /dev/null 2>&1 || true
chk   "migración a medias sigue restringida" "✗ SUITE-R17" V --all

# El auditor prometia «sintaxis valida» y no la comprobaba, y el arnes daba por buena una
# herramienta reventada. Los dos fallos son de los que nadie va a buscar: la promesa existe.
cp "$SUITE/tools/verify-qa.mjs" /tmp/mth-vq.bak
printf 'const x = (;' >> "$SUITE/tools/verify-qa.mjs"
chk   "herramienta que no compila ⇒ falla"   "no compila"  node "$SUITE/tools/audit.mjs" "$SUITE"
cp /tmp/mth-vq.bak "$SUITE/tools/verify-qa.mjs" && rm -f /tmp/mth-vq.bak
chk   "auditor en verde tras restaurar"      "sin huecos"  node "$SUITE/tools/audit.mjs" "$SUITE"

# ─── M · terreno de la raíz ──────────────────────────────────────────────────
echo "── M · terreno ──"
PL() { node "$WORK/docs/methodology/tools/plan-layout.mjs" "$WORK"; }

# El caso que dio origen a la regla: repo git anidado con el codigo dentro, raiz fuera de el.
build_fixture
mkdir -p "$WORK/proyecto-real/.git" "$WORK/proyecto-real/app"
for i in 1 2 3 4 5 6; do echo "export const x=$i;" > "$WORK/proyecto-real/app/f$i.ts"; done
chk   "repo anidado ⇒ se propone mover"     "proyecto-real/"   PL
chk   "raíz sin git ⇒ se avisa"             "no es un repositorio git"  PL
chk   "repo anidado ⇒ verify-fdge falla"    "✗ FND-R19"        V --all
build_fixture
printf "uno
" > "$WORK/a.md"; printf "dos
" > "$WORK/b.md"; printf "tres
" > "$WORK/c.md"
chk   "documentos sueltos ⇒ docs/business/" "docs/business/"   PL
build_fixture
node "$WORK/docs/methodology/tools/plan-layout.mjs" "$WORK" --write > /dev/null 2>&1 || true
chk   "LAYOUT sin firmar ⇒ no se abre nada" "✗ FND-R23"        V --all
build_fixture
node "$WORK/docs/methodology/tools/plan-layout.mjs" "$WORK" --write > /dev/null 2>&1 || true
perl -0pi -e 's/Revisado por:.*
/Revisado por: Ada Lovelace
/; s/quiero: SÍ \| NO.*
/quiero: SÍ
/' "$WORK/docs/implementation/LAYOUT.md"
chkno "LAYOUT firmado ⇒ deja trabajar"      "✗ FND-R23"        V --all
build_fixture
node "$WORK/docs/methodology/tools/plan-layout.mjs" "$WORK" --write > /dev/null 2>&1 || true
perl -0pi -e 's/Revisado por:.*
/Revisado por: Ada Lovelace
/; s/quiero: SÍ \| NO.*
/quiero: SÍ
/' "$WORK/docs/implementation/LAYOUT.md"
chk   "LAYOUT firmado no se sobrescribe"    "ya está FIRMADO"  node "$WORK/docs/methodology/tools/plan-layout.mjs" "$WORK" --write
build_fixture
node "$WORK/docs/methodology/tools/plan-layout.mjs" "$WORK" --write > /dev/null 2>&1 || true
perl -0pi -e 's/Revisado por:.*
/Revisado por: Ada Lovelace
/; s/quiero: SÍ \| NO.*
/quiero: SÍ
/' "$WORK/docs/implementation/LAYOUT.md"
printf "El plan de terreno refleja la estructura que quiero: NO
" >> "$WORK/docs/implementation/LAYOUT.md"
chk   "dos veredictos en LAYOUT ⇒ falla"    "✗ FND-R22"        V --all
# El verificador debe reconocer la plantilla que la propia suite reparte, comentarios incluidos.
build_fixture
printf 'firmantes:                # quien firma
  - Ada Lovelace        # responsable
' > "$WORK/CLAUDE.md"
chk   "firmantes con comentario ⇒ se lee"   "✓ SUITE-R27"      V --all

# La instalacion conversacional: el terreno incluye las dependencias y el punto de entrada
# tiene que existir en el paquete instalable.
build_fixture
chk   "el terreno reporta dependencias"      "graphifyy"        PL
chk   "INSTALL.md viaja en el paquete"       "INSTALL SUITE"    cat "$SUITE/INSTALL.md"
chk   "el procedimiento llega a CORE.md"     "I0 TERRENO"       cat "$SUITE/CORE.md"

# Fase A · las cuatro correcciones que vivian solo en un proyecto, y la quinta que aparecio
# al traerlas: las firmas de LAYOUT no se contrastaban contra firmantes:.
build_fixture
printf "firmantes:
  - Ada Lovelace
" > "$WORK/CLAUDE.md"
printf 'Solicitado por:
Fecha: 2026-08-06
' > "$WORK/changes/PT-001-login/intake.md"
chkno "campo vacio no captura «Fecha:»"      "firma «Fecha:»"   V --all
build_fixture
printf "firmantes:
  - Ada Lovelace
" > "$WORK/CLAUDE.md"
printf 'Declaración de Valor
Firmada por:
Fecha: 2026-08-06
' >> "$WORK/CLAUDE.md"
chk   "Valor sin firmar no pasa por firmada" "✗ FND-R24"        V --all
build_fixture
node "$WORK/docs/methodology/tools/plan-layout.mjs" "$WORK" --write > /dev/null 2>&1 || true
perl -0pi -e 's/Revisado por:.*
/Revisado por: Impostor
/' "$WORK/docs/implementation/LAYOUT.md"
printf "firmantes:
  - Ada Lovelace
" > "$WORK/CLAUDE.md"
chk   "firma de LAYOUT contrastada"          "✗ SUITE-R27"      V --all
build_fixture
cp -r "$SUITE" "$WORK/canonica" && rm -rf "$WORK/canonica/FIDE"
chk   "brownfield sin FIDE ⇒ sin enlaces rotos" "Sin errores"   node "$SUITE/tools/verify-suite.mjs" "$WORK/canonica"
chk   "comparar-marco mide la divergencia"   "DIFIEREN\|idénticas\|Ausentes"  node "$SUITE/tools/comparar-marco.mjs" "$SUITE"

# El nucleo tiene que ser el MISMO con LF y con CRLF. El sello hasheaba bytes crudos y el
# corte de la cabecera de PHASES usaba un literal con 
: en Windows el nucleo se llevaba esa
# cabecera y en Linux no, asi que el CI acusaba de desincronizado un nucleo intacto.
LFDIR="$WORK/../suite-lf"
rm -rf "$LFDIR" && cp -r "$SUITE" "$LFDIR"
find "$LFDIR" -type f \( -name "*.md" -o -name "*.mjs" -o -name "*.sh" \) -exec perl -pi -e 's/
/
/' {} +
chk   "el núcleo es el mismo con LF"          "CORE.md sincronizado"  node "$LFDIR/tools/build-core.mjs" --check "$LFDIR"
chk   "el overlay es el mismo con LF"         "CORE-PTSA.md sincronizado"  node "$LFDIR/tools/build-core.mjs" --check "$LFDIR"
rm -rf "$LFDIR"

# Caso de la primera instalacion real: repositorio que existe y no versiona nada.
build_fixture
git -C "$WORK" init -q 2>/dev/null || true
printf '*
' > "$WORK/.gitignore"
chk   "repo que no versiona nada ⇒ falla"    "no versiona ningún archivo"  V --all

# FND-R25..R28: los criterios estan en la herramienta, no en la opinion del agente.
build_fixture
mkdir -p "$WORK/proyecto/src"
printf "{}
" > "$WORK/proyecto/package.json"
for i in 1 2 3 4 5; do echo "export const x=$i;" > "$WORK/proyecto/src/f$i.ts"; done
chk   "carpeta con package.json ⇒ a la RAÍZ"  "subir su contenido a la RAÍZ"  PL
build_fixture
mkdir -p "$WORK/codigo"
for i in 1 2 3 4 5; do echo "export const x=$i;" > "$WORK/codigo/f$i.ts"; done
chk   "carpeta sin marcas ⇒ a src/"          "mover a src/"     PL
build_fixture
mkdir -p "$WORK/repo/.git" "$WORK/repo/src"
for i in 1 2 3 4 5; do echo "export const x=$i;" > "$WORK/repo/src/f$i.ts"; done
chk   "historia sin commits ⇒ descartarla"   "descartarla"      PL
build_fixture
printf "*
" > "$WORK/.gitignore"
chk   "gitignore que ignora todo ⇒ propone"  "FND-R27"          PL
build_fixture
mkdir -p "$WORK/src/__tests__"
echo "export const a=1;" > "$WORK/src/real.ts"
echo "test(1)" > "$WORK/src/__tests__/x.test.ts"
chkno "las pruebas no entran en el grafo"    "__tests__"        PL
build_fixture
cp "$SUITE/Suite-CLAUDE-Template.md" "$WORK/CLAUDE.md"
rm -f "$WORK/docs/enterprise-documentation/02-PRD.md"   # Foundation aún no se ejecutó
chk   "la Declaración de Valor espera a Foundation" "pendiente de Foundation"  V --all
printf "# 02 PRD
" > "$WORK/docs/enterprise-documentation/02-PRD.md"
chk   "con Foundation hecha, PENDIENTE ⇒ falla"     "✗ FND-R24"  V --all

# SUITE-R30: LAYOUT guarda las decisiones, INSTALL.log guarda los hechos.
build_fixture
node "$WORK/docs/methodology/tools/plan-layout.mjs" "$WORK" --write > /dev/null 2>&1 || true
chk   "LAYOUT sin INSTALL.log ⇒ falla"       "✗ SUITE-R30"  V --all
build_fixture
node "$WORK/docs/methodology/tools/plan-layout.mjs" "$WORK" --write > /dev/null 2>&1 || true
perl -0pi -e 's/^\| (\d+) \| (.+?) \| \| \|$/| $1 | $2 | ACEPTADO | /gm' "$WORK/docs/implementation/LAYOUT.md"
printf "# INSTALL.log
" > "$WORK/docs/implementation/INSTALL.log"
chk   "INSTALL.log sin entradas ⇒ falla"     "no contiene ninguna entrada"  V --all
build_fixture
node "$WORK/docs/methodology/tools/plan-layout.mjs" "$WORK" --write > /dev/null 2>&1 || true
perl -0pi -e 's/^\| (\d+) \| (.+?) \| \| \|$/| $1 | $2 | ACEPTADO | /gm' "$WORK/docs/implementation/LAYOUT.md"
printf "## 2026-08-06 · [INSTALL SUITE] · 5.2.0
Ejecutado por: Ada Lovelace

I2  MOVER      [L1] 15 archivos .md  ·  raiz a docs/business/     OK
I3  CREAR      estructura y ledgers                              OK
" > "$WORK/docs/implementation/INSTALL.log"
chkno "INSTALL.log con entradas ⇒ pasa"      "✗ SUITE-R30"  V --all
build_fixture
node "$WORK/docs/methodology/tools/plan-layout.mjs" "$WORK" --write > /dev/null 2>&1 || true
perl -0pi -e 's/^\| (\d+) \| (.+?) \| \| \|$/| $1 | $2 | ACEPTADO | /gm' "$WORK/docs/implementation/LAYOUT.md"
printf '# INSTALL.log

I2  MOVER      cosas  ·  de aqui a alla                       OK
' > "$WORK/docs/implementation/INSTALL.log"
chk   "decisión sin etiqueta [Ln] ⇒ falla"    "ninguna entrada de INSTALL.log la reclama"  V --all
build_fixture
node "$WORK/docs/methodology/tools/plan-layout.mjs" "$WORK" --write > /dev/null 2>&1 || true
perl -0pi -e 's/^\| (\d+) \| (.+?) \| \| \|$/| $1 | $2 | ACEPTADO | /gm' "$WORK/docs/implementation/LAYOUT.md"
printf '# INSTALL.log

I2  MOVER      [L99] algo que nadie aprobo                    OK
' > "$WORK/docs/implementation/INSTALL.log"
chk   "etiqueta sin decisión ⇒ falla"         "que nadie aprobó"  V --all

# ─── N · la implementación como unidad abierta ───────────────────────────────
echo "── N · implementación abierta ──"

# FDGE-R48 · dos abiertas dejan sin respuesta a «esto es lo mismo».
build_fixture
reg_set "r.allocations.push({id:'EP-001',type:'EP',status:'IN_PROGRESS',slug:'a'},{id:'EP-002',type:'EP',status:'IN_PROGRESS',slug:'b'})"
chk   "dos implementaciones abiertas ⇒ falla"  "✗ FDGE-R48"  V --all
build_fixture
reg_set "r.allocations.push({id:'EP-001',type:'EP',status:'IN_PROGRESS',slug:'a'});r.allocations.forEach(x=>{if(x.type!=='EP')x.epic='EP-001'})"
chk   "una sola abierta ⇒ pasa"                "✓ FDGE-R48"  V --all

# FDGE-R49 · el default invertido: con una abierta, todo PT vivo le pertenece.
build_fixture
reg_set "r.allocations.push({id:'EP-001',type:'EP',status:'IN_PROGRESS',slug:'a'});r.allocations.filter(x=>x.id==='PT-001').forEach(x=>{x.status='IN_PROGRESS';delete x.epic})"
chk   "PT vivo sin epic ⇒ falla"               "✗ FDGE-R49"  V --all
build_fixture
reg_set "r.allocations.push({id:'EP-001',type:'EP',status:'IN_PROGRESS',slug:'a'});r.allocations.forEach(x=>{if(x.type!=='EP')x.epic='EP-001'})"
chk   "PT vivo con su epic ⇒ pasa"             "✓ FDGE-R49"  V --all
build_fixture
reg_set "r.allocations.push({id:'EP-001',type:'EP',status:'IN_PROGRESS',slug:'a'});r.allocations.forEach(x=>{if(x.type!=='EP'){x.track='HOTFIX';delete x.epic}})"
chk   "HOTFIX exento del default"              "✓ FDGE-R49"  V --all

# FDGE-R51 · el intake ligero hereda del lote, pero no sus criterios de aceptación.
build_fixture
perl -0pi -e 's/^severity:.*
//m; s/VEREDICTO: PASS/(sin veredicto propio)/' "$WORK/changes/PT-001-login/intake.md"
perl -0pi -e 's/reflejan mi intención: SÍ/reflejan mi intención: SÍ
Firmado por lote: EP-001/' "$WORK/changes/PT-001-login/intake.md"
chk   "intake ligero ⇒ hereda del lote"        "✓ FDGE-R51"  V PT-001
chkno "intake ligero ⇒ no exige severidad"     "✗ FDGE-R04"  V PT-001
chkno "intake ligero ⇒ no exige veredicto"     "✗ FDGE-R03"  V PT-001
build_fixture
perl -0pi -e 's/AC-0/XX-0/g' "$WORK/changes/PT-001-login/intake.md"
perl -0pi -e 's/reflejan mi intención: SÍ/reflejan mi intención: SÍ
Firmado por lote: EP-001/' "$WORK/changes/PT-001-login/intake.md"
chk   "ligero sin criterios ⇒ falla"           "✗ FDGE-R51"  V PT-001

# La plantilla ligera viaja en el paquete y NO pide firma propia.
chk   "TAREA.md en el paquete"                 "Firmado por lote"  cat "$SUITE/INTAKE/templates/TAREA.md"
chkno "TAREA.md no pide firma propia"          "Solicitado por"    cat "$SUITE/INTAKE/templates/TAREA.md"

# ─── O · continuidad: el bloque ESTADO y su frescura ─────────────────────────
echo "── O · continuidad ──"

build_fixture
printf '# HANDOFF

Solo prosa: cuenta lo que se hizo y no dice qué sigue.
' > "$WORK/docs/implementation/HANDOFF.md"
chk   "HANDOFF sin bloque ESTADO ⇒ falla"     "✗ SUITE-R33"  V --all
build_fixture
printf '<!-- ESTADO -->
implementación: ninguna abierta
tarea:          ninguna
compuerta:      ninguna
siguiente:      abrir la primera implementación
decisiones:     ninguna viva
no hacer:       nada pendiente
actualizado:    2026-08-12
<!-- /ESTADO -->
' > "$WORK/docs/implementation/HANDOFF.md"
chk   "bloque ESTADO completo ⇒ pasa"         "✓ SUITE-R33"  V --all
build_fixture
printf '<!-- ESTADO -->
implementación: ninguna abierta
tarea:          ninguna
compuerta:      ninguna
decisiones:     ninguna viva
no hacer:       nada pendiente
actualizado:    2026-08-12
<!-- /ESTADO -->
' > "$WORK/docs/implementation/HANDOFF.md"
chk   "falta «siguiente» ⇒ falla"             "✗ SUITE-R33"  V --all
build_fixture
printf '<!-- ESTADO -->
implementación: ninguna abierta
tarea:          ninguna
compuerta:      ninguna
siguiente:
decisiones:     ninguna viva
no hacer:       nada pendiente
actualizado:    2026-08-12
<!-- /ESTADO -->
' > "$WORK/docs/implementation/HANDOFF.md"
chk   "«siguiente» en blanco ⇒ falla"         "✗ SUITE-R33"  V --all

# La frescura se mide contra git: trabajo posterior al estado ⇒ el estado está viejo.
build_fixture
printf '<!-- ESTADO -->
implementación: ninguna abierta
tarea:          ninguna
compuerta:      ninguna
siguiente:      abrir la primera implementación
decisiones:     ninguna viva
no hacer:       nada pendiente
actualizado:    2026-08-12
<!-- /ESTADO -->
' > "$WORK/docs/implementation/HANDOFF.md"
git -C "$WORK" init -q 2>/dev/null; printf "*.tmp
" > "$WORK/.gitignore"
git -C "$WORK" add -A >/dev/null 2>&1
git -C "$WORK" -c user.name=t -c user.email=t@t commit -q -m "estado y trabajo a la vez" >/dev/null 2>&1
chkno "estado y trabajo a la vez ⇒ pasa"      "✗ SUITE-R34"  V --all
printf "
nota posterior
" >> "$WORK/changes/PT-001-login/intake.md"
git -C "$WORK" add -A >/dev/null 2>&1
# Un segundo de separación: git sella en segundos y los dos commits caían en el mismo.
sleep 1
git -C "$WORK" -c user.name=t -c user.email=t@t commit -q -m "trabajo despues del estado" >/dev/null 2>&1
chk   "trabajo posterior al estado ⇒ falla"   "✗ SUITE-R34"  V --all

# ─── P · el espejo con la plataforma ─────────────────────────────────────────
echo "── P · plataforma ──"
TR() { node "$WORK/docs/methodology/tools/tracker.mjs" "$@" "$WORK"; }

# Sin plataforma declarada no se exige nada: el repositorio sigue siendo válido solo.
build_fixture
chk   "sin plataforma ⇒ lo dice y no falla"   "no declara plataforma"  TR espejo
build_fixture
reg_set "r.tracker={plataforma:'inventada'}"
chk   "plataforma desconocida ⇒ lo dice"      "Plataforma desconocida"  TR espejo
build_fixture
reg_set "r.tracker={plataforma:'azure'}"
chkno "azure declara el contrato, no miente"  "Sin divergencias"  TR espejo

# El contrato tiene que viajar en el paquete, no en la cabeza de nadie.
# El caso pedia «milestone» en PHASES. Se sustituye, no se relaja: afirmaba un contrato que
# RULES.md nunca tuvo, y PT-006 lo retiro. Un aserto que exige el defecto lo perpetua.
chk   "el contrato está en PHASES"            "pull request"    cat "$SUITE/PHASES.md"
chk   "y cita la regla que lo manda"          "SUITE-R42"       cat "$SUITE/PHASES.md"
chk   "el issue no copia el intake"           "no lo copia"     cat "$SUITE/tools/tracker.mjs"

# PT-001 · la LÓGICA del espejo se prueba sin plataforma.
#
# El plan original usaba un `gh` de mentira en el PATH. No funciona: en Windows node resuelve
# el gh.exe real, y ningun caso de este arnes puede exigir gh AUTENTICADO porque el arnes corre
# en CI, donde un PR desde un fork no recibe credenciales — seria el rojo permanente que
# SUITE-R35 existe para evitar. Por eso el adaptador (habla gh) se separa de la comparacion
# (funcion pura), y aqui se prueba la segunda. La conversacion real con GitHub se verifica por
# ejecucion contra el repositorio y queda en evidence/, declarado en test-scenarios.md.
trlib() { # $1 nombre · $2 patron esperado · $3 cuerpo JS que recibe el modulo como `m`
  # La ruta va por ENTORNO, no como argumento: pasarla en argv[1] es exactamente lo que el
  # guard de tracker entiende por «me estan ejecutando directamente», y el arnes se enganaba
  # solo — importaba el modulo y ejecutaba la herramienta.
  local out
  out="$(MTH_TRACKER="$SUITE/tools/tracker.mjs" node -e "const {pathToFileURL}=require(\"url\");
import(pathToFileURL(process.env.MTH_TRACKER).href).then((m)=>{ $3 }).catch((e)=>console.log(\"IMPORT_FALLA \"+e.message));" 2>&1)"
  if revento "$out"; then bad "$1  (la herramienta reventó: no verifica nada)"; return; fi
  if printf '%s' "$out" | grep -q -- "$2"; then pass "$1"; else bad "$1  (no apareció: $2 · salió: $out)"; fi
}

V1='{id:"PT-100",status:"IN_PROGRESS"}'
V2='{id:"PT-101",status:"DRAFT",issue:7}'
I7='{number:7,title:"PT-101 x"}'
I9='{number:9,title:"suelto"}'

# --- PT-014 . el cuerpo del lote, en una pasada ---------------------------
# La dependencia va en un sentido: el lote cita a sus tareas por NUMERO, la tarea al lote por
# ID. Creando en el orden del registro el lote nacia sin los numeros y habia que repetir.
TANDA='[{"id":"EP-9","type":"EP"},{"id":"PT-90","type":"BUG","epic":"EP-9"},{"id":"PT-91","type":"BUG","epic":"EP-9"}]'
trlib "el lote se crea el ultimo"           "PT-90,PT-91,EP-9"   "console.log(m.ordenDeApertura($TANDA).map((a)=>a.id).join(\",\"))"
trlib "y no se pierde ni se duplica"        "^3$"   "console.log(m.ordenDeApertura($TANDA).length)"
trlib "entre tareas, el orden del registro" "PT-90,PT-91"   "console.log(m.ordenDeApertura($TANDA).filter((a)=>a.type!==\"EP\").map((a)=>a.id).join(\",\"))"
trlib "no muta la lista que recibe"         "EP-9,PT-90,PT-91"   "const t=$TANDA; m.ordenDeApertura(t); console.log(t.map((a)=>a.id).join(\",\"))"
trlib "sin nada que abrir, no revienta"     "^0$"   "console.log(m.ordenDeApertura(undefined).length)"
# Y la razon de todo: con ese orden el cuerpo del lote SI enumera numeros.
trlib "el cuerpo del lote ya trae numero"   "#77"   "console.log(m.cuerpoDeIssue({id:\"EP-9\",type:\"EP\",slug:\"x\"},{tareas:[{id:\"PT-90\",issue:77,title:\"t\"}]}))"


# PT-024 . SUITE-R46 — el tablero no se adelanta a la rama por defecto.
# Cerre nueve issues desde `trabajo` antes de que INTEGRATED llegara a main, y la CI de main
# saco nueve divergencias SUITE-R35. No era un despiste: el apunte DONE->INTEGRATED se escribe
# DESPUES de mergear, asi que solo llega a la principal en el merge SIGUIENTE — la CI de main
# fallaria tras CADA merge.
M1='[{"id":"PT-050","status":"DONE"}]'
M2='[{"id":"PT-050","status":"INTEGRATED"}]'
MUERTA='[{"id":"PT-050","issue":50,"status":"INTEGRATED"}]'
trlib "si la principal aun la ve viva, no se cierra"  "^0$"   "console.log(m.cerrablesSinAdelantarse($MUERTA,$M1).cerrables.length)"
trlib "y se nombra cual va adelantada"                "PT-050"   "console.log(m.cerrablesSinAdelantarse($MUERTA,$M1).adelantadas.map((a)=>a.id).join(\",\"))"
trlib "con el estado que la principal declara"        "DONE"   "console.log(m.cerrablesSinAdelantarse($MUERTA,$M1).adelantadas[0].statusEnPrincipal)"
trlib "si la principal ya lo sabe, se cierra"         "^1$"   "console.log(m.cerrablesSinAdelantarse($MUERTA,$M2).cerrables.length)"
# Una allocation que nacio en esta rama no contradice nada de lo que la principal afirma.
trlib "lo que la principal no conoce, se cierra"      "^1$"   "console.log(m.cerrablesSinAdelantarse($MUERTA,[]).cerrables.length)"
# No saber NO es permiso: sin registro de la principal no se cierra nada y se dice por que.
trlib "sin poder leer la principal, no evaluable"     "false"   "console.log(m.cerrablesSinAdelantarse($MUERTA,null).evaluable)"
trlib "y en ese caso no se cierra nada"               "^0$"   "console.log(m.cerrablesSinAdelantarse($MUERTA,null).cerrables.length)"
# El espejo tiene que nombrar esta causa, no solo el sintoma.
trlib "el espejo distingue el cierre adelantado"      "SUITE-R46"   "console.log(JSON.stringify(m.compararEspejo([{id:'PT-050',status:'DONE',issue:50}],[])))"


# PT-026 . SUITE-R47 — el espejo bloquea donde el registro ASIGNA e informa donde es una foto.
# Tras arreglar PT-024 la CI de main volvio a fallar, ahora por etiquetas: main tiene el registro
# del momento del merge y el tablero sigue avanzando. Comparar una foto con algo vivo diverge
# SIEMPRE — no es una ventana de tiempo, es estructural, y produce un rojo permanente que nadie
# puede arreglar desde esa rama.
V50='{"id":"PT-050","status":"DONE","issue":50,"phase":9}'
I50='{"number":50,"title":"x","labels":[{"name":"fase: 8"}]}'
trlib "la divergencia se detecta igual"        "SUITE-R35"   "console.log(JSON.stringify(m.compararEspejo([$V50],[$I50])))"
trlib "y dice que etiqueta sobra o falta"      "fase: 9"   "console.log(JSON.stringify(m.compararEspejo([$V50],[$I50])))"
# La logica de comparacion NO cambia con la rama: lo que cambia es si bloquea. Se separa a
# proposito — un detector que dependiera de la rama seria dos detectores divergiendo (SUITE-R38).
trlib "sin divergencia no inventa ninguna"     "^\[\]$"   "console.log(JSON.stringify(m.compararEspejo([{id:'PT-050',status:'DONE',issue:50,phase:8}],[$I50])))"
chk   "SUITE-R47 existe en RULES"              "SUITE-R47"   cat "$SUITE/RULES.md"
chk   "SUITE-R47 llega al núcleo"              "SUITE-R47"   cat "$SUITE/CORE.md"
chk   "y PHASES dice donde bloquea"            "SUITE-R47"   cat "$SUITE/PHASES.md"
chk   "el tracker distingue la rama"           "esRamaPorDefecto" cat "$SUITE/tools/tracker.mjs"
chk   "ante la duda, bloquea"                  "equivocarse hacia" cat "$SUITE/tools/tracker.mjs"


# PT-028 . un cierre PENDIENTE no es un huerfano. Ejecutando el orden que SUITE-R46 acababa de
# fijar —apuntar el estado terminal, mergear, cerrar— el espejo denuncio nueve issues como
# «trabajo que el registro no conoce». Dos reglas mias chocando: G4 no podia pasar bajo el orden
# que G4 exige.
INT='{"id":"PT-060","status":"INTEGRATED","issue":60}'
I60='{"number":60,"title":"x","labels":[]}'
trlib "un issue de allocation terminal no es huerfano" "cierre pendiente"   "console.log(JSON.stringify(m.compararEspejo([],[$I60],[$INT])))"
trlib "y se marca para no bloquear"                    "pendienteDeCierre"   "console.log(JSON.stringify(m.compararEspejo([],[$I60],[$INT])))"
trlib "el mensaje dice cuando cerrarlo"                "SUITE-R46"   "console.log(JSON.stringify(m.compararEspejo([],[$I60],[$INT])))"
# Lo que NO se relaja: un issue que nadie reclama sigue siendo trabajo fuera del registro.
trlib "el huerfano de verdad sigue siendolo"           "ninguna allocation lo reclama"   "console.log(JSON.stringify(m.compararEspejo([],[$I60],[])))"
trlib "y ese si bloquea"                               "false"   "console.log(!!m.compararEspejo([],[$I60],[])[0].pendienteDeCierre)"


# PT-030 . SUITE-R48 — que sigue lo dice el TABLERO, no la memoria del agente.
# En una sola sesion di un merge por terminado sin mirar la compuerta que corre despues, cerre
# issues en un orden que ninguna regla decia, y declare un cambio de especificacion que no hice.
# Cuatro veces decidi «que sigue» sin preguntarselo a nada.
A4='{"id":"PT-070","status":"IN_PROGRESS","phase":4,"issue":70}'
A1='{"id":"PT-071","status":"READY","phase":1,"issue":71}'
SIN='{"id":"PT-072","status":"IN_PROGRESS","issue":72}'
FIN='{"id":"PT-073","status":"INTEGRATED","phase":10,"issue":73}'
trlib "deriva que produce la fase"           "design.md"   "console.log(JSON.stringify(m.queSigue($A4)))"
trlib "y con que se cierra"                  "G2"   "console.log(m.queSigue($A4).compuerta)"
trlib "nombra tambien la fase siguiente"     "PHASE 5"   "console.log(m.queSigue($A4).siguiente)"
trlib "la compuerta se DERIVA de la fase"    "G1"   "console.log(m.queSigue($A1).compuerta)"
# Un comentario humano sin responder BLOQUEA la respuesta: preguntar que sigue sin haber leido
# la respuesta anterior es el defecto que la regla existe para impedir.
trlib "un comentario sin responder bloquea"  "SUITE-R43"   "console.log(JSON.stringify(m.queSigue($A4,{comentarioPendiente:true}).bloqueos))"
trlib "y lo dice antes que nada"             "RESUELVE PRIMERO"   "console.log(m.queSigue($A4,{comentarioPendiente:true}).siguiente)"
# Sin fase declarada NO SE ADIVINA (RULE-06).
trlib "sin phase declarada, sin evaluar"     "SIN EVALUAR"   "console.log(m.queSigue($SIN).siguiente)"
trlib "lo terminado no tiene siguiente"      "evidencia, no estado"   "console.log(m.queSigue($FIN).siguiente)"
trlib "sin allocation no hay trabajo"        "SUITE-R08"   "console.log(m.queSigue(null).error)"
# La tabla de fases del tracker es la forma consultable de PHASES.md: once fases, 0 a 10.
trlib "las once fases estan declaradas"      "^11$"   "console.log(Object.keys(m.FASES).length)"
trlib "y G4 sigue siendo humana"             "HUMANA"   "console.log(m.FASES[9].cierra)"
chk   "SUITE-R48 existe en RULES"            "SUITE-R48"   cat "$SUITE/RULES.md"
chk   "SUITE-R48 llega al núcleo"            "SUITE-R48"   cat "$SUITE/CORE.md"
chk   "y PHASES manda consultarlo"           "tracker.mjs siguiente" cat "$SUITE/PHASES.md"


# PT-031 . EXEC-R08 — los tres modos exigen LO MISMO. Un modo cambia QUIEN resuelve una
# compuerta, nunca QUE se exige. La matriz declaraba la firma por lote como ventaja de
# AUTONOMOUS cuando INTAKE-R08 vale en los tres: una ventaja aparente de un modo es una vara de
# medir mas floja esperando a que alguien la elija sin decirlo.
chk   "EXEC-R08 existe en su documento"     "EXEC-R08"   cat "$SUITE/EXECUTION-MODES.md"
chk   "y llega al núcleo"                   "EXEC-R08"   cat "$SUITE/CORE.md"
chk   "G4 humana en los tres modos"         "G4 es humana en los tres modos" cat "$SUITE/EXECUTION-MODES.md"
chkno "la matriz ya no da ventajas por modo" "firma por lote, \`INTAKE-R08\`" cat "$SUITE/EXECUTION-MODES.md"
chk   "verify-suite lo comprueba"           "EXEC-R08"   cat "$SUITE/tools/verify-suite.mjs"
chk   "y con vocabulario cerrado, no prosa" "RE_ARTEFACTO" cat "$SUITE/tools/verify-suite.mjs"


# PT-033 . SUITE-R49 — la convencion de arranque. SUITE-R48 dejo la respuesta consultable y un
# comando NO PUEDE EXIGIR HABER SIDO LLAMADO. Esto pone la consulta ANTES que las reglas en lo
# unico que el agente carga, y define «consultado» en un solo sitio para que PT-034 lo CITE.
chk   "SUITE-R49 existe en RULES"            "SUITE-R49"   cat "$SUITE/RULES.md"
chk   "y llega al núcleo"                    "SUITE-R49"   cat "$SUITE/CORE.md"
chk   "el núcleo abre con la consulta"       "LO PRIMERO"  cat "$SUITE/CORE.md"
chk   "y dice el comando exacto"             "tracker.mjs siguiente" cat "$SUITE/CORE.md"
chk   "«consultado» esta definido"           "vale para"   cat "$SUITE/RULES.md"
chk   "caduca en un turno"                   "un turno"    cat "$SUITE/CORE.md"
chk   "sin poder consultar, SIN EVALUAR"     "SIN EVALUAR" cat "$SUITE/CORE.md"
chk   "PHASES manda citar, no copiar"        "se CITA, no se copia" cat "$SUITE/PHASES.md"
# La convencion va ANTES que las reglas: si quedara detras, se lee cuando ya se decidio.
_lp=$(grep -n 'LO PRIMERO' "$SUITE/CORE.md" | head -1 | cut -d: -f1)
_fa=$(grep -n '^## Fases' "$SUITE/CORE.md" | head -1 | cut -d: -f1)
chk   "la consulta va antes que las fases"   "^ORDENADO$" sh -c "[ \"$_lp\" -lt \"$_fa\" ] && echo ORDENADO || echo INVERTIDO"


# PT-034 . SUITE-R50 — el punto de ENTRADA es el tablero. SUITE-R48 dejo la respuesta
# consultable y SUITE-R49 la puso lo primero en CORE.md, pero las dos dependen de que el agente
# pregunte. Esto no: no existe el paso que saltarse.
chk   "SUITE-R50 existe en RULES"            "SUITE-R50"   cat "$SUITE/RULES.md"
chk   "y llega al núcleo"                    "SUITE-R50"   cat "$SUITE/CORE.md"
chk   "cauce start existe"                   "start()"     cat "$RAIZ/bin/cauce.mjs"
chk   "y sale en la ayuda como primero"      "EMPIEZA AQUÍ" cat "$RAIZ/bin/cauce.mjs"
chk   "el arranque llama al tablero"         "siguiente"   cat "$RAIZ/bin/cauce.mjs"
chk   "y cita la definicion, no la copia"    "SUITE-R49"   cat "$RAIZ/bin/cauce.mjs"
chk   "sin plataforma lo DECLARA"            "SIN EVALUAR" cat "$RAIZ/bin/cauce.mjs"
chk   "PHASES declara el arranque"           "SUITE-R50"   cat "$SUITE/PHASES.md"
# Lo que NO puede pasar: que el arranque automatice una compuerta o sustituya al nucleo.
chkno "el arranque no resuelve compuertas"   "gate\|--aplicar" sh -c "sed -n '/  start() {/,/^  },/p' \"$RAIZ/bin/cauce.mjs\""
chk   "y el nucleo sigue siendo obligatorio" "SUITE-R15"   cat "$RAIZ/bin/cauce.mjs"


# PT-035 . una tarea es SUB-ISSUE de su lote, no un enlace en su cuerpo. La jerarquia ya existe
# en el registro y la plataforma la contaba en PROSA: dos representaciones del mismo hecho.
J='[{"id":"EP-90","type":"EP","issue":90},{"id":"PT-91","epic":"EP-90","issue":91},{"id":"PT-92","epic":"EP-90","issue":92}]'
trlib "calcula los anidamientos que faltan"   "^2$"   "console.log(m.anidamientosQueFaltan($J,{90:[]}).length)"
trlib "y no repite el que ya esta"            "^1$"   "console.log(m.anidamientosQueFaltan($J,{90:[91]}).length)"
trlib "nombra hijo y padre"                   "91"   "console.log(JSON.stringify(m.anidamientosQueFaltan($J,{90:[]})[0]))"
# Si la plataforma no sabe responder, NO SE AFIRMA que falte: «no se» no es «no hay» (RULE-06).
trlib "sin saber, no se afirma que falte"     "^0$"   "console.log(m.anidamientosQueFaltan($J,{90:null}).length)"
trlib "una tarea sin lote no se anida"        "^0$"   "console.log(m.anidamientosQueFaltan([{id:\"PT-93\",issue:93}],{}).length)"
chk   "SUITE-R51 existe en RULES"             "SUITE-R51"   cat "$SUITE/RULES.md"
chk   "y llega al núcleo"                     "SUITE-R51"   cat "$SUITE/CORE.md"
# PT-036 . el enlace apunta a donde el contenido ESTA. Un issue se abre al EMPEZAR el trabajo, y
# entonces su contenido solo existe en la rama de trabajo: apuntar a la principal daba 404 en el
# momento en que mas se lee. Lo dijo quien lo intento abrir, no un caso.
trlib "lo vivo enlaza la rama de trabajo"     "tree/trabajo/"   "console.log(m.cuerpoDeIssue({id:'PT-94',slug:'x',status:'IN_PROGRESS'},{url:'https://h/r',rama:'main',ramaTrabajo:'trabajo'}))"
trlib "lo integrado enlaza la principal"      "tree/main/"   "console.log(m.cuerpoDeIssue({id:'PT-95',slug:'x',status:'INTEGRATED'},{url:'https://h/r',rama:'main',ramaTrabajo:'trabajo'}))"
trlib "sin saber la rama, cae en la principal" "tree/main/"   "console.log(m.cuerpoDeIssue({id:'PT-96',slug:'x',status:'IN_PROGRESS'},{url:'https://h/r',rama:'main'}))"
trlib "y el cuerpo dice donde esta"           "donde el contenido existe ahora"   "console.log(m.cuerpoDeIssue({id:'PT-97',slug:'x',status:'IN_PROGRESS'},{url:'https://h/r',rama:'main',ramaTrabajo:'trabajo'}))"
chk   "abrir tiene UN solo final"             "cerrarPasada" cat "$SUITE/tools/tracker.mjs"


# PT-037 / PT-038 . el catalogo y el manual. Un marco con 177 reglas y sin manual no lo puede
# usar nadie que no haya estado presente mientras se escribia. El catalogo va primero: escribir
# sin la lista produce un manual que cubre lo que se le ocurrio a quien lo escribio.
chk   "el catálogo existe"                   "CASOS DE USO"  cat "$SUITE/CASOS-DE-USO.md"
chk   "el manual existe"                     "MANUAL"        cat "$SUITE/MANUAL.md"
chk   "el catálogo declara sus huecos"       "Huecos declarados" cat "$SUITE/CASOS-DE-USO.md"
chk   "y cubre el proyecto legado"           "proyecto legado"   cat "$SUITE/CASOS-DE-USO.md"
chk   "y el arranque de sesion"              "cauce start"       cat "$SUITE/CASOS-DE-USO.md"
chk   "y los tres modos"                     "AUTONOMOUS"        cat "$SUITE/CASOS-DE-USO.md"
chk   "el manual manda empezar preguntando"  "cauce start"   cat "$SUITE/MANUAL.md"
chk   "y dice que G4 es tuya"                "G4"            cat "$SUITE/MANUAL.md"
chk   "el manual enlaza al catálogo"         "CASOS-DE-USO.md" cat "$SUITE/MANUAL.md"
# SUITE-R21 / LEX-R22 · el manual CITA reglas, no las define: ninguna severidad aqui.
chkno "el manual no define severidades"      "| HARD |"      cat "$SUITE/MANUAL.md"
chkno "el catálogo tampoco"                  "| HARD |"      cat "$SUITE/CASOS-DE-USO.md"


# PT-039 . SUITE-R52 — peticion o conversacion. Sin esta distincion cada mensaje es una orden
# potencial: se convierte una duda en trabajo (gasta compuertas, ensucia el tablero) o se trata
# una orden como charla (pierde el trabajo). Se DECLARA, no se acierta en silencio.
chk   "SUITE-R52 existe en RULES"            "SUITE-R52"    cat "$SUITE/RULES.md"
chk   "y llega al núcleo"                    "SUITE-R52"    cat "$SUITE/CORE.md"
chk   "el núcleo abre preguntando qué es"    "ANTES DE NADA" cat "$SUITE/CORE.md"
chk   "define peticion por su cierre"        "condición de terminado" cat "$SUITE/CORE.md"
chk   "y dice que se DECLARA"                "en silencio"  cat "$SUITE/CORE.md"
chk   "una conversacion no abre allocation"  "No una allocation" cat "$SUITE/CORE.md"
chk   "PHASES lo declara"                    "SUITE-R52"    cat "$SUITE/PHASES.md"
# Va ANTES que consultar el tablero: preguntar «que sigue» ante una conversacion ya es tratarla
# como trabajo.
_qe=$(grep -n 'ANTES DE NADA' "$SUITE/CORE.md" | head -1 | cut -d: -f1)
_lp=$(grep -n 'LO PRIMERO' "$SUITE/CORE.md" | head -1 | cut -d: -f1)
chk   "y va antes de consultar el tablero"   "^ORDENADO$" sh -c "[ \"$_qe\" -lt \"$_lp\" ] && echo ORDENADO || echo INVERTIDO"
# PT-039 . y el defecto que aparecio al USAR la herramienta: `siguiente EP-NNN` tomaba el
# identificador del lote como RUTA del proyecto. Solo se excluia PT-NNN.
chk   "un EP-NNN no es una ruta"             "(?:PT|EP)-" cat "$SUITE/tools/tracker.mjs"


# PT-040 / PT-041 . SUITE-R53 — la regla se alcanza desde el fallo, y lo que puede fallar se
# DERIVA. El manual decia «de las diez ideas se deduce la regla que no has leido»: una excusa.
# Y su tabla de fallos estaba escrita DE MEMORIA — es derivable de los fail() del codigo.
RG="$SUITE/tools/regla.mjs"
chk   "regla.mjs existe"                     "regla"        cat "$RG"
chk   "SUITE-R53 existe en RULES"            "SUITE-R53"    cat "$SUITE/RULES.md"
chk   "y llega al núcleo"                    "SUITE-R53"    cat "$SUITE/CORE.md"
chk   "una regla responde qué exige"         "definida en"  node "$RG" SUITE-R44 "$SUITE"
chk   "y quién la comprueba"                 "la comprueba" node "$RG" SUITE-R44 "$SUITE"
chk   "una regla que no existe lo DICE"      "No está definida" node "$RG" SUITE-R999 "$SUITE"
chk   "los fallos se DERIVAN del código"     "derivadas del código" node "$RG" --fallos "$SUITE"
chk   "y son mas de cincuenta"               "[0-9][0-9] reglas, derivadas" node "$RG" --fallos "$SUITE"
chk   "las no comprobadas se declaran"       "no lo dirán con su nombre" node "$RG" --sin-comprobar "$SUITE"
# La derivacion NO es una lista escrita: si se añade un fail(), aparece solo. Se comprueba que
# lee del codigo y no de un documento.
chkno "no hay lista escrita de fallos"       "fallosPosibles = \[" cat "$RG"
chk   "un ID de regla no es una ruta"        "RE_ID"        cat "$RAIZ/bin/cauce.mjs"


# PT-042 . SUITE-R54 — el agente lee su manual. Instalar copiaba archivos que nadie leia: asi se
# llego a tener 179 reglas y ningun manual. No obliga a leerlo —no se puede— pero no se arranca
# sin que se ponga delante.
chk   "SUITE-R54 existe en RULES"            "SUITE-R54"     cat "$SUITE/RULES.md"
chk   "y llega al núcleo"                    "SUITE-R54"     cat "$SUITE/CORE.md"
chk   "instalar remite al manual"            "MANUAL.md"     cat "$RAIZ/bin/cauce.mjs"
chk   "y el arranque lo pone antes"          "Se lee ENTERO" cat "$RAIZ/bin/cauce.mjs"
chk   "sin manual lo DICE"                   "No hay MANUAL.md" cat "$RAIZ/bin/cauce.mjs"
chk   "y el marco sigue siendo usable"       "CORE.md es lo unico" cat "$RAIZ/bin/cauce.mjs"
chk   "PHASES declara el manual"             "SUITE-R54"     cat "$SUITE/PHASES.md"
# El manual va ANTES que el nucleo en el arranque: conocer las reglas no es saber usarlas.
# El manual va antes que el nucleo en el bloque de `start`. Se comprueba sobre el FUENTE del
# bloque —no ejecutando el binario contra un fixture, que arrastra el estado de otro proyecto.
_blq=$(sed -n '/  start() {/,/^  },/p' "$RAIZ/bin/cauce.mjs")
_mn=$(printf '%s' "$_blq" | grep -n 'MANUAL.md' | head -1 | cut -d: -f1)
_co=$(printf '%s' "$_blq" | grep -n 'CORE.md' | tail -1 | cut -d: -f1)
chk   "el manual va antes que el núcleo"     "^ORDENADO$" sh -c "[ -n \"$_mn\" ] && [ -n \"$_co\" ] && [ \"$_mn\" -lt \"$_co\" ] && echo ORDENADO || echo REVISAR"

trlib "viva sin issue ⇒ divergencia"   "PT-100" \
  "console.log(JSON.stringify(m.compararEspejo([$V1],[])))"
trlib "issue huérfano ⇒ divergencia"   "#9" \
  "console.log(JSON.stringify(m.compararEspejo([],[$I9])))"
trlib "issue muerto ⇒ divergencia"     "PT-101" \
  "console.log(JSON.stringify(m.compararEspejo([$V2],[])))"
trlib "espejo exacto ⇒ sin divergencia" "SIN_DIVERGENCIAS" \
  "console.log(m.compararEspejo([$V2],[$I7]).length?\"HAY\":\"SIN_DIVERGENCIAS\")"
trlib "lo cerrado no se espeja"        "SIN_DIVERGENCIAS" \
  "console.log(m.compararEspejo(m.vivasDe([{id:\"PT-102\",status:\"INTEGRATED\"}]),[]).length?\"HAY\":\"SIN_DIVERGENCIAS\")"
trlib "etiquetas que faltan"           "tarea" \
  "console.log(JSON.stringify(m.etiquetasQueFaltan([\"bug\"])))"

# El contrato de salida: 2 y 3 son decisiones OPUESTAS y estaban fundidas en 2.
# 2 = el proyecto eligio no declarar plataforma. 3 = la declaro y no hay acceso (FND-R30).
#
# La sonda de acceso se INYECTA en vez de manipular el PATH: quitar `gh` del PATH de forma
# portable entre Windows y Ubuntu no es fiable —se probo y node siguio resolviendo el gh real—
# y ademas dejaria a node fuera del PATH. Inyectarla prueba exactamente la misma decision.
trlib "sin plataforma ⇒ código 2"      "^2$" \
  "console.log(m.decidirSalida({}, ()=>true).codigo)"
trlib "plataforma desconocida ⇒ 2"     "^2$" \
  "console.log(m.decidirSalida({tracker:{plataforma:\"inventada\"}}, ()=>true).codigo)"
trlib "declarada y sin acceso ⇒ 3"     "^3$" \
  "console.log(m.decidirSalida({tracker:{plataforma:\"github\"}}, ()=>false).codigo)"
trlib "sin acceso dice cómo entrar"    "gh auth login" \
  "console.log(m.decidirSalida({tracker:{plataforma:\"github\"}}, ()=>false).mensaje)"
trlib "declarada y con acceso ⇒ 0"     "^0$" \
  "console.log(m.decidirSalida({tracker:{plataforma:\"github\"}}, ()=>true).codigo)"

# FDGE-R52 · sin plataforma declarada, el reanclaje sigue siendo bitacora.md. Es la garantía
# para todo proyecto que no espeja: este PT no puede cambiarle el comportamiento a nadie.
build_fixture
printf 'Termina cuando: algo observable\n' >> "$WORK/changes/PT-001-login/intake.md"
reg_set "r.allocations.filter(x=>x.id==='PT-001').forEach(x=>{x.phase=4})"
rm -f "$WORK/changes/PT-001-login/bitacora.md"
chk   "sin plataforma ⇒ exige bitácora"      "✗ FDGE-R52"  V PT-001
printf '2026-08-12 · PHASE 1 → 2\ncierro: a\n\n2026-08-12 · PHASE 2 → 3\ncierro: b\n\n2026-08-12 · PHASE 3 → 4\ncierro: c\n' > "$WORK/changes/PT-001-login/bitacora.md"
chk   "sin plataforma ⇒ bitácora al día"     "✓ FDGE-R52"  V PT-001

# Sin plataforma, G4 no se bloquea por el espejo: la garantía de los proyectos que no espejan.
# Si este caso se pone rojo, el cambio ha alcanzado a proyectos que no debia tocar.
build_fixture
chkno "sin plataforma ⇒ G4 libre del espejo" "SUITE-R35"  V --gate G4 PT-001

# ─── Q · la compuerta de secretos ────────────────────────────────────────────
echo "── Q · secretos ──"
SEC() { node "$SUITE/tools/revisar-secretos.mjs" "$@"; }

build_fixture
chk   "árbol limpio ⇒ sin hallazgos"          "Sin hallazgos"   SEC "$WORK"
build_fixture
mkdir -p "$WORK/src" && printf 'const p = new Pool({ password: "SuperSecreta123" });
' > "$WORK/src/db.ts"
chk   "contraseña en el código ⇒ bloquea"     "contraseña en texto plano"  SEC "$WORK"
chk   "y propone la corrección"               "Corrección:"     SEC "$WORK"
build_fixture
printf '{ "api_key": "abcd1234efgh5678" }
' > "$WORK/config.json"
chk   "credencial en JSON ⇒ bloquea"          "campo de credencial"  SEC "$WORK"
build_fixture
printf '{ "api_key": "REDACTADO" }
' > "$WORK/config.json"
chk   "REDACTADO no es un secreto"            "Sin hallazgos"   SEC "$WORK"

# Lo que el árbol ya no muestra, la historia sí: es la razón de la compuerta.
build_fixture
mkdir -p "$WORK/src" && printf 'const p = new Pool({ password: "SuperSecreta123" });
' > "$WORK/src/db.ts"
git -C "$WORK" init -q 2>/dev/null; git -C "$WORK" add -A >/dev/null 2>&1
git -C "$WORK" -c user.name=t -c user.email=t@t commit -q -m "con secreto" >/dev/null 2>&1
printf 'const p = new Pool({ password: process.env.PGPASSWORD });
' > "$WORK/src/db.ts"
git -C "$WORK" add -A >/dev/null 2>&1
git -C "$WORK" -c user.name=t -c user.email=t@t commit -q -m "lo saco del archivo" >/dev/null 2>&1
chk   "árbol limpio tras sacarlo"             "Sin hallazgos"   SEC "$WORK"
chk   "pero la historia lo conserva"          "contraseña en texto plano"  SEC "$WORK" --historial

# PT-005 · la firma de una excepcion no puede depender de la profundidad del clon, y un clon
# superficial no puede darse por historia revisada.
#
# Se vio abriendo el PR de G4: CI fallo con 7 hallazgos que en local no existian. La huella
# incluia el hash del commit, y `actions/checkout` clona con fetch-depth 1 — en un pull_request
# ese unico commit es el merge SINTETICO de GitHub, distinto en cada PR. Ninguna firma encajaba.
# Y el fallo simetrico es peor: con un commit visible la herramienta decia haber revisado la
# historia. Un arbol limpio habria salido verde sin mirar.
SEC() { node "$SUITE/tools/revisar-secretos.mjs" "$@"; }
repo_con_secreto() {   # $1 destino · $2 marca que hace DISTINTO el hash del commit
  # git es determinista: mismo contenido, mensaje, autor y segundo ⇒ MISMO hash. Dos repos
  # creados a la vez daban commits identicos, y el caso inverso pasaba sin probar nada — lo dijo
  # el propio caso. La marca cambia el MENSAJE; el contenido tiene que seguir siendo identico,
  # porque es lo que la huella debe reconocer como el mismo secreto.
  rm -rf "$1"; mkdir -p "$1/src"; ( cd "$1"
    git init -q . && git config user.email t@t && git config user.name T
    printf 'const p = { password: "Zanahoria99Fija" };\n' > src/a.js
    git add -A && git commit -qm "uno-${2:-a}"
    printf 'const p = { password: process.env.P };\n' > src/a.js
    git add -A && git commit -qm "dos-${2:-a}" ) >/dev/null 2>&1
}

repo_con_secreto "$WORK/histrepo" alfa
chk   "el secreto de la historia se caza"    "1 hallazgo"   SEC "$WORK/histrepo" --historial

# EL MISMO secreto en dos repositorios distintos tiene commits distintos. Si la huella depende
# del hash, cada uno produce una firma diferente y la excepcion firmada en uno no sirve en el
# otro — que es exactamente lo que pasa en CI, donde el commit es el merge sintetico de GitHub.
repo_con_secreto "$WORK/histrepo2" beta
H1="$(SEC "$WORK/histrepo"  --historial 2>&1 | grep -oE '[0-9a-f]{12}  historia' | head -1 | cut -d' ' -f1)"
H2="$(SEC "$WORK/histrepo2" --historial 2>&1 | grep -oE '[0-9a-f]{12}  historia' | head -1 | cut -d' ' -f1)"
C1="$(cd "$WORK/histrepo" && git rev-parse --short=8 HEAD~1)"
C2="$(cd "$WORK/histrepo2" && git rev-parse --short=8 HEAD~1)"
chk   "los commits del fixture SÍ difieren"  "^DISTINTOS$"  bash -c "[ '$C1' != '$C2' ] && echo DISTINTOS || echo IGUALES"
chk   "la huella no depende del commit"      "^IGUAL$"      bash -c "[ -n '$H1' ] && [ '$H1' = '$H2' ] && echo IGUAL || echo DISTINTA:'$H1'/'$H2'"

# Y una firma hecha en un repositorio exime en el otro: es la misma huella, el mismo secreto.
mkdir -p "$WORK/histrepo2/docs/implementation"
printf '| Huella | Firmada por | Fecha | Motivo |\n|:--|:--|:--|:--|\n| %s | Ada Lovelace | 2026-08-13 | fixture |\n' "$H1" \
  > "$WORK/histrepo2/docs/implementation/SECRETOS-EXCEPCIONES.md"
chkno "firmada allí ⇒ exime aquí"            "hallazgo(s). Publicar"  SEC "$WORK/histrepo2" --historial

# Clon superficial: la historia NO se da por revisada.
rm -rf "$WORK/superficial"
git clone -q --depth 1 "file://$WORK/histrepo" "$WORK/superficial" >/dev/null 2>&1
chk   "clon superficial ⇒ SIN EVALUAR"       "SIN EVALUAR"   SEC "$WORK/superficial" --historial
chk   "y dice cómo arreglarlo"               "fetch-depth"   SEC "$WORK/superficial" --historial
chkno "no dice que revisó la historia"       "+ historia ("  SEC "$WORK/superficial" --historial

# CI tiene que clonar la historia entera, o el paso de secretos miraria un solo commit.
chk   "CI clona la historia entera"          "fetch-depth: 0"  cat "$SUITE/../../.github/workflows/verificacion.yml"

# PT-006 · el contrato de la plataforma vuelve a su regla.
#
# PHASES.md declaraba tres mapeos bajo el encabezado [SUITE-R35], y RULES.md no contiene ni
# «milestone» ni «pull request». Un documento de procedimiento enunciaba obligaciones que su
# regla no tiene, y LEX-R21 lo pone por debajo. El milestone se borra —cero en toda la
# historia, y daria a un EP dos representaciones del mismo hecho—; el pull request sube a
# RULES como SUITE-R42, condicionada a que el proyecto declare plataforma.
chkno "PHASES ya no declara milestone"      "milestone"    cat "$SUITE/PHASES.md"
chk   "SUITE-R42 existe en RULES"           "SUITE-R42"    cat "$SUITE/RULES.md"
chk   "SUITE-R42 llega al núcleo"           "SUITE-R42"    cat "$SUITE/CORE.md"

# La comprobacion tiene que poder fallar, y distinguir «no aplica» de «no pude mirar».
trlib "sin plataforma ⇒ pr no aplica"       "^2$" \
  "console.log(m.decidirSalida({}, ()=>true).codigo)"
trlib "plataforma sin acceso ⇒ pr da 3"     "^3$" \
  "console.log(m.decidirSalida({tracker:{plataforma:\"github\"}}, ()=>false).codigo)"

# Sin plataforma declarada, G4 no gana ninguna exigencia. Es la garantia de todo proyecto que
# no espeja: sin este caso, la regla nueva romperia a todos los destinos ya instalados.
build_fixture
chkno "sin plataforma ⇒ G4 libre de R42"    "SUITE-R42"    V --gate G4 PT-001

# Negativo a proposito: lo unico que hace creible que G4 siga siendo humana es que el codigo
# NO pueda fusionar. Si algun dia aparece, este caso se pone rojo.
chkno "tracker no puede fusionar"           "pr merge"     cat "$SUITE/tools/tracker.mjs"

# PT-007 · el issue lleva la FASE y la COMPUERTA, derivadas del registro.
#
# El tablero decia «que existe» y nada mas: para saber que va cuando habia que abrir
# REGISTRY.json. Lo demostro EP-001 al reabrirse — quien mirara GitHub veia cinco issues
# abiertos sin saber que cuatro estaban terminados y uno esperaba una compuerta humana.
#
# La compuerta NO se almacena: se deriva de la fase con el mapa de CORE.md §Fases. Un campo que
# alguien tiene que actualizar es un hecho copiado (RULE-01).
trlib "la etiqueta lleva la fase"        "fase: 4" \
  "console.log(JSON.stringify(m.etiquetasDe({id:\"PT-1\",phase:4,status:\"READY\"})))"
trlib "y la compuerta que espera"        "G2" \
  "console.log(JSON.stringify(m.etiquetasDe({id:\"PT-1\",phase:4,status:\"READY\"})))"
trlib "PHASE 5 no espera compuerta"      "^SIN_COMPUERTA$" \
  "console.log(m.etiquetasDe({id:\"PT-1\",phase:5,status:\"IN_PROGRESS\"}).some(function(e){return /^G[1-4]$/.test(e)})?\"HAY\":\"SIN_COMPUERTA\")"
trlib "sin fase declarada no revienta"   "^SIN_FASE$" \
  "console.log(m.etiquetasDe({id:\"PT-1\",status:\"READY\"}).some(function(e){return e.indexOf(\"fase\")===0})?\"HAY\":\"SIN_FASE\")"

# El espejo comprueba tambien las etiquetas: publicar el estado sin comprobarlo es escribir en
# dos sitios y esperar que no se separen.
trlib "etiqueta que no cuadra ⇒ divergencia" "fase" \
  "console.log(JSON.stringify(m.compararEspejo([{id:\"PT-1\",status:\"READY\",issue:7,phase:4}],[{number:7,title:\"x\",labels:[{name:\"fase: 2\"},{name:\"G2\"}]}])))"
trlib "etiquetas correctas ⇒ sin divergencia" "^SIN_DIVERGENCIAS$" \
  "console.log(m.compararEspejo([{id:\"PT-1\",status:\"READY\",issue:7,phase:4}],[{number:7,title:\"x\",labels:[{name:\"fase: 4\"},{name:\"G2\"}]}]).length?\"HAY\":\"SIN_DIVERGENCIAS\")"

# Sin plataforma declarada, nada de esto se exige. Garantia de los destinos ya instalados.
build_fixture
chk   "estado funciona sin plataforma"   "PT-00"   TR estado

# PT-008 · lo que una persona escribe en la plataforma se lee.
#
# Durante la sesion que abrio EP-002 el agente escribio en los issues y NO releyo ninguno:
# `gh issue view --json comments` existia y solo se usaba para contar reanclajes. Un comentario
# humano podia quedar sin leer indefinidamente y nada lo senalaba.
#
# NO se distingue por autor: se midio y es imposible. El agente comenta con la credencial de la
# persona, asi que los dos comentarios llevan el mismo login. Se distingue por MARCA de
# procedencia, que es falsificable — y eso se declara, como SUITE-R27 declara que prueba una firma.
M='<!-- cauce:agente -->'
trlib "humano tras el agente ⇒ pendiente"   "^PENDIENTE$" \
  "console.log(m.comentarioSinResponder([\"nota $M\",\"oye\"])===true?\"PENDIENTE\":\"NO\")"
trlib "respondido ⇒ ya no pendiente"        "^LIMPIO$" \
  "console.log(m.comentarioSinResponder([\"nota $M\",\"oye\",\"te leo $M\"])===false?\"LIMPIO\":\"NO\")"
trlib "los del agente no cuentan"           "^LIMPIO$" \
  "console.log(m.comentarioSinResponder([\"a $M\",\"b $M\"])===false?\"LIMPIO\":\"NO\")"
trlib "sin comentarios no revienta"         "^LIMPIO$" \
  "console.log(m.comentarioSinResponder([])===false?\"LIMPIO\":\"NO\")"
trlib "sin ninguna marca ⇒ no evaluable"    "^NO_EVALUABLE$" \
  "console.log(m.comentarioSinResponder([\"uno\",\"dos\"])===null?\"NO_EVALUABLE\":\"NO\")"
chk   "SUITE-R43 existe en RULES"           "SUITE-R43"   cat "$SUITE/RULES.md"

# PT-009 · la herramienta FIRMA lo que escribe. tracker cerrar comentaba sin marca, asi que
# SUITE-R43 tomaba su propio mensaje de cierre por humano — la regla se cazo a si misma en la
# primera ejecucion posterior a su creacion. Se arregla QUIEN ESCRIBE, no la regla.
trlib "el cierre lleva la marca"           "cauce:agente"   "console.log(m.mensajeDeCierre({id:\"PT-1\",status:\"INTEGRATED\"}))"
trlib "y no pierde lo que decia"           "INTEGRATED"   "console.log(m.mensajeDeCierre({id:\"PT-1\",status:\"INTEGRATED\"}))"
# El inverso que importa: la regla NO se relaja. Si algun dia alguien decide que el mensaje de
# cierre no cuente, este caso se pone rojo antes de que nadie lo note.
chk   "SUITE-R43 sigue exigiendo respuesta"  "no avanza"   cat "$SUITE/RULES.md"

# PT-010 · el cuerpo del issue se lee, y su enlace resuelve.
#
# El cuerpo de un issue de EP decia «sin implementacion» SOBRE LA IMPLEMENTACION —el generador
# usaba un solo texto y un EP no tiene campo epic— y el enlace era relativo, que en el cuerpo de
# un issue es un 404. Lo vio una persona mirando el tablero: ninguna comprobacion detecta que un
# enlace resuelve ni que un texto se contradice.
EP1='{id:"EP-9",type:"EP",slug:"x",status:"IN_PROGRESS"}'
OPC='{url:"https://github.com/o/r",rama:"main",tareas:[{id:"PT-1",issue:5,title:"uno"},{id:"PT-2",issue:6,title:"dos"}]}'
trlib "el EP no se niega a si mismo"      "^LIMPIO$"   "console.log(/sin implementación/.test(m.cuerpoDeIssue($EP1,$OPC))?\"HAY\":\"LIMPIO\")"
trlib "y dice que ES una implementacion"  "Implementación abierta"   "console.log(m.cuerpoDeIssue($EP1,$OPC))"
trlib "el enlace es absoluto"             "https://github.com/o/r"   "console.log(m.cuerpoDeIssue($EP1,$OPC))"
trlib "enumera sus tareas con su issue"   "#5"   "console.log(m.cuerpoDeIssue($EP1,$OPC))"
trlib "sin URL no se inventa"             "^SIN_ENLACE$"   "console.log(/https:/.test(m.cuerpoDeIssue($EP1,{}))?\"INVENTA\":\"SIN_ENLACE\")"
trlib "sigue sin copiar el intake"        "No se copia aquí"   "console.log(m.cuerpoDeIssue($EP1,$OPC))"
trlib "una tarea sí dice a qué lote va"   "EP-9"   "console.log(m.cuerpoDeIssue({id:\"PT-3\",type:\"BUG\",epic:\"EP-9\",slug:\"y\",severity:\"S2\"},$OPC))"

build_fixture
chkno "sin plataforma ⇒ G4 libre de R43"    "SUITE-R43"   V --gate G4 PT-001


# PT-013 · lo aplazado no se narra: se ASIGNA. Un out-of-scope que apunta a trabajo futuro sin
# citar a nadie es como EP-001 perdio la migracion del proyecto legado durante cuatro versiones.
# DEFERRED existia en LEXICON §5.1 y no lo usaba nadie.
chk   "SUITE-R44 existe en RULES"          "SUITE-R44"   cat "$SUITE/RULES.md"
chk   "SUITE-R44 llega al núcleo"          "SUITE-R44"   cat "$SUITE/CORE.md"

oos() {   # $1 destino de la fila de out-of-scope del PT-001 del fixture
  printf '# Fuera de alcance

| Fuera | Por qué | Dónde va |
|:--|:--|:--|
| algo | porque sí | %s |
' "$1"     > "$WORK/changes/PT-001-login/out-of-scope.md"
}

build_fixture; oos 'Decisión posterior'
chk   "aplazar sin citar a nadie se ve"    "SUITE-R44"   V PT-001
chk   "y fuera de G4 solo avisa"           "! SUITE-R44" V PT-001
chk   "en G4 bloquea"                      "✗ SUITE-R44" V --gate G4 PT-001
# PT-018 cambio la semantica: citar una allocation CUALQUIERA ya no basta. Este caso afirmaba
# lo contrario y se sustituye — un aserto que exige el comportamiento viejo lo perpetua.
build_fixture; oos '`PT-004`'
chk   "citar a cualquiera ya no basta"     "SUITE-R44"   V PT-001
build_fixture; oos '—'
chkno "un guion no aplaza nada"            "SUITE-R44"   V PT-001

# DEFERRED: exento para la verificacion, VIVO para el espejo. Las dos caras.
build_fixture
reg_set "r.allocations.push({id:'PT-020',type:'BUG',severity:'S3',slug:'aplazado',created:'2026-08-13',status:'DEFERRED',suite_version:'6.0.1'}); r.counters.PT=20"
chkno "un DEFERRED no exige artefactos"    "PT-020"      V --all
trlib "un DEFERRED sí es vivo"             "^VIVO$"   "console.log(m.vivasDe([{id:\"PT-020\",status:\"DEFERRED\"}]).length?\"VIVO\":\"NO\")"


# PT-018 · el destino de una fila de out-of-scope es VOCABULARIO CERRADO, no prosa.
#
# PT-013 dejo dos agujeros y los dos salian de lo mismo: con prosa libre, la comprobacion tiene
# que adivinar si significa «aplazado» y si el sitio al que apunta sirve. Ninguna es adivinable.
# Es lo que PTSA-R77 resuelve para las auditorias: toda celda lleva un valor de una lista
# cerrada, y no existe la celda en blanco.
chkno "SUITE-R44 ya no adivina sobre prosa"  "RE_APLAZA"  cat "$SUITE/tools/verify-fdge.mjs"

build_fixture; oos 'Decisión posterior'
chk   "destino en prosa falla"             "SUITE-R44"   V PT-001
build_fixture; oos 'ya veremos'
chk   "otra prosa cualquiera, también"     "SUITE-R44"   V PT-001
build_fixture; oos '—'
chkno "un guion sigue siendo válido"       "SUITE-R44"   V PT-001

# Reciprocidad: citar no basta. PT-012 citaba PT-013 —que no iba a hacer ese trabajo— y pasaba.
build_fixture
reg_set "r.allocations.push({id:'PT-030',type:'CHORE',severity:'S4',slug:'aplazado',created:'2026-08-13',status:'DEFERRED',suite_version:'6.0.1',origin:'Aplazado por PT-001'}); r.counters.PT=30"
oos '`PT-030`'
chkno "un DEFERRED que reconoce su origen vale"  "SUITE-R44"  V PT-001
build_fixture
reg_set "r.allocations.push({id:'PT-031',type:'CHORE',severity:'S4',slug:'otro',created:'2026-08-13',status:'DEFERRED',suite_version:'6.0.1',origin:'Aplazado por PT-999'}); r.counters.PT=31"
oos '`PT-031`'
chk   "si no reconoce su origen, falla"          "SUITE-R44"  V PT-001


# PT-022 . un lote citado tiene que DECLARAR su cierre, asi que los fixtures de PT-021 lo llevan.
ep_cierre() {  # $1 identificador del lote
  mkdir -p "$WORK/changes/$1-lote"
  printf '# %s

## Cierre del lote

| Que | Estado |
|:---|:---|
| Entrada de CHANGELOG | HECHO |
' "$1" > "$WORK/changes/$1-lote/intake.md"
}

# PT-021 . citar el PROPIO lote. Exigir CLOSED era un bloqueo por construccion: un lote llega a
# CLOSED DESPUES del merge, y el merge ES G4. El patron legitimo «esto se hace al cerrar el
# lote» no podia pasar nunca — lo encontro G4 de EP-004 bloqueando dos tareas por ESCRIBIR lo
# que las otras tres callaron. DONE es trabajo hecho esperando al humano; ya no es una promesa.
build_fixture
reg_set "r.allocations.push({id:'EP-030',type:'EP',slug:'lote',created:'2026-08-13',status:'DONE',suite_version:'6.0.1'}); r.allocations.find((a)=>a.id==='PT-001').epic='EP-030'; r.counters.EP=30"
ep_cierre EP-030
oos '`EP-030`'
chkno "el propio lote en DONE vale"          "SUITE-R44"  V --gate G4 PT-001
build_fixture
reg_set "r.allocations.push({id:'EP-031',type:'EP',slug:'lote',created:'2026-08-13',status:'CLOSED',suite_version:'6.0.1'}); r.allocations.find((a)=>a.id==='PT-001').epic='EP-031'; r.counters.EP=31"
ep_cierre EP-031
oos '`EP-031`'
chkno "y en CLOSED tambien"                  "SUITE-R44"  V --gate G4 PT-001
# La intencion original, intacta: mientras el lote sigue abierto es una intencion, no una asignacion.
build_fixture
reg_set "r.allocations.push({id:'EP-032',type:'EP',slug:'lote',created:'2026-08-13',status:'IN_PROGRESS',suite_version:'6.0.1'}); r.allocations.find((a)=>a.id==='PT-001').epic='EP-032'; r.counters.EP=32"
oos '`EP-032`'
chk   "el lote IN_PROGRESS sigue sin valer"  "SUITE-R44"  V PT-001
build_fixture
reg_set "r.allocations.push({id:'EP-033',type:'EP',slug:'lote',created:'2026-08-13',status:'DRAFT',suite_version:'6.0.1'}); r.allocations.find((a)=>a.id==='PT-001').epic='EP-033'; r.counters.EP=33"
oos '`EP-033`'
chk   "y en DRAFT tampoco"                   "SUITE-R44"  V PT-001


# PT-022 . SUITE-R45 — un lote declara que se hace al cerrarlo.
# La entrada de CHANGELOG de EP-004 estaba como fila en DOS out-of-scope y ausente en TRES: la
# misma obligacion copiada cinco veces, divergiendo a los dos dias. Y las dos que la ESCRIBIERON
# fueron las bloqueadas. El lote es quien aplaza el cierre del lote: ahi solo hay un sitio.
ep_intake() { # $1 cuerpo de la seccion de cierre (vacio = sin seccion)
  mkdir -p "$WORK/changes/EP-040-lote"
  { echo "# EP-040 — lote"; echo; echo "## Objetivo común"; echo "x"; echo; echo "## Criterio de éxito del lote";
    echo "x"; echo; echo "## Análisis de solapamiento"; echo "x"; echo; echo "## Qué NO entra"; echo "- OUT: y"; echo;
    echo '```'; echo "Firmado por: Alberto Martínez"; echo "Fecha: 2026-08-13"; echo '```'; echo;
    echo "| PT | Tipo |"; echo "|:---|:---|"; echo "| PT-001 | BUG |"; echo; printf '%s
' "$1"; } > "$WORK/changes/EP-040-lote/intake.md"
  reg_set "r.allocations.push({id:'EP-040',type:'EP',slug:'lote',created:'2026-08-13',status:'DONE',suite_version:'6.0.1'}); r.allocations.find((a)=>a.id==='PT-001').epic='EP-040'; r.counters.EP=40"
}
build_fixture; ep_intake ""
chk   "un lote sin seccion de cierre no pasa G4"  "SUITE-R45"  V --gate G4 PT-001
build_fixture; ep_intake "## Cierre del lote"
chk   "y con la seccion vacia, tampoco"           "SUITE-R45"  V --gate G4 PT-001
build_fixture; ep_intake "## Cierre del lote

| Qué | Estado |
|:---|:---|
| Entrada de CHANGELOG | pendiente |"
chk   "una fila sin resolver bloquea en G4"       "SUITE-R45"  V --gate G4 PT-001
build_fixture; ep_intake "## Cierre del lote

| Qué | Estado |
|:---|:---|
| Entrada de CHANGELOG | pendiente |"
reg_set "r.allocations.find((a)=>a.id==='EP-040').status='IN_PROGRESS'"
chk   "y con el lote abierto solo avisa"          "! SUITE-R45" V PT-001
build_fixture; ep_intake "## Cierre del lote

| Qué | Estado |
|:---|:---|
| Entrada de CHANGELOG | HECHO |
| Lo demas | PT-099 |"
chkno "resuelta con HECHO o con un ID, pasa"      "✗ SUITE-R45"  V --gate G4 PT-001
# Un lote CLOSED ya paso su G4 con las reglas de su momento: exigirselo es reescribir historia.
build_fixture; ep_intake ""
reg_set "r.allocations.find((a)=>a.id==='EP-040').status='CLOSED'"
chkno "a un lote ya cerrado no se le exige"       "SUITE-R45"  V --gate G4 PT-001
# La otra mitad: citar el propio lote deja de ser gratis — cuesta escribirlo EN el lote.
build_fixture; ep_intake ""; oos '`EP-040`'
chk   "citar un lote que no declara cierre falla" "SUITE-R44"  V PT-001
build_fixture; ep_intake "## Cierre del lote

| Qué | Estado |
|:---|:---|
| Entrada de CHANGELOG | HECHO |"
oos '`EP-040`'
chkno "citarlo cuando si lo declara, vale"        "SUITE-R44"  V PT-001

# ─── R · el reanclaje escrito y la condición de cierre ───────────────────────
echo "── R · bitácora y cierre ──"

# FDGE-R53 · una tarea sin condición de cierre no tiene final: se estira.
build_fixture
perl -0pi -e 's/Termina cuando:.*
//' "$WORK/changes/PT-001-login/intake.md"
chk   "sin condición de cierre ⇒ falla"      "✗ FDGE-R53"  V PT-001
build_fixture
printf 'Termina cuando: el login acepta la contraseña correcta
' >> "$WORK/changes/PT-001-login/intake.md"
chkno "con condición de cierre ⇒ pasa"       "✗ FDGE-R53"  V PT-001

# FDGE-R52 · el reanclaje se ESCRIBE. Una nota por transición alcanzada.
build_fixture
printf 'Termina cuando: algo observable
' >> "$WORK/changes/PT-001-login/intake.md"
reg_set "r.allocations.filter(x=>x.id==='PT-001').forEach(x=>{x.phase=4})"
perl -0pi -e 's/^phase:.*
/phase: 4
/m' "$WORK/changes/PT-001-login/intake.md"
rm -f "$WORK/changes/PT-001-login/bitacora.md"   # el fixture ya la trae; aquí se prueba su ausencia
chk   "PHASE 4 sin bitácora ⇒ falla"         "✗ FDGE-R52"  V PT-001
printf '2026-08-12 · PHASE 1 → 2
cierro: a

2026-08-12 · PHASE 2 → 3
cierro: b

2026-08-12 · PHASE 3 → 4
cierro: c
' > "$WORK/changes/PT-001-login/bitacora.md"
chk   "bitácora al día ⇒ pasa"               "✓ FDGE-R52"  V PT-001
perl -0pi -e 's/2026-08-12 · PHASE 3 → 4.*//s' "$WORK/changes/PT-001-login/bitacora.md"
chk   "bitácora atrasada ⇒ falla"            "✗ FDGE-R52"  V PT-001

# PT-004 · un artefacto se exige DESDE la fase que lo produce, no antes.
#
# Sin esto, abrir un PT correctamente ponía CI en rojo: `verify-fdge --all` exigía
# `traceability.md` (PHASE 4) y `discovery.md` (PHASE 2) a un PT recién salido de PHASE 1. La
# fase ya se calculaba en checkPT y solo la consumía FDGE-R52. Una compuerta que se pone roja
# sobre comportamiento correcto enseña a saltársela.
#
# Los cuatro primeros casos van en pares: uno comprueba que dejó de fallar donde no tocaba, y
# el siguiente que SIGUE fallando donde sí. Sin el inverso, apagar la comprobación entera
# pasaría los dos primeros.
build_fixture
reg_set "r.allocations.filter(x=>x.id==='PT-004').forEach(x=>{x.phase=1})"
rm -f "$WORK/changes/PT-004-pdf/traceability.md"
chkno "PHASE 1 sin traceability ⇒ no falla"  "✗ FDGE-R15"  V PT-004
chk   "PHASE 1 sin traceability ⇒ se avisa"  "! FDGE-R15"  V PT-004
build_fixture
rm -f "$WORK/changes/PT-004-pdf/traceability.md"
chk   "PHASE 4 sin traceability ⇒ falla"     "✗ FDGE-R15"  V PT-004

build_fixture
reg_set "r.allocations.filter(x=>x.id==='PT-002').forEach(x=>{x.phase=1})"
rm -f "$WORK/changes/PT-002-pool/discovery.md"
chkno "PHASE 1 sin discovery ⇒ no falla"     "✗ FDGE-R42"  V PT-002
build_fixture
reg_set "r.allocations.filter(x=>x.id==='PT-002').forEach(x=>{x.phase=2})"
rm -f "$WORK/changes/PT-002-pool/discovery.md"
chk   "PHASE 2 sin discovery ⇒ falla"        "✗ FDGE-R42"  V PT-002

# RULE-06 · lo que no se puede comprobar se DECLARA no evaluable. Un PT sin fase en ninguna
# de las dos fuentes no incumple: es un PT sobre el que no se puede afirmar nada. Ni bloquea
# ni pasa en silencio — y el aviso dice dónde escribir el campo (RULE-07).
build_fixture
reg_set "r.allocations.filter(x=>x.id==='PT-004').forEach(x=>{delete x.phase})"
perl -0pi -e 's/^phase:.*\n//m' "$WORK/changes/PT-004-pdf/intake.md"
rm -f "$WORK/changes/PT-004-pdf/traceability.md"
chkno "sin fase declarada ⇒ no bloquea"      "✗ FDGE-R15"  V PT-004
chk   "sin fase declarada ⇒ SIN EVALUAR"     "SIN EVALUAR" V PT-004
chk   "el aviso dice dónde declararla"       "phase"       V PT-004

# La portada del paquete no puede declarar una versión fósil.
chkno "el README no fija una versión"        "Versión 4."  cat "$SUITE/../../README.md"
chk   "el README nombra el paquete"          "@a81biz/cauce"  cat "$SUITE/../../README.md"

# ─── S · los patrones cumplen su contrato ────────────────────────────────────
echo "── S · patrones ──"

chk   "los patrones cumplen su contrato"     "cumplen su contrato"  node "$SUITE/tools/verify-patrones.mjs"

# La prueba de que sirve: se degrada un escape como han fallado las ocho veces.
# \d → d es IMPRIMIBLE: el detector de bytes de control no lo ve, y este sí.
PATDIR="$WORK/../patrones-degradados"
rm -rf "$PATDIR" && mkdir -p "$PATDIR" && cp "$SUITE/tools/patrones.mjs" "$SUITE/tools/verify-patrones.mjs" "$PATDIR/"
node -e "const f=require('fs'),p=process.argv[1],b=String.fromCharCode(92);f.writeFileSync(p,f.readFileSync(p,'utf8').replace('re: /'+b+'bAC-'+b+'d+','re: /'+b+'bAC-d+'))" "$PATDIR/patrones.mjs"
chk   "escape degradado ⇒ falla su ejemplo"  "debería casar"  node "$PATDIR/verify-patrones.mjs"
rm -rf "$PATDIR"

# SUITE-R41: el destino ES cauce por IDENTIDAD, no por ruta. Comparar rutas solo acierta cuando
# carga y destino son el mismo directorio; con el paquete instalado como dependencia de si mismo
# el bin de node_modules tiene rutas distintas y anunciaba «49 archivos instalados» sobre el
# repositorio que ES cauce. Se ejecuta el bin DESDE FUERA, que es el caso que fallaba.
AUTODIR="$WORK/../autoalojado"
rm -rf "$AUTODIR" && mkdir -p "$AUTODIR/docs/methodology"
printf '{"name":"@a81biz/cauce","version":"0.0.0"}' > "$AUTODIR/package.json"
BINCAUCE="$SUITE/../../bin/cauce.mjs"
if [ -f "$BINCAUCE" ]; then
chk   "destino que ES cauce ⇒ no se instala" "ES cauce" node "$BINCAUCE" install "$AUTODIR"
# Y un destino cualquiera NO debe confundirse con cauce.
OTRODIR="$WORK/../destino-normal"
rm -rf "$OTRODIR" && mkdir -p "$OTRODIR"
printf '{"name":"un-proyecto","version":"1.0.0"}' > "$OTRODIR/package.json"
chkno "un proyecto normal NO es cauce"       "ES cauce" node "$BINCAUCE" install "$OTRODIR"
fi
rm -rf "$AUTODIR" "$OTRODIR"

# FND-R29: la excepcion se firma donde se puede firmar. La herramienta exigia firmar por escrito
# y no existia donde: en el repositorio de cauce el escaner caza los fixtures de este mismo
# archivo y la compuerta quedaba en rojo permanente, que ensena a saltarsela. Se comprueba que
# firmar deja de bloquear Y que una fila sin firmante NO exime.
SECDIR="$WORK/../secretos-excepcion"
rm -rf "$SECDIR" && mkdir -p "$SECDIR/src" "$SECDIR/docs/implementation"
printf 'const p = { password: "SuperSecreta123" };\n' > "$SECDIR/src/db.js"
chk   "secreto sin firmar ⇒ bloquea"       "Publicar un repositorio"  node "$SUITE/tools/revisar-secretos.mjs" "$SECDIR"
HUELLA=$(node "$SUITE/tools/revisar-secretos.mjs" "$SECDIR" 2>/dev/null | grep -oE "[0-9a-f]{12}" | head -1)
SECEXC="$SECDIR/docs/implementation/SECRETOS-EXCEPCIONES.md"
# Fila con la huella pero SIN firmante: es una fila, no una firma.
printf '| Huella | Firmada por | Fecha | Motivo |\n|:--|:--|:--|:--|\n| `%s` | | | prueba |\n' "$HUELLA" > "$SECEXC"
chk   "fila sin firmante NO exime"         "Publicar un repositorio"  node "$SUITE/tools/revisar-secretos.mjs" "$SECDIR"
# Firmada de verdad: deja de bloquear pero SIGUE VIENDOSE.
printf '| Huella | Firmada por | Fecha | Motivo |\n|:--|:--|:--|:--|\n| `%s` | Ada Lovelace | 2026-08-13 | fixture |\n' "$HUELLA" > "$SECEXC"
chk   "firmada ⇒ se ve y no bloquea"       "excepción firmada"  node "$SUITE/tools/revisar-secretos.mjs" "$SECDIR"
chkno "firmada ⇒ ya no bloquea"            "Publicar un repositorio"  node "$SUITE/tools/revisar-secretos.mjs" "$SECDIR"
rm -rf "$SECDIR"

# SUITE-R40: la version se deriva del CHANGELOG. La tuvo escrita a mano en una constante siendo
# la autoridad contra la que se comprueban todos los documentos, y veinte declararon una version
# atrasada durante dias mientras el verificador decia que todo estaba bien: comparaba contra su
# propia copia equivocada. Se comprueba que el desajuste se ve, no que este ausente.
VERDIR="$WORK/../version-desalineada"
rm -rf "$VERDIR" && mkdir -p "$VERDIR/docs" && cp -r "$SUITE" "$VERDIR/docs/methodology"
printf '{"name":"@a81biz/cauce","version":"9.9.9"}' > "$VERDIR/package.json"
chk   "package.json desalineado ⇒ falla"    "SUITE-R40"    node "$SUITE/tools/verify-suite.mjs" "$VERDIR/docs/methodology"
chk   "version.mjs ve el desalineado"       "package.json" node "$SUITE/tools/version.mjs" "$VERDIR/docs/methodology"
rm -rf "$VERDIR"

# El sello vive en un solo sitio: tres copias dejaron a una contradiciendo a las otras.
chk   "una sola fórmula del sello"           "patrones.mjs"  bash -c 'grep -l "const selloDe = " "$0"/tools/*.mjs' "$SUITE"

# ─── C · coherencia de la metodología ───────────────────────────────────────
echo "── C · metodología ──"
chk   "verify-suite en verde"    "Sin errores" node "$SUITE/tools/verify-suite.mjs" "$SUITE"
chk   "CORE.md sincronizado"     "sincronizado" node "$SUITE/tools/build-core.mjs" --check "$SUITE"
chk   "CORE-PTSA.md sincronizado" "CORE-PTSA.md sincronizado" node "$SUITE/tools/build-core.mjs" --check "$SUITE"
chk   "cobertura sin huecos"     "sin huecos"   node "$SUITE/tools/audit.mjs" "$SUITE"

# PT-002 · la cobertura mecanica se mide POR REGLA y se publica con su denominador.
#
# audit medía por COMPONENTE —hueco solo si un componente tenía CERO reglas verificadas— e
# informaba «Cobertura completa: sin huecos» con 63 reglas HARD sin ningún script. No mentía
# sobre lo que medía: mentía sobre lo que el lector entiende que ha medido. Y no vio ninguno de
# los dos defectos de este mismo lote.
#
# Los casos comprueban FORMA y RANGOS, nunca el valor exacto: fijar «85» obligaría a
# actualizarlo cada vez que se escriba una regla — un hecho copiado mas (RULE-01), dentro de la
# bateria que existe para cazar hechos copiados.
A() { node "$SUITE/tools/audit.mjs" "$@"; }

# El denominador se comprueba por FORMA, no por valor: la primera version puso «/ 167» y se
# rompio en cuanto SUITE-R42 hizo 168 reglas — el hecho copiado, dentro del caso que existe
# para cazar hechos copiados. RULE-01 aplicada al arnes.
chk   "la cobertura lleva denominador"    "[0-9] / [0-9]"  A "$SUITE"
chk   "declara las ejecutadas"            "ejecutadas"   A "$SUITE"
chk   "declara las que nadie ejecuta"     "sin compuerta" A "$SUITE"
chk   "declara las que nadie verifica"    "sin verificador" A "$SUITE"
chkno "ya no dice cobertura completa"     "Cobertura completa" A "$SUITE"
# Se comprueba la FORMA de la enumeracion, no que aparezca una regla concreta: fijar un ID
# obligaria a actualizar el caso cada vez que esa regla gane o pierda verificador — un hecho
# copiado mas (RULE-01), dentro de la bateria que existe para cazarlos.
chk   "enumera las que nadie verifica"    "SUITE-R"      A "$SUITE" --sin-verificar
chk   "enumera las que nadie ejecuta"     "FND-R"        A "$SUITE" --sin-compuerta

# El caso que distingue DERIVADO de INVENTADO: si el conjunto de compuertas se contara como
# vacio o como todo, los casos de arriba pasarian igual. Aqui se exige que la cifra este
# ESTRICTAMENTE entre 0 y el total.
cat > "$WORK/derivada.mjs" <<'MJS'
import { execFileSync } from 'node:child_process';
const o = execFileSync(process.execPath, [process.env.MTH_AUDIT, process.env.MTH_SUITE], { encoding: 'utf8' });
const m = o.match(/ejecutadas por una compuerta\s+(\d+)\s*\/\s*(\d+)/);
console.log(m && +m[1] > 0 && +m[1] < +m[2] ? 'DERIVADA' : `NO_DERIVADA ${m ? m[0] : 'sin cifra'}`);
MJS
chk   "las ejecutadas ni 0 ni el total"   "DERIVADA" \
  env MTH_AUDIT="$SUITE/tools/audit.mjs" MTH_SUITE="$SUITE" node "$WORK/derivada.mjs"

# RULE-06 · sin poder leer quien invoca las herramientas, la cifra no se inventa: se declara.
# Ni 0 (mentiria a la baja) ni el total (a la alta).
rm -rf "$WORK/solo-suite"; mkdir -p "$WORK/solo-suite/docs"
cp -r "$SUITE" "$WORK/solo-suite/docs/methodology"
chk   "sin saber quién ejecuta ⇒ SIN EVALUAR" "SIN EVALUAR"  A "$WORK/solo-suite/docs/methodology"

echo
[ "$FAILED" -eq 0 ] && echo "selftest: OK · $TOTAL casos" || echo "selftest: HAY FALLOS · $TOTAL casos"
rm -rf "$WORK"
exit "$FAILED"

