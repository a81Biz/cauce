# PT-091 — Tareas   `PHASE 4`

| # | Qué | Archivo |
|---:|:---|:---|
| 1 | `cifrasTranscritas` · `cifrasQueMienten` · `recuentosDeClaude` | `docs/methodology/tools/patrones.mjs` |
| 2 | Acción `inventario [--aplicar]`, con su **ancla** de commit | `docs/methodology/tools/tracker.mjs` |
| 3 | `inventario` entra en `SIN_PLATAFORMA` | `docs/methodology/tools/tracker.mjs` |
| 4 | `checkInventario` — avisa y dice cómo arreglarlo | `docs/methodology/tools/verify-fdge.mjs` |
| 5 | Las 8 cifras, reescritas **por el generador** | `docs/enterprise-documentation/inventory/services.md` |
| 6 | 12 casos, sección propia | `docs/methodology/tools/selftest.sh` |

## `3` lo trajo la batería, no el plan

`inventario` recalcula cifras del árbol y **no espeja nada**, pero la guarda de plataforma se
dispara antes del despacho. Exigirle una credencial para leer `wc -l` dejaría sin arreglo a un
proyecto sin tablero — **el caso que `SUITE-R22` declara soportado y que `PT-084` defendió**.

## `5` se hace con el generador, no a mano

Es el criterio `AC-05` y no una preferencia: corregirlas a mano sería repetir el arreglo que
`H-006` ya vio caducar una vez.
