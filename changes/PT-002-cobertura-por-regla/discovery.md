# PT-002 — Discovery   `PHASE 2` · análisis `2-B` (bug)

## Qué

`audit` informa **«Cobertura completa: sin huecos»** sobre un marco en el que **63 reglas
HARD no tienen ningún verificador**. El informe no miente sobre lo que mide: miente sobre lo
que el lector entiende que ha medido.

## Dónde

[`audit.mjs:378-392`](../../docs/methodology/tools/audit.mjs) y la línea de informe final.

## Cuándo

Desde la 5.2.0, que es cuando se añadió la comprobación.

## Por qué — causa raíz

**La unidad de medida es el componente y el informe habla como si fuera la regla.**

```js
if (c.verificadas === 0 && c.total > 0) gap(...)   // hueco solo si el componente tiene CERO
else tick('cobertura-mecanica');                   // 1 de 20 cuenta como cubierto
```

Siete componentes, siete `tick`, cero huecos. El número que se publica —«Cubiertos: 572»—
cuenta **elementos documentados**, no reglas verificadas, y la frase «Cobertura completa: sin
huecos» se lee como lo segundo.

No es un descuido de implementación: hace exactamente lo que su comentario dice que quiere
hacer. El defecto está en que **el informe promete más de lo que la comprobación abarca**.

**Hipótesis descartada:** que faltara por medir porque nadie lo hubiera pensado. Descartada —
el marco tiene la regla escrita para los demás: `SUITE-R11` («ningún score es válido sin
cobertura declarada junto al número») y `PTSA-R78` (`coverage = evaluadas / universo`, y
`NO_EVALUADA` no penaliza pero degrada la confianza). Se le exige a las auditorías de PTSA y
no a la propia.

## Impacto

| | |
|:---|:---|
| Severidad declarada | `S3` |
| Daño | Un verde por omisión en la herramienta que mide si el marco se cumple |
| Evidencia del daño | `audit` no vio ninguno de los dos defectos de este lote. `SUITE-R35` llevaba desde la 5.0.0 sin compuerta y la cobertura salía «completa» |
| Alcance | Todo proyecto con la suite instalada (`LEX-R25`) |

Es el patrón que `RULE-02` nombra —«una comprobación que, cuando se rompe, informa sin
errores»— aplicado a la comprobación de las comprobaciones.

## Lo que queda por determinar — entra en `PHASE 3`

**Qué cuenta como «esta regla tiene verificador».** Hoy: que el identificador aparezca en el
texto de alguna herramienta. Eso cuenta de más —una mención en un comentario, o un `fail()`
que cita una regla vecina— y no distingue si esa herramienta la ejecuta alguna compuerta.

La medición de `context.md` usa un criterio más estricto (ejecutada por compuerta, no solo
citada) y por eso da 85 y no 93. `PHASE 3` tiene que decidir cuál se publica, y **la respuesta
tiene que poder fallar**: un criterio que nadie puede contradecir no es una medida.

Segundo punto abierto: **el número no puede convertirse en umbral**. `SUITE-R26` dice «aspira»
y sigue siendo correcta; poner hoy un mínimo sería inventar una cifra con aspecto de norma.
Publicar sí; bloquear no.

## Conclusión

Defecto confirmado, localizado en una condición y reproducible ejecutando `audit`. Causa raíz:
la unidad de medida es el componente y el informe habla como si fuera la regla.

La corrección no requiere tocar `SUITE-R26`, que dice lo correcto. Requiere que el informe
publique **el número con su denominador** en vez de un adjetivo, y que lo no cubierto se pueda
enumerar.

Confianzas: RootCause 95 % · Architecture 90 % · Solution 80 %.

**Siguiente:** `PHASE 3`, con el criterio de «tiene verificador» decidido y al menos una
alternativa evaluada. Cero líneas de código antes de `G2`.
