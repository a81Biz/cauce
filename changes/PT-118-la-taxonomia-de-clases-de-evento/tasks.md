# Tareas — `PT-118`   `PHASE 5`

| # | Qué | Dónde | Estado |
|:---|:---|:---|:---|
| 1 | `LEXICON` §4.4: la tercera clase, con `LEX-R31` y `LEX-R32` | `LEXICON.md` | ✔ |
| 2 | Las diecisiete filas `CE-001`..`CE-017`, cada una con su enunciado | `LEXICON.md` | ✔ |
| 3 | El párrafo del prefijo, con lo medido y con el riesgo latente encontrado | `LEXICON.md` | ✔ |
| 4 | Filas de `RIGE_DESDE` para `LEX-R31` y `LEX-R32` | `tools/patrones.mjs` | ✔ |
| 5 | Las dos reglas citadas en documento operativo | `PHASES.md` · `FDGE-Prompts.md` | ✔ |
| 6 | La comprobación de `LEX-R32`, que **falla** | `tools/verify-suite.mjs` | ✔ |
| 7 | La derivación al núcleo, y su `SIN EVALUAR` | `tools/build-core.mjs` | ✔ |
| 8 | Los catorce casos, negativo incluido | `tools/selftest.sh` | ✔ |

---

## Los tres defectos que aparecieron construyéndolo

**1 · La frase que afirmaba más de lo medido.** `LEXICON` decía que todas las expresiones de una
letra iban ancladas. `verify-ptsa.mjs:203` no lo está. La frase se escribió antes de terminar de
mirar; el caso, al construirlo, la desmintió. Ahora el texto dice lo medido y **declara** lo
encontrado.

**2 · `CORE.md` no llevaba la taxonomía, y `AC-04` estaba en rojo de verdad.** `build-core`
compila reglas: `LEX-R31` y `LEX-R32` llegaban, la tabla no. El arreglo no fue copiarla al
generador —eso es `CE-008`, la copia que diverge, dentro de la herramienta que existe para que el
núcleo no sea una copia— sino **derivarla**.

**3 · La prueba inversa daba `REVISAR` en escenarios correctos.** El fixture copiaba la suite
plana; `build-core` no encontraba sus fuentes, se negaba a compilar, y `CORE.md` se quedaba como
estaba. La supresión no se notaba porque **nada llegó a correr**: `CE-005`, verde por no haber
mirado, dentro de la prueba que existe para evitarlo.
