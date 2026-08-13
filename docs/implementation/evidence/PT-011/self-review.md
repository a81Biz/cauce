# PT-011 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

Cuatro líneas en `verify-fdge.mjs`: los miembros de un lote se leen de las filas de tabla, con
respaldo al barrido completo si no hay ninguna. Y una nota en la entrada de 4.13.0 del
`CHANGELOG` diciendo dónde estaba realmente esa corrección.

## Medido contra el repositorio que la sufría

```
antes   16 errores   (13 INTAKE-R08 falsos + 1 INTAKE-R09 + 3 de migración)
ahora    3 errores   SUITE-R17 · SUITE-R16 · SUITE-R33
```

**Los tres que quedan son la migración misma.** Ninguno es falso.

## Una corrección a mi propio criterio de aceptación

`AC-04` decía «baja de 16 errores a **2**». Son **3**: conté mal, porque había sumado
`SUITE-R33` aparte al describirlo. Corregido en la trazabilidad. No cambia nada del arreglo,
pero un número mal en un criterio de aceptación es exactamente lo que este marco persigue en
otros sitios.

## Lo que un revisor debería atacar

**1 · El respaldo al barrido completo puede tapar un lote mal escrito.** Un intake sin tabla
—o con una tabla que el filtro no reconozca— vuelve al comportamiento viejo, con sus falsos
positivos. Es deliberado: la alternativa es dejar de comprobar en silencio. Pero significa que
el defecto puede reaparecer en un intake escrito a mano de otra forma.

**2 · «Fila de tabla» es `/^\s*\|/`.** Una línea de código dentro de un bloque que empiece por
`|` contaría como fila. En un intake es improbable; no imposible.

**3 · La puerta de versión sigue sin decidirse.** Que una regla nueva pueda exigir cumplimiento
retroactivo sobre trabajo cerrado es la otra mitad de lo que se discutió al abrir la sesión.
Está en el out-of-scope **enumerada**, que es precisamente lo que `PT-013` va a hacer
comprobable.

**4 · No he tocado nada del proyecto legado**, y su corrección sigue siendo suya. Cuando migre,
`cauce install` sobrescribirá su `verify-fdge.mjs` con el nuestro — que ahora lleva lo mismo.

## Lo que NO he verificado

Que la migración completa de ese proyecto funcione. Los tres errores que quedan son
precisamente los que `PT-012` tiene que enseñar a resolver.

SELF_REVIEW_COMPLETE
