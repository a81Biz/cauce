# BACKLOG — PTs vivos y su fase actual

Regenerable desde `REGISTRY.json`. No asigna identificadores (`SUITE-R08`): los lee.

> Regenerado el 2026-08-14 al cerrar `EP-012`. Antes de eso llevaba **ocho lotes sin
> regenerarse** —`PHASE 8` paso 3— y declaraba `EP-003` abierta, `PT-009` y `PT-010` en
> `DONE` y «publicar `6.0.1`» como lo siguiente: un estado de tres versiones atrás, escrito con
> la misma seguridad que si fuera el de hoy.

## Implementación

`EP-012` · **El marco se cierra a sí mismo** · `DONE` ·
issue [#71](https://github.com/a81Biz/cauce/issues/71) — esperando `G4`.

| PT | Tipo | Sev | Estado | Issue |
|:---|:---|:---|:---|:---|
| PT-044 | BUG | S2 | DONE | [#65](https://github.com/a81Biz/cauce/issues/65) |
| PT-045 | BUG | S2 | DONE | [#66](https://github.com/a81Biz/cauce/issues/66) |
| PT-046 | BUG | S2 | DONE | [#67](https://github.com/a81Biz/cauce/issues/67) |

Las tres con `G1`, `G2` y `G3` firmadas **por delegación con constancia**. Pasan a
`INTEGRATED` tras el merge (`FDGE-R35`).

**Solapamiento** (`FDGE-R40`): `PT-046` ↔ `PT-044` comparten `tools/verify-fdge.mjs` y
`tools/selftest.sh` — **serializados**, y en ese orden porque `PT-044` no tenía solución
honesta sin `PT-046`. `PT-045` no comparte ningún archivo.

## Aplazado — 10 allocations `DEFERRED`, todas con su issue abierto

`SUITE-R44` · aplazar algo lo **pone** en el tablero, no lo saca.

| PT | Tipo | Sev | Issue | Qué es |
|:---|:---|:---|:---|:---|
| PT-019 | CHORE | S2 | [#26](https://github.com/a81Biz/cauce/issues/26) | Comprobar que CUALQUIER proyecto legado se puede migrar, y ejecutar la migracion de referencia |
| PT-023 | CHORE | S2 | [#32](https://github.com/a81Biz/cauce/issues/32) | Auditar si PT-018 declaro mas cambios de especificacion que no hizo |
| PT-029 | CHORE | S2 | [#40](https://github.com/a81Biz/cauce/issues/40) | Buscar mas choques entre reglas: una comprobacion que hace imposible el estado que otra obliga a atravesar |
| PT-020 | CHORE | S3 | [#27](https://github.com/a81Biz/cauce/issues/27) | Ampliar el alcance del grafo a docs/methodology/tools/ (TD-01) |
| PT-025 | CHORE | S3 | [#35](https://github.com/a81Biz/cauce/issues/35) | Comprobar el orden de cierre tambien en el adaptador de Azure |
| PT-047 | BUG | S3 | [#69](https://github.com/a81Biz/cauce/issues/69) | PHASE 5 manda crear rama por PT y los 43 PT de este repositorio se implementaron sobre trabajo |
| PT-048 | BUG | S3 | [#70](https://github.com/a81Biz/cauce/issues/70) | El cuerpo del issue de una allocation DEFERRED enlaza a un directorio que no existe |
| PT-015 | CHORE | S4 | [#22](https://github.com/a81Biz/cauce/issues/22) | Escribir verificador para las reglas HARD que hoy no tienen ninguno |
| PT-016 | CHORE | S4 | [#23](https://github.com/a81Biz/cauce/issues/23) | Decidir si `phase` pasa a ser obligatoria, y añadirla a la plantilla TAREA.md |
| PT-017 | CHORE | S4 | [#24](https://github.com/a81Biz/cauce/issues/24) | migrate: derivar la lista de «qué llega nuevo» comparando paquete y destino |

### Lo que este listado hace visible

`PT-046` fue el primer caso concreto de `PT-029`, abierto tres lotes antes con esas mismas
palabras. `PT-044` lo fue de `PT-016`. Los dos originales **siguen abiertos**: sus casos se
resolvieron, su alcance no.

## Lotes cerrados

`EP-001` a `EP-012`. `EP-011` en `main` desde `af79c6b` (**7.6.0**); `EP-012` esperando
su `G4` (**7.7.0**).

## Lo siguiente

Publicar está **pendiente por decisión humana explícita**: «no publicamos aún porque nos falta
algo más». Publicar es `SUITE-R06g` y no se automatiza.
