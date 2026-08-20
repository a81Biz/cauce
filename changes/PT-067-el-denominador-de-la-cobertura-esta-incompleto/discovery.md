# PT-067 — Descubrimiento   `PHASE 2`

## Lo medido, no lo recordado

`audit` publica hoy:

```
ejecutadas por una compuerta   114 / 183     · HARD 91 / 150
citadas sin compuerta            9
sin verificador                 60
```

Las tres cifras se apoyan en un denominador que **no es el universo de reglas del marco**.

## Defecto 1 · el denominador deja fuera 40 reglas

`REGLAS_TODAS` sale de **una sola línea** en [audit.mjs:435](docs/methodology/tools/audit.mjs#L435):

```js
const REGLAS_TODAS = [...RULES.matchAll(/^\|\s*`([A-Z]+-R\d+[a-z]?)`\s*\|\s*(HARD|SOFT|CHECK)\s*\|/gm)]
```

Sólo lee **filas de tabla de `RULES.md`**. Contado sobre los tres documentos propietarios:

| Documento | Reglas que define | ¿Entran en el denominador? |
|:---|---:|:---|
| `RULES.md` (filas con severidad) | 183 | sí |
| `LEXICON.md` | 26 | **no** |
| `EXECUTION-MODES.md` (`EXEC-*`) | 14 | **no** |
| **universo real** | **223** | |

Entre las 40 invisibles está `EXEC-R04` —merge humano en los tres modos— y `EXEC-R07` —describir
el comando, no ejecutarlo—, que son dos de las obligaciones más citadas del marco.

**No es el mismo bug que `PT-066`, es su gemelo.** Aquel arreglaba a quien *consulta* una regla;
éste, a quien las *cuenta*. Los dos leían `RULES.md` como si fuera el único documento
propietario, y `LEX-R21` dice que son tres.

## Defecto 2 · cualquier mención cuenta como verificador

[audit.mjs:438](docs/methodology/tools/audit.mjs#L438):

```js
const citadaPor = tools.filter(([, t]) => t.includes(id))
```

`t.includes(id)` no distingue una comprobación de un comentario. Medido:

| | Cuántas | Qué significa |
|:---|---:|:---|
| citadas **sólo** por `selftest.sh` | **5** | el arnés prueba las herramientas; no es una compuerta |
| sin ninguna cita **fuera de un comentario** | **20** | el ID aparece explicando por qué se hizo algo |

Las cinco del arnés: `SUITE-R22` · `SUITE-R37` · `SUITE-R41` · `SUITE-R50` · `SUITE-R54`.

Y entre las 20 que sólo viven en comentarios está **`FDGE-R17`** —los tests primero, en rojo—,
que `PT-079` acaba de declarar no comprobable en `TD-16`. `audit` la cuenta como cubierta. Es la
peor combinación posible: una regla que **sabemos** que no se verifica, publicada como verificada.

También `SUITE-R41` —«cauce se instala sobre sí mismo»—, que es la premisa de toda esta sesión.

## Por qué importa, más allá de la cifra

`SUITE-R26` dice que la cobertura **aspira, no exige**: nadie falla por tener 114 en vez de 223.
Pero una cifra inflada **apaga la aspiración** — mide 62 % donde lo real ronda el 44 %, y lo que
no se ve no se prioriza. Es `RULE-06` aplicado a una métrica: «no lo sé» convertido en «sí».

## Lo que NO es un defecto

Las **20 filas `PTSA-R*`** de `RULES.md` que quedan fuera de los 183 usan otra forma de tabla y
**ya se auditan** en su propio bloque, contra las 80 de la especificación. Excluirlas está bien;
lo que faltaba era decirlo.

## Hallazgo colateral · tres reglas definidas dos veces   → `PT-080`

Midiendo el universo aparecieron **tres IDs definidos en dos documentos**, y **los tres ya
divergen** — siempre en la misma dirección: la copia de `EXECUTION-MODES.md` suelta una
obligación.

| Regla | `RULES.md` exige | La copia **omite** |
|:---|:---|:---|
| `FDGE-R22` | «Solo para `severity: S1`» y las cinco fases retroactivas | **las dos** — deja el carril HOTFIX abierto a un `S3`, y ese carril difiere `G2` y `G3` |
| `FDGE-R40` | los PTs que comparten archivos **se serializan** | la serialización |
| `FDGE-R41` | **el `EP-NNN` pasa a `BLOCKED`** | la transición de estado |

Es exactamente la enfermedad que `CLAUDE.md` describe de la v3 —«la misma regla escrita a mano en
cuatro documentos, y las cuatro copias divergieron»— viva en la v9. `verify-suite` **no la ve**.

Va a `PT-080` y no aquí (`SUITE-R44`): esta tarea arregla **la medida**, y aquello es un defecto
de los documentos y de `verify-suite`.
