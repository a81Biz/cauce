# BACKLOG — PTs vivos y su fase actual

Regenerable desde `REGISTRY.json`. No asigna identificadores (`SUITE-R08`): los lee.

> Regenerado el 2026-08-18 al cerrar `PT-060` en `PHASE 8`.
> mano. Este archivo llevó ocho lotes sin regenerarse y llegó a declarar un estado de tres
> versiones atrás; y `REFACTOR_SCOPE.md`, editado a mano, acabó con catorce filas pegadas en una
> línea. La conclusión de los dos casos es la misma: **un índice que se escribe a mano diverge, y
> solo hace falta tiempo.**

> **Lo de dentro de las marcas lo escribe `tracker indices --aplicar`** y se reescribe entero
> (`PT-123`). Lo de fuera es prosa humana: el **porqué** del orden y del solapamiento, que no
> sale de ningún campo y es lo más valioso que tiene este archivo (`LEX-R26`).

<!-- BACKLOG:DERIVADO -->

## Implementación abierta — `EP-021`

`EP-021` · **Un aplazado entra al tablero y ningun comando puede sacarlo: DEFERRED no tiene transicion de vuelta** · `READY` · issue [#270](https://github.com/a81Biz/cauce/issues/270).

| PT | Tipo | Sev | Estado | Fase | Issue | Qué resuelve |
|:---|:---|:---|:---|:---|:---|:---|
| PT-134 | CHORE | S3 | DRAFT | 1 | [#255](https://github.com/a81Biz/cauce/issues/255) | No hay forma de declarar un AC caido: o se finge verde o bloquea |
| PT-137 | BUG | S1 | VALIDATION_PENDING | 8 | [#263](https://github.com/a81Biz/cauce/issues/263) | DEFERRED no tiene transicion de vuelta: ningun comando lo saca y todo comando de estado exige un intake que un aplazado no tiene |
| PT-138 | BUG | S2 | DRAFT | 1 | [#264](https://github.com/a81Biz/cauce/issues/264) | SUITE-R44 pone el aplazado en el tablero y no exige condicion de reentrada, fecha de revision ni dueno |
| PT-139 | BUG | S2 | DRAFT | 1 | [#265](https://github.com/a81Biz/cauce/issues/265) | Nada mide la edad de un aplazado: uno de ayer y uno de hace meses son indistinguibles en el tablero |
| PT-140 | BUG | S2 | DRAFT | 1 | [#266](https://github.com/a81Biz/cauce/issues/266) | tracker proyectar arranca un linaje nuevo en silencio si falta refs/heads de la rama de proyeccion |
| PT-141 | BUG | S2 | DRAFT | 1 | [#267](https://github.com/a81Biz/cauce/issues/267) | El catch de SUITE-R56 referencia una variable inexistente: el comando revienta, tapa el fallo real y deja efecto a medias |
| PT-142 | BUG | S3 | DRAFT | 1 | [#268](https://github.com/a81Biz/cauce/issues/268) | Nada compara el nombre de una rama con lo que ramaDeTarea deriva: type y slug inventados pasan la topologia |
| PT-143 | BUG | S3 | DRAFT | 1 | [#269](https://github.com/a81Biz/cauce/issues/269) | asignar toma el primer argumento en mayusculas como prefijo, asi que --tipo BUG crea BUG-001 |

**0 de 8 cerradas.** Las cifras salen del registro: no se transcriben (`PT-091`).

## Aplazado — 1 allocation(s) `DEFERRED`

`SUITE-R44` · aplazar algo lo **pone** en el tablero, no lo saca.

| Id | Tipo | Issue | Por qué sigue fuera |
|:---|:---|:---|:---|
| PT-025 | CHORE | [#35](https://github.com/a81Biz/cauce/issues/35) | el adaptador de Azure existe pero no hay proyecto que lo use; escribir la guarda a ciegas seria codigo sin ejecucion |

<!-- /BACKLOG:DERIVADO -->

---

## El porqué — lo que no se deriva

`EP-015` · **La continuidad de sesión** · `IN_PROGRESS` ·
issue [#90](https://github.com/a81Biz/cauce/issues/90).

**`PT-056` va primera y no es preferencia.** Es el único hueco que `EP-014` dejó **a medias** —el
`sha` se comprueba alcanzable, no correspondiente— y todo lo que viene detrás confía en que el
checkpoint diga la verdad.

**`PT-058` va antes que `PT-059`** porque una compuerta que decide sobre cifras sin saber de qué
tipo son **es** el `estimated_used: 67` que `LEX-R26` dejó fuera.

**Solapamiento** (`FDGE-R40`): `tools/tracker.mjs` lo tocan **cuatro** tareas y `LEXICON` tres.
Ejecución **secuencial**; ningún par en paralelo.

`SUITE-R44` · aplazar algo lo **pone** en el tablero, no lo saca.

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
