# PT-052 — Estrategia   `PHASE 3`

## Objetivo

Que el estado de una tarea en curso sea **legible por máquina** y esté **atado al commit del
código**, sin crear una fuente nueva.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Un `checkpoint.md` en prosa | Es lo que ya son las notas de reanclaje. El hueco no es que falte prosa |
| Añadir campos a `REGISTRY.json` | El registro **asigna** (`SUITE-R08`); es la autoridad, no el diario. Meterle el estado transitorio de una sesión mezcla lo permanente con lo efímero |
| Un ledger append-only de checkpoints | `SUITE-R09` lo haría **irreversible**, y esto es mecánica de sesión. La forma del marco ya existe: `HANDOFF.md` se sobrescribe, `HISTORY.log` se apila |
| Un `CHECKPOINT.json` por tarea, en `changes/PT-NNN-slug/` | El estado en curso es **uno**: el de la tarea que se está tocando. N archivos, N−1 mintiendo |
| Guardar lo que el agente recuerda | `RULE-06`. Un campo que solo puede rellenar la memoria es un campo que va a mentir |
| **Uno solo, sobrescrito, con cada campo derivado** | Es una **vista** de fuentes que ya existen, con la forma que una máquina puede leer |

## Solución

`docs/implementation/CHECKPOINT.json` — **uno**, sobrescrito, y todos sus campos derivados:

```
pt · type · phase · status · epic · rama     REGISTRY.json
sha · sha_corto                              git rev-parse HEAD
sucio · archivos                             git status --porcelain
compuerta · produce · siguiente              la tabla FASES de tracker, ya derivada
generado                                     el reloj de git, no el del agente
```

**Ningún campo que solo pueda rellenar la memoria.** Si un dato no se puede derivar, no entra — es
la línea que separa esto de la especificación que motivó `EP-015`, donde `estimated_used: 67`
pedía una cifra que nadie puede medir.

### Transitorio arriba, permanente abajo

```
CHECKPOINT.json     estado ACTUAL, se sobrescribe        como HANDOFF.md
SESSION_LOG.md      las transiciones, se apilan          como HISTORY.log
```

No se crea un ledger nuevo. La forma que el marco ya usa es la correcta, y `SUITE-R09` explica por
qué: hacer permanente lo que es mecánica de sesión llena de cadáveres un archivo que no se puede
limpiar.

### El SHA se comprueba, no se cree

`AC-04` exige que el SHA sea **alcanzable**, no que tenga forma de SHA. Un checkpoint que apunta a
un commit inexistente miente con la autoridad de un dato estructurado — y **el que no existe se
nota; el que miente, no**.

Es el germen de `STATE_MISMATCH` (`EP-015`): aquí solo se exige que el SHA sea real. Que el **árbol
corresponda** a ese SHA es del lote siguiente, y decirlo ahora evita que parezca ya resuelto.

## El nombre va a `LEXICON` antes que al código

`LEX-R21` y `SUITE-R00`: los nombres canónicos viven en `LEXICON.md`. Introducir `CHECKPOINT.json`
solo en `tools/` sería un nombre nacido fuera, y eso es un defecto declarado, no un descuido.

**Es el primer `spec-changes` no vacío del lote.** Las tres tareas anteriores declararon «ninguno»
porque solo hacían ejecutable lo escrito; ésta **añade vocabulario**, y el lote deja de poder
cerrarse como si no hubiera tocado la metodología.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| `SUITE-R33`/`R34` sobre `HANDOFF.md` | No se toca. El checkpoint **no** lo sustituye: uno responde por el proyecto, otro por la tarea |
| `verify-suite`, que exige que los nombres vivan en `LEXICON` | El nombre entra ahí **antes** que al código. Caso propio |
| El `.gitignore` | `CHECKPOINT.json` **se versiona**: sin él, el estado no viaja y la tarea no sirve para nada |
| `tracker siguiente` | Se **reutiliza** para derivar «lo siguiente». Si divergieran habría dos respuestas a la misma pregunta |
| Un checkpoint de otra tarea | Es **uno**: escribirlo sobre otra tarea lo sustituye, que es lo correcto y hay que decirlo |

## Criterios de éxito, derivados de los AC

- `AC-01` → declara tarea, fase, rama, SHA, archivos y siguiente acción
- `AC-02` → se sobrescribe; no se apila
- `AC-03` → todo campo sale de git o del registro
- `AC-04` → el SHA declarado **existe**
- `AC-05` → el nombre está en `LEXICON` antes que en el código

## Autorrevisión

**El riesgo es meter un campo que solo pueda rellenar la memoria.** La especificación de la que
sale `EP-015` está llena de ellos —`estimated_used`, `decisions`, `blockers`— y todos suenan
útiles. El criterio que los deja fuera es mecánico: **si no se deriva, no entra**, y lo que haga
falta y no se pueda derivar se declara como hueco en vez de rellenarse.

El segundo riesgo es que el checkpoint parezca resolver `STATE_MISMATCH`. No lo hace: pone el SHA
que lo hará posible. Está dicho aquí y en el `out-of-scope` para que `EP-015` no herede una
promesa.

Contradicciones: ninguna. `AC` sin cubrir: ninguno.
