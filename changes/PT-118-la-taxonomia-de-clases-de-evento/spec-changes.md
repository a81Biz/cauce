# `PT-118` — Cambios de especificación   `PHASE 4`

> `SUITE-R06e`: modificar `docs/methodology/` **no se automatiza** — se propone aquí y se
> resuelve en `G2`.

---

## `LEXICON.md` · §4.4 nueva — el documento propietario

| | |
|:---|:---|
| **Antes** | §4 tiene **dos** clases de identificador: de trabajo (§4.1) y de regla (§4.2). Una clase de evento no es ninguna, y no tiene sitio |
| **Después** | §4.4 declara la **tercera**: `CE-NNN`, con las diecisiete filas medidas en `EP-020` §2.1, cada una con su enunciado en una frase |

## `LEXICON.md` · `LEX-R31` nueva — HARD

| | |
|:---|:---|
| **Antes** | `LEX-R04` dice que la asignación es **exclusivamente** vía `REGISTRY.json`. Una clase que no sale de ahí lo contradice **en silencio** |
| **Después** | La excepción se **enuncia**, con su motivo: `counters` cuenta trabajo, y meter una taxonomía en el asignador haría que el número de una clase dependiera del orden en que alguien la escribió |

**Es la única excepción a `LEX-R04`**, y se dice así. Una excepción declarada es contrastable;
una implícita es una divergencia esperando a ocurrir — el defecto que la v3 tuvo cuatro veces.

## `LEXICON.md` · `LEX-R32` nueva — HARD

| | |
|:---|:---|
| **Antes** | — |
| **Después** | La lista es **cerrada por versión**. Citar un `CE-NNN` que §4.4 no declara es un defecto que `verify-suite` **bloquea**. Ampliarla es modificar `docs/methodology/` (`SUITE-R06e`) |

**Falla, no avisa.** Sin esto, `LEX-R31` sería una sugerencia y en dos versiones habría un
`CE-018` escrito de memoria y otro escrito contando filas — la avería que `LEX-R04` impide en los
identificadores de trabajo, repetida en la clase recién creada para no repetir cosas.

## `PHASES.md` y `FDGE-Prompts.md` · citan, no legislan

`PHASE 8` gana una línea en el formato canónico de `HISTORY.log`: `Clase de evento: CE-NNN`,
citando `LEX-R31` y `LEX-R32` por ID. Ningún documento de procedimiento enuncia la obligación
(`LEX-R22`, `LEX-R21`).

## `tools/patrones.mjs` · `RIGE_DESDE`

`LEX-R31` y `LEX-R32` entran con `[13, 0, 0]`. Sin fila, regirían sobre trabajo escrito antes de
existir (`SUITE-R09`) — es `CE-014`, y la comprobación de `SUITE-R19` lo dijo antes de que se
publicara.

## Lo que **no** cambia

`LEX-R04` sigue rigiendo íntegro para los identificadores de trabajo: único, monotónico,
permanente, asignado desde el registro. `LEX-R31` no lo deroga: declara qué queda fuera de su
alcance y por qué.

## Autoridad

`LEX-R21` · `LEXICON` es el primero en el orden de autoridad, y §4 ya es el sitio de los
identificadores. `LEX-R23` · el ID se define en un documento y los demás citan.
