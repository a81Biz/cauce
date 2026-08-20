# PT-086 — Autorrevisión   `PHASE 6`
## Qué se arregló

**La bateria corre lo afectado.**

--solo NO servia: filtra ASERCIONES y no ANDAMIAJE. 211 build_fixture fuera de los casos, y una corrida filtrada de UN caso costaba 171 s de los 600.

## La decisión que lo define

El mapa se DERIVA del propio arnes. Y una seccion que no nombra ninguna herramienta corre SIEMPRE: el lado seguro del desconocimiento es correr de mas.

## Lo que aprendí escribiéndolo

Escribi la guarda con la forma que sustituye tambien el valor vacio, y NO DISPARABA NUNCA: 822 casos corrian igual. Sintacticamente correcta, semanticamente inerte — el patron que PT-067 encontro en audit.
