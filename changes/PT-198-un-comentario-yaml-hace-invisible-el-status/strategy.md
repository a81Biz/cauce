# `PT-198` · `strategy.md`

## La decisión

**Un lector y un escritor de campo de frontmatter, en `patrones.mjs`, y las siete llamadas pasan por
ellos.** No se parchea el regex siete veces.

```js
// patrones.mjs
export function campoDeIntake(txt, campo)            // → { valor, comentario } | null
export function reemplazaCampoDeIntake(txt, campo, valor)   // → txt' | null
```

**Por qué en `patrones.mjs` y no en `tracker.mjs`:** `patrones.mjs` es el módulo declarado de los
patrones críticos con su contrato, y `verify-patrones` los comprueba. Un patrón que vive en el
consumidor no lo vigila nadie — es la razón por la que hay siete copias.

**El comentario se conserva al escribir.** `phase: 5  # …` que se reescribiera como `phase: 6` a
secas destruiría información que alguien puso a propósito. Escribir el valor y **respetar la cola**
es parte del contrato, no un extra.

## Las tres alternativas descartadas, con su motivo

| | Por qué no |
|:---|:---|
| Parchear los siete regex | Siete copias de la misma expresión divergen: es `SUITE-R38`, y es la causa que el intake ya nombra |
| Parsear YAML con una librería | Añade dependencia a un paquete que hoy no tiene ninguna, para leer cuatro campos escalares. El coste no es el arreglo: es el precedente |
| Prohibir el comentario | Es YAML válido y lleva información. `EP-023` guardaba ahí el motivo de su `CHALLENGE` |

## El mensaje: tres estados, no dos

Hoy hay uno solo —«no declara el campo»— para dos hechos distintos, y por eso miente. Quedan tres:

```
AUSENTE      «su intake no declara «status»»                      → añade el campo
NO_LEGIBLE   «declara «status» en la linea N y no se pudo leer»   → mira la linea N
OK           el valor
```

`NO_LEGIBLE` **dice la línea**. Un mensaje que distingue pero no localiza obliga a buscar, y buscar
es donde se vuelve a suponer (`RULE-06`).

## Alcance, y su límite declarado   `SUITE-R26`

**Dentro:** los cuatro campos escalares del frontmatter de un intake —`status`, `phase`, `type`,
`epic`— en las siete llamadas de `tracker.mjs`.

**Fuera, y consta:**
- Otros artefactos con YAML (`HANDOFF`, `CHECKPOINT`): no son intakes y su forma la escribe una
  herramienta, no una persona.
- Campos **no escalares** del frontmatter (listas, bloques): ninguna de las siete los toca, y
  cubrirlos sería escribir un parser de YAML por la puerta de atrás.
- **No se promete que el frontmatter sea YAML válido.** Se promete leer un escalar con comentario
  en línea, que es el caso medido.

## Riesgo, y cómo se acota

El riesgo real es el contrario del que motivó la tarea: **un lector más tolerante puede leer como
válido lo que no lo es**. Por eso el caso pareja no es opcional — un intake **sin** el campo tiene
que seguir fallando, y con su propio mensaje. Es la misma forma que `PT-196` acaba de usar con
`TRAS EL MERGE`: la puerta nueva no abre las viejas.
