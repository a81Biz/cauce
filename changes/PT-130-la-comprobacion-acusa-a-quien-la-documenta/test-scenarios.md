# Escenarios de test — `PT-130`

> `FDGE-R17`: rojo primero, y **válido**.

| TS | Escenario | Esperado |
|:---|:---|:---|
| `TS-01` | El sujeto de `tarea:` es el primer identificador; una cerrada mencionada después no falla | `SIN FALLO` |
| `TS-02` | Citar una cerrada **para decir** que está cerrada, tampoco | `SIN FALLO` |
| `TS-03` | …y mencionarla **sin decir su estado**, tampoco | `SIN FALLO` |
| `TS-04` | Un sujeto terminal presentado en curso **sigue** fallando | `PT-096` |
| `TS-05` | …y si la línea **lo declara** terminal, no falla | `SIN FALLO` |
| `TS-06` | Un lote declarado `ABIERTA` y cerrado en el registro falla | `EP-019` |
| `TS-07` | `SUITE-R34` declara qué establece | `primer identificador` |
| `TS-08` | …y qué **no** establece | `NO evalua los demas` |
| `TS-09` | Las lecturas de alcance amplio se enumeran | `SON VARIAS` |
| `TS-10` | …y dicen sobre qué leen y en qué línea | `x.mjs 1 txt` |
| `TS-11` | …y un **comentario** que lo nombra no cuenta | `0` |
| `TS-12` | …y sin fuentes dice `null`, no cero | `null` |
| `TS-13` | El `HANDOFF` sigue nombrando identificadores en prosa | `PT-127` |
| `TS-14` | …y `SUITE-R34` no lo acusa por nombrarlos | ausencia del rojo |

---

## Los que existen porque algo falló, o habría fallado

**`TS-03`** — es el que **sólo** el anclaje salva. `TS-01` y `TS-02` pasarían también con la
lectura vieja, porque la guarda de «lo declara» los cubre. Sin `TS-03`, quitar el anclaje no se
notaría, y la prueba inversa lo demostró: la primera mutación tumbaba un escenario **distinto** del
que decía.

**`TS-04`** — el negativo. Sin él, una implementación que no fallara **nunca** también pasaría, y
`SUITE-R34` se quedaría sin lo que existe para cazar.

**`TS-05`** — la guarda contra sobrecorregir. Decir que está cerrada es correcto; acusarlo sería
el mismo defecto por el otro lado.

**`TS-11` y `TS-12`** — `TS-11` es la autorreferencia que ya mordió en `PT-051` y en el lint de
helpers: nombrar el patrón para explicarlo no es cometerlo. `TS-12` no es teórico: la primera
versión del enumerador **midió cero** por una expresión rota, y un cero sin contraste es
indistinguible de un cero real.

**`TS-13` y `TS-14` juntos** — son `AC-05` hecho caso: el texto que fallaba **sigue escrito
igual**. Sin ellos, alguien podría «arreglar» el defecto reescribiendo la prosa y los demás casos
seguirían en verde.

---

## Prueba inversa

| Se quita | Qué se pone rojo |
|:---|:---|
| El anclaje al sujeto (vuelve a juzgar toda la línea) | `TS-03` |
| La guarda de «la línea lo declara terminal» | `TS-05` |
| El alcance declarado en `SUJETOS` | `TS-07` |
| La guarda de comentarios en la enumeración | `TS-11` |
| Distinguir «no se pudo mirar» de cero | `TS-12` |

Cinco supresiones, cinco escenarios distintos.

### Y la primera mutación era infiel

«Sin anclar al sujeto» cambiaba **qué** identificador es el sujeto, no el **alcance** de la
lectura, así que tumbaba un escenario distinto del que declaraba. **Una supresión que no reproduce
el defecto que suprime no prueba nada, aunque salga roja.** Rehecha restaurando el bucle sobre
todos los identificadores de la línea, que es el comportamiento anterior de verdad.
