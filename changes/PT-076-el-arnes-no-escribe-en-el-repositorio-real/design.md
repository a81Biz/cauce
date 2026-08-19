# PT-076 — Diseño   `PHASE 4`

## 1 · Los nueve casos, al fixture

Los tres bloques de `sesion abrir` y `sesion cerrar` pasan de `TRR` a `TR`. El fixture necesita
git inicializado para que `sesion abrir` tenga un `HEAD` que marcar — ya hay precedente
(`git_lote` de `PT-055`, `repo_con_secreto`).

```bash
# antes
chk "sesion abrir escribe la marca"  "sesion abierta desde"  TRR sesion abrir
# despues
build_fixture; git_fixture          # init + un commit, para que exista HEAD
chk "sesion abrir escribe la marca"  "sesion abierta desde"  TR sesion abrir
```

Lo que comprueban **no cambia**: que la marca se escriba, que se sobrescriba al reabrir, que el
handoff de cierre salga, que no borre la marca y que `HANDOFF.md` quede intacto.

## 2 · El caso que impide la reincidencia

```bash
# Deriva del CODIGO que acciones escriben, y comprueba que ninguna se invoque por TRR.
# No se mantiene una lista a mano: se queda corta en cuanto alguien añade una accion, que es
# lo que SUITE-R53 dice de la tabla del manual.
escriben=$(node -e '
  const s = require("fs").readFileSync(process.argv[1], "utf8");
  const m = s.match(/const acciones = \{([^}]*)\}/)[1];
  const nombres = m.split(",").map((x) => x.trim().split(":")).filter((p) => p[0]);
  const out = [];
  for (const [alias, fn] of nombres) {
    const nombre = (fn ?? alias).trim();
    const i = s.indexOf("function " + nombre);
    if (i < 0) continue;
    const cuerpo = s.slice(i, s.indexOf("\nfunction ", i + 1));
    if (/writeFileSync/.test(cuerpo)) out.push(alias.trim());
  }
  console.log(out.join(" "));
' "$SUITE/tools/tracker.mjs")

malos=""
for a in $escriben; do
  grep -qE "TRR $a( |\$)" "$SUITE/tools/selftest.sh" && malos="$malos $a"
done
```

El caso pasa si `malos` está vacío, y el mensaje **nombra la acción**: sin eso, quien lo vea
caer no sabría cuál añadió.

**Excepción declarada:** una acción que escriba y se invoque por `TRR` **con `--ver`** no
cuenta, que es el caso de `asignar`. La comprobación lo tiene en cuenta.

## 3 · Las 140, declaradas

Nota nueva en `SESSION_LOG.md` —append, no edición— que diga qué son, cuántas y desde cuándo,
y que remita aquí. No se borran: `SUITE-R09`.

## Lo que NO cambia

| Pieza | Por qué |
|:---|:---|
| `TRR` sigue existiendo | `coste`, `viabilidad` y `personas` necesitan el historial real |
| `tracker sesion` | La herramienta está bien; lo que estaba mal es desde dónde se la probaba |
| Las 140 entradas | Append-only (`SUITE-R09`). Se declaran, no se limpian |
| `asignar --ver` | Ya era el patrón correcto. Se cita como precedente |
