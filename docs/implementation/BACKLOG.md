# BACKLOG — PTs vivos y su fase actual

Regenerable desde `REGISTRY.json`. No asigna identificadores (`SUITE-R08`): los lee.

> Regenerado el 2026-08-15 en `PHASE 8` de `PT-029`, la última tarea de `EP-013`. Cada fila se **deriva** del registro
> —`id`, `type`, `severity`, `status`, `phase`, `epic`, `issue`, `title`— y no se edita a mano.
> Este archivo llevó ocho lotes sin regenerarse y llegó a declarar un estado de tres versiones
> atrás con la misma seguridad que si fuera el de hoy; y `REFACTOR_SCOPE.md`, editado a mano,
> acabó con catorce filas pegadas en una línea. La conclusión de los dos casos es la misma:
> **un índice que se escribe a mano diverge, y solo hace falta tiempo.**

## Implementación — `EP-013`

`EP-013` · **El tablero queda limpio** · `DONE` · **8.0.0** ·
issue [#73](https://github.com/a81Biz/cauce/issues/73) — esperando `G4`.

| PT | Tipo | Sev | Estado | Fase | Issue | Qué es |
|:---|:---|:---|:---|:---|:---|:---|
| PT-047 | BUG | S3 | DONE | 9 | [#69](https://github.com/a81Biz/cauce/issues/69) | Rama por PT de verdad: `FDGE-R19` declara la topología y `verify-fdge` la mira |
| PT-015 | CHORE | S4 | DONE | 9 | [#22](https://github.com/a81Biz/cauce/issues/22) | Verificadores para las HARD que deciden algo y no tenían ninguno |
| PT-016 | CHORE | S4 | DONE | 9 | [#23](https://github.com/a81Biz/cauce/issues/23) | `phase` obligatoria, con migración. **Rompe compatibilidad: MAJOR** |
| PT-048 | BUG | S3 | DONE | 9 | [#70](https://github.com/a81Biz/cauce/issues/70) | El issue de un `DEFERRED` dice lo que hay en vez de enlazar a lo que no hay |
| PT-017 | CHORE | S4 | DONE | 9 | [#24](https://github.com/a81Biz/cauce/issues/24) | `migrate` deriva «qué llega nuevo» comparando paquete y destino |
| PT-020 | CHORE | S3 | DONE | 9 | [#27](https://github.com/a81Biz/cauce/issues/27) | El grafo cubre el código propio; las tres expectativas, contrastadas |
| PT-023 | CHORE | S2 | DONE | 9 | [#32](https://github.com/a81Biz/cauce/issues/32) | El texto copiable dice lo que la regla dice, y el verificador de `FDGE-R22` se descarta con su cifra |
| PT-029 | CHORE | S2 | DONE | 9 | [#40](https://github.com/a81Biz/cauce/issues/40) | `G1`, `G2` y `G3` se pueden evaluar, y la **forma** del choque queda cazada |

Las **ocho** están integradas en `trabajo` (PRs #74–#81). Las cuatro filas de cierre del lote,
resueltas. `G4` es **una por lote**
(`FDGE-R19`, `EXEC-R03`): el PR de una tarea a `trabajo` es revisión, no `G4`.

`PT-047` fue **primera** y no por preferencia: cambia cómo se ejecutan las otras siete.

## Aplazado — 2 allocations `DEFERRED`, las dos con su issue abierto

`SUITE-R44` · aplazar algo lo **pone** en el tablero, no lo saca. Y desde `PT-048`, el cuerpo de
su issue dice que aún no tiene artefactos en vez de enlazar a un directorio que no existe.

| PT | Tipo | Sev | Issue | Por qué sigue fuera |
|:---|:---|:---|:---|:---|
| PT-019 | CHORE | S2 | [#26](https://github.com/a81Biz/cauce/issues/26) | Depende del proyecto legado «Inteligencia de Mercados Energéticos Mexicanos», y lo trabaja el firmante. Cierra cuando vaya allí |
| PT-025 | CHORE | S3 | [#35](https://github.com/a81Biz/cauce/issues/35) | No hay proyecto de Azure que lo ejercite. Escribir la guarda a ciegas sería código sin ejecución |

Los dos motivos son distintos y conviene no mezclarlos: uno espera a un proyecto que existe,
el otro a uno que no.

### Lo que este listado hace visible

`PT-046` fue el primer caso concreto de `PT-029`, abierto tres lotes antes con esas mismas
palabras. `PT-044` lo fue de `PT-016`. `PT-020` acaba de encontrar el segundo caso de `PT-029`
—`--gate G3` exige en `PHASE 7` lo que `PHASE 8` escribe— sin buscarlo. El patrón se repite: **el
caso aparece antes que el alcance**, y el original sigue abierto mientras sus casos se cierran.

## Lotes cerrados

`EP-001` a `EP-012`. `EP-011` en `main` desde `af79c6b` (**7.6.0**); `EP-012` desde `c983b05`
(**7.7.0**).

## Lo siguiente

**`G4`.** El pull request de `trabajo` a `main`, que es donde se resuelve. Lo abre y lo fusiona
el firmante (`SUITE-R42`, `EXEC-R04`, `SUITE-R06a`): el agente lo **describe** y se detiene.

Publicar está **pendiente por decisión humana explícita**: «no publicamos aún porque nos falta
algo más». Publicar es `SUITE-R06g` y no se automatiza.
