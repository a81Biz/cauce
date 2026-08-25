# Estrategia — `PT-141`   `PHASE 3`

## El camino elegido

Arreglar la línea **y** enumerar la forma en `patrones.mjs`, para que `verify-fdge` la mire en
cada corrida.

## Los caminos descartados, con su por qué

**1 · Arreglar sólo la línea.** Descartado: dejaría las que hubiera. Enumerarlas dice cuántas
son, y si son cero **también es un dato**.

**2 · Un linter de JavaScript de verdad.** Descartado: añadir una dependencia para esto sería
desproporcionado y el marco no tiene ninguna. Se reconoce **la forma que ya mordió** y se declara
que es una heurística (`SUITE-R26`).

**3 · Marcar todo identificador no resuelto.** Descartado, y la primera versión lo hizo: nueve
hallazgos, seis falsos. Un detector que grita así se apaga, y entonces no detecta nada.

**4 · Hacer atómico `abrir`.** Descartado: `PT-132` ya trabajó eso y el contrato es «validar todo
→ escribir lo reversible → publicar lo irreversible». Aquí se arregla **el manejador**.

## Cómo se verifica

Ocho casos: la forma rota, la sana, lo declarado dentro del bloque, lo declarado en la función que
envuelve, una cadena dentro de la interpolación, un comentario que explica el defecto, el `null`
sin fuentes, y **el árbol real**.
