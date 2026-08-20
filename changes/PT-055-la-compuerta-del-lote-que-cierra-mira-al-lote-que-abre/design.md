# PT-055 — Diseño   `PHASE 4`

## Cambio 1 · aceptar `EP-NNN` como objetivo

```js
// antes  (:1569)
const targets = argv.filter((a, i) => /^PT-\d+$/.test(a) && !(gateIdx >= 0 && i === gateIdx + 1));

// despues
const posicionales = argv.filter((a, i) => /^(?:PT|EP)-\d+$/.test(a)
  && !(gateIdx >= 0 && i === gateIdx + 1));
const targets   = posicionales.filter((a) => a.startsWith('PT-'));
const targetsEP = posicionales.filter((a) => a.startsWith('EP-'));
```

`targets` conserva exactamente su significado de hoy —los PT— para no tocar nada aguas abajo.

## Cambio 2 · el conjunto de lotes bajo evaluación

```js
/**
 * PT-055 · Que lote esta EVALUANDO esta ejecucion. Vacio = todos.
 *
 * Existe porque «--gate G4 EP-013» dejaba targets vacio y gate global: la herramienta nunca
 * supo que lote evaluaba, y bloqueo el cierre de EP-013 por las filas de EP-014, recien
 * abierto. Un lote abierto tiene sus filas sin resolver POR DEFINICION.
 *
 * Vacio significa TODOS y no NINGUNO: una orden sin objetivo es la que mas se parece a
 * «compruebalo todo», y acotar ahi convertiria el arreglo en un agujero en G4.
 */
function lotesBajoEvaluacion(reg) {
  const de = new Set(targetsEP);
  for (const pt of targets) {
    const ep = (reg?.allocations ?? []).find((a) => a?.id === pt)?.epic;
    if (ep) de.add(ep);
  }
  return de;
}
```

## Cambio 3 · `enG4` acotado

```js
// antes  (:827)
const enG4 = gate === 'G4' || alloc?.status === 'DONE';

// despues
const evaluado = !LOTES_EVALUADOS.size || LOTES_EVALUADOS.has(ep);
const enG4 = (gate === 'G4' && evaluado) || alloc?.status === 'DONE';
```

`LOTES_EVALUADOS` es un módulo-global calculado una vez tras leer el registro, igual que
`REGISTRO` y `GRAPH`. `checkEpics()` corre después de `checkRegistry()`, así que está disponible.

## Lo que NO cambia, y se dice

| Pieza | Sigue igual porque |
|:---|:---|
| `checkEpics()` recorre **todos** los `EP-*` | `INTAKE-R09` e `INTAKE-R08` deben mirarlos todos: un intake incompleto es un defecto lo evalúe quien lo evalúe |
| `alloc?.status === 'DONE'` | `AC-06`. Es la mitad de la condición que no depende de la bandera |
| `RE_RESUELTA`, `RE_CIERRE_LOTE`, el troceado de filas | No son la causa |
| `EXIGIBLE_DESDE` en `patrones.mjs` | Este cambio no toca qué artefacto se exige desde qué compuerta |
| El aviso cuando `sinResolver.length` y no es `G4` | Sigue avisando para todos: informar es barato, bloquear no |

## Delta respecto a la estrategia

Ninguna. El diseño es la estrategia escrita en código.
