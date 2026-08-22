# Discovery — `PT-099` · `PHASE 2-B`

## QUÉ

La transición que `LEXICON` declara **«siempre»** para un `BUG` no la aplica nadie, y ningún
verificador la echa en falta.

## DÓNDE

```
LEXICON §5.1     IN_REVIEW --> VALIDATION_PENDING : tipo BUG · siempre
LEX-R08 (H)      «nunca transita de IN_REVIEW a DONE por accion del agente»
FDGE-R26 (HARD)  «transita a VALIDATION_PENDING y ahi SE DETIENE»
PHASES · PHASE 7 «BUG → VALIDATION_PENDING y PARA»

tracker.mjs      un solo «a.status =», y es el terminal. El tipo del PT no se consulta.
verify-fdge:1946 FDGE-R26 mira un BUG que YA esta en DONE
grep LEX-R08 tools/   nada
```

## CUÁNDO

Siempre, y **medido tres veces por mí en esta sesión**: `PT-096`, `PT-097` y `PT-098` llegaron a
`DONE` porque escribí `VALIDATION_PENDING` y luego `DONE` a mano, declarando la excepción cada vez.

```
BUGs en el registro                   51
que pasaron por VALIDATION_PENDING     0
```

## CÓMO

**1 · El comando no consulta el tipo.** `avanzar` mueve `phase` y sólo toca `status` al llegar al
final. `VALIDATION_PENDING` no aparece en el archivo.

**2 · La regla vigila la salida, no la entrada.** `FDGE-R26` exige la firma de `G3` para un `BUG`
**en `DONE`**. Uno que llegue a `PHASE 9` con otro estado no está en `DONE` → la comprobación no lo
mira → `--all` limpio.

**3 · Y la regla `H` no la cita ningún verificador.** `LEX-R08` es la severidad más alta del
`LEXICON` y no tiene ni una línea de código detrás.

## POR QUÉ

### Causa raíz

**El procedimiento lo dice y el comando no lo hace.** `PHASES · PHASE 7` es explícito —*«BUG →
`VALIDATION_PENDING` y PARA»*— y `avanzar` es quien mueve la fase.

Es la familia de `PT-075`: *«una regla sin verificador no ocurre»*. Aquí es peor: **una regla sin
ejecutor tampoco**, y el ejecutor natural existía y no la aplicaba.

### Por qué no lo cazó nada

`FDGE-R26` es una comprobación **de salida**: mira un estado final y exige su firma. El caso que
falla es el que **nunca llega a ese estado**. Un verificador que mira `DONE` no puede ver un `BUG`
que se quedó en `READY`.

Es la misma forma que `PT-096`: *el enlace muerto se reparaba, el ausente no*. Una comprobación
escrita para un fallo no ve su ausencia.

### Lo que resuelve la decisión de `PHASE 3`

`LEXICON` dice `IN_REVIEW → VALIDATION_PENDING`, y `avanzar` **no escribe `IN_REVIEW` nunca**: la
escalera entera está sin aplicar. Aplicarla completa arreglaría más de lo que esta tarea declara.

`PHASES · PHASE 7` sitúa la transición sin ambigüedad, así que se aplica **ahí** y la escalera
completa se declara como otra tarea.

## Complejidad — `FDGE-R04`

```
Complejidad: STANDARD
```

Extiende `estadoTerminalDe` —que `L-1` creó hace una hora—, una comprobación en `verify-fdge`, su
`RIGE_DESDE` y su batería.

## Lo que NO establece

- Que ningún otro comando escriba estado.
- Que los 51 `BUG` existentes estén mal: están **sin el dato**, y retrofecharlo sería falso.
- Que la escalera completa (`DRAFT → IN_PROGRESS → IN_REVIEW`) deba aplicarse. Se declara.
