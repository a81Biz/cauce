# PT-147 · `traceability.md` — `FDGE-R15`

> **Los `AC` son los del `intake.md`, no los de `scope.md`.** `FDGE-R15` dice que ésta es la lista
> con la que trabaja el resto de la suite y que **se citan estos `AC-nn` y ningún otro**. `PHASE 2`
> los había reagrupado en cuatro; eso eran dos listas del mismo hecho — la avería que este lote
> persigue, cometida dentro del propio lote.

| AC | Criterio | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | No queda ningún literal de componente en `audit.mjs` | `grep` de nombres y prefijos | `salidas/selftest-casos.out` | n/a | `CUMPLIDO` |
| AC-02 | `PROMPTS` y `esperadas` dejan de ser dos mapas: **uno solo**, derivado del contrato | lectura · el bucle recorre `COMPONENTES` | `salidas/audit-despues.out` | n/a | `CUMPLIDO` |
| AC-03 | **`FPGE` y `FIDE` entran en la auditoría de fases** — con cifra o con `SIN EVALUAR`, nunca ausentes | `selftest.sh` ×3 | `salidas/selftest-casos.out` | n/a | `CUMPLIDO` |
| AC-04 | El ternario `Foundation → FND` desaparece: la sigla es un campo | `selftest.sh` · `grep` | `salidas/selftest-casos.out` | n/a | `CUMPLIDO` |
| AC-05 | Las `refs` de PTSA salen del contrato | lectura | `salidas/audit-despues.out` | n/a | `CUMPLIDO` |
| AC-06 | Las cifras de los **cuatro ya auditados** no cambian | `npm run audit` antes/después | `salidas/audit-antes.out` · `audit-despues.out` | n/a | `CUMPLIDO` |
| AC-07 | Un componente añadido al contrato aparece en el informe con sus fases | el bucle sale de `COMPONENTES` | `salidas/selftest-casos.out` | n/a | `CUMPLIDO` |

**`AC-06` se midió por componente, no por total.** El total **sube** —entran dos— así que
compararlo habría sido medir lo que no es. `fase: 40` antes y después.

**`AC-03` es el único que cambia comportamiento, y es el objetivo.** Los dos entran **distinto**
porque `PT-144` midió que no son el mismo caso: `FIDE` tiene rango en `LEXICON` §3.5, `FPGE` no
tiene apartado. «No aparece» es indistinguible de «está bien»; `SIN_EVALUAR` dice lo que se sabe y
lo que no (`RULE-06`).

**El aviso de `AC-06` del intake no se cumplió, y conviene decirlo:** advertía que si las cifras
de los cuatro cambiaban al derivar de `LEXICON`, sería un hallazgo y motivo de `FDGE-R41`. **No
cambiaron.** `fase: 40` idéntico.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | Las cifras de los cuatro ya auditados | `fase: 40` antes y después | `CUMPLIDO` |
| RC-02 | `cubre` reconoce las tres formas de declarar una fase | el mecanismo no se tocó | `CUMPLIDO` |
| RC-03 | `FIDE` y `FPGE` aparecen, de forma distinta | los tres casos permanentes | `CUMPLIDO` |
| RC-04 | El hueco no puede volver | el bucle recorre `COMPONENTES` | `CUMPLIDO` |

## Lo que la tarea destapó, y **tiene tarea**

`FIDE` entró y salió **rojo** — el objetivo cumplido, no un fallo: `intake.md` §4 lo declaró `OUT`
antes de empezar.

```
✗ FIDE PHASE 1 … PHASE 5     ausente en: FIDE/FIDE-Prompts.md
```

**El archivo no existe**, y `LEX-R15` dice que *«todo componente tiene exactamente un archivo de
prompts»* — enumerando **cinco** cuando son seis.

**`PT-158`**, enlazada a la parada de [#282](https://github.com/a81Biz/cauce/issues/282) con
desenlace `abre`.
