# PT-046 — Estrategia   `PHASE 3`

## Objetivo

Que una entrada de `HISTORY.log` escrita mal se pueda corregir **sin editarla** y sin desactivar
ninguna regla.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Editar las cuatro entradas, con autorización humana registrada | Resuelve estas cuatro y **deja el callejón intacto**: la quinta vuelve a pedir permiso. Un arreglo que hay que repetir no es un arreglo |
| Relajar `FDGE-R34` para aceptar el formato condensado | El canónico está en `FDGE-Implementation.md`; las entradas son las que se desvían. Ajustar el verificador al defecto es cómo un formato deja de existir |
| Un archivo aparte, `HISTORY-CORRECCIONES.log` | Dos ledgers para un mismo hecho es lo que `SUITE-R35` y `SUITE-R38` prohíben. Auditar exigiría leer los dos y saber que existen |
| Marcar la entrada mala con un comentario HTML | No es corregir: es anotar. La comprobación seguiría leyendo el campo que falta |
| **Una entrada `CORRIGE` que la comprobación prefiere** | Es lo que `SUITE-R09` ya prescribe, y `REVERTIDO` ya demuestra que el patrón funciona |

## Solución

```
## PT-NNN — CORRIGE: <qué se corrige>
Corrige: la entrada de AAAA-MM-DD
Motivo: <por qué la original no cumple>
<campos corregidos, en formato canónico>
```

Tres cambios, ninguno nuevo de concepto:

```
1 · LEXICON     «CORRIGE» entra como encabezado canónico, junto a «REVERTIDO»
2 · FDGE-R29    admite las entradas CORRIGE, igual que ya admite las de revert
3 · verify-fdge las descuenta del recuento y PREFIERE la ultima al comprobar G4
```

**La original no se toca y sigue siendo la que se lee para auditar.** `CORRIGE` no la sustituye
en el relato: la completa para la comprobación. Quien audite ve las dos y ve que hubo un error —
que es exactamente lo que `SUITE-R09` protege y lo que editar habría borrado.

## Por qué `MINOR` y no `MAJOR`

`FDGE-R29` se **amplía**: lo que pasaba antes sigue pasando, y lo que fallaba —una segunda
entrada— ahora tiene una forma legítima. Ningún proyecto instalado en `7.6.0` se rompe, ningún
artefacto hay que rehacer. Un `MAJOR` aquí sería cobrar una migración por una puerta que se abre.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| El recuento de `FDGE-R29` sobre las 32 entradas existentes | `verify-fdge --all` tras el cambio: ninguna tiene `CORRIGE`, el descuento es 0 y nada cambia |
| El descuento de `REVERTIDO`, que comparte la línea | Caso propio: una entrada `REVERTIDO` sigue sin contar |
| `FDGE-R44` (`Estructural:`), que también lee `entries[0]` | Debe preferir la corrección igual que `FDGE-R34`, o corregir el `Estado:` dejaría el `Estructural:` leyéndose de la entrada vieja |
| Una `CORRIGE` **huérfana**, sin original | Tiene que fallar y decirlo: si no, sería una vía para inventar una entrada donde no hubo trabajo |
| Dos `CORRIGE` sobre el mismo PT | Se prefiere la **última**: corregir una corrección es legítimo y append-only |
| `regla --fallos` | El mensaje nuevo cita `FDGE-R29`, así que aparece solo en la lista derivada |

## Criterios de éxito, derivados de los AC

- `AC-01` → una entrada `CORRIGE` existe y `FDGE-R29` no la rechaza
- `AC-02` → la original sigue byte a byte igual; lo dice `git`, no yo
- `AC-03` → `--gate G4` pasa en `PT-039`…`PT-042` leyendo la corrección
- `AC-04` → una `CORRIGE` sin original falla con su regla

## Autorrevisión

Contradicción con `SUITE-R09`: **ninguna**, es su propio mecanismo. Con `FDGE-R36` (revert):
ninguna, son encabezados distintos y se descuentan por separado. `AC` sin cubrir: ninguno.
`RULE-nn` de `11-Conventions`: sin tocar.

**Riesgo que asumo y digo:** `CORRIGE` abre la puerta a corregir un `Estado:` para que una
compuerta pase. La protección no es mecánica —no puede serlo—: es que la entrada original queda
a la vista con su motivo al lado, y `SUITE-R27` ya declara que lo mecanizable es que la
afirmación sea **contrastable**, no que sea sincera.
