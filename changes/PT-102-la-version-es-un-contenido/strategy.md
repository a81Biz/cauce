# Estrategia — `PT-102`

## La decisión

**A-1 · El patrón se mueve a `patrones.mjs` y reconoce las dos formas.**

No se elige una forma canónica ni se reescriben los documentos para que usen una sola. Las dos
formas son legítimas y distintas: `Suite version: **X.Y.Z**` es prosa de encabezado, y
`suite_version: X.Y.Z` es un campo de un bloque `yaml` que se parametriza. **Unificarlas
obligaría a reescribir la plantilla que cada proyecto destino ya copió.**

Lo que sí es un defecto es que la **forma** viva en un regex local a una herramienta.

### Alternativas descartadas

| | Por qué no |
|:---|:---|
| **Unificar en una sola forma** | rompe los `CLAUDE.md` ya instalados, y ninguna de las dos está mal |
| **Añadir un segundo regex local** | dos patrones locales en vez de uno: empeora la causa (`SUITE-R38`) |
| **Que `version.mjs` avise y no toque** | la herramienta existe **para** alinear; avisar es lo que ya hacía mal |

## El anclaje, que es la parte delicada

El patrón va **anclado a inicio de línea** (`^`), con dos consecuencias buscadas:

1. **La prosa del `CHANGELOG` no se toca.** Cita cifras viejas en mitad de una frase —«una tarea
   con `suite_version: 8.2.0` no falla por…»— y eso es historia y un ejemplo (`SUITE-R09`).
2. **El marcador de una plantilla no se toca.** `INTAKE/templates/TAREA.md` declara
   `suite_version: X.Y.Z`, que es **correcto**: el grupo exige tres números y `X.Y.Z` no los da.

Los dos son casos `noCasa` del patrón, no comentarios sobre él.

## Lo que el propio contrato cazó

`patrones.mjs` exige que cada patrón traiga sus ejemplos. Al comprobarlos, uno de los `casa`
**falló**: el documento que viaja declara la versión dentro de una **cita**
(`> Suite version: **11.0.0** · Referencia: …`) y el ancla `^\s*` no admitía el `>`.

Se corrigió antes de que llegara a ningún sitio. **Ese es exactamente el trabajo que un patrón
local no puede hacer**: no tenía ejemplos contra los que fallar.

## El recorrido

`version.mjs` camina `docs/methodology/`. El `CLAUDE.md` del proyecto vive **dos niveles por
encima** y quedaba fuera — y es donde `SUITE-R00` pone la parametrización, incluido
`suite_version`. Se añade al recorrido, con el precedente que ya existía: la herramienta ya
alcanza el `package.json` de ese mismo nivel.

## Termina cuando

Las cuatro declaraciones muertas quedan alineadas, la plantilla y la prosa del `CHANGELOG`
quedan intactas, y la batería falla sin el arreglo.
