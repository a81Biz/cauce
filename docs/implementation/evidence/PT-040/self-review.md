# PT-040 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`cauce regla --fallos`: **90 reglas** que pueden fallar, derivadas de los `fail()` y `warn()` del
código. La tabla del manual estaba escrita de memoria y ya se había quedado corta.

## Por qué esto es más fuerte que una tabla

No existe como dato. **Se calcula.** Si alguien añade una comprobación mañana, aparece sola — y
si esta lista se queda corta, es porque el código cambió, no porque a nadie se le ocurriera
actualizarla. Es `RULE-01` aplicado a la documentación, que es donde menos se aplica.

## Lo que descubrí midiéndolo

**103 de 158 reglas declaradas no emiten su nombre en ningún fallo.** No significa que no se
comprueben —muchas se verifican sin citar el ID— pero significa que si fallan, no lo dirán con su
nombre, y quien lo vea no sabrá a qué regla acudir. `--sin-comprobar` las publica.

Es una cifra incómoda y no la esperaba. La alternativa era no medirla.

## Lo que un revisor debería atacar

**1 · `AC-03` se verifica leyendo, no ejecutando.** No hay caso inverso posible: la lista se
calcula, así que no puede quedarse corta por construcción. Es más fuerte que un caso y **se
comprueba distinto**, y por eso está escrito en la trazabilidad en vez de pasar como si tuviera
prueba.

**2 · El regex solo ve `fail('ID'` literal.** Un `fail(variable)` no se detecta. Hoy no existe
ninguno; si mañana existe, la lista mentirá **por omisión** y nada lo avisará.

**3 · Distingue bloquea de avisa, y el manual los mezclaba.** Eso es mejor, pero significa que la
misma regla puede aparecer como las dos cosas —y es correcto, porque muchas avisan fuera de `G4`
y bloquean dentro—. Quien lo lea rápido puede confundirse.

SELF_REVIEW_COMPLETE
