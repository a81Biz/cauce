# PT-031 — Descubrimiento   `PHASE 2` · `FDGE-R42`

`EXECUTION-MODES.md` §5 tiene la matriz de compuertas. Lo que debe variar entre modos es **quién
resuelve** y **cuándo se pide confirmación**. Nada más.

Al escribir la comprobación apareció el caso, en la primera ejecución:

```
| **G1 — DoR** | ACK humano | ACK humano | ACK humano (admite firma por lote, `INTAKE-R08`) |
```

La firma por lote figuraba como algo de `AUTONOMOUS`. **`INTAKE-R08` vale en los tres**, y
`EP-004`, `EP-005`, `EP-006` y `EP-007` la usaron en `SUPERVISED`. La matriz declaraba como
privilegio de un modo algo que el marco ya concedía a todos.

Una ventaja aparente de un modo es una vara de medir más floja esperando a que alguien la elija
sin decirlo — y quien la eligiera tendría razón según el documento.
