# BACKLOG — PTs vivos y su fase actual

Regenerable desde `REGISTRY.json`. No asigna identificadores (`SUITE-R08`): los lee.

> Regenerado el 2026-08-14 tras el cierre de `EP-011`. **Llevaba ocho lotes sin regenerarse**
> —`PHASE 8` paso 3— y declaraba `EP-003` abierta, `PT-009` y `PT-010` en `DONE` y «publicar
> `6.0.1`» como lo siguiente: un estado de tres versiones atrás, escrito con la misma seguridad
> que si fuera el de hoy. Queda anotado aquí porque es la clase de avería que este marco existe
> para eliminar.

## Implementación abierta

**Ninguna.** `EP-011` cerrado e integrado en `main` (`af79c6b`). `FDGE-R48` permite abrir una.

## En curso

**Nada.** Ningún PT en `DRAFT`, `READY`, `IN_PROGRESS`, `BLOCKED`, `VALIDATION_PENDING` ni
`DONE`.

## Aplazado — 11 allocations `DEFERRED`, todas con su issue abierto

`SUITE-R44` · aplazar algo lo **pone** en el tablero, no lo saca. Un `DEFERRED` queda exento de
las exigencias de artefactos de un PT en curso y vivo para el espejo.

| PT | Tipo | Sev | Issue | Qué es |
|:---|:---|:---|:---|:---|
| PT-044 | BUG | S2 | [#65](https://github.com/a81Biz/cauce/issues/65) | El YAML del intake declara una fase que el registro contradice |
| PT-045 | BUG | S2 | [#66](https://github.com/a81Biz/cauce/issues/66) | `npx @a81biz/cauce start` no arranca: el punto de entrada documentado falla |
| PT-046 | BUG | S2 | [#67](https://github.com/a81Biz/cauce/issues/67) | Una entrada de `HISTORY.log` mal formada bloquea `G4` y ninguna regla permite corregirla |
| PT-019 | CHORE | S2 | [#26](https://github.com/a81Biz/cauce/issues/26) | Comprobar que **cualquier** proyecto legado se puede migrar, y ejecutar la migración de referencia |
| PT-023 | CHORE | S2 | [#32](https://github.com/a81Biz/cauce/issues/32) | Auditar si `PT-018` declaró más cambios de especificación que no hizo |
| PT-029 | CHORE | S2 | [#40](https://github.com/a81Biz/cauce/issues/40) | Buscar más choques entre reglas: una comprobación que hace imposible el estado que otra obliga a atravesar |
| PT-020 | CHORE | S3 | [#27](https://github.com/a81Biz/cauce/issues/27) | Ampliar el alcance del grafo a `docs/methodology/tools/` (`TD-01`) |
| PT-025 | CHORE | S3 | [#35](https://github.com/a81Biz/cauce/issues/35) | Comprobar el orden de cierre también en el adaptador de Azure |
| PT-015 | CHORE | S4 | [#22](https://github.com/a81Biz/cauce/issues/22) | Escribir verificador para las reglas HARD que hoy no tienen ninguno |
| PT-016 | CHORE | S4 | [#23](https://github.com/a81Biz/cauce/issues/23) | Decidir si `phase` pasa a ser obligatoria, y añadirla a la plantilla `TAREA.md` |
| PT-017 | CHORE | S4 | [#24](https://github.com/a81Biz/cauce/issues/24) | `migrate`: derivar la lista de «qué llega nuevo» comparando paquete y destino |

### Lo que este listado hace visible

`PT-046` no es un hallazgo nuevo: es **el primer caso concreto de `PT-029`**, abierto hace tres
lotes con esas mismas palabras —«una comprobación que hace imposible el estado que otra obliga a
atravesar»— y sin un solo ejemplo hasta ahora. `PT-044` es el caso concreto de `PT-016`. Estaban
en el tablero y no se leyeron: exactamente el defecto que `SUITE-R49` describe.

## Lotes cerrados

`EP-001` a `EP-011`, los once `CLOSED`. El último, `EP-011` — el marco se usa a sí mismo — en
`main` desde `af79c6b`, versión **7.6.0**.

## Lo siguiente

Publicar la `7.6.0` está **pendiente por decisión humana explícita**: «no publicamos aún porque
nos falta algo más». Publicar es `SUITE-R06g` y no se automatiza.
