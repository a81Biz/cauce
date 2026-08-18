# PT-029 — Estrategia   `PHASE 3`

## Objetivo

Que `G1`, `G2` y `G3` se puedan evaluar, y que **esta forma de choque** deje de depender de que
alguien tropiece con ella.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Solo enumerar los tres choques y aplazarlos | El intake pide enumerar **y** declarar lo no mecanizable. Enumerar un defecto de tres líneas cuya corrección es evidente, y aplazarlo, es arrastrarlo |
| Cambiar `if (gate)` por `gate === 'G4'` en los tres | Arregla los tres casos y deja la **forma** intacta: el cuarto se escribirá igual, porque no hay nada que lo impida |
| Quitar `--gate G1/G2/G3` y admitir solo `G4` | Es tapar el hueco declarando que las otras tres compuertas no se evalúan. `EXEC-R06` dice que auto significa que el verificador **pasó**: hacer inevaluable la compuerta debilita eso |
| Derivar la exigencia de la **tabla de fases** de `tracker.mjs` | Es lo correcto en teoría y acopla `verify-fdge` a `tracker`. Dos herramientas que hoy no se importan, por una tabla de tres filas |
| **Un hecho en un sitio + un caso que caza la forma** | Cada artefacto declara desde qué compuerta es exigible, **con la fase que lo justifica al lado**, y un caso falla si aparece otra comprobación que se active con cualquier compuerta |

## Solución

### 1 · El hecho, en un sitio, con su porqué

En `patrones.mjs` —donde ya vive `ESTADOS_TERMINALES` por la misma razón— una tabla:

```js
export const EXIGIBLE_DESDE = {
  'manifest.json':  { gate: 'G3', fase: 6 },
  'self-review.md': { gate: 'G3', fase: 6 },
  'HISTORY.log':    { gate: 'G4', fase: 8 },
};
export const ORDEN_COMPUERTAS = ['G1', 'G2', 'G3', 'G4'];
export const exigibleEn = (gate, artefacto) => …
```

La fase viaja **al lado de la compuerta** a propósito: es lo que hace comprobable que la
asignación no es arbitraria. `manifest.json` se escribe en `PHASE 6`; la primera compuerta
posterior es `G3`, en `PHASE 7`. Nadie tiene que creerse el `'G3'`: puede derivarlo.

### 2 · El caso que caza la **forma**

`selftest.sh` falla si aparece en `verify-fdge.mjs` una comprobación con `if (gate) fail(…)` —una
que se active con **cualquier** compuerta—. Hoy hay tres; después habrá cero, y la cuarta que se
escriba pondrá la batería en rojo el día que se escriba.

**Esto es lo que la tarea pedía de verdad:** *«lo que falta no es otra regla sino detectar esa
FORMA»*. No detecta los tres casos: detecta la manera de escribirlos.

## Lo que se declara NO detectable

**Este método encuentra una familia de choque y solo una:** la que se deriva de cruzar fases con
compuertas. Los **cinco** choques que motivaron esta tarea son de otra familia —dos reglas que se
contradicen sin fases de por medio— y **este detector no los habría encontrado**:

```
SUITE-R44 con CLOSED · SUITE-R45 con el merge · SUITE-R45 con la verificación posterior
SUITE-R35 con SUITE-R46 · SUITE-R09 + FDGE-R29 (el ledger irreparable de PT-046)
```

`SUITE-R09` prohíbe editar una entrada y `FDGE-R29` prohíbe una segunda: no hay fase de por medio,
hay dos prohibiciones que se cierran mutuamente. Detectarlo exigiría razonar sobre el **contenido**
de las reglas, no sobre su calendario.

Se dice porque la alternativa es peor: cerrar esta tarea diciendo «los choques ya se detectan»
sería exactamente el verde por omisión que el marco persigue. Lo que se detecta es **una** forma,
y las otras siguen apareciendo al chocar.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| `G4` deja de exigir algo | `G4` es la última: `exigibleEn('G4', …)` es cierto para los tres. Caso propio |
| Un PT ya cerrado cambia de veredicto | `--all` sin `gate` no toca esta ruta: el `warn` de antes sigue igual |
| `verify-fdge --gate G4` en la CI | Es el que la CI usa. Caso propio y ejecución sobre los 43 PT |
| El caso nuevo se salta un `if (gate)` escrito de otra forma | Se declara: caza la forma literal, no toda forma imaginable |

## Criterios de éxito, derivados de los AC

- `AC-01` → los tres choques enumerados con archivo, línea y ejecución
- `AC-02` → el cruce fases × compuertas, versionado y reejecutable
- `AC-03` → la familia que **no** detecta, dicha con sus cinco casos
- `AC-04` → nada queda aplazado: los tres se arreglan aquí

## Autorrevisión

**El riesgo era arreglar los tres y llamarlo detectar.** Tres `if` corregidos dejan la batería
verde y el problema entero: el cuarto se escribe igual. Por eso el entregable es el **caso que
caza la forma**, y los tres arreglos son su primer efecto, no el trabajo.

El segundo riesgo era el contrario: declarar que ya se detectan los choques. La medida lo impide —
cinco de los seis casos conocidos son de una familia que este método **no ve**—, y queda escrito.

Contradicciones: ninguna. `AC` sin cubrir: ninguno.
