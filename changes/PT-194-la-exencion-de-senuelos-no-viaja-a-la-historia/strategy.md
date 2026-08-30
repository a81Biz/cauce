# `PT-194` · `strategy.md`

## La decisión, y es la que el intake dejó abierta

**`cauce:senuelos` NO vale para la historia, a propósito. Y se dice.**

No es que no llegue por accidente —`revisar-secretos.mjs:164` pasa `false` en duro, y el diff de
`git log -p` lleva el archivo en sus cabeceras, así que hacerla llegar sería fácil—. **Es que no
debe llegar**, y hasta hoy eso no estaba escrito en ningún sitio: era un efecto de por dónde mira
el escáner, no una decisión (`RULE-06`).

## Lo que cambia: el mensaje, no la exención

| Hoy dice | Y el hecho es |
|:---|:---|
| `contraseña en texto plano` | Que **está en la historia**, que la historia no se reescribe, y que el camino es **firmar la huella** |

Un hallazgo de historia pasa a decir **de qué se trata**: que el ámbito es la historia, que
`cauce:senuelos` exime el árbol y no ésta **con su motivo**, y cuál es el mecanismo previsto.

Y cuando el archivo del hunk **sí** está declarado señuelo en el árbol de hoy, **se dice también** —
como contexto, sin eximir. Es la diferencia entre informar y permitir.

## Los tres motivos, que van al mensaje y no sólo aquí

1. **La declaración vive en el árbol de HOY; la historia es de SIEMPRE.** Aplicarla eximiría todo
   lo que ese archivo tuvo alguna vez, incluida una credencial real borrada después.
2. **El riesgo va al revés del síntoma.** Lo que molesta es un falso positivo; ampliar mal una
   exención hace que un secreto **real** deje de bloquear. Entre molestia y agujero, molestia.
3. **El mecanismo correcto ya existe:** firmar la huella en `SECRETOS-EXCEPCIONES.md`, que **sigue
   mostrándola** y que ata la firma **al valor** — si el valor cambia, vuelve a bloquear. Una
   exención por archivo no tiene esa propiedad.

## Por qué el motivo va **en la salida** y no sólo en un documento

Quien lea el rojo está a punto de decidir qué hacer con él, y la decisión peligrosa —«amplío la
exención y listo»— es la cómoda. Un motivo que hay que ir a buscar a `RULES.md` no llega a tiempo.
Es el mismo criterio que `RULE-07` aplica a los mensajes: decir **cómo se arregla**, no sólo qué
falló.

## Alcance, y su límite declarado   `SUITE-R26`

**Dentro:** qué dice el escáner ante un hallazgo de **historia**, y que su comportamiento quede
**declarado** en vez de ser un efecto de la implementación.

**Fuera, y consta:**
- **La exención en el árbol no cambia**: funciona, y es lo que `PT-190` compró.
- **La heurística de los 4000 caracteres se queda**: los destinos instalados dependen de ella
  (`CE-014`, y `revisar-secretos.mjs:87` ya lo declara).
- **No se reescribe historia** (`SUITE-R06f`) ni se retira ninguna huella firmada.
- **No se promete que ningún fixture vuelva a aparecer en la historia**: eso lo cerró `PT-193`
  ensamblando los literales.

## El riesgo, y cómo se acota

El riesgo de esta tarea es **arreglarla en la dirección peligrosa** — que un mensaje más amable
acabe siendo una exención. Por eso `AC-02` no es opcional y su caso tampoco: **un secreto real en
la historia tiene que seguir bloqueando, haya declaración o no**, y el caso lo planta con la
declaración puesta.

Sin ese caso, todo lo demás lo cumple un escáner que deje de mirar la historia.
