# `PT-205` — Cumplir `SUITE-R34` exige un acto fuera del comando

```yaml
---
id: PT-205
type: BUG
severity: S2
epic: EP-026
track: STANDARD
status: DRAFT
phase: 1
created: 2026-08-30
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

El PR **#376**, en el paso «Cumplimiento de los artefactos propios»:

```
✗ SUITE-R34  Hubo trabajo en changes/ después del último estado. La sesión terminó sin dejar el
             estado retomable […]
```

**El veredicto era correcto.** Lo que no existe es la forma de cumplirlo.

## 2. Por qué   `[HUMANO]`

```js
// tracker.mjs:3799 — DENTRO de `avanzar`, y sólo ahí
const sello = `actualizado:    ${gitDe(['log','-1','--format=%cs'])} · ${id} en PHASE ${destino} …`;
```

```
$ grep -n "fHandoff|HANDOFF.md" tracker.mjs   →  sólo `avanzar` lo escribe
```

**`avanzar` es el único que estampa el estado, y estampa sólo al cambiar de fase.** Cualquier
trabajo legítimo en `changes/` que no sea una transición deja el estado atrás **sin vía sancionada
para refrescarlo**:

- escribir el `discovery`/`strategy` de las tareas siguientes mientras corre un CI
- escribir una **parada** — que es lo que `FDGE-R55` exige, y hoy ocurrió tres veces
- corregir la prosa de un intake ya escrito

Es `CE-006` en su forma exacta: **el acto existe sólo empaquetado con otro**, así que se hace a mano
o no se hace. Hoy se hizo **a mano** para desbloquear el PR, declarado en el `HANDOFF` como lección
`-30`.

## 3. Lo que lo hace defecto y no descuido

El propio código lo dice de su antecesor:

> *«FALTABA, y lo dijo la CI en rojo — la **TERCERA** vez que `SUITE-R34` caza este patrón en la
> sesión. El comando **VIOLABA POR CONSTRUCCIÓN** la regla que dice que el estado viaja con el
> trabajo.»* — `tracker.mjs:3792`

`PT-158` arregló que **`avanzar`** la violara. **No arregló que `avanzar` fuera el único camino.**
El patrón sigue vivo y aparece cuando el trabajo **no** es una transición.

## 4. Y una segunda mitad: el verde local no lo predice

Este paso ya falló antes en esta épica, y las dos veces por algo que el verde local no veía: la
primera porque `verify` no corría lo mismo que CI (`PT-201`), ésta porque `SUITE-R34` se mide
**sobre lo commiteado**. `PT-201` añadió el aviso *«MEDIDO SOBRE LO COMMITEADO»* — **y aun así
volvió a pasar**, porque el aviso aparece cuando ya decidiste commitear.

## 5. Qué NO entra   `OUT`

- **Quitar `SUITE-R34`.** La regla es correcta y su rojo de hoy fue **verdad**.
- **Un hook de `pre-commit`**: no corre en CI, se salta con `--no-verify`, y hay que instalarlo.
- **Reescribir el `HANDOFF` automáticamente.** Su prosa es lo único del estado que no se deriva
  (`LEX-R26`), y estamparla sería inventar.

## 6. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | Existe una vía **sancionada** de sellar el estado **sin** cambiar de fase | `TS-01` |
| `AC-02` | El sello sigue siendo **derivado**: fecha de git, hecho del registro. Nada escrito a mano | `TS-02` |
| `AC-03` | La prosa del `HANDOFF` **no se toca** (`LEX-R26`) | `TS-03` |
| `AC-04` | Queda decidido si **`changes/` es la medida correcta**, o si la regla mide el sitio y no el hecho | `TS-04` |

`AC-04` no es retórico: escribir el análisis de la tarea siguiente **es** trabajo, pero no deja el
estado irrecuperable — el `HANDOFF` no tiene nada nuevo que decir sobre él. Si la regla bloquea por
**dónde** ocurrió y no por **qué** ocurrió, eso es `CE-001`, y decidirlo es parte de la tarea.

## Cómo termina   `FDGE-R53`

> Termina cuando: cumplir `SUITE-R34` no exija salirse de la herramienta, y lo que la regla mide
> esté decidido en vez de heredado.

## 7. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-30
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la del lote. `G3` sigue siendo humana para todo `BUG` (`EXEC-R05`).

## 8. Origen   `FDGE-R55`

Parada de `EP-026` · motivo `condicion-bloqueante` · `changes/EP-026-lo-que-da-verde-sin-mirar/paradas/PT-205.md`
