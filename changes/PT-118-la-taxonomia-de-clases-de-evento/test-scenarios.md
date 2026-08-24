# Escenarios de test — `PT-118`

> `FDGE-R17`: rojo primero, y **válido**.

| TS | Escenario | Esperado |
|:---|:---|:---|
| `TS-01` | `LEXICON` declara `CE-NNN` como clase de identificador | aparece en §4.4 |
| `TS-02` | …y dice explícitamente que **no** se asigna desde `REGISTRY.json` | la frase está |
| `TS-03` | …con regla propia, `LEX-R31` | el ID está definido en `LEXICON` |
| `TS-04` | …declarándose **excepción** a `LEX-R04` | la excepción se enuncia, no se supone |
| `TS-05` | El prefijo `CE` no aparece en las tablas §4.1 ni §4.2 | `PREFIJO LIBRE` |
| `TS-06` | Ninguna herramienta busca un `E-\d+` **suelto** que cazaría dentro de `CE-001` | `NINGUNA E SUELTA` |
| `TS-07` | El riesgo latente que **sí** existe queda declarado | `verify-ptsa.mjs:203` aparece en `LEXICON` |
| `TS-08` | Las diecisiete clases están declaradas | `17` |
| `TS-09` | …y la última es la que faltaba en la matriz | `CE-017` |
| `TS-10` | …y ninguna fila se queda sin enunciado | `TODAS CON ENUNCIADO` |
| `TS-11` | …y la lista **no se promete completa** | la frase está |
| `TS-12` | La taxonomía llega a `CORE.md` | `CE-016` aparece en el núcleo |
| `TS-13` | Citar un `CE-099` que `LEXICON` no declara **falla** | el ID aparece en la salida |
| `TS-14` | …y es **error**, no aviso | `ERRORES` |

---

## Los que existen porque algo estuvo a punto de pasar

**`TS-06` y `TS-07`** — la primera redacción de `LEXICON` afirmaba que *«las que buscan `E-\d+`,
`P-\d+`, `H-\d+` o `U-\d+` van todas ancladas»*. **Es falso**: `verify-ptsa.mjs:203` usa
`/H-\d+/` sin anclar. La frase se escribió antes de terminar de mirar, y lo delató el propio caso
al construirlo. Ahora `TS-06` mide **lo que la frase afirma** —que no hay una `E` suelta— y
`TS-07` comprueba que lo que la medición **sí** encontró está declarado en vez de callado.

**`TS-13` y `TS-14`** son el negativo. Sin ellos, `TS-01`..`TS-12` sólo prueban que un texto está
escrito; nada probaría que la lista puede **impedir** algo. Con ellos, `LEX-R32` es una regla y no
una recomendación.

---

## Prueba inversa

| Se quita | Qué se pone rojo |
|:---|:---|
| §4.4 de `LEXICON` | `TS-01`..`TS-11` — no queda ninguna clase declarada |
| …y además | el núcleo dice `SIN EVALUAR` en vez de callar — `TS-12` |
| la comprobación de `LEX-R32` en `verify-suite` | `TS-13` `TS-14` — el `CE` inventado pasa sin ruido |
| la derivación en `build-core` | `TS-12` — la taxonomía no llega al núcleo |

Tres supresiones, cuatro rojos. Ninguno sale cero.

### Y la prueba inversa tuvo su propio defecto

Las dos primeras corridas dieron `REVISAR` en escenarios que estaban bien: el fixture copiaba la
suite **plana**, `build-core` no encontraba `docs/methodology/` ni `PTSA/`, se negaba a compilar,
y `CORE.md` se quedaba **como estaba** — así que la supresión parecía no tener efecto. Es
`CE-005`, verde por no haber mirado, dentro de la prueba que existe para evitarlo. Está escrito
en el propio script.
