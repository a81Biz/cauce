# PT-091 — Autorrevisión   `PHASE 6`

## La comprobación se cazó a sí misma, y no hizo falta construir el caso

Al escribir `checkInventario` dentro de `verify-fdge.mjs`, el archivo creció. Y la **primera
ejecución** de la comprobación dijo:

```
! FND-R14  1 de 16 cifras de inventory/services.md ya no describen el árbol —
           verify-fdge.mjs 2057→2106.
```

**El arreglo caducó antes de terminar de escribirlo.** Es la demostración más directa de por qué
una cifra escrita a mano no se sostiene, y ocurrió sola.

## Las distancias habían crecido durante el lote

`H-007` midió 8 de 16 el 2026-08-20. Remedido al abrir la tarea: **las mismas ocho, y más lejos**.

```
selftest.sh   H-007: 4533   ahora: 4919   documentado: 3541
patrones.mjs  H-007: 1082   ahora: 1280   documentado:  588     mas del DOBLE
```

No es una foto que envejece: **es una que envejece cada vez que alguien trabaja**.

## La severidad quedó opuesta a la de `PT-089`, y la diferencia no es de gusto

```
PT-089   registro terminal + YAML vivo   ->  «fase >= N» no se cumple
                                         ->  las comprobaciones posteriores NO SE EJECUTAN
                                         ->  ERROR

PT-091   cifra desviada en el inventario ->  ninguna comprobacion cambia de resultado
                                         ->  AVISO, y con el comando que lo arregla
```

**La consecuencia decide la severidad, no la gravedad aparente.** `PT-023` lo midió: un
verificador que bloquea donde no hace falta se apaga, y entonces no protege el día que tiene razón.

## Lo que la batería trajo y el plan no tenía

`inventario` recalcula cifras del árbol y **no espeja nada**, pero la guarda de plataforma se
dispara antes del despacho: el caso salió con «el proyecto no declara plataforma».

Exigirle una credencial para leer `wc -l` dejaría sin arreglo a un proyecto sin tablero — **el caso
que `SUITE-R22` declara soportado y que `PT-084` defendió**. Entra en `SIN_PLATAFORMA`, con
`indices` y `sellar`.

## El ancla es lo que hace útil al resto

`FND-R14` ancla el grafo con `pt_at_generation`. El inventario no tenía equivalente, así que **«al
día» y «nadie lo ha vuelto a mirar» eran indistinguibles**.

Ahora `tracker inventario` publica el `HEAD` corto con el que cuadró. Sin eso, un inventario
correcto por casualidad y uno verificado se leen igual.

## `H-006` se cierra por su causa, no por su síntoma

`CLAUDE.md` decía 15 herramientas y 4 comandos. Se corrigió **a mano** durante la auditoría, y ése
es el arreglo que vuelve a caducar. Ahora hay una comprobación que lo dice cuando pase.

## Lo que no se verifica, y está declarado

**Que la prosa del inventario sea cierta.** Que `services.md` diga bien cuántas líneas tiene
`tracker.mjs` no dice nada sobre si describe bien **lo que hace**.

**Que la lista de comandos de `CLAUDE.md` sea la útil.** Se cuenta su **cantidad**. Un `CLAUDE.md`
que dijera «install» siete veces pasaría — y se dice, en vez de dejar que el verde signifique más
de lo que mide.

`AC-01`..`AC-06`, los seis.
