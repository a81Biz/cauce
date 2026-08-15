# PT-029 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Detectar choques que no se derivan de cruzar fases con compuertas | — |
| Documentar `--gate G1`, `G2` y `G3` en `CLAUDE.md` y en la cabecera de la herramienta | — |
| Reescribir `FDGE-R23`, `FDGE-R25` o `FDGE-R29` | — |
| La entrada de `CHANGELOG` del lote y el número de versión | EP-013 |

**Las dos primeras filas llevan `—` a propósito y no es una omisión.**

La primera es el resultado de la tarea: la otra familia de choque —dos reglas que se contradicen
sin fases de por medio— **no es detectable** sin razonar sobre el contenido de las reglas, y queda
declarada en `test-scenarios.md` y en el `self-review`. No se aplaza a nadie porque no hay trabajo
que asignar: hay un límite que decir.

La segunda entra **dentro** de esta tarea: las tres compuertas dejan de ser inevaluables aquí, y
documentarlas es una línea en la cabecera de `verify-fdge.mjs`. Separarlo sería aplazar un
comentario.
