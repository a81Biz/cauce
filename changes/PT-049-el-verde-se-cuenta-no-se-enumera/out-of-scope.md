# PT-049 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Reejecutar solo un bloque de la batería | PT-050 |
| Reducir los 43 avisos de `verify-fdge`, 19 de ellos «aún no toca» | — |
| `-q` en `audit`, `verify-suite`, `verify-qa`, `verify-ptsa`, `tracker` | — |
| Que `-q` sea el modo por defecto | — |
| La entrada de `CHANGELOG` del lote y el número de versión | EP-014 |

**La segunda fila lleva `—` y es la decisión más consciente de esta tarea.** Está **medida** en el
`discovery` —43 avisos, 19 diciendo «aún no toca»— y no se aplaza a nadie porque distinguir un
aviso derivado de la fase de uno que reporta divergencia es **otra** tarea, con otro alcance y otro
riesgo. Ampliar aquí por el camino es exactamente lo que `PT-023` midió que sale mal.

Las filas tercera y cuarta llevan `—` porque no son trabajo pendiente: son fronteras. `-q` en las
otras cinco herramientas tendría sentido el día que su salida moleste, y hoy no se ha medido que
moleste.
