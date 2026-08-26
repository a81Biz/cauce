# `PT-149` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | El alta **no toca ninguna herramienta**: de `tools/` sólo cambia el contrato | TS-01 | `selftest` · `diff -rq tools/` | `evidence/PT-149/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-02 | Las cuatro herramientas lo reconocen, cada una con su comprobación propia | TS-02..TS-07 | `selftest` ×6 | `evidence/PT-149/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-03 | Las reglas del componente **no quedan invisibles** al verificador | TS-04 · TS-08..TS-10 | `verify-patrones` · `prefijos()` | `evidence/PT-149/salidas/verify-patrones.out` | n/a | `CUMPLIDO` |
| AC-04 | La baja deja el árbol idéntico al de partida | TS-11 | `diff -rq` copia contra copia prístina | `evidence/PT-149/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-05 | El caso corre dentro de `npm run verify`, no aparte | TS-01..TS-11 | la batería completa · 1747 casos | `evidence/PT-149/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-06 | El componente de prueba **no queda declarado**, ni aunque el caso falle a mitad | TS-12 | `selftest` ×2 · `grep` del árbol real | `evidence/PT-149/salidas/bateria.out` · `git-status.out` | n/a | `CUMPLIDO` |

**`AC-01` y `AC-03` se reformulan a lo que se midió, y las dos quedan más fuertes.**

`AC-01` decía «el alta toca **únicamente el contrato**». Es lo que `E5` afirmaba, y **es falso**:
el alta toca el contrato **y dos documentos** —`LEXICON` §3 y el archivo de prompts—, porque sin
ellos el rango es *inventado* y `audit` reporta el hueco. Lo que de verdad promete `SUITE-R60`, y
lo que ahora se comprueba, es que **no se toca ninguna herramienta**: de `tools/` sólo cambia el
contrato. «Un solo archivo» era una forma más bonita de decirlo y decía otra cosa.

`AC-03` decía «se rompe una regla del componente de prueba y `verify-suite` la caza». Al medirlo,
lo que de verdad protege eso es que `prefijos()` **recoja** el prefijo nuevo (`TS-04`) — y ahí
apareció el paso que **no decía nadie**: `prefijos()` sale de `FAMILIAS`, no de `COMPONENTES`. Sin
esa segunda entrada, las reglas del componente son **invisibles** al verificador y todo pasa en
verde **por no mirarlas**, que es el defecto exacto que abrió `EP-022`. `TS-08`..`TS-10` cubren la
otra mitad: que quitar un componente, quitar una familia o alterar el orden **sigan** siendo rojo.

**`AC-06` se escribió sin `TS` y `verify-fdge` lo rechazó — con razón.** El argumento era que todo
ocurre sobre copias en `$WORK`, así que incumplirlo es *estructuralmente imposible*. Es cierto y
**no es un escenario**: `FDGE-R15` llama a eso un *Orphan Criterion*, y «es imposible por diseño»
es justo la clase de afirmación que este lote existe para no aceptar sin medir. `TS-12` lo
comprueba donde una fuga existiría — después de once altas y once bajas.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | El contrato **no puede encoger**: perder uno de los seis sigue siendo rojo | TS-08 | `CUMPLIDO` |
| RC-02 | `FIDE` sigue siendo el opcional que `verify-suite:425` y `comparar-marco:39` leen | `verify-patrones` | `CUMPLIDO` |
| RC-03 | Los bloques redactados de `CORE` no se pierden: se **completan**, no se reescriben | lectura del `diff` de `CORE` | `CUMPLIDO` |
| RC-04 | Ninguna regla cambia; `CORE` sigue en **263** | `verify-suite` · `build-core` | `CUMPLIDO` |

**`RC-03` es el que justifica «completar» en vez de «derivar».** Los dos bloques llevan la sintaxis
de cada comando —`delta QA PT-XXX`, `promote FPGE R-NNN`— que no sale de ningún contrato.
Derivarlos enteros la habría perdido, y `CORE.md` es lo único que el agente carga para saber cómo
invocarlos.

## Lo que esta tarea destapó, y **tiene tarea**

- **`PT-168`** (`S1`) — `audit` da por cubierta la fase de un componente si el **número** aparece
  en cualquier sitio del documento, sin mirar de quién es. De las tres dimensiones que exige por
  fase, **sólo una discrimina**.
- **`PT-165`** — el mapa de fases de `CORE` estaba tecleado, y **`FIDE` faltaba** teniendo rango
  declarado. Absorbida aquí: era lo que `AC-02` necesitaba.

Las dos enlazadas a su parada con `--desenlace abre`.
