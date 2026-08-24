# Estrategia — `PT-125`   `PHASE 3`

> `FDGE-R54`: viabilidad registrada. **`MARGINAL`**, y el motivo importa: no es que se sepa
> grande, es que sólo hay **dos** `INVESTIGATION` cerradas, así que el coste típico sale
> `SIN EVALUAR`. No se aprueba por omisión ni se prohíbe sin evidencia.

---

## La decisión de fondo: qué se automatiza y qué no

`AC-02` es explícito: **la clase es un juicio**, y todo registro va marcado `DECLARADO`. Eso deja
una frontera que hay que trazar bien, porque los dos extremos son malos:

| Extremo | Por qué NO |
|:---|:---|
| Clasificar 160 entradas **a mano**, una a una | El juicio sería real pero irreproducible: nadie podría contradecirlo sin releer el ledger entero |
| Clasificar **derivando** con un matcher y llamarlo medición | Sería `CE-001` en estado puro: contar la palabra en lugar del hecho, en la tarea que existe para contar hechos |

**Lo que se automatiza es el MATERIAL, no el juicio.** El matcher busca las frases con que el
propio ledger **se autodescribe** —«el proxy en lugar del hecho», «probar donde trabajo, no donde
se decide», «séptima rotura de escapado»— y devuelve la **cita literal**. Luego una persona lee
esas citas y decide. Las catorce que resultaron ser menciones y no instancias salieron de ahí:
ningún matcher las habría separado.

## Por qué la lista de menciones se escribe, y no se corrige en silencio

Podría haber borrado los catorce registros. **No se borran**: se marcan `MENCION` con su motivo.

Un registro borrado no se puede contradecir. Uno marcado dice «esta entrada nombra `CE-006` y
alguien decidió que no es una instancia, por esto». Si el juicio está mal, se ve. Es la misma
razón por la que `HISTORY.log` es append-only.

## Un registro por entrada RECORRIDA, no sólo por evento

`AC-03` pide que **todas** queden recorridas. Sin un registro por entrada, «163 recorridas»
sería una afirmación sin forma de comprobarla — el mismo defecto que `PT-128` tuvo al **contar**
las tareas de un lote en vez de enumerarlas.

Tres estados, y son distintos a propósito:

```
clase: CE-nnn                       la entrada nombra su patrón
clase: null · con cita              afirma recurrencia pero NO nombra la forma
clase: null · sin cita              recorrida, describe un hecho único
```

Fundir los dos últimos perdería justo lo que la matriz necesita: **40 entradas dicen que algo se
repite y no dicen qué**. Ése es un hueco medido, y es material para `PT-119`.

## Una desviación del intake, declarada

El intake escribió: *«No produce código (`FDGE-R10`), así que está exenta de la matriz de
trazabilidad de tests»*. **Eso deja de ser cierto y se dice aquí, no se aplica en silencio.**

Una clasificación sin su generador no es reproducible: nadie podría rehacerla, contradecirla ni
volver a correrla cuando el ledger crezca — y el ledger creció **32 entradas** entre el intake y
este trabajo. Así que se publica `tools/eventos.mjs`, y **por tanto la exención decae**: la tarea
tiene casos de batería como cualquier otra.

Se declara porque ampliar el alcance sin decirlo es el defecto que este lote persigue, y porque
un criterio que dice «exenta» y una tarea que entrega código serían dos afirmaciones que se
contradicen sin que nadie lo note.

## Lo que NO se hace, y es deliberado

- **No se reclasifica nada ya escrito** (`SUITE-R09`). El `EVENTOS.jsonl` es un registro nuevo que
  **lee** el ledger; no lo toca.
- **No se rejuzga ni se reabre ninguna tarea cerrada** (`SUITE-R36`, `AC-04`). Lo cerrado es
  evidencia, no estado.
- **No se produce la matriz.** Es `PT-119`.
- **No se fuerza una clase** sobre las 39 que afirman recurrencia sin nombrar la forma.
  Clasificarlas exigiría reinterpretarlas, y eso inventaría la recurrencia que la matriz va a
  contar (`RULE-06`).
