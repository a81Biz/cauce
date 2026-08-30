# `PT-205` · self-review

## Lo que se sostiene

- **`AC` verificados: 4, ninguno huérfano.** Siete casos sobre siete escenarios.
- **La causa es una y está medida.** Cuatro corridas de CI en rojo en **una sola rama**, ninguna
  predicha por el verde local: `SUITE-R51` ×2, `SUITE-R34` ×1, `SUITE-R34`+`INTAKE-R09`+`FDGE-R55`×2.
- **Las tres son predecibles.** Ésa es la diferencia con el límite que `PT-201` declaró: aquél era
  *lo que no se puede saber en local*; esto **se podía saber y no se sabía**.
- **Ninguna regla se toca.** Las tres tenían razón y sus rojos fueron verdad. Lo que cambia es
  **cuándo** se dice.
- **Y no es un aviso más: es un bloque propio** que sólo aparece cuando hay algo. Un aviso que sale
  siempre es ruido, y el arreglo entero se perdería con él.

## `TS-02` sostiene la tarea, y su necesidad no fue teórica

La **primera versión** de la predicción de `SUITE-R51` miraba «el intake existe en el árbol» y
saltaba con **dieciocho** issues vivos. Eso es exactamente el ruido que la tarea persigue, escrito
dentro de ella.

La condición correcta es más estrecha: **el intake no está empujado todavía** —sin trackear o
modificado—, así que cuando su issue se publicó no había ref durable. Con eso, el bloque nombra
**uno**: el que de verdad rompería.

## Un defecto de diseño que sólo apareció al ejecutar

La predicción de `SUITE-R34` estaba **dentro de `checkEstado`**. Y `checkEstado` **retorna antes**
si el `HANDOFF` no lleva el bloque `ESTADO`:

```js
if (!m) { fail('SUITE-R33', 'HANDOFF.md no abre con el bloque ESTADO…'); return; }
```

**El aviso que existe para adelantarse se callaba justo cuando el estado está peor.** Lo destapó el
fixture, no la lectura: el caso preparaba un `HANDOFF` mínimo y el bloque no salía.

Movida fuera. La predicción mira **el árbol**, no el bloque, así que no puede depender de que el
bloque esté bien formado.

## Un tercer error mío, y el más peligroso de los tres

`sellar-estado` derivaba el hecho de **«la tarea viva más avanzada por fase»**, y sobre el
repositorio real devolvió **`PT-203` en `PHASE 8`** mientras el trabajo era **`PT-205` en `PHASE 5`**.

**Un sello que nombra la tarea equivocada es peor que ninguno**: deja `SUITE-R34` en verde
afirmando algo falso. Es `CE-001` —el proxy en vez del hecho— dentro del arreglo que persigue
`CE-006`.

El `CHECKPOINT` **ya sabe** cuál está abierta, porque `avanzar` lo escribe desde `PT-052`. De ahí
sale ahora, con dos casos: uno que fija que nombra la del `CHECKPOINT`, y su pareja que fija que
**no** nombra la más avanzada — que es exactamente lo que la primera versión hacía.

## Lo que la tarea añade, y de dónde sale cada cosa

| Pieza | Qué | De dónde se deriva |
|:---|:---|:---|
| `PENDIENTE AL EMPUJAR` | Bloque propio en `verify-fdge`, sólo si hay algo | — |
| `SUITE-R34` | `changes/` sucio y `HANDOFF.md` limpio | `git status --porcelain` |
| `SUITE-R51` | Issue vivo cuyo intake **no está empujado** | `git status` sobre el intake |
| `FDGE-R55` | Existe `paradas/PT-NNN.md` y la allocation no cita `origen_parada` | El árbol y el registro |
| `sellar-estado` | La vía sancionada de sellar sin cambiar de fase | El registro: la tarea viva más avanzada |
| `PHASES` | Los dos rodeos, escritos donde se ejecutan | — |

**`estampaEstado` se extrae de `avanzar`**, no se duplica: una pregunta, una fuente (`SUITE-R38`).

## Lo que NO se hace, y consta   `SUITE-R26`

- **No se predice lo que de verdad no se puede saber en local.** El límite de `PT-201` sigue en pie.
- **No se toca ninguna de las tres reglas.** Ni `decisionDeEnlace` ni su freno
  `MUDO_SIN_REF_DURABLE`: exigir el enlace al abrir sería pedir un commit inexistente.
- **La prosa del `HANDOFF` no se toca** (`LEX-R26`), y hay dos casos que lo fijan.
- **No se declara completa la lista de roturas de esta clase.** Se cubren las **tres medidas**;
  decir «ya están todas» sin barrer sería `CE-005`.
- **Los dos rodeos se declaran, no se quitan.** Es la misma decisión que `PT-196` tomó con el doble
  viaje por `G4`: el rodeo con su motivo escrito es aceptable; descubrirlo cada vez, no.

## Sin bloqueadores
