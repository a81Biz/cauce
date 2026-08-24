# Descubrimiento — `PT-130`   `PHASE 2`

> Qué se midió, con qué comando, y qué salió.

---

## 1 · Cómo apareció, y es la parte que importa

Escribiendo en el bloque `ESTADO` del `HANDOFF` que los commits del cierre citaban `EP-019`
**estando `CLOSED`** — es decir, **registrando el defecto** que `PT-127` acababa de dotar de
detector — `SUITE-R34` se puso en rojo.

**La comprobación acusó a quien documentaba el hecho que ella vigila.**

Es `CE-017`, y es la única clase que se vuelve **más** probable cuanto **mejor** se escribe el
ledger: cuanta más precisión al registrar lo que pasó, más identificadores en prosa, más
superficie para el falso positivo.

## 2 · Dónde estaba el defecto, exactamente

```js
const vivasAfirmadas = lt.split(/INTEGRAD|CERRAD|CLOSED|DEFERRED|READY:/i)[0];
for (const id of vivasAfirmadas.match(/\b(?:PT|EP)-\d{3}\b/g) ?? []) { … }
```

La línea `tarea:` se cortaba en la primera palabra de estado terminal, y **todos** los
identificadores del trozo de delante se daban por afirmados «en curso».

Pero la línea `tarea:` afirma **una** tarea en curso: el checkpoint es uno (`LEX-R26`). Todo lo
demás que aparece es **contexto** — la tarea anterior, el lote, una que se cerró, una que espera
validación.

## 3 · El arreglo, y lo que NO es

**Anclar al sujeto**: el **primer** identificador de la línea. Es lo que la línea presenta como
tarea en curso; el resto no se evalúa.

Y lo que **no** es: esquivar la palabra. El intake lo dejó fuera de alcance con razón — el bloque
`no hacer` del `HANDOFF` ya advertía de citar identificadores en prosa, y seguir esquivándolos
sería **documentar la limitación en vez de quitarla**. El texto que hoy fallaba sigue escrito
igual, y ahora pasa.

## 4 · Lo que se conserva, medido

Tres casos, y los tres importan:

| Línea | Antes | Ahora |
|:---|:---|:---|
| `PT-126 … los commits citaban EP-019 estando CLOSED` | **falla** | pasa |
| `PT-096 sigue en curso` (y está `INTEGRATED`) | falla | **falla** — no se pierde nada |
| `PT-096 INTEGRATED, cerrada el martes` | pasa | pasa |

El segundo es la razón de ser de la comprobación, y sigue entero.

## 5 · Las otras lecturas de alcance amplio, enumeradas

`AC-04` pide enumerarlas aunque no se arreglen. Se **deriva**, no se lista a mano:

```
$ lecturasDeAlcanceAmplio(tools/*.mjs)   →  11
```

```
audit.mjs:210          sobre «txt»
audit.mjs:506          sobre «texto»
eventos.mjs:182        sobre «RE_RECURRE»
patrones.mjs:1987      sobre «cuerpos»
verify-fdge.mjs:1202   sobre «RE_SIGN_BLOCK»
verify-fdge.mjs:1225   sobre «RE_CIERRE_LOTE»
verify-fdge.mjs:1283   sobre «RE_CIERRE_LOTE»
verify-fdge.mjs:1840   sobre «texto»
verify-qa.mjs:145      sobre «RE_AC»
verify-qa.mjs:176      sobre «RE_TIPO_CASO»
verify-qa.mjs:207      sobre «RE_HUMANO»
```

**No se arreglan aquí.** Arreglar once lecturas de golpe, sin un caso que sostenga cada una, sería
cambiar once comportamientos a ciegas. Se declara el número, que es lo que `RULE-06` pide.

## 6 · La primera versión del enumerador midió **cero**

Y el cero parecía una medición. La causa: `BS_D` ya contenía el punto y yo le añadía otro, así
que la expresión buscaba `\..includes` y no casaba nada — en un árbol donde `grep` encuentra
cuatro a simple vista.

Un cero que no se contrasta con nada es indistinguible de un cero real. Se contrastó.

---

## Conclusión

**`CE-017` tiene ahora una instancia cerrada y su alcance declarado.** `SUITE-R34` entra en el
registro de sujetos de `PT-087` diciendo qué establece —el sujeto de `tarea:` no está terminal
mientras la línea lo presenta en curso— y qué **no**: los demás identificadores que la línea
mencione.

Y quedan **once** lecturas de alcance amplio enumeradas, con archivo y línea. Ninguna promesa
sobre ellas: sólo la cifra.
