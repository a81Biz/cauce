# PT-031 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`EXEC-R08`: los tres modos exigen lo mismo. Un modo cambia **quién** resuelve una compuerta y
cuándo se pide confirmación; nunca **qué** se exige.

```
selftest    334 → 340 casos
cobertura   97/174 reglas
```

## El caso era real y salió en la primera ejecución

No hizo falta fabricar un fixture. La comprobación falló sobre el documento tal como estaba:

```
| **G1 — DoR** | ACK humano | ACK humano | ACK humano (admite firma por lote, `INTAKE-R08`) |
```

La firma por lote figuraba como privilegio de `AUTONOMOUS`. **`INTAKE-R08` vale en los tres** —
`EP-004` a `EP-007` la usaron en `SUPERVISED`. La matriz concedía como ventaja de un modo algo
que el marco ya daba a todos, y quien hubiera elegido `AUTONOMOUS` por eso habría tenido razón
según el documento.

## Cómo se comprueba, y por qué así

Vocabulario cerrado, no prosa. Una celda de la matriz dice **quién resuelve**; si cita un
artefacto o un identificador de regla, está hablando de **lo exigido**. Es la lección de
`PT-018`: quitar la prosa en vez de mejorar el detector, porque perseguir el idioma siempre deja
fuera el siguiente sinónimo.

## Lo que un revisor debería atacar

**1 · Solo mira la matriz.** Si un modo eximiera de algo en la **prosa** de §4, esto no lo ve.
Es una limitación real y deliberada: detectar exenciones en prosa libre es exactamente lo que
`PT-018` demostró que no funciona. La mitigación es que la matriz sea el único sitio donde los
modos se comparan — y eso no lo comprueba nadie.

**2 · `RE_ARTEFACTO` casa cualquier `algo.md`.** Una celda que dijera «ver `INSTALL.md`»
fallaría aunque fuera inocente. Prefiero ese falso positivo: obliga a mover la explicación fuera
de la matriz, que es donde debe estar.

**3 · Corregí el documento y escribí la comprobación en la misma tarea.** Un revisor podría
pedir que el hallazgo fuera su propia tarea. La alternativa era dejar el documento mintiendo
mientras se tramitaba, y ya cometí ese error con `SUITE-R44` en `RULES.md`.

## Lo que NO he verificado

Que la prosa de §4 no exima de nada. La leí y no vi nada, pero **leer no es verificar** y aquí
lo digo en vez de dejar que el verde de la matriz se lea como verde del documento.

SELF_REVIEW_COMPLETE
