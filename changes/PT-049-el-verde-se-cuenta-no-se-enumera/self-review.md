# PT-049 — Autorrevisión   `PHASE 6`

## Lo entregado, medido

```
selftest.sh        541 → 2 lineas    -99,6 %    exit identico, 536 casos
verify-fdge --all  507 → 47 lineas   -90,7 %    exit identico, 49 PT
casos              520 → 536         +16
```

Las tres invariantes que la estrategia declaró se sostienen y tienen caso: **el recuento nunca se
calla**, **los fallos se enumeran todos**, y **el `exit` no depende del modo**.

## Lo que solo se vio ejecutando

`-q` sobre `selftest` dejaba **21 líneas y 19 eran cabeceras de sección vacías**. El diseño no lo
había previsto porque las cabeceras son `echo` sueltos, no `pass()`.

La solución fácil era borrarlas. No sirve: con fallos, un rojo sin su bloque no dice dónde está.
La que se hizo es **recordarlas** —`sec()` guarda la cabecera y sale sola delante del primer fallo
de su bloque—, así que en verde no aparece ninguna y en rojo aparecen las que hacen falta.

Es el patrón del lote entero: **lo que se encuentra ejecutando no se encuentra leyendo.**

## Cuatro casos nacieron rojos, y ninguno era del cambio

| # | Causa | Qué enseña |
|:---|:---|:---|
| 1 | Patrón con `[` sin cerrar | `chk` usa `grep` BRE: un corchete abierto es **error de sintaxis**, no un «no casa» |
| 2-3 | `cat` del archivo entero | `selftest.sh` contiene la palabra `SyntaxError` dentro de `revento()`, así que el arnés daba la herramienta por reventada |
| 4 | **El caso se cazaba a sí mismo** | ver abajo |

### El cuarto, que ya va por la cuarta vez

El caso que comprueba que el recuento **no** mira `QUIET` buscaba su línea con
`sed -n "/selftest: OK/p"`. Eso casaba **también las dos líneas que definen el caso**, y una de
ellas contiene la palabra `QUIET`. El caso se ponía rojo **por su propio texto**.

Es la **cuarta vez en esta sesión** que aparece la misma familia —una aserción que casa su propia
definición, o el mensaje `OK` de la regla que comprueba—. Las tres anteriores fueron `SUITE-R42`
en `PT-043`, `FDGE-R19` en `PT-047` y `FDGE-R39` en `PT-015`.

**La lectura no lo ve nunca.** Lo caza ejecutar, y solo si el caso es discriminante. Ahora el
recuento se busca **por posición** (`tail -4`) y queda anotado en el código, porque el patrón se
repite y volverá.

## Lo que se midió y NO se hizo

`verify-fdge -q` deja **47 líneas, y 43 son avisos** — 19 de ellos diciendo literalmente «aún no
toca» (`FDGE-R23`, `FDGE-R29`, `FDGE-R15` sobre artefactos que el procedimiento escribe más
adelante). Acallarlos bajaría a 27 líneas y se sentiría como progreso.

**No entra.** No es lo que la tarea firmó, y distinguir un aviso derivado de la fase de uno que
reporta divergencia es otra tarea con otro riesgo. Queda en `discovery.md` y en el `out-of-scope`
con `—`, medido, por si merece intake propio.

Decidir el alcance a mitad de la implementación es exactamente lo que `PT-023` midió que sale mal.

## Límite declarado

**Seis de los dieciséis casos comprueban la FORMA del código de `selftest`, no su comportamiento.**
Ejecutar la batería dentro de la batería triplicaría su coste —2 a 4 minutos por vuelta— para
comprobar seis casos.

Lo que sí se ejecutó de verdad, y está en la evidencia: `selftest.sh` y `selftest.sh -q` completos,
`verify-fdge --all` en los dos modos, y la comprobación inversa en las dos direcciones.

Es un límite, no un hueco: la diferencia es que está escrito y que la evidencia lo cubre por otra
vía. `PT-050` —el `--solo` del mismo lote— lo hará barato, y entonces estos seis casos podrán ser
de comportamiento.

## Lo que no resuelve

Que `verify-fdge` siga imprimiendo 47 líneas en `-q`. **La causa no es el verde**, y esta tarea
solo tocaba el verde. Está medido y dicho, que es todo lo que se puede afirmar sin ampliar el
alcance por el camino.

`AC` sin cubrir: ninguno. Contradicciones con otras reglas: ninguna.
