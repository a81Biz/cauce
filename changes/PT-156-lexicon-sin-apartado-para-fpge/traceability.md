# `PT-156` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Los siete pasos se escriben `PHASE <n> — <Nombre>` | `TS-01` · `TS-02` | `selftest` ×3 | `evidence/PT-156/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-02 | `LEXICON` §3 tiene apartado propio, con las mismas siete fases | `TS-03` | `selftest` · lectura fila a fila | `evidence/PT-156/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-03 | `patrones.mjs` declara `FPGE.fases` y ya no `SIN_EVALUAR` | `TS-06` | `verify-patrones` | `evidence/PT-156/salidas/verify-patrones.out` | n/a | `CUMPLIDO` |
| AC-04 | `audit` no reporta ningún hueco de clase `fase` | `TS-08` | `npm run audit` | `evidence/PT-156/salidas/audit.out` | n/a | `CUMPLIDO` |
| AC-05 | `CORE.md` regenerado, y su `diff` **se lee** | `TS-04` | `build-core` · lectura del `diff` | `evidence/PT-156/salidas/core-diff.out` | n/a | `CUMPLIDO` |
| AC-06 | `verify-suite`, `verify-patrones` y `verify-fdge` en verde | `TS-05`..`TS-07` | los tres | `evidence/PT-156/salidas/bateria.out` | n/a | `CUMPLIDO` |

**`AC-02` es el que decidió el orden de todo lo demás.** Escribir el apartado primero habría sido
una afirmación sin respaldo: no habría fases que estuviera declarando. Por eso `AC-01` va antes.

**`AC-05` no era «sin errores»: era leer el `diff`.** Y leerlo destapó que `CORE` publicaba
`FPGE … → promote` con **seis** pasos, contra `FPGE-R04`, que dice que `PHASE 7` es STOP.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | Ninguna regla cambia de enunciado ni de severidad; `CORE` sigue en **263** | `verify-suite` · `build-core` | `CUMPLIDO` |
| RC-02 | El **proceso** de `FPGE` no cambia: sólo la grafía de sus pasos | lectura del `diff` | `CUMPLIDO` |
| RC-03 | Los otros cinco componentes conservan su rango | `verify-patrones` (`TS-06` derivado) | `CUMPLIDO` |
| RC-04 | Lo que protegían los dos casos retirados de `PT-147` sigue protegido | `TS-05` · `TS-06` | `CUMPLIDO` |

**`RC-04` es el que no se podía saltar.** `PT-147` tenía dos casos que clavaban que `FPGE` saliera
`SIN EVALUAR`. Ese hecho cambió **por diseño**, así que las dos aserciones se **retiran con su
motivo escrito** — nunca en silencio — y lo que defendían pasa a `verify-patrones`, que ahora
contrasta el contrato contra `LEXICON` en los **dos** sentidos.

## Lo que esta tarea destapó, y **tiene tarea**

- **`PT-164`** — `SUITE-R44` citaba `retomada` con **dos IDs distintos en la misma regla**, secuela
  del renumerado de `PT-148`. Una cita a un ID **equivocado pero real** pasa todos los
  verificadores, y `CORE.md` la publica.
- **`PT-165`** — el mapa de fases de `CORE` está **tecleado** para los cinco componentes que lista;
  `FIDE` no aparece pese a tener `fases: [1, 5]`. Publicaba `FPGE → promote` contra `FPGE-R04`.
- **`PT-166`** — `LEXICON` §2 prohíbe `Step n` y `Etapa n` **por su nombre**, y la grafía `[n]` no
  está en la lista. Es la rendija por la que `FPGE` estuvo siete versiones sin fases.

Las tres enlazadas a su parada con `--desenlace abre`.

## Y una décima vez

Escribiendo el contraste con `LEXICON`, el regex `/\r?\n/` **se degradó al escribir el archivo** y
`verify-patrones` dejó de arrancar. Es `SUITE-R59`, la **décima** medida en este repositorio, y la
segunda en este lote. Se arregló como enseñó `PT-148`: **quitando el regex** —`split(String
.fromCharCode(10))` y `trim()`—, no reescribiendo el escape.
