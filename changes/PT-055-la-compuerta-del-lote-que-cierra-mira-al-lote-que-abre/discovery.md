# PT-055 — Descubrimiento   `PHASE 2-B`

## Causa raíz, medida y no supuesta

Tres hechos, los tres comprobados ejecutando:

**1 · `verify-fdge` no acepta un `EP-NNN` como objetivo.**

```js
// verify-fdge.mjs:1569
const targets = argv.filter((a, i) => /^PT-\d+$/.test(a) && !(gateIdx >= 0 && i === gateIdx + 1));
```

El filtro casa `PT-\d+` y nada más. La orden `--gate G4 EP-013` deja `targets` **vacío**: el
`EP-013` se descarta en silencio. La herramienta nunca supo qué lote evaluaba.

**2 · `enG4` es global, no del lote.**

```js
// verify-fdge.mjs:827
const enG4 = gate === 'G4' || alloc?.status === 'DONE';
```

`gate` es la bandera de la línea de órdenes. `checkCierreDeLote` se llama una vez **por cada
lote** de `changes/` desde `checkEpics()` (`:752`), y todos ven el mismo `gate`.

**3 · La combinación.** `checkEpics()` recorre los `EP-*` del disco:

```js
// verify-fdge.mjs:742
const eps = readdirSync(CHANGES).filter((d) => /^EP-\d+/.test(d) && ...);
```

Con `--gate G4`, **todos** los lotes vivos entran en modo bloqueante a la vez. Un lote recién
abierto tiene sus filas de cierre sin resolver *por definición* — es lo que significa estar
abierto —, así que bloquea el cierre de cualquier otro.

## Por qué apareció cuando apareció

La suposición implícita era **«el lote que cierra es el único lote abierto»**. Se sostuvo hasta
`EP-013`, porque hasta entonces los lotes no se solapaban. `EP-014` se abrió antes del `G4` de
`EP-013` y la suposición se rompió.

No es un error de escritura: es un invariante que nadie declaró y que dejó de valer.

## Familia

Tercer caso de `PT-029`: **una comprobación que hace imposible el estado que otra obliga a
atravesar**. `EXEC-R03` quiere que los lotes se encadenen; `SUITE-R45` bloquea mientras haya
otro abierto. Las dos tienen razón por separado.

El cuarto caso es el `CHALLENGE` de `G1` de `EP-017`, escrito ayer: `DoR-E7` exige un
`BACKLOG.md` derivado cuyo generador es una tarea del propio lote.

## Lo que NO es la causa

- No es `SUITE-R45`: lo que exige —que un lote declare qué resuelve al cerrar— es correcto.
- No es la sección `## Cierre del lote` de `EP-014`: sus filas estaban bien, sólo sin hacer.
- No es `RE_RESUELTA`: distingue resuelto de no resuelto correctamente.

El defecto está en **a quién se le aplica** la exigencia, no en la exigencia.
