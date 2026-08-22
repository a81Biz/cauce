# Autorrevisión — `PT-102`

## Lo que establecí

Que `version.mjs` no puede dar por alineado lo que no sabe leer, y que la forma de declarar una
versión vive ahora en `patrones.mjs` con sus ejemplos. Cuatro declaraciones muertas alineadas;
la plantilla y la prosa, intactas.

## Lo que NO establecí

- **Que no exista una tercera forma.** Se conocen dos, se miden cinco sitios.
- **Que ningún proyecto destino ajeno use otra.** No se han inspeccionado.

## Lo que salió mal, y qué lo enseñó

**El contrato de `patrones.mjs` cazó un defecto en mi propio arreglo.** Uno de los `casa` falló:
el documento que viaja declara la versión dentro de una cita (`> Suite version: …`) y el ancla no
admitía el `>`. **Eso es exactamente lo que un patrón local no puede hacer**: no tiene ejemplos
contra los que fallar. La causa de la tarea me corrigió mientras la arreglaba.

**La inversa salió en cero para el ancla y dijo por qué.** El negativo de la prosa lo protegía la
exclusión del `CHANGELOG`, no el ancla — así que el ancla no la probaba nada. Faltaba un caso, no
sobraba el cambio.

**Sexta rotura de escapado de la sesión.** El intake no se pudo escribir por un heredoc; se
escribió sin pasar por la capa del shell. Es lo que `PT-101` persigue, ocurrido dentro de la
sesión que la abrió.

## Lo que el grafo dio y el `grep` no

`version.mjs` era la herramienta que **menos** dependía de `patrones.mjs` —dos aristas frente a
sesenta y ocho— y la única con un patrón crítico en local. La causa estaba en la **estructura**.

Y el grafo llevaba `SUSPECT` toda la sesión sin que nadie lo mirara. Lo señaló el firmante.
