# PT-033 — Diseño   `PHASE 4` · `FDGE-R21`

`build-core.mjs` inserta la sección **antes** de `## Fases`:

```
## LO PRIMERO — el estado sale del tablero, no de tu memoria   SUITE-R49
    node docs/methodology/tools/tracker.mjs siguiente
```

Va en el generador, no en `CORE.md`: el núcleo es generado y no se edita a mano (`SUITE-R16`).

`SUITE-R49` en `RULES.md` define **consultado** — el comando, la caducidad de un turno, la
precedencia de la salida sobre el recuerdo, y el `SIN EVALUAR`. `PHASES.md` y `FDGE-Prompts.md`
la **citan**.

Un caso comprueba el **orden**: la sección tiene que aparecer antes que `## Fases`. Si un día
alguien la mueve detrás, falla — porque detrás se lee cuando ya se decidió.
