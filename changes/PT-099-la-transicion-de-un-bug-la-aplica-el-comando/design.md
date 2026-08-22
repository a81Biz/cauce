# Design — `PT-099`

## D-1 · Se **extiende** `estadoTerminalDe`, no se añade otro escritor

`PT-098` acaba de crear el único sitio que decide el estado. Añadir un segundo sería la avería que
`SUITE-R38` persigue, cometida **una tarea después** de arreglarla.

```js
export function estadoDeFase(a, destino, ctx) {
  // BUG que entra en la fase de VALIDACION: LEXICON §5.1 lo declara «siempre»
  // FDGE-R26: «transita a VALIDATION_PENDING y ahi SE DETIENE»
  if (String(a?.type) === 'BUG' && Number(destino) === ctx?.faseValidacion
      && !ESTADOS_TERMINALES.has(String(a?.status)) && a?.status !== 'DONE') {
    return 'VALIDATION_PENDING';
  }
  if (ctx?.esFinal) return estadoTerminalDe(a, ctx?.integrado);
  return null;   // no se toca
}
```

**`null` significa «no se toca»**, no «se borra». Es la misma convención que `estadoTerminalDe`
para lo ya terminal.

## D-2 · La fase avanza; el estado se detiene

`FDGE-R26` dice que el `BUG` *«se detiene»* — y lo que se detiene es el **estado**, no la fase.
`avanzar` sigue moviendo `phase`, porque el trabajo avanzó; lo que no hace es llevar el `status` a
`DONE`.

Confundir las dos cosas es lo que rechacé en `A-1` de `PT-098`, y aquí volvía a aparecer.

## D-3 · La fase de validación no se inventa

`PHASES · PHASE 7 · Validation` dice literalmente *«BUG → `VALIDATION_PENDING` y PARA»*. El número
sale de `FASES` en el propio `tracker`, no de una constante nueva.

**`RIE-3`**: si alguien renombra la fase, la transición se apagaría en silencio — el riesgo que
`PT-096` documentó con su marcador. Se cubre con un caso que ata el número al nombre.

## D-4 · `RIGE_DESDE`, y no como formalidad

51 `BUG` existentes nunca pasaron por `VALIDATION_PENDING`. Sin la fila, la comprobación los
pondría a los 51 en rojo **sin salida**: no se puede retrofechar un estado por el que no pasaron.

Es exactamente `EXEC-R04a` en `PT-095`, y es la razón de que `L-5` exista. La fila se declara
**aquí**, no se aplaza.

## D-5 · Qué NO se cambia

- **`LEXICON` §5.1.** La máquina de estados está bien; faltaba quien la aplicara.
- **`FDGE-R26`.** Sigue vigilando la salida. Esta tarea añade la entrada.
- **Los 51 `BUG`.** Están **sin el dato**, no mal. Retrofecharlo sería falso.

## D-6 · Lo que se declara y no se arregla

**La escalera completa.** `avanzar` tampoco escribe `IN_PROGRESS` ni `IN_REVIEW`. Arreglarla toca
el estado de **todas** las tareas y no sólo de los `BUG`, así que va al `## Cierre del lote`.

Lo que esta tarea cierra es la transición que `LEXICON` marca **«siempre»** y que una regla `HARD`
de severidad `H` exige.
