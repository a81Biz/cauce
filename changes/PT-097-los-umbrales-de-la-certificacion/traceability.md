# PT-097 — Trazabilidad `FDGE-R15`

| AC | Criterio | Caso | Evidencia | Estado |
|:---|:---|:---|:---|:---|
| AC-01 | `§24.2` define la base con cifras ya declaradas | `la especificacion define la clasificacion base` · `Health 95 da A` · `Health 79.9 da B` · `Health 55 da F` | `salidas/selftest-completo.txt` · `salidas/inversa.txt` | VERIFICADO |
| AC-02 | `§24.4` consolida los cuatro topes, cada uno citando su origen | `…y los topes que la rebajan` · los cuatro casos de tope | `salidas/selftest-completo.txt` · `salidas/inversa.txt` | VERIFICADO |
| AC-03 | La función es determinista: misma entrada, misma letra | los siete casos de banda y tope, todos partiendo de `health: 95` | `salidas/inversa.txt` | VERIFICADO |
| AC-04 | Falta un dato ⇒ no hay letra, y se dice cuál falta | `sin Confidence no hay letra` | `salidas/inversa.txt` | VERIFICADO |
| AC-05 | `verify-ptsa` contrasta la letra publicada y falla si difiere | `verify-ptsa contrasta la certificacion` · `verify-ptsa lee el frontmatter que el RESUMEN escribe` | `salidas/verify-ptsa.txt` | VERIFICADO |
| AC-06 | La batería falla **sin** el arreglo | la prueba inversa, cambio a cambio | `salidas/inversa.txt` | VERIFICADO |
| AC-07 | La `B` recalculada y su banda inventada retirada | `el RESUMEN no publica una banda inventada` | `salidas/verify-ptsa.txt` | VERIFICADO |
| AC-08 | `CORE-PTSA.md` regenerado por `build-core` | `npm run core:check` | `salidas/core-check.txt` | VERIFICADO |

## Los cuatro casos de tope parten todos de `health: 95`

No es casualidad ni comodidad: **sin tope, `95` da `A`**. Si un tope no se aplicara, su caso
devolvería `A` en vez de la letra rebajada y fallaría.

Eso es lo que prueba que el `min` de `D-3` **funciona** y no sólo está escrito. Un caso que
partiera de un `Health` ya bajo pasaría igual con el tope roto — y sería un caso que no puede
fallar, que es la trampa que `PT-096` documentó.

## `AC-04` tiene un solo caso, y es el freno

`sin Confidence no hay letra` es lo que impide que `S-3` sea una frase en un documento. Sin él, la
función podría inventarse una letra ante un hueco y nadie lo notaría — que es literalmente el
defecto que esta tarea corrige, un nivel más abajo.

## `AC-06` no es un caso: es la inversa

Su evidencia es `salidas/inversa.txt` con el recuento **por cambio retirado**. Si al retirar uno no
cae nada, ese cambio no está probado **y se reporta**.

## Ocho casos no estarán en rojo válido, y se dice

`letraDeCertificacion` no existe hoy, así que su fallo previo es «la herramienta reventó», que este
arnés trata —con razón— como «no verifica nada». `FDGE-R17` pide un rojo que falle **por su
aserción**.

**Son especificación de comportamiento nuevo, no reproducción del defecto.** Los **cuatro** que sí
son rojos válidos son `TS-01`, `TS-02`, `TS-04` y `TS-05` — los que comprueban que las secciones
faltan, que el verificador no mira, y que la banda inventada está publicada.

Va escrito también en `selftest.sh`, no sólo aquí.

## `CasoQA` — por qué no hay columna

`FQAGE` verifica en un navegador real que una persona puede usar el sistema. Aquí el producto es
una especificación y una función de línea de comandos. Se dice en vez de dejar una columna vacía
que parecería un olvido (`SUITE-R11`).
