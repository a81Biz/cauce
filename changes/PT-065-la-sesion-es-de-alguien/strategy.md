# PT-065 — Estrategia   `PHASE 3`

## Lo que se construye

```
SESSION-<usuario>.json     la marca, una por persona
SESSION.json               sigue valiendo · un proyecto de una persona no cambia nada
tracker sesion             la propia · y DICE que hay otras
```

## La decisión: un archivo por persona

`PHASE 2` reprodujo el conflicto y comparó las dos salidas:

| | Conflicto en cada merge |
|:---|:---|
| Un archivo con N sesiones | **Sí** — dos personas escriben el mismo archivo |
| **Un archivo por persona** | **No** — nadie toca el de nadie |

Es la misma lógica que `PT-062` aplicó a los identificadores: **evitar la colisión por
construcción**, no resolverla mejor. Y aquí importa más, porque el conflicto sería en cada merge y
sobre algo que **no es trabajo**.

## Y no rompe `LEX-R26`

`CHECKPOINT.json` **es uno** porque responde por *la tarea en curso*: escribirlo sobre otra la
sustituye, y eso es correcto. `SESSION.json` responde por **una sesión**, y puede haber varias a la
vez — un archivo por sesión abierta no contradice nada.

Lo digo explícitamente porque la forma se parece y el criterio es distinto.

## Las ajenas **se ven**

`AC-06` y no es cosmético: si cada persona solo viera la suya, las dos creerían que trabajan solas
y ninguna entendería por qué las cifras no cuadran.

```
  sesion desde 6c0bc18 (2026-08-18)
    commits    12 (MEDIDO)
    …

  Otras sesiones abiertas:
    Bruno · desde e4c8cb1 (2026-08-18)
```

## Lo que NO cambia

**`sesionDe` y `handoffDeSesion` no se tocan.** Son puras y reciben la marca; no la leen. `PT-060`
las dejó bien y esta tarea solo cambia **de qué archivo** sale la marca.

**Lo que la sesión deriva ya está resuelto.** `PT-064` filtró el precedente y el techo por persona.
Aquí no hace falta nada.

**`HANDOFF.md` sigue intacto.** `AC-04` es el mismo criterio de `PT-060`: su prosa es lo único del
estado que no se deriva.

## Compatibilidad

Sin persona resuelta —o sin `personas` declaradas— la marca sigue siendo `SESSION.json`. Y al leer
se busca primero la propia; si no hay, se cae a `SESSION.json`. Un proyecto de una persona no ve
ninguna diferencia.

## El riesgo

Que se acumulen archivos de sesiones viejas. Una persona que abre sesión cada día deja un
`SESSION-<usuario>.json` que se sobrescribe — **uno por persona, no uno por día**, así que no
crecen. Lo que sí queda es el archivo de alguien que dejó el proyecto, y eso es un archivo, no un
problema: `tracker personas` ya dice quién está declarado.
