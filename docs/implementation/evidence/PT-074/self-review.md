# PT-074 — Autorrevisión   `PHASE 6`

## Qué cierra

El firmante lo pidió **tres veces**: *«sigo sin ver el cálculo de la sesión»*. Y las tres tenía
razón, por motivos distintos que se fueron descubriendo en cadena:

| | Por qué no se veía | Cerrado por |
|:---|:---|:---|
| 1 | La compuerta no la invocaba ninguna fase | `PT-075` |
| 2 | La batería pisaba la marca de sesión del repositorio real | `PT-076` |
| 3 | Dos lecturas apuntaban al archivo huérfano | `PT-068` |
| 4 | **El veredicto se calculaba, se registraba y no se espejaba** | esta tarea |

```
ANTES    **INVESTIGATION** · severidad S1 · de la implementación `EP-017`

DESPUES  Viabilidad (`FDGE-R54`): **MARGINAL** · coste — (SIN EVALUAR) · medida contra `7735ff4`
         > `MARGINAL` no prohíbe: obliga a trabajo **atomico** con checkpoint entre pasos.
```

## Las tres decisiones que importan

**Se espeja el veredicto y su base, no el razonamiento.** `SUITE-R35` prohíbe copiar contenido al
issue —*«dos copias del mismo texto divergen»*—. El porqué sigue en `changes/`. Lo que sube es
**estado**, igual que el tipo, la severidad y el lote.

**El `medido_en` no es adorno.** Un veredicto sin decir contra qué se midió es exactamente lo que
`PT-058` corrigió. Y en este caso concreto es lo que permitió detectar que los quince estaban
medidos contra una sesión cerrada: sin ese campo, el error habría sido invisible.

**Sin viabilidad no se emite nada.** Una allocation recién asignada no la tiene hasta `G2`, y
escribir `SIN EVALUAR` ahí sería inventar un dato donde sólo hay un hueco (`RULE-06`). `E7`
comprueba esa ausencia y **sigue pasando en la inversa**, que es lo correcto.

## Los quince, re-registrados

Pasan de `medido_en: 258be16` a `7735ff4`. No se editaron a mano: se ejecutó
`tracker viabilidad PT-NNN --registrar`, que es lo único que los escribe, y que ahora lee la
marca correcta gracias a `PT-068`.

Dos valores cambiaron además de la base —`665 → 691` y `1577 → 1596`— porque la referencia de
coste se deriva de las tareas cerradas, y desde el registro anterior se han cerrado cuatro.

## Un error que casi entra como evidencia

**Mi primera comprobación inversa dio verde en los tres casos.** La habría guardado.

El `python` no encontró el patrón —los saltos de línea eran `CRLF`— y `str.replace` **no falla
cuando no casa: no hace nada, en silencio**. Sin `assert`, la inversa no revirtió nada, y una
inversa que no revierte certifica lo contrario de lo que pretende.

Es la lección de `PT-050` —*«un caso que pasa en las dos direcciones no prueba nada»*— aplicada a
la herramienta de verificar. Repetida con `assert`, cayeron los dos que dependen del arreglo.

**Y es el sexto fallo de la misma familia en este lote**: cinco aserciones que no casaban con lo
que existe, y esta inversa. El patrón es siempre el mismo — escribir la comprobación y no
ejecutarla contra el caso real antes de darla por buena.

## Lo que costó y no debería

Seis intentos de escapado antes de escribir una línea de código. Los artefactos se generan con
scripts que mezclan plantillas de JavaScript con markdown lleno de backticks, y se rompen sin
parar. **La herramienta correcta era escribir cada archivo directamente**; insistí en el script
porque parecía más rápido, y no lo era.

## Delta real contra lo planificado

| | Planificado | Real |
|:---|:---|:---|
| Líneas en `cuerpoDeIssue` | 1 | **1 bloque** — el veredicto, su base, y la consecuencia de `MARGINAL`/`UNSAFE` |
| Casos | 8 | 6 · `E1` y `E9` se comprueban con casos que ya existían o con el re-registro |
| Inversas | 1 | **2** — la primera no revertía |

`AC-01`..`AC-06`, los seis verificados. `selftest` 1016 → **1022**, cero fallos, y `PT-076` sin
regresión: las huellas siguen idénticas.
