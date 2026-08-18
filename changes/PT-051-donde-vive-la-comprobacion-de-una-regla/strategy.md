# PT-051 — Estrategia   `PHASE 3`

## Objetivo

Que `regla <ID>` diga **dónde** está la comprobación —archivo y línea— en vez de obligar a abrir
1 490 líneas buscándola. Y que «no tiene verificador» no se confunda con «no encontré nada».

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Una tabla `regla → archivo:línea` en un `.md` | Es el hecho copiado que `RULE-01` persigue, y envejece en el primer commit. `selftest` ya tiene un caso que prohíbe la lista escrita de fallos |
| `grep -n` desde quien pregunta | Es lo que se hace hoy. Devuelve también los comentarios que **citan** la regla sin emitirla, y no distingue `fail` de `warn` |
| Un `--donde` que solo dé la primera coincidencia | 213 emisiones para 95 reglas: la media es 2,2. Dar una sola sería elegir por el usuario, y **callar las otras 1,2** |
| Abrir el editor en la línea | Ata la herramienta a un editor concreto. `archivo:línea` ya es un formato que todos entienden |
| **Conservar el `m.index` que ya se descarta** | La información existe, se recorre y se tira. No hay que buscarla |

## Solución

```
$ node tools/regla.mjs SUITE-R34 --donde
  SUITE-R34   verify-fdge.mjs:460    fail     BLOQUEA

$ node tools/regla.mjs SUITE-R35 --donde
  SUITE-R35   tracker.mjs:...        fail
  SUITE-R35   verify-fdge.mjs:...    fail
  SUITE-R35   verify-fdge.mjs:...    warn
```

`fallosPosibles` deja de quedarse con el nombre del archivo y devuelve **cada emisión** con su
archivo, su línea y su tipo. Lo que ya publicaba —`herramientas` y `bloquea`/`avisa`— se **deriva**
de esa lista, así que ninguna salida existente cambia.

**Y la línea sale de `m.index`, nunca de `indexOf`.** Es el defecto que `PT-043` encontró en
`verify-fdge` con las entradas `CORRIGE`: `indexOf` devuelve siempre la primera coincidencia, y
aquí eso daría a dos emisiones distintas **la misma línea plausible**. Tiene caso propio, con dos
emisiones idénticas a propósito.

## La regla sin verificador dice que no lo tiene

```
$ node tools/regla.mjs SUITE-R22 --donde
  SUITE-R22   ningún verificador la emite con su nombre.
              62 reglas están así (TD-08): es deuda MEDIDA, no un fallo de esta consulta.
```

**No una lista vacía.** `RULE-06`: no saber y no haber es lo mismo por omisión, y son cosas
distintas.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| `regla --fallos`, que usa `fallosPosibles` | La forma pública se conserva: `herramientas` y `bloquea`/`avisa` se derivan. Caso propio |
| El caso `no hay lista escrita de fallos` | Sigue en verde: lo que se añade es **más derivado**, no una tabla |
| `regla <ID>` sin `--donde` | No cambia. Caso propio |
| La línea informada | Caso propio con **dos** emisiones en el mismo archivo: si dieran la misma línea, cae |
| `audit`, que cuenta las 62 sin verificador | No se toca. `--donde` **cita** esa cifra, no la recalcula |

## Criterios de éxito, derivados de los AC

- `AC-01` → archivo y línea de **cada** `fail()` que emite el ID
- `AC-02` → sale de leer el código, no de una tabla
- `AC-03` → sin verificador lo **dice**, no devuelve vacío
- `AC-04` → varias herramientas se enumeran todas

## Autorrevisión

**El riesgo es dar una línea equivocada y plausible.** Es peor que no darla: quien abra el archivo
en esa línea verá código y creerá que es el que busca. Por eso `AC-01` se comprueba con **dos
emisiones en el mismo archivo**, que es el único caso donde `indexOf` y `m.index` difieren — y es
exactamente el defecto que `PT-043` documentó.

El segundo riesgo era inventarse una tabla. Lo impide un caso que ya existía antes de esta tarea.

Contradicciones: ninguna. `AC` sin cubrir: ninguno.

**Lo que no resuelve:** las 62 reglas sin verificador siguen sin tenerlo. `--donde` hace **visible**
cuáles son, una a una, en vez de como una cifra en `TD-08`. Es menos que arreglarlo y más que nada.
