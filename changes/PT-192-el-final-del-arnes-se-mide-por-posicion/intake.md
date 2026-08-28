# `PT-192` — El final del arnes se mide por POSICION y castiga cualquier anadido

```yaml
---
id: PT-192
type: BUG
severity: S2
epic: EP-026
track: STANDARD
status: READY
phase: 1
created: 2026-08-28
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

`selftest.sh` mide el final de su **propio fuente** por posición, en dos sitios:

```
:7284   «el recuento final existe»     tail -4    sobre el fuente
:7237   «sin coincidencias, es rojo»   tail -40   sobre el fuente
```

Añadir 21 líneas antes del recuento durante `PT-191` empujó el objetivo de la segunda fuera de su
ventana y puso **dos casos en rojo** sin que nada de lo que miden hubiera cambiado.

## 2. Por qué es un defecto y no una casualidad   `[HUMANO]`

**No es la primera vez, y está escrito en el propio archivo** (`:7235`):

> *«`PT-086` · la ventana pasa de 14 a 40 líneas: el bloque que avisa de PARCIAL empujó el objetivo
> fuera. Extraer por POSICIÓN es frágil en las dos direcciones, y aquí toco ésta.»*

El `HANDOFF` la declara en `-18` como familia recurrente —*«un caso puede fijar el cero de lo
prohibido, nunca el número de lo correcto»*— y contaba **tres** apariciones. `PT-191` sumó la cuarta
y la quinta, las dos en un solo cambio.

**Castiga el añadido, no el error.** Un caso que se pone rojo porque el archivo creció mide el
tamaño del archivo, no la conducta que dice medir.

## 3. Cómo se arregla, y cómo NO

**No ampliando la ventana.** `PT-086` ya lo hizo —de 14 a 40— y aquí estamos otra vez. Cualquier
número es igual de arbitrario y sólo mueve el día en que vuelve a pasar; es el argumento con el que
`PT-190` rechazó ampliar los 4000 caracteres del escáner.

**Sí anclando por contenido.** Con una advertencia que el propio archivo ya documenta: un `sed`
anclado al texto casó **su propia definición** y se tragó medio archivo. El ancla tiene que
distinguir la aserción de la línea que la define — y eso es el trabajo de la tarea.

## 4. Lo que NO promete   `SUITE-R26`

No promete barrer todas las extracciones posicionales del arnés. Cubre **estas dos**, que son las
que miden el final del fuente y las que han fallado.

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | Los dos casos siguen detectando lo que detectaban | `TS-01` |
| `AC-02` | Añadir líneas al final del fuente **no** los pone en rojo | `TS-02` |
| `AC-03` | El ancla no casa su propia definición | `TS-03` |

`AC-03` no es teórico: es el defecto que el comentario de `:7231` documenta haber sufrido.

## Cómo termina   `FDGE-R53`

> Termina cuando: crecer el arnés por su final deja de romper casos que no miden su tamaño.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la única del lote, resuelta el `2026-08-28`. `G3` sigue siendo humana
para todo `BUG` (`EXEC-R05`), y se pedirá con la evidencia delante.
