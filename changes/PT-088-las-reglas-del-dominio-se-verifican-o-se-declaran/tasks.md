# PT-088 — Tareas   `PHASE 4`

**Los archivos son lo que hace computable el solapamiento** (`FDGE-R40`). Los cinco de aquí están
en la tabla de `EP-018` §6, y los pares que comparten `patrones.mjs` y `verify-fdge.mjs` quedaron
serializados por eso.

| # | Qué | Archivo |
|---:|:---|:---|
| 1 | `lineasPerdidas` — cuenta líneas borradas, `null` si no hay diff | `docs/methodology/tools/patrones.mjs` |
| 2 | `mergesSinConstancia` — empareja por día, filtra por `firmantes` | `docs/methodology/tools/patrones.mjs` |
| 3 | `RIGE_DESDE`: `SUITE-R09` y `EXEC-R04` en `[11,0,0]` | `docs/methodology/tools/patrones.mjs` |
| 4 | `rigeGlobal` — la versión del **registro**, no la del PT | `docs/methodology/tools/verify-fdge.mjs` |
| 5 | `checkLedgers` + `checkG4ConConstancia`, e invocarlas | `docs/methodology/tools/verify-fdge.mjs` |
| 6 | `SUITE-R01` declarada, con motivo y firma | `docs/implementation/NO-VERIFICABLES.md` |
| 7 | 13 casos, sección propia | `docs/methodology/tools/selftest.sh` |

## Orden, y por qué éste

```
1-3  el contrato PURO primero: se prueba sin fixture y verify-patrones lo cubre
4    rigeGlobal ANTES que las dos comprobaciones, o revientan con ReferenceError
5    las dos comprobaciones
7    los casos
6    SUITE-R01 la ULTIMA
```

**`6` va al final a propósito.** Declarar una regla no verificable **antes** de intentar las otras
dos sería declarar sin haber medido. Después, la declaración dice *«se intentaron tres, dos
salieron y ésta no, por esto»* — contrastable, y no una excusa.

## Lo que este orden ya cazó

El paso `4` no estaba en el plan: escribí `5` usando el `rige` de `checkPT`, que **no está en
alcance** a nivel de módulo. Reventó con `ReferenceError` y mi propio `grep` sobre la salida lo
escondió. Se ve ejecutando sin filtro, y está en [`design.md`](design.md).
