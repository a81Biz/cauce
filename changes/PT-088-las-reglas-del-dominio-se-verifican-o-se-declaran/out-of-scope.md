# PT-088 — Fuera de alcance   `SUITE-R44`

Cada fila lleva **destino**: o es `—` —no se aplaza, no entra y no vuelve— o cita un identificador
que lo sostiene. Sin eso, aplazar es narrar.

| Qué queda fuera | Por qué | Destino |
|:---|:---|:---|
| Las otras **98** reglas sin verificador | Entran tres porque **sostienen el dominio declarado**, no porque falten. `SUITE-R26` dice que la cobertura *aspira, no exige*, y el Acid Test de `P-003` pasa. Escribir 98 verificadores para mover `112/224` es fabricar verdes | `—` |
| Hash encadenado para el ledger | Establece la integridad de verdad y **rompe los dos ledgers existentes**: 4 036 + 2 637 líneas sin hash, y migrarlas exige reescribirlas, que es lo prohibido | `—` |
| Distinguir una **corrección legítima** de una falsificación en el ledger | No es mecanizable: las dos aparecen como líneas `-`. En un append-only **las dos están prohibidas**, así que la comprobación es correcta y lo que no hace es acusar de mala fe | `—` |
| Exigir un **revisor aprobador** en la rama por defecto | Haría imposible el equipo de una persona que `SUITE-R22` declara soportado: nadie aprueba su propio PR | `PT-093` |
| Probar que la autorización de `G4` **fue real** | El agente escribe la constancia. Se construye el rastro aquí; lo que vale se declara allí | `PT-093` |
| Declarar el **sujeto** de las tres comprobaciones en forma verificable | Hoy va en el mensaje y en el comentario. El mecanismo que lo hace obligatorio y contrastable no existe todavía — y estas tres son su banco de pruebas | `PT-087` |
| Cambiar la severidad de `SUITE-R01` a `CHECK` | `RULES.md` lo llama por su nombre: *«marcar `CHECK` una regla que ningún script verifica es una promesa falsa»*. Y no lo verifica ningún script porque **no se puede** | `—` |
| Subir la versión a `11.0.0` | `RIGE_DESDE` las ancla ahí, así que quedan **dormidas** hasta que la versión suba. Eso se decide **al cerrar el lote**, con su entrada de `CHANGELOG` y su guía de migración | `EP-018` |

## La última fila no es un descuido

Las dos comprobaciones **no corren todavía en este repositorio**: `rigeGlobal('SUITE-R09')` es
falso con `suite_version: 10.0.0`. Se ejercitan en la batería con un fixture en `11.0.0`, que es
exactamente para lo que existe el arnés.

Elegir la versión de entrada **antes** de saber qué trae el lote entero sería adivinar. La tabla
de cierre de `EP-018` ya lo tiene como fila, con su criterio: `MAJOR` si entran reglas `HARD`
nuevas, y aquí entran **verificadores que pueden fallar** en proyectos que hoy pasan — que es el
criterio con el que subió la `10.0.0`.
