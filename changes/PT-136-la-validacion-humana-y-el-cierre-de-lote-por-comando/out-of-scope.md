# Fuera de alcance — `PT-136`

> `SUITE-R44` · La última columna es el destino, y es vocabulario cerrado.

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| **Decidir** por nadie | `FDGE-R26` reserva la validación de un `BUG` a una persona, y sigue reservada. El comando la **registra** | — |
| Reescribir las tres validaciones históricas hechas a mano | `SUITE-R09`: append-only. Están declaradas en el ledger | — |
| Una bandera para cerrar un lote con tareas vivas | Una compuerta que se salta con una bandera no es una compuerta (`EXEC-R03`) | — |
| Rellenar las 21 allocations sin `suite_version` | Se abrieron bajo versiones distintas —`PT-115` subió el lote a `13.0.0` a mitad— y estamparlas hoy sería **inventar** bajo cuál nació cada una (`RULE-06`). Queda como aviso medido de `SUITE-R18` | — |
| Que `validar` escriba en `HISTORY.log` | El ledger lo escribe `PHASE 8`, y una segunda fuente que escriba ahí sería la avería de `SUITE-R38` | — |

---

## Lo que esta tarea **produce** y no resuelve

Que el cierre de `EP-020` no haya necesitado escribir `REGISTRY.json` a mano **ni una vez**, después
de intentarlo. Lo que sigue abierto es todo lo que el lote dejó declarado: seis clases sin dueño,
`CE-002` con regla que no puede fallar, y once lecturas de alcance amplio.
