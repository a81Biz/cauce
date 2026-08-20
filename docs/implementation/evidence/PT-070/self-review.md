# PT-070 — Autorrevisión   `PHASE 6`
## Qué se arregló

**El alcance del grafo se calcula.**

plan-layout daba «bin» —1 archivo— mientras el registro decia «bin, docs/methodology/tools» porque PT-020 lo escribio A MANO. Cualquier instalacion nueva nacia con el defecto.

## La decisión que lo define

Excluir un directorio porque se llama «docs» es un PROXY, la misma clase de error que PT-085 corrige en SUITE-R34 y FDGE-R43. Lo que decide es si contiene codigo propio.

## Lo que aprendí escribiéndolo

Casi meto las 16 herramientas del marco instalado en el grafo de un proyecto ajeno. Solo aparecio ejecutandolo FUERA de cauce — que es exactamente para lo que PT-072 existe. Y la derivacion final coincide CARACTER POR CARACTER con lo que PT-020 escribio a mano: esa es la validacion.
