# PT-046 — Descubrimiento   `PHASE 2` · `2-B`

## Qué falla, con archivo y línea

```bash
$ node docs/methodology/tools/verify-fdge.mjs --gate G4 PT-039
  ✗ FDGE-R34   PT-039: la entrada de HISTORY.log no declara "Estado:".
```

Igual en `PT-040`, `PT-041` y `PT-042`.

| Dónde | Qué dice |
|:---|:---|
| `tools/verify-fdge.mjs:1127` | `entry.match(/^Estado:\s*(\w+)/m)` — exige `Estado:` al principio de línea |
| `tools/verify-fdge.mjs:1130` | sin ese campo: `fail('FDGE-R34')` y `return` |
| `tools/verify-fdge.mjs:1124` | la entrada que lee es `entries[0]` — **la primera**, siempre |
| `tools/verify-fdge.mjs:1082` | `entries.length - reverted.length > 1` ⇒ `fail('FDGE-R29')` |
| `FDGE-Implementation.md:441-442` | el formato canónico pone `Fecha:` y `Estado:` en **líneas separadas** |
| `HISTORY.log`, entradas de `PT-039`…`PT-042` | `Fecha: 2026-08-14 · Estado: DONE · Severidad: …` en **una** línea |

Las entradas son las que se desvían del formato canónico. El verificador tiene razón.

## Por qué no es un typo

Porque **no hay forma escrita de corregirlo**. Tres reglas, correctas por separado:

```
SUITE-R09   «Append-only es literal. Un artefacto declarado append-only nunca se reescribe.
             Corregir un error pasado se hace con una entrada nueva QUE LO REFERENCIA,
             no editando la anterior.»
FDGE-R29    HISTORY.log recibe EXACTAMENTE UNA entrada por PT.
verify-fdge lee entries[0], la primera, aunque hubiera una segunda.
```

`SUITE-R09` **ya prescribe el mecanismo** —una entrada nueva que referencia a la anterior— y
`FDGE-R29` lo prohíbe. La regla transversal dice cómo corregir y la regla de componente cierra la
puerta. No hace falta inventar nada: hace falta que `FDGE-R29` diga lo que `SUITE-R09` ya implica.

## Ya existe la excepción, y prueba que el patrón cabe

`verify-fdge.mjs:1076` no cuenta las entradas de revert:

```js
const reverted = [...hist.matchAll(new RegExp(`^##\\s+${pt}\\s+—\\s+REVERTIDO`, 'gm'))];
if (entries.length - reverted.length > 1) fail('FDGE-R29', …);
```

`FDGE-R36` obliga a añadir una entrada nueva al revertir, y `FDGE-R29` la admite porque la
comprobación la descuenta **por su encabezado**. La corrección es el mismo patrón con otra
palabra. No es una excepción nueva: es la segunda instancia de una que ya funciona.

## Alcance real, medido

```
entradas con «Fecha: … · Estado: …» en una linea   PT-039 PT-040 PT-041 PT-042
entradas con «Estado:» en su propia linea          las 28 restantes
```

Cuatro entradas, todas de `EP-011`, todas ya `INTEGRATED` en `main`.

## Lo que este descubrimiento NO puede afirmar

Que sean las únicas cuatro que fallarán. `FDGE-R34` comprueba `Estado:`; el formato canónico
declara ocho campos más —`Severidad`, `Complejidad`, `Track`, `Lote`, `Rama`, `Modo`,
`Objetivo`, `Solución`— y **ninguno se comprueba**. Una entrada puede omitirlos todos y pasar.
Eso no se arregla aquí: se dice, porque `RULE-06` prefiere el hueco declarado al silencio.

## El tablero ya lo sabía

`PT-029` (#40), abierto en `EP-008`: *«buscar más choques entre reglas: una comprobación que hace
imposible el estado que otra obliga a atravesar»*. Tres lotes sin un solo ejemplo. Este es el
primero, y no lo encontró la búsqueda que `PT-029` proponía — lo encontró **chocar contra él**.
