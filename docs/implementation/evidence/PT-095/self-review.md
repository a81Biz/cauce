# PT-095 — Autorrevisión   `PHASE 6`

## Lo primero fue medir si lo había roto yo

`G4` de `PT-094` se ejecutó y `main` siguió rojo. Lo fácil era asumir que el merge lo había traído.

Fui a `338a728` —el `main` de antes— y corrí lo mismo: **los seis ya estaban**. Lo que hace el
merge es *llegar al bloque*; sin un merge nuevo que contrastar, la comprobación volvía antes de
enumerarlos.

Medirlo costó un minuto y evitó escribir un `PT` sobre una causa inventada. Es justo lo que no hice
al declarar «`cauce` está limpio en `main`» mirando `git status` en vez de los workflows.

## La regla no era exigente: era imposible

`SESSION_LOG.md` es append-only (`SUITE-R09`) y `EXEC-R04a` exigía arreglar entradas que no se
pueden tocar. **La única salida era editar el ledger, que es lo que la otra regla prohíbe.**

`PT-029` construyó un detector de reglas que se hacen imposibles entre sí y no encontró ésta,
porque el choque no está entre dos textos: está entre un texto y un **dato** —doscientas entradas
escritas antes de que la regla existiera—. Un detector que lee reglas no puede verlo.

## `RIGE_DESDE` estaba aplicado a medias, y lo dice su propio nombre

`PT-081` lo construyó para que «una regla nueva no rija hacia atrás». La versión de entrada decide
si la comprobación **corre**; no decide a qué **alcanza**.

Durante siete días eso no molestó porque las otras reglas juzgan artefactos corregibles. Muerde
cuando lo juzgado no se puede reescribir — y ahí la diferencia entre «avisa» y «bloquea sin salida»
es total.

## El byte que no se ve

Escribiendo `corregidaDespues`, la clase de palabra de un regex acabó siendo el byte **0x08**.
`/‹0x08›CORRIGE‹0x08›/` no casa nunca **y no se ve al leer**: la función devolvía `false` siempre y
el caso habría dado verde por vacío si no lo hubiera probado sobre el archivo real.

Y después escribí un comentario advirtiendo del byte 0x08 **que contenía el byte 0x08**. Lo cazó un
escaneo que hice por desconfianza, no una comprobación.

Ahora hay un caso que lo pone rojo. Es la lección de `PT-085`, repetida — y van tres veces en esta
sesión que el escapado en un editor rompe algo silenciosamente.

## Escribí los casos tres veces con comillas anidadas antes de mirar lo que ya había

Las tres reventaron el shell. `PAT()` pasa los argumentos **por entorno como JSON** —que es
exactamente lo que hacía falta— y lleva ahí desde `PT-058`.

Y cuando por fin lo usé, seguía fallando: `PAT: command not found`. Había puesto el bloque
**ochocientas líneas antes** de donde se define. El arnés lo reportó como salida inesperada, no
como «ese ayudante no existe todavía» — y así un caso puede estar rojo por una razón que no tiene
nada que ver con lo que mide.

Es la misma familia que el rojo del runner en `PT-001` y en `PT-002`: **un rojo que no prueba lo
que pretende probar**. Tercera vez en la sesión, en tres herramientas distintas.

## La prueba inversa encontró un agujero que yo no buscaba

`corregidaDespues` aceptaba **cualquier día posterior**. Con eso, una sola entrada `CORRIGE`
excusaba **todo el ledger anterior para siempre** — el mecanismo pensado para no dejar `main` rojo
se convertía en una llave maestra.

Lo delató que **la inversa salió en cero**: deshice el arreglo y no cayó nada. Iba a apuntarlo como
verde.

**Una inversa que sale en cero no es un verde: es un aviso.** Es la mejor lección de este `PT`, y
no está en ningún `AC`.

## Lo que decidió cada arreglo

**La frontera sale del tag**, no de una fecha escrita: `SUITE-R40` lleva persiguiendo eso desde que
un verificador guardaba su propia copia del número de versión y se quedaba atrás siendo él la
autoridad.

**El detector excluye la espera** en vez de afinar el positivo. Afinar el positivo dejaría fuera
constancias que hoy valen; excluir «a la espera de» es vocabulario corto, cerrado y comprobable.

**`CORRIGE` no se inventa**: `HISTORY.log` lo usa desde `PT-046` y `FDGE-R29` lo prefiere. Aplicar
el mismo mecanismo al mismo problema en el otro ledger no añade vocabulario.

## Lo que NO se verifica, y está declarado

**Que `EXEC-R04a` no tenga más agujeros.** Nació hace un día y ésta es la primera vez que corre
contra un ledger real de doscientas entradas.

**Que las otras siete reglas de `RIGE_DESDE` no estén juzgando hacia atrás.** `alcanzadaPor` ya
existe y aplicarlo a las ocho cabría en una tarde. **No lo he medido**, y extenderlo a ciegas sería
lo mismo que este `PT` corrige.

**Que `main` quede verde.** Lo verificado es esta rama. `main` no lo estará hasta que alguien
resuelva `G4`, y la autorización del firmante fue para `PT-094`.

`AC-01`..`AC-07`, los siete.
