# PT-036 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

El cuerpo del issue enlaza **donde el contenido está**: la rama de trabajo mientras la allocation
vive, la rama por defecto cuando es `INTEGRATED`. La transición la hace la resincronización, no
una persona.

## Lo que estaba mal no era el enlace, era la advertencia

El cuerpo decía «este enlace puede no resolver todavía». **Eso es peor que el defecto**: una
advertencia convierte un fallo en una característica documentada, y quien la lea asume que es
así como tiene que ser. Estuvo ahí desde `PT-010` y nadie —yo incluido— volvió a mirarlo.

## Y la cuarta vez con la misma forma

`abrir()` tenía **dos finales** y solo uno estaba completo: el cuerpo de un issue recién creado
no se resincronizaba. Es el cuarto defecto de esta familia en el mismo archivo —`PT-014` en
`sincronizarCuerpos()`, `PT-022` en `checkCierreDeLote()`, `PT-035` al anidar—.

Cuatro veces no es descuido: **era la forma de la función**. Ahora tiene un final,
`cerrarPasada()`, y un caso comprueba que exista. No arregla los cuatro defectos —ya estaban
arreglados— pero quita el sitio donde nacían.

## Lo que un revisor debería atacar

**1 · Un issue viejo enlaza una rama que puede no existir.** Si `trabajo` se borra tras el merge,
los issues no resincronizados apuntarían a nada. Mitigado porque al pasar a `INTEGRATED` se
reenlaza a la principal, pero un issue vivo abandonado en una rama borrada sí rompe.

**2 · `RAMA_TRABAJO` se lee una vez al arrancar el proceso.** Cambiar de rama a mitad de una
ejecución larga daría enlaces mezclados. No pasa hoy porque las pasadas son cortas.

## Lo que NO he verificado

El comportamiento con `HEAD` desprendido en CI. Cae en la rama por defecto, que es lo seguro,
pero no lo he ejecutado en el runner.

SELF_REVIEW_COMPLETE
