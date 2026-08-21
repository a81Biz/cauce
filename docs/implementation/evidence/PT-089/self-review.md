# PT-089 — Autorrevisión   `PHASE 6`

## La medición cambió el diseño antes de escribir nada

```
status divergente con estado TERMINAL en el registro:  6
status divergente entre estados NO terminales       :  0
phase divergente en tareas ya terminales            : 22
```

**Las seis son de la clase peligrosa. Cero benignas.** El aviso estaba calibrado para una mezcla
que no existe — no había ninguna divergencia legítima entre estados vivos a la que protegiera.

Y eso estrechó el alcance: **sólo `status`**. Convertir las 22 de `phase` en error habría puesto
el árbol en rojo por trabajo ya cerrado, que es el error que `PT-088` evitó con `RIGE_DESDE`.

## Dónde nacían las seis, y quién las causó

`avanzar` sincronizaba `phase` en las dos fuentes **y no `status`**. Al llegar a la última fase
alguien marcaba `INTEGRATED` a mano en el registro, y el YAML se quedaba atrás.

**Ese alguien he sido yo, en este mismo lote**, cerrando `PT-087` y `PT-088` con un script de
Python sobre `REGISTRY.json`. La tarea que arregla el defecto lo estaba cometiendo mientras se
escribía.

Marcar terminal entra ahora en el acto atómico — los cinco actos o ninguno — y **no pisa** un
estado ya declarado: `FDGE-R53` dice que eso lo decide la tarea, así que una `DEFERRED` sigue
`DEFERRED`.

## `AC-03` no requería trabajo, y `AC-05` no procede

Dos criterios del intake resultaron ser otra cosa al medirlos:

| | Intake | Medido |
|:---|:---|:---|
| `AC-03` | «`avanzar` escribe las dos fuentes» | **Ya lo hacía** para `phase`. Lo que faltaba era `status` |
| `AC-05` | «fila en `RIGE_DESDE`» | **No procede**: la comprobación nace verde porque las seis se resolvieron aquí |

`PT-088` sí necesitaba el ancla —`EXEC-R04` nacía con 17 fallos sobre agosto— y de ahí venía el
criterio. Copiarlo habría añadido una fila que mantener y que no protege de nada. **`RIGE_DESDE`
es para reglas que romperían el pasado**, no para todas.

## Tres defectos míos en los casos, y los tres del linaje del lote

**El intake del fixture no declara `phase`.** Mis tres casos comparaban un campo inexistente, así
que la comprobación no tenía nada que hacer y **pasaban por vacío**. Lo vi leyendo el generador,
después de que fallaran — no antes.

**`avanzar` sólo va a la fase siguiente** (`FDGE-R52`) y mi caso pedía 8 → 10. Lo rechazaba, y yo
había redirigido su salida a `/dev/null`: tuve que volver a ejecutarlo **a la vista**. Es el mismo
«filtrar antes de mirar» que ya me costó una hora en `PT-088`, dos tareas antes.

**Un salto de línea dentro de `sed s///` no es portable.** Falló en la corrida y no al escribirlo.
Resuelto con el comando `i`, que inserta una línea y no necesita escapar nada — quitando la
necesidad, como las otras diez veces.

## Lo que no se verifica, y está declarado

**Cuál de las dos fuentes tiene razón.** La comprobación acusa de estar desincronizado, no de
estar equivocado, y lo dice **en el mensaje** — `PT-087`, terminado el día antes, lo hace
obligatorio.

**Las 22 divergencias de `phase`.** Siguen ahí y siguen siendo aviso. Es una decisión, no un
olvido, y está en `out-of-scope.md` con su motivo.

`AC-01`..`AC-07`, los siete.
