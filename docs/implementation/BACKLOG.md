# BACKLOG — PTs vivos y su fase actual

Regenerable desde `REGISTRY.json`. No asigna identificadores (`SUITE-R08`): los lee.

> Regenerado el 2026-08-15 en `PHASE 8` de `PT-051`. Cada fila se **deriva** del registro
> —`id`, `type`, `severity`, `status`, `phase`, `epic`, `issue`, `title`— y no se edita a mano.
> Este archivo llevó ocho lotes sin regenerarse y llegó a declarar un estado de tres versiones
> atrás con la misma seguridad que si fuera el de hoy; y `REFACTOR_SCOPE.md`, editado a mano,
> acabó con catorce filas pegadas en una línea. La conclusión de los dos casos es la misma:
> **un índice que se escribe a mano diverge, y solo hace falta tiempo.**

## Implementación abierta — `EP-014`

`EP-014` · **La fontanería de la transición** · `IN_PROGRESS` ·
issue [#89](https://github.com/a81Biz/cauce/issues/89).

| Orden | PT | Sev | Estado | Fase | Issue | Qué resuelve |
|:---|:---|:---|:---|:---|:---|:---|
| 1 | PT-049 | S3 | **DONE** | 8 | [#83](https://github.com/a81Biz/cauce/issues/83) | El verde se **cuenta**, no se enumera: `-q` con el recuento intacto. **541 → 2** y **507 → 47** |
| 2 | PT-050 | S3 | **DONE** | 8 | [#84](https://github.com/a81Biz/cauce/issues/84) | `selftest --solo <patrón>`: **209 → 138 s**, y las **cuatro** puertas cerradas |
| 3 | PT-051 | S4 | **DONE** | 8 | [#85](https://github.com/a81Biz/cauce/issues/85) | `regla <ID> --donde`: las **213 emisiones** con su línea, y las 62 sin verificador una a una |
| 4 | PT-052 | S2 | READY | 1 | [#86](https://github.com/a81Biz/cauce/issues/86) | `CHECKPOINT.json`: el estado en curso, estructurado y atado al SHA |
| 5 | PT-053 | S1 | READY | 1 | [#87](https://github.com/a81Biz/cauce/issues/87) | `tracker avanzar`: los cinco actos, atómicos, con la nota obligatoria |
| 6 | PT-054 | S2 | READY | 1 | [#88](https://github.com/a81Biz/cauce/issues/88) | `cauce/<usuario>`: la proyección **derivada** |

**El orden no es preferencia.** `PT-049` y `PT-050` cambian cómo se ejecutan las otras cuatro —la
misma lógica por la que `PT-047` fue primera en `EP-013`—. `PT-053` va después de `PT-052` porque
`avanzar` **escribe** el checkpoint, y definir el artefacto después de quien lo produce deja que
el formato lo decida la implementación.

**Solapamiento** (`FDGE-R40`): `tools/tracker.mjs` lo tocan **tres** tareas seguidas —`PT-052`,
`PT-053`, `PT-054`—. Es el más denso del lote y por eso van consecutivas. Ejecución **secuencial**;
ningún par en paralelo.

## Aplazado — 4 allocations `DEFERRED`, todas con su issue abierto

`SUITE-R44` · aplazar algo lo **pone** en el tablero, no lo saca.

| Id | Tipo | Issue | Por qué sigue fuera |
|:---|:---|:---|:---|
| EP-015 | EP | [#90](https://github.com/a81Biz/cauce/issues/90) | **Continuidad de sesión.** Depende de `PT-052` y `PT-053`: sin el checkpoint estructurado y sin la transición atómica no hay dónde evaluar el presupuesto ni de dónde derivar el handoff |
| EP-016 | EP | [#91](https://github.com/a81Biz/cauce/issues/91) | **Topología y multiusuario.** Depende de `PT-054`. Va último porque es el único que puede romper compatibilidad — `SUITE-R08`, `FDGE-R19`, `SUITE-R42`, `EXEC-R03` |
| PT-019 | CHORE | [#26](https://github.com/a81Biz/cauce/issues/26) | Depende del proyecto legado que trabaja el firmante. Cierra cuando vaya allí |
| PT-025 | CHORE | [#35](https://github.com/a81Biz/cauce/issues/35) | No hay proyecto de Azure que lo ejercite. Escribir la guarda a ciegas sería código sin ejecución |

Los cuatro motivos son distintos y conviene no mezclarlos: dos esperan a un lote que **va a
ocurrir**, uno a un proyecto **que existe**, y uno a un proyecto **que no**.

## Lotes cerrados

`EP-001` a `EP-013`. `EP-013` en `main` desde `2c20db8` (**8.0.0**), con `G4` resuelta el
2026-08-15 y **una excepción declarada**: `--gate G4` bloqueaba por las filas de cierre de
`EP-014` —no de `EP-013`, que estaba verde—. Se integró con ese rojo dicho, y el defecto quedó
abierto como `PT-055` (#94). `EP-011` en `main` desde `af79c6b` (**7.6.0**); `EP-012` desde `c983b05`
(**7.7.0**).

## Lo siguiente

`PT-052` · `CHECKPOINT.json`. Es la primera tarea del lote que **no** es fontanería de lectura:
empieza la parte que `EP-015` necesita para existir.

`EP-013` está **en `main`** desde `2c20db8` (**8.0.0**): `G4` resuelta el 2026-08-15.

Publicar sigue **pendiente por decisión humana explícita**, sostenida en cuatro lotes.
Es `SUITE-R06g` y no se automatiza.
