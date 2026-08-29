# `PT-201` · `strategy.md` — el camino elegido, y los descartados con su porqué

## El camino: la comprobación dice sobre QUÉ árbol se pronunció

Dos piezas, y ninguna toca lo que las once comprobaciones miden:

**1 · `verify-fdge` mira si el árbol está sucio en lo que cada comprobación consulta**, y cuando lo
está lo **dice**. Un veredicto sobre el árbol commiteado deja de leerse como un veredicto sobre lo
que hay delante.

**2 · `SUITE-R62` acota su promesa por escrito.** Es la regla que comprueba que `verify` y la CI
corren lo mismo —no `SUITE-R01`, que es *Evidence Before Action* y está declarada no verificable—.
Hoy ya declara un límite: que dos pasos con el mismo **nombre** podrían hacer cosas distintas. Le
falta el contrario: que el **mismo** paso mide un objeto que en local aún no existe.

```
verify sobre arbol LIMPIO   →  el veredicto vale y predice la CI
verify sobre arbol SUCIO    →  vale para lo commiteado, Y LO DICE
```

**No se cambia ningún veredicto.** Nada pasa de verde a rojo ni al revés: lo que cambia es que el
verde deja de afirmar más de lo que sabe. Es la misma forma con que `verify-fdge` ya trata las
comprobaciones `SIN EVALUAR` —*«no aprueba ni bloquea: son reglas que NO se llegaron a mirar»*— y con
que `bloques-sellados` trata su silencio.

---

## Los caminos descartados

### 1 · Quitar esas comprobaciones de `npm run verify`

**Descartado: son correctas y necesarias.** En CI, donde el árbol está commiteado y publicado, dan
el veredicto exacto. Quitarlas de `verify` rompería `SUITE-R62` en la dirección que más duele —lo
que falta en local **bloquea**— y dejaría el rojo para el PR, que es justo lo que esa regla existe
para evitar.

### 2 · Commitear automáticamente antes de verificar

**Descartado, y es el peor.** Fabricaría el hecho para poder aprobarlo: la comprobación pasaría
porque el acto de medir creó lo medido. Es `CE-001` en su forma más pura, y además convertiría
`verify` en algo que escribe en la historia.

### 3 · Exigir el árbol limpio para correr `verify`

**Descartado: haría `verify` inútil durante el trabajo.** Su valor es correrlo **mientras** se
trabaja. Una comprobación que sólo se puede ejecutar cuando ya no queda nada que comprobar no sirve.

### 4 · Bloquear si el árbol está sucio

**Descartado por la misma razón que `-18`:** convertiría en defecto una situación normal —trabajar—
y enseñaría a saltarse la compuerta. Es el argumento de `SECRETOS-EXCEPCIONES.md`: *«una compuerta
siempre roja enseña a saltársela»*.

### 5 · Hacer que `SUITE-R34` mire el árbol de trabajo en vez de los commits

**Descartado, y merece explicación porque es tentador.** `SUITE-R34` pregunta *«¿la sesión terminó
dejando el estado retomable?»*, y **terminar** significa commitear: un `HANDOFF` actualizado y sin
commitear no está retomable por nadie más. Medir el árbol de trabajo respondería otra pregunta, más
floja. La regla mide lo correcto; el problema es que no dice **desde dónde** mira.

### 6 · Arreglar el mensaje de `SUITE-R34` y nada más

**Descartado por insuficiente, y se hace igual.** El mensaje *«hubo trabajo en `changes/` después del
último estado»* afirma algo falso cuando el estado sí está al día sin commitear, y eso se corrige.
Pero arreglar **un** mensaje deja las otras diez comprobaciones con el mismo problema y sin nada que
lo declare.

---

## Lo que este arreglo NO promete   `SUITE-R26`

**No promete que el verde local pase a predecir la CI. No puede.** El ref durable de `SUITE-R51` no
existe hasta el `push`, y ninguna herramienta local puede inventarlo.

Promete que se sepa **cuándo no lo predice**, que es lo contrario de suponerlo — y es exactamente lo
que `RULE-06` pide: lo que no se sabe, se dice.

## La comprobación inversa

Con el aviso puesto, correr `verify` sobre un árbol **limpio** no debe emitirlo. Un aviso que
aparece siempre no informa de nada, y sería la misma avería que arregla.
