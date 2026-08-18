# BACKLOG — PTs vivos y su fase actual

Regenerable desde `REGISTRY.json`. No asigna identificadores (`SUITE-R08`): los lee.

> Regenerado el 2026-08-18 al cerrar `PT-056` en `PHASE 8`. Cada fila se **deriva** del registro y no se edita a
> mano. Este archivo llevó ocho lotes sin regenerarse y llegó a declarar un estado de tres
> versiones atrás; y `REFACTOR_SCOPE.md`, editado a mano, acabó con catorce filas pegadas en una
> línea. La conclusión de los dos casos es la misma: **un índice que se escribe a mano diverge, y
> solo hace falta tiempo.**

## Implementación abierta — `EP-015`

`EP-015` · **La continuidad de sesión** · `IN_PROGRESS` ·
issue [#90](https://github.com/a81Biz/cauce/issues/90).

| Orden | PT | Sev | Estado | Fase | Issue | Qué resuelve |
|:---|:---|:---|:---|:---|:---|:---|
| 1 | PT-056 | S1 | IN_PROGRESS | 7 | [#103](https://github.com/a81Biz/cauce/issues/103) | **`STATE_MISMATCH`**: que el árbol **corresponda** al `sha`, no solo que exista |
| 2 | PT-057 | S2 | READY | 1 | [#104](https://github.com/a81Biz/cauce/issues/104) | El coste de una tarea, **derivado** de las 56 cerradas |
| 3 | PT-058 | S1 | READY | 1 | [#105](https://github.com/a81Biz/cauce/issues/105) | `MEDIDO` / `ESTIMADO` / `SIN EVALUAR`: cada cifra declara **qué es** |
| 4 | PT-059 | S1 | READY | 1 | [#106](https://github.com/a81Biz/cauce/issues/106) | La compuerta `SAFE`/`MARGINAL`/`UNSAFE` y `BLOCKED_BY_CONTEXT` |
| 5 | PT-060 | S2 | READY | 1 | [#107](https://github.com/a81Biz/cauce/issues/107) | `SESSION.json` y el handoff **derivado** |

**`PT-056` va primera y no es preferencia.** Es el único hueco que `EP-014` dejó **a medias** —el
`sha` se comprueba alcanzable, no correspondiente— y todo lo que viene detrás confía en que el
checkpoint diga la verdad.

**`PT-058` va antes que `PT-059`** porque una compuerta que decide sobre cifras sin saber de qué
tipo son **es** el `estimated_used: 67` que `LEX-R26` dejó fuera.

**Solapamiento** (`FDGE-R40`): `tools/tracker.mjs` lo tocan **cuatro** tareas y `LEXICON` tres.
Ejecución **secuencial**; ningún par en paralelo.

## Aplazado — 3 allocations `DEFERRED`, todas con su issue abierto

`SUITE-R44` · aplazar algo lo **pone** en el tablero, no lo saca.

| Id | Tipo | Issue | Por qué sigue fuera |
|:---|:---|:---|:---|
| EP-016 | EP | [#91](https://github.com/a81Biz/cauce/issues/91) | **Topología y multiusuario.** Recibe de `PT-054` el mecanismo de proyección hecho; le faltan los rangos de ID y la identidad. Va último: es el único que puede romper compatibilidad |
| PT-055 | BUG | [#94](https://github.com/a81Biz/cauce/issues/94) | `--gate G4` exige las filas de cierre de **todos** los lotes abiertos, no del que evalúa. Tercer caso de la familia de `PT-029` |
| PT-019 | CHORE | [#26](https://github.com/a81Biz/cauce/issues/26) | Depende del proyecto legado que trabaja el firmante. Cierra cuando vaya allí |
| PT-025 | CHORE | [#35](https://github.com/a81Biz/cauce/issues/35) | No hay proyecto de Azure que lo ejercite. Escribir la guarda a ciegas sería código sin ejecución |

## Lotes cerrados

`EP-001` a `EP-014`. **`EP-014` en `main` desde `abab74b` (8.1.0)**, con `G4` resuelta el
2026-08-18 y **sin una sola excepción declarada** — a diferencia de `EP-013`, cuyo `G4` se integró
con un rojo dicho y dejó `PT-055` abierto.

`EP-013` en `main` desde `2c20db8` (**8.0.0**) · `EP-012` desde `c983b05` (**7.7.0**) · `EP-011`
desde `af79c6b` (**7.6.0**).

## Lo siguiente

`PT-056` · `PHASE 1` → `PHASE 2`. Desde `EP-014`, la transición se hace con **un comando**:

```bash
node docs/methodology/tools/tracker.mjs avanzar PT-056 --a 2 --nota "..."
```

Publicar sigue **pendiente por decisión humana explícita**, sostenida en cinco lotes.
Es `SUITE-R06g` y no se automatiza.
