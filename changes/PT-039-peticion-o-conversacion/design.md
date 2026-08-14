# PT-039 — Diseño   `PHASE 4` · `FDGE-R21`

`SUITE-R52` en `RULES.md`, y la sección de apertura en `build-core.mjs` — el núcleo es generado
y no se edita a mano (`SUITE-R16`).

```
PETICIÓN       tiene condición de terminado: «termina cuando: …»  (FDGE-R53)
               → abre PHASE 1, con lo pedido como origen
CONVERSACIÓN   no la tiene
               → produce una RESPUESTA. No una allocation, no compuertas
```

Una conversación **puede acabar** en petición; entonces lo conversado es su `origin`. No empieza
siéndolo.

Un caso comprueba el **orden**: `ANTES DE NADA` va antes que `LO PRIMERO`.

## Y el defecto que apareció usándolo

El filtro de `ROOT` en `tracker` excluía `PT-\d+` y no `EP-\d+`, así que `siguiente EP-011`
resolvía la ruta del proyecto como el directorio «EP-011». `PT-030` añadió la forma `EP-NNN` y no
tocó el filtro. Corregido aquí porque bloqueaba escribir este mismo intake.
