# Diseño — `PT-139`   `PHASE 4`

## `checkAplazados()`

| Situación | Fuera de `G4` | En `G4` |
|:---|:---|:---|
| Sin bloque `aplazamiento` | aviso | **error** |
| `revision` vencida | aviso | **error** |
| Anterior a `LEX-R34` | aviso, y dice que **no** es deuda | aviso |
| Al día | `✓` | `✓` |

## Lo que el mensaje dice, y por qué

**Cuántos días lleva vencido.** «Vencido» sin la cifra no distingue dos días de dos años, que es
justo lo que hace falta para decidir.

**De quién es.** El bloque declara `dueno`; un aviso que no lo nombra deja la decisión sin
destinatario.

**Qué comando lo arregla.** Un aviso que no nombra el siguiente comando obliga a ir a buscarlo, y
eso es lo que hace que se ignore.

## No decide nada

El mensaje del caducado enumera **los tres caminos** —retomar, mover la fecha, cerrar— y dice
explícitamente que la compuerta obliga a mirar y no decide por nadie. Es `SUITE-R06`.

## La fecha de hoy se deriva   `CE-010`

Del último commit cuando hay git; del reloj del sistema cuando no. Un literal caduca solo, y
sería la clase que este repositorio ya tiene contada.

## `RIGE_DESDE`   `CE-014`

`LEX-R33` y `LEX-R34` entran en la tabla con `13.1.0`. Un aplazado con `suite_version` anterior se
**exime y se dice**, en vez de convertirse en deuda por haber ocurrido antes.
