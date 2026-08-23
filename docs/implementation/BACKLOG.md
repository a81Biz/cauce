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

## Implementación abierta — `EP-020`

`EP-020` · **El acto fuera del comando: lo que ocurre en la conversacion no llega a ningun registro que se pueda contar** · `DRAFT` · issue [#218](https://github.com/a81Biz/cauce/issues/218).

| PT | Tipo | Sev | Estado | Fase | Issue | Qué resuelve |
|:---|:---|:---|:---|:---|:---|:---|
| PT-113 | BUG | S2 | DONE | 8 | [#217](https://github.com/a81Biz/cauce/issues/217) | La 12.0.1: la guia de migracion que se publico incompleta |
| PT-114 | BUG | S1 | DONE | 8 | [#232](https://github.com/a81Biz/cauce/issues/232) | El cuerpo del issue no se republica cuando aparece la ref durable |
| PT-115 | FEATURE | S1 | DONE | 8 | [#233](https://github.com/a81Biz/cauce/issues/233) | PARADA entra al vocabulario y a las reglas |
| PT-116 | FEATURE | S1 | DONE | 8 | [#234](https://github.com/a81Biz/cauce/issues/234) | tracker parada: el comando que escribe la parada en su tarea |
| PT-117 | FEATURE | S1 | DONE | 8 | [#235](https://github.com/a81Biz/cauce/issues/235) | Todo desenlace cita la parada que lo produjo |
| PT-118 | FEATURE | S1 | DRAFT | 1 | [#236](https://github.com/a81Biz/cauce/issues/236) | La taxonomia de clases de evento, cerrada, en LEXICON |
| PT-119 | FEATURE | S1 | DRAFT | 1 | [#237](https://github.com/a81Biz/cauce/issues/237) | tools/matriz.mjs deriva MATRIZ.md |
| PT-120 | BUG | S1 | DONE | 8 | [#238](https://github.com/a81Biz/cauce/issues/238) | publicar.yml no ejecuta sellar, y verify-fdge corre sin GH_TOKEN |
| PT-121 | BUG | S1 | DRAFT | 1 | [#239](https://github.com/a81Biz/cauce/issues/239) | El viaje de vuelta tras el merge no lo cubre ninguna fase |
| PT-122 | BUG | S2 | DRAFT | 1 | [#240](https://github.com/a81Biz/cauce/issues/240) | El cierre de un lote pasa por el comando, no por la mano |
| PT-123 | BUG | S1 | DONE | 8 | [#241](https://github.com/a81Biz/cauce/issues/241) | BACKLOG.md dice que se deriva del registro y nada lo deriva |
| PT-124 | BUG | S1 | DONE | 8 | [#242](https://github.com/a81Biz/cauce/issues/242) | tracker asignar rechaza tres de los cinco tipos que LEXICON declara |
| PT-125 | INVESTIGATION | S1 | DRAFT | 1 | [#243](https://github.com/a81Biz/cauce/issues/243) | Clasificar las 131 entradas cerradas en EVENTOS.jsonl |
| PT-126 | CHORE | S2 | DRAFT | 1 | [#244](https://github.com/a81Biz/cauce/issues/244) | sellar mide la matriz y FPGE la lee |
| PT-127 | BUG | S1 | VALIDATION_PENDING | 8 | [#245](https://github.com/a81Biz/cauce/issues/245) | Nada detecta el trabajo sin allocation: solo lo corta una persona |
| PT-128 | FEATURE | S1 | DONE | 8 | [#246](https://github.com/a81Biz/cauce/issues/246) | El cursor: donde estas, de donde vienes, a donde vas, y ningun nodo sin visitar |
| PT-129 | BUG | S2 | DONE | 8 | [#249](https://github.com/a81Biz/cauce/issues/249) | FDGE-R19 enumera tres niveles, el arbol tiene cuatro tipos, y nada compara las ramas reales |
| PT-130 | BUG | S2 | DRAFT | 1 | [#250](https://github.com/a81Biz/cauce/issues/250) | Una comprobacion cuyo alcance es todo el texto acusa a quien describe el hecho |
| PT-131 | BUG | S1 | DONE | 8 | [#252](https://github.com/a81Biz/cauce/issues/252) | SUITE-R57 cuenta el estado declarado en el tag, no el trabajo que el tag contiene |
| PT-132 | BUG | S1 | DONE | 8 | [#253](https://github.com/a81Biz/cauce/issues/253) | abrir crea el issue ANTES de guardar el registro, y una interrupcion duplica |
| PT-133 | BUG | S2 | DONE | 8 | [#254](https://github.com/a81Biz/cauce/issues/254) | parada exige plataforma para escribir en TRANSICIONES.log |
| PT-134 | CHORE | S3 | DEFERRED | 1 | — | No hay forma de declarar un AC caido: o se finge verde o bloquea |

**14 de 22 cerradas.** Las cifras salen del registro: no se transcriben (`PT-091`).

## Aplazado — 2 allocation(s) `DEFERRED`

`SUITE-R44` · aplazar algo lo **pone** en el tablero, no lo saca.

| Id | Tipo | Issue | Por qué sigue fuera |
|:---|:---|:---|:---|
| PT-025 | CHORE | [#35](https://github.com/a81Biz/cauce/issues/35) | el adaptador de Azure existe pero no hay proyecto que lo use; escribir la guarda a ciegas seria codigo sin ejecucion |
| PT-134 | CHORE | — | Aplazado por PT-113: AC-06 decayo con el reanclaje a la 13.0.0 y el marco no tiene forma de declararlo. FDGE-R15 exige T |

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
