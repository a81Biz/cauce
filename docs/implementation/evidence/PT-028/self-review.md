# PT-028 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

Un issue reclamado por una allocation **terminal** se reporta como **cierre pendiente** y no
bloquea. El que no reclama nadie sigue siendo huérfano y sigue bloqueando.

```
selftest   315 → 320 casos
```

## Dos reglas mías, chocando

`SUITE-R46` obliga a apuntar el estado terminal **antes** de mergear y a cerrar **después**.
`SUITE-R35` marcaba ese estado intermedio como «trabajo que el registro no conoce». Resultado:
`G4` no podía pasar bajo el orden que `G4` exige.

Las dos reglas son correctas por separado. El choque **solo aparece ejecutando**, y apareció a
las horas de escribir la segunda. Es el cuarto defecto de esta familia en dos días, y todos
tienen la misma forma: una comprobación que hace imposible el estado que otra obliga a
atravesar. Empiezo a pensar que lo que falta no es otra regla, sino una forma de detectar esa
forma — está aplazado en `PT-029`.

## Lo que un revisor debería atacar

**1 · La ventana de «cierre pendiente» no tiene caducidad.** Un issue puede quedarse ahí para
siempre y solo produce una nota. La alternativa —caducarlo— exige una fecha, y una fecha
inventada es peor que una nota persistente. Pero es una relajación real.

**2 · `pendienteDeCierre` viaja en el dato y no en el texto.** A propósito: decidir si algo
bloquea buscando una frase se rompe al reescribir una línea. El coste es que quien lea la
divergencia serializada ve un campo que no todas llevan.

**3 · El tercer parámetro es opcional y cae en `vivas`.** Los casos anteriores siguen midiendo
lo mismo, pero un llamador que no lo pase pierde la distinción **en silencio**. Es la clase de
degradación muda que `SUITE-R38` documenta, y aquí la acepté para no romper firmas.

## Lo que NO he verificado

Si hay más choques entre reglas escritas el mismo día. Aplazado y asignado.

SELF_REVIEW_COMPLETE
