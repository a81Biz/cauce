# PT-029 — Descubrimiento   `PHASE 2` · `2-B`

## Cómo se buscó, y por qué así

Los cinco casos conocidos aparecieron **al chocar con ellos**. La tarea pedía buscar, no recordar,
así que se cruzaron tres hechos que ya existían en el repositorio y que nadie había cruzado:

1. `tracker.mjs` declara, **como dato**, qué produce cada fase y con qué compuerta cierra.
2. De ahí se **deriva** en qué fase existe cada artefacto.
3. `verify-fdge.mjs` dice qué exige y **cuándo**.

La forma del defecto, enunciada para poder buscarla: *una comprobación exige, en la fase N, un
artefacto que el procedimiento escribe en la fase M > N*.

## Lo medido

```
=== FASES, según el único sitio donde son un DATO ===
  PHASE 1  Intake          produce: intake.md                       cierra: G1
  PHASE 4  Propuesta       produce: design · tasks · test-scenarios
                                    out-of-scope · spec-changes
                                    traceability                    cierra: G2
  PHASE 6  Evidencia       produce: manifest.json · self-review.md
  PHASE 7  Validación                                               cierra: G3
  PHASE 8  Persistencia    produce: HISTORY.log · índice
  PHASE 9  Integración                                              cierra: G4

=== Comprobaciones que se activan con CUALQUIER compuerta ===
  (frente a 6 que distinguen gate === 'G4', que es la forma correcta)
  verify-fdge.mjs:1097  FDGE-R23   if (gate) fail(… falta manifest.json)
  verify-fdge.mjs:1129  FDGE-R25   if (gate || afterPhase6) fail(… falta self-review.md)
  verify-fdge.mjs:1155  FDGE-R29   if (gate) fail(… sin entrada en HISTORY.log)
```

## Los tres choques, confirmados ejecutando

`PT-029` está en `PHASE 1`. Las cuatro compuertas, sobre él:

```
--gate G1   ✗ FDGE-R23 falta manifest.json  ✗ FDGE-R25 falta self-review  ✗ FDGE-R29 sin HISTORY
--gate G2   ✗ FDGE-R23                      ✗ FDGE-R25                    ✗ FDGE-R29
--gate G3   ✗ FDGE-R23                      ✗ FDGE-R25                    ✗ FDGE-R29
--gate G4   ✗ SUITE-R45 (correcto)          ✗ FDGE-R23 ✗ FDGE-R25 ✗ FDGE-R29
```

**`G1`, `G2` y `G3` exigen exactamente lo mismo que `G4`.** El parámetro `gate` no distingue qué
compuerta se está evaluando: es un booleano «G4 o no G4», y las tres compuertas anteriores heredan
las exigencias de la última.

| Choque | Comprobación | Artefacto | Se escribe en | Se exige en |
|:---|:---|:---|:---|:---|
| 1 | `FDGE-R23` | `manifest.json` | `PHASE 6` | `G1` (`PHASE 1`) y `G2` (`PHASE 4`) |
| 2 | `FDGE-R25` | `self-review.md` | `PHASE 6` | `G1` y `G2` |
| 3 | `FDGE-R29` | `HISTORY.log` | `PHASE 8` | `G1`, `G2` y `G3` |

**Tres compuertas de cuatro no se pueden evaluar con la herramienta que existe para evaluarlas.**
`--gate G1` no puede pasar nunca, para ningún PT, en ningún estado: exige en `PHASE 1` lo que se
escribe en `PHASE 8`.

## Una causa, no tres

Los tres son la misma línea escrita tres veces: `if (gate)` donde debería decir de **qué**
compuerta se habla. En el mismo archivo hay **seis** comprobaciones que sí lo hacen
(`gate === 'G4'`), así que la forma correcta ya existía al lado.

Es, otra vez, `RULE-01`: el mismo hecho —«esto se exige al cerrar»— escrito tres veces sin decir
al cerrar **qué**.

## Por qué no se había visto

`CLAUDE.md` y la cabecera de `verify-fdge` documentan **solo** `--gate G4`:

```
node verify-fdge.mjs --gate G4 PT-042    solo las precondiciones de G4
```

`G1`, `G2` y `G3` se resuelven por firma o por regla automática (`EXEC-R06`), y `EXEC-R06` dice
que auto significa que **`verify-fdge` pasó** — sin `--gate`. Así que la ruta rota es la que nadie
recorre, y lleva rota desde que existe el parámetro.

**Lo encontró `PT-020`**, ejecutando `--gate G3` por curiosidad en `PHASE 7`. No lo encontró
leyendo el código: lo encontró usándolo.

## Lo que la búsqueda NO encuentra

El detector cruza **fases contra compuertas**. Los cinco choques del `origin` de esta tarea eran de
otra familia —dos reglas que se contradicen entre sí, sin fases de por medio— y este método **no
los habría encontrado**. `SUITE-R09` + `FDGE-R29` (el ledger irreparable de `PT-046`) no es un
problema de fases: es una regla que prohíbe editar y otra que prohíbe añadir.

Se dice porque importa: esto detecta **una** forma del defecto, la que se puede derivar de dos
tablas. Las otras siguen apareciendo al chocar.
