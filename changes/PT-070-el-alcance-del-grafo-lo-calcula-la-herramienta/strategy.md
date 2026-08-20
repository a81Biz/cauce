# PT-070 — Estrategia   `PHASE 3`

## El criterio es el CONTENIDO, no el nombre

Excluir un directorio porque se llama `docs` es un proxy — la misma clase de error que `PT-085`
corrige en `SUITE-R34` y en `FDGE-R43`. Lo que decide es **si contiene código propio**.

Con tres excepciones nombradas, y cada una con su motivo:

| Fuera | Por qué |
|:---|:---|
| `evidence/` | salidas guardadas de una tarea: fixtures, y `FND-R28` ya los excluye por concepto |
| `_archive/` | historia guardada, no el sistema |
| `docs/methodology/` **en proyectos ajenos** | es la suite instalada: marco de terceros, como `node_modules` |

## El alcance baja hasta donde vive el código

Tomar el primer segmento daba `docs`, que arrastra todo. Se sube desde cada archivo hasta el
directorio que lo contiene y se colapsan los descendientes: si `a/b` y `a/b/c` están, sobra
`a/b/c`.

Resultado en cauce: `bin` y `docs/methodology/tools` — **exactamente** lo que `PT-020` escribió a
mano. Esa coincidencia es la validación: la derivación reproduce el juicio humano que la precedió.

## Lo que se descartó

**Declarar el alcance en el `CLAUDE.md`.** Sería un dato más que mantener a mano, y el problema
era precisamente que estaba escrito a mano en el registro. `FND-R28` dice qué debe cubrir el
grafo; derivarlo es cumplirla, no parametrizarla.
