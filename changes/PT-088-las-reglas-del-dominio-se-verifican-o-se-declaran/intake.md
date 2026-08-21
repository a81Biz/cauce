# PT-088 — Las reglas que sostienen el dominio se verifican o se declaran

> Plantilla de **tarea dentro de una implementacion abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-018` (`INTAKE-R08`).

```yaml
---
id: PT-088
type: BUG
epic: EP-018
track: STANDARD
status: INTEGRATED
phase: 10
created: 2026-08-20
structural: no
suite_version: 10.0.0
severity: S1
---
```

## 1. Que se quiere   `[HUMANO]`

> «necesitamos auditar el sistema completamente para buscar, encontrar y eliminar cualquier riesgo
> que pudiera tener»

Origen: [`H-002`](../../PTSA/Findings/H-002.md) · `D1` · **ALTA**.

## 2. El hallazgo, medido

```
$ node docs/methodology/tools/regla.mjs SUITE-R01
  la comprueba  ningun verificador la emite con su nombre.
$ node docs/methodology/tools/regla.mjs SUITE-R09
  la comprueba  ningun verificador la emite con su nombre.
$ node docs/methodology/tools/regla.mjs EXEC-R04
  la comprueba  ningun verificador la emite con su nombre.
```

`SUITE-R01` es **la primera regla del marco** —«Evidence Before Action»— y la Declaracion de Valor
firmada dice que el dominio es *«que toda afirmacion tenga evidencia verificable»*.

## 3. El matiz que evita convertir esto en alarmismo

**El Acid Test de `P-003` PASA**, y hay que decirlo antes que nada:

```
CHECK (las que DECLARAN comprobacion): 20 · SIN verificador: 0
```

Y `SUITE-R26` dice literalmente que la cobertura **aspira, no exige**. Las 101 reglas sin
verificador no incumplen nada.

**El hallazgo es otro:** la rubrica esta puesta por debajo de la promesa. `SUITE-R01` no esta
marcada `CHECK`, asi que su ausencia de verificador es conforme. `PTSA-R17` —la Regla del Agua
Potable— dice que la correccion tecnica jamas compensa una falla de dominio.

## 4. Criterios de aceptacion

| | Criterio |
|:---|:---|
| `AC-01` | `SUITE-R09`: una comprobacion falla si un archivo append-only pierde lineas respecto de su version anterior en git |
| `AC-02` | …y **no** falla cuando solo se anaden lineas al final, que es el uso normal |
| `AC-03` | …y **no** falla cuando no hay repositorio o no hay version anterior: sin reloj no se inventa uno |
| `AC-04` | `EXEC-R04`: una comprobacion falla si la rama por defecto avanzo sin una entrada con nombre humano que lo autorice |
| `AC-05` | …y el nombre esta en `firmantes`, no es un nombre cualquiera (`SUITE-R27`) |
| `AC-06` | `SUITE-R01`: **o** queda descompuesta en obligaciones observables con su verificador, **o** queda en `NO-VERIFICABLES.md` con motivo y firma |
| `AC-07` | Las tres declaran su fila en `RIGE_DESDE`: reglas nuevas no rigen hacia atras (`PT-081`) |
| `AC-08` | `audit` clasifica las tres como `VERIFICADA` o `NO_VERIFICABLE`, ninguna como `PENDIENTE` |

**`AC-06` puede cerrarse por la via de la declaracion sin que cuente como fracaso.** Es la salida
que `PT-078` dejo montada, y forzar un verificador que no mide lo que dice seria exactamente el
defecto que `PT-087` corrige.

## 5. Que NO entra

```
OUT: las otras 98 reglas sin verificador. Entran tres porque sostienen el dominio, no porque
     falten. Escribir verificadores para subir 112/224 es fabricar verdes.
OUT: cambiar la severidad de SUITE-R01 a CHECK sin escribir antes lo que la comprueba.
     Marcar CHECK una regla que ningun script verifica es, con las palabras de RULES.md,
     «una promesa falsa».
```

## 6. Riesgo declarado

`AC-01` mira **lineas borradas**, no contenido. Un ledger cuyo texto se altere conservando el
numero de lineas pasaria. Es una comprobacion mas fuerte que ninguna y mas debil que un hash
encadenado; se declara aqui para que no se lea como mas de lo que es — y es, en pequeno, el
mismo compromiso que `PT-087` obliga a declarar.
## Condicion de cierre   `FDGE-R53`

Termina cuando: `audit` clasifica `SUITE-R09`, `EXEC-R04` y `SUITE-R01` como `VERIFICADA` o `NO_VERIFICABLE` —ninguna como `PENDIENTE`— y cada una tiene su caso en la bateria, incluido el que NO debe fallar.

## Firma

```
Firmado por lote: EP-018
```
