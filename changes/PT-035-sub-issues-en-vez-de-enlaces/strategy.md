# PT-035 — Estrategia   `PHASE 3`

`anidamientosQueFaltan(allocations, yaAnidados)` pura: cruza la jerarquía del registro con lo que
la plataforma ya tiene y devuelve **solo lo que falta**.

**`null` no es «no hay».** Si la plataforma no sabe responder qué hay anidado bajo un lote, ese
lote no se evalúa: afirmar que le falta todo produciría una tormenta de llamadas contra un dato
que no se tiene (`RULE-06`).

Se aplica **también a lo ya cerrado**: el árbol se mira después de cerrar, y un lote cerrado
sigue siendo el padre de sus tareas.

La lista del cuerpo se **conserva**: sirve para leer el lote de un vistazo. Lo que cambia es que
además hay estructura.
