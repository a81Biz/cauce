# `PT-196` · `strategy.md` — el camino elegido, y los descartados con su porqué

## El camino: tres piezas, y ninguna inventa vocabulario

### 1 · `SUITE-R45` distingue las filas POSTERIORES a `G4`

Una fila cuyo estado se declare **`TRAS EL MERGE`** no se exige **en** `G4`: se exige **al cerrar**.

```
| El tag y la publicación | TRAS EL MERGE — v13.4.0 es posterior (SUITE-R06a) |
```

Quita la contradicción sin rebajar nada: la pregunta sigue ahí y sigue habiendo que contestarla,
sólo que **cuando se puede**.

### 2 · El viaje de vuelta pasa a ser procedimiento DEL LOTE

`PHASES.md` lo saca de la prosa de `PHASE 9` y lo escribe como los seis actos que son, **en orden y
con su dueño**, bajo el ciclo del lote — que es de quien son. Y **declara el doble viaje** con el
motivo que `SUITE-R46` ya da, para que quien ejecute no lo descubra chocando.

### 3 · `tracker siguiente EP-NNN` contesta qué toca en el cierre

Hoy responde la fase del intake del lote. Pasa a **derivar** del estado de sus tareas qué acto del
cierre toca: integrar, mergear otra vez, cerrar, sellar el lote, proyectar, el tag.

Es `SUITE-R48` aplicado donde más se olvida, y no añade estado nuevo: se deriva del registro.

---

## Los caminos descartados

### 1 · Una `PHASE` nueva para el cierre

**Descartado: las fases son del `PT`.** `LEXICON` declara 0 a 10 y `PHASE 10` es `Rollback`. Meter
una fase aquí obligaría a renumerar —rompiendo todo lo escrito— o a inventar un `9b` que `LEX-R21`
no admite. **El viaje de vuelta es del lote**, y el lote ya tiene ciclo y comando propios.

### 2 · Quitar la fila del tag de `SUITE-R45`

**Descartado: la pregunta es legítima.** Un lote debe declarar qué resuelve al cerrarse, y el tag es
parte de eso. Lo que está mal no es que se pregunte: es **cuándo se exige la respuesta**.

### 3 · Eliminar el doble viaje

**Descartado, y merece explicarse porque es lo que uno querría.** Lo causa `SUITE-R46`, que exige que
el estado terminal esté en la rama por defecto **antes** de cerrar el issue — y esa regla nació de
una avería real: *«la rama principal queda declarando un estado vivo con el issue ya cerrado»*.

Quitarla para ahorrar un merge cambiaría una molestia por un defecto. **Se declara en vez de
resolverse**, que es lo que el intake ya prometía: *«puede que sea inevitable… lo que sí promete es
que esté declarado en vez de descubrirse cada vez»*.

### 4 · Un comando único que ejecute los seis actos

**Descartado por lo que hay dentro.** Dos de los seis —el merge a `main` y el tag— son
`SUITE-R06a`: no se automatizan. Un comando que los encadenara o bien se detendría en medio —y
entonces no es un comando, es una lista— o bien haría lo que el marco prohíbe. **Enumerar sí;
ejecutar por el firmante, no.**

### 5 · Dejarlo en el `HANDOFF` como lección

**Descartado: ya estaba ahí y no sirvió.** El ciclo de dos viajes lleva anotado desde `PT-186` como
hallazgo suelto, y esta épica volvió a chocar con él. Una lección en prosa que nadie ejecuta es
exactamente lo que este lote persigue.

---

## Lo que NO promete   `SUITE-R26`

**No promete que cerrar un lote deje de necesitar dos merges.** Puede que sea inevitable; lo que
promete es que **esté escrito** donde se ejecuta, no sólo en la regla que lo causa.

**Y no automatiza nada de `SUITE-R06a`.** El merge a `main` y el tag siguen siendo del firmante.

## La comprobación inversa

Con el arreglo: una fila marcada `TRAS EL MERGE` **no** debe bloquear `G4`, y una fila `PENDIENTE`
**sí**. Si las dos se comportan igual, la distinción no existe.
