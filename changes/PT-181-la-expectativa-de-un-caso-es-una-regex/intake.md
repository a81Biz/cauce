# `PT-181` — La expectativa de un caso se compara como regex y no hay forma de decir literal

```yaml
---
id: PT-181
type: BUG
epic: EP-026
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-28
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

La expectativa de cada caso del arnés se compara **como expresión regular**. Medido hoy sobre
`selftest.sh`:

```
expectativas leidas   1384
con metacaracteres     257   (19 %)
```

Ejemplos reales, tal cual están escritos:

```
"^phase:"      "^NO$"      "Versión detectada: 3.x"      "instrucctions.md"
```

En `"3.x"` el punto casa **cualquier carácter**. En `instrucctions.md` también. Ninguno de los dos
lo pretende: son textos literales que **casan de más**.

## 2. Por qué es un defecto   `[HUMANO]`

Un caso cuya expectativa casa de más **puede pasar por la razón equivocada**, y eso no se ve
leyéndolo: se ve cuando el defecto que vigila aparece y el caso sigue verde.

**`SUITE-R59` no cubre esto.** Allí el problema es que un patrón se **rompe** —un corchete sin
cerrar es error de sintaxis, no un «no casa»—. Aquí el patrón **funciona** y significa otra cosa.
Son dos defectos distintos con la misma causa: no hay forma de decir «esto es literal».

## 3. Cómo se arregla, y cómo NO

**No** escapando los 257 a mano: sería una migración masiva que nadie puede revisar, y el siguiente
caso volvería a escribirse sin escapar.

**Sí** dando una forma de declarar la expectativa **literal**, y dejando la regex para quien la
quiera a propósito. Cuál es la forma —una variante de `chk`, un prefijo, o invertir el defecto— lo
decide la tarea.

## 4. Lo que NO promete   `SUITE-R26`

**No promete que los 257 se revisen uno a uno.** Muchos son intencionadamente regex. Lo que promete
es que a partir de aquí se pueda **distinguir** los dos casos, y que la cifra deje de crecer a
ciegas.

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | Existe una forma de declarar una expectativa **literal** | `TS-01` |
| `AC-02` | Un literal con `.` **no** casa cualquier carácter | `TS-02` |
| `AC-03` | Las expectativas que hoy son regex a propósito **siguen funcionando** | `TS-03` |

`AC-03` es el que impide arreglarlo rompiendo 1384 casos.

## Severidad: PENDIENTE, y consta

El registro no la declara. Vence el `2026-09-30` (`PT-183`).

## Origen: sin parada declarada

Es la **única** allocation del repositorio sin citar la parada que la produjo (`FDGE-R55`), porque
es **anterior a la regla**. Se declara aquí en vez de inventarle un origen.

## Cómo termina   `FDGE-R53`

> Termina cuando: escribir una expectativa literal sea posible y evidente, y un `.` en un nombre de
> archivo deje de casar cualquier cosa.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la única del lote, resuelta el `2026-08-28`. `G3` sigue siendo humana
para todo `BUG` (`EXEC-R05`), y se pedirá con la evidencia delante.
