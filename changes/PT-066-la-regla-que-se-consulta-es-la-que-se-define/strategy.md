# PT-066 — Estrategia   `PHASE 3`

## Opciones

| # | Opción | Por qué no / por qué sí |
|:--|:---|:---|
| A | Añadir `CHECK` al filtro de severidad | **Insuficiente.** Arregla 11 de 47 y deja las `EXEC-*` y las 26 que devuelven texto ajeno |
| B | Uniformar el formato de los tres documentos para que sean fáciles de parsear | **No.** `EXECUTION-MODES.md` escribe sus reglas en prosa **a propósito**: son compuertas y modos, no filas de tabla. Se arregla quien lee, no lo que está bien escrito |
| C | Reconocer la **definición** por documento, con el patrón propio de cada uno | **Sí.** Es la causa: la función no distingue definir de mencionar |
| D | Un índice generado de reglas → una copia más que divergiría | **No.** `SUITE-R38`: dos fuentes del mismo hecho divergen |

**Elegida: C.**

## Qué distingue una definición de una mención

Cada documento propietario tiene **una** forma de definir, y ninguna se parece a una mención:

```
RULES.md            la fila EMPIEZA por el ID:    ^| `ID` | SEVERIDAD |
LEXICON.md          idem
EXECUTION-MODES.md  el parrafo EMPIEZA por el ID: ^`ID` ·
```

Una mención, en cambio, aparece **dentro** del texto de otra regla. El ancla `^` es lo que
separa las dos cosas, y es lo que faltaba.

**La severidad deja de ser criterio.** Servía como filtro grosero para excluir menciones; con el
ancla ya no hace falta, y era justo lo que dejaba fuera a `CHECK` y a las `EXEC-*`.

## El mapa de propietarios no se escribe dos veces

`regla.mjs` ya tiene `DUENO`, y su comentario lo dice: *«El documento propietario se DERIVA del
prefijo, con el mismo mapa que verify-suite usa. Un segundo mapa escrito a mano divergiría
(`SUITE-R38`)»*. Se usa ese, no uno nuevo.

## El riesgo

**Dejar de encontrar reglas que hoy sí se encuentran.** Las 150 correctas no pueden romperse.

Se contiene con un caso que recorre **los 197 IDs definidos** y exige que cada uno devuelva
**su propia** definición — no que devuelva algo. Es la diferencia entre el caso que existía
(ninguno) y uno que prueba lo que dice.

## Alcance

```
docs/methodology/tools/regla.mjs   definicionDe(): el ancla por documento
docs/methodology/tools/selftest.sh el caso sobre los 197, y la inversa
```

Ninguna regla cambia. `CHANGELOG`: `PATCH`.
