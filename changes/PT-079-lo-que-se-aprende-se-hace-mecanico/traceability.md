# PT-079 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | El enlace apunta a un ref durable | E1 · E3 | | | - | PENDIENTE |
| AC-02 | El ref es el del **contenido**, derivado | E2 · E4 | | | - | PENDIENTE |
| AC-03 | Los 14 enlaces rotos quedan arreglados | E5 | | | - | PENDIENTE |
| AC-04 | **Falla** si un issue vivo enlaza a una rama inexistente | E5 · E6 | | | - | PENDIENTE |
| AC-05 | `proyectar` registra el SHA del contenido | E7 | | | - | PENDIENTE |
| AC-06 | La proyección **se publica** y no depende de acordarse | E14 | | | - | PENDIENTE |
| AC-07 | Una inversa que no revierte **aborta** | E8 · E9 | | | - | PENDIENTE |
| AC-08 | Una aserción anclada sólo en un ID **se señala** | E10 · E11 | | | - | PENDIENTE |
| AC-09 | Un caso que usa un helper posterior **se señala** | E12 | | | - | PENDIENTE |
| AC-10 | La regla está en los **cinco** sitios | E13 · E14 · E15 · E16 | | | - | PENDIENTE |
| AC-11 | Lo no comprobable queda declarado | `TD-16` | | | - | PENDIENTE |
| AC-12 | La inversa está hecha y **cae de verdad** | inversa | | | - | PENDIENTE |

## Los tres que impiden el falso positivo

`E3` —no inventar enlace—, `E6` —no acusar a un issue cerrado— y `E11` —no señalar una aserción
correcta— **siguen pasando en la inversa**. Si cayeran, el arreglo estaría rompiendo trabajo
válido: el fallo que `PT-075` `AC-06` prohíbe y que ya cometí dos veces en este lote.

## `AC-10` no se puede partir

Los cinco sitios son un solo criterio, no cinco. Una regla sin fase que la cite no se abre; una
fase sin verificador no se cumple; y un manual que no la menciona hace que quien llega nuevo
nunca la ejecute — que es exactamente por lo que la proyección lleva sin publicarse desde
`PT-054`.

## `AC-12` es la primera inversa del lote que no depende de mi memoria

Se ejecuta con la guarda de `AC-07`. Lo motiva que en `PT-074` se me olvidó el `assert` y la
inversa **dio verde en los tres casos** sin revertir nada.
