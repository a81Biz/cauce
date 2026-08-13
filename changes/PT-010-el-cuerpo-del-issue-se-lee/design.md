# PT-010 — Diseño   `PHASE 4`

```js
cuerpoDeIssue(alloc, { url, rama, tareas }) → string
```

Pura y exportada. `url` y `rama` se derivan del remoto en el adaptador; `tareas` son las
allocations del lote cuando `alloc` es un `EP`.

## Qué dice cada cuerpo

**Tarea:** tipo · severidad · a qué implementación pertenece, con enlace a su issue. Y el
enlace absoluto al directorio del intake.

**Implementación:** que **es** una implementación —no «sin implementación»—, sin severidad
porque no la lleva, y **la lista de sus tareas** con su issue. Eso es lo que responde «de qué
va» sin salir de GitHub.

Los dos conservan la nota de que el issue **referencia** y no copia (`SUITE-R35`).

## Sin URL derivable

```
Intake y evidencia: changes/EP-003-el-issue-se-lee-solo/   (en el repositorio)
No se pudo derivar la URL del remoto, así que la ruta va sin enlace: inventarla
sería peor que no ponerla.
```

## Resolución de `G2`   `FDGE-R13`

```
Veredicto:    APROBADA · 2026-08-13 · Alberto Martínez · escrita por el agente POR DELEGACIÓN
Cubre SUITE-R06e para: docs/methodology/tools/tracker.mjs · selftest.sh
NO cubre: G3 —es un BUG (SUITE-R06b)— ni G4 ni la publicación.
```
