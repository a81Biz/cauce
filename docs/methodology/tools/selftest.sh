#!/usr/bin/env bash
# selftest — Prueba los verificadores contra un proyecto sintético.
#
# Existe porque la 4.0.0 salió con cuatro defectos críticos que solo eran visibles
# EJECUTANDO: los verificadores nunca se habían corrido contra PTs reales. Dos bloques:
#   A) cuatro casos límite bien formados → deben pasar en verde
#   B) once defectos inyectados → cada uno debe ser detectado
#
# Uso:  bash tools/selftest.sh [dir-temporal] [-q]
#       -q  silencia la ENUMERACION de los casos que pasan. El recuento, los fallos y el
#           codigo de salida NO cambian.
# Exit: 0 todo correcto · 1 algún caso falla
set -u
SUITE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# PT-034 · el binario publicado vive fuera de la suite: cauce start es su punto de entrada.
RAIZ="$(cd "$SUITE/../.." && pwd)"
# PT-049 · `-q` calla la ENUMERACION de los casos que pasan, y NADA mas. El recuento final se
# imprime siempre —un «OK» sin denominador es lo que PT-002 corrigio—, `bad()` no lleva guarda
# —un fallo se ve en cualquier modo— y el `exit` no depende del modo: imprime, no decide.
#
# Y se FILTRA de los posicionales antes de calcular WORK. `selftest.sh [dir-temporal]` toma $1
# como ruta, asi que sin este filtro `selftest.sh -q` habria creado «-q/mth-selftest». Es de las
# cosas que solo se ven ejecutando, y tiene su caso.
QUIET=""
POS=""
# PT-050 · `--solo <patron>` TOMA UN VALOR, asi que consume DOS posiciones. Sin esto el patron
# acabaria en el posicional y de ahi en WORK — que es exactamente el defecto que PT-049 encontro
# con `-q`, en su forma simple. Y `--solo` sin valor es un ERROR: un patron vacio casaria con
# todo, y la bandera diria que filtro cuando no filtro nada.
SOLO=""
AFECTADOS=""
# Antes de la primera «sec» todo esta activo: lo que hay ahi es preambulo, no una seccion.
SEC_ACTIVA=1
SECCIONES_ACTIVAS=""
SECCIONES_SALTADAS=""
_espera_solo=""
for _a in "$@"; do
  # El VALOR de --solo se consume ANTES de mirar si parece una bandera. Sin esto,
  # `--solo "-q"` se comia la bandera y dejaba --solo sin valor: el patron mas natural para
  # buscar los casos de PT-049 era justo ese. Lo dijo ejecutarlo.
  if [ -n "$_espera_solo" ]; then SOLO="$_a"; _espera_solo=""; continue; fi
  case "$_a" in
    -q|--quiet) QUIET=1 ;;
    --solo)     _espera_solo=1 ;;
    # PT-086 · corre SOLO las secciones que ejercitan lo que ha cambiado. Deriva las secciones
    # del propio arnes —nada de una tabla a mano, que envejeceria— y los cambios de git.
    --afectados) AFECTADOS=1 ;;
    *) [ -n "$POS" ] || POS="$_a" ;;
  esac
done
if [ -n "$_espera_solo" ]; then
  echo "selftest: --solo necesita un patron. Sin el casaria con todo, y entonces no filtra: miente." >&2
  exit 2
fi
WORK="${POS:-$(mktemp -d)}/mth-selftest"
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
# PT-049 · contar e imprimir se separan aqui. `TOTAL` sube SIEMPRE —es la cifra derivada que
# hace del «OK» un veredicto y no una afirmacion— y solo la enumeracion se calla. `bad()` no
# lleva guarda a proposito: -q no es un modo que ademas esconda.
pass() { TOTAL=$((TOTAL + 1)); [ -n "$QUIET" ] || printf "  \033[32m✓\033[0m %s\n" "$1"; }
# En -q la cabecera de seccion no se imprime al llegar: se RECUERDA, y sale sola delante del
# primer fallo de su bloque. Sin esto, `-q` sobre una bateria verde dejaba 21 lineas de las que
# 19 eran cabeceras sin nada debajo — lo dijo EJECUTARLO, no el diseño. Y borrarlas del todo
# habria dejado el rojo sin saber a que bloque pertenece.
SEC=""; SEC_VISTA=""
# PT-086 · una seccion inactiva se salta ENTERA: sus casos y su andamiaje. `--solo` filtraba
# solo aserciones, y por eso una corrida filtrada seguia costando 171 s de los 600 — hay 211
# `build_fixture` a nivel superior, fuera de los casos.
sec() {
  SEC="$1"; SEC_VISTA=""
  if [ -n "$AFECTADOS" ]; then
    case "$SECCIONES_ACTIVAS" in
      *"|$1|"*) SEC_ACTIVA=1 ;;
      *) SEC_ACTIVA=""; SECCIONES_SALTADAS="$SECCIONES_SALTADAS  $1
