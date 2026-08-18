# PT-050 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `--solo` filtra en las **dos** puertas, `chk` y `chkno` | las dos llevan la guarda |
| E2 | AC-01 | El filtro va **antes** de ejecutar el comando del caso | un caso descartado no lanza nada |
| E3 | AC-02 | Con `--solo`, la salida lleva **dos** cifras | «N de M casos» |
| E4 | AC-02 | Sin `--solo`, la salida es la de siempre | una sola cifra |
| E5 | AC-02 | El universo sube **fuera** de la guarda del filtro | el denominador no depende del filtro |
| E6 | AC-03 | Un patrón que no casa nada | **rojo**, con un mensaje que lo diga |
| E7 | AC-03 | `--solo` sin valor | error explícito: un patrón vacío casaría con todo |
| E8 | AC-04 | `--solo` no acaba en el directorio de trabajo | el parseo consume su valor |
| E9 | AC-04 | El patrón casa **literal**, no como expresión regular | sin escapes |
| E10 | AC-01 | `--solo` y `-q` a la vez | ortogonales: uno elige cuáles, otro cuánto se imprime |

## Lo que ningún caso puede comprobar

**Que el ahorro sea suficiente.** Está **medido** —205 s → ~95 s, un 55 %— y el techo lo fijan las
181 reconstrucciones del fixture, no el filtro. Que 95 s baste para iterar cómodo es un juicio.

Y como en `PT-049`, varios casos comprueban la **forma** del código de `selftest` en vez de su
comportamiento: ejecutar la batería dentro de la batería triplicaría su coste. La ejecución real
de `--solo` —con sus dos cifras, y con el patrón que no casa nada en rojo— va en la evidencia,
capturada a mano.

Es un límite declarado, y **el mismo que `PT-049`**. Que se repita en dos tareas seguidas es en sí
un dato: mientras `selftest` no pueda probarse a sí mismo barato, este límite reaparecerá en cada
tarea que lo toque.
