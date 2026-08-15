# PT-017 — Estrategia   `PHASE 3`

## Objetivo

Que la lista de «qué llega nuevo» salga de **comparar** el paquete con el destino, y que añadir
una herramienta aparezca en el informe **sin tocar el código**.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Actualizar la lista a mano | Es lo que hay, y ya está vieja: dos herramientas nacidas después no aparecen |
| Un `README` en `tools/` que la enumere | Otro hecho copiado, en otro archivo, envejeciendo igual |
| Derivarlo del `CHANGELOG` | El `CHANGELOG` cuenta versiones, no inventarios. Y la lista viviría en prosa |
| **Restar los dos directorios** | Los dos caminos ya están resueltos en `migrate.mjs`. No falta información, falta usarla |

## Solución

```
paquete   <de donde sale migrate.mjs>/../tools/
destino   <ROOT>/docs/methodology/tools/
nuevas    paquete − destino
```

## El caso que `PHASE 2` dejó abierto

Si el destino **no tiene** `tools/` —un proyecto en `3.x`— la resta da las dieciséis, y eso es
cierto pero **inútil como aviso**: nadie lee dieciséis nombres en una lista de decisiones
pendientes.

Se dice en vez de imprimirlas:

```
sin tools/ en el destino   →  «la suite entera llega nueva: 16 herramientas. Se instalan
                               con el paquete, no una a una.»
con tools/                 →  «llegan N que tu proyecto no tenia: a · b · c»
sin poder leer el paquete  →  se DICE, y no se cae en la lista escrita a mano (RULE-06)
```

La tercera importa: si `readdirSync` del paquete falla, la tentación es volver a la constante.
Eso sería sustituir «no lo sé» por un dato viejo, que es lo que `RULE-06` prohíbe.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| El tramo de `5.0.0`, donde vive el `need()` | Caso propio sobre el fixture `mk_v412` |
| `PT-043`: el conductor reconoce esta acción por `/llega nuevo/` | **La frase se conserva**. Cambiar el texto rompería el `PORQUE` y la fila perdería su motivo |
| El destino ya al día | Sin diferencias no se emite fila: nadie decide sobre una lista vacía |
| Un destino en `3.x` | Caso propio: dice «la suite entera», no dieciséis nombres |

## Criterios de éxito

- `AC-01` → la lista sale de la resta, no de una constante
- `AC-02` → añadir un archivo a `tools/` aparece sin tocar el código
- `AC-03` → si no se puede comparar, se dice
- `AC-04` → un destino al día no produce fila

## Autorrevisión

Contradicción con `PT-043`: **ninguna, pero por poco**. Su `PORQUE` reconoce esta acción por la
frase `llega nuevo`, así que el texto tiene que conservarla — está anotado en el código y hay un
caso. Es la clase de acoplamiento que se rompe sin querer al reescribir un mensaje.