" ;;
    esac
  else
    SEC_ACTIVA=1
  fi
  [ -n "$QUIET" ] || [ -z "$SEC_ACTIVA" ] || echo "$1"
}
bad()  {
  TOTAL=$((TOTAL + 1))
  if [ -n "$QUIET" ] && [ -z "$SEC_VISTA" ] && [ -n "$SEC" ]; then echo "$SEC"; SEC_VISTA=1; fi
  printf "  \033[31m✗\033[0m %s\n" "$1"; FAILED=1
}
# Una herramienta que REVIENTA no imprime el patron que se le busca, asi que chkno la daba
# por buena: el arnes certificaba un verificador roto. Se rompio verify-qa a proposito y dos
# casos siguieron en verde. Ahora un rastro de excepcion invalida el caso, pase lo que pase.
# PT-087 · SEPTIMA instancia del patron del proxy, y la cazo la bateria contra PT-088.
#
# Esta funcion buscaba nombres de CLASES DE ERROR en la salida. Un comentario de
# verify-fdge.mjs que mencionaba una de ellas puso TRECE casos en rojo: los que hacen
# «cat» de ese archivo. Ninguna herramienta habia reventado — el archivo CONTENIA la
# palabra.
#
# El sujeto es «el proceso termino de forma anomala». Su observable no es una palabra:
# es la TRAZA DE PILA, y su forma es inconfundible — «at» indentado seguido de
# «:linea:columna». Medido: un reviente real imprime siempre marcos de esa forma, y un
# archivo que menciona una clase de error no imprime ninguno.
#
# No se pierde cobertura: hay un caso que revienta node de verdad y lo demuestra.
revento() { printf '%s' "$1" | grep -qE '^[[:space:]]+at .*:[0-9]+:[0-9]+'; }
# PT-050 · `chk` y `chkno` son las DOS UNICAS puertas por las que pasa cualquier caso: filtrar
# aqui cubre los 453 sin tocar ninguno, y sin que añadir uno mañana obligue a acordarse de nada.
#
# UNIVERSO sube SIEMPRE y TOTAL solo cuando el caso se EJECUTA. Son dos cifras porque un
# subconjunto que parece la bateria es peor que no tener subconjunto — es PT-002 con otro nombre,
# y la salida se lee fuera de contexto: en una evidencia, en un PR, tres lotes despues.
#
# El patron casa LITERAL (grep -F): un nombre lleva «», ·, … y parentesis, y pedir que se escapen
# convertiria el filtro en un acertijo — ademas de que un parentesis sin cerrar seria un error de
# sintaxis en vez de un «no casa», que es el defecto con el que PT-049 tropezo escribiendo casos.
UNIVERSO=0
# El emparejamiento es NATIVO de bash, no `grep -F`. La primera version lanzaba un proceso por
# caso —536 procesos— y el ahorro medido cayo del 55 % al 32 %: el filtro se pagaba a si mismo.
# `case ... in *"$SOLO"*` casa LITERAL igual que grep -F y no lanza nada.
salta() {
  UNIVERSO=$((UNIVERSO + 1))
  # PT-086 · seccion inactiva ⇒ el caso no corre. Se cuenta en UNIVERSO igual: la cifra de
  # cobertura no puede depender de lo que se filtro, o una corrida parcial pareceria completa.
  [ -n "$AFECTADOS" ] && [ -z "$SEC_ACTIVA" ] && return 0
  [ -z "$SOLO" ] && return 1
  case "$1" in *"$SOLO"*) return 1 ;; esac
  return 0
}
# PT-097 · va AQUI, junto a chk(), y no junto a trlib() 500 lineas mas abajo. Lo escribi alli
# primero y los once casos que lo usan —que estan en la linea 1085— no se registraron: «mlib:
# command not found» no revienta el arnes, simplemente el caso no existe. «selftest --solo» dijo
# «NINGUN CASO CASA» y el total subio 5 en vez de 16.
#
# El bloque «no hacer» del HANDOFF lo lleva escrito: «escribir un bloque de casos ANTES de donde
# se define el ayudante que usan: PAT: command not found sale como salida inesperada, no como
# ese ayudante no existe todavia». Segunda vez, y la primera fue en PT-095.
# PT-097 · el mismo mecanismo que trlib, pero para CUALQUIER modulo. trlib esta atado a
# tracker.mjs por el entorno MTH_TRACKER, y verify-ptsa tambien exporta logica pura desde que
# PT-097 le puso el guard EJECUTADO_DIRECTO —sin el, importarlo lo EJECUTA y termina en
# process.exit(), asi que su logica no se podia comprobar—.
mlib() { # $1 nombre · $2 patron · $3 ruta del modulo · $4 cuerpo JS que recibe el modulo como `m`
  salta "$1" && return
  local out
  out="$(MTH_MOD="$3" node -e "const {pathToFileURL}=require(\"url\");
import(pathToFileURL(process.env.MTH_MOD).href).then((m)=>{ $4 }).catch((e)=>console.log(\"IMPORT_FALLA \"+e.message));" 2>&1)"
  if revento "$out"; then bad "$1  (la herramienta reventó: no verifica nada)"; return; fi
  if printf '%s' "$out" | grep -q -- "$2"; then pass "$1"; else
    bad "$1  (no apareció: $2 · salió: $(printf '%s' "$out" | head -3))"; fi
}

chk() {
  local name="$1" pat="$2"; shift 2
  salta "$name" && return
  local out; out="$("$@" 2>&1)"
  if revento "$out"; then bad "$name  (la herramienta reventó: no verifica nada)"; return; fi
  # PT-085 · al fallar se ENSEÑA la salida, como trlib hace desde PT-058. Sin ella, diagnosticar
  # un caso obliga a reproducir el fixture a mano — me costo tres intentos con PT-084, y es la
  # misma familia que PT-079: un fallo que no dice por que es medio fallo.
  if printf '%s' "$out" | grep -q -- "$pat"; then pass "$name"; else
    bad "$name  (no apareció: $pat · salió: $(printf '%s' "$out" | head -c 400))"
  fi
}
# ─── PT-079 · las guardas del arnes ─────────────────────────────────────────
#
# B-1 · ABORTA. Una comprobacion inversa que no revierte certifica lo CONTRARIO de lo que
# pretende. En PT-074 se me olvido el assert y la inversa dio VERDE EN LOS TRES CASOS sin
# haber cambiado nada: str.replace no falla cuando no casa, hace nada en silencio.
#
# Con este helper eso no puede ocurrir: si el patron no esta en el archivo, aborta.
inversa() {  # $1 archivo · $2 patron literal · $3 reemplazo
  if [ ! -f "$1" ]; then echo "INVERSA: no existe $1" >&2; return 1; fi
  if ! grep -qF -- "$2" "$1"; then
    echo "INVERSA NO APLICA: el patron no casa en $1 — revertir nada certifica lo contrario" >&2
    return 1
  fi
  perl -0pi -e "BEGIN{\$p=shift;\$r=shift} s/\\Q\$p\\E/\$r/" "$2" "$3" "$1"
}

# B-2 · AVISA. Una asercion anclada SOLO en un identificador casi nunca prueba lo que
# pretende: las herramientas nombran cosas por muchos motivos —avisos, referencias
# cruzadas, el cuerpo de otra regla—. Cinco veces en EP-017: dos pasaban EN VACIO y una
# fallaba contra trabajo correcto.
#
# AVISA y no falla: hay casos legitimos, y un arnes que nace rojo se apaga. Se enumeran
# con su linea y la cifra queda medida, como TD-08 hizo con las reglas sin verificador.
lint_aserciones() {
  local n=0 out=""
  while IFS=: read -r ln txt; do
    n=$((n+1)); out="$out linea $ln"
  done < <(grep -nE '^(chk|chkno)[[:space:]]+"[^"]*"[[:space:]]+"(PT|EP)-[0-9]+"' "$SUITE/tools/selftest.sh")
  [ "$n" -eq 0 ] && echo "ninguna asercion sospechosa" || echo "$n sospechosa(s):$out"
}

# B-3 · AVISA. Un caso que invoca un helper definido MAS ABAJO no se ejecuta, y el sintoma
# —«la herramienta revento» o «no aparecio»— apunta al arreglo y no a la colocacion. Me
# paso DOS veces en este lote: TRR en PT-076 y RG2 en PT-066.
lint_helpers() {
  local f="$SUITE/tools/selftest.sh" malos=0 out=""
  # La lista va por variable para que la linea NO contenga los nombres: con ellos escritos
  # aqui, el lint se señalaba a si mismo —su propio bucle era «el primer uso»—. Segunda
  # autorreferencia al escribir esta guarda, tras la de los comentarios.
  local HELPERS="TR TRR RG2 V PL PLNO trlib trlibno inversa"
  for h in $HELPERS; do
    local def uso
    def=$(grep -nE "^$h\\(\\) \\{" "$f" | head -1 | cut -d: -f1)
    [ -z "$def" ] && continue
    # Una mencion en un COMENTARIO no es un uso. Sin esta guarda el lint se acusaba A SI MISMO:
    # sus propios comentarios nombran TR, TRR y RG2 para explicar el defecto. Es la familia de
    # PT-051 —un patron literal en un comentario contado como emision real— cometida al
    # escribir la guarda que la detecta.
    # Un USO es una INVOCACION DE CASO, no cualquier linea que nombre el helper. Buscar la
    # mencion suelta hizo que el lint se acusara A SI MISMO dos veces: primero por sus propios
    # comentarios, y luego por la linea que declara la lista. Anclar en «chk|chkno» resuelve
    # las dos por construccion, en vez de ir tapando cada autorreferencia una a una.
    uso=$(grep -nE "^(chk|chkno)[[:space:]].*[[:space:]]$h([[:space:]]|\$)" "$f" | head -1 | cut -d: -f1)
    [ -z "$uso" ] && continue
    if [ "$uso" -lt "$def" ]; then malos=$((malos+1)); out="$out $h(linea $uso antes de $def)"; fi
  done
  [ "$malos" -eq 0 ] && echo "ningun helper usado antes de definirse" || echo "helper mal colocado:$out"
}

chkno() {
  local name="$1" pat="$2"; shift 2
  salta "$name" && return
  local out; out="$("$@" 2>&1)"
  if revento "$out"; then bad "$name  (la herramienta reventó: no verifica nada)"; return; fi
  if printf '%s' "$out" | grep -q -- "$pat"; then bad "$name  (apareció: $pat)"; else pass "$name"; fi
}

V() { node "$WORK/docs/methodology/tools/verify-fdge.mjs" "$@"; }

# ─── Fixture ────────────────────────────────────────────────────────────────
build_fixture() {
  # PT-086 · con la seccion inactiva se monta un esqueleto VACIO y barato en vez del fixture.
  # No se devuelve sin mas: el andamiaje que viene detras —perl, cp, printf— opera sobre rutas
  # de $WORK, y sin ellas llenaria la salida de errores sobre archivos que no existen. Con el
  # esqueleto, esas ordenes hacen su trabajo sobre archivos inertes y no dicen nada.
  if [ -n "$AFECTADOS" ] && [ -z "$SEC_ACTIVA" ]; then
    rm -rf "$WORK"; mkdir -p "$WORK/docs/implementation" "$WORK/docs/methodology/tools" "$WORK/changes/PT-001-login"
    cd "$WORK"
    : > changes/PT-001-login/intake.md
    echo '{"allocations":[]}' > docs/implementation/REGISTRY.json
    return 0
  fi
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
    {"id":"PT-001","type":"BUG","severity":"S2","slug":"login","created":"2026-08-05","status":"DONE","phase":8,"structural":false,"viabilidad":{"veredicto":"SAFE","coste":{"valor":100,"naturaleza":"ESTIMADO"},"precedente":{"valor":300,"naturaleza":"MEDIDO"},"medido_en":"abc1234","fecha":"2026-08-06"},"suite_version":"5.2.0","branch":"fix/PT-001-login"},
    {"id":"PT-002","type":"INVESTIGATION","severity":"S3","slug":"pool","created":"2026-08-05","status":"CLOSED","phase":8,"structural":false,"viabilidad":{"veredicto":"SAFE","coste":{"valor":100,"naturaleza":"ESTIMADO"},"precedente":{"valor":300,"naturaleza":"MEDIDO"},"medido_en":"abc1234","fecha":"2026-08-06"},"suite_version":"5.2.0","branch":"investigate/PT-002-pool"},
    {"id":"PT-003","type":"CHORE","severity":"S4","slug":"typo","created":"2026-08-05","status":"DONE","phase":8,"structural":false,"viabilidad":{"veredicto":"SAFE","coste":{"valor":100,"naturaleza":"ESTIMADO"},"precedente":{"valor":300,"naturaleza":"MEDIDO"},"medido_en":"abc1234","fecha":"2026-08-06"},"suite_version":"5.2.0","branch":"chore/PT-003-typo"},
    {"id":"PT-004","type":"FEATURE","severity":"S3","slug":"pdf","created":"2026-08-06","status":"IN_PROGRESS","phase":4,"structural":false,"viabilidad":{"veredicto":"SAFE","coste":{"valor":100,"naturaleza":"ESTIMADO"},"precedente":{"valor":300,"naturaleza":"MEDIDO"},"medido_en":"abc1234","fecha":"2026-08-06"},"suite_version":"5.2.0"}
  ] }
J
  # Solo la PRIMERA aparición: la del proyecto. Las de cada allocation se dejan como están —
  # un PT abierto bajo una versión la conserva hasta cerrar (`SUITE-R18`), y el fixture debe
  # poder representar eso.
  perl -0pi -e "s/\"suite_version\":\"[\d.]+\"/\"suite_version\":\"$VIGENTE\"/" docs/implementation/REGISTRY.json

  # PT-044 · el `status` del YAML tiene que coincidir con el del registro: el fixture lo tenia
  # en READY para los cuatro mientras el registro decia DONE, CLOSED, DONE e IN_PROGRESS. Era el
  # mismo defecto que esta tarea persigue, dentro del arnes que la prueba.
  intake() { # $1 dir · $2 id · $3 type · $4 sev · $5 track · $6 complexity · $7 status
    mkdir -p "changes/$1"
    { printf -- '---\nid: %s\ntype: %s\nseverity: %s\ntrack: %s\ncomplexity: %s\nstatus: %s\n---\n\n' "$2" "$3" "$4" "$5" "$6" "${7:-READY}"
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

  intake PT-001-login       PT-001 BUG           S2 STANDARD STANDARD DONE
  intake PT-002-pool        PT-002 INVESTIGATION S3 STANDARD STANDARD CLOSED
  intake PT-003-typo        PT-003 CHORE         S4 EXPRESS  TRIVIAL DONE
  intake PT-004-pdf         PT-004 FEATURE       S3 STANDARD MAJOR IN_PROGRESS

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
reg_set() {
  # PT-086 · es una llamada a node, y por tanto cara. Con la seccion inactiva no se hace.
  [ -n "$AFECTADOS" ] && [ -z "$SEC_ACTIVA" ] && return 0
  node -e "
const fs=require('fs'); const p=process.argv[1];
const r=JSON.parse(fs.readFileSync(p,'utf8'));
(new Function('r', process.argv[2]))(r);
fs.writeFileSync(p, JSON.stringify(r,null,2));
" "$WORK/docs/implementation/REGISTRY.json" "$1"; }

# ─── A · casos límite bien formados ─────────────────────────────────────────
# PT-086 · qué secciones ejercitan lo que ha cambiado. Se deriva del PROPIO arnes —leyendo qué
# herramientas nombra cada seccion— y de `git diff`. Nada de una tabla a mano: 37 entradas serian
# un hecho copiado mas (RULE-01) y envejecerian con la primera seccion nueva.
if [ -n "$AFECTADOS" ]; then
  # MTH_CAMBIADAS permite probar LA PROPIA SELECCION sin depender del estado de git. Sin ella
  # no se puede comprobar que --afectados acota de verdad: el dia que se escribio, cinco
  # herramientas estaban tocadas —patrones entre ellas, que importan ocho— y la seleccion daba
  # casi todo. Correcto, y por eso mismo inutil como medicion.
  _cambiadas="${MTH_CAMBIADAS:-$(git -C "$RAIZ_REAL" diff --name-only HEAD -- docs/methodology/tools bin 2>/dev/null;
               git -C "$RAIZ_REAL" diff --name-only --cached -- docs/methodology/tools bin 2>/dev/null)}"
  SECCIONES_ACTIVAS=$(MTH_PAT="$SUITE/tools/patrones.mjs" MTH_ST="$SUITE/tools/selftest.sh"     MTH_CAMB="$_cambiadas" node -e "
      const {pathToFileURL}=require('url'); const fs=require('fs');
      import(pathToFileURL(process.env.MTH_PAT).href).then((m)=>{
        const t=fs.readFileSync(process.env.MTH_ST,'utf8');
        const c=(process.env.MTH_CAMB||'').split(/\s+/).filter(Boolean);
        process.stdout.write('|'+m.seccionesAfectadas(t,c).join('|')+'|');
      });")
  if [ -z "$_cambiadas" ]; then
    echo "--afectados: git no reporta cambios en tools/ ni bin/. Corren TODAS las secciones:"
    echo "  sin saber qué cambió no se puede saber qué sobra, y saltar sin dato es lo que"
    echo "  RULE-06 prohíbe. Para acotar, commitea o indexa lo que estés tocando."
    AFECTADOS=""
  else
    echo "--afectados · cambiaron: $(echo "$_cambiadas" | tr '
' ' ')"
    echo ""
  fi
fi

sec "── A · casos límite (deben pasar en verde) ──"
build_fixture
chk  "BUG validado, listo para G4"   "Sin errores" V --gate G4 PT-001
chk  "INVESTIGATION sin AC"          "Sin errores" V PT-002
chk  "CHORE en EXPRESS sin tests"    "Sin errores" V PT-003
chk  "FEATURE a medio camino"        "Sin errores" V PT-004
chk  "MAJOR con grafo fresco"        "Grafo FRESH" V PT-004

# ─── B · defectos inyectados ────────────────────────────────────────────────
sec "── B · defectos inyectados (deben detectarse) ──"

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

# PT-046 · FDGE-R29 · corregir una entrada de HISTORY sin editarla.
#
# SUITE-R09 ya prescribe el mecanismo —«una entrada nueva que lo referencia»— y FDGE-R29 lo
# cerraba: exactamente una entrada por PT, y la comprobacion leia SIEMPRE la primera. Tres
# reglas correctas por separado dejaban una entrada mal escrita bloqueando G4 para siempre.
# Lo encontro chocar contra el, no la busqueda que PT-029 proponia hace tres lotes.
#
# `mal_formada` reproduce el defecto real: Fecha y Estado condensados en una linea, que es
# como salieron las cuatro entradas de EP-011.
mal_formada() { perl -0pi -e 's/^Fecha: 2026-08-05\nEstado: DONE\n/Fecha: 2026-08-05 · Estado: DONE ·\n/m' "$WORK/docs/implementation/HISTORY.log"; }
corrige() { printf '\n## PT-001 — CORRIGE: el encabezado condensaba Fecha y Estado\nCorrige: la entrada de 2026-08-05\nMotivo: no declaraba «Estado:» en su propia linea (FDGE-R29)\nEstado: %s\nEstructural: %s\n' "${1:-DONE}" "${2:-no}" >> "$WORK/docs/implementation/HISTORY.log"; }

build_fixture; mal_formada
chk "entrada condensada bloquea G4"     "✗ FDGE-R34"        V --gate G4 PT-001
build_fixture; mal_formada; corrige
chk "y una CORRIGE la desbloquea"       "Sin errores"       V --gate G4 PT-001
build_fixture; mal_formada; corrige
chkno "la CORRIGE no cuenta como segunda" "✗ FDGE-R29"      V --gate G4 PT-001
# Estructural sale de la MISMA cabeza: corregir el Estado y dejar el Estructural leyendose de
# la entrada vieja seria corregir la mitad, que es peor que no corregir.
build_fixture; perl -0pi -e 's/^Estructural: no\n//m' "$WORK/docs/implementation/HISTORY.log"; corrige DONE si
chk "la CORRIGE tambien aporta Estructural" "✓ FDGE-R44"    V PT-001
# Con DOS correcciones manda la ULTIMA: corregir una correccion es legitimo y append-only.
build_fixture; mal_formada; corrige VALIDATION_PENDING; corrige DONE
chk "con dos correcciones manda la ultima" "Sin errores"    V --gate G4 PT-001
# Y los dos que TIENEN que fallar. Sin ellos esto seria una via para declarar trabajo que
# nunca ocurrio, y no lo sabriamos.
# PT-004 no tiene entrada en HISTORY —esta en PHASE 4—, asi que una CORRIGE suya no corrige nada.
build_fixture; printf '\n## PT-004 — CORRIGE: de la nada\nCorrige: la entrada de 2026-08-05\nEstado: DONE\nEstructural: no\n' >> "$WORK/docs/implementation/HISTORY.log"
chk "una CORRIGE huerfana falla"        "✗ FDGE-R29"        V PT-004
build_fixture
chkno "sin CORRIGE nada cambia"         "CORRIGE"           V --gate G4 PT-001

# PT-044 · SUITE-R35 hacia DENTRO. La regla dice que el registro asigna y todo lo demas espeja,
# y `tracker espejo` lo comprobaba solo contra la plataforma. El YAML del intake y la linea de
# indice son las OTRAS dos copias del mismo hecho, y nada las miraba: cuatro tareas de EP-011
# declararon «phase: 1» con el registro en 9, y eso APAGO FDGE-R52 sin que nada avisara. Un
# verificador que da verde por no haber mirado es lo que RULE-06 prohibe, dentro del verificador.
# Pone una clave en el YAML del intake: la sustituye si esta, y la ANADE si no. El fixture no
# declara `phase`, asi que sustituir a secas no hacia nada y el caso pasaba por no probar nada.
yaml_set() {
  if grep -qE "^$2:" "$WORK/changes/$1/intake.md"; then
    perl -0pi -e "s/^$2:.*\$/$2: $3/m" "$WORK/changes/$1/intake.md"
  else
    perl -0pi -e "s/^(id: .*\n)/\$1$2: $3\n/m" "$WORK/changes/$1/intake.md"
  fi
}

build_fixture; yaml_set PT-004-pdf phase 1
chk   "YAML y registro con fases distintas"  "SUITE-R35"     V PT-004
build_fixture; yaml_set PT-004-pdf phase 1
chk   "y dice cual de los dos se usa"        "Se usa el del intake"  V PT-004
build_fixture; yaml_set PT-004-pdf status DRAFT
chk   "YAML y registro con estados distintos" "SUITE-R35"    V PT-004
build_fixture; perl -0pi -e 's/IN_PROGRESS/READY/' "$WORK/docs/implementation/ENRICHMENT.md"
chk   "el indice tampoco puede contradecir"  "SUITE-R35"     V PT-004
# Los que NO deben avisar. Un verificador que avisa siempre es ruido, y el ruido se ignora.
build_fixture
chkno "si coinciden, ni una linea de mas"    "divergente"    V PT-004
build_fixture; reg_set "r.allocations.find(a=>a.id==='PT-004').phase=null"; yaml_set PT-004-pdf phase 4
chkno "sin fase en el registro no se inventa" "divergente"   V PT-004
# En G4 deja de ser aviso: alli el estado tiene que ser uno solo.
build_fixture; yaml_set PT-001-login phase 1
chk   "en G4 la divergencia BLOQUEA"         "✗ SUITE-R35"   V --gate G4 PT-001

# PT-047 · FDGE-R19 · la rama por PT. PHASE 5 manda «git checkout -b <type>/PT-XXX-slug» y
# PHASE 4 obliga a proponerla; los 46 PT de este repositorio se hicieron sobre «trabajo» y
# NADA lo detectaba: `grep "Rama:" verify-fdge.mjs` no devolvia una sola linea. El campo del
# formato canonico de HISTORY se escribia, se leia y no se contrastaba con nada.
#
# La rama va al REGISTRO y no a HISTORY: HISTORY se escribe en PHASE 8 y la rama nace en
# PHASE 5, asi que comprobarlo alli llega tres fases tarde. La rama ES estado.
build_fixture; reg_set "r.allocations.find(a=>a.id==='PT-004').phase=5"
chk   "un PT en PHASE 5 sin rama se reporta"  "FDGE-R19"     V PT-004
build_fixture; reg_set "r.allocations.find(a=>a.id==='PT-004').phase=5; r.allocations.find(a=>a.id==='PT-004').branch='feature/PT-004-pdf'"
chkno "con rama declarada, silencio"          "no declara rama"  V PT-004
build_fixture; reg_set "r.allocations.find(a=>a.id==='PT-004').phase=5"; yaml_set PT-004-pdf phase 5
chk   "en G4 la rama ausente BLOQUEA"         "✗ FDGE-R19"   V --gate G4 PT-004
# Los que NO deben avisar. Sin el primero esto exigiria rama retroactiva a 46 tareas ya
# integradas; sin el segundo, a toda tarea recien abierta. Un aviso que sale cuando no toca
# es la forma mas rapida de que se ignore el que si toca.
build_fixture; reg_set "r.allocations.find(a=>a.id==='PT-004').phase=9; r.allocations.find(a=>a.id==='PT-004').status='INTEGRATED'"
chkno "lo ya integrado no se retrofecha"      "no declara rama"  V PT-004
build_fixture
chkno "en PHASE 4 todavia no toca"            "no declara rama"  V PT-004
# La topologia, escrita donde manda y citada donde se ejecuta.
chk   "FDGE-R19 declara la topologia"         "rama de integración" cat "$SUITE/RULES.md"
chk   "y llega al nucleo"                     "FDGE-R19"     cat "$SUITE/CORE.md"
chk   "PHASES la cita"                        "PT-NNN-slug"  cat "$SUITE/PHASES.md"
chk   "SUITE-R42 dice PARA QUE rama"          "el del lote, no el de cada tarea" cat "$SUITE/RULES.md"
chk   "el CLAUDE.md declara las efimeras"     "PT-NNN-slug"  cat "$RAIZ/CLAUDE.md"

# PT-016 · SUITE-R08 · «phase» deja de ser opcional para un PT VIVO. Hasta hoy su ausencia salia
# SIN EVALUAR, que no aprueba ni bloquea —correcto por RULE-06— pero era GRATIS: apagaba de una
# vez traceability, manifest, self-review, FDGE-R52 y la rama de FDGE-R19, sin que nada fallara
# nunca. PT-044 cerro el caso de un «phase» que MIENTE; este es el de un «phase» que FALTA.
build_fixture; reg_set "delete r.allocations.find(a=>a.id==='PT-004').phase"
chk   "un PT vivo sin phase FALLA"            "✗ SUITE-R08"  V PT-004
build_fixture; reg_set "delete r.allocations.find(a=>a.id==='PT-004').phase"
chkno "y deja de repetirlo por artefacto"     "la exigencia de"  V PT-004
# Los que NO deben fallar. Un lote no tiene fase de TAREA y lo integrado no se retrofecha:
# exigirselo es pedir que se invente el dato, que es el mismo defecto con el signo cambiado.
build_fixture
chkno "con phase declarada, sin error"        "✗ SUITE-R08"  V PT-004
build_fixture; reg_set "r.allocations.push({id:'EP-099',type:'EP',slug:'x',created:'2026-08-06',status:'IN_PROGRESS',suite_version:'5.2.0'}); r.counters.EP=99"
chkno "un EP sin phase esta EXENTO"           "✗ SUITE-R08"  V EP-099
build_fixture; reg_set "const a=r.allocations.find(a=>a.id==='PT-004'); delete a.phase; a.status='INTEGRATED'"
chkno "lo ya integrado sin phase, exento"     "✗ SUITE-R08"  V PT-004
# Las plantillas: las de TAREA lo traen, la del LOTE no — ponerlo ahi ensenaria a rellenarlo
# con un numero inventado.
chk   "BUG-REPORT trae phase"                 "phase:"       cat "$SUITE/INTAKE/templates/BUG-REPORT.md"
chk   "FEATURE-REQUEST trae phase"            "phase:"       cat "$SUITE/INTAKE/templates/FEATURE-REQUEST.md"
chk   "CHANGE-REQUEST trae phase"             "phase:"       cat "$SUITE/INTAKE/templates/CHANGE-REQUEST.md"
chk   "TAREA trae phase"                      "phase:"       cat "$SUITE/INTAKE/templates/TAREA.md"
chkno "EPIC-INTAKE NO lo trae"                "^phase:"      cat "$SUITE/INTAKE/templates/EPIC-INTAKE.md"
chk   "la migracion avisa de que ahora falla" "DEJA DE SER UN AVISO"  cat "$SUITE/tools/migrate.mjs"
# SUITE-R38 · el patron critico vive en UN solo sitio y viaja con su contrato. Tres reglas de
# este mismo lote preguntaban lo mismo con su propia copia de la lista.
chk   "ESTADOS_TERMINALES en un solo sitio"   "ESTADOS_TERMINALES"  cat "$SUITE/tools/patrones.mjs"
# Y el caso que protege a los otros nueve: DONE NO es terminal. Un PT en DONE espera G4 y sigue
# vivo; anadirlo apagaria FDGE-R52, FDGE-R19 y SUITE-R08 A LA VEZ.
_et=$(sed -n '/^export const ESTADOS_TERMINALES/,/]);/p' "$SUITE/tools/patrones.mjs")
chk   "DONE NO es terminal"                   "^NO$" sh -c "printf '%s' \"$_et\" | grep -q \"'DONE'\" && echo SI || echo NO"

# PT-015 · SUITE-R26 · las HARD que DECIDEN algo emiten su ID al fallar.
#
# Tres herramientas existen POR una regla concreta, ejecutan su contrato y no la nombraban:
# verify-patrones es SUITE-R38, revisar-secretos es FND-R29, y tracker decide por SUITE-R47
# donde bloquea el espejo. No faltaba la comprobacion: faltaba que el fallo llevara a la regla
# — el defecto que SUITE-R53 corrigio para todo lo demas, dentro de las tres que mas lo pedian.
build_fixture
# Se rompe un patron EN EL FIXTURE para que el fallo ocurra de verdad, no se busca el ID en el
# fuente: un ID en un texto que nunca se imprime no cita nada.
perl -0pi -e "s/casa: \[/casa: ['\\\\x00NO_CASA_NUNCA\\\\x00', /" "$WORK/docs/methodology/tools/patrones.mjs"
chk   "verify-patrones cita SUITE-R38"        "SUITE-R38"  node "$WORK/docs/methodology/tools/verify-patrones.mjs"
build_fixture
# La clave se ENSAMBLA en dos mitades: si el fuente la contiene entera, el propio escaner la
# caza en este archivo y en la historia — y lo hizo, en el primer CI de PT-015. Es la clave de
# ejemplo que documenta AWS, no una emitida, pero eso no la hace menos detectable: un escaner
# que distinguiera «de ejemplo» de «real» no serviria para nada.
mkdir -p "$WORK/src" && printf 'const k = "AKIA%s";\n' 'IOSFODNN7EXAMPLE' > "$WORK/src/mal.js"
chk   "revisar-secretos cita FND-R29"         "FND-R29"    node "$WORK/docs/methodology/tools/revisar-secretos.mjs" "$WORK"
chk   "tracker cita SUITE-R47 al bloquear"    "SUITE-R47"  cat "$SUITE/tools/tracker.mjs"
# FDGE-R39 · un artefacto de PT en una ruta global. Es donde v3 los tenia y de donde migrate los
# saca; sin comprobacion, volver a ponerlos ahi no lo detecta nadie y dos PT en vuelo se destruyen.
build_fixture; printf '# PLAN\n' > "$WORK/docs/implementation/strategy.md"
chk   "un artefacto de PT en ruta global falla" "✗ FDGE-R39"  V PT-001
build_fixture
chkno "sin artefactos globales, silencio"     "en docs/implementation/"  V PT-001
# Y el alcance reducido, escrito donde manda.
chk   "SUITE-R26 declara que se cubre"        "un gate consulta"  cat "$SUITE/RULES.md"

# PT-044 · FDGE-R52 deja de exigir rastro a lo YA INTEGRADO. El reanclaje se escribe MIENTRAS se
# trabaja; pedirselo a un PT que ya paso G4 es pedir que se fabrique, y fabricarlo es peor que no
# tenerlo. Donde muerde sigue siendo G4, que corre con estado DONE — antes de integrar, no
# despues. Sin este limite, sincronizar los YAML de 32 PT cerrados ponia la CI en rojo y la unica
# salida practicable era dejar el YAML mintiendo: la regla empujaba al defecto que persigue.
build_fixture; rm -f "$WORK/changes/PT-001-login/bitacora.md"
chk   "un PT vivo sin bitacora falla"        "✗ FDGE-R52"    V PT-001
build_fixture; rm -f "$WORK/changes/PT-001-login/bitacora.md"
reg_set "r.allocations.find(a=>a.id==='PT-001').status='INTEGRATED'"; yaml_set PT-001-login status INTEGRATED
chkno "uno ya integrado, no: no se retrofecha" "✗ FDGE-R52"  V PT-001

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
sec "── D · migración ──"
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
# PT-017 · la lista se DERIVA restando los dos directorios. Estaba escrita a mano: nombraba 6 de
# 16 y no mencionaba regla.mjs ni audit.mjs, nacidas despues. Quien la lee es quien MENOS puede
# detectar que esta incompleta — esta migrando, no conoce la suite.
#
# El caso anterior asertaba «revisar-secretos» porque estaba en la CONSTANTE. Derivar lo rompio,
# con razon: ahora la lista dice lo que FALTA en el destino, y el fixture las tiene todas. Se
# quitan dos del destino para que la resta tenga algo que decir.
mk_v412; rm -f "$MIG/docs/methodology/tools/regla.mjs" "$MIG/docs/methodology/tools/revisar-secretos.mjs"
chk   "la lista sale de comparar"           "regla.mjs"        M
chk   "y nombra las dos que faltan"         "revisar-secretos" M
mk_v412
chk   "y conserva la frase que PT-043 usa"  "lo que llega nuevo"  cat "$SUITE/tools/migrate.mjs"
# Sin tools/ en el destino la resta da 16, y eso es cierto pero INUTIL como aviso.
mk_v412; rm -rf "$MIG/docs/methodology/tools"; cp "$SUITE"/tools/patrones.mjs "$MIG/docs/methodology/" 2>/dev/null
chk   "sin tools/ dice la suite entera"     "suite entera"  node "$SUITE/tools/migrate.mjs" "$MIG"
# Y el que evita el ruido: un destino al dia no produce fila.
mk_v412; cp "$SUITE"/tools/*.mjs "$MIG/docs/methodology/tools/" 2>/dev/null; cp "$SUITE"/tools/selftest.sh "$MIG/docs/methodology/tools/" 2>/dev/null
chkno "destino al dia, sin fila"            "llega nuevo"  M
mk_v412
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
sec "── E · reconciliación y migración verificada ──"
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
sec "── F · instalación ──"
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
sec "── G · robustez y seguridad ──"
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
cd /tmp && rm -rf bcx && mkdir bcx && cd bcx
# PT-050 · era el UNICO caso escrito a mano, con su propio if/pass/bad. Puenteaba el filtro
# de --solo y tambien revento(): un caso que se salta el arnes se salta todo lo que el
# arnes protege. Ahora entra por chk como los demas.
chk "build-core sin fuentes ⇒ mensaje claro"  "Falta la fuente"  node "$SUITE/tools/build-core.mjs" .
cd "$WORK" 2>/dev/null || true

# ─── H · lotes ───────────────────────────────────────────────────────────────
sec "── H · lotes ──"
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
sec "── I · PTSA por enumeración ──"
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

# ── PT-097 · PTSA-R08 · PTSA-R81 · PTSA-R82 · la letra se deriva o no se emite ────────────────
#
# PTSA-R08 exigia emitir A/B/C/F «auditable y defendible» y los umbrales se citaban en §24.2 y
# §24.4, que NO EXISTIAN — en las dos versiones, y lo midio tambien el proyecto legado (INC-007).
# Una auditoria inventó la banda «(75-89)» para poder cumplir; otra publico los tres scores y NO
# emitio letra. La segunda hizo lo correcto sin que ninguna regla se lo permitiera.
#
# PARECIA QUE HABIA QUE INVENTAR UNA CIFRA: cuatro letras y solo DOS anclas declaradas, 60 (§13.3,
# el cap de dominio) y 90 (§15.6). El error era de lectura — C NO ES UNA BANDA, ES UN TECHO, y lo
# dicen las dos unicas reglas que la nombran: PTSA-R30 «no puede clasificarse POR ENCIMA DE C» y
# §28.2 «bloquea certificacion >= B». Con eso la funcion sale entera de lo escrito.

# Las secciones existen. Son ROJOS VALIDOS: hoy §24 no tiene subsecciones.
chk "la especificacion define la clasificacion base"  "### 24.2" cat "$SUITE/PTSA/PTSA-V3-Especificacion-Oficial.md"
chk "…y los topes que la rebajan"                     "### 24.4" cat "$SUITE/PTSA/PTSA-V3-Especificacion-Oficial.md"
# Y lo que YA regia sigue donde estaba: §24 se renombra y gana 24.1 por encima, sin mover R38/R39.
chk "las transiciones de producto siguen en §24"      "PTSA-R38" cat "$SUITE/PTSA/PTSA-V3-Especificacion-Oficial.md"

# LO QUE ESTOS CASOS NO ESTABLECEN, y va aqui porque callarlo seria fabricar un verde: los que
# llaman a letraDeCertificacion NO estuvieron en rojo valido. La funcion no existia, asi que su
# fallo era «la herramienta revento», que este arnes trata —con razon— como «no verifica nada».
# FDGE-R17 pide un rojo que falle POR SU ASERCION. Son ESPECIFICACION, no reproduccion.
# Los rojos validos son los tres de arriba y el de la banda inventada, mas abajo.
VPLIB() { # $1 nombre · $2 patron · $3 entrada JSON
  mlib "$1" "$2" "$SUITE/tools/verify-ptsa.mjs" "const r=m.letraDeCertificacion($3); console.log(r.letra ?? ('SIN LETRA falta '+r.falta.join(',')));"
}
BASE="{health:95,confidence:95,freshness:'2026-08-20',healthUnstable:false,riesgoMaximo:5}"
VPLIB "Health 95 da A"                  "^A$"  "$BASE"
VPLIB "Health 79.9 da B"                "^B$"  "{...$BASE,health:79.9}"
VPLIB "Health 55 da F"                  "^F$"  "{...$BASE,health:55}"
# Los CUATRO topes parten de health 95, que sin tope da A. Si un tope no se aplicara, el caso
# devolveria A y fallaria — un caso que partiera de un Health ya bajo pasaria igual con el tope
# roto, y esa es la trampa que PT-096 documento.
VPLIB "freshness UNKNOWN topa en C"     "^C$"  "{...$BASE,freshness:null}"
VPLIB "un hallazgo CRITICO topa en C"   "^C$"  "{...$BASE,riesgoMaximo:12}"
VPLIB "health_unstable topa en B"       "^B$"  "{...$BASE,healthUnstable:true}"
VPLIB "Confidence < 90 impide la A"     "^B$"  "{...$BASE,confidence:89}"
# El freno de §24.3. Sin el, «no se emite letra» seria una frase en un documento; con el, la
# funcion no puede inventarse una letra aunque alguien quiera. Es RULE-06 y el precedente de
# PT-058, donde «restar(100 MEDIDO, SIN EVALUAR)» devolvia 100 ETIQUETADO COMO MEDIDO.
VPLIB "sin Confidence no hay letra"     "SIN LETRA falta Confidence"  "{...$BASE,confidence:null}"
VPLIB "…ni sin Health"                  "SIN LETRA falta Health"      "{...$BASE,health:null}"
# Y el que impide que el arreglo se pase de frenada en la otra direccion: con todo presente SI hay
# letra. Sin este, devolver siempre null pasaria los dos de arriba.
VPLIB "…y con todo presente SI la hay"  "^A$"  "$BASE"

# El orden NO importa: PTSA-R81 lo exige y es lo que hace la funcion determinista. Se comprueba
# que dos topes juntos den el PEOR, no el ultimo aplicado.
VPLIB "dos topes dan el peor, no el ultimo"  "^C$"  "{...$BASE,healthUnstable:true,riesgoMaximo:12}"

# verify-ptsa CONTRASTA la letra publicada. ROJO VALIDO hoy: el archivo no contiene «certificac».
chk "verify-ptsa contrasta la certificacion"  "letraDeCertificacion" cat "$SUITE/tools/verify-ptsa.mjs"
# PTSA-R82 · un tope que no se puede leer no se puede contrastar. Encontrado aplicando esto por
# primera vez: PTSA-2026-08-20 declaraba «con una metrica D5 en Rojo el techo es B» EN PROSA y no
# publicaba la bandera, asi que la comprobacion pasaba POR EL CAMINO EQUIVOCADO —por la base— y
# eso es indistinguible del correcto mirando solo el resultado.
chk "la especificacion exige publicar health_unstable"  "PTSA-R82" cat "$SUITE/PTSA/PTSA-V3-Especificacion-Oficial.md"

build_fixture
chkno "proyecto sin PTSA/ ⇒ no rompe"      "✗"          VP
build_fixture; mkdir -p "$WORK/PTSA"
chkno "PTSA/ sin auditoría ⇒ no rompe"     "✗"          VP
build_fixture
perl -0pi -e 's/<!-- fuentes: PTSA[^>]*-->/<!-- fuentes: PTSA\/x.md:000000000000 -->/' "$WORK/docs/methodology/CORE-PTSA.md"
chk  "overlay PTSA obsoleto ⇒ falla"       "CORE-PTSA.md está DESINCRONIZADO" node "$WORK/docs/methodology/tools/build-core.mjs" --check "$WORK/docs/methodology"

# ─── K · integridad del núcleo, firmas e irreversibles ───────────────────────
sec "── K · integridad y firmas ──"
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
sec "── J · QA y FPGE ──"
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
sec "── L · falsificación ──"
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
sec "── M · terreno ──"
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
sec "── N · implementación abierta ──"

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
sec "── O · continuidad ──"

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
sec "── P · plataforma ──"
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
  salta "$1" && return
  local out
  out="$(MTH_TRACKER="$SUITE/tools/tracker.mjs" node -e "const {pathToFileURL}=require(\"url\");
import(pathToFileURL(process.env.MTH_TRACKER).href).then((m)=>{ $3 }).catch((e)=>console.log(\"IMPORT_FALLA \"+e.message));" 2>&1)"
  if revento "$out"; then bad "$1  (la herramienta reventó: no verifica nada)"; return; fi
  if printf '%s' "$out" | grep -q -- "$2"; then pass "$1"; else bad "$1  (no apareció: $2 · salió: $out)"; fi
}

# PT-048 · el inverso de trlib, que NO EXISTIA. Se escribio un caso llamando a `trlibno` dando
# por hecho que estaba, y bash lo trato como «orden no encontrada»: el caso no corrio y el arnes
# NO se puso rojo — subio de 485 a 489 en vez de 490, y esa unica cifra fue todo el aviso.
# Un caso que no se ejecuta es peor que no tenerlo: ocupa el sitio del que si comprobaria.
trlibno() { # $1 nombre · $2 patron que NO debe aparecer · $3 cuerpo JS
  salta "$1" && return
  local out
  out="$(MTH_TRACKER="$SUITE/tools/tracker.mjs" node -e "const {pathToFileURL}=require(\"url\");
import(pathToFileURL(process.env.MTH_TRACKER).href).then((m)=>{ $3 }).catch((e)=>console.log(\"IMPORT_FALLA \"+e.message));" 2>&1)"
  if revento "$out"; then bad "$1  (la herramienta reventó: no verifica nada)"; return; fi
  if printf '%s' "$out" | grep -q -- "$2"; then bad "$1  (apareció: $2)"; else pass "$1"; fi
}

# PT-067 · lo mismo, pero contra patrones.mjs. Vive AQUI y no junto a sus casos porque un
# helper definido despues de su primer uso falla por «no encontrado» y no por el hecho — me
# paso dos veces en este lote (TRR en PT-076, RG2 en PT-066) y `lint_helpers` existe por eso.
patlib() { # $1 nombre · $2 patron esperado · $3 cuerpo JS que recibe el modulo como `m`
  salta "$1" && return
  local out
  out="$(MTH_PAT="$SUITE/tools/patrones.mjs" node -e "const {pathToFileURL}=require(\"url\");
import(pathToFileURL(process.env.MTH_PAT).href).then((m)=>{ $3 }).catch((e)=>console.log(\"IMPORT_FALLA \"+e.message));" 2>&1)"
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
# PT-096 · este caso CAMBIA DE SENTIDO, y no se hace pasar.
#
# Afirmaba que el cuerpo del lote enumera sus tareas en PROSA. Eso es exactamente lo que PT-035
# declaro defecto —«una tarea es SUB-ISSUE de su lote, NO un enlace en su cuerpo: un enlace no da
# progreso, no cierra en cascada y no sale en el arbol»— y lo que SUITE-R51 convirtio en regla
# HARD. PT-035 añadio el anidamiento y NO retiro la copia narrada, asi que las dos convivian: 14
# issues de lote la llevaban al medirlo.
#
# El orden de apertura que este bloque prueba SIGUE importando —el lote se crea despues que sus
# tareas para que el ANIDAMIENTO las encuentre—, y eso lo cubren los casos de arriba. Lo que ya
# no vale es la razon que este caso daba.
trlibno "el cuerpo del lote NO enumera en prosa"   "#77"   "console.log(m.cuerpoDeIssue({id:\"EP-9\",type:\"EP\",slug:\"x\"},{tareas:[{id:\"PT-90\",issue:77,title:\"t\"}]}))"


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
#
# PT-079 . y arregla el 404 SIMETRICO: la rama efimera se borra al fusionar (FDGE-R19), asi
# que el enlace que PT-036 hizo apuntar ahi moria con ella. 14 de 16 daban 404 al medirlo.
#
# Los dos tienen razon, y «refDurable» es la sintesis: el ref lo calcula el CONTEXTO mirando
# donde esta el contenido de verdad —la rama de integracion, o el commit—, en vez de
# deducirlo de en que rama corre el espejo. La intencion de estos casos NO cambia; cambia de
# donde sale el ref que comprueban.
trlib "lo vivo enlaza la rama de trabajo"     "tree/trabajo/"   "console.log(m.cuerpoDeIssue({id:'PT-94',slug:'x',status:'IN_PROGRESS'},{url:'https://h/r',rama:'main',refDurable:'trabajo'}))"
trlib "lo integrado enlaza la principal"      "tree/main/"   "console.log(m.cuerpoDeIssue({id:'PT-95',slug:'x',status:'INTEGRATED'},{url:'https://h/r',rama:'main',refDurable:'main'}))"
# PT-079 · este caso CAMBIA de sentido, y es el nucleo del arreglo. Caer en la principal
# cuando no se sabia la rama es LITERALMENTE lo que producia los enlaces muertos: apuntaba a
# un sitio que podia no contener el directorio. Ahora, sin ref durable, NO se enlaza — y se
# DICE (RULE-06). Un 404 silencioso es peor que una ruta sin enlace.
trlibno "sin ref durable NO cae en la principal" "tree/main/"  "console.log(m.cuerpoDeIssue({id:'PT-96',slug:'x',status:'IN_PROGRESS'},{url:'https://h/r',rama:'main'}))"
trlib   "…y lo dice en vez de callarlo"          "sin enlace"  "console.log(m.cuerpoDeIssue({id:'PT-96',slug:'x',status:'IN_PROGRESS'},{url:'https://h/r',rama:'main'}))"
# PT-048 · el cuerpo NO enlaza a un directorio que no existe. SUITE-R44 exime a un DEFERRED de
# tener artefactos y PT-036 dice donde apunta el enlace: las dos correctas, y juntas producian un
# 404 en el UNICO artefacto que un aplazado tiene. Se mira el directorio, no el estado: un PT
# recien asignado tampoco lo tiene hasta PHASE 1, y con el estado como criterio seguiria fallando.
trlib "sin directorio no enlaza"           "aplazada"  "console.log(m.cuerpoDeIssue({id:'PT-97',slug:'x',status:'DEFERRED'},{url:'https://h/r',rama:'main',hayDirectorio:false}))"
trlibno "y no deja una URL rota"           "tree/"     "console.log(m.cuerpoDeIssue({id:'PT-97',slug:'x',status:'DEFERRED'},{url:'https://h/r',rama:'main',hayDirectorio:false}))"
trlib "y cita la regla que lo exime"       "SUITE-R44" "console.log(m.cuerpoDeIssue({id:'PT-97',slug:'x',status:'DEFERRED'},{url:'https://h/r',rama:'main',hayDirectorio:false}))"
# Y la nota que EXPLICA el enlace tampoco sobrevive cuando no hay enlace: el primer intento dejo
# «sin artefactos todavia» con «el enlace apunta a…» justo debajo. Lo vio mirar el issue
# publicado, no leer el diff.
trlibno "sin enlace, no explica el enlace"  "El enlace apunta"  "console.log(m.cuerpoDeIssue({id:'PT-97',slug:'x',status:'DEFERRED'},{url:'https://h/r',rama:'main',hayDirectorio:false}))"
trlib "con directorio, el enlace sigue"    "tree/"     "console.log(m.cuerpoDeIssue({id:'PT-98',slug:'x',status:'IN_PROGRESS'},{url:'https://h/r',rama:'main',refDurable:'trabajo',hayDirectorio:true}))"
# El que protege a los demas: sin el dato, el comportamiento es el de HOY. Un undefined no es un
# «no existe», y tratarlo como tal apagaria el enlace en TODOS los cuerpos.
trlib "sin el dato, se comporta como hoy"  "tree/"     "console.log(m.cuerpoDeIssue({id:'PT-99',slug:'x',status:'IN_PROGRESS'},{url:'https://h/r',rama:'main',refDurable:'trabajo'}))"
# PT-096 · este caso CAMBIA DE SENTIDO, y no se hace pasar. Afirmaba que el cuerpo dice «donde el
# contenido existe ahora» cuando NO hay refDurable — es decir, codificaba el defecto como caso
# verde: la nota se emitia con «null» dentro, justo debajo de la linea que acababa de decir «sin
# enlace». Un caso que protege el defecto no es una red de seguridad.
# La otra mitad de su intencion —que CON ref durable el cuerpo diga donde esta— la cubre
# «lo vivo enlaza la rama de trabajo», ocho lineas mas arriba, que sigue verde.
trlibno "sin ref durable, tampoco dice donde esta"  "donde el contenido existe ahora"   "console.log(m.cuerpoDeIssue({id:'PT-97',slug:'x',status:'IN_PROGRESS'},{url:'https://h/r',rama:'main',ramaTrabajo:'trabajo'}))"
# ── PT-096 · SUITE-R51 · un enlace que FALTA no es un enlace roto ────────────
#
# PT-079 sustituyo «siempre un ref, a veces el equivocado» por «un ref durable, o ninguno», que
# es lo correcto, y no escribio la continuacion del «o ninguno». En PHASE 1 el intake acaba de
# escribirse y no esta commiteado: refDurableDe responde null CON RAZON, y nadie vuelve a
# preguntar. Medido sobre el tablero: 10 de 115 cuerpos publicados, que son los 11 issues
# abiertos desde el cierre de PT-079 menos el que se curo por casualidad al medirlo.
#
# Tres sitios con el MISMO supuesto —que el fallo de un enlace es que apunte MAL— y el de estos
# diez es que NO apunta: cuerpoDeIssue imprimia «apunta a null», repararEnlacesMuertos hacia
# «if (!ref) continue» y compararEspejo llevaba la misma guarda, asi que el espejo decia «cuadra».

# La nota que EXPLICA el enlace no sobrevive cuando no hay enlace. PT-048 arreglo esta MISMA
# contradiccion en la rama hermana (hayDirectorio === false) y no en esta: es su segunda instancia.
trlibno "sin ref durable, no explica el enlace"  "El enlace apunta"  "console.log(m.cuerpoDeIssue({id:'PT-96',slug:'x',status:'IN_PROGRESS'},{url:'https://h/r',rama:'main'}))"
# Separado del anterior a proposito: el de arriba ata la CONTRADICCION, este ata el SINTOMA que
# vio el firmante. Si alguien reescribe la nota y vuelve a colar un valor interno con otras
# palabras, este sigue cazandolo.
trlibno "el cuerpo nunca publica «null»"         "null"              "console.log(m.cuerpoDeIssue({id:'PT-96',slug:'x',status:'IN_PROGRESS'},{url:'https://h/r',rama:'main'}))"

# Un lote se reconoce por su IDENTIFICADOR. El registro guarda TRES valores para el mismo hecho
# —EP (16), ausente (2), EPIC (1)— porque LEXICON §8.1 enumera el «type» de una TAREA y no
# declara ninguno para un lote. El helper vive en patrones.mjs desde que sinSellar tropezo con
# lo mismo, y se IMPORTA: una tercera copia seria el defecto en miniatura (SUITE-R38).
trlib "el lote se reconoce por su ID"            "Implementación abierta"  "console.log(m.cuerpoDeIssue({id:'EP-19',type:'EPIC',slug:'x',title:'t'},{url:'https://h/r',rama:'main'}))"
trlib "…y tambien sin «type» ninguno"            "Implementación abierta"  "console.log(m.cuerpoDeIssue({id:'EP-17',slug:'x',title:'t'},{url:'https://h/r',rama:'main'}))"
trlib "un lote se etiqueta como implementacion"  "implementación"          "console.log(JSON.stringify(m.etiquetasDe({id:'EP-19',type:'EPIC',phase:1})))"
trlib "el lote va al final aunque su type sea EPIC"  "EP-19"               "console.log(m.ordenDeApertura([{id:'EP-19',type:'EPIC'},{id:'PT-1',type:'BUG'}]).at(-1).id)"

# PT-035 · «una tarea es SUB-ISSUE de su lote, NO un enlace en su cuerpo», y SUITE-R51 lo hizo
# regla HARD. PT-035 añadio el anidamiento —que funciona— y NO retiro la copia narrada: 14 issues
# de lote la llevaban al medirlo. Que esLote fuera falso para los tres ultimos lotes estaba
# TAPANDO la violacion, no causandola, asi que el arreglo es RETIRAR la lista y no hacerla salir.
#
# «type:'EP'» en el fixture NO es un descuido: es lo que hace VALIDO el rojo. Sin el, esLote es
# falso, la lista no se emite y este caso pasaria HOY — verde por el motivo contrario al que lo
# justifica. Se vio ejecutandolo, no leyendolo. Con EP casa los dos predicados, el viejo y el nuevo.
trlibno "el cuerpo del lote NO lista sus tareas"  "Tareas de este lote"  "console.log(m.cuerpoDeIssue({id:'EP-9',type:'EP',slug:'x',title:'t'},{url:'https://h/r',rama:'main',tareas:[{id:'PT-90',issue:77,title:'t'}]}))"

# La DECISION separada del EFECTO. repararEnlacesMuertos habla con la plataforma y escribe, asi
# que no se puede probar; la pregunta que hace —«¿este cuerpo esta bien?»— si. Cinco resultados
# con nombre, y REPARAR_MUDO no existia no porque estuviera mal decidido, sino porque no habia
# donde decidirlo: hoy se responde con dos «continue» repartidos en dos funciones.
#
# LO QUE ESTOS SEIS CASOS NO ESTABLECEN, y va escrito aqui porque callarlo seria fabricar un
# verde: NO estuvieron en rojo VALIDO. «decisionDeEnlace» no existia, asi que su fallo previo era
# «la herramienta revento», y este arnes trata eso como «no verifica nada» —con razon—. FDGE-R17
# pide un rojo que falle POR SU ASERCION, y el de una funcion inexistente no lo es.
# Son ESPECIFICACION de comportamiento nuevo, no reproduccion del defecto.
# La reproduccion de AC-04 esta medida donde si se puede: sobre el tablero real, en
# evidence/PT-096/salidas/ — diez cuerpos mudos que «abrir --aplicar» no repara.
# Los DIEZ casos que si estuvieron en rojo valido son los demas de este bloque.
trlib "un cuerpo mudo con ref durable se repara"  "REPARAR_MUDO"          "console.log(m.decisionDeEnlace(m.cuerpoDeIssue({id:'PT-96',slug:'x'},{url:'https://h/r',rama:'main'}),()=>true,'trabajo'))"
# El freno: sin ref durable NO se toca. Al abrir el issue no hay nada que enlazar todavia, y
# exigirlo entonces seria pedir un enlace a un commit que no existe.
trlib "…y sin ref durable NO se toca"             "MUDO_SIN_REF_DURABLE"  "console.log(m.decisionDeEnlace(m.cuerpoDeIssue({id:'PT-96',slug:'x'},{url:'https://h/r',rama:'main'}),()=>true,null))"
# El otro freno, y el que impide pasarse de frenada: refDeEnlace devuelve null para DOS cosas
# distintas —un cuerpo del tracker sin enlace, y un issue que el tracker no escribio—. Sin
# distinguirlas, «repara lo mudo» reescribiria issues ajenos, que es peor que el defecto.
trlib "un issue ajeno no es asunto del tracker"   "AJENO"                 "console.log(m.decisionDeEnlace('un issue escrito a mano por una persona',()=>true,'trabajo'))"
trlib "un enlace muerto sigue reparandose"        "REPARAR_MUERTO"        "console.log(m.decisionDeEnlace(m.cuerpoDeIssue({id:'PT-94',slug:'x'},{url:'https://h/r',rama:'main',refDurable:'trabajo'}),()=>false,'trabajo'))"
trlib "y uno sano se deja en paz"                 "OK"                    "console.log(m.decisionDeEnlace(m.cuerpoDeIssue({id:'PT-94',slug:'x'},{url:'https://h/r',rama:'main',refDurable:'trabajo'}),()=>true,'trabajo'))"
# PT-079 ya declaraba este caso —«queda roto y consta»— y era una rama de if sin nombre. Tenerlo
# nombrado es lo que impide que se confunda con OK, que es lo que pasa hoy: los tres caen por el
# mismo «continue» que el cuerpo sano.
trlib "un enlace roto sin salida CONSTA"          "ROTO_SIN_SALIDA"       "console.log(m.decisionDeEnlace(m.cuerpoDeIssue({id:'PT-94',slug:'x'},{url:'https://h/r',rama:'main',refDurable:'trabajo'}),()=>false,null))"
# PT-096 · la nota se deriva de A DONDE APUNTA, no de si la allocation esta viva. Decia «la rama
# por defecto» para toda terminal, y refDurableDe prefiere la de INTEGRACION: los veinte cuerpos
# reparados quedaban llamando «rama por defecto» a «trabajo», que no lo es. Un enlace correcto con
# una nota falsa al lado es el «null» en version suave, y se vio mirando el issue PUBLICADO.
trlibno "una terminal en trabajo no lo llama rama por defecto"  "la rama por defecto"  "console.log(m.cuerpoDeIssue({id:'PT-1',slug:'x',status:'INTEGRATED'},{url:'https://h/r',rama:'main',refDurable:'trabajo'}))"
trlib   "…y en main SI lo dice"                                 "la rama por defecto"  "console.log(m.cuerpoDeIssue({id:'PT-1',slug:'x',status:'INTEGRATED'},{url:'https://h/r',rama:'main',refDurable:'main'}))"
# PT-096 · y la otra mitad, que es de refDurableDe y no de cuerpoDeIssue: SUITE-R51 dice
# literalmente «la rama de trabajo mientras la allocation esta viva, LA RAMA POR DEFECTO cuando
# llega a INTEGRATED». refDurableDe devolvia SIEMPRE la de integracion, asi que una tarea ya
# integrada enlazaba a «trabajo» y su cuerpo publicaba «al integrarse pasara a main» sobre trabajo
# que YA estaba en main. Lo vio mirar el issue #14 recien republicado, no leer la regla.
#
# El orden de preferencia se comprueba aqui como DATO —terminal antes por defecto, viva antes
# integracion— porque refDurableDe habla con git y no es probable desde el arnes.
chk "SUITE-R51 · una terminal prefiere la rama por defecto"  "terminal ? \[porDefecto, integracion\]"   cat "$SUITE/tools/tracker.mjs"
# RIE-4 · esCuerpoDelTracker reconoce por el MARCADOR que cuerpoDeIssue escribe. Si alguien cambia
# ese texto, la reparacion dejaria de reconocer sus propios cuerpos EN SILENCIO. Este caso ata las
# dos cosas: cambiar el texto rompe un caso en vez de apagar la reparacion.
trlib "cuerpoDeIssue escribe el marcador que la reparacion busca"  "Intake, criterios de aceptación y evidencia:"  "console.log(m.cuerpoDeIssue({id:'PT-99',slug:'x'},{url:'https://h/r',rama:'main',refDurable:'trabajo'}))"
# Y el otro extremo del mismo hilo: lo que el cuerpo ESCRIBE, refDeEnlace lo LEE. Sin este, un
# cambio en la forma de la URL apagaria la reparacion por el otro lado.
trlib "lo que el cuerpo escribe, refDeEnlace lo lee"  "trabajo"  "console.log(m.refDeEnlace(m.cuerpoDeIssue({id:'PT-94',slug:'x',status:'IN_PROGRESS'},{url:'https://h/r',rama:'main',refDurable:'trabajo'})))"

# El espejo REPORTA el cuerpo mudo. Hoy no: «if (ref && …)» — sin ref no hay divergencia, que es
# como nace todo cuerpo. Por eso «tracker espejo» decia «el espejo cuadra» con diez rotos.
#
# El fixture lleva sus ETIQUETAS correctas, y no es cosmetico: sin ellas compararEspejo devuelve
# un SUITE-R35 por las etiquetas y el caso pasaria a verde el dia que el cuerpo mudo dejara de
# detectarse — verde por la divergencia equivocada. Comprobado ejecutandolo.
V96="{id:'PT-96',slug:'x',status:'IN_PROGRESS',issue:191,phase:5}"
CUERPO_MUDO="m.cuerpoDeIssue($V96,{url:'https://h/r',rama:'main'})"
I96="{number:191,body:$CUERPO_MUDO,labels:m.etiquetasDe($V96).map((n)=>({name:n}))}"
trlib "el espejo ve el cuerpo mudo"          "SUITE-R51"  "console.log(JSON.stringify(m.compararEspejo([$V96],[$I96],[$V96],()=>true,()=>'trabajo')))"
trlib "y dice como se corrige"               "abrir --aplicar"  "console.log(JSON.stringify(m.compararEspejo([$V96],[$I96],[$V96],()=>true,()=>'trabajo')))"
# No dispara si TODAVIA no hay ref durable: al abrir el issue no hay nada que enlazar. Dispara en
# cuanto el intake entra en un commit, que es el primer momento en que se puede arreglar.
trlib "sin ref durable todavia, no acusa"    "VACIO"      "const d=m.compararEspejo([$V96],[$I96],[$V96],()=>true,()=>null); console.log(d.length?d.map((x)=>x.regla).join(' '):'VACIO')"
# El que protege a los doce casos que llaman con CUATRO argumentos: un undefined no es un «no hay»
# (RULE-06). Se serializa a VACIO en vez de asertar contra «[]», que para grep es una CLASE DE
# CARACTERES (PT-085, PT-090) — y ademas, al fallar, dice QUE regla aparecio en vez de «no caso».
trlib "sin el resolvedor, se comporta como hoy"  "VACIO"  "const d=m.compararEspejo([$V96],[$I96],[$V96],()=>true); console.log(d.length?d.map((x)=>x.regla).join(' '):'VACIO')"

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

# PT-045 · el arranque documentado no arrancaba, y el binario NO decia por que. Los codigos de
# salida ya eran correctos —0 sin subcomando, 2 con uno desconocido— pero los dos casos imprimian
# exactamente lo mismo: la unica diferencia era un numero que nadie ve. Alguien en una version
# anterior a la que trae `start` recibia una ayuda muda donde `start` no aparecia, y concluia que
# el manual mentia. Es lo que SUITE-R53 corrigio para las reglas, sin corregir aqui.
C() { node "$RAIZ/bin/cauce.mjs" "$@"; }
codigo_cauce() { node "$RAIZ/bin/cauce.mjs" "$@" >/dev/null 2>&1; echo $?; }

chk   "un subcomando que no existe lo dice"  "no es un subcomando"  C arrancar
chk   "y nombra el subcomando"               "«arrancar»"           C arrancar
chk   "y dice la version que corre"          "$VIGENTE"             C arrancar
chk   "y da la salida por si es una copia vieja" "@latest"          C arrancar
chk   "su codigo de salida sigue siendo 2"   "^2$"                  codigo_cauce arrancar
# Los que NO deben cambiar: pedir ayuda no es un error, y confundirlos en la direccion contraria
# seria el mismo defecto con otro signo.
chkno "sin subcomando NO es un error"        "no es un subcomando"  C
chk   "y su codigo sigue siendo 0"           "^0$"                  codigo_cauce
chkno "--help tampoco es un error"           "no es un subcomando"  C --help
# El arranque QUE FUNCIONA dentro de cauce: npx resuelve el paquete local y no hay binario, ni
# debe haberlo (SUITE-R41). Eso no es un defecto: es estar autoalojado, y se DECLARA.
chk   "npm start apunta al arranque"         "cauce.mjs start"      cat "$RAIZ/package.json"
chk   "el manual declara el caso autoalojado" "npm start"           cat "$SUITE/MANUAL.md"
chk   "y el catalogo tambien"                "npm start"            cat "$SUITE/CASOS-DE-USO.md"

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
sec "── Q · secretos ──"
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
OPC='{url:"https://github.com/o/r",rama:"main",refDurable:"main",tareas:[{id:"PT-1",issue:5,title:"uno"},{id:"PT-2",issue:6,title:"dos"}]}'
trlib "el EP no se niega a si mismo"      "^LIMPIO$"   "console.log(/sin implementación/.test(m.cuerpoDeIssue($EP1,$OPC))?\"HAY\":\"LIMPIO\")"
trlib "y dice que ES una implementacion"  "Implementación abierta"   "console.log(m.cuerpoDeIssue($EP1,$OPC))"
trlib "el enlace es absoluto"             "https://github.com/o/r"   "console.log(m.cuerpoDeIssue($EP1,$OPC))"
# PT-096 · TERCERA instancia de lo mismo, y no la vi al planificar: encontre las de :1614 y :1787
# leyendo, y esta la encontro la BATERIA COMPLETA en rojo. Buscar por lectura da dos de tres.
#
# Afirmaba que el cuerpo del lote enumera sus tareas con su numero de issue: la copia narrada que
# PT-035 declaro defecto y SUITE-R51 prohibe. Se invierte por el mismo motivo que las otras dos.
#
# Lo que este bloque prueba de PT-010 sigue intacto y son las TRES lineas de arriba: que el lote
# no se niegue a si mismo, que diga lo que es, y que el enlace sea ABSOLUTO. Eso ultimo importa
# mas de lo que parecia: diez issues de EP-001 y EP-002 siguen publicando hoy un enlace RELATIVO
# —el defecto que PT-010 arreglo en el codigo y que nadie republico—, y son 404 desde entonces.
trlibno "el cuerpo del lote NO enumera con su issue"   "#5"   "console.log(m.cuerpoDeIssue($EP1,$OPC))"
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

# PT-055 . SUITE-R45 — la compuerta del lote que CIERRA mira al lote que ABRE.
#
# El 2026-08-15, cerrando EP-013 con EP-014 recien abierto, «--gate G4 EP-013» bloqueo por las
# cuatro filas de EP-014, que describian trabajo aun no hecho. EP-013 estaba en verde.
#
# Son DOS defectos y hacen falta los dos casos: enG4 era global (gate === 'G4' sin mirar QUE
# lote se evalua) y —la causa de fondo— verify-fdge NUNCA acepto un EP-NNN como objetivo, asi
# que «--gate G4 EP-013» dejaba targets vacio y la herramienta jamas supo que lote evaluaba.
#
# El riesgo de este arreglo es AFLOJAR G4, y por eso la mitad de los casos comprueban que
# SIGUE bloqueando: E2 el lote objetivo, E5 sin objetivo, E6 un lote DONE. Un caso que pase
# con y sin el arreglo no prueba nada (PT-050).
dos_lotes() {  # EP-050 en verde · EP-051 con una fila sin resolver · $1 = lote de PT-001
  for L in EP-050 EP-051; do
    mkdir -p "$WORK/changes/$L-lote"
    { echo "# $L — lote"; echo; echo "## Objetivo común"; echo "x"; echo;
      echo "## Criterio de éxito del lote"; echo "x"; echo;
      echo "## Análisis de solapamiento"; echo "x"; echo;
      echo "## Qué NO entra"; echo "- OUT: y"; echo;
      echo '\`\`\`'; echo "Firmado por: Alberto Martínez"; echo "Fecha: 2026-08-13"; echo '\`\`\`'; echo;
      echo "| PT | Tipo |"; echo "|:---|:---|"; echo "| PT-001 | BUG |"; echo;
      echo "## Cierre del lote"; echo;
      echo "| Qué | Estado |"; echo "|:---|:---|";
      if [ "$L" = EP-050 ]; then echo "| Entrada de CHANGELOG | HECHO |"; else echo "| Entrada de CHANGELOG | pendiente |"; fi
    } > "$WORK/changes/$L-lote/intake.md"
  done
  reg_set "r.allocations.push({id:'EP-050',type:'EP',slug:'lote',created:'2026-08-13',status:'DONE',suite_version:'6.0.1'});
           r.allocations.push({id:'EP-051',type:'EP',slug:'lote',created:'2026-08-13',status:'IN_PROGRESS',suite_version:'6.0.1'});
           r.allocations.find((a)=>a.id==='PT-001').epic='$1'; r.counters.EP=51"
}

# E1 · AC-01 — el lote que cierra esta en verde y hay otro abierto en rojo.
# La asercion es sobre el ERROR, no sobre la MENCION: checkEpics recorre todos los lotes y
# nombra EP-051 en avisos legitimos —INTAKE-R09, el aviso de filas sin resolver—. Lo que no
# puede haber es un SUITE-R45 en ROJO cuando el lote evaluado tiene sus filas resueltas.
build_fixture; dos_lotes EP-050
chkno "el lote que cierra no mira al que abre"    "✗ SUITE-R45"  V --gate G4 EP-050
# E2 · AC-02 — y el que cierra SI bloquea cuando le toca. Esta es la mitad que impide aflojar G4.
build_fixture; dos_lotes EP-051
chk   "…y el que cierra SI bloquea si le toca"    "✗ SUITE-R45"  V --gate G4 EP-051
# E3 · AC-03 — un EP-NNN se acepta como objetivo. Antes se descartaba EN SILENCIO.
#
# La asercion NO puede ser «que la salida mencione EP-050»: checkEpics() recorre todos los
# lotes y los nombra igual, asi que el caso pasaba EN VACIO —comprobado antes de implementar,
# y es la trampa que PT-050 documenta—. Se exige que la herramienta DIGA que lote evalua.
build_fixture; dos_lotes EP-050
chk   "EP-NNN se acepta como objetivo"            "bajo evaluacion: EP-050"  V --gate G4 EP-050
build_fixture; dos_lotes EP-050
chkno "…y sin objetivo no nombra ninguno"         "bajo evaluacion:"         V --gate G4
# E4 · AC-04 — el lote sale del «epic» del PT nombrado.
# La asercion va sobre la linea «bajo evaluacion», que es lo unico que dice QUE lote se
# evalua. Sobre la mencion no vale: checkEpics nombra los dos lotes en avisos legitimos, y
# asertar su ausencia hace que el caso falle por trabajo correcto.
build_fixture; dos_lotes EP-051
chk   "el lote sale del epic del PT"              "bajo evaluacion: EP-051"  V --gate G4 PT-001
build_fixture; dos_lotes EP-051
chkno "…y no arrastra al otro lote"               "bajo evaluacion: EP-050"  V --gate G4 PT-001
# E5 · AC-05 — sin objetivo se evaluan TODOS. Acotar aqui seria el agujero.
build_fixture; dos_lotes EP-050
chk   "sin objetivo se evaluan todos"             "✗ SUITE-R45"  V --gate G4
# E6 · AC-06 — un lote DONE exige sus filas resueltas aunque no se pase --gate.
build_fixture; dos_lotes EP-050
reg_set "r.allocations.find((a)=>a.id==='EP-051').status='DONE'"
chk   "un lote DONE exige sus filas sin --gate"   "✗ SUITE-R45"  V PT-001


# ─── PT-075 · las dos reglas que nada ejecutaba ──────────────────────────────
sec "── PT-075 · viabilidad registrada y actos hacia la plataforma ──"

# A · FDGE-R54. PT-059 diseño la compuerta, LEXICON 6.5d le dio vocabulario y tracker la
# calcula — y durante cuatro lotes NINGUNA regla la exigio, NINGUNA fase la abrio y NINGUN
# verificador la echo en falta. E1 y E2 existen para que eso no pueda repetirse en silencio.
chk   "PHASE 4 cita la viabilidad"           "FDGE-R54"     cat "$SUITE/PHASES.md"
chk   "…y el prompt de G2 tambien"           "FDGE-R54"     cat "$SUITE/FDGE-Prompts.md"
chk   "…y la regla existe con su severidad"  "FDGE-R54"     cat "$SUITE/RULES.md"

# E3 · sin veredicto registrado, G2 no se resuelve.
#
# PT-081 · el fixture nace en 5.2.0 y FDGE-R54 rige DESDE LA 10.0.0: cada regla declara ahora su
# version de entrada en vez de compartir una constante. El caso cambia de FORMA y no de
# intencion — sigue midiendo que sin veredicto registrado G2 no se resuelve—, y de paso deja
# escrito que la regla no alcanza a lo escrito antes de existir.
build_fixture
reg_set "const a=r.allocations.find((x)=>x.id==='PT-001'); a.suite_version='10.0.0'; delete a.viabilidad"
chk   "sin viabilidad registrada, G2 falla"  "✗ FDGE-R54"   V --gate G2 PT-001
# E4 · antes de G2 AVISA y no bloquea: en PHASE 1 la tarea no tiene complejidad con la que estimar.
build_fixture
reg_set "const a=r.allocations.find((x)=>x.id==='PT-001'); a.suite_version='10.0.0'; a.phase=2; delete a.viabilidad"
chkno "…pero antes de G2 solo avisa"         "✗ FDGE-R54"   V PT-001
# E5 · con veredicto registrado, pasa.
build_fixture
reg_set "r.allocations.find((a)=>a.id==='PT-001').viabilidad={veredicto:'SAFE',coste:{valor:100,naturaleza:'ESTIMADO'},medido_en:'abc1234',fecha:'2026-08-19'}"
chkno "con viabilidad registrada, G2 pasa"   "✗ FDGE-R54"   V --gate G2 PT-001
# E6 · UNSAFE detiene. PT-059: exige evidencia EN CONTRA, asi que no es una duda.
build_fixture
reg_set "const a=r.allocations.find((x)=>x.id==='PT-001'); a.suite_version='10.0.0'; a.phase=5; a.viabilidad={veredicto:'UNSAFE',coste:{valor:9,naturaleza:'MEDIDO'},medido_en:'abc1234',fecha:'2026-08-19'}"
chk   "UNSAFE en PHASE 5 detiene"            "✗ FDGE-R54"   V PT-001

# B · SUITE-R42. La regla dice DOS cosas y solo se comprobaba que el PR EXISTA. Esta es la otra
# mitad: el trabajo de un PT escrito directamente en la rama de integracion en vez de llegar por
# su pull request.
#
# E9 y E10 son las que impiden el falso positivo, y no son decorado: la PRIMERA ejecucion de
# esta comprobacion acuso a los commits de PHASE 2-4 de la propia PT-075, que estan
# legitimamente en la rama de integracion porque la rama efimera nace en PHASE 5 (FDGE-R19).
git_lote() {  # $1 = rama declarada del PT-001 · $2 = «directo» para escribir en integracion
  ( cd "$WORK"
    git init -q . 2>/dev/null
    git config user.email t@t; git config user.name T
    git add -A >/dev/null 2>&1
    git commit -qm "base del fixture" >/dev/null 2>&1
    git branch -M trabajo >/dev/null 2>&1
    git checkout -q -b "$1" >/dev/null 2>&1
    git commit -q --allow-empty -m "fix: PT-001 el trabajo en su rama" >/dev/null 2>&1
    git checkout -q trabajo >/dev/null 2>&1
    [ "$2" = directo ] && git commit -q --allow-empty -m "fix: PT-001 escrito en la rama de integracion" >/dev/null 2>&1
    [ "$2" = merge ] && git merge -q --no-ff "$1" -m "Merge pull request de PT-001" >/dev/null 2>&1
    true ) >/dev/null 2>&1
}

# E8 · escrito en integracion DESPUES de ramificar: es el acto que la regla prohibe.
build_fixture; git_lote fix/PT-001-login directo
chk   "un PT escrito en la rama de integracion falla"  "✗ FDGE-R19"   V PT-001
# E9 · lo que llego por MERGE no cuenta: --first-parent lo ve como un commit de merge.
build_fixture; git_lote fix/PT-001-login merge
chkno "…pero lo integrado por su PR no"                "✗ FDGE-R19"   V PT-001
# E10 · sin rama declarada no se retrofecha (FDGE-R19: pedirsela a lo ya hecho es pedir que se invente).
build_fixture
reg_set "delete r.allocations.find((a)=>a.id==='PT-001').branch"
git_lote fix/PT-001-login directo
chkno "…y sin rama declarada tampoco se acusa"         "✗ FDGE-R19"   V PT-001

# E11 · EXEC-R07 · lo que no se automatiza se DESCRIBE. Si el agente ejecuto en vez de describir,
# la descripcion falta. No prueba que no lo ejecutara —SUITE-R27 tampoco prueba quien firmo—:
# convierte la afirmacion en contrastable.
build_fixture
reg_set "r.allocations.find((a)=>a.id==='PT-001').phase=9"
chk   "en PHASE 9 sin acciones-humanas.md, falla"      "acciones-humanas"  V PT-001
build_fixture
reg_set "r.allocations.find((a)=>a.id==='PT-001').phase=9"
printf 'G4 · merge del lote\n' > "$WORK/changes/PT-001-login/acciones-humanas.md"
chkno "…y con el comando descrito, pasa"               "acciones-humanas"  V PT-001

# ─── R · el reanclaje escrito y la condición de cierre ───────────────────────
sec "── R · bitácora y cierre ──"

# FDGE-R53 · una tarea sin condición de cierre no tiene final: se estira.
build_fixture
perl -0pi -e 's/Termina cuando:.*
//' "$WORK/changes/PT-001-login/intake.md"
chk   "sin condición de cierre ⇒ falla"      "✗ FDGE-R53"  V PT-001
build_fixture
printf 'Termina cuando: el login acepta la contraseña correcta
' >> "$WORK/changes/PT-001-login/intake.md"
chkno "con condición de cierre ⇒ pasa"       "✗ FDGE-R53"  V PT-001

# ─── PT-081 · una regla nueva no rige hacia atras ────────────────────────────
#
# verify-fdge tenia UNA constante —DESDE = [5,1,0]— gobernando TRES comprobaciones de reglas
# nacidas en versiones distintas. Medido en el CHANGELOG tomando la ULTIMA aparicion de cada ID,
# porque el archivo va de mas nuevo a mas viejo y la primera es la mencion mas reciente:
#
#   FDGE-R52  nace en 5.0.0    y se trataba como 5.1.0
#   FDGE-R53  nace en 5.1.0    y se trataba como 5.1.0   correcto
#   FDGE-R54  nace con EP-017  y se trataba como 5.1.0   regia sobre el 12 de agosto
#
# Consecuencia real: un proyecto instalado en 8.2.0 que actualizara veia fallar --gate G2 en
# toda tarea en vuelo sin «viabilidad» — por una regla que no existia cuando se escribieron. Y
# la guia de migracion de la 9.0.0 dice que ningun proyecto instalado tiene que hacer nada.
patlib "una regla nueva NO rige sobre una tarea vieja" "^false$" \
  "console.log(m.rigeDesde('FDGE-R54','8.2.0'))"
patlib "…y SI sobre una posterior"                     "^true$"  \
  "console.log(m.rigeDesde('FDGE-R54','10.0.0'))"
patlib "…y la version exacta cuenta"                   "^true$"  \
  "console.log(m.rigeDesde('FDGE-R53','5.1.0'))"
patlib "…y una anterior por un parche NO"              "^false$" \
  "console.log(m.rigeDesde('FDGE-R53','5.0.9'))"
# Sin fila rige SIEMPRE: eximir de mas es peor que exigir de mas — una regla que no se aplica a
# nadie no protege. El caso contrario lo caza reglasNuevasSinVersion.
patlib "una regla sin fila rige siempre"               "^true$"  \
  "console.log(m.rigeDesde('QA-R01','1.0.0'))"

# Y la comprobacion completa: la MISMA tarea, la MISMA falta, dos versiones. Por separado cada
# caso pasaria con un rigeDesde que devolviera siempre lo mismo; el PAR es lo que mide.
#
# Con reg_set, que ya existe. Mi primera version usaba perl sobre el JSON y no casaba: el
# fixture es 5.2.0 y yo buscaba una forma que no tenia. Sexta vez que un patron mio no casa
# con lo real, y la que lo dijo fue la bateria, no leerlo.
build_fixture
reg_set "const a=r.allocations.find((x)=>x.id==='PT-001'); a.suite_version='8.2.0'; a.status='IN_PROGRESS'; a.phase=5; delete a.viabilidad"
chkno "8.2.0 sin viabilidad ⇒ FDGE-R54 NO alcanza" "✗ FDGE-R54"  V --gate G2 PT-001
build_fixture
reg_set "const a=r.allocations.find((x)=>x.id==='PT-001'); a.suite_version='10.0.0'; a.status='IN_PROGRESS'; a.phase=5; delete a.viabilidad"
chk   "10.0.0 sin viabilidad ⇒ FDGE-R54 SI alcanza" "✗ FDGE-R54"  V --gate G2 PT-001

# AC-08 · lo que impide la CUARTA. «Nueva» es NO EXISTIA ANTES, no «no aparece en el CHANGELOG»:
# probe el segundo criterio y devolvio 69 —casi todas fundacionales, anteriores al propio
# CHANGELOG— y una lista con 69 falsos positivos es una lista que nadie mira.
patlib "una regla nueva sin version se señala"  "FDGE-R99" \
  "console.log(JSON.stringify(m.reglasNuevasSinVersion([{id:'FDGE-R99',sev:'HARD'}],['FDGE-R01'])))"
patlib "…y una que ya existia, no"              "^\[\]$"   \
  "console.log(JSON.stringify(m.reglasNuevasSinVersion([{id:'FDGE-R01',sev:'HARD'}],['FDGE-R01'])))"
patlib "…y una nueva CON su fila, tampoco"      "^\[\]$"   \
  "console.log(JSON.stringify(m.reglasNuevasSinVersion([{id:'FDGE-R54',sev:'HARD'}],['FDGE-R01'])))"
# RULE-06 · sin saber que habia antes no se sabe que es nuevo, y suponer que todo lo es da la
# misma lista inutil. Se devuelve null, que es distinguible de la lista vacia.
patlib "sin la version anterior ⇒ null"         "^null$"   \
  "console.log(JSON.stringify(m.reglasNuevasSinVersion([{id:'X-R1',sev:'HARD'}],null)))"

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
sec "── S · patrones ──"

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
sec "── C · metodología ──"
chk   "verify-suite en verde"    "Sin errores" node "$SUITE/tools/verify-suite.mjs" "$SUITE"



# ─── PT-080 · una regla no se define dos veces ──────────────────────────────
#
# La v3 tenia la misma regla escrita a mano en cuatro documentos y las cuatro divergieron: ocho
# defectos criticos, incluido un ruleset que ordenaba destruir datos. La v4 corrige la causa —
# y en la v9 seguian TRES asi, con las tres copias YA divergidas y siempre en la misma
# direccion: la de EXECUTION-MODES soltaba una obligacion.
#
#   FDGE-R22  RULES exige «solo severity: S1» y cinco fases retroactivas. La copia, ninguna:
#             dejaba el carril HOTFIX abierto a un S3, y ese carril difiere G2 y G3.
#   FDGE-R40  RULES exige que los solapados SE SERIALICEN. La copia lo omitia.
#   FDGE-R41  RULES exige que el EP-NNN pase a BLOCKED. La copia lo omitia.
#
# verify-suite comprobaba cinco cosas y NO esta — la unica por la que se escribio la v4.
DOSDOC="{'A.md':'| \`X-R1\` | HARD | a |','B.md':'\`X-R1\` · b'}"
patlib "un ID en dos documentos se detecta"     "X-R1" \
  "console.log(JSON.stringify(m.definidasDosVeces($DOSDOC)))"
patlib "…y dice DONDE estan las dos copias"     "A.md" \
  "console.log(JSON.stringify(m.definidasDosVeces($DOSDOC)))"
patlib "…y el otro sitio tambien"               "B.md" \
  "console.log(JSON.stringify(m.definidasDosVeces($DOSDOC)))"
# Decir «hay conflicto» sin nombrar los dos sitios obliga a buscarlos a mano — y el mensaje de
# PT-066 acusaba a quien citaba una regla en vez de senalar donde estaba el problema.
patlib "un ID en un solo documento NO se detecta" '^\[\]$' \
  "console.log(JSON.stringify(m.definidasDosVeces({'A.md':'| \`X-R1\` | HARD | a |'})))"
# Las DOS formas de PT-066: tabla en RULES.md, prosa en LEXICON y EXECUTION-MODES.
patlib "…y reconoce las dos formas de definicion" "Y-R2" \
  "console.log(JSON.stringify(m.definidasDosVeces({'A.md':'\`Y-R2\` · prosa','B.md':'| \`Y-R2\` | SOFT | tabla |'})))"

# El repositorio REAL, que es donde importa. Y verify-suite FALLA, no avisa: LEX-R22 dice que
# ningun documento salvo RULES.md enuncia obligaciones, y SUITE-R38 prohibe dos fuentes del
# mismo hecho. Las dos son HARD.
chk   "verify-suite invoca el detector"  "definidasDosVeces"  cat "$SUITE/tools/verify-suite.mjs"
chk   "…y ninguna regla esta duplicada"  "Sin errores"  node "$SUITE/tools/verify-suite.mjs" "$SUITE"
chkno "EXECUTION-MODES ya no DEFINE FDGE-R22"  "^\`FDGE-R22\` ·"  cat "$SUITE/EXECUTION-MODES.md"
chkno "…ni FDGE-R40"                           "^\`FDGE-R40\` ·"  cat "$SUITE/EXECUTION-MODES.md"
chkno "…ni FDGE-R41"                           "^\`FDGE-R41\` ·"  cat "$SUITE/EXECUTION-MODES.md"
# Pero las SIGUE citando: el documento explica como se ejecuta un lote y necesita nombrarlas.
# Lo que no puede es ENUNCIARLAS (LEX-R22).
chk   "…pero las sigue citando"                "FDGE-R22"  cat "$SUITE/EXECUTION-MODES.md"
# Y la obligacion que cada copia habia perdido esta EN RULES, que es donde vive.
chk   "la serializacion de FDGE-R40 consta"    "se serializan"  cat "$SUITE/RULES.md"
chk   "…y el EP a BLOCKED de FDGE-R41"         "BLOCKED"        cat "$SUITE/RULES.md"

# ─── PT-083 · la plantilla del paquete pasa su propio verificador ────────────
sec "── PT-083 · PT-084 · lo que la prueba de fuego encontro ──"
#
# RE_SEVERITY exigia fin de linea tras S2, y las plantillas que EL PAQUETE DISTRIBUYE traen un
# comentario ahi. Quien instala el paquete, copia su plantilla y la rellena, fallaba FDGE-R04 —
# el camino que el MANUAL describe. Los otros CINCO campos del YAML ya toleraban el comentario:
# severity era el unico incoherente con sus vecinos.
#
# AC-05 · lo que impide la PROXIMA no es el arreglo: es este caso. Rellena cada plantilla del
# paquete tal como se distribuye y la pasa por verify-fdge. Sin el, una plantilla puede volver a
# divergir de su verificador sin que nada lo diga — PT-075 aplicado a los artefactos que viajan.
for _plt in BUG-REPORT FEATURE-REQUEST CHANGE-REQUEST; do
  build_fixture
  cp "$SUITE/INTAKE/templates/$_plt.md" "$WORK/changes/PT-001-login/intake.md"
  # Se rellena SOLO lo que el humano rellena; los comentarios en linea se dejan COMO VIENEN,
  # que es precisamente lo que rompia.
  perl -0pi -e 's/^id: PT-XXX.*$/id: PT-001/m; s/^created: YYYY-MM-DD.*$/created: 2026-08-05/m;
                s/^status: DRAFT.*$/status: DONE/m; s/^phase: 1\s*#/phase: 8   #/m;
                s/^Reportado por:\s*$/Reportado por: Alberto Martinez/m;
                s/^Solicitado por:\s*$/Solicitado por: Alberto Martinez/m;
                s/^Validado por:\s*$/Validado por: Alberto Martinez/m;
                s/^Fecha:\s*$/Fecha: 2026-08-05/m;' "$WORK/changes/PT-001-login/intake.md"
  printf '\nTermina cuando: el login acepta la contrasena correcta\n' >> "$WORK/changes/PT-001-login/intake.md"
  chkno "la plantilla $_plt no falla FDGE-R04" "✗ FDGE-R04"  V PT-001
done
# Y sigue rechazando lo invalido: el arreglo no puede haber abierto la puerta.
build_fixture
perl -0pi -e 's/^severity: S\d.*$/severity: S9/m' "$WORK/changes/PT-001-login/intake.md"
chk   "una severidad invalida SIGUE fallando"  "✗ FDGE-R04"  V PT-001
build_fixture
perl -0pi -e 's/^severity: S\d.*$/severity:/m' "$WORK/changes/PT-001-login/intake.md"
chk   "…y una vacia tambien"                   "✗ FDGE-R04"  V PT-001

# ─── PT-084 · la plataforma es opcional o no lo es ──────────────────────────
#
# avanzar exigia --nota, la nota exigia issue y el issue exigia plataforma. Y FDGE-R52 hace de
# avanzar la UNICA forma sancionada de cambiar de fase: un proyecto sin tablero no avanzaba NI
# UNA FASE. Mientras tanto SUITE-R22 declara soportado el equipo de una persona y migrate
# escribia «OPCIONAL — sin ella no cambia nada». Lo midio PT-072 no declarandola a proposito.
#
# La salida facil era hacerla obligatoria: rompe SUITE-R22, que es una promesa del marco.
build_fixture
reg_set "delete r.tracker"
# El intake del fixture no declara «phase», y avanzar lo exige para sincronizar (SUITE-R08).
# No es cosa de PT-084: lo dijo el propio arnes en cuanto `chk` empezo a enseñar la salida.
printf 'phase: 8
' >> "$WORK/changes/PT-001-login/intake.md"
chk   "sin plataforma, avanzar FUNCIONA"       "PHASE 8 -> 9"  TR avanzar PT-001 --a 9 --nota "sin tablero"
chk   "…y la nota va al ledger"                "TRANSICIONES.log"  sh -c 'cat "$1/docs/implementation/TRANSICIONES.log" >/dev/null 2>&1 && echo TRANSICIONES.log' _ "$WORK"
chk   "…con el cuerpo de la transicion"        "PHASE 8"  sh -c 'cat "$1/docs/implementation/TRANSICIONES.log"' _ "$WORK"
# FDGE-R52 NO se relaja: la nota sigue siendo obligatoria, solo cambia donde vive.
build_fixture
reg_set "delete r.tracker"
chk   "…y --nota SIGUE siendo obligatoria"     "exige --nota"  TR avanzar PT-001 --a 9
# Con plataforma, nada cambia: la nota va al issue como siempre.
chk   "migrate ya no promete lo que no cumple" "SIGUE FUNCIONANDO"  cat "$SUITE/tools/migrate.mjs"

# ─── PT-085 · el sello de version ───────────────────────────────────────────
sec "── PT-085 · el sello ──"
#
# Cinco defectos con una raiz comun: el marco REGISTRA lo que pasa y no comprueba que lo
# registrado siga siendo cierto. DOS de ellos —SUITE-R34 y FDGE-R43— son literalmente el mismo
# error, verificar un proxy barato en vez del hecho, y los dos gobiernan compuertas.

# A · el bloque ESTADO se contrasta con el registro. El criterio es la CONTRADICCION y no la
# omision: exigir exhaustividad convertiria el bloque en un volcado del registro —dos fuentes
# del mismo hecho— y el handoff existe justo para lo que el registro NO puede decir.
ALLOC="[{id:'PT-001',status:'INTEGRATED'},{id:'PT-002',status:'IN_PROGRESS'},{id:'EP-001',status:'CLOSED'}]"
patlib "un handoff que miente sobre una tarea CAE" "PT-001" \
  "console.log(JSON.stringify(m.contradiceElRegistro('tarea:  PT-001 sigue en curso',$ALLOC)))"
patlib "…y uno correcto PASA"                      '^\[\]$' \
  "console.log(JSON.stringify(m.contradiceElRegistro('tarea:  PT-002 en PHASE 5',$ALLOC)))"
# Sin este segundo, un verificador que fallara SIEMPRE cumpliria el primero. Es la leccion de
# PT-067: el complemento no es adorno, es lo que distingue verificar de acusar.
patlib "un lote declarado ABIERTA y cerrado, CAE"  "EP-001" \
  "console.log(JSON.stringify(m.contradiceElRegistro('implementación: EP-001 ABIERTA · x',$ALLOC)))"
# La linea real enumera las INTEGRADAS despues de las vivas. Contarlas seria acusar al texto
# CORRECTO — el falso positivo que apaga la comprobacion.
patlib "…y enumerar las cerradas NO cuenta"        '^\[\]$' \
  "console.log(JSON.stringify(m.contradiceElRegistro('tarea:  PT-002 en curso. INTEGRADAS: PT-001.',$ALLOC)))"

# C · SUITE-R57 · la deuda se cuenta por LOTE CERRADO.
#
# La definicion ingenua —toda INTEGRATED que no este en el tag— daba 13 contra un umbral de 3,
# y el sello de la version ES el lote abierto: G2 bloqueada sin salida. Un candado con la llave
# dentro, el mismo error que esta tarea corrige en FDGE-R43.
DEUDA="[{id:'EP-009',status:'IN_PROGRESS'},{id:'PT-010',status:'INTEGRATED',epic:'EP-009'},{id:'PT-011',status:'INTEGRATED',epic:'EP-008'}]"
patlib "las tareas de un lote ABIERTO no cuentan"  '^\["PT-011"\]$' \
  "console.log(JSON.stringify(m.sinSellar($DEUDA,[])))"
patlib "…y lo ya sellado tampoco"                  '^\[\]$' \
  "console.log(JSON.stringify(m.sinSellar($DEUDA,['PT-011'])))"
# RULE-06 · sin saber que hay sellado no se sabe que falta, y suponerlo bloquearia todo.
patlib "sin poder leer el tag ⇒ null"              '^null$' \
  "console.log(JSON.stringify(m.sinSellar($DEUDA,null)))"
# Un lote se reconoce por su ID y no por «type»: lo escribi con type==='EP' y no caso NINGUNO,
# porque EP-017 no tiene ese campo. El ID lo asigna el registro y siempre esta (SUITE-R08).
patlib "el lote se reconoce por su ID, no por type" '^\["PT-011"\]$' \
  "console.log(JSON.stringify(m.sinSellar($DEUDA,[])))"

# D · los documentos de entrada se RESUELVEN, no se actualizan. Exigir que cambien produciria
# retoques cosmeticos para acallar la comprobacion — fabricar un verde, en documentacion.
patlib "un acta vacia deja los cinco sin resolver" "MANUAL.md" \
  "console.log(JSON.stringify(m.selloSinResolver('')))"
patlib "…ACTUALIZADO resuelve"                     "^false$" \
  "console.log(m.selloSinResolver('| \`MANUAL.md\` | ACTUALIZADO | x |').includes('MANUAL.md'))"
# NO PROCEDE sin motivo NO resuelve: la celda vacia es indistinguible de la que nadie miro,
# igual que en LAYOUT.md (FND-R22).
patlib "…y NO PROCEDE sin motivo NO resuelve"      "^true$" \
  "console.log(m.selloSinResolver('| \`MANUAL.md\` | NO PROCEDE |  |').includes('MANUAL.md'))"
patlib "…y con motivo si"                          "^false$" \
  "console.log(m.selloSinResolver('| \`MANUAL.md\` | NO PROCEDE | ningun caso cambia |').includes('MANUAL.md'))"

# E · la deriva de CONTENIDO del grafo. FDGE-R43 miraba «structural: true» —crear, mover,
# renombrar o eliminar— y en todo el registro UNA allocation lo tenia: 12 de 16 archivos
# cambiados y el veredicto era FRESH.
patlib "un archivo movido de mtime se detecta"     "x.mjs" \
  "console.log(JSON.stringify(m.derivaDelGrafo({'x.mjs':{mtime:100}},()=>200)))"
patlib "…y uno intacto no"                         '^\[\]$' \
  "console.log(JSON.stringify(m.derivaDelGrafo({'x.mjs':{mtime:100}},()=>100)))"
patlib "…y uno que ya no existe, si"               "no existe" \
  "console.log(JSON.stringify(m.derivaDelGrafo({'x.mjs':{mtime:100}},()=>null)))"
patlib "sin manifiesto ⇒ null"                     '^null$' \
  "console.log(JSON.stringify(m.derivaDelGrafo(null,()=>100)))"

# AC-14 · que lo digan las INSTRUCCIONES, no solo la regla. PT-079 lo demostro: una regla sin
# fase que la abra no se cumple. Los cinco sitios, otra vez.
chk   "SUITE-R57 existe con su severidad"   "SUITE-R57"  cat "$SUITE/RULES.md"
chk   "…y PHASES la cita"                   "SUITE-R57"  cat "$SUITE/PHASES.md"
# La asercion casa con lo que el prompt DICE —«tracker.mjs sellar»—, no con lo que yo creia que
# decia. Septima vez en el lote que una asercion no coincide con la salida real, y la unica
# forma de saberlo sigue siendo ejecutarla.
chk   "…y el prompt de G4 tambien"          "tracker.mjs sellar"  cat "$SUITE/FDGE-Prompts.md"
chk   "…y llega a CORE"                     "SUITE-R57"  cat "$SUITE/CORE.md"
chk   "…y el MANUAL lo cuenta"              "sellar una versión"  cat "$SUITE/MANUAL.md"
chk   "sellar exige la bateria COMPLETA"    "COMPLETA"   cat "$SUITE/PHASES.md"


# PT-081 · AC-08 · el detector de reglas nuevas sin version de entrada.
#
# La inversa de verdad —quitar la fila de FDGE-R54 y ver saltar el aviso— NO cabe aqui, y el
# motivo es el propio diseño: el detector compara contra «origin/main», asi que fuera de un
# repositorio con ese remoto devuelve null y no inventa nada (RULE-06). Sobre una copia del
# fixture, que no es un repositorio, callaria SIEMPRE — y un caso que pasa por vacio es
# exactamente lo que lint_aserciones existe para enumerar.
#
# Lo intente sobre $SUITE restaurando con «git checkout». Es lo que PT-076 prohibe —el arnes no
# escribe en el repositorio real— y habria dejado patrones.mjs roto si la bateria se interrumpia
# en medio. La inversa se ejecuto A MANO sobre el repositorio, y consta en la evidencia.
#
# Lo que SI se fija aqui son las dos mitades: que el detector funciona —arriba, con patlib— y
# que verify-suite lo INVOCA. Sin esto, desconectarlo no costaria ningun rojo.
chk   "verify-suite invoca el detector"  "reglasNuevasSinVersion"  cat "$SUITE/tools/verify-suite.mjs"
# Y que sin poder leer la version anterior CALLA, en vez de acusar al universo entero.
rm -rf "$WORK/suite81"; mkdir -p "$WORK/suite81"; cp -r "$SUITE"/. "$WORK/suite81/"
chkno "sin version anterior legible, no acusa" "es una regla HARD nueva" \
  node "$WORK/suite81/tools/verify-suite.mjs" "$WORK/suite81"
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

# ─── PT-067 · el denominador es el universo, y una mencion no es un verificador ──
#
# audit derivaba las reglas de un regex PROPIO que solo leia filas de RULES.md: 183 de las 223
# que el marco define, fuera las 26 LEX-* y las 14 EXEC-* —entre ellas EXEC-R04, merge humano,
# y EXEC-R07, describir el comando—. Y `t.includes(id)` daba por verificada cualquier regla
# cuyo ID apareciera en un comentario: 20 asi, incluida FDGE-R17, que PT-079 acababa de
# declarar NO comprobable en TD-16. Publicar como verificada una regla que sabemos que no lo
# esta es la peor forma del error.
#
# Es el gemelo de PT-066: aquel arreglo a quien CONSULTA una regla, este a quien las CUENTA.
# Los dos leian RULES.md como si fuera el unico documento propietario, y LEX-R21 dice tres.

# E1 · el universo sale de los TRES documentos.
LEER3='const d={"RULES.md":"| `AAA-R01` | HARD | x |","LEXICON.md":"`LEX-R01` · x","EXECUTION-MODES.md":"`EXEC-R01` · x"};'
patlib "el universo sale de los tres documentos" "AAA-R01 LEX-R01 EXEC-R01" \
  "$LEER3 console.log(m.reglasDelMarco((f)=>d[f]).map(r=>r.id).join(' '))"
patlib "…y cada una dice de que documento"  "RULES.md LEXICON.md EXECUTION-MODES.md" \
  "$LEER3 console.log(m.reglasDelMarco((f)=>d[f]).map(r=>r.doc).join(' '))"

# E2 · un ID definido DOS veces cuenta UNA, y gana el propietario. Hoy pasa de verdad con
# FDGE-R22, R40 y R41 (-> PT-080): contar 226 por una duplicidad seria medir mal el arreglo.
DUP='const d={"RULES.md":"| `FDGE-R22` | HARD | fuerte |","EXECUTION-MODES.md":"`FDGE-R22` · debil"};'
patlib "un ID definido dos veces cuenta UNA"  "^1$" \
  "$DUP console.log(m.reglasDelMarco((f)=>d[f]).length)"
patlib "…y gana el documento propietario"     "^RULES.md$" \
  "$DUP console.log(m.reglasDelMarco((f)=>d[f])[0].doc)"

# E3 · las filas PTSA-R* de RULES.md usan otra forma y ya se auditan en su bloque. Excluirlas
# esta bien; lo que faltaba era DECIRLO — un OUT sin caso es una intencion, no un limite.
patlib "una fila sin severidad no entra"      "^0$" \
  "const d={'RULES.md':'| \`PTSA-R14\` | A1 | Evidencia sobre opinion |'}; console.log(m.reglasDelMarco((f)=>d[f]).length)"

# E4 · una mencion en COMENTARIO no es un verificador. Son 20, con FDGE-R17 dentro.
#
# El resultado esperado es la lista VACIA, y aserirla con "^$" NO funciona: una salida vacia no
# tiene lineas, asi que grep no casa nada y el caso falla diciendo que el codigo esta mal cuando
# lo que esta mal es la asercion. Se serializa con JSON.stringify y se exige "[]" — un valor
# observable en vez de una ausencia. Me costo una corrida entera de la bateria averiguarlo.
patlib "una mencion en comentario NO verifica" '^\[\]$' \
  "console.log(JSON.stringify(m.verificadoresDe('FDGE-R17',[['x.mjs','// FDGE-R17 · por eso se hizo asi']])))"
# E5 · el arnes prueba las herramientas; no lo ejecuta ninguna compuerta. Son 5, y SUITE-R41
# —cauce se instala sobre si mismo— es la premisa de toda esta sesion.
patlib "citada solo por selftest NO verifica"  '^\[\]$' \
  "console.log(JSON.stringify(m.verificadoresDe('SUITE-R41',[['selftest.sh','chk SUITE-R41']])))"
# E6 · el complemento. Sin el, un criterio que no contara NADA pasaria E4 y E5 igual.
patlib "citada en codigo real SI verifica"     "^v.mjs$" \
  "console.log(m.verificadoresDe('SUITE-R41',[['v.mjs','fail(\"SUITE-R41\", msg)']]).join(' '))"

# E7 · sobre el repositorio de verdad. Por FORMA y por CONSISTENCIA, nunca por valor exacto:
# fijar «223» seria un hecho copiado (RULE-01) dentro de la bateria que existe para cazarlos.
cat > "$WORK/universo.mjs" <<'MJS'
import { execFileSync } from 'node:child_process';
const o = execFileSync(process.execPath, [process.env.MTH_AUDIT, process.env.MTH_SUITE], { encoding: 'utf8' });
const u = o.match(/universo\s+(\d+)/);
const e = o.match(/ejecutadas por una compuerta\s+(\d+)\s*\/\s*(\d+)/);
// El numero va EN MEDIO de la linea, no al final: «citadas sin compuerta que las corra   12
// → --sin-compuerta las enumera». Anclar en $ no casaba y el caso decia SIN_CIFRAS, que parece
// un fallo del codigo y era un fallo de la asercion.
const s = o.match(/citadas sin compuerta que las corra\s+(\d+)/);
const v = o.match(/sin verificador\s+(\d+)/);
if (!u || !e || !s || !v) { console.log('SIN_CIFRAS'); process.exit(0); }
const total = +u[1], suma = +e[1] + +s[1] + +v[1];
console.log(total === +e[2] && total === suma ? 'CUADRA ' + total : `NO_CUADRA universo=${total} den=${e[2]} suma=${suma}`);
MJS
chk   "la suma de las clases ES el universo"  "CUADRA" \
  env MTH_AUDIT="$SUITE/tools/audit.mjs" MTH_SUITE="$SUITE" node "$WORK/universo.mjs"
chk   "el universo declara sus tres origenes" "LEXICON.md"  A "$SUITE"
chk   "…y el mayor de los tres"               "RULES.md"    A "$SUITE"

# E8 · el desglose DERIVA sus dos numeros. Sin el, quien vea caer 114 -> 96 pensara que se
# rompio algo; con un texto a mano, envejece en el primer cambio de RULES.md.
chk   "el desglose dice cuantas se anadieron"  "reglas que el denominador no miraba"  A "$SUITE"
chk   "…y cuantas dejaron de contar"           "dejaron de contar por una MENCIÓN"    A "$SUITE"
chk   "…y cuantas eran solo del arnes"         "sólo en selftest.sh"                  A "$SUITE"
# El desglose DERIVA sus dos numeros. Se comprueba sobre la FUENTE y no sobre la salida: en la
# salida el «+40» aparece igual venga de una plantilla o de una constante, asi que un caso
# contra la salida daria verde con la cifra escrita a mano. Es RULE-01 aplicada al caso mismo,
# y lo dijo escribirlo mal primero: mi version anterior era «chkno "+40  reglas"» CONTRA LA
# SALIDA — habria fallado siempre, porque la salida dice «+40» cuando la medida da 40.
chkno "el desglose no lleva cifras a mano"     "+40  reglas"   cat "$SUITE/tools/audit.mjs"

# audit ya no puede tener su propia derivacion: seria la tercera copia del mismo hecho, y
# PT-066 arreglo la de regla.mjs mientras esta se quedaba como estaba (SUITE-R38).
chk   "audit no deriva las reglas por su cuenta" "reglasDelMarco" cat "$SUITE/tools/audit.mjs"

# ─── PT-020 · el alcance del grafo cubre el codigo propio ───────────────────
# El grafo se genero un dia sobre `bin` y ahi se quedo: 18 nodos, todos de cauce.mjs, mientras
# 16 herramientas quedaban fuera. FDGE-R43 daba FRESH sobre lo que no habia mirado — una regla
# que puede dar verde sin haber leido el codigo no verifica el codigo, verifica una fecha.
# Estos casos no comprueban que el grafo sirva (eso no es mecanizable, y test-scenarios.md lo
# declara): comprueban que el ALCANCE no vuelva a dejar fuera la mitad del ejecutable.
G() { node -e '
  const r = JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8"));
  const g = r.graph ?? {};
  const dirs = String(g.scope ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const ultimo = Math.max(0, ...r.allocations.map((a) => Number(String(a.id).split("-")[1]) || 0));
  console.log("SCOPE " + dirs.join(" | "));
  console.log(dirs.includes("bin") && dirs.includes("docs/methodology/tools") ? "CUBRE_CODIGO_PROPIO" : "ALCANCE_INCOMPLETO");
  // El alcance nombra directorios, no el repositorio entero: FND-R28 deja fuera dependencias,
  // compilacion y fixtures, y `changes/` son directorios de markdown, no modulos.
  console.log(dirs.some((d) => d === "." || d === "/" || d.startsWith("changes")) ? "ALCANCE_DESBORDADO" : "ALCANCE_ACOTADO");
  // pt_at_generation en 0 hace que el grafo nazca STALE: FDGE-R43 compara contra los PT
  // estructurales integrados DESDE su generacion, y con 0 son todos.
  console.log(Number(g.pt_at_generation) > 0 && Number(g.pt_at_generation) <= ultimo ? "ANCLADO" : "SIN_ANCLAR " + g.pt_at_generation);
' "$RAIZ/docs/implementation/REGISTRY.json"; }

# ─── PT-058 · cada cifra dice de qué naturaleza es ─────────────────────────
# Decision 4 del firmante: distinguir MEDIDO, ESTIMADO y SIN EVALUAR, y NUNCA presentar una
# estimacion como una medicion.
#
# PHASE 2 midio que estas palabras YA se usaban: «SIN EVALUAR» 50 veces en trece archivos —seis
# documentos normativos, incluido RULES.md, y siete herramientas— y CERO en LEXICON, que es lo que
# LEX-R21 prohibe. Y los 50 usos eran PROSA: sobre prosa no hay forma de que «una cifra sin
# naturaleza» falle, asi que esto es un TIPO.
sec "── PT-058 · la naturaleza de una cifra ──"

PL() { # $1 nombre · $2 patron · $3 cuerpo JS que recibe patrones.mjs como `m`
  salta "$1" && return
  local out
  out="$(MTH_PAT="$SUITE/tools/patrones.mjs" node -e "const {pathToFileURL}=require(\"url\");
import(pathToFileURL(process.env.MTH_PAT).href).then((m)=>{ $3 }).catch((e)=>console.log(\"IMPORT_FALLA \"+e.message));" 2>&1)"
  if revento "$out"; then bad "$1  (la herramienta reventó: no verifica nada)"; return; fi
  if printf '%s' "$out" | grep -q -- "$2"; then pass "$1"; else bad "$1  (no apareció: $2 · salió: $out)"; fi
}
PLNO() { # el inverso
  salta "$1" && return
  local out
  out="$(MTH_PAT="$SUITE/tools/patrones.mjs" node -e "const {pathToFileURL}=require(\"url\");
import(pathToFileURL(process.env.MTH_PAT).href).then((m)=>{ $3 }).catch((e)=>console.log(\"IMPORT_FALLA \"+e.message));" 2>&1)"
  if revento "$out"; then bad "$1  (la herramienta reventó: no verifica nada)"; return; fi
  if printf '%s' "$out" | grep -q -- "$2"; then bad "$1  (apareció: $2 · salió: $out)"; else pass "$1"; fi
}

# E1-E3 · la naturaleza va CON el valor, y no se le puede quitar despues.
PL "una cifra lleva su valor"          "\"valor\":1974"          "console.log(JSON.stringify(m.cifra(1974,m.MEDIDO)))"
PL "…y su naturaleza"                  "\"naturaleza\":\"MEDIDO\""  "console.log(JSON.stringify(m.cifra(1974,m.MEDIDO)))"
PL "…y ESTIMADO tambien"               "ESTIMADO"                "console.log(JSON.stringify(m.cifra(1974,m.ESTIMADO)))"
# Congelada: si se pudiera reetiquetar despues, la naturaleza seria una sugerencia.
PL "la cifra es INMUTABLE"             "^MEDIDO$"                "const c=m.cifra(1,m.MEDIDO);try{c.naturaleza=\"ESTIMADO\";}catch(e){};console.log(c.naturaleza)"

# E4-E6 · AC-04 · una cifra sin naturaleza no entra. Es lo que hace comprobable todo lo demas.
PL "sin naturaleza LANZA"              "no declarada"            "try{m.cifra(1974);console.log(\"NO_LANZO\")}catch(e){console.log(e.message)}"
PL "una cuarta naturaleza LANZA"       "no declarada"            "try{m.cifra(1974,\"PROBABLE\");console.log(\"NO_LANZO\")}catch(e){console.log(e.message)}"
PL "…y el error dice cuales valen"     "MEDIDO, ESTIMADO, SIN EVALUAR"  "try{m.cifra(1974)}catch(e){console.log(e.message)}"
# No se asume la peor «por prudencia»: eso convertiria un olvido en un dato valido que se propaga.
PLNO "…y NO asume una por su cuenta"   "\"naturaleza\""          "try{console.log(JSON.stringify(m.cifra(1974)))}catch(e){console.log(\"LANZO\")}"

# E7-E10 · AC-03 · el caso que da nombre a la tarea. SIN EVALUAR no vale cero.
PL "SIN EVALUAR no tiene valor"        "\"valor\":null"          "console.log(JSON.stringify(m.cifra(0,m.SIN_EVALUAR)))"
PLNO "…ni siquiera un cero explicito"  "\"valor\":0"             "console.log(JSON.stringify(m.cifra(0,m.SIN_EVALUAR)))"
PL "restar con SIN EVALUAR contagia"   "SIN EVALUAR"             "console.log(JSON.stringify(m.restar(m.cifra(100,m.MEDIDO),m.cifra(null,m.SIN_EVALUAR))))"
# Si el 100 sobreviviera, el presupuesto diria que queda TODO justo cuando no sabe nada.
PLNO "…y el valor NO sobrevive"        "\"valor\":100"           "console.log(JSON.stringify(m.restar(m.cifra(100,m.MEDIDO),m.cifra(null,m.SIN_EVALUAR))))"
PL "sumar contagia igual"              "SIN EVALUAR"             "console.log(JSON.stringify(m.sumar(m.cifra(100,m.MEDIDO),m.cifra(null,m.SIN_EVALUAR))))"
PLNO "…y tampoco suma el valor"        "\"valor\":100"           "console.log(JSON.stringify(m.sumar(m.cifra(100,m.MEDIDO),m.cifra(null,m.SIN_EVALUAR))))"

# E11-E13 · el contagio hacia la PEOR, y sin depender del orden de los operandos.
PL "medido con medido sigue MEDIDO"    "\"naturaleza\":\"MEDIDO\""   "console.log(JSON.stringify(m.restar(m.cifra(100,m.MEDIDO),m.cifra(30,m.MEDIDO))))"
PL "…y el valor se calcula"            "\"valor\":70"            "console.log(JSON.stringify(m.restar(m.cifra(100,m.MEDIDO),m.cifra(30,m.MEDIDO))))"
PL "medido con estimado da ESTIMADO"   "ESTIMADO"                "console.log(m.restar(m.cifra(100,m.MEDIDO),m.cifra(50,m.ESTIMADO)).naturaleza)"
# La misma regla al reves: si dependiera del orden, se cumpliria la mitad de las veces.
PL "…y al reves TAMBIEN"               "ESTIMADO"                "console.log(m.restar(m.cifra(50,m.ESTIMADO),m.cifra(100,m.MEDIDO)).naturaleza)"
PL "peorNaturaleza es la peor"         "^SIN EVALUAR$"           "console.log(m.peorNaturaleza(m.MEDIDO,m.SIN_EVALUAR,m.ESTIMADO))"
PL "…y lo desconocido cuenta como lo peor"  "^SIN EVALUAR$"      "console.log(m.peorNaturaleza(m.MEDIDO,\"INVENTADA\"))"

# E14-E15 · AC-02 · vocabulario CERRADO y ORDENADO. El orden ES la regla de contagio.
PL "NATURALEZAS son TRES"              "^3$"                     "console.log(m.NATURALEZAS.length)"
PL "…de mejor a peor"                  "MEDIDO,ESTIMADO,SIN EVALUAR"  "console.log(m.NATURALEZAS.join(\",\"))"

# E17-E18 · la naturaleza va PEGADA al numero. Separadas, «1974» se lee como una medida.
PL "el texto pega la naturaleza"       "1974 (ESTIMADO)"         "console.log(m.textoCifra(m.cifra(1974,m.ESTIMADO)))"
PLNO "…y SIN EVALUAR no ensena numero" "[0-9]"                   "console.log(m.textoCifra(m.cifra(99,m.SIN_EVALUAR)))"

# E16 · AC-02 · verify-suite comprueba la CONSTANTE, no la prosa.
chk   "verify-suite exige que sean tres"  "NATURALEZAS"  cat "$SUITE/tools/verify-suite.mjs"
chk   "…y que esten en LEXICON"           "no esta declarada en LEXICON"  cat "$SUITE/tools/verify-suite.mjs"

# E19-E20 · AC-05 · LEX-R21 · el vocabulario vive en LEXICON, y ANTES que en el codigo.
chk   "MEDIDO esta en LEXICON"            "MEDIDO"        cat "$SUITE/LEXICON.md"
chk   "ESTIMADO esta en LEXICON"          "ESTIMADO"      cat "$SUITE/LEXICON.md"
chk   "SIN EVALUAR esta en LEXICON"       "SIN EVALUAR"   cat "$SUITE/LEXICON.md"
chk   "…y dice que NO es cero"            "NO es cero"    cat "$SUITE/LEXICON.md"
chk   "…y que el orden es la regla"        "peor"          cat "$SUITE/LEXICON.md"
chk   "…y que sin naturaleza no existe"   "no existe"     cat "$SUITE/LEXICON.md"

# ─── PT-057 · lo que cuesta una tarea sale del historial ───────────────────
# Ninguna cifra sale de la memoria del agente ni de una tabla escrita a mano: el tipo y la
# complejidad los pone REGISTRY.json, y commits, archivos y lineas los pone git.
#
# El hallazgo de PHASE 2 es que la senal OBVIA esta contaminada: 61 de 162 commits nombran mas de
# un PT y uno nombra DIEZ, porque el cuerpo cita las tareas anteriores y eso es lo CORRECTO en una
# bitacora append-only. Con `--grep PT-NNN`, BUG/TRIVIAL y BUG/STANDARD salian identicos hasta la
# linea. La atribucion es el ASUNTO.
sec "── PT-057 · la referencia de coste ──"

# E2 · mediana, NUNCA media. Es lo que separa esto de una cifra que engana: los grupos son de 6 a
# 13 tareas con rangos de hasta diez veces, y una media la arrastra un solo caso.
trlib "la mediana ignora el caso extremo"    "^1$"     "console.log(m.resumen([1,1,1,1,100]).mediana)"
trlibno "…y no es la media"                  "^2[01]"  "console.log(m.resumen([1,1,1,1,100]).mediana)"
trlib "con numero par, promedia las dos"     "^3$"     "console.log(m.resumen([2,2,4,4]).mediana)"
# E3 · el rango viaja SIEMPRE con la mediana: una cifra central sin dispersion se lee como una
# prediccion, que es lo que el out-of-scope dice que esto no es.
trlib "el rango va con la mediana"           "\"min\":1"    "console.log(JSON.stringify(m.resumen([1,1,1,1,100])))"
trlib "…por los dos lados"                   "\"max\":100"  "console.log(JSON.stringify(m.resumen([1,1,1,1,100])))"
trlib "…y cuantos casos son"                 "\"n\":5"      "console.log(JSON.stringify(m.resumen([1,1,1,1,100])))"
trlib "sin datos NO devuelve cero"           "^null$"       "console.log(JSON.stringify(m.resumen([])))"

# E12-E14 · la atribucion. El primer PT del ASUNTO, y solo del asunto.
trlib "el dueno es el PT del asunto"         "^PT-056$"  "console.log(m.duenoDe(\"fix: PT-056 · algo\"))"
trlib "…el PRIMERO si hay varios"            "^PT-056$"  "console.log(m.duenoDe(\"fix: PT-056 corrige PT-052\"))"
trlibno "…y no el segundo"                   "PT-052"    "console.log(m.duenoDe(\"fix: PT-056 corrige PT-052\"))"
trlib "un asunto sin PT no tiene dueno"      "^null$"    "console.log(JSON.stringify(m.duenoDe(\"chore: sin identificador\")))"
trlib "…y nada no revienta"                  "^null$"    "console.log(JSON.stringify(m.duenoDe(undefined)))"

# E1 · con datos suficientes hay referencia, y son las tres medidas.
C5='Array.from({length:5},(_,i)=>({id:"PT-"+i,type:"CHORE",complexity:"STANDARD",commits:1,archivos:2,lineas:100}))'
trlib "con cinco tareas SI hay referencia"   "\"mediana\":100" "console.log(JSON.stringify(m.costeDe($C5,{tipo:\"CHORE\",complejidad:\"STANDARD\"}).referencia.lineas))"
trlib "…y las tres medidas"                  "commits.*archivos.*lineas" "console.log(Object.keys(m.costeDe($C5,{}).referencia).join(\" archivos lineas\").slice(0,0)+Object.keys(m.costeDe($C5,{}).referencia).join(\" \"))"

# E4-E6 · las dimensiones de comparacion salen del registro (AC-02).
MIX='[{id:"A",type:"CHORE",complexity:"STANDARD",commits:1,archivos:1,lineas:10},{id:"B",type:"BUG",complexity:"STANDARD",commits:9,archivos:9,lineas:90},{id:"C",type:"CHORE",complexity:"TRIVIAL",commits:5,archivos:5,lineas:50}]'
trlib "filtra por tipo Y complejidad"        "^1$"  "console.log(m.costeDe($MIX,{tipo:\"CHORE\",complejidad:\"STANDARD\",minimo:1}).casos)"
trlib "filtra solo por tipo"                 "^2$"  "console.log(m.costeDe($MIX,{tipo:\"CHORE\",minimo:1}).casos)"
trlib "sin filtro, todas"                    "^3$"  "console.log(m.costeDe($MIX,{minimo:1}).casos)"

# E7-E10 · AC-03. TRES situaciones distintas, tres respuestas distintas.
C4='Array.from({length:4},(_,i)=>({id:"PT-"+i,type:"BUG",complexity:"SIMPLE",commits:1,archivos:2,lineas:50}))'
trlib "con cuatro NO extrapola"              "^null$"  "console.log(JSON.stringify(m.costeDe($C4,{tipo:\"BUG\"}).referencia))"
trlib "…y dice cuantas hay y cuantas faltan" "solo 4, y hacen falta 5"  "console.log(m.costeDe($C4,{tipo:\"BUG\"}).motivo)"
trlib "…y ensena los casos EN CRUDO"         "^4$"  "console.log(m.costeDe($C4,{tipo:\"BUG\"}).casos_crudos.length)"
trlib "con NINGUNA, motivo distinto"         "ninguna tarea cerrada"  "console.log(m.costeDe([],{tipo:\"X\"}).motivo)"
trlibno "…y sin casos crudos que ensenar"    "casos_crudos"  "console.log(JSON.stringify(m.costeDe([],{tipo:\"X\"})))"
# El cero seria lo peligroso: entraria en PT-058 y PT-059 COMO SI FUERA UNA MEDIDA. Es lo que
# PT-056 acaba de demostrar que es peor que no tener el dato.
trlibno "sin referencia NO devuelve cero"    "\"referencia\":0"  "console.log(JSON.stringify(m.costeDe($C4,{tipo:\"BUG\"})))"
# E11 · el umbral es una OPCION, no un numero enterrado en un if.
trlib "el umbral se puede mover"             "^50$"  "console.log(m.costeDe($C4,{tipo:\"BUG\",minimo:3}).referencia.lineas.mediana)"
# E18 · y esta declarado con nombre, para que se pueda discutir.
trlib "MINIMO_REFERENCIA esta exportado"     "^5$"   "console.log(m.MINIMO_REFERENCIA)"
chk   "…y se declara como JUICIO, no resultado"  "Es un JUICIO"  cat "$SUITE/tools/tracker.mjs"

# E15-E17 · la accion, sobre el REPOSITORIO REAL. Aqui no vale el fixture: la referencia sale de
# las tareas cerradas de este repositorio, y son las que hay.
# El ROOT va EXPLICITO: el arnes corre con el fixture como directorio actual, asi que sin esto
# `coste` leia el REGISTRY del fixture —cuatro tareas de mentira— y las aserciones sobre las
# cifras reales no comprobaban nada. Es el mismo defecto que PT-023 persigue: verde por vacio.
RAIZ_REAL="$(cd "$SUITE/../.." && pwd)"
TRR() { node "$SUITE/tools/tracker.mjs" "$@" "$RAIZ_REAL"; }

# ─── PT-079 · el rastro sobrevive a la rama ──────────────────────────────────
sec "── PT-079 · lo que se aprende se hace mecanico ──"
#
# FAMILIA A · el enlace del issue apuntaba a «la rama en la que corre el espejo», no a la
# de la tarea enlazada. Y esa rama se borra al fusionar (FDGE-R19). Medido el 2026-08-19
# sobre el tablero real: 14 de 16 enlaces daban 404, y el de PT-072 apuntaba a la rama de
# PT-074 —otra tarea—.
#
# NO se perdia la documentacion: changes/PT-075 tiene sus 10 archivos en «trabajo». Se
# perdia el ENLACE. Por eso el arreglo no es salvar los .md, es apuntar a un ref durable.
#
# cuerpoDeIssue sigue siendo PURA (PT-048): el ref lo calcula el contexto, que si tiene
# disco y git. Aqui se le inyecta.
trlib "el enlace usa el ref durable"        "/tree/trabajo/"   "console.log(m.cuerpoDeIssue({id:'PT-9',type:'BUG',slug:'x',severity:'S2'},{url:'u',refDurable:'trabajo',hayDirectorio:true}))"
trlib "…y un SHA tambien vale"              "/tree/abc1234/"   "console.log(m.cuerpoDeIssue({id:'PT-9',type:'BUG',slug:'x',severity:'S2'},{url:'u',refDurable:'abc1234',hayDirectorio:true}))"
# E3 · RULE-06 · sin ref durable NO se inventa una URL. PT-036 ya lo dejo escrito.
trlibno "sin ref durable no inventa enlace"  "/tree/"          "console.log(m.cuerpoDeIssue({id:'PT-9',type:'BUG',slug:'x',severity:'S2'},{url:'u',refDurable:null,hayDirectorio:true}))"
trlib  "…y lo DICE"                          "sin enlace"      "console.log(m.cuerpoDeIssue({id:'PT-9',type:'BUG',slug:'x',severity:'S2'},{url:'u',refDurable:null,hayDirectorio:true}))"
# E4 · el ref sale del CONTENIDO, no de donde se ejecuta el espejo: «ramaTrabajo» ya no
# decide el enlace. Es el defecto que hacia que el issue de PT-072 apuntara a PT-074.
trlibno "la rama del espejo NO decide"       "otra-rama"       "console.log(m.cuerpoDeIssue({id:'PT-9',type:'BUG',slug:'x',severity:'S2'},{url:'u',refDurable:'trabajo',ramaTrabajo:'otra-rama',hayDirectorio:true}))"

# E5 · la rama del enlace se puede EXTRAER de un cuerpo publicado: es lo que verify-fdge
# necesita para comprobar que sigue existiendo.
trlib "se extrae la rama de un enlace"      "^trabajo$"        "console.log(m.refDeEnlace('ver [x](https://h/o/r/tree/trabajo/changes/PT-9-x)'))"
trlib "…y null si no hay enlace"            "^null$"           "console.log(JSON.stringify(m.refDeEnlace('sin enlace ninguno')))"
# El ref tiene TRES segmentos —FDGE-R19: <type>/<usuario>/PT-NNN-slug—, asi que extraerlo
# cortando en la primera barra devuelve «fix» y da por bueno cualquier enlace muerto. Me paso
# midiendo el tablero para esta misma tarea: la medicion decia 20 rotos con los refs mal leidos,
# y era casualidad que el numero saliera igual. Un extractor que corta de menos NO falla: acierta
# el veredicto por accidente, que es la forma de error que este lote persigue.
trlib "…y el ref de tres segmentos entero"  "^fix/ana/PT-9-x$" "console.log(m.refDeEnlace('ver [x](https://h/o/r/tree/fix/ana/PT-9-x/changes/PT-9-x)'))"

# FAMILIA B · las guardas del arnes.
#
# B-1 ABORTA. En PT-074 se me olvido el assert y la inversa dio VERDE EN LOS TRES CASOS
# sin revertir nada: str.replace no falla cuando no casa, hace nada en silencio. Una
# inversa que no revierte certifica lo contrario de lo que pretende (PT-050).
probar_inversa() {  # $1 patron · imprime ABORTA, APLICA o SIN_HELPER
  # Distinguir «aborto porque el patron no casa» de «aborto porque el helper NO EXISTE»: sin
  # esta guarda el caso pasaba EN VERDE con «inversa» sin escribir todavia —el if fallaba y
  # devolvia ABORTA—. Es exactamente el falso verde que esta tarea persigue, cometido mientras
  # se escribia. Lo dijo ejecutarlo antes de implementar, que es para lo que sirve FDGE-R17.
  type inversa >/dev/null 2>&1 || { echo SIN_HELPER; return; }
  printf 'linea uno\nlinea dos\n' > "$WORK/inv.txt"
  if inversa "$WORK/inv.txt" "$1" "cambiado" >/dev/null 2>&1; then echo APLICA; else echo ABORTA; fi
}
chk   "una inversa que no casa ABORTA"      "ABORTA"   probar_inversa "patron-que-no-existe"
chk   "…y una que casa, aplica"             "APLICA"   probar_inversa "linea dos"

# B-2 y B-3 AVISAN, no bloquean: hay aserciones legitimas sobre identificadores, y un
# arnes que nace rojo se apaga. Se enumeran con su linea y la cifra queda medida.
chk   "las aserciones sospechosas se enumeran"  "sospechosa\|ninguna"  lint_aserciones
chk   "los helpers usados antes se enumeran"    "helper\|ninguno"      lint_helpers

# FAMILIA C · los cinco sitios. Sin esto, A y B son dos mecanismos correctos que nadie
# invoca — el septimo caso del lote con esa forma.
chk   "SUITE-R56 existe en RULES"           "SUITE-R56"   cat "$SUITE/RULES.md"
chk   "…y PHASE 9 la cita"                  "SUITE-R56"   cat "$SUITE/PHASES.md"
chk   "…y el prompt de G4 tambien"          "SUITE-R56"   cat "$SUITE/FDGE-Prompts.md"
chk   "…y CASOS-DE-USO tiene el caso"       "rastrear una tarea"  cat "$SUITE/CASOS-DE-USO.md"
chk   "…y el MANUAL nombra proyectar"       "proyectar"   cat "$SUITE/MANUAL.md"

# ─── PT-066 · la regla que se consulta es la que se define ───────────────────
sec "── PT-066 · definir no es mencionar ──"
#
# definicionDe() decidia por MENCION: devolvia la primera linea que contenia el ID y
# casaba HARD|SOFT. Dos consecuencias, 47 de 197 mal:
#   21 se declaraban INEXISTENTES —las CHECK de RULES.md y las EXEC-* en prosa, que no
#      llevan severidad en la linea—, entre ellas FDGE-R34, que CLAUDE.md nombra
#      precondicion de G4
#   26 devolvian el texto de OTRA regla bajo la cabecera «definida en RULES.md»
#
# Las segundas son peores: no fallan, MIENTEN con formato de respuesta correcta. Es lo
# que el propio archivo tiene escrito veinte lineas mas abajo, en un comentario de
# PT-051: «una linea equivocada y creible es peor que ninguna».
#
# El caso NO es una muestra: recorre el universo DERIVADO de los tres documentos y exige
# por cada ID que la definicion devuelta EMPIECE por ese mismo ID.
cat > "$WORK/chk-reglas.mjs" <<'JSEOF'
// La ruta va por ENTORNO y se convierte con pathToFileURL DENTRO de node: construir el file://
// en el shell da una ruta MSYS que node no reconoce como absoluta. Es el mismo patron que
// trlib() ya usaba desde PT-058, y no mirarlo antes de escribirlo costo tres intentos.
const { pathToFileURL } = await import('node:url');
const { definicionDe } = await import(pathToFileURL(process.env.MTH_REGLA).href);
const { readFileSync } = await import('node:fs');

// El universo se DERIVA de los tres documentos propietarios, no se escribe a mano: una lista
// escrita se queda corta en cuanto alguien añade una regla (SUITE-R53).
const M = process.env.MTH_SUITE + '/';
const ids = [];
for (const m of readFileSync(M + 'RULES.md', 'utf8').matchAll(/^\|\s*`([A-Z]+-R\d+)`\s*\|/gm)) ids.push(m[1]);
for (const m of readFileSync(M + 'LEXICON.md', 'utf8').matchAll(/^\|\s*`(LEX-R\d+)`\s*\|/gm)) ids.push(m[1]);
for (const m of readFileSync(M + 'EXECUTION-MODES.md', 'utf8').matchAll(/^`(EXEC-R\d+)`\s*·/gm)) ids.push(m[1]);

const universo = [...new Set(ids)];
const mal = [];
for (const id of universo) {
  const d = definicionDe(id);
  if (!d) { mal.push('INEXISTENTE:' + id); continue; }
  const t = d.texto.trimStart();
  // DOS condiciones. La segunda es la que faltaba: sin ella «devuelve algo» pasa por «devuelve
  // lo correcto», y asi 26 reglas devolvian el texto de otra sin que nadie lo viera.
  if (!(t.startsWith('| `' + id + '`') || t.startsWith('`' + id + '`'))) mal.push('AJENA:' + id);
}
console.log(mal.length
  ? 'MAL ' + mal.length + ' de ' + universo.length + ' · ' + mal.slice(0, 6).join(' ')
  : 'LAS ' + universo.length + ' DEVUELVEN SU PROPIA DEFINICION');
JSEOF
reglas_propias() {
  MTH_REGLA="$SUITE/tools/regla.mjs" MTH_SUITE="$SUITE" node "$WORK/chk-reglas.mjs" 2>&1
}
chk   "cada regla devuelve SU definicion"   "DEVUELVEN SU PROPIA DEFINICION"  reglas_propias

# E5 · la guarda contra el arreglo facil: hacer que devuelva algo SIEMPRE arreglaria los
# 47 y romperia la unica respuesta honesta que la funcion ya daba bien.
# El patron va sin acentos Y respetando la caja: la salida dice «No está definida», y buscar
# «no est» falla por la mayuscula. Es la SEXTA asercion de este lote que no casa con lo que
# existe, y la escribi mientras redactaba PT-079, que trata justamente de eso.
chk   "una regla inexistente lo sigue siendo"  "definida en ning"  node "$SUITE/tools/regla.mjs" SUITE-R99

# ─── PT-074 · el veredicto de viabilidad se ESPEJA ───────────────────────────
sec "── PT-074 · el veredicto se ve en el tablero ──"
#
# SUITE-R35: el registro asigna y la plataforma ESPEJA. El veredicto de viabilidad es
# estado —lo escribe «tracker viabilidad --registrar»— y no se espejaba: estaba en el
# REGISTRY y era invisible desde el tablero. El firmante lo pidio TRES veces.
#
# Se espeja el VEREDICTO y su BASE, no el razonamiento: SUITE-R35 prohibe copiar
# contenido al issue, y un veredicto sin decir contra que se midio es lo que PT-058
# corrigio.
trlib "el cuerpo lleva el veredicto"      "SAFE"        "console.log(m.cuerpoDeIssue({id:'PT-9',type:'BUG',slug:'x',severity:'S2',viabilidad:{veredicto:'SAFE',coste:{valor:100,naturaleza:'ESTIMADO'},medido_en:'abc1234def',fecha:'2026-08-19'}}))"
trlib "…y la naturaleza de la cifra"      "ESTIMADO"    "console.log(m.cuerpoDeIssue({id:'PT-9',type:'BUG',slug:'x',severity:'S2',viabilidad:{veredicto:'SAFE',coste:{valor:100,naturaleza:'ESTIMADO'},medido_en:'abc1234def',fecha:'2026-08-19'}}))"
trlib "…y contra que se midio"            "abc1234"     "console.log(m.cuerpoDeIssue({id:'PT-9',type:'BUG',slug:'x',severity:'S2',viabilidad:{veredicto:'SAFE',coste:{valor:100,naturaleza:'ESTIMADO'},medido_en:'abc1234def',fecha:'2026-08-19'}}))"
trlib "MARGINAL dice que obliga"          "atomico\|atómico"  "console.log(m.cuerpoDeIssue({id:'PT-9',type:'BUG',slug:'x',severity:'S2',viabilidad:{veredicto:'MARGINAL',coste:{valor:665,naturaleza:'ESTIMADO'},medido_en:'abc1234def',fecha:'2026-08-19'}}))"
trlib "UNSAFE dice que detiene"           "DETIENE\|detiene"  "console.log(m.cuerpoDeIssue({id:'PT-9',type:'BUG',slug:'x',severity:'S2',viabilidad:{veredicto:'UNSAFE',coste:{valor:9,naturaleza:'MEDIDO'},medido_en:'abc1234def',fecha:'2026-08-19'}}))"
# Sin veredicto NO se inventa una linea. Es parte del arreglo: una allocation recien
# asignada no tiene viabilidad hasta G2, y emitir «SIN EVALUAR» ahi seria un dato falso.
trlibno "sin viabilidad no inventa la linea"  "Viabilidad"  "console.log(m.cuerpoDeIssue({id:'PT-9',type:'BUG',slug:'x',severity:'S2'}))"

# ─── PT-068 · la marca de sesion es de quien la abre ─────────────────────────
sec "── PT-068 · la marca es de quien la abre ──"

# PT-065 movio la ESCRITURA a SESSION-<persona>.json y dejo DOS lecturas apuntando al viejo
# SESSION.json: viabilidad siempre, y sesion como respaldo. Reproducido contra el repositorio
# real: una identidad no declarada heredaba 32 commits y 13 194 lineas ajenas, etiquetadas
# MEDIDO — un dato con autoridad de medida sobre trabajo de otro.
#
# El respaldo NO se puede quitar: AC-05 de PT-065 exige que un proyecto de UNA sola persona no
# cambie, y los anteriores a la 8.3.0 solo tienen SESSION.json. Lo que se distingue es de QUIEN
# es la marca. Las tres ramas de marcaDe() tienen su caso, y E2/E3/E4 son las que protegen el
# caso mayoritario: si cayeran, el arreglo habria roto el proyecto de una sola persona.
MD() { PL "$@"; }   # las tres ramas se prueban sobre la funcion pura, con el lector inyectado

# E1 · identidad NO declarada, SESSION.json de OTRA persona -> no hay sesion mia.
# La persona va como NULL, que es la ruta REAL: personaLocal() devuelve null para quien no esta
# declarado, y archivoSesion(null) es «SESSION.json». La primera version de marcaDe preguntaba
# por el archivo propio SIN comprobar que hubiera persona, asi que una identidad no declarada
# leia el huerfano COMO SI FUERA SUYO y seguia heredando 33 commits ajenos. El caso con una
# CADENA pasaba y no cubria eso: lo dijo la ejecucion contra el repositorio, no la lectura.
PL   "marca ajena no se hereda"            "^null$" \
     "console.log(JSON.stringify(m.marcaDe(null,(f)=>f==='SESSION.json'?{persona:'Alberto Martínez',desde:'aaa'}:null)))"
PL   "…tampoco preguntando por nombre"     "^null$" \
     "console.log(JSON.stringify(m.marcaDe('ci-runner',(f)=>f==='SESSION.json'?{persona:'Alberto Martínez',desde:'aaa'}:null)))"
# E2 · SESSION.json SIN persona -> es mia. Es el proyecto de una sola persona (AC-05).
PL   "sin persona, la marca es mia"        "aaa" \
     "console.log(JSON.stringify(m.marcaDe('quien-sea',(f)=>f==='SESSION.json'?{desde:'aaa'}:null)))"
# E3 · SESSION.json con MI nombre -> es mia.
PL   "con mi nombre, es mia"               "aaa" \
     "console.log(JSON.stringify(m.marcaDe('Alberto Martínez',(f)=>f==='SESSION.json'?{persona:'Alberto Martínez',desde:'aaa'}:null)))"
# E4 · existe la propia Y una ajena -> gana la propia.
PL   "la propia gana al respaldo"          "mia" \
     "console.log(JSON.stringify(m.marcaDe('Ada',(f)=>f.startsWith('SESSION-')?{persona:'Ada',desde:'mia'}:{persona:'Otro',desde:'suya'})))"

# E5 · AC-02 · una persona NO aparece dos veces. Con SESSION.json y SESSION-<yo>.json los dos
# con el mismo nombre, salia DOS veces: una sesion fantasma, que es lo que el HANDOFF avisa.
DOS='[{"persona":"Ada","desde":"a","__propia":true},{"persona":"Ada","desde":"b"},{"persona":"Bob","desde":"c"}]'
PL   "una persona, una sola sesion"        "^2$" \
     "console.log(m.sesionesUnicas($DOS).length)"
PL   "…y gana el archivo propio"           "\"a\"" \
     "console.log(JSON.stringify(m.sesionesUnicas($DOS).find((x)=>x.persona==='Ada').desde))"

# E6 · AC-07 · viabilidad y sesion leen la MISMA marca. Dos lecturas del mismo hecho divergen
# (SUITE-R38), y divergian: sesion decia 7735ff4 y viabilidad 258be16.
chkno "viabilidad no lee SESSION.json a pelo"  "leerJSON(join(IMPL, 'SESSION.json'))"  cat "$SUITE/tools/tracker.mjs"
chk   "las dos lecturas usan marcaDe"          "marcaDe("   cat "$SUITE/tools/tracker.mjs"

# E7/E8 · AC-03 y AC-04 · los mensajes dejan de mentir.
chkno "sesion abrir no dice SESSION.json"   "SESSION.json escrito"  cat "$SUITE/tools/tracker.mjs"
chkno "…ni cerrar afirma que se sobrescribe"  "la sesion siguiente lo sobrescribe"  cat "$SUITE/tools/tracker.mjs"

# ─── PT-076 · el arnes no escribe en el repositorio real ─────────────────────
sec "── PT-076 · el arnes no escribe donde se decide ──"

# TRR() invoca tracker contra RAIZ_REAL. Existe con motivo —coste, viabilidad y personas
# necesitan el historial de verdad, y una mediana de cuatro tareas de mentira no es una
# mediana—. Lo que no puede es ESCRIBIR ahi: tres casos de «sesion abrir» y seis de «sesion
# cerrar» pisaban la marca de sesion y apilaban en SESSION_LOG.md, que es append-only.
#
# 140 entradas acumuladas, nueve mas por pasada. Y corrompe la base de calculo de FDGE-R54,
# la compuerta que PT-075 acaba de crear.
#
# «asignar» ya demostraba el patron seguro: lleva --ver.

# E6/E7 · AC-04 · la FORMA, no la lista. Se DERIVA del codigo que acciones escriben —las que
# llaman a writeFileSync— y se comprueba que ninguna se invoque por TRR sin --ver. Una lista a
# mano se queda corta en cuanto alguien añade una accion, que es lo que SUITE-R53 dice de la
# tabla del manual.
acciones_que_escriben() {
  node -e '
    const fs = require("fs");
    const s = fs.readFileSync(process.argv[1], "utf8");
    const m = s.match(/const acciones = \{([^}]*)\}/);
    if (!m) { console.log(""); process.exit(0); }
    const out = [];
    for (const par of m[1].split(",")) {
      const [alias, fn] = par.split(":").map((x) => (x || "").trim());
      if (!alias) continue;
      const nombre = fn || alias;
      const i = s.indexOf("function " + nombre);
      if (i < 0) continue;
      let j = s.indexOf("\nfunction ", i + 1);
      if (j < 0) j = s.length;
      if (/writeFileSync/.test(s.slice(i, j))) out.push(alias);
    }
    console.log(out.join(" "));
  ' "$SUITE/tools/tracker.mjs"
}
# Una accion que PUEDE escribir no escribe SIEMPRE: «sesion» solo con «abrir» o «cerrar»,
# «viabilidad» solo con «--registrar», y «asignar» no escribe con «--ver». Esos tres
# disparadores se nombran AQUI a proposito y con su motivo: derivarlos del codigo exigiria
# entender en que rama de cada funcion cae el writeFileSync, y una heuristica que se equivoque
# aqui haria fallar casos correctos —que es peor que no tenerla (PT-023)—.
#
# El limite queda declarado: si alguien añade un disparador nuevo a una de esas tres, esta
# comprobacion no lo vera. Lo que SI lo ve es AC-01, que compara la huella de los dos archivos
# antes y despues de la pasada completa. Esta es la guarda de forma; aquella es la de resultado.
SEGURO='--ver'
DISPARA='abrir|cerrar|--registrar'
malos=""
for a in $(acciones_que_escriben); do
  # invocaciones de esa accion por TRR que NO son seguras y SI llevan disparador de escritura
  if grep -E "TRR $a( |\$)" "$SUITE/tools/selftest.sh" | grep -vE -- "$SEGURO" | grep -qE -- "$DISPARA"; then
    malos="$malos $a"
  fi
done
pass_si_vacio() { [ -z "$1" ] && echo "SIN ESCRITURAS POR TRR" || echo "ESCRIBEN POR TRR:$1"; }
chk   "ninguna accion que escriba va por TRR"   "SIN ESCRITURAS POR TRR"   pass_si_vacio "$malos"

# E3/E4/E5 · AC-03 · sesion se prueba en el FIXTURE, y comprueba lo mismo que antes.
git_fixture() {  # git inicializado, para que «sesion abrir» tenga un HEAD que marcar
  ( cd "$WORK"
    git init -q . 2>/dev/null
    git config user.email t@t; git config user.name T
    git add -A >/dev/null 2>&1
    git commit -qm "base del fixture" >/dev/null 2>&1 ) >/dev/null 2>&1
}
build_fixture; git_fixture
chk   "sesion abrir escribe la marca del FIXTURE"  "sesion abierta desde"  TR sesion abrir
build_fixture; git_fixture
TR sesion abrir >/dev/null 2>&1
chk   "…y abrir otra vez la sobrescribe"           "sesion abierta desde"  TR sesion abrir
build_fixture; git_fixture
TR sesion abrir >/dev/null 2>&1
chk   "sesion cerrar da el handoff"                "en curso"    TR sesion cerrar
build_fixture; git_fixture
TR sesion abrir >/dev/null 2>&1
chk   "…y dice que NO borra la marca"              "NO se borra" TR sesion cerrar
build_fixture; git_fixture
TR sesion abrir >/dev/null 2>&1
chk   "…y que HANDOFF.md queda INTACTO"            "INTACTO"     TR sesion cerrar

# E2 · AC-02 · lo que necesita historial real SIGUE leyendolo. Es la razon por la que TRR no
# se elimina: sobre el fixture, coste mediria cuatro tareas de mentira.
chk   "coste sigue leyendo el historial real"   "tareas cerradas"   TRR coste CHORE STANDARD

# E8 · AC-05 · las 140 ya escritas se DECLARAN. SUITE-R09 es append-only: no se borran.
# El patron va SIN ACENTOS y sobre la cabecera, que es lo estable: la redaccion del cuerpo
# puede cambiar y «escribio el arnes» lleva dos tildes que el grep del arnes no casa.
chk   "las entradas del arnes estan declaradas" "Aviso sobre este archivo"  cat "$RAIZ_REAL/docs/implementation/SESSION_LOG.md"

# El patron NO se ata a un numero concreto: la cifra CRECE con cada tarea cerrada, y atarla
# convierte un caso en una bomba de relojeria. Paso con «1[0-9]» al llegar a 20.
chk   "coste da una cifra para un grupo grande"  "CHORE/STANDARD · [0-9][0-9]* tareas cerradas"  TRR coste CHORE STANDARD
chk   "…con su rango"                            "( *[0-9]* – [0-9]*)"   TRR coste CHORE STANDARD
chk   "…y de cuantas cerradas sale"              "de las .* tareas cerradas"  TRR coste CHORE STANDARD
chk   "…y avisa de las que no se pueden saber"   "NO SE PUEDE SABER"     TRR coste CHORE STANDARD
chk   "…y que es referencia, no prediccion"      "no una prediccion"     TRR coste CHORE STANDARD
chk   "un grupo pequeno se declara SIN REFERENCIA"  "SIN REFERENCIA"     TRR coste CHORE SIMPLE
# El patron NO puede ser «mediana»: la salida EXPLICA que una mediana de una tarea no es una
# mediana, asi que casaba con su propia explicacion. Se busca la FORMA de una medida —la linea
# «lineas <numero>»— que es lo que no debe estar. Sexta vez en tres lotes.
chkno "…y no da mediana de una sola tarea"       "^ *lineas  *[0-9]"     TRR coste CHORE SIMPLE
chk   "…pero ensena el caso que hay"             "commits [0-9] · archivos"  TRR coste CHORE SIMPLE
chk   "sin filtro salen todos los grupos"        "BUG/STANDARD"          TRR coste
# El posicional en MAYUSCULAS no es una ruta: sin esta guarda, «coste CHORE STANDARD» buscaba el
# registro dentro de ./CHORE. Cuarta vez en dos lotes que un argumento nuevo se cuela por ROOT.
chkno "un tipo no se confunde con el ROOT"       "REGISTRY.json legible" TRR coste CHORE STANDARD
# E17 · lo que CI le enseno a PT-056: una accion que se deriva del registro y de git no puede
# exigir credencial de plataforma, o queda inservible justo donde se decide un merge.
SIN_GH2="$WORK/.sin-gh2"; mkdir -p "$SIN_GH2"
_bin2() { dirname "$(command -v "$1")"; }
TRRNOGH() { PATH="$(_bin2 node):$(_bin2 git):$SIN_GH2" node "$SUITE/tools/tracker.mjs" "$@" "$RAIZ_REAL"; }
chk   "coste funciona SIN credencial"            "CHORE/STANDARD"        TRRNOGH coste CHORE STANDARD

# AC-04 · la cifra tiene que salir de git, y esto lo comprueba de la unica forma que no se engaña
# a si misma: cambiando el filtro y viendo que la cifra CAMBIA.
chkno "la cifra no es la misma para todo grupo"  "^$"  sh -c '
  a=$(node "$1" coste CHORE STANDARD "$2" | grep -E "^ +lineas" | tr -s " " | cut -d" " -f3)
  b=$(node "$1" coste BUG STANDARD   "$2" | grep -E "^ +lineas" | tr -s " " | cut -d" " -f3)
  [ -n "$a" ] && [ -n "$b" ] && [ "$a" != "$b" ] && echo DISTINTAS || echo IGUALES' _ "$SUITE/tools/tracker.mjs" "$RAIZ_REAL"

# LEX-R21 · el nombre vive en LEXICON, y ANTES que en el codigo.
chk   "«referencia de coste» esta en LEXICON"    "Referencia de coste"   cat "$SUITE/LEXICON.md"
chk   "…con de donde sale"                       "señales OBSERVABLES"   cat "$SUITE/LEXICON.md"
chk   "…y que NO mide"                           "el contexto restante del modelo"  cat "$SUITE/LEXICON.md"
chk   "…y por que el asunto y no el cuerpo"      "solo del asunto"       cat "$SUITE/LEXICON.md"
chk   "…y que el umbral es un juicio"            "juicio declarado"      cat "$SUITE/LEXICON.md"

# ─── PT-059 · no empezar lo que no se puede terminar ───────────────────────
# «Nunca comenzar una unidad de trabajo que probablemente no pueda completarse dentro del
# presupuesto disponible.» El problema: PHASE 2 midio que ese presupuesto NO EXISTE. «disponible =
# total - gastado» sale SIN EVALUAR siempre, porque el total es el contexto del modelo.
#
# Asi que la compuerta compara contra el PRECEDENTE —lo mayor que esta sesion ya completo—, que si
# es observable. SAFE no promete que quepa: dice que ya se pudo con algo asi.
sec "── PT-059 · la compuerta de viabilidad ──"

# E1-E3 · SAFE, y el motivo dice de que sale.
V1="m.viabilidadDe(m.cifra(689,m.ESTIMADO),m.cifra(4210,m.MEDIDO),m.cifra(29286,m.MEDIDO))"
PL "coste bajo el precedente ⇒ SAFE"     "^SAFE$"       "console.log($V1.veredicto)"
PL "…y el motivo lleva las dos cifras"   "4210"         "console.log($V1.motivo)"
PL "…y tambien la del coste"             "689"          "console.log($V1.motivo)"
# La palabra importa: SAFE no promete capacidad, dice que hay precedente.
PL "…y habla de PRECEDENTE"              "PRECEDENTE"   "console.log($V1.motivo)"
PLNO "…y NO promete que quepa"           "garantiza\|asegura\|cabe seguro"  "console.log($V1.motivo)"

# E4-E5 · MARGINAL por holgura: pasa de lo hecho pero no mucho.
V4="m.viabilidadDe(m.cifra(5000,m.ESTIMADO),m.cifra(4210,m.MEDIDO),m.cifra(29286,m.MEDIDO))"
PL "dentro de la holgura ⇒ MARGINAL"     "^MARGINAL$"   "console.log($V4.veredicto)"
PL "…y restringe a lo ATOMICO"           "ATOMICO"      "console.log($V4.motivo)"

# E6-E7 · UNSAFE con evidencia EN CONTRA.
V6="m.viabilidadDe(m.cifra(20000,m.ESTIMADO),m.cifra(4210,m.MEDIDO),m.cifra(29286,m.MEDIDO))"
PL "muy por encima ⇒ UNSAFE"             "^UNSAFE$"     "console.log($V6.veredicto)"
PL "…y pide checkpoint, handoff y parada"  "checkpoint, handoff y parada"  "console.log($V6.motivo)"
PL "…y dice que hay evidencia EN CONTRA"   "EN CONTRA"  "console.log($V6.motivo)"

# E8-E11 · AC-05 · EL CORAZON. El disponible es SIN EVALUAR siempre, asi que esto no es un borde:
# si cayera en SAFE aprobaria por omision, y si cayera en UNSAFE bloquearia TODO para siempre y la
# compuerta acabaria apagada — que es no proteger el dia que tiene razon.
SE="m.cifra(null,m.SIN_EVALUAR)"
PL "coste SIN EVALUAR ⇒ MARGINAL"        "^MARGINAL$"   "console.log(m.viabilidadDe($SE,m.cifra(4210,m.MEDIDO),m.cifra(29286,m.MEDIDO)).veredicto)"
PLNO "…y NUNCA SAFE"                     "SAFE"         "console.log(m.viabilidadDe($SE,m.cifra(4210,m.MEDIDO),m.cifra(29286,m.MEDIDO)).veredicto)"
PL "precedente SIN EVALUAR ⇒ MARGINAL"   "^MARGINAL$"   "console.log(m.viabilidadDe(m.cifra(689,m.ESTIMADO),$SE,m.cifra(29286,m.MEDIDO)).veredicto)"
PL "…y dice CUAL de los dos falta"       "el precedente"  "console.log(m.viabilidadDe(m.cifra(689,m.ESTIMADO),$SE,m.cifra(29286,m.MEDIDO)).motivo)"
PL "…o el otro, segun cual sea"          "el coste"     "console.log(m.viabilidadDe($SE,m.cifra(4210,m.MEDIDO),m.cifra(29286,m.MEDIDO)).motivo)"
PL "…y que no se aprueba por omision"    "NO SE APRUEBA POR OMISION"  "console.log(m.viabilidadDe($SE,$SE,$SE).motivo)"

# E12-E14 · AC-06 · «no cabria NUNCA» es otra cosa que «no cabe ahora», y se decide ANTES.
NUNCA="m.viabilidadDe(m.cifra(40000,m.ESTIMADO),m.cifra(4210,m.MEDIDO),m.cifra(29286,m.MEDIDO))"
PL "por encima del techo historico ⇒ UNSAFE"  "^UNSAFE$"  "console.log($NUNCA.veredicto)"
PL "…y lo marca como NUNCA"              "^true$"       "console.log($NUNCA.nunca)"
PL "…y pide PARTIR la tarea"             "PARTIR"       "console.log($NUNCA.motivo)"
PL "…y dice que no se reintente"         "no reintentarla"  "console.log($NUNCA.motivo)"
# El ORDEN importa: si el SIN EVALUAR del precedente se comprobara antes, una tarea que NUNCA
# cabria saldria MARGINAL y el bucle infinito se produciria igual.
PL "y se decide ANTES que el SIN EVALUAR"  "^true$"     "console.log(m.viabilidadDe(m.cifra(40000,m.ESTIMADO),$SE,m.cifra(29286,m.MEDIDO)).nunca)"
# Y al reves: lo que cabe en el techo NO se marca nunca.
PLNO "lo que cabe no se marca NUNCA"     "^true$"       "console.log($V1.nunca)"

# E15-E16 · HOLGURA es un juicio declarado, y movible.
PL "HOLGURA esta exportada"              "^1.5$"        "console.log(m.HOLGURA)"
PL "…y se puede cambiar sin tocar la funcion"  "^UNSAFE$"  "console.log(m.viabilidadDe(m.cifra(5000,m.ESTIMADO),m.cifra(4210,m.MEDIDO),m.cifra(29286,m.MEDIDO),1.0).veredicto)"
chk   "…y se declara como JUICIO"        "Es un JUICIO"  cat "$SUITE/tools/patrones.mjs"
PL "VEREDICTOS son TRES"                 "^3$"          "console.log(m.VEREDICTOS.length)"

# E17-E20 · AC-04 · BLOCKED_BY_CONTEXT: estado de tarea, vivo, no terminal.
PL "BLOCKED_BY_CONTEXT existe"           "BLOCKED_BY_CONTEXT"  "console.log(m.BLOCKED_BY_CONTEXT)"
PLNO "…y NO es terminal"                 "BLOCKED_BY_CONTEXT"  "console.log([...m.ESTADOS_TERMINALES].join(\" \"))"
trlib "…y SI es vivo"                    "BLOCKED_BY_CONTEXT"  "console.log([...m.VIVOS].join(\" \"))"
chk   "esta en LEXICON"                  "BLOCKED_BY_CONTEXT"  cat "$SUITE/LEXICON.md"
chk   "…y dice que NO es un fallo"       "No es un fallo"      cat "$SUITE/LEXICON.md"
chk   "…y que lo desbloquea otra sesion"  "empezar otra sesión"  cat "$SUITE/LEXICON.md"
# verify-fdge tambien tiene que verlo vivo, o una tarea esperando desapareceria de su recuento.
chk   "verify-fdge lo cuenta como vivo"  "BLOCKED_BY_CONTEXT"  cat "$SUITE/tools/verify-fdge.mjs"

# E19-E20 · el vocabulario de veredictos en LEXICON (LEX-R21).
chk   "SAFE esta en LEXICON"             "SAFE"          cat "$SUITE/LEXICON.md"
chk   "MARGINAL esta en LEXICON"         "MARGINAL"      cat "$SUITE/LEXICON.md"
chk   "UNSAFE esta en LEXICON"           "UNSAFE"        cat "$SUITE/LEXICON.md"
chk   "…y que el disponible no existe"   "no existe"     cat "$SUITE/LEXICON.md"
chk   "…y que no cabe ahora no es nunca"  "bucle infinito"  cat "$SUITE/LEXICON.md"

# E21-E22 · la accion, sobre el repositorio REAL.
chk   "viabilidad da un veredicto"       "veredicto"     TRR viabilidad PT-059
chk   "…con el coste y su naturaleza"    "ESTIMADO\|SIN EVALUAR"  TRR viabilidad PT-059
chk   "…y el precedente con la suya"     "mayor hecho"   TRR viabilidad PT-059
chk   "…y el techo historico"            "techo historico"  TRR viabilidad PT-059
chk   "…y dice que mide PRECEDENTE"      "mide PRECEDENTE"  TRR viabilidad PT-059
chk   "…y que solo CONSULTA"             "CONSULTA"      TRR viabilidad PT-059
chk   "funciona sin credencial"          "veredicto"     TRRNOGH viabilidad PT-059
chkno "un PT que no existe no se inventa"  "veredicto"   TRR viabilidad PT-777

# ─── PT-060 · la sesión es el worker, no el estado ─────────────────────────
# SESSION != STATE != TASK. La sesion es un recurso TEMPORAL; el estado del trabajo pertenece al
# marco y es persistente.
#
# PHASE 2 midio el hueco que PT-059 dejo apuntado: nada registraba cuando empieza una sesion, y
# «un dia» coincide con «una sesion» POR CASUALIDAD — 45 commits contra 44 el mismo dia.
sec "── PT-060 · la sesión como entidad ──"

# E1-E4 · con marca, todo derivado y cada cifra con su naturaleza (PT-058).
MARCA='{desde:"a".repeat(40),abierta:"2026-08-18"}'
GIT60='{commits:12,archivos:34,lineas:4821,tareas:["PT-059","PT-060"]}'
CP60='{pt:"PT-060",phase:5,fase:"Implementacion",sha_corto:"ea4e867",rama:"chore/x",siguiente:"los casos en verde"}'
PL "con marca, la sesion esta abierta"   "^true$"      "console.log(m.sesionDe($MARCA,$GIT60,$CP60).abierta)"
PL "…y las cifras van MEDIDAS"           "MEDIDO"      "console.log(m.sesionDe($MARCA,$GIT60,$CP60).commits.naturaleza)"
PL "…y el «desde» sale de la MARCA"      "^aaaaaaa$"   "console.log(m.sesionDe($MARCA,$GIT60,$CP60).desde_corto)"
PL "…y las tareas de la sesion"          "PT-059"      "console.log(m.sesionDe($MARCA,$GIT60,$CP60).tareas.join(\" \"))"
# Si git no responde, SIN EVALUAR — no cero. Tercera vez en el lote que el cero seria la mentira.
PL "sin datos de git ⇒ SIN EVALUAR"      "SIN EVALUAR"  "console.log(m.sesionDe($MARCA,{}).commits.naturaleza)"
PLNO "…y NO cero"                        "\"valor\":0"  "console.log(JSON.stringify(m.sesionDe($MARCA,{}).commits))"

# E5-E6 · sin marca NO se cae al dia. Pasar una aproximacion por el dato bueno es lo que PT-058
# existe para impedir.
PL "sin marca, no hay sesion"            "^false$"      "console.log(m.sesionDe(null).abierta)"
PL "…y lo DICE"                          "sesion abierta"  "console.log(m.sesionDe(null).motivo)"
PL "…y que el dia NO es la sesion"       "el dia NO es la sesion"  "console.log(m.sesionDe(null).motivo)"
PLNO "…y no inventa cifras"              "commits"      "console.log(JSON.stringify(m.sesionDe(null)))"

# E7-E8 · AC-02 · la correccion a la especificacion: son estados de SESION, no de tarea. Durante
# un handoff la tarea sigue IN_PROGRESS.
PLNO "CHECKPOINTING no es estado terminal"    "CHECKPOINTING"       "console.log([...m.ESTADOS_TERMINALES].join(\" \"))"
trlibno "…ni estado vivo"                     "CHECKPOINTING"       "console.log([...m.VIVOS].join(\" \"))"
PLNO "HANDOFF_REQUIRED tampoco"               "HANDOFF_REQUIRED"    "console.log([...m.ESTADOS_TERMINALES].join(\" \"))"
trlibno "…ni vivo"                            "HANDOFF_REQUIRED"    "console.log([...m.VIVOS].join(\" \"))"
trlibno "WAITING_NEW_SESSION tampoco"         "WAITING_NEW_SESSION" "console.log([...m.VIVOS].join(\" \"))"
# Y no estan en el registro, que es donde SUITE-R09 los haria permanentes.
# El patron NO puede ser «CHECKPOINTING» a secas: el «origin» de PT-060 lo NOMBRA para decir que
# NO entra, asi que la asercion casaba con la prosa que explica lo contrario. Septima vez en tres
# lotes. Se busca la FORMA de un estado: «"status": "CHECKPOINTING"».
chkno "ninguno es status en REGISTRY.json"    '"status": "CHECKPOINTING"'  cat "$RAIZ_REAL/docs/implementation/REGISTRY.json"
chkno "…ni HANDOFF_REQUIRED"                  '"status": "HANDOFF_REQUIRED"'  cat "$RAIZ_REAL/docs/implementation/REGISTRY.json"

# E13-E15 · AC-04 · el handoff se DERIVA del checkpoint. Ni una linea de prosa.
PL "el handoff dice que tarea"           "PT-060"       "console.log(m.handoffDeSesion(m.sesionDe($MARCA,$GIT60,$CP60),$CP60))"
PL "…y en que fase"                      "PHASE 5"      "console.log(m.handoffDeSesion(m.sesionDe($MARCA,$GIT60,$CP60),$CP60))"
PL "…y sobre que commit"                 "ea4e867"      "console.log(m.handoffDeSesion(m.sesionDe($MARCA,$GIT60,$CP60),$CP60))"
PL "…y QUE SIGUE"                        "los casos en verde"  "console.log(m.handoffDeSesion(m.sesionDe($MARCA,$GIT60,$CP60),$CP60))"
PL "…y de donde sale la sesion"          "desde aaaaaaa"  "console.log(m.handoffDeSesion(m.sesionDe($MARCA,$GIT60,$CP60),$CP60))"
# Sin checkpoint no se inventa: se dice.
PL "sin checkpoint lo DICE"              "SIN EVALUAR"  "console.log(m.handoffDeSesion(m.sesionDe($MARCA,$GIT60),null))"
PL "…y como conseguirlo"                 "tracker checkpoint"  "console.log(m.handoffDeSesion(m.sesionDe($MARCA,$GIT60),null))"
# Sin sesion abierta tampoco finge.
PL "sin sesion, el handoff lo dice"      "no se abrio"  "console.log(m.handoffDeSesion(m.sesionDe(null),$CP60))"

# E9-E12 · AC-03 · las acciones de sesion, sobre el FIXTURE.
#
# PT-076 · antes iban por TRR, contra el repositorio REAL: «sesion abrir» pisaba la marca de la
# sesion en curso y «sesion cerrar» apilaba en SESSION_LOG.md, que es append-only. 140 entradas
# acumuladas. Lo que comprueban no cambia; cambia desde donde se invoca.
build_fixture; git_fixture
chk   "sesion abrir escribe la marca"    "sesion abierta desde"  TR sesion abrir
chk   "…y el archivo de sesion existe"   "desde"   sh -c 'cat "$1/docs/implementation/"SESSION*.json' _ "$WORK"
chk   "…con la fecha de apertura"        "abierta" sh -c 'cat "$1/docs/implementation/"SESSION*.json' _ "$WORK"
chk   "sesion ve lo derivado"            "sesion desde"  TR sesion
chk   "…con cada cifra y su naturaleza"  "MEDIDO\|SIN EVALUAR"  TR sesion
chk   "sesion cerrar da el handoff"      "en curso"     TR sesion cerrar
chk   "…y dice que NO borra la marca"    "NO se borra"  TR sesion cerrar
chk   "…y que HANDOFF.md queda INTACTO"  "INTACTO"      TR sesion cerrar
# Abrir dos veces SOBRESCRIBE: es UNA sesion a la vez.
chk   "abrir otra vez sobrescribe"       "sesion abierta desde"  TR sesion abrir
chk   "…y sigue habiendo UN solo archivo de sesion"  "^1$"  sh -c 'ls "$1/docs/implementation/" | grep -c "^SESSION"' _ "$WORK"

# E18-E19 · T10 · viabilidad usa el «desde» real si lo hay, y lo dice si no.
#
# PT-067 · la identidad va INYECTADA por entorno. Este caso corria contra el repositorio real
# con la identidad de la maquina, asi que en CI —donde «git config user.name» es la del
# runner y no casa con «personas»— marcaDe devolvia null y el caso caia. NO era un fallo del
# codigo: era PT-068 negandose a atribuir la sesion de otro, que es lo que debe hacer.
#
# Es la NOVENA vez del patron «probar donde trabajo, no donde se decide», y esta se colo hasta
# main: fusione los PR #148 y #149 sin mirar «gh pr checks», y los dos ya estaban en rojo por
# este caso. El verde local no dice nada del verde en CI.
#
# GIT_CONFIG_COUNT es el mecanismo de git para esto y no toca ninguna configuracion.
IDENT='GIT_CONFIG_COUNT=2 GIT_CONFIG_KEY_0=user.name GIT_CONFIG_KEY_1=user.email'
YO() { env $IDENT GIT_CONFIG_VALUE_0="Alberto Martínez" GIT_CONFIG_VALUE_1="albe.mtz@gmail.com" \
       node "$SUITE/tools/tracker.mjs" "$@" "$RAIZ_REAL"; }
OTRO() { env $IDENT GIT_CONFIG_VALUE_0="runner-de-ci" GIT_CONFIG_VALUE_1="r@ci" \
       node "$SUITE/tools/tracker.mjs" "$@" "$RAIZ_REAL"; }
chk   "viabilidad nombra la sesion abierta"  "en la sesion abierta en"  YO viabilidad PT-060
chk   "…y sigue dando su veredicto"          "veredicto"                YO viabilidad PT-060
# La OTRA rama no se probaba nunca, y es la que CI ejecutaba. Sin este caso, el arreglo de
# arriba solo tapa el sintoma: quedaria una rama del if sin ningun caso que la mire.
chk   "otra identidad NO hereda la sesion"   "no hay sesion abierta"    OTRO viabilidad PT-060
chk   "…y lo dice, no lo calla"              "el dia NO es la sesion"   OTRO viabilidad PT-060

# E16-E17 · AC-05 · la prosa de HANDOFF.md no se toca. Es lo unico del estado que NO se puede
# derivar: lleva las decisiones del firmante y los «no hacer» que salieron de ejecutar.
chk   "HANDOFF conserva sus decisiones"   "decisiones:"  sh -c 'cat "$1/docs/implementation/HANDOFF.md"' _ "$RAIZ_REAL"
chk   "…y sus «no hacer»"                 "no hacer:"    sh -c 'cat "$1/docs/implementation/HANDOFF.md"' _ "$RAIZ_REAL"
chkno "…y «sesion cerrar» no los borra"   "^0$"          sh -c 'grep -c "no hacer:" "$1/docs/implementation/HANDOFF.md"' _ "$RAIZ_REAL"

# LEX-R21 · el vocabulario vive en LEXICON, y antes que el codigo.
chk   "SESSION.json esta en LEXICON"      "SESSION.json"  cat "$SUITE/LEXICON.md"
chk   "…y dice que es una MARCA"          "MARCA, no memoria"  cat "$SUITE/LEXICON.md"
chk   "…y que el dia no es la sesion"     "NO es la sesi"  cat "$SUITE/LEXICON.md"
chk   "…y SESSION != STATE != TASK"       "SESSION ≠ STATE ≠ TASK"  cat "$SUITE/LEXICON.md"
chk   "…y que no sustituye a HANDOFF"     "no sustituye"  cat "$SUITE/LEXICON.md"

# ─── PT-061 · quién es quién ───────────────────────────────────────────────
# Medido al abrir EP-016, en un repositorio de UNA persona: 221 commits como «Alberto Martinez
# <alberto@a81.biz>», 9 como «a81Biz <albe.mtz@gmail.com>» y 1 como «Alberto Martinez
# <albe.mtz@gmail.com>». Tres identidades, una persona.
#
# Las otras cuatro tareas de EP-016 dependen de esta. Si se equivoca, las cuatro heredan el error
# SIN QUE SUS CASOS LO NOTEN: cada una comprobaria correctamente sobre una identidad falsa.
sec "── PT-061 · quién es quién ──"

P61='[{nombre:"Alberto Martínez",git:[{nombre:"Alberto Martínez",correo:"alberto@a81.biz"},{nombre:"a81Biz",correo:"albe.mtz@gmail.com"}]}]'

# E1-E3 · las identidades distintas resuelven a la MISMA persona.
PL "un par declarado da su persona"       "Alberto"   "console.log(m.personaDe({nombre:\"Alberto Martínez\",correo:\"alberto@a81.biz\"},$P61).persona)"
PL "…y la segunda identidad, la MISMA"    "Alberto"   "console.log(m.personaDe({nombre:\"a81Biz\",correo:\"albe.mtz@gmail.com\"},$P61).persona)"
PL "…y sin motivo, porque no hay duda"    "^null$"    "console.log(JSON.stringify(m.personaDe({nombre:\"a81Biz\",correo:\"albe.mtz@gmail.com\"},$P61).motivo))"

# E4-E5 · AC-03 · el par casa ENTERO. Es lo que sostiene el lote: solo el correo no basta —dos
# personas pueden compartir un buzon de equipo— y solo el nombre tampoco.
PL "mismo correo, OTRO nombre ⇒ null"     "^null$"    "console.log(JSON.stringify(m.personaDe({nombre:\"Otro\",correo:\"alberto@a81.biz\"},$P61).persona))"
PL "mismo nombre, OTRO correo ⇒ null"     "^null$"    "console.log(JSON.stringify(m.personaDe({nombre:\"Alberto Martínez\",correo:\"otro@x.com\"},$P61).persona))"
# Y no se adivina por dominio: mismo dominio, otra persona.
PL "mismo dominio NO es la misma persona"  "^null$"   "console.log(JSON.stringify(m.personaDe({nombre:\"Otra\",correo:\"otra@a81.biz\"},$P61).persona))"

# E6-E7 · el motivo dice QUE autor es y que NO se adivina.
PL "el motivo nombra al autor"            "Fulano"    "console.log(m.personaDe({nombre:\"Fulano\",correo:\"f@x.com\"},$P61).motivo)"
PL "…y su correo"                         "f@x.com"   "console.log(m.personaDe({nombre:\"Fulano\",correo:\"f@x.com\"},$P61).motivo)"
PL "…y dice que no se adivina"            "no se adivina por parecido"  "console.log(m.personaDe({nombre:\"F\",correo:\"f@x\"},$P61).motivo)"
PL "…y que hacer con el"                  "anadelo a su lista"  "console.log(m.personaDe({nombre:\"F\",correo:\"f@x\"},$P61).motivo)"

# E8-E9 · sin autor y sin tabla: distintos, y ninguno revienta.
PL "un commit sin autor lo dice"          "no declara autor"  "console.log(m.personaDe({}).motivo)"
PL "sin tabla, null y no revienta"        "^null$"    "console.log(JSON.stringify(m.personaDe({nombre:\"A\",correo:\"b\"},[]).persona))"
PLNO "…y no dice que sea culpa del commit"  "no declara autor"  "console.log(m.personaDe({nombre:\"A\",correo:\"b\"},[]).motivo)"

# E10-E11 · personaLocal · el canonico de esta maquina.
PL "personaLocal da el CANONICO"          "Alberto Martínez"  "console.log(m.personaLocal(\"a81Biz\",\"albe.mtz@gmail.com\",$P61).persona)"
PLNO "…y no el nombre de git config"      "a81Biz"    "console.log(m.personaLocal(\"a81Biz\",\"albe.mtz@gmail.com\",$P61).persona)"
PL "…y sin tabla, null para que el llamador use el de hoy"  "^null$"  "console.log(JSON.stringify(m.personaLocal(\"X\",\"y\",[]).persona))"

# E16-E17 · ramaDe y su compatibilidad. La misma persona, la MISMA rama desde cualquier maquina.
trlib "ramaDe normaliza el canonico"      "cauce/alberto-martinez"  "console.log(m.ramaDe(\"Alberto Martínez\"))"
trlib "…y desde la otra identidad seria OTRA rama"  "cauce/a81biz"  "console.log(m.ramaDe(\"a81Biz\"))"
chk   "por eso proyectar pasa por la tabla"  "personaLocal"  cat "$SUITE/tools/tracker.mjs"
chk   "…y sin personas se comporta como antes"  "Sin «personas» declaradas se comporta"  cat "$SUITE/tools/tracker.mjs"

# E12-E15 · la accion, sobre el repositorio REAL, que es donde estan las tres identidades.
chk   "personas enseña a los declarados"   "Alberto Martínez"     TRR personas
chk   "…con cuantos commits lleva cada identidad"  "commits"      TRR personas
chk   "…y las TRES identidades bajo UNA persona"   "a81Biz"       TRR personas
chk   "…y distingue de «firmantes:»"       "no quien puede hacer que"  TRR personas
# Los no declarados salen SIEMPRE, no bajo una bandera: esconderlo garantiza que nadie lo mire.
chk   "el texto de los no declarados existe"  "SIN DECLARAR"      cat "$SUITE/tools/tracker.mjs"
chk   "…y dice que no se agrupa por parecido"  "quien es quien lo dice una persona"  cat "$SUITE/tools/tracker.mjs"

# E18-E19 · AC-04 · la comprobacion va en UNA direccion. La asimetria es lo que impide que
# «firmantes:» y «personas» se conviertan en dos copias del mismo hecho.
chk   "verify-suite exige firmante ⇒ persona"  "puede firmar y no esta declarado"  cat "$SUITE/tools/verify-suite.mjs"
chk   "…y dice que la direccion es deliberada"  "NO EN LA CONTRARIA"  cat "$SUITE/tools/verify-suite.mjs"
chkno "…y NO exige persona ⇒ firmante"     "no puede firmar y esta declarado"  cat "$SUITE/tools/verify-suite.mjs"
# Sin personas declaradas no se comprueba nada: un proyecto de una persona no declara la tabla.
chk   "sin personas no se comprueba"       "no se comprueba nada"  cat "$SUITE/tools/verify-suite.mjs"

# E20 · las tres identidades de ESTE repositorio, declaradas de verdad.
chk   "el registro declara personas"       '"personas"'  sh -c 'cat "$1/docs/implementation/REGISTRY.json"' _ "$RAIZ_REAL"
chk   "…con las tres identidades"          "albe.mtz@gmail.com"  sh -c 'cat "$1/docs/implementation/REGISTRY.json"' _ "$RAIZ_REAL"

# LEX-R21 · el vocabulario en LEXICON, y antes que el codigo.
chk   "«personas» esta en LEXICON"         "personas"          cat "$SUITE/LEXICON.md"
chk   "…y que el par casa ENTERO"          "casa entero"       cat "$SUITE/LEXICON.md"
chk   "…y que no es «firmantes:»"          "NO es"             cat "$SUITE/LEXICON.md"
chk   "…y que no dice que puede nadie"     "no dice qué puede" cat "$SUITE/LEXICON.md"

# ─── PT-062 · los IDs se reparten por rangos reservados ────────────────────
# PHASE 2 lo REPRODUJO en un repositorio de prueba: si Ana y Bruno asignan PT-066 a la vez, el
# CONTADOR se fusiona SIN CONFLICTO —los dos escribieron 66— y el conflicto queda reducido a una
# linea de «slug». Quien lo resuelva elige un texto y la otra tarea DESAPARECE ENTERA.
#
# El dano no es el conflicto: es que el conflicto PARECE PEQUENO.
sec "── PT-062 · rangos reservados ──"

# E1-E3 · el siguiente se DERIVA de lo usado DENTRO del rango.
PL "rango vacio da el primero"            "^100$"  "console.log(m.siguienteEnRango(\"PT\",[100,200],[]).numero)"
PL "…y con usados, el siguiente"          "^102$"  "console.log(m.siguienteEnRango(\"PT\",[100,200],[100,101]).numero)"
# Los de FUERA no cuentan: los 65 PT de este repositorio se asignaron sin rango, y si contaran
# para el de otra persona su primer ID saltaria sin motivo.
PL "los de FUERA del rango no cuentan"    "^100$"  "console.log(m.siguienteEnRango(\"PT\",[100,200],[1,2,65]).numero)"
PL "sin rango declarado ⇒ null"           "^null$" "console.log(JSON.stringify(m.siguienteEnRango(\"PT\",null,[]).numero))"
PL "…y lo dice"                           "no declara rango"  "console.log(m.siguienteEnRango(\"PT\",null,[]).motivo)"

# E5-E6 · AC-05 · agotado se DICE. Invadir el siguiente reproduce la colision, mas tarde.
PL "un rango agotado NO invade"           "^null$" "console.log(JSON.stringify(m.siguienteEnRango(\"PT\",[1,3],[1,2,3]).numero))"
PL "…y dice que esta AGOTADO"             "AGOTADO"  "console.log(m.siguienteEnRango(\"PT\",[1,3],[1,2,3]).motivo)"
PL "…y cuantos hay"                       "3 usados" "console.log(m.siguienteEnRango(\"PT\",[1,3],[1,2,3]).motivo)"
PL "…y que ampliarlo es humano"           "decision humana"  "console.log(m.siguienteEnRango(\"PT\",[1,3],[1,2,3]).motivo)"

# E7-E10 · seSolapan. Tocarse por un extremo YA es solaparse: ese numero compartido es
# exactamente el que las dos personas pediran a la vez.
PL "rangos disjuntos NO se solapan"       "^false$"  "console.log(m.seSolapan([1,10],[11,20]))"
PL "solape parcial SI"                    "^true$"   "console.log(m.seSolapan([1,10],[5,20]))"
PL "uno dentro de otro tambien"           "^true$"   "console.log(m.seSolapan([1,100],[10,20]))"
PL "…y TOCARSE por un extremo tambien"    "^true$"   "console.log(m.seSolapan([1,100],[100,200]))"
PLNO "…y no revienta con basura"          "true"     "console.log(m.seSolapan(null,[1,2]))"
# E11-E12 · solapes sobre una tabla.
TRES='[{nombre:"A",rango:{PT:[1,100]}},{nombre:"B",rango:{PT:[100,200]}},{nombre:"C",rango:{PT:[300,400]}}]'
PL "solapes encuentra el par"             "^1$"      "console.log(m.solapes($TRES).length)"
PL "…y nombra a los dos"                  "\"a\":\"A\""  "console.log(JSON.stringify(m.solapes($TRES)))"
PL "…y al otro"                           "\"b\":\"B\""  "console.log(JSON.stringify(m.solapes($TRES)))"
PL "sin solapes, lista vacia"             "^0$"      "console.log(m.solapes([{nombre:\"A\",rango:{PT:[1,10]}},{nombre:\"B\",rango:{PT:[11,20]}}]).length)"

# E13-E16 · la accion, sobre el repositorio REAL.
chk   "asignar da un ID"                  "PT-0"     TRR asignar PT --slug prueba --ver
# AC-03 · decision 2 del firmante: el identificador NO se namespacea.
chkno "…y NO lleva el nombre de nadie"    "alberto"  TRR asignar PT --slug prueba --ver
chk   "…y dice de donde sale"             "contador global\|del rango de"  TRR asignar PT --slug prueba --ver
chk   "--ver no escribe nada"             "no se ha escrito nada"  TRR asignar PT --slug prueba --ver
# AC-06 · sin rangos, como hoy. Este repositorio no los declara.
chk   "sin rangos, del contador global"   "contador global"  TRR asignar PT --slug prueba --ver
chk   "…y sin slug se niega"              "necesita un slug"  TRR asignar PT

# E17-E19 · las dos comprobaciones de verify-fdge, y que sin rangos no comprueban nada.
chk   "verify-fdge detecta rangos solapados"  "SOLAPADOS"  cat "$SUITE/tools/verify-fdge.mjs"
chk   "…y una allocation fuera de todo rango"  "fuera de todos los rangos"  cat "$SUITE/tools/verify-fdge.mjs"
chk   "…y solo si hay rangos declarados"      "sin ellos no hay nada"   cat "$SUITE/tools/verify-fdge.mjs"
chk   "…y dice por que se comprueba aqui"     "aunque nadie"  cat "$SUITE/tools/verify-fdge.mjs"

# E20 · personas enseña el rango cuando lo hay.
chk   "personas puede ensenar el rango"   "siguiente"  cat "$SUITE/tools/tracker.mjs"

# LEX-R21 · el vocabulario en LEXICON.
chk   "«rango» esta en LEXICON"           "Rango reservado"  cat "$SUITE/LEXICON.md"
chk   "…y que el registro sigue asignando"  "sigue asignando"  cat "$SUITE/LEXICON.md"
chk   "…y que NO se namespacea"           "NO se namespacea"   cat "$SUITE/LEXICON.md"
chk   "…y que tocarse ya es solaparse"    "solo se tocan por un extremo"  cat "$SUITE/LEXICON.md"
chk   "…y que agotado no se invade"       "no se invade"       cat "$SUITE/LEXICON.md"

# ─── PT-063 · el usuario vive en la rama de tarea ──────────────────────────
# Decision 3 del firmante: el usuario vive en la RAMA DE TAREA y «trabajo» sigue siendo unica.
#
# PHASE 2 midio que el formato NO SE COMPRUEBA: FDGE-R19 lo fija y ninguna herramienta lo parsea.
# 22 ramas declaradas, todas de dos niveles, y cero comprobaciones que se rompan.
sec "── PT-063 · el usuario en la rama de tarea ──"

# E1-E4 · el formato nuevo, con el nombre CANONICO.
PL "la rama lleva al usuario"             "chore/alberto-martinez/PT-063"  "console.log(m.ramaDeTarea(\"chore\",\"PT-063\",\"slug\",\"Alberto Martínez\"))"
PL "…y el tipo en minusculas"             "^chore/"   "console.log(m.ramaDeTarea(\"CHORE\",\"PT-063\",\"slug\",\"Alberto Martínez\"))"
PL "…y el usuario normalizado"            "alberto-martinez"  "console.log(m.normalizaRef(\"Alberto Martínez\"))"
# El mismo normalizador que «cauce/<usuario>»: si divergieran, la misma persona tendria dos
# nombres segun que rama se mire.
trlib "…con el MISMO normalizador que cauce/"  "cauce/alberto-martinez"  "console.log(m.ramaDe(\"Alberto Martínez\"))"
PL "…y el canonico, no el de git config"  "alberto-martinez"  "console.log(m.ramaDeTarea(\"chore\",\"PT-1\",\"s\",\"Alberto Martínez\"))"
PLNO "…que habria dado otra rama"         "a81biz"    "console.log(m.ramaDeTarea(\"chore\",\"PT-1\",\"s\",\"Alberto Martínez\"))"

# E5-E7 · AC-04 · sin usuario, DOS niveles. Un proyecto de una persona no cambia nada.
PL "sin usuario, dos niveles"             "^chore/PT-063-slug$"  "console.log(m.ramaDeTarea(\"chore\",\"PT-063\",\"slug\"))"
PL "una rama de dos niveles no lleva usuario"  "^false$"  "console.log(m.ramaLlevaUsuario(\"chore/PT-063-slug\"))"
PL "…y una de tres si"                    "^true$"    "console.log(m.ramaLlevaUsuario(\"chore/alberto-martinez/PT-063-slug\"))"
PLNO "…y «trabajo» no cuenta como rama de tarea"  "^true$"  "console.log(m.ramaLlevaUsuario(\"trabajo\"))"

# E8-E9 · AC-02 · «trabajo» sigue siendo UNA. Es un criterio sobre lo que NO debe pasar, y esos
# son los que mas facil se dan por buenos sin mirar.
chkno "no existe «trabajo/<usuario>» en RULES"   "trabajo/<usuario>"  cat "$SUITE/RULES.md"
chkno "…ni en LEXICON"                           "trabajo/<usuario>"  cat "$SUITE/LEXICON.md"
chk   "…y LEXICON dice que «trabajo» es UNA"     "sigue siendo una"   cat "$SUITE/LEXICON.md"

# E10-E11 · AC-03 · G4 sigue siendo UNA por lote.
chk   "FDGE-R19 sigue diciendo que G4 no se multiplica"  "no se multiplica por tarea"  cat "$SUITE/RULES.md"
chk   "…y que el PR de tarea es revision"        "no es .G4"          cat "$SUITE/RULES.md"
chk   "EXEC-R03 sigue existiendo"                "EXEC-R03"           cat "$SUITE/RULES.md"

# E12-E13 · la accion PROPONE, no crea.
chk   "rama propone el nombre"            "PT-063"              TRR rama PT-063
chk   "…y dice que NO se crea"            "NO se crea"          TRR rama PT-063
chk   "…y describe el comando"            "git checkout -b"     TRR rama PT-063
chk   "…y de donde nace"                  "git switch trabajo"  TRR rama PT-063

# E14-E15 · la comprobacion AVISA y dice desde cuando.
chk   "verify-fdge avisa, no falla"       "warn..FDGE-R19"      cat "$SUITE/tools/verify-fdge.mjs"
chk   "…y dice desde que version"         "Desde 8.3.0"         cat "$SUITE/tools/verify-fdge.mjs"
chk   "…y que las anteriores siguen valiendo"  "se termina como empezo"  cat "$SUITE/tools/verify-fdge.mjs"
chk   "…y solo con personas declaradas"   "personas ?? \[\]).length"     cat "$SUITE/tools/verify-fdge.mjs"
# Y NO se falla «a partir de la proxima version»: una comprobacion que cambia de severidad con el
# tiempo es una que nadie puede razonar.
chk   "…y se dice por que no se falla con el tiempo"  "cambia de severidad con el tiempo"  cat "$SUITE/tools/verify-fdge.mjs"

# E16-E17 · FDGE-R19 dice el formato nuevo Y SIGUE DICIENDO todo lo demas. Un caso que solo
# mirase el formato pasaria aunque el resto de la regla se hubiera perdido.
chk   "FDGE-R19 dice el formato nuevo"    "usuario>/PT-NNN-slug"  cat "$SUITE/RULES.md"
chk   "…y sigue exigiendo commits atomicos"  "Commits atómicos"   cat "$SUITE/RULES.md"
chk   "…y sus prefijos"                   "refactor"              cat "$SUITE/RULES.md"
chk   "…y los TRES niveles"               "tres niveles"          cat "$SUITE/RULES.md"
chk   "…y que la rama va al registro"     "branch"                cat "$SUITE/RULES.md"
chk   "…y que sin personas sigue el de antes"  "sin personas declaradas"  cat "$SUITE/RULES.md"

# ─── PT-064 · de quién es cada commit ──────────────────────────────────────
# EP-015 lo dejo declarado y sin cerrar: «el dia de dos personas son dos sesiones que porSesion()
# cuenta como UNA, y el techo historico —del que depende AC-06 de PT-059— sale INFLADO».
#
# PHASE 2 midio que NINGUNA cifra pedia el autor, y que las tres se rompen DISTINTO.
sec "── PT-064 · de quién es cada commit ──"

XS='[{id:1,persona:"A"},{id:2,persona:"B"},{id:3,persona:null}]'

# E1-E3 · soloDe. Con null devuelve TODO, que es lo que impide romper EP-015.
PL "filtra por persona"                   "^\[1\]$"      "console.log(JSON.stringify(m.soloDe($XS,\"A\").map(x=>x.id)))"
PL "…y con null devuelve TODO"            "^\[1,2,3\]$"  "console.log(JSON.stringify(m.soloDe($XS,null).map(x=>x.id)))"
PLNO "…y los sin persona no entran en el de nadie"  "3"  "console.log(JSON.stringify(m.soloDe($XS,\"B\").map(x=>x.id)))"
# E4 · y se CUENTAN: la ausencia se ve en vez de restar en silencio.
PL "sinPersona los cuenta"                "^1$"          "console.log(m.sinPersona($XS))"
PL "…y con todos declarados, cero"        "^0$"          "console.log(m.sinPersona([{persona:\"A\"}]))"

# E5-E6 · las tres derivaciones piden el autor, con un separador que no aparece en un nombre.
chk   "las derivaciones piden el autor"   "%an"          cat "$SUITE/tools/tracker.mjs"
chk   "…y el correo"                      "%ae"          cat "$SUITE/tools/tracker.mjs"
# PT-057 uso un espacio porque el SHA no lleva ninguno. Un NOMBRE si: «Alberto Martinez» se
# partiria en dos campos.
chk   "…con un separador que no es un espacio"  "SEP_REG"  cat "$SUITE/tools/tracker.mjs"
chk   "…y se dice por que"                "un NOMBRE si"   cat "$SUITE/tools/tracker.mjs"

# E7-E8 · el precedente y el techo se filtran SIEMPRE.
chk   "el precedente se filtra por persona"  "soloDe(conDato, yo)"  cat "$SUITE/tools/tracker.mjs"
chk   "…y el techo tambien"               "soloDe(sesiones, yo)"   cat "$SUITE/tools/tracker.mjs"
chk   "…y se dice por que siempre"        "comparar contra el"     cat "$SUITE/tools/tracker.mjs"
# Una sesion es de un DIA y de una PERSONA: contarlas juntas infla el techo.
chk   "una sesion es de un dia Y de una persona"  "de una PERSONA"  cat "$SUITE/tools/tracker.mjs"

# E9-E11 · el coste, a peticion, y DICE de quien es SIEMPRE.
chk   "sin filtro dice que es de todas"   "de TODAS las personas"  TRR coste CHORE STANDARD
# «--mio» depende de «git config user.name» de la MAQUINA: en CI es el del runner y no resuelve
# a ninguna persona declarada, asi que no hay a quien filtrar. El caso pasaba en local y fallaba
# en CI — octava vez del mismo patron en dos lotes. Se comprueba con «--de» y un nombre DECLARADO,
# que no depende de donde corra.
chk   "--de con persona declarada dice de quien"  "solo de Alberto"  TRR coste CHORE STANDARD --de "Alberto Martínez"
chk   "…y sigue dando la cifra"           "lineas"                 TRR coste CHORE STANDARD --de "Alberto Martínez"
# Con un nombre que no existe no queda ninguna tarea, asi que no hay cifra que etiquetar: lo
# que se comprueba es que el filtro SE APLICO, y eso se ve en que el grupo queda vacio.
chk   "--de tambien filtra"               "0 tareas"               TRR coste CHORE STANDARD --de Nadie
# Con un nombre que no existe no hay casos: SIN REFERENCIA, no una cifra inventada.
chk   "…y con un nombre que no existe, SIN REFERENCIA"  "SIN REFERENCIA"  TRR coste CHORE STANDARD --de Nadie

# E13-E15 · AC-05 · con una sola persona, las cifras son las de hoy.
chk   "viabilidad sigue dando veredicto"  "veredicto"              TRR viabilidad PT-064
chk   "…y el techo dice de quien es"      "la mayor sesion registrada"  TRR viabilidad PT-064
chk   "…y el precedente sigue saliendo"   "mayor hecho"            TRR viabilidad PT-064

# AC-04 · el texto de los no declarados existe y dice que no se adjudican.
chk   "el texto de los no declarados existe"  "sin declarar no se reparten"  cat "$SUITE/tools/tracker.mjs"
chk   "…y remite a «tracker personas»"    "los enumera"            cat "$SUITE/tools/tracker.mjs"

# Lo que esta tarea NO hace, comprobado: no toca la logica de PT-057 ni de PT-059.
chkno "no se toco costeDe"                "export function costeDe.*persona"  cat "$SUITE/tools/tracker.mjs"
chk   "…y viabilidadDe sigue en patrones" "export function viabilidadDe"      cat "$SUITE/tools/patrones.mjs"

# ─── PT-065 · la sesión es de alguien ──────────────────────────────────────
# EP-015 lo dejo declarado: «SESSION.json es de UNA sesion: al abrir se sobrescribe. Con dos
# personas trabajando eso no basta».
#
# PHASE 2 reprodujo el conflicto: SESSION.json esta VERSIONADO, asi que la marca de una persona
# no solo se pierde, SE PROPAGA — conflicto en cada merge, y la resolucion obvia borra la del otro.
sec "── PT-065 · la sesión es de alguien ──"

# E1-E4 · un archivo por persona. La colision se evita POR CONSTRUCCION.
PL "el archivo lleva a la persona"        "SESSION-alberto-martinez.json"  "console.log(m.archivoSesion(\"Alberto Martínez\"))"
PL "…sin persona, el de siempre"          "^SESSION.json$"   "console.log(m.archivoSesion(null))"
PL "…normalizado igual que las ramas"     "SESSION-alberto-martinez"  "console.log(m.archivoSesion(\"Alberto Martínez\"))"
PL "dos personas, DOS archivos distintos"  "^true$"  "console.log(m.archivoSesion(\"Bruno\")!==m.archivoSesion(\"Ana\"))"

# E5-E7 · las ajenas se ven. Si cada una solo viera la suya, las dos creerian que trabajan solas.
MS='[{persona:"A",desde:"x"},{persona:"B",desde:"y"},{desde:"z"}]'
PL "las ajenas se enumeran"               "\[\"B\"\]"    "console.log(JSON.stringify(m.sesionesAjenas($MS,\"A\").map(x=>x.persona)))"
PLNO "…y la propia NO"                    "\"A\""        "console.log(JSON.stringify(m.sesionesAjenas($MS,\"A\").map(x=>x.persona)))"
# Una marca sin persona es la de un proyecto de una sola persona: contarla haria ver una sesion
# fantasma.
PL "…y una marca sin persona no es ajena"  "^1$"         "console.log(m.sesionesAjenas($MS,\"A\").length)"

# E9-E12 · la accion, sobre el FIXTURE (PT-076: antes iba contra el repositorio real).
build_fixture; git_fixture
chk   "sesion abrir escribe la marca"     "sesion abierta desde"  TR sesion abrir
chk   "…y sesion la lee"                  "sesion desde"          TR sesion
chk   "…con las cifras de PT-058"         "MEDIDO"                TR sesion
# El texto de las ajenas existe y explica por que se ensenan.
chk   "el texto de las ajenas existe"     "Otras sesiones abiertas"  cat "$SUITE/tools/tracker.mjs"
# El texto va partido en dos lineas por el ancho: se busca un fragmento que quepa en UNA.
chk   "…y dice por que se ensenan"        "trabajan solas"  cat "$SUITE/tools/patrones.mjs"
# E11 · compatibilidad: si no hay propio, cae a SESSION.json.
#
# PT-068 movio esta decision a marcaDe() en patrones.mjs —dos lecturas del mismo hecho divergen,
# SUITE-R38— asi que el caso sigue al codigo. Lo que comprueba NO cambia: que el respaldo existe
# y que su motivo esta escrito. AC-05 de PT-065 sigue vigente y tiene sus propios casos.
chk   "cae a SESSION.json si no hay propio"  "SESSION.json"       cat "$SUITE/tools/patrones.mjs"
chk   "…y se dice que es por compatibilidad"  "El respaldo NO se quita"  cat "$SUITE/tools/patrones.mjs"

# E13-E14 · AC-04 · el handoff sigue derivado y HANDOFF.md sigue intacto. Sobre el FIXTURE.
build_fixture; git_fixture
TR sesion abrir >/dev/null 2>&1
chk   "sesion cerrar sigue dando el handoff"  "en curso"          TR sesion cerrar
chk   "…y dice que HANDOFF.md queda intacto"  "INTACTO"           TR sesion cerrar
chk   "…y que no borra la marca"          "NO se borra"           TR sesion cerrar

# LEX-R21 · el vocabulario, y la distincion con LEX-R26 dicha explicitamente.
chk   "SESSION-<usuario> esta en LEXICON"  "SESSION-<usuario>.json"  cat "$SUITE/LEXICON.md"
chk   "…y dice que la colision se evita"   "por construcción"        cat "$SUITE/LEXICON.md"
chk   "…y que las ajenas se ven"           "sesiones ajenas se ven"  cat "$SUITE/LEXICON.md"
chk   "…y que NO contradice LEX-R26"       "no contradice"           cat "$SUITE/LEXICON.md"
chk   "…y por que: el checkpoint es de la TAREA"  "la tarea en curso"  cat "$SUITE/LEXICON.md"

# ─── PT-056 · el arbol corresponde al checkpoint (STATE_MISMATCH) ──────────
# PT-052 dejo el `sha` y verify-fdge exige que sea ALCANZABLE. Eso impide la averia obvia —un
# checkpoint que apunta a nada— y NO impide la peligrosa: un SHA REAL que describe un arbol que
# ya no existe. Ese pasa la comprobacion anterior entera, y sobre el decidirian el presupuesto
# y la compuerta de EP-015.
#
# Los casos de la funcion pura no necesitan git: se le pasa el estado. Los de las dos
# herramientas SI, y por eso mas abajo el fixture se hace repositorio — la correspondencia no se
# puede comprobar sin algo con lo que corresponder.
sec "── PT-056 · el arbol corresponde al checkpoint ──"

# E1..E3 · solo `sha` y `rama` sostienen la correspondencia.
CPOK='{pt:"PT-1",sha:"a".repeat(40),rama:"chore/x"}'
trlib "sha y rama iguales ⇒ corresponde"      "^true$" \
  "console.log(m.estadoDelArbol($CPOK,{sha:\"a\".repeat(40),rama:\"chore/x\"}).corresponde)"
trlib "sha distinto ⇒ NO corresponde"         "^false$" \
  "console.log(m.estadoDelArbol($CPOK,{sha:\"b\".repeat(40),rama:\"chore/x\"}).corresponde)"
# PT-094 DEROGA este caso: cambiar de rama DENTRO DE LA MISMA HISTORIA no es divergencia.
# Lo midio el G4 de PT-094: al fusionarse su PR de revision la rama se borro, el trabajo
# quedo CONTENIDO en el arbol, y el checkpoint daba rojo en `trabajo` y otra vez en `main`
# — con otro nombre de rama cada vez. TODA fusion lo invalidaba, que es el caso normal.
trlib "otra rama, misma historia: corresponde" "^true$"   "console.log(m.estadoDelArbol($CPOK,{sha:\"a\".repeat(40),rama:\"otra\"}).corresponde)"
trlibno "…y la rama no figura como discrepancia" "rama"   "console.log(JSON.stringify(m.estadoDelArbol($CPOK,{sha:\"a\".repeat(40),rama:\"otra\"}).discrepancias))"

# E4/E5 · lo que separa esto de una herramienta que molesta. Medido en PHASE 2: la lista de
# archivos paso de 3 a 5 con el sha intacto en el tiempo de escribir tres parrafos. Si eso fuera
# discrepancia el aviso saltaria SIEMPRE — y entonces el dia que sea real tampoco se leeria.
trlib "un arbol SUCIO no es discrepancia"     "^true$" \
  "console.log(m.estadoDelArbol($CPOK,{sha:\"a\".repeat(40),rama:\"chore/x\",sucio:true}).corresponde)"
trlib "otra lista de archivos tampoco"        "^true$" \
  "console.log(m.estadoDelArbol($CPOK,{sha:\"a\".repeat(40),rama:\"chore/x\",archivos:[\"p\",\"q\"]}).corresponde)"

# E6/E7 · el mensaje ES el producto. «Hay diferencias» obliga a investigar justo cuando el
# estado no es de fiar.
DOS="m.estadoDelArbol($CPOK,{sha:\"b\".repeat(40),rama:\"otra\"})"
trlib "la discrepancia dice el campo"         "sha"        "console.log(JSON.stringify($DOS.discrepancias))"
trlib "…lo declarado"                         "aaaaaaaa"   "console.log(JSON.stringify($DOS.discrepancias))"
trlib "…y lo real"                            "bbbbbbbb"   "console.log(JSON.stringify($DOS.discrepancias))"
trlib "con dos, enumera LAS DOS"              "^2$"        "console.log($DOS.discrepancias.length)"
trlib "…y el texto las lleva las dos"         "rama"       "console.log(m.textoDiscrepancia($DOS))"

# Un commit ANTECESOR del actual no es discrepancia: va por detras, no miente. Sin esto el aviso
# saltaria despues de CADA commit —EP-014 hizo hasta diez por tarea contra nueve transiciones— y un
# aviso que salta siempre no se lee el dia que es cierto.
trlib "un sha ANTECESOR no es discrepancia"   "^true$"   "console.log(m.estadoDelArbol($CPOK,{sha:\"b\".repeat(40),rama:\"chore/x\",descendiente:true}).corresponde)"
trlib "…pero uno de OTRA historia si"         "^false$"   "console.log(m.estadoDelArbol($CPOK,{sha:\"b\".repeat(40),rama:\"chore/x\",descendiente:false}).corresponde)"
# RULE-06 · no poder demostrar que desciende no es haberlo demostrado.
trlib "…y no saberlo cuenta como discrepancia"  "^false$"   "console.log(m.estadoDelArbol($CPOK,{sha:\"b\".repeat(40),rama:\"chore/x\",descendiente:null}).corresponde)"

# Detached HEAD · `rev-parse --abbrev-ref HEAD` devuelve la cadena «HEAD», que no es el nombre de
# ninguna rama: es no poder leerlo. Es lo que deja actions/checkout, y sin esto la comprobacion se
# disparaba contra si misma en CADA PR — incluido el primero de esta misma tarea.
trlib "detached HEAD no es otra rama"         "^true$"   "console.log(m.estadoDelArbol($CPOK,{sha:\"a\".repeat(40),rama:\"HEAD\"}).corresponde)"
trlibno "…y no aparece como discrepancia"     "HEAD"   "console.log(JSON.stringify(m.estadoDelArbol($CPOK,{sha:\"a\".repeat(40),rama:\"HEAD\"}).discrepancias))"

# E8 · tres resultados, no dos. No tener foto y tener una foto equivocada son cosas distintas.
trlib "sin checkpoint ⇒ null, no false"       "^null$"     "console.log(JSON.stringify(m.estadoDelArbol(null).corresponde))"
trlib "…y lo dice en vez de callarlo"         "sin checkpoint"  "console.log(m.estadoDelArbol(null).motivo)"
# E9 · no se contrasta lo que no se declaro: `sha: null` ya lo avisa PT-052, y decirlo dos veces
# convierte un aviso en ruido.
trlib "un sha null no es discrepancia"        "^true$" \
  "console.log(m.estadoDelArbol({pt:\"P\",sha:null,rama:\"chore/x\"},{sha:\"z\",rama:\"chore/x\"}).corresponde)"

# E11/E12 · el texto NO repara: propone. Reescribir el checkpoint al detectar el desfase borraria
# la unica prueba de que hubo divergencia, y decidir cual manda es de SUITE-R06.
trlib "el texto lo llama por su nombre"       "STATE_MISMATCH"   "console.log(m.textoDiscrepancia($DOS))"
trlib "…dice que reanudar es HUMANO"          "SUITE-R06"        "console.log(m.textoDiscrepancia($DOS))"
trlib "…y PROPONE el comando"                 "tracker checkpoint PT-1"  "console.log(m.textoDiscrepancia($DOS))"
trlibno "…sin ejecutarlo ni repararlo"        "reparad\|corregido\|arreglad"  "console.log(m.textoDiscrepancia($DOS))"

# ── PT-094 · lo cerrado es evidencia, no estado ──────────────────────────────
#
# El caso que reproduce el fallo que dejo `main` en rojo y bloqueo `publicar.yml` dos veces:
# `PT-092` estaba INTEGRATED, su rama se borro al fusionarse, y el checkpoint seguia
# declarandola. La comprobacion lo leia como «el trabajo va por otro sitio».
#
# Sin el arreglo el primero de estos casos da `false`. Con el, `null` — que no es «corresponde»
# sino «no hay nada que contrastar», y por eso se comprueba tambien que lo DIGA.
CPFIN='{pt:"PT-92",status:"INTEGRATED",sha:"a".repeat(40),rama:"chore/borrada"}'
trlib "un PT INTEGRATED no se contrasta"      "^null$"   "console.log(JSON.stringify(m.estadoDelArbol($CPFIN,{sha:\"a\".repeat(40),rama:\"main\"}).corresponde))"
trlib "…y dice por que, citando SUITE-R36"    "SUITE-R36"   "console.log(m.estadoDelArbol($CPFIN,{sha:\"a\".repeat(40),rama:\"main\"}).motivo)"
trlibno "…sin inventar discrepancias"         "chore/borrada"   "console.log(JSON.stringify(m.estadoDelArbol($CPFIN,{sha:\"b\".repeat(40),rama:\"main\"}).discrepancias))"

# AC-03 · el arreglo NO puede apagar la comprobacion. Es la mitad que impide la salida facil:
# devolver `null` para todo checkpoint dejaria el repositorio verde y quitaria la guarda que
# PT-056 construyo para el caso peligroso — un sha real describiendo un arbol que ya no existe
# MIENTRAS la tarea sigue abierta.
CPVIVO='{pt:"PT-93",status:"IN_PROGRESS",sha:"a".repeat(40),rama:"chore/x"}'
trlib "un PT IN_PROGRESS SI se contrasta"     "^false$"   "console.log(m.estadoDelArbol($CPVIVO,{sha:\"b\".repeat(40),rama:\"otra\",descendiente:false}).corresponde)"
trlib "…y un DRAFT tambien"                   "^false$"   "console.log(m.estadoDelArbol({pt:\"P\",status:\"DRAFT\",sha:\"a\".repeat(40),rama:\"chore/x\"},{sha:\"b\".repeat(40),rama:\"otra\",descendiente:false}).corresponde)"

# DONE es el caso que decide si el arreglo esta bien trazado. Un PT en DONE espera G4 con su rama
# VIVA: ahi un sha que describe otro arbol si miente. ESTADOS_TERMINALES ya lo excluye por esta
# misma razon (PT-085), y este caso existe para que anadirlo cueste un rojo — en las dos reglas.
trlib "DONE espera G4: sigue vivo"            "^false$"   "console.log(m.estadoDelArbol({pt:\"P\",status:\"DONE\",sha:\"a\".repeat(40),rama:\"chore/x\"},{sha:\"b\".repeat(40),rama:\"otra\",descendiente:false}).corresponde)"
# Un checkpoint SIN estado se contrasta: no declararlo no es declararse cerrado (RULE-06).
trlib "sin «status» se contrasta igual"       "^false$"   "console.log(m.estadoDelArbol($CPOK,{sha:\"b\".repeat(40),rama:\"otra\",descendiente:false}).corresponde)"


# AC-09 · la rama CORROBORA, no dispara sola.
#
# Los dos lados hacen falta: lo que SIGUE cazando —otra historia— y lo que deja de cazar —el
# merge, que es lo que pasa siempre—. Sin el segundo par, la ampliacion seria indistinguible
# de apagar la comprobacion de rama.
CPD='{pt:"PT-94",status:"DONE",sha:"a".repeat(40),rama:"chore/borrada"}'
trlib "la rama sola ya no dispara"            "^true$"   "console.log(m.estadoDelArbol($CPD,{sha:\"a\".repeat(40),rama:\"main\"}).corresponde)"
trlib "…ni con un sha ANTECESOR"              "^true$"   "console.log(m.estadoDelArbol($CPD,{sha:\"c\".repeat(40),rama:\"main\",descendiente:true}).corresponde)"
trlib "…pero con OTRA historia si"            "^false$"   "console.log(m.estadoDelArbol($CPD,{sha:\"b\".repeat(40),rama:\"main\",descendiente:false}).corresponde)"
trlib "…y entonces enumera LAS DOS"           "^2$"   "console.log(m.estadoDelArbol($CPD,{sha:\"b\".repeat(40),rama:\"main\",descendiente:false}).discrepancias.length)"
# No poder demostrar que desciende sigue contando (RULE-06), y ahi la rama SI corrobora.
trlib "no saberlo arrastra la rama tambien"   "rama"   "console.log(JSON.stringify(m.estadoDelArbol($CPD,{sha:\"b\".repeat(40),rama:\"main\",descendiente:null}).discrepancias))"

# AC-04 · la guarda de PT-056 tiene que estar en el camino que DE VERDAD escribe el checkpoint.
# `checkpoint()` la pasaba y `avanzar` no, asi que en cada transicion de fase se volvia a escribir
# una rama que iba a desaparecer. Se comprueba sobre el fuente porque es una llamada, no un valor.
trlib "avanzar pasa ramaDeclaradaViva"        "ramaDeclaradaViva"   "console.log(require('fs').readFileSync(process.env.MTH_TRACKER,'utf8').split('3 · el checkpoint')[1].slice(0,900))"

# E10/E13 · las dos herramientas, sobre un repositorio DE VERDAD. El fixture no era git y por eso
# PT-052 dejo el caso del sha alcanzable fuera del arnes; aqui no se puede: la correspondencia
# necesita un HEAD contra el que corresponder.
build_fixture
CP6="$WORK/docs/implementation/CHECKPOINT.json"
TR6() { node "$WORK/docs/methodology/tools/tracker.mjs" "$@" "$WORK"; }
V6()  { node "$WORK/docs/methodology/tools/verify-fdge.mjs" "$@" "$WORK"; }

GIT6=""
if command -v git >/dev/null 2>&1; then
  ( cd "$WORK" \
    && git init -q 2>/dev/null \
    && git config user.email t@t && git config user.name t \
    && git add -A >/dev/null 2>&1 \
    && git commit -qm "fixture PT-056" >/dev/null 2>&1 ) && GIT6="si"
fi

if [ -z "$GIT6" ]; then
  # RULE-06 · si no se pudo comprobar, se DICE. Un bloque que se salta en silencio es un verde
  # por vacio, que es justo lo que PT-023 encontro ejecutando.
  bad "PT-056: sin git no se pudo probar STATE_MISMATCH sobre las herramientas"
else
  # `siguiente` se planta si el proyecto no declara plataforma, y el fixture no la declaraba: los
  # cuatro casos de `siguiente` pasaban por VACIO —la herramienta no llegaba a correr— y el
  # `chkno` daba verde por silencio. Es el defecto que PT-023 encontro ejecutando, otra vez.
  node -e 'const fs=require("node:fs"),p=process.argv[1];const r=JSON.parse(fs.readFileSync(p,"utf8"));r.tracker={plataforma:"github"};fs.writeFileSync(p,JSON.stringify(r,null,2));' "$WORK/docs/implementation/REGISTRY.json"
  # Y esto lo impide en adelante: si `siguiente` no llega a producir su cabecera, el bloque
  # entero es una asercion sobre nada.
  chk   "tracker siguiente llega a correr"         "PT-004  IN_PROGRESS"    TR6 siguiente PT-004
  # …y SIN credencial tambien. Los cuatro casos de abajo pasaban en local y fallaban en CI: la
  # accion exigia acceso al tablero para responder algo que DERIVA del registro (SUITE-R48), y en
  # CI no hay «gh auth». Un arnes que solo esta verde donde el agente trabaja no protege el merge,
  # que es donde se decide. Se simula quitando gh del PATH y dejando git y node.
  SIN_GH="$WORK/.sin-gh"; mkdir -p "$SIN_GH"
  _bin() { dirname "$(command -v "$1")"; }
  TR6NOGH() { PATH="$(_bin node):$(_bin git):$SIN_GH" node "$WORK/docs/methodology/tools/tracker.mjs" "$@" "$WORK"; }
  chk   "…y sin credencial de tablero, tambien"    "PT-004  IN_PROGRESS"    TR6NOGH siguiente PT-004
  # RULE-06 · no es «no hay comentarios»: es que nadie pudo mirar. Callarlo apagaria SUITE-R43 en
  # silencio justo donde no hay quien lo note.
  chk   "…diciendo que SUITE-R43 no se evaluo"     "SUITE-R43 SIN EVALUAR"  TR6NOGH siguiente PT-004

  TR6 checkpoint PT-004 >/dev/null 2>&1
  # La foto recien tomada corresponde por construccion: es la comprobacion POSITIVA, y sin ella
  # la negativa no prueba nada — un fail que siempre falla no distingue.
  chk   "recien escrito, verify-fdge lo da bueno"  "arbol correspondiente"  V6 PT-004
  chkno "…y tracker siguiente NO bloquea"          "STATE_MISMATCH"         TR6 siguiente PT-004

  # Y ahora el caso peligroso: un SHA que EXISTE pero no es el del arbol. Pasaba entero la
  # comprobacion de PT-052.
  cp6_set() { [ -f "$CP6" ] || return 0; MTH_CP6="$CP6" node -e "$1"; }
  cp6_set 'const fs=require("node:fs");const p=process.env.MTH_CP6;const c=JSON.parse(fs.readFileSync(p,"utf8"));c.rama="chore/OTRA";fs.writeFileSync(p,JSON.stringify(c,null,2));'
  # PT-094 · tocar SOLO la rama ya no basta, y ese es el arreglo: sobre el arbol real este
  # checkpoint describe el commit de HEAD, asi que es un estado de ESTA historia con una
  # etiqueta vieja. Es lo que pasaba en cada merge.
  chkno "solo la rama: verify-fdge NO falla"      "STATE_MISMATCH"         V6 PT-004
  # Con un sha de OTRA historia vuelve a fallar, y la rama corrobora. Es el caso peligroso.
  cp6_set 'const fs=require("node:fs");const p=process.env.MTH_CP6;const c=JSON.parse(fs.readFileSync(p,"utf8"));c.sha="0".repeat(40);fs.writeFileSync(p,JSON.stringify(c,null,2));'
  chk   "otra historia + otra rama: FALLA"        "LEX-R26"                V6 PT-004
  # El mensaje llevaba la rama truncada a siete caracteres —«chore/O»— porque acortaba TODO como
  # si fuera un SHA. Un aviso que corta justo el dato por el que se detiene no sirve de nada.
  # Con cuarenta ceros el commit NO ES ALCANZABLE, asi que salta la comprobacion ANTERIOR
  # (PT-052) y ni siquiera se llega a mirar la rama. Que el mensaje diga CUAL es el commit
  # importa: un checkpoint que apunta a nada miente con la autoridad de un dato estructurado.
  chk   "…y nombra el commit inalcanzable"        "00000000"               V6 PT-004
  # Que la rama salga ENTERA —sin truncar a siete caracteres como si fuera un SHA— lo
  # sostienen los casos de la funcion pura: aqui no se llega a mirarla. Escribir aqui otra
  # asercion seria un caso que no puede fallar, que es justo lo que este PT persigue.
  chk   "…y que decidir es humano"                "SUITE-R06"              V6 PT-004
  chk   "tracker siguiente BLOQUEA"               "BLOQUEA"                TR6 siguiente PT-004
  chk   "…y sin credencial BLOQUEA igual"         "STATE_MISMATCH"         TR6NOGH siguiente PT-004
  chk   "…nombrando la condicion"                 "STATE_MISMATCH"         TR6 siguiente PT-004
  chk   "…y propone el comando"                   "tracker checkpoint PT-004"  TR6 siguiente PT-004
  chk   "…y no dice que siga como si nada"        "RESUELVE PRIMERO"       TR6 siguiente PT-004

  # E14 · rehacer la foto la vuelve a hacer corresponder. Es lo que el mensaje propone, y si no
  # funcionara el mensaje estaria mandando a un sitio que no arregla nada.
  TR6 checkpoint PT-004 >/dev/null 2>&1
  chk   "rehacer el checkpoint lo resuelve"       "arbol correspondiente"  V6 PT-004
  chkno "…y el bloqueo desaparece"                "STATE_MISMATCH"         TR6 siguiente PT-004

  # Al integrar, la rama de tarea se BORRA. El checkpoint la tomaba de alloc.branch y pasaba a
  # afirmar una referencia muerta — que es exactamente lo que STATE_MISMATCH existe para impedir.
  # Salio al integrar esta misma tarea: PT-056 se fusiono, su rama desaparecio, y el checkpoint
  # siguio declarandola.
  chk   "la rama declarada solo vale si existe"   "\"rama\": \"master\""  sh -c 'cat "$1"' _ "$CP6"

  # El checkpoint de OTRA tarea no dice nada de esta: es UNO (LEX-R26), y contrastar contra el
  # ajeno bloquearia por un estado que no es el suyo.
  TR6 checkpoint PT-001 >/dev/null 2>&1
  chkno "el checkpoint ajeno no bloquea a PT-004" "STATE_MISMATCH"         TR6 siguiente PT-004
fi

# E15 · LEX-R21 · el nombre vive en LEXICON, y antes que en el codigo.
chk   "STATE_MISMATCH esta en LEXICON"          "STATE_MISMATCH"     cat "$SUITE/LEXICON.md"
chk   "…y LEX-R26 exige la correspondencia"     "tiene que corresponder"  cat "$SUITE/LEXICON.md"
chk   "…y dice que sucio NO es discrepancia"    "NO es una discrepancia"  cat "$SUITE/LEXICON.md"
chkno "…y no lo convierte en un status"         "status.*STATE_MISMATCH"  cat "$SUITE/LEXICON.md"

# CORRIGE PT-052 · `gitDe` hacia trim() de TODA la salida de `git status --porcelain`, y eso se
# comia el espacio inicial de la PRIMERA linea cuando el cambio no estaba indexado; el slice(3)
# posterior cortaba un caracter del path. El CHECKPOINT.json vivo declaraba «hanges/…/intake.md».
# Lo encontro ejecutar la herramienta, no leerla.
chk   "gitDe distingue crudo de recortado"      "crudo"   cat "$SUITE/tools/tracker.mjs"
if [ -n "$GIT6" ]; then
  ( cd "$WORK" && printf 'x\n' >> docs/implementation/HANDOFF.md 2>/dev/null || true )
  TR6 checkpoint PT-004 >/dev/null 2>&1
  # El patron es la ruta SIN su primera letra: «[a-z]*ocs/» casaria tambien con «docs/» y el
  # caso pasaria sin comprobar nada — la quinta vez en el lote que una asercion casa consigo misma.
  chkno "ningun path del checkpoint pierde letras"  '"ocs/'  cat "$CP6"
fi

# ─── PT-054 · ver en que se trabaja sin esperar al merge ───────────────────
# Medido: 13 ramas de tarea en el remoto. La visibilidad existe y esta repartida en trece sitios,
# asi que hay que saber DE ANTEMANO que rama mirar. La rama cauce/<usuario> agrega, y es DERIVADA
# por decision del firmante: mover la gobernanza romperia el vinculo que ata un cambio a su
# evidencia —que viajen en el MISMO commit— y dejaria a SUITE-R34 comparando fechas entre ramas.
_tr2="$SUITE/tools/tracker.mjs"

# La FONTANERIA es lo que sostiene el diseño: no toca el arbol de trabajo. Con worktree o checkout,
# un fallo a mitad dejaria al usuario EN OTRA RAMA mientras trabaja.
chk   "proyecta con fontaneria, sin checkout"  "hash-object" \
  sh -c 'sed -n "/^function proyectar/,/^}/p" "$1"' _ "$_tr2"
chk   "…y con mktree"                          "mktree" \
  sh -c 'sed -n "/^function proyectar/,/^}/p" "$1"' _ "$_tr2"
chk   "…y commit-tree con su padre"            "commit-tree" \
  sh -c 'sed -n "/^function proyectar/,/^}/p" "$1"' _ "$_tr2"
chkno "NO hace checkout ni worktree"           "worktree" \
  sh -c 'sed -n "/^function proyectar/,/^}/p" "$1"' _ "$_tr2"
# Cada fila lleva el SHA de SU rama. Una tarea sin rama lo declara VACIO: un SHA prestado seria
# una afirmacion falsa (RULE-06).
chk   "cada fila lleva el SHA de SU rama"      "shaDe(a.branch)" \
  sh -c 'sed -n "/^export function estadoProyectado/,/^}/p" "$1"' _ "$_tr2"
chk   "…y sin rama NO hereda el de otra"       "a.branch ?" \
  sh -c 'sed -n "/^export function estadoProyectado/,/^}/p" "$1"' _ "$_tr2"
# La marca es lo UNICO que distingue una rama derivada de una que ya no lo es.
chk   "cada commit lleva la marca"             "MARCA_PROYECCION" \
  sh -c 'sed -n "/^function proyectar/,/^}/p" "$1"' _ "$_tr2"
chk   "un commit sin marca se REPORTA"         "escribio a mano" \
  sh -c 'sed -n "/^function proyectar/,/^}/p" "$1"' _ "$_tr2"
chk   "…y no se borra: eso es humano"          "No se borra nada" \
  sh -c 'sed -n "/^function proyectar/,/^}/p" "$1"' _ "$_tr2"
# RULE-06 · sin usuario no se proyecta. «cauce/desconocido» agregaria el trabajo de todos bajo un
# nombre que no es de nadie.
chk   "sin usuario NO se proyecta"             "no se proyecta (RULE-06)" \
  sh -c 'sed -n "/^function proyectar/,/^}/p" "$1"' _ "$_tr2"
# El nombre se normaliza: una referencia de git no admite cualquier cosa.
cat > "$WORK/rama.mjs" <<'MJS'
import { pathToFileURL } from 'node:url';
const { ramaDe } = await import(pathToFileURL(process.env.MTH_TR).href);
console.log(ramaDe('Alberto Martínez') === 'cauce/alberto-martinez' ? 'NORMALIZA' : 'NO ' + ramaDe('Alberto Martínez'));
console.log(ramaDe('') === null && ramaDe(null) === null ? 'SIN_USUARIO_NULL' : 'INVENTA');
MJS
chk   "el nombre se normaliza a una ref valida" "NORMALIZA" \
  env MTH_TR="$SUITE/tools/tracker.mjs" node "$WORK/rama.mjs"
chk   "…y sin nombre devuelve null, no inventa" "SIN_USUARIO_NULL" \
  env MTH_TR="$SUITE/tools/tracker.mjs" node "$WORK/rama.mjs"
# Publicar es una decision, no un efecto colateral.
chk   "sin --publicar se queda LOCAL"          "no un efecto colateral" \
  sh -c 'sed -n "/^function proyectar/,/^}/p" "$1"' _ "$_tr2"
# Y en avanzar va la ULTIMA, y su fallo NO revierte: la nota ya se publico y no se despublica.
chk   "en avanzar la proyeccion va la ULTIMA"  "LA PROYECCION" \
  sh -c 'sed -n "/^function avanzar/,/^}/p" "$1"' _ "$_tr2"
chk   "…y su fallo NO revierte la transicion"  "La transicion SI ocurrio" \
  sh -c 'sed -n "/^function avanzar/,/^}/p" "$1"' _ "$_tr2"

# ─── PT-053 · la transicion de fase es un solo acto ────────────────────────
# 107 transiciones en dos lotes x 5 actos manuales = ~535 operaciones. FDGE-R52 cazo LA MISMA
# transicion tres veces en EP-014, y la tercera con el fallo ANUNCIADO en la propia nota:
# predecir el fallo no lo evita.
#
# El fixture NO declara plataforma, asi que aqui se comprueban las VALIDACIONES —que corren antes
# de tocar nada y antes de necesitar la red—. El camino completo y la atomicidad se ejecutan
# contra el repositorio real y estan en la evidencia: la nota de la transicion 5->6 de esta misma
# tarea la publico `avanzar`, no `gh issue comment`.
AV() { node "$WORK/docs/methodology/tools/tracker.mjs" avanzar "$@" "$WORK"; }
# El fixture se reconstruye aqui. Bloques anteriores mutan la fase de PT-004 —la ponen en 5,
# la ponen en null— y asertar contra un estado que otro caso cambio es asertar sobre el
# ORDEN, no sobre el codigo. Es el mismo error que PT-052 cometio y corrigio, dos tareas
# antes: saberlo no basta, hay que escribirlo en el bloque.
build_fixture

chk   "sin --nota NO avanza"                   "exige --nota"             AV PT-004 --a 5
chk   "…y lo dice como negativa, no aviso"     "el acto que se olvida"    AV PT-004 --a 5
chk   "una --nota vacia tampoco vale"          "exige --nota"             AV PT-004 --a 5 --nota "   "
chk   "saltar una fase NO avanza"              "Solo se avanza a la SIGUIENTE"  AV PT-004 --a 8 --nota "x"
chk   "…y dice por que"                        "apaga las comprobaciones" AV PT-004 --a 8 --nota "x"
chk   "retroceder tampoco"                     "Solo se avanza a la SIGUIENTE"  AV PT-004 --a 2 --nota "x"
chk   "un PT que no existe NO avanza"          "no existe en el registro" AV PT-777 --a 2 --nota "x"
chk   "un PT terminal NO avanza"               "no avanza"                AV PT-002 --a 9 --nota "x"
chk   "…citando que lo cerrado es evidencia"   "SUITE-R36"                AV PT-002 --a 9 --nota "x"
# El fixture no le da issue a PT-004, asi que la validacion que salta es esa — y es la correcta:
# sin issue la nota no tendria donde ir.
#
# PT-084 CAMBIO LA PREMISA de este caso, y por eso se reescribe en vez de hacerlo pasar: sin
# plataforma declarada, NO TENER ISSUE YA NO BLOQUEA — la nota va al ledger. La exigencia del
# issue es del ESPEJO (SUITE-R35), y el espejo solo existe si hay tablero.
#
# Asi que el caso declara plataforma, que es el mundo en el que su afirmacion es cierta. Sin
# eso estaria asertando sobre un mundo que ya no existe — lo que paso dos veces en PT-052.
build_fixture
reg_set "r.tracker = { plataforma: 'github' }"
chk   "con tablero y sin issue, NO avanza"     "no tiene issue"           AV PT-004 --a 5 --nota "x"
chk   "…citando el espejo"                     "SUITE-R35"                AV PT-004 --a 5 --nota "x"
# Y ninguna de las anteriores toco el registro: las validaciones corren ANTES de escribir.
# El patron tolera el espacio: reg_set reescribe el JSON con JSON.stringify y produce
# «"phase": 4», mientras el fixture lo escribe compacto. Lo que el caso afirma es que LA FASE
# SIGUE SIENDO 4, no como esta formateado el archivo — asertar el formato era asertar sobre un
# detalle que ninguna regla exige.
chk   "ninguna validacion toco el registro"    '"phase": *4'   cat "$WORK/docs/implementation/REGISTRY.json"

# La forma del codigo: el orden lo decide la REVERSIBILIDAD y lo irreversible va el ultimo.
_tr="$SUITE/tools/tracker.mjs"
chk   "la nota se publica la ULTIMA"           "irreversible, y por eso la ultima" \
  sh -c 'sed -n "/^function avanzar/,/^}/p" "$1"' _ "$_tr"
chk   "hay respaldo antes de escribir"         "const respaldo = tocados.map" \
  sh -c 'sed -n "/^function avanzar/,/^}/p" "$1"' _ "$_tr"
chk   "y restauracion si algo falla"           "restaurar();" \
  sh -c 'sed -n "/^function avanzar/,/^}/p" "$1"' _ "$_tr"
# Restaurar un archivo que NO EXISTIA lo BORRA. Dejarlo vacio seria un estado que no existia.
chk   "restaurar lo que no existia lo BORRA"   "antes === null" \
  sh -c 'sed -n "/const restaurar/,/^  };/p" "$1"' _ "$_tr"
# El VALOR de una bandera no es una ruta. Tercera vez en el lote: -q, --solo, --a.
chk   "el valor de una bandera no es ROOT"     "CON_VALOR.has" \
  sh -c 'sed -n "/^const ROOT/,/process.cwd/p" "$1"' _ "$_tr"
chk   "…y las banderas con valor van en UN sitio" "CON_VALOR = new Set" cat "$_tr"
# LEX-R21 · el nombre vive en LEXICON.
chk   "avanzar esta en LEXICON"                "avanzar"    cat "$SUITE/LEXICON.md"
# El SELLO del HANDOFF es otro acto, y tambien faltaba: la CI lo dijo en rojo con el comando ya
# integrado en su propia PHASE 9. `avanzar` escribe en changes/ (el YAML), asi que sin tocar
# HANDOFF.md el estado queda MAS VIEJO QUE EL TRABAJO y SUITE-R34 bloquea: el comando violaba POR
# CONSTRUCCION la regla que dice que el estado viaja con el trabajo. Solo se estampa la linea
# «actualizado:», que es derivable; el resto es prosa humana y no se toca.
chk   "el sello del HANDOFF es un acto"       "EL ESTADO" \
  sh -c 'sed -n "/^function avanzar/,/^}/p" "$1"' _ "$_tr"
chk   "…y solo estampa «actualizado:»"        "prosa humana y no" \
  sh -c 'sed -n "/^function avanzar/,/^}/p" "$1"' _ "$_tr"
chk   "…y HANDOFF.md entra en el respaldo"    "HANDOFF.md" \
  sh -c 'sed -n "/const tocados/p" "$1"' _ "$_tr"
# El ESPEJO es el quinto acto, y faltaba: `npm run verify` lo dijo en rojo con avanzar ya
# escrito. Va ANTES de la nota y el orden entre los dos actos irreversibles no es
# indiferente — una etiqueta desincronizada es DERIVADA y se rehace con `abrir --aplicar`;
# una nota que falta no se rehace, y es lo que este comando existe para impedir.
chk   "el espejo es el quinto acto"           "EL ESPEJO" \
  sh -c 'sed -n "/^function avanzar/,/^}/p" "$1"' _ "$_tr"
chk   "…y va ANTES de la nota"                "recuperar va primero" \
  sh -c 'sed -n "/^function avanzar/,/^}/p" "$1"' _ "$_tr"

# ─── PT-052 · el checkpoint es un artefacto, no una nota ───────────────────
# El estado de una tarea en curso existia —HANDOFF, la fase del registro, las notas de reanclaje—
# pero en ningun formato que un programa pudiera leer. Y nada ataba la gobernanza al commit del
# codigo: hoy los ata que viajen en el MISMO commit, y ese vinculo desaparece en cuanto PT-054
# proyecte a otra rama.
#
# LEX-R26 · TODO campo se DERIVA. Un campo que solo pueda rellenar la memoria miente CON LA
# AUTORIDAD DE UN DATO ESTRUCTURADO, que es peor que decirlo en prosa.
CPJ="$WORK/docs/implementation/CHECKPOINT.json"
TR() { node "$WORK/docs/methodology/tools/tracker.mjs" "$@" "$WORK"; }

# El fixture se reconstruye aqui: bloques anteriores mutan la fase de PT-004, y asertar un
# valor concreto sobre un estado que otro caso cambio es una asercion sobre el orden, no
# sobre el codigo. Lo dijo ejecutarlo.
build_fixture
chk   "checkpoint escribe el archivo"          "CHECKPOINT.json escrito"  TR checkpoint PT-004
chk   "…y declara de que PT es"                '"pt": "PT-004"'           cat "$CPJ"
chk   "…con su fase"                           '"phase": 4'               cat "$CPJ"
chk   "…y la siguiente accion, DERIVADA"       '"siguiente"'              cat "$CPJ"
chk   "…y el SHA del codigo"                   '"sha"'                    cat "$CPJ"
# Es UNO: escribirlo sobre otra tarea lo SUSTITUYE. N archivos serian N-1 mintiendo.
TR checkpoint PT-001 >/dev/null 2>&1
chk   "se SOBRESCRIBE: ahora es de PT-001"     '"pt": "PT-001"'           cat "$CPJ"
chkno "…y no quedo el anterior"                '"pt": "PT-004"'           cat "$CPJ"
# RULE-06 · sin allocation no se inventan los campos: se dice.
chk   "un PT que no esta en el registro FALLA" "no existe en el registro" TR checkpoint PT-777
# LEX-R26 · el SHA tiene que ser ALCANZABLE, no tener forma de SHA.
#
# Las mutaciones van GUARDADAS con `[ -f ]`. --solo (PT-050) salta los CASOS pero no el setup que
# hay entre ellos, asi que con un filtro puesto este bloque corria sin que ninguna de las lineas
# anteriores hubiera creado el archivo — y reventaba. Es una consecuencia de --solo que su propia
# tarea no dijo, y aqui queda: el setup entre casos tiene que tolerar que los casos no corran.
cp_set() { [ -f "$CPJ" ] || return 0; MTH_CP="$CPJ" node -e "$1"; }

# El fixture NO es un repositorio git, asi que `sha` sale null — y la herramienta lo DICE en
# vez de inventarse uno. Es RULE-06 funcionando, y comprobarlo aqui vale mas que fingir un
# repo: el caso del sha ALCANZABLE corre sobre el repositorio real y esta en la evidencia.
chk   "sin git, el sha se declara null"        "se genero sin git"        V PT-001
cp_set 'const fs=require("node:fs");const p=process.env.MTH_CP;const c=JSON.parse(fs.readFileSync(p,"utf8"));c.sha="0".repeat(40);fs.writeFileSync(p,JSON.stringify(c,null,2));'
chk   "un sha que NO existe BLOQUEA"           "NO existe en este repositorio"  V PT-001
chk   "…y lo dice como lo que es"              "miente con la autoridad"        V PT-001
cp_set 'const fs=require("node:fs");const p=process.env.MTH_CP;const c=JSON.parse(fs.readFileSync(p,"utf8"));delete c.sha;fs.writeFileSync(p,JSON.stringify(c,null,2));'
chk   "sin el campo sha, tambien"              "no declara: sha"                V PT-001
rm -f "$CPJ"
chkno "no tenerlo NO es un defecto"            "LEX-R26"                        V PT-001
# LEX-R21 · el nombre vive en LEXICON, y ANTES que en el codigo.
chk   "CHECKPOINT.json esta en LEXICON"        "CHECKPOINT.json"   cat "$SUITE/LEXICON.md"
chk   "…con su contrato de campos"             "LEX-R26"           cat "$SUITE/LEXICON.md"
chk   "…y dice que todo se DERIVA"             "no entra en"       cat "$SUITE/LEXICON.md"

# ─── PT-051 · donde vive la comprobacion de una regla ──────────────────────
# `regla` decia el ARCHIVO y callaba la linea. verify-fdge.mjs tiene 1490 lineas: saber que la
# comprobacion esta «en verify-fdge.mjs» deja el mismo trabajo que no saber nada. La informacion
# ya se recorria —el m.index de cada fail()— y se tiraba.
RG2() { node "$SUITE/tools/regla.mjs" "$@"; }

chk   "--donde da archivo Y linea"            "verify-fdge.mjs:"    RG2 SUITE-R34 --donde
chk   "…y dice si bloquea o solo avisa"       "fail"                RG2 SUITE-R34 --donde
chk   "…enumera TODAS las herramientas"       "tracker.mjs:"        RG2 SUITE-R35 --donde
chk   "…y tambien verify-fdge"                "verify-fdge.mjs:"    RG2 SUITE-R35 --donde
chk   "una sin verificador lo DICE"           "ningún verificador"  RG2 SUITE-R22 --donde
chkno "…y no devuelve una lista vacia"        "0 emisión"           RG2 SUITE-R22 --donde
chk   "…y cita TD-08 en vez de recalcularlo"  "TD-08"               RG2 SUITE-R22 --donde
chk   "--donde sin regla es un error"         "necesita una regla"  RG2 --donde

# EL CASO CENTRAL, y el unico que discrimina: DOS emisiones en el mismo archivo tienen que dar
# lineas DISTINTAS. Con una sola, `m.index` e `indexOf` dan lo mismo y el caso pasaria con las dos
# implementaciones — que es como PT-043 se encontro el defecto en las entradas CORRIGE.
cat > "$WORK/lineas.mjs" <<'MJS'
import { pathToFileURL } from 'node:url';
const { fallosPosibles } = await import(pathToFileURL(process.env.MTH_REGLA).href);
const texto = ["linea 1", "fail('ZZ-R99', 'primera');", "linea 3", "linea 4",
               "fail('ZZ-R99', 'segunda');", "// fail('ZZ-R98', 'comentada')"].join("\n");
const e = fallosPosibles([{ archivo: 'x.mjs', texto }]);
const zz = e.find((t) => t.id === 'ZZ-R99');
const lineas = zz.emisiones.map((x) => x.linea);
console.log(lineas.join(',') === '2,5' ? 'LINEAS_DISTINTAS' : 'MISMA_LINEA ' + lineas.join(','));
console.log(e.some((t) => t.id === 'ZZ-R98') ? 'CUENTA_COMENTARIOS' : 'IGNORA_COMENTARIOS');
MJS
chk   "dos emisiones dan lineas DISTINTAS"    "LINEAS_DISTINTAS" \
  env MTH_REGLA="$SUITE/tools/regla.mjs" node "$WORK/lineas.mjs"
chk   "…y una COMENTADA no cuenta"            "IGNORA_COMENTARIOS" \
  env MTH_REGLA="$SUITE/tools/regla.mjs" node "$WORK/lineas.mjs"
# La forma publica se DERIVA: lo que existia antes de PT-051 sigue significando lo mismo.
chk   "herramientas se deriva de emisiones"   "herramientas: \[...new Set" \
  sh -c 'sed -n "/^export function fallosPosibles/,/^}/p" "$1"' _ "$SUITE/tools/regla.mjs"
chk   "…y la linea sale de m.index"           "lineaDe(texto, m.index)" \
  sh -c 'sed -n "/^export function fallosPosibles/,/^}/p" "$1"' _ "$SUITE/tools/regla.mjs"
chkno "…nunca de indexOf"                     "indexOf(m\[0\])" \
  sh -c 'sed -n "/^export function fallosPosibles/,/^}/p" "$1"' _ "$SUITE/tools/regla.mjs"

# ─── PT-050 · reejecutar solo el bloque en el que se trabaja ───────────────
# Medido antes de escribir nada: la bateria son 205 s y 181 reconstrucciones del fixture. El
# `discovery` afirmo que chk y chkno eran «las dos unicas puertas» — y EJECUTARLO lo desmintio:
# 82 casos entran por trlib/trlibno y uno estaba escrito a mano con su propio if/pass/bad.
# CUATRO puertas, no dos. Estos casos existen para que la quinta no se abra sin darse cuenta.
_st2="$SUITE/tools/selftest.sh"
chk   "el filtro esta en chk"                 'salta "$name" && return'  sh -c 'sed -n "/^chk() {/,/^}/p" "$1"' _ "$_st2"
chk   "…y en chkno"                           'salta "$name" && return'  sh -c 'sed -n "/^chkno() {/,/^}/p" "$1"' _ "$_st2"
chk   "…y en trlib, la tercera puerta"        'salta "$1" && return'     sh -c 'sed -n "/^trlib() {/,/^}/p" "$1"' _ "$_st2"
chk   "…y en trlibno, la cuarta"              'salta "$1" && return'     sh -c 'sed -n "/^trlibno() {/,/^}/p" "$1"' _ "$_st2"
# El filtro va ANTES de ejecutar el comando del caso: de ahi sale el ahorro. Si fuera despues,
# se ejecutaria igual y solo se callaria la linea — que es lo que ya hace -q.
chk   "el filtro va antes de ejecutar"        'salta "$name" && return'  sh -c 'sed -n "/^chk() {/,/local out/p" "$1"' _ "$_st2"
# El universo sube fuera de la guarda: el DENOMINADOR no puede depender del filtro.
chk   "el universo sube fuera de la guarda"   'UNIVERSO + 1'             sh -c 'sed -n "/^salta() {/,/SOLO\" \]/p" "$1"' _ "$_st2"
chk   "…y casa LITERAL, sin regex"            'case "$1" in \*"$SOLO"\*' sh -c 'sed -n "/^salta() {/,/^}/p" "$1"' _ "$_st2"
chkno "…sin lanzar un proceso por caso"       'grep -qF'                 sh -c 'sed -n "/^salta() {/,/^}/p" "$1"' _ "$_st2"
# Un patron que no casa nada es ROJO. Un verde por vacio es lo que PT-023 encontro ejecutando.
# Por POSICION, no por texto: `sed -n "/NINGUN CASO CASA/,/^fi/p"` arrancaba en ESTA MISMA LINEA
# —que contiene ese texto al definirse— y se tragaba medio archivo hasta el siguiente «fi»,
# incluida una palabra que dispara revento(). Es la MISMA familia que PT-049 documento, y van
# dos veces en esta tarea: la lectura no la ve nunca.
# PT-086 · la ventana pasa de 14 a 40 lineas: el bloque que avisa de PARCIAL empujo el objetivo
# fuera. Extraer por POSICION es fragil en las dos direcciones, y aqui toco esta.
chk   "sin coincidencias, es rojo"            'exit 1'                   sh -c 'tail -40 "$1"' _ "$_st2"
chk   "…y lo dice con el patron"              'NINGUN CASO CASA'         sh -c 'tail -40 "$1"' _ "$_st2"
# --solo sin valor: un patron vacio casaria con todo y la bandera mentiria.
# Se extrae por «>&2» y no por el texto del mensaje: buscar «necesita un patron» habria casado
# TAMBIEN esta misma linea, y el caso habria pasado aunque el mensaje real desapareciera. Es la
# quinta vez en la sesion que aparece la asercion que casa su propia definicion.
chk   "--solo sin valor es un error"          'necesita un patron'       sh -c 'sed -n "/>&2/p" "$1"' _ "$_st2"
chk   "…y el valor se consume ANTES del case" '_espera_solo" \]; then SOLO' sh -c 'sed -n "/^for _a in/,/^done/p" "$1"' _ "$_st2"
# Las dos cifras solo aparecen cuando hay algo que distinguir.
chk   "con --solo la salida lleva dos cifras" 'TOTAL de $UNIVERSO'       sh -c 'tail -40 "$1"' _ "$_st2"
chkno "…y sin --solo, una sola"               'de $UNIVERSO casos'       sh -c 'tail -3 "$1"' _ "$_st2"

# ─── PT-049 · el verde se CUENTA, no se enumera ────────────────────────────
# Medido antes de escribir nada: selftest imprime 541 lineas y verify-fdge 507, y en un arbol
# sano el 96 % y el 89 % son el bloque verde. La bateria se ejecuto >15 veces en una sola sesion.
#
# `-q` calla la ENUMERACION del verde. NO calla el recuento —un «sin errores» sin denominador es
# lo que PT-002 corrigio—, NO calla los fallos, y NO toca el codigo de salida: imprime, no decide.

# --- verify-fdge · comportamiento REAL, sobre el fixture ---
chkno "-q no imprime el bloque PASA"          "PASA"                V --all -q
chk   "…y los AVISOS siguen saliendo"         "AVISOS"              V --all -q
chk   "…y el recuento NO se calla"            "PTs verificados"     V PT-001 -q
chk   "sin -q el bloque PASA sigue estando"   "PASA"                V --all
# Con un error, -q no esconde nada: el bloque ERRORES sale igual.
chk   "-q no esconde el bloque ERRORES"       "ERRORES"             V --gate G4 PT-004 -q
chk   "…y dice cuantos son"                   "error(es)"           V --gate G4 PT-004 -q

# --- selftest · la FORMA de su propio codigo ---
# Aqui se comprueba la forma y no el comportamiento, y se dice por que: ejecutar la bateria
# DENTRO de la bateria triplicaria su coste —cada vuelta son 2-4 minutos— para comprobar seis
# casos. Es un limite declarado, no un hueco: `bash tools/selftest.sh -q` se ejecuta a mano y su
# salida se captura en la evidencia de PT-049.
_st="$SUITE/tools/selftest.sh"
chk   "pass() lleva la guarda de -q"          'QUIET" ] || printf'   sh -c 'sed -n "/^pass()/p" "$1"' _ "$_st"
chkno "bad() NO lleva guarda: un fallo se ve" 'QUIET" ] || printf'   sh -c 'sed -n "/^bad()/,/^}/p" "$1"' _ "$_st"
# El patron NO puede llevar «[»: `chk` usa grep BRE y un corchete sin cerrar es un error de
# sintaxis, no un «no casa». Y NO se puede hacer `cat` del archivo entero: contiene la palabra
# «SyntaxError» dentro de revento(), asi que el propio arnes lo daria por reventado. Las dos
# cosas las dijo ejecutarlo — cuatro casos en rojo que no eran del cambio, sino de como los
# escribi.
chk   "TOTAL sube antes que la guarda"        'pass() { TOTAL='     sh -c 'sed -n "/^pass()/p" "$1"' _ "$_st"
# El recuento se busca por POSICION —las ultimas lineas— y no por su texto. Buscarlo con
# `sed -n "/selftest: OK/p"` casaba tambien ESTAS DOS LINEAS, que contienen ese texto al
# definirse, y una de ellas dice «QUIET»: el caso se cazaba a si mismo. Es la cuarta vez en la
# sesion que aparece esta familia —la asercion que casa su propia definicion— y aqui queda por
# escrito, porque el patron se repite y la lectura no lo ve.
chk   "el recuento final existe"              'selftest: OK'        sh -c 'tail -4 "$1"' _ "$_st"
chkno "…y no mira QUIET"                      'QUIET'               sh -c 'tail -4 "$1"' _ "$_st"
chk   "-q se FILTRA de los posicionales"      'quiet) QUIET=1'      sh -c 'sed -n "/quiet) QUIET/p" "$1"' _ "$_st"
chk   "…y WORK sale del posicional filtrado"  'POS:-'               sh -c 'sed -n "/^WORK=/p" "$1"' _ "$_st"
chkno "…no del primer argumento crudo"        '{1:-'                sh -c 'sed -n "/^WORK=/p" "$1"' _ "$_st"
# La cabecera de seccion en -q no se pierde: se recuerda y sale delante del primer fallo.
chk   "la cabecera se recuerda para el fallo" 'SEC_VISTA=1'         sh -c 'sed -n "/^bad()/,/^}/p" "$1"' _ "$_st"
# PT-086 · sec() paso de UNA linea a una funcion de varias, asi que se extrae entera por sus
# delimitadores. «sed -n /^sec()/p» devolvia solo la primera linea y la asercion vive en la
# ultima — la misma fragilidad que las tres de arriba, en su otra forma.
# La ventana se toma con grep -A y no con un rango de sed: el rango no encontraba su cierre
# —CRLF— y devolvia una sola linea. Es la misma fragilidad de extraer por posicion, en su
# tercera forma dentro de esta tarea.
# Y la asercion casa con lo que la linea DICE hoy: PT-086 le anadio la guarda de seccion, asi
# que ya no es «|| echo» sino «|| [ -z "$SEC_ACTIVA" ] || echo». La intencion no cambia —sin -q
# el titulo se imprime al llegar— y el texto si.
chk   "…y sin -q se imprime al llegar"        'QUIET" \] ||'  sh -c 'grep -A16 "^sec() {" "$1"' _ "$_st"

# ─── PT-029 · las compuertas anteriores a G4 se pueden evaluar ─────────────
# Tres comprobaciones decian `if (gate)` sin decir de QUE compuerta hablaban, y con eso G1, G2 y
# G3 heredaban las exigencias de G4: pedian en PHASE 1 lo que el procedimiento escribe en PHASE 8.
# Las tres compuertas anteriores a G4 no se podian evaluar con la herramienta que existe para
# evaluarlas, y llevaban asi desde que existe el parametro. Nadie tropezo porque la ruta esta
# indocumentada: solo se enseña --gate G4.
#
# El fixture: PT-004 esta en PHASE 4 (IN_PROGRESS), sin manifest ni self-review ni HISTORY.
GT() { node "$WORK/docs/methodology/tools/verify-fdge.mjs" --gate "$1" PT-004; }

chkno "G1 no exige el manifiesto de PHASE 6"   "falta evidence/PT-004/manifest.json"  GT G1
chkno "G1 tampoco el self-review"              "falta evidence/PT-004/self-review.md" GT G1
chkno "G1 tampoco la entrada de HISTORY"       "PT-004: sin entrada en HISTORY.log"   GT G1
chkno "G2 sigue sin exigir lo de PHASE 6"      "falta evidence/PT-004/manifest.json"  GT G2
chkno "G3 no exige lo que PHASE 8 escribe"     "PT-004: sin entrada en HISTORY.log"   GT G3
# La direccion contraria, que es la que hay que proteger: G4 es la ultima y NO relaja nada.
chk   "G3 SI exige el manifiesto"              "falta evidence/PT-004/manifest.json"  GT G3
chk   "G4 exige el manifiesto"                 "falta evidence/PT-004/manifest.json"  GT G4
chk   "G4 exige el self-review"                "falta evidence/PT-004/self-review.md" GT G4
chk   "G4 exige la entrada de HISTORY"         "PT-004: sin entrada en HISTORY.log"   GT G4
# Sin compuerta no se exige nada: verify-fdge informa, no bloquea.
chkno "sin compuerta, HISTORY solo se avisa"   "PT-004: sin entrada en HISTORY.log"   V PT-004

# El hecho vive en UN sitio y su fase viaja al lado, para que la asignacion sea DERIVABLE en vez
# de creible: la compuerta de un artefacto tiene que ser la primera POSTERIOR a su fase. Si
# alguien pone manifest.json en G1 «porque si», este caso cae aunque la tabla sea coherente.
cat > "$WORK/exigible.mjs" <<'MJS'
// El especificador de un `import` estatico no puede ser una expresion: la primera version lo
// escribio asi, reviento, y `revento()` lo caza — el arnes se caza a si mismo.
import { pathToFileURL } from 'node:url';
const { EXIGIBLE_DESDE, ORDEN_COMPUERTAS, exigibleEn } = await import(pathToFileURL(process.env.MTH_PATRONES).href);
// PHASES: G1 cierra PHASE 1 · G2 cierra PHASE 4 · G3 cierra PHASE 7 · G4 cierra PHASE 9
const CIERRA = { G1: 1, G2: 4, G3: 7, G4: 9 };
const malas = [];
for (const [art, e] of Object.entries(EXIGIBLE_DESDE)) {
  const primera = ORDEN_COMPUERTAS.find((g) => CIERRA[g] > e.fase);
  if (primera !== e.desde) malas.push(`${art}: fase ${e.fase} => ${primera}, declara ${e.desde}`);
}
if (!exigibleEn(undefined, 'HISTORY.log')) {} else malas.push('sin compuerta se exige algo');
if (!exigibleEn('G4', 'HISTORY.log')) malas.push('G4 no exige HISTORY.log');
if (!exigibleEn('G4', 'inventado.txt')) malas.push('un artefacto sin entrada deberia exigirse siempre');
console.log(malas.length ? `INCOHERENTE ${malas.join(' | ')}` : 'DERIVADA');
MJS
# La ruta se pasa TAL CUAL y la convierte a URL el propio node (`pathToFileURL`). El primer
# intento la traducia con `sed` desde bash y en Git-Bash quedaba «file:///», que no es absoluta:
# traducir rutas a mano entre dos mundos es de las cosas que solo se ven ejecutando. Lo cazo
# `revento()`, que existe justo para que una herramienta rota no pase por verde.
chk   "EXIGIBLE_DESDE se DERIVA de la fase"    "DERIVADA" \
  env MTH_PATRONES="$WORK/docs/methodology/tools/patrones.mjs" node "$WORK/exigible.mjs"

# EL ENTREGABLE: cazar la FORMA, no los tres casos. Una comprobacion que se active con CUALQUIER
# compuerta vuelve a hacer inevaluables las tres anteriores. Hoy hay cero; la cuarta que se
# escriba pone esto en rojo el dia que se escriba.
chkno "ninguna comprobacion se activa con cualquier compuerta" "if (gate) fail(" \
  cat "$RAIZ/docs/methodology/tools/verify-fdge.mjs"
# Y el caso de arriba no puede pasar por vacio: si el archivo no se lee, chkno pasaria solo.
chk   "…y el archivo se leyo de verdad"        "gate === 'G4'" \
  cat "$RAIZ/docs/methodology/tools/verify-fdge.mjs"

# ─── PT-023 · el texto copiable dice lo que la regla dice ──────────────────
# PT-018 declaro tres cambios de documento y ejecuto uno. El que quedo sin hacer era el de
# FDGE-Prompts.md: el parrafo de SUITE-R44 seguia diciendo «cita el identificador que lo sostiene
# — NORMALMENTE una allocation en DEFERRED», que es la prosa que SUITE-R44 existe para eliminar,
# dentro del documento que SUITE-R20 manda que sea copiable TAL CUAL.
#
# Estos casos NO comprueban que una declaracion de spec-changes.md se haya cumplido: eso no es
# mecanizable y discovery.md lo mide —110 filas, 4 candidatos, 3 falsos positivos—. Comprueban el
# contenido de UN documento, que es lo unico que se puede afirmar sin mentir.
P="$RAIZ/docs/methodology/FDGE-Prompts.md"
# El parrafo de SUITE-R44, acotado: desde su titular hasta el titular siguiente. Sin acotar, un
# «normalmente» de cualquier otra parte del documento daria un rojo que no es este defecto.
sr44() { sed -n '/`SUITE-R44`: lo que el lote aplaza/,/^\*\*`SUITE-R4[35]`/p' "$P"; }

chk   "el texto copiable dice vocabulario cerrado" "vocabulario cerrado" sr44
chk   "…y que la cita es reciproca"                "recíproca"           sr44
chk   "…y nombra «—» como valor admitido"          "no aplaza nada"      sr44
chk   "…y distingue el propio lote en DONE"        "DONE o CLOSED"       sr44
chkno "y ya no dice «normalmente»"                 "normalmente"         sr44
# La comprobacion inversa vive en el caso: si sr44() no acotara nada, chkno pasaria por vacio y
# los cuatro chk caerian. Aqui se exige que el bloque EXISTA, para que el silencio no sea verde.
chk   "el bloque de SUITE-R44 existe y no esta vacio" "SUITE-R44"        sr44

chk   "el alcance del grafo cubre bin"       "SCOPE bin"              G
chk   "…y las herramientas"                  "CUBRE_CODIGO_PROPIO"    G
chk   "sin desbordar a la raiz ni a changes" "ALCANCE_ACOTADO"        G
chk   "pt_at_generation no es 0"             "ANCLADO"                G
# La comprobacion inversa: el mismo lector sobre el alcance de ayer tiene que decir que NO.
cat > "$WORK/graph-viejo.json" <<'J'
{ "graph":{"generated":"2026-08-13","scope":"bin","pt_at_generation":0}, "allocations":[{"id":"PT-001"}] }
J
chk   "el alcance viejo se declara incompleto" "ALCANCE_INCOMPLETO" \
  sh -c 'RAIZ_FAKE=$(dirname "$1"); node -e "
  const r = JSON.parse(require(\"node:fs\").readFileSync(process.argv[1], \"utf8\"));
  const dirs = String(r.graph.scope).split(\",\").map((s) => s.trim()).filter(Boolean);
  console.log(dirs.includes(\"bin\") && dirs.includes(\"docs/methodology/tools\") ? \"CUBRE_CODIGO_PROPIO\" : \"ALCANCE_INCOMPLETO\");
  console.log(Number(r.graph.pt_at_generation) > 0 ? \"ANCLADO\" : \"SIN_ANCLAR\");
" "$1"' _ "$WORK/graph-viejo.json"
chk   "y su ancla se declara sin poner"        "SIN_ANCLAR" \
  sh -c 'node -e "
  const r = JSON.parse(require(\"node:fs\").readFileSync(process.argv[1], \"utf8\"));
  console.log(Number(r.graph.pt_at_generation) > 0 ? \"ANCLADO\" : \"SIN_ANCLAR\");
" "$1"' _ "$WORK/graph-viejo.json"

sec "── PT-088 · las reglas del dominio se verifican o se declaran ──"
#
# H-002 de PTSA-2026-08-20. SUITE-R09 (el ledger es append-only), EXEC-R04 (G4 es humana) y
# SUITE-R01 (Evidence Before Action) no las emitia NINGUN verificador. Dos se escriben; la
# tercera se DECLARA, y el orden es la mitad del argumento.
#
# Las dos escritas RIGEN DESDE 11.0.0: medido en el repositorio real hay 18 merges a main y
# UNO desde el ultimo tag. Sin ventana, EXEC-R04 nace con 17 fallos sobre trabajo de agosto,
# y una comprobacion que nace roja se apaga (PT-023).

# ── el ledger no pierde lineas ──────────────────────────────────────────────
ledger_fixture() {   # git con un tag, un ledger de varias lineas y la suite en 11.0.0
  build_fixture
  reg_set "r.suite_version='11.0.0'"
  ( cd "$WORK"
    printf 'uno\ndos\ntres\ncuatro\ncinco\nseis\n' > docs/implementation/HISTORY.log
    git init -q . 2>/dev/null
    git config user.email t@t; git config user.name T
    git add -A >/dev/null 2>&1
    git commit -qm "base" >/dev/null 2>&1
    git tag -a v1.0.0 -m base >/dev/null 2>&1 ) >/dev/null 2>&1
}

ledger_commit() {    # commitea lo que haya, para que «git diff tag HEAD» lo vea
  ( cd "$WORK"; git add -A >/dev/null 2>&1; git commit -qm "cambio" >/dev/null 2>&1 ) >/dev/null 2>&1
}

ledger_fixture
printf 'uno\ndos\ntres\ncuatro\ncinco\nseis\nsiete\n' > "$WORK/docs/implementation/HISTORY.log"
ledger_commit
chkno "un ledger que solo CRECE pasa"            "desaparecida" V PT-004 "$WORK"

ledger_fixture
printf 'uno\ndos\nseis\n' > "$WORK/docs/implementation/HISTORY.log"
ledger_commit
chk   "…y uno al que le faltan lineas CAE"       "línea(s) desaparecida(s)" V PT-004 "$WORK"

# El mensaje tiene que DECIR lo que la comprobacion no establece. Sin esto, un verde de
# SUITE-R09 se leeria como «el ledger es integro», que es mas de lo que mide.
ledger_fixture
printf 'uno\ndos\nseis\n' > "$WORK/docs/implementation/HISTORY.log"
ledger_commit
chk   "…y el mensaje declara que NO distingue"   "corrección legítima de una falsificación" V PT-004 "$WORK"

# Una alteracion de IGUAL recuento TAMBIEN cae, y lo descubrio el arnes: yo habia
# declarado que pasaba. git representa una modificacion como borrado mas alta, asi que
# la linea «-» esta ahi. La comprobacion es MAS FUERTE de lo que su autor creia — y
# declarar un limite SIN MEDIRLO es la misma forma que PT-087 cierra.
ledger_fixture
printf 'uno\nDOS-ALTERADO\ntres\ncuatro\ncinco\nseis\n' > "$WORK/docs/implementation/HISTORY.log"
ledger_commit
chk   "…y una alteracion de igual recuento TAMBIEN" "desaparecida" V PT-004 "$WORK"

# Sin tag no hay reloj y NO SE INVENTA UNO: se dice SIN EVALUAR en vez de dar por bueno.
build_fixture
reg_set "r.suite_version='11.0.0'"
( cd "$WORK"; git init -q . 2>/dev/null; git config user.email t@t; git config user.name T
  git add -A >/dev/null 2>&1; git commit -qm base >/dev/null 2>&1 ) >/dev/null 2>&1
chk   "sin ningun tag no se comprueba, y se dice" "no hay línea base" V PT-004 "$WORK"

# RIGE_DESDE: una version anterior no la sufre. Es lo que PT-081 dejo puesto y lo que hace
# aplicable a EXEC-R04; sin ello estas dos reglas gobernarian trabajo de agosto.
ledger_fixture
reg_set "r.suite_version='10.0.0'"
printf 'uno\n' > "$WORK/docs/implementation/HISTORY.log"
ledger_commit
chkno "una suite anterior a 11.0.0 no la sufre"  "SUITE-R09" V PT-004 "$WORK"

# ── la G4 deja constancia con nombre ────────────────────────────────────────
merge_fixture() {    # una rama por defecto con UN merge, y el ledger de sesion vacio
  build_fixture
  reg_set "r.suite_version='11.0.0'"
  # build_fixture NO crea CLAUDE.md, y sin «firmantes:» la comprobacion no se hace: se dice
  # SIN EVALUAR. Sin esta linea los tres casos de EXEC-R04 pasarian POR VACIO — que es el
  # falso verde que PT-023 midio y el que este arnes existe para impedir.
  printf 'firmantes:
  - Ada Lovelace
' > "$WORK/CLAUDE.md"
  ( cd "$WORK"
    git init -q -b main . 2>/dev/null
    git config user.email t@t; git config user.name T
    git add -A >/dev/null 2>&1; git commit -qm base >/dev/null 2>&1
    git tag -a v1.0.0 -m base >/dev/null 2>&1
    git checkout -q -b rama 2>/dev/null
    printf 'x\n' > otro.txt; git add -A >/dev/null 2>&1; git commit -qm trabajo >/dev/null 2>&1
    git checkout -q main 2>/dev/null
    git merge -q --no-ff rama -m "Merge pull request #1 from t/rama" >/dev/null 2>&1
    git update-ref refs/remotes/origin/main HEAD
    git symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/main ) >/dev/null 2>&1
}

merge_fixture
chk   "un merge a la principal SIN constancia CAE" "sin constancia de autorización" V PT-004 "$WORK"

# El mensaje declara lo que NO prueba: que la autorizacion fuera real. Es H-009, y PT-093
# existe para declararlo. Sin esta linea, el verde diria mas de lo que mide.
merge_fixture
chk   "…y el mensaje dice que NO prueba nada mas"  "NO prueba que la autorización" V PT-004 "$WORK"

merge_fixture
_HOY="$(cd "$WORK" && git log -1 --format=%cs)"
printf '## %s · G4 autorizado\n\nautorizado por Ada Lovelace\n' "$_HOY" >> "$WORK/docs/implementation/SESSION_LOG.md"
chkno "…y CON constancia del mismo dia, pasa"      "sin constancia de autorización" V PT-004 "$WORK"

# Una constancia con un nombre que NO esta en firmantes no cuenta. Sin esto, escribir
# cualquier nombre bastaria y la comprobacion seria decorativa (SUITE-R27).
merge_fixture
_HOY="$(cd "$WORK" && git log -1 --format=%cs)"
printf '## %s · G4 autorizado\n\nautorizado por Impostor Anonimo\n' "$_HOY" >> "$WORK/docs/implementation/SESSION_LOG.md"
chk   "…y un nombre fuera de firmantes NO cuenta"  "sin constancia de autorización" V PT-004 "$WORK"

# ── SUITE-R01 se DECLARA, y la declaracion se comprueba ─────────────────────
chk   "SUITE-R01 esta declarada NO_VERIFICABLE"    "SUITE-R01" \
  grep "SUITE-R01" "$RAIZ/docs/implementation/NO-VERIFICABLES.md"

chk   "…y audit la clasifica, no la deja PENDIENTE" "NO_VERIFICABLE   6" \
  sh -c 'node "$1/docs/methodology/tools/audit.mjs" "$1/docs/methodology" 2>&1 | grep NO_VERIFICABLE' _ "$RAIZ"

# La primera version aserto «PENDIENTE 122», una cifra que CRECE con cada regla nueva: fallo
# dos tareas despues, al entrar EXEC-R04a. El «no hacer» del HANDOFF ya lo advertia y lo hice
# igual. Se aserta el HECHO —que las tres NO siguen en PENDIENTE— y no el total.
chk   "…y las tres salen de PENDIENTE"             "NINGUNA_PENDIENTE" \
  sh -c 'cd "$1" && node docs/methodology/tools/audit.mjs docs/methodology --sin-verificar 2>&1 | tail -3 | grep -qE "SUITE-R09|EXEC-R04 |SUITE-R01" && echo SIGUEN_PENDIENTES || echo NINGUNA_PENDIENTE' _ "$RAIZ"

sec "── PT-087 · la comprobacion declara que hecho establece ──"
#
# H-003 de PTSA-2026-08-20. SIETE instancias del mismo patron: el observable es mas barato que
# el sujeto y el hueco entre los dos no estaba escrito en ningun sitio. Las dos ultimas se
# encontraron DENTRO de este lote — la sexta escribiendo un intake y la septima cazada por
# esta misma bateria contra el trabajo de PT-088.

# ── el registro de sujetos ──────────────────────────────────────────────────
# El modulo se pasa por ENTORNO y como ruta RELATIVA: «file://» exige ruta absoluta y en
# Windows la del arnes no lo es, asi que import() reventaba en los diez casos. Lo escondia
# que el arnes solo dice «la herramienta revento» — y esa es, otra vez, la diferencia entre
# el sujeto y el observable.
# Dice si una regla tiene fila en RIGE_DESDE. Se escribe aparte porque PAT() serializa el
# RESULTADO de una funcion, y aqui lo que se mira es una TABLA.
# PT-090 · cuatro variantes de PAT para derivaDelGrafo, que recibe una FUNCION de huella:
# PAT_H fija el hash devuelto · PAT_M fija el mtime · PAT_N devuelve null · PAT_R normaliza ruta.
PAT_H() {
  MTH_MOD="$SUITE/tools/patrones.mjs" MTH_FN="$1" MTH_H="$2" MTH_ARGS="$3" node -e "
import(require('url').pathToFileURL(process.env.MTH_MOD).href).then(m => {
  const a = JSON.parse(process.env.MTH_ARGS);
  const r = m[process.env.MTH_FN](a[0], () => process.env.MTH_H);
  console.log(Array.isArray(r) && !r.length ? 'VACIO' : JSON.stringify(r));
});"
}
PAT_M() {
  MTH_MOD="$SUITE/tools/patrones.mjs" MTH_FN="$1" MTH_H="$2" MTH_ARGS="$3" node -e "
import(require('url').pathToFileURL(process.env.MTH_MOD).href).then(m => {
  const a = JSON.parse(process.env.MTH_ARGS);
  const r = m[process.env.MTH_FN](a[0], (_, usaMtime) => (usaMtime ? Number(process.env.MTH_H) : 'X'));
  console.log(Array.isArray(r) && !r.length ? 'VACIO' : JSON.stringify(r));
});"
}
PAT_N() {
  MTH_MOD="$SUITE/tools/patrones.mjs" MTH_FN="$1" MTH_ARGS="$2" node -e "
import(require('url').pathToFileURL(process.env.MTH_MOD).href).then(m => {
  const a = JSON.parse(process.env.MTH_ARGS);
  console.log(JSON.stringify(m[process.env.MTH_FN](a[0], () => null)));
});"
}
PAT_R() {
  MTH_MOD="$SUITE/tools/patrones.mjs" MTH_P="$1" MTH_B="$2" node -e "
import(require('url').pathToFileURL(process.env.MTH_MOD).href).then(m => {
  console.log(m.rutaRelativaDelManifiesto(process.env.MTH_P, process.env.MTH_B));
});"
}

# PT-091 · tres variantes mas: PAT_C fija el recuento real, PAT_N2 lo hace null, PAT_T pasa
# un TEXTO en vez de JSON —las filas de una tabla llevan comillas invertidas y pipes—.
PAT_C() {
  MTH_MOD="$SUITE/tools/patrones.mjs" MTH_FN="$1" MTH_R="$2" MTH_ARGS="$3" node -e "
import(require('url').pathToFileURL(process.env.MTH_MOD).href).then(m => {
  const a = JSON.parse(process.env.MTH_ARGS);
  const r = m[process.env.MTH_FN](a[0], () => Number(process.env.MTH_R));
  console.log(Array.isArray(r) && !r.length ? 'VACIO' : JSON.stringify(r));
});"
}
PAT_N2() {
  MTH_MOD="$SUITE/tools/patrones.mjs" MTH_FN="$1" MTH_ARGS="$2" node -e "
import(require('url').pathToFileURL(process.env.MTH_MOD).href).then(m => {
  const a = JSON.parse(process.env.MTH_ARGS);
  console.log(JSON.stringify(m[process.env.MTH_FN](a[0], () => null)));
});"
}
PAT_T() {
  MTH_MOD="$SUITE/tools/patrones.mjs" MTH_FN="$1" MTH_TXT="$2" node -e "
import(require('url').pathToFileURL(process.env.MTH_MOD).href).then(m => {
  const r = m[process.env.MTH_FN](process.env.MTH_TXT);
  console.log(Array.isArray(r) && !r.length ? 'VACIO' : JSON.stringify(r));
});"
}

PAT_KEY() {
  MTH_MOD="$SUITE/tools/patrones.mjs" MTH_ID="$1" node -e "
import(require('url').pathToFileURL(process.env.MTH_MOD).href).then(m => {
  console.log(m.RIGE_DESDE[process.env.MTH_ID] ? 'TIENE_FILA' : 'SIN_FILA');
});"
}

PAT() {
  MTH_MOD="$SUITE/tools/patrones.mjs" MTH_FN="$1" MTH_ARGS="$2" node -e "
import(require('url').pathToFileURL(process.env.MTH_MOD).href).then(m => {
  const a = JSON.parse(process.env.MTH_ARGS);
  const r = m[process.env.MTH_FN](...a);
  // «[]» es una clase de caracteres para grep y ninguna asercion podia casarlo.
  console.log(Array.isArray(r) && !r.length ? 'VACIO' : JSON.stringify(r));
});"
}

chk   "una celda vacia del sujeto no pasa"       '["X"]' \
  PAT sujetosIncompletos '[{"X":{"establece":"","noEstablece":"a"}}]'
chk   "…y falta noEstablece tampoco"             '["X"]' \
  PAT sujetosIncompletos '[{"X":{"establece":"a"}}]'
# «null» NO es vacio: declara explicitamente que no hay limite que expresar. Es la distincion
# de PT-058 —null no es cero— aplicada a una declaracion en vez de a una cifra.
chk   "…y «null» SI vale: es una declaracion"    "VACIO" \
  PAT sujetosIncompletos '[{"X":{"establece":"a","noEstablece":null}}]'

# La mitad que hace trabajo: un limite que vive solo en un comentario protege a quien ya esta
# leyendo el codigo, o sea a quien no lo necesita.
chk   "un limite que no llega al mensaje CAE"    '["X"]' \
  PAT limitesQueNoLleganAlMensaje '[{"X":{"establece":"a","noEstablece":"zzz"}},{"t":"hola"}]'
chk   "…y uno que si llega, pasa"                "VACIO" \
  PAT limitesQueNoLleganAlMensaje '[{"X":{"establece":"a","noEstablece":"zzz"}},{"t":"dice zzz"}]'


# ── PT-095 · una regla nueva no juzga lo escrito antes de que existiera ──────
#
# `G4` de PT-094 se ejecuto y `main` siguio ROJO: seis EXEC-R04a sobre entradas del 13 y el 20 de
# agosto, juzgadas por una regla que entro con la 11.0.0 —etiquetada el 2026-08-20—. En un ledger
# append-only, donde SUITE-R09 PROHIBE corregirlas. Una regla que no se puede cumplir esta rota.
#
# Los casos usan PAT(), que pasa los argumentos por ENTORNO como JSON. Los escribi tres veces con
# comillas anidadas y las tres reventaron el shell; el ayudante lleva ahi desde PT-058.
sec "── PT-095 · una regla nueva no juzga lo escrito antes ──"

# AC-03/AC-04 · «a la espera de G4» anuncia lo CONTRARIO de una autorizacion. El detector positivo
# se deja como estaba —afinarlo dejaria fuera constancias que hoy valen— y se EXCLUYE la espera,
# que es vocabulario corto y cerrado.
chk   "«a la espera de G4» NO es autorizacion"  "^false$"  PAT anunciaAutorizacion '["EP-001 cerrado · version 5.3.0 · a la espera de G4"]'
chk   "…y «autorizados al agente» SI lo es"     "^true$"   PAT anunciaAutorizacion '["G4 de PT-094 y cierre del BUG, autorizados al agente"]'
chk   "…y un VoBo tambien"                      "^true$"   PAT anunciaAutorizacion '["VoBo para cerrar pendientes y ejecutar EP-018"]'
chk   "…y un encabezado sin nada de eso, no"    "^false$"  PAT anunciaAutorizacion '["sesion cerrada"]'

# AC-01/AC-02 · la frontera. Lo escrito ANTES del sello no lo alcanza; lo de DESPUES si. Sin las
# dos mitades, «arreglado» seria «ya no comprueba nada».
chk   "lo anterior al sello NO lo alcanza"      "^false$"  PAT alcanzadaPor '["2026-08-13","2026-08-20"]'
chk   "…lo POSTERIOR si"                        "^true$"   PAT alcanzadaPor '["2026-08-21","2026-08-20"]'
# AC-05 · el limite declarado: el MISMO dia del sello escapa, y se prefiere ese error al contrario
# —juzgar hacia atras—, que es el que dejaba main rojo sin arreglo posible.
chk   "…y el MISMO dia del sello escapa"        "^false$"  PAT alcanzadaPor '["2026-08-20","2026-08-20"]'
# RULE-06 · sin frontera no se juzga nada: no poder situar el limite no es no tenerlo.
chk   "sin frontera no alcanza a nada"          "^false$"  PAT alcanzadaPor '["2026-08-21",null]'
chk   "…ni con una fecha que no lo es"          "^false$"  PAT alcanzadaPor '["ayer","2026-08-20"]'

# AC-06 · en un ledger append-only lo malformado se corrige ANADIENDO. Sin esto la unica salida
# seria editar SESSION_LOG.md, que SUITE-R09 prohibe: dos reglas haciendose imposibles entre si.
# HISTORY.log ya lo resuelve asi desde PT-046, y FDGE-R29 prefiere la correccion.
chk   "una entrada CORRIGE del dia excusa"      "^true$"   PAT corregidaDespues '["2026-08-21",["2026-08-21 · CORRIGE la constancia: el nombre iba sin acento\n\nautorizado por Ana Ruiz."],["Ana Ruiz"]]'
# CUATRO negativos, y no son de adorno: excusar es facil de convertir en un agujero.
chk   "…pero una CORRIGE SIN nombre no"         "^false$"  PAT corregidaDespues '["2026-08-21",["2026-08-21 · CORRIGE la constancia\n\nsin ningun nombre"],["Ana Ruiz"]]'
chk   "…ni una ANTERIOR a lo que corrige"       "^false$"  PAT corregidaDespues '["2026-08-21",["2026-08-20 · CORRIGE algo\n\nautorizado por Ana Ruiz."],["Ana Ruiz"]]'
chk   "…ni una entrada que no diga CORRIGE"     "^false$"  PAT corregidaDespues '["2026-08-21",["2026-08-21 · otra cosa cualquiera\n\nautorizado por Ana Ruiz."],["Ana Ruiz"]]'
# Este lo encontro la PRUEBA INVERSA de este mismo PT: con «cualquier dia posterior» UNA entrada
# CORRIGE excusaba TODO el ledger anterior para siempre, y la inversa salia en CERO — o sea que no
# probaba nada. Una inversa que sale en cero no es un verde: es un aviso.
chk   "…ni una POSTERIOR de otro dia"           "^false$"  PAT corregidaDespues '["2026-08-13",["2026-08-21 · CORRIGE otra cosa\n\nautorizado por Ana Ruiz."],["Ana Ruiz"]]'

# Y el byte que se colo escribiendo esto: la clase de palabra de un regex acabo siendo 0x08 al
# pasar por el editor. «/‹0x08›CORRIGE‹0x08›/» no casa NUNCA y no se ve al leer, asi que la funcion
# devolvia false siempre y el caso habria dado verde por VACIO. Y el comentario que escribi para
# advertirlo contenia el mismo byte. Es la leccion de PT-085, repetida.
chkno "ningun byte de control en patrones.mjs"  "CONTROL"  sh -c 'tr -dc "\010\013\014\033" < "$1" | sed "s/.*/CONTROL/"' _ "$SUITE/tools/patrones.mjs"

# Sobre el arbol REAL: las tres de PT-088 declaran sujeto y su limite llega al mensaje.
chk   "las tres del arbol real estan completas"  "VACIO" \
  sh -c 'MTH_MOD="$1/docs/methodology/tools/patrones.mjs" node -e "import(require(String.fromCharCode(117,114,108)).pathToFileURL(process.env.MTH_MOD).href).then(m=>console.log((m.sujetosIncompletos().length ? m.sujetosIncompletos().join(' ') : 'VACIO')))"' _ "$RAIZ"

chk   "verify-suite publica cuantas lo declaran" "declaran su sujeto" \
  sh -c 'node "$1/docs/methodology/tools/verify-suite.mjs" "$1/docs/methodology" 2>&1' _ "$RAIZ"

# ── la QUINTA instancia: la guia de migracion ENUMERA lo nuevo ───────────────
chk   "una guia que olvida una regla nueva CAE"  '["B-R2"]' \
  PAT reglasNuevasFueraDeLaGuia '[{"A-R1":[10,0,0],"B-R2":[10,0,0]},"10.0.0","trae A-R1"]'
chk   "…y una que las nombra todas, pasa"        "VACIO" \
  PAT reglasNuevasFueraDeLaGuia '[{"A-R1":[10,0,0],"B-R2":[10,0,0]},"10.0.0","trae A-R1 y B-R2"]'
# Sin entrada devuelve null y NO lista vacia: «no hay guia que contrastar» no es «la guia esta
# bien». Es la misma distincion que PT-058 fijo para las cifras.
chk   "…y sin entrada dice null, no «vacio»"     "null" \
  PAT reglasNuevasFueraDeLaGuia '[{"A-R1":[10,0,0]},"10.0.0",null]'
chk   "sellar comprueba la guia, no que exista"  "guia de migracion" \
  sh -c 'cd "$1" && node docs/methodology/tools/tracker.mjs sellar 2>&1' _ "$RAIZ"

# ── la SEPTIMA instancia: revento() mira la traza, no la palabra ─────────────
#
# Un comentario de PT-088 que nombraba una clase de error puso TRECE casos en rojo: los que
# hacen «cat» de ese archivo. El sujeto es «el proceso termino de forma anomala», y su
# observable es la TRAZA DE PILA — «at» indentado seguido de «:linea:columna».
chk   "revento() caza un reviente de verdad"     "SI" \
  sh -c 'if node -e "undefinedFn()" 2>&1 | grep -qE "^[[:space:]]+at .*:[0-9]+:[0-9]+"; then echo SI; else echo NO; fi'
chk   "…y NO acusa a quien solo nombra el error" "NO" \
  sh -c 'if printf "%s" "esto habla de un TypeError y de un ReferenceError" | grep -qE "^[[:space:]]+at .*:[0-9]+:[0-9]+"; then echo SI; else echo NO; fi'
chk   "…y revento() ya no busca la palabra"      "NO" \
  sh -c 'if grep -q "revento() { printf .%s. \"\$1\" | grep -qE .SyntaxError" "$1/docs/methodology/tools/selftest.sh"; then echo SI; else echo NO; fi' _ "$RAIZ"

sec "── PT-089 · la divergencia no apaga comprobaciones ──"
#
# H-004. verify-fdge avisaba de la divergencia entre el registro y el YAML del intake, y usaba
# el del intake (PT-004: es lo que el PT dice de si mismo). Esa precedencia NO cambia. Lo que
# cambia es la consecuencia: un «status» terminal en el registro con uno vivo en el YAML hace
# que «fase >= N» no se cumpla y las comprobaciones posteriores NO SE EJECUTEN.
#
# Medido antes de escribir nada: de las 6 divergencias de «status» del repositorio, las 6 son
# de esa clase. CERO benignas — el aviso estaba calibrado para una mezcla que no existe.

# ── terminal en el registro y vivo en el YAML: ERROR ────────────────────────
build_fixture
reg_set "r.allocations.find(a=>a.id==='PT-001').status='INTEGRATED'"
perl -0pi -e 's/^status:.*$/status: READY/m' "$WORK/changes/PT-001-login/intake.md"
chk   "terminal en el registro y vivo en el YAML CAE"  "es un archivo que se quedó atrás" V PT-001 "$WORK"

# El mensaje declara lo que NO establece: cual de las dos fuentes tiene razon. Sin esa linea,
# el rojo se leeria como «el registro manda», y PT-004 decidio lo contrario.
build_fixture
reg_set "r.allocations.find(a=>a.id==='PT-001').status='INTEGRATED'"
perl -0pi -e 's/^status:.*$/status: READY/m' "$WORK/changes/PT-001-login/intake.md"
chk   "…y el mensaje dice que NO elige fuente"        "NO establece cuál de las dos" V PT-001 "$WORK"

# ── y las divergencias que NO apagan nada siguen siendo AVISO ───────────────
#
# Dos estados VIVOS distintos son una diferencia real entre dos fuentes, no un archivo atrasado.
build_fixture
reg_set "r.allocations.find(a=>a.id==='PT-001').status='IN_PROGRESS'"
perl -0pi -e 's/^status:.*$/status: READY/m' "$WORK/changes/PT-001-login/intake.md"
chkno "dos estados VIVOS distintos no son error"      "es un archivo que se quedó atrás" V PT-001 "$WORK"

# Las DOS terminales tampoco: una tarea cerrada declarada cerrada de otra forma no apaga nada.
build_fixture
reg_set "r.allocations.find(a=>a.id==='PT-001').status='INTEGRATED'"
perl -0pi -e 's/^status:.*$/status: CLOSED/m' "$WORK/changes/PT-001-login/intake.md"
chkno "…ni dos terminales distintos"                  "es un archivo que se quedó atrás" V PT-001 "$WORK"

# «phase» sigue siendo AVISO: hay 22 divergencias en tareas ya terminales y una terminal con
# «phase» viejo no apaga nada. Convertirlas en error nace con 22 fallos sobre trabajo cerrado,
# que es el error que PT-088 evito con RIGE_DESDE.
# El intake del fixture NO declara «phase» —lo comprobe leyendo el generador, DESPUES de
# que el caso fallara— asi que hay que anadirsela: sin ella no hay nada que comparar.
# «sed s///» con un salto real no es portable: se usa el comando «i», que INSERTA una linea
# antes de la que casa y no necesita escapar nada.
con_phase() { sed -i "/^status:/i phase: $1" "$WORK/changes/PT-001-login/intake.md"; }

build_fixture
reg_set "r.allocations.find(a=>a.id==='PT-001').phase=9"
con_phase 1
chkno "una «phase» divergente NO es error"            "es un archivo que se quedó atrás" V PT-001 "$WORK"
chk   "…pero si avisa"                                "«phase» divergente" V PT-001 "$WORK"

# ── avanzar cierra el acto: el estado terminal va en las DOS fuentes ────────
#
# Aqui nacian las seis: «avanzar» sincronizaba «phase» y NO «status», asi que al llegar a la
# ultima fase alguien marcaba INTEGRATED A MANO en el registro y el YAML se quedaba atras.
build_fixture; git_fixture
reg_set "r.allocations.find(a=>a.id==='PT-001').phase=9"
con_phase 9
AV PT-001 --a 10 --nota "cierre" >/dev/null 2>&1
chk   "avanzar a la ultima fase marca terminal"       "INTEGRATED" \
  sh -c 'node -e "console.log(JSON.parse(require(String.fromCharCode(102,115)).readFileSync(process.argv[1],\"utf8\")).allocations.find(a=>a.id===\"PT-001\").status)" "$1/docs/implementation/REGISTRY.json"' _ "$WORK"
chk   "…y lo escribe TAMBIEN en el YAML"              "status: INTEGRATED" \
  grep "^status:" "$WORK/changes/PT-001-login/intake.md"

# Y NO decide por una tarea que ya declaro como termina: FDGE-R53 es de la tarea, no de la
# herramienta. Una DEFERRED que llegue a la ultima fase sigue DEFERRED.
build_fixture; git_fixture
reg_set "r.allocations.find(a=>a.id==='PT-001').status='DEFERRED'"
reg_set "r.allocations.find(a=>a.id==='PT-001').phase=9"
con_phase 9
AV PT-001 --a 10 --nota "cierre" >/dev/null 2>&1
chk   "…y no pisa un estado terminal ya declarado"    "DEFERRED" \
  sh -c 'node -e "console.log(JSON.parse(require(String.fromCharCode(102,115)).readFileSync(process.argv[1],\"utf8\")).allocations.find(a=>a.id===\"PT-001\").status)" "$1/docs/implementation/REGISTRY.json"' _ "$WORK"

# ── sobre el arbol real: las seis quedaron sincronizadas ────────────────────
# AC-05 · «no procede» SI es comprobable: que SUITE-R35 no tenga fila en RIGE_DESDE y que aun
# asi el arbol este verde. Un AC sin escenario es huerfano (FDGE-R15), y declarar «no procede»
# sin poder ensenarlo seria exactamente lo que este lote persigue.
chk   "SUITE-R35 no necesita fila en RIGE_DESDE"      "SIN_FILA" \
  PAT_KEY SUITE-R35

chk   "el arbol real no tiene ninguna sin sincronizar" "VACIO" \
  sh -c 'cd "$1" && node -e "
const fs = require(String.fromCharCode(102,115));
const r = JSON.parse(fs.readFileSync(\"docs/implementation/REGISTRY.json\", \"utf8\"));
const T = new Set([\"INTEGRATED\",\"CLOSED\",\"REVERTED\",\"REJECTED\",\"DEFERRED\"]);
const mal = [];
for (const a of r.allocations.filter(x => /^PT-/.test(x.id))) {
  const d = \"changes/\" + (a.slug ? a.id + \"-\" + a.slug : a.id) + \"/intake.md\";
  if (!fs.existsSync(d)) continue;
  const m = /^status:[ \t]*(\S+)/m.exec(fs.readFileSync(d, \"utf8\"));
  if (m && T.has(String(a.status)) && !T.has(m[1])) mal.push(a.id);
}
console.log(mal.length ? mal.join(\" \") : \"VACIO\");
"' _ "$RAIZ"

sec "── PT-090 · la frescura del grafo viaja con el repositorio ──"
#
# H-005 y TD-17. El manifiesto guarda «ast_hash» EN LA MISMA LINEA que «mtime», y derivaDelGrafo
# usaba el mtime: el dato bueno estaba al lado y se eligio el barato. «git clone» reescribe los
# mtime con la fecha del clon, asi que los 17 archivos salian cambiados con el contenido
# identico — y dos commit seguidos tambien los mueven. Paso DOS VECES en este mismo lote.

# ── el hash manda, y el mtime deja de importar ──────────────────────────────
chk   "mismo hash, distinto mtime: NO hay deriva"     "VACIO" \
  PAT_H derivaDelGrafo AAA '[{"a.js":{"mtime":100,"ast_hash":"AAA"}}]'
chk   "hash distinto: SI hay deriva"                  '"a.js"' \
  PAT_H derivaDelGrafo BBB '[{"a.js":{"mtime":100,"ast_hash":"AAA"}}]'
# Un manifiesto VIEJO no trae hash. Darlo todo por cambiado seria nacer rojo, asi que se cae al
# mtime — que es lo que media antes, ni mejor ni peor.
chk   "sin hash en el manifiesto, cae al mtime"       '"b.js"' \
  PAT_M derivaDelGrafo 999 '[{"b.js":{"mtime":200}}]'
chk   "un archivo que no existe se nombra"            "no existe" \
  PAT_N derivaDelGrafo '[{"c.js":{"ast_hash":"A"}}]'

# ── las rutas del manifiesto son absolutas y se relativizan ─────────────────
#
# Sin esto, versionar el grafo NO bastaria: el manifiesto solo serviria en un disco donde el
# proyecto estuviera exactamente en esa ruta. Es la mitad del hallazgo que H-005 daba por hecha.
chk   "una ruta absoluta de windows se relativiza"    "bin/cauce.mjs" \
  PAT_R "C:\\DevOps\\Desarrollos\\cauce\\bin\\cauce.mjs" "C:/DevOps/Desarrollos/cauce"
chk   "…y una de posix tambien"                       "bin/cauce.mjs" \
  PAT_R "/home/x/cauce/bin/cauce.mjs" "/home/x/cauce"
chk   "…y una ya relativa se queda igual"             "bin/cauce.mjs" \
  PAT_R "bin/cauce.mjs" "C:/DevOps/Desarrollos/cauce"
# Si la raiz no aparece en la ruta NO se inventa una relativa: se devuelve lo que hay. Fabricar
# una ruta plausible seria peor que decir que no se pudo.
chk   "…y si la raiz no casa, no se inventa nada"     "otra/raiz/x.js" \
  PAT_R "otra/raiz/x.js" "/no/coincide"

# ── MISSING deja de ser un bloqueo mudo ─────────────────────────────────────
#
# En un clon limpio —CI incluida— graphify-out NUNCA existe: esta en .gitignore. La comprobacion
# no bloqueaba «a veces»: no llegaba a evaluarse fuera de la maquina que genero el grafo, y aun
# asi decia «Bloquea G2» como si si.
build_fixture
rm -rf "$WORK/graphify-out"
chk   "sin graphify-out dice NO ES EVALUABLE"         "NO ES EVALUABLE" V --all
chk   "…y ya no dice que bloquea G2"                  "NO ES EVALUABLE" V --all
chkno "…y no promete bloquear lo que no evalua"       "Bloquea G2 en PTs MAJOR" V --all

sec "── PT-091 · las cifras se derivan, no se transcriben ──"
#
# H-007 y H-006. services.md se genero el 2026-08-19 y OCHO de sus dieciseis cifras ya no
# describian el arbol UN DIA DESPUES. Durante EP-018 las distancias habian CRECIDO: 3541
# documentado contra 4919 reales. PTSA-R76 obliga a construir el universo auditable DESDE el
# inventario, y uno que envejece en un dia lo convierte en una fuente de memoria.

# ── el contrato ─────────────────────────────────────────────────────────────
chk   "una cifra que coincide no se reporta"          "VACIO" \
  PAT_C cifrasQueMienten 12 '[[{"herramienta":"a.mjs","lineas":12}]]'
chk   "…y una desviada si, con las dos cifras"        '"real":99' \
  PAT_C cifrasQueMienten 99 '[[{"herramienta":"a.mjs","lineas":12}]]'
# NULL no es cero: una herramienta retirada es un hecho DISTINTO de una con cero lineas, y se
# nombra aparte para que no se confunda con una cifra desviada (PT-058).
chk   "…y una herramienta retirada se nombra aparte"  "no existe" \
  PAT_N2 cifrasQueMienten '[[{"herramienta":"a.mjs","lineas":12}]]'

chk   "las filas de services.md se leen"              '"herramienta":"tracker.mjs"' \
  PAT_T cifrasTranscritas "| \`tracker.mjs\` | 2576 | hace cosas |"
chk   "…y una linea que no es fila no cuenta"         "VACIO" \
  PAT_T cifrasTranscritas "tracker.mjs tiene 2576 lineas"

# ── el recuento de CLAUDE.md, que se corrigio A MANO en la auditoria ─────────
chk   "el recuento de herramientas se lee"            '"herramientas":16' \
  PAT_T recuentosDeClaude "── HERRAMIENTAS ─── 16, y ninguna es opcional ──"
chk   "…y el de comandos tambien"                     '"comandos":3' \
  PAT_T recuentosDeClaude "El binario: install · verify · core"

# ── la accion recalcula, y sin --aplicar no escribe ─────────────────────────
build_fixture
mkdir -p "$WORK/docs/enterprise-documentation/inventory"
printf '| Herramienta | Lineas |\n|:--|--:|\n| `tracker.mjs` | 1 | x |\n' > "$WORK/docs/enterprise-documentation/inventory/services.md"
chk   "inventario enumera la cifra desviada"          "services.md dice 1 y son" TR inventario
chk   "…y dice como arreglarlo"                       "--aplicar"                TR inventario
chk   "…y sin la marca NO ha escrito nada"            "| 1 |" \
  cat "$WORK/docs/enterprise-documentation/inventory/services.md"

build_fixture
mkdir -p "$WORK/docs/enterprise-documentation/inventory"
printf '| Herramienta | Lineas |\n|:--|--:|\n| `tracker.mjs` | 1 | x |\n' > "$WORK/docs/enterprise-documentation/inventory/services.md"
TR inventario --aplicar >/dev/null 2>&1
chkno "…y con la marca la reescribe"                  "| 1 |" \
  cat "$WORK/docs/enterprise-documentation/inventory/services.md"

# ── y sobre el arbol real, la comprobacion en verde ─────────────────────────
chk   "el arbol real tiene sus cifras al dia"         "coinciden con el árbol" \
  sh -c 'cd "$1" && node docs/methodology/tools/verify-fdge.mjs PT-091 2>&1 | grep FND-R14' _ "$RAIZ"

sec "── PT-093 · el limite de las compuertas se declara ──"
#
# H-009. main exige PR y CI en verde INCLUSO PARA ADMINISTRADORES, sin force push ni borrado,
# pero con CERO revisores aprobadores — la unica configuracion viable para el equipo de una
# persona que SUITE-R22 declara soportado. El control de EXEC-R04 es por tanto un REGISTRO
# POSTERIOR CONTRASTABLE, no una prevencion, y eso no estaba escrito en ningun sitio.
#
# SUITE-R27 ya lo declara con esa franqueza para las FIRMAS. EXEC-R04 no lo decia, y es donde
# la consecuencia es irreversible.

chk   "EXEC-R04 declara que garantiza"          "Qué garantiza esta compuerta" \
  cat "$SUITE/EXECUTION-MODES.md"
chk   "…y que NO puede garantizar"              "ejecutara el merge" \
  cat "$SUITE/EXECUTION-MODES.md"
# Sin esta linea, «0 revisores» se leeria como un descuido de configuracion en vez de como la
# unica opcion viable para el caso que SUITE-R22 declara soportado.
chk   "…y que 0 revisores no es un descuido"    "no es un descuido de configuración" \
  cat "$SUITE/EXECUTION-MODES.md"

chk   "EXEC-R04a fija la forma de la constancia" "forma fija" \
  cat "$SUITE/EXECUTION-MODES.md"
chk   "…y dice DONDE mirar"                      "SESSION_LOG.md" \
  grep -A4 "EXEC-R04a" "$SUITE/EXECUTION-MODES.md"

# ── PT-093 · dos lectores del mismo hecho, divergentes ──────────────────────
#
# LEX-R24 admite sub-IDs con letra minuscula pegada. «reglasDelMarco» de patrones.mjs los
# aceptaba y los DOS extractores de build-core los rechazaban: una sub-regla en prosa quedaba
# fuera de CORE.md EN SILENCIO, y CORE.md es lo unico que el agente carga.
chk   "una sub-regla llega a CORE.md"            "EXEC-R04a" \
  grep "EXEC-R04a" "$SUITE/CORE.md"
chk   "…y los dos extractores aceptan el sufijo" "2" \
  sh -c 'grep -c "A-Z]+-\[RP\].d+\[a-z\]?" "$1/tools/build-core.mjs"' _ "$SUITE"
chk   "…y la regla nueva declara desde cuando"   "TIENE_FILA" \
  PAT_KEY EXEC-R04a
# AC-03 · «ya lo entrego PT-088» tambien es comprobable, y FDGE-R15 tiene razon en pedirlo:
# un AC sin escenario es huerfano. Es la SEGUNDA vez en el lote — PT-089 AC-05 fue la primera —
# y las dos veces la leccion es la misma: declarar que algo esta hecho sin poder ensenarlo es
# exactamente lo que este lote persigue.
chk   "AC-03 ya lo entrego PT-088, y se ve"      "sin constancia de autorización" \
  sh -c 'grep -o "sin constancia de autorización" "$1/tools/verify-fdge.mjs" | head -1' _ "$SUITE"

sec "── PT-092 · ejecutar QA y FPGE ──"
#
# H-008 y TD-15. De los tres componentes nunca ejecutados, PTSA cayo en su propia auditoria.
# FPGE se ejecuta aqui. QA NO APLICA: QA-R01 dice que opera SOLO desde el navegador, y
# inventory/routes.md y endpoints.md declaran que este sistema no tiene rutas ni API.
#
# «No aplica» y «sin ejecutar» son hechos DISTINTOS, y contarlos juntos era el defecto de TD-15.

# ── FPGE ejecutado, sobre el arbol real ─────────────────────────────────────
chk   "hay ROADMAP con candidatos"               "R-001" \
  cat "$RAIZ/docs/implementation/ROADMAP.md"
chk   "…y todo candidato cita su evidencia"      "todos con evidencia de origen" \
  sh -c 'cd "$1" && node docs/methodology/tools/verify-qa.mjs 2>&1' _ "$RAIZ"
chk   "…y declara la frescura de sus fuentes"    "Frescura declarada" \
  sh -c 'cd "$1" && node docs/methodology/tools/verify-qa.mjs 2>&1' _ "$RAIZ"
# FPGE-R04 · un roadmap que promueve deja de ser un roadmap y pasa a ser una decision tomada
# sin firma. Los ocho nacen DRAFT.
chk   "…y NO promueve nada"                      "prohíbe promover" \
  cat "$RAIZ/docs/implementation/ROADMAP.md"
chk   "…y el historico es append-only"           "primera corrida de FPGE" \
  cat "$RAIZ/docs/implementation/ROADMAP_HISTORY.log"

# El roadmap dice lo que NO puede decir. Sin esa seccion, ocho cifras con un decimal parecen
# un calculo — y solo EvidenceWeight sale de un hecho observable.
chk   "…y dice que el orden es un juicio"        "para que parezca un cálculo" \
  cat "$RAIZ/docs/implementation/ROADMAP.md"

# ── QA declarado NO APLICA, que es distinto de pendiente ────────────────────
chk   "el catalogo declara que QA no aplica"     "no es lo mismo que «no probado»" \
  cat "$SUITE/CASOS-DE-USO.md"
chk   "…y dice por que no se forzo"              "fabricar un verde en el" \
  cat "$SUITE/CASOS-DE-USO.md"
# TD-15 contaba tres pendientes juntos. Ahora separa lo que no aplica de lo que falta.
chk   "TD-15 separa «no aplica» de «pendiente»"  "uno pendiente y uno que no aplica" \
  cat "$RAIZ/docs/enterprise-documentation/10-Technical-Debt.md"

# ── el incidente quedo registrado, y con seguimiento ────────────────────────
#
# INC-001: el cierre de dos hallazgos desaparecio sin que nada avisara, y lo encontro FPGE
# PHASE 2 diecisiete commits despues. Ningun verificador comprueba que un cierre siga cerrado.
chk   "INC-001 registrado en el ledger"          "INC-001" \
  cat "$RAIZ/docs/implementation/INCIDENTS.log"
chk   "…y tiene candidato en el roadmap"         "INC-001" \
  cat "$RAIZ/docs/implementation/ROADMAP.md"

echo
# PT-050 · con --solo la salida dice CUANTOS DE CUANTOS. Sin la bandera, UNIVERSO y TOTAL
# coinciden y se imprime como siempre: la segunda cifra solo aparece cuando hay algo que
# distinguir. Y un patron que no casa NADA es ROJO — un verde por vacio es lo que PT-023
# encontro ejecutando: el silencio parece exito.
if [ -n "$SOLO" ] && [ "$TOTAL" -eq 0 ]; then
  echo "selftest: NINGUN CASO CASA «$SOLO» · 0 de $UNIVERSO casos"
  rm -rf "$WORK"
  exit 1
fi
_cuantos="$TOTAL"
[ -n "$SOLO" ] && _cuantos="$TOTAL de $UNIVERSO"
# PT-086 · una corrida PARCIAL tiene que ser distinguible de una completa a simple vista, y
# tiene que DECIR lo que salto. Un «OK» identico al de la corrida entera seria el falso verde
# mas caro que este arnes podria producir — y sellar exige la completa (SUITE-R57).
if [ -n "$AFECTADOS" ]; then
  _cuantos="$TOTAL de $UNIVERSO · PARCIAL"
  echo ""
  echo "PARCIAL · corrieron las secciones que ejercitan lo que ha cambiado."
  if [ -n "$SECCIONES_SALTADAS" ]; then
    echo "NO se ejecutaron:"
    printf '%s' "$SECCIONES_SALTADAS"
  fi
  echo "Para sellar una version hace falta la corrida COMPLETA: bash selftest.sh sin --afectados."
  echo ""
fi
[ "$FAILED" -eq 0 ] && echo "selftest: OK · $_cuantos casos" || echo "selftest: HAY FALLOS · $_cuantos casos"
rm -rf "$WORK"
exit "$FAILED"

