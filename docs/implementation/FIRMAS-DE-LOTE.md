# Firmas de lote certificadas   `INTAKE-R08` · `PT-203`

> **Firmar no es silenciar.** Cada fila de aquí **sigue apareciendo** en cada corrida, con quién la
> firmó, por qué, y **a qué tarea le toca corregirla**. Lo único que cambia es que deja de bloquear.
> Es el mismo contrato que `SECRETOS-EXCEPCIONES.md` (`FND-R29`), y por el mismo motivo: una
> compuerta siempre roja enseña a saltársela.

## Por qué existe este archivo

`PT-203` cambió de dónde sale la pertenencia a un lote: la asigna el **registro** (`SUITE-R08`), no
la tabla del intake. Al hacerlo, `INTAKE-R08` —`HARD`, bloquea— empezó a cubrir **62 tareas que
nunca cubrió**. Medido sobre los 26 lotes: `EP-019` leía **cero** de sus diecisiete; `EP-024`,
cuatro de veintiocho.

De esas 62, **26 no cumplen** y **todas están en estado terminal**. Ponerles la línea hoy sería
reescribir trabajo cerrado para callar una comprobación: `SUITE-R09` es append-only y `CE-014`
nombra justo esto —una regla que juzga hacia atrás—.

**No se retrofecha, y tampoco se deja colgando.** Se certifica, se sella, y la corrección tiene
dueño: **`EP-027`**.

## Qué cubre una fila, y qué no

- Cubre **un identificador concreto en un lote concreto**, en estado **terminal**. Si esa tarea
  volviera a estar viva, la fila no la exime: lo vivo bloquea siempre.
- **No cubre a nadie que no esté escrito.** Una tarea nueva sin la línea de firma sale en rojo,
  esté o no su lote en esta tabla.
- **No es un permiso sobre el lote**: es una lista cerrada, enumerada y contable.

## La tabla

|  | Lote que le asigna el registro | Qué le falta | Firmada por | Fecha | Corrige |
|:---|:---|:---|:---|:---|:---|
| `PT-032` | `EP-008` | sin intake en el arbol | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-152` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-153` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-154` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-156` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-157` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-158` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-162` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-165` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-166` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-170` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-171` | `EP-024` | sin intake en el arbol | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-172` | `EP-025` | su intake firma por EP-024 | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-173` | `EP-025` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-174` | `EP-025` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-175` | `EP-025` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-176` | `EP-025` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-177` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-178` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-180` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-182` | `EP-025` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-183` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-184` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-185` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-186` | `EP-024` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |
| `PT-189` | `EP-025` | sin la linea de firma de lote | Alberto Martínez | 2026-08-29 | `EP-027` |

**26 filas.** La lista se **derivó** del registro y del árbol, no se transcribió a mano.

## `PT-172` no es lo mismo que las demás, y por eso lo dice su fila

Las 25 restantes **no llevan la línea**. `PT-172` **sí la lleva, y nombra otro lote**: su intake
dice `EP-024` y el registro dice `EP-025`. Nadie lo veía porque `RE_SIGN_BATCH` capturaba el lote
y lo **tiraba**, mientras el mensaje lo **nombraba** — la comprobación afirmaba más de lo que
miraba. `PT-203` la hace comparar; esta fila certifica el hecho hasta que `EP-027` decida cuál de
las dos fuentes está mal.

## Constancia de la firma   `SUITE-R27` · `INTAKE-R08`

**Estas filas las escribió el agente, no la persona que firma.** La autorización es explícita y
citable, pedida **después** de que la medición apareciera y **antes** de tocar el archivo:

> «necesitamos corregir o certificar y sellar, no podemos dejar pendientes menos una deuda tan
> grande. De ser necesario ponlos en una épica que atacaremos al terminar ésta»
> — Alberto Martínez, 2026-08-29

El agente **no firmó por precedente**. El `VoBo` del 2026-08-28 cubre `G1`, `G2` y `G3` de `EP-026`
y **no** cubría certificar trabajo de lotes anteriores: extenderlo solo habría sido el
deslizamiento que `SUITE-R27` describe. Se midió, se reportó la cifra, y se pidió la decisión.

**Lo que la hace defendible además de autorizada:** la lista es **cerrada y enumerada**, todas sus
filas están en estado terminal, ninguna cubre trabajo vivo, y la corrección **tiene dueño con
identificador** — `EP-027`, que se ataca al cerrar `EP-026`. Certificar no cierra la deuda: la
hace contable y le pone plazo.
