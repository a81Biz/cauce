# Autorrevisión — `PT-137`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

`tracker retomar`: la puerta de vuelta que `DEFERRED` no tenía. Contrasta el firmante
(`SUITE-R27`), acepta la fecha real, puede reasignar la épica, escribe `retomada` (`LEX-R33`) y
publica en el issue — o en `TRANSICIONES.log` si no hay tablero.

## El lazo, y por qué no se abría por ninguno de los dos lados

`SUITE-R44` declara que un aplazado **no tiene intake**. `integrar` —el único comando con destino
de estado arbitrario— **exige** que el intake declare `status:` (`tracker.mjs:4148`), y antes de
eso filtra `DEFERRED` explícitamente (`4119`). Las otras asignaciones de estado escriben `DONE`,
`VALIDATION_PENDING` y `READY`, y ninguna toca `DEFERRED`.

**La regla que ponía la tarea en el tablero era la misma que la dejaba inalcanzable.** Retomar
`PT-134` exigía escribir `REGISTRY.json` a mano.

## Lo encontró USAR el marco, no leerlo

Al ir a mover `PT-134` al lote nuevo, ningún comando podía. Es la misma ruta por la que `EP-020`
descubrió que cerrar un `BUG` tampoco tenía comando: **la carencia se ve al chocar con ella**.

## El segundo hallazgo, que cambió el diseño a mitad

La primera versión fijaba `DRAFT`/`PHASE 1`. Escribiendo `LEXICON` apareció que **§5.1 ya declara
`DEFERRED --> READY`** — una transición escrita desde hace versiones que ningún comando podía
ejecutar (`CE-007`).

Pero §5.1 declara también `READY --> DEFERRED`, y `SUITE-R44` dice que un aplazado no tiene
intake. **Las dos no pueden ser ciertas del mismo aplazado.** Eran **dos aplazados distintos con
el mismo nombre**:

| De dónde viene | Intake | Vuelve a |
|:---|:---|:---|
| Aparcado desde `READY` | sí | `READY` — lo que `LEXICON` §5.1 declara |
| Nació aplazado (`PT-134`) | no | `DRAFT` · `PHASE 1`, a escribirlo |

El destino se **deriva mirando si el archivo existe**. Fijar uno habría derogado uno de los dos
documentos desde una herramienta, que es lo que `SUITE-R00` prohíbe.

## Los tres defectos que aparecieron construyéndolo

**1 · Rotura de escapado, otra vez.** El primer intento compuso el cuerpo del comentario con
secuencias escapadas dentro de una plantilla y las convirtió en saltos reales: `.split('` quedó
abierto y el módulo no compilaba. Es `CE-002` —la clase que **tiene** regla (`SUITE-R59`) y de la
que nada emitía—. La respuesta fue la de `SUITE-R59`: componer con `SALTO` y `L.push`, no
escapar.

**2 · Una sustitución con ancla no única casi borra el módulo.** El arreglo del punto anterior
buscó el **primer** `if (adaptador?.comentar && a.issue) {` del archivo, no el mío: 902 líneas
borradas. Lo delató `git diff --stat` antes de nada más, y se restauró desde git. **El fragmento
se escribe aparte y se inserta contra un ancla que se comprueba única** — que es lo que se hizo
después, y por eso el segundo intento fue `119 insertions, 1 deletion`.

**3 · Editar la batería mientras corría.** `bash` lee el script por desplazamiento de bytes:
insertar líneas a mitad de corrida partió un heredoc y produjo un error de sintaxis en una línea
que no tenía nada que ver. **El error no era real y podría haberse perseguido durante horas.**

## La inversa, y por qué se reancló

La supresión del rastro casaba el **texto exacto** de la línea `a.retomada = {…}`. Al añadirle
dos campos, dejó de casar y la inversa salió verde **por no encontrar nada que suprimir** — un
falso verde por vacío, que es `PT-023`. Se reancló a la **línea**, no a su contenido.

## Lo que esta tarea NO establece

- **Que un aplazado deba declarar cuándo se retoma.** Es `PT-138`. Aquí está la puerta, no el
  requisito de cruzarla.
- **Que un aplazado caduque.** Es `PT-139`.
- **Que `PT-025` esté resuelto.** Sigue aplazado, y es el arrastre que el firmante acepta.
- **Que el `retomada` de `PT-134` esté completo.** Se escribió con la **primera** versión del
  comando, antes de que el destino fuese derivado, así que declara `por`, `fecha` y `de` pero no
  `destino` ni `conIntake`. **No se reescribe**: lo que afirma es cierto, y `SUITE-R09` es
  append-only.

## Estado

| | |
|:---|:---|
| Escenarios | 21 de 21 |
| Prueba inversa | 4 supresiones, 4 escenarios distintos |
| Orphan Criterion | ninguno |
| `AC-06` | `PT-134` retomada **por comando**, salida en `salidas/pt-134-retomada.txt` |
