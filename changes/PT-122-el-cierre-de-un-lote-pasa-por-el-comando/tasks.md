# Tareas — `PT-122`   `PHASE 5`

| # | Qué | Dónde | Estado |
|:---|:---|:---|:---|
| 1 | `comentarioDeCierreDeLote` — puro, exportado, con la marca por construcción | `tools/tracker.mjs` | ✔ |
| 2 | Los tres desenlaces del tag | `tools/tracker.mjs` | ✔ |
| 3 | `tracker cierre` — deriva y publica | `tools/tracker.mjs` | ✔ |
| 4 | …y sin `--aplicar` no exige plataforma | `tools/tracker.mjs` | ✔ |
| 5 | El límite de `SUITE-R43`, en el mensaje | `tools/tracker.mjs` | ✔ |
| 6 | …y en `SUJETOS` | `tools/patrones.mjs` | ✔ |
| 7 | Los dieciséis casos | `tools/selftest.sh` | ✔ |

---

## Los defectos que aparecieron construyéndolo

**1 · El límite vivía sólo en el código, y `SUITE-R38` lo cazó.** La primera versión lo tenía en
`SUJETOS` y en un comentario, pero no en ningún mensaje. Un límite que vive sólo en el código
protege a quien ya está leyendo el código, **no a quien lee el rojo**. Y hubo que alinearlo
**literal**: el mensaje decía `—` donde el límite declarado decía `:`, y la comprobación compara
la cadena entera.

**2 · Dos casos míos medían el arnés, no el hecho.** Uno preguntaba a `tracker xxx` por la lista
de acciones —y sin plataforma sale antes de imprimirla—, y otro contaba los caracteres entre
`Version de la suite` y el número, que son dos asteriscos y un acento grave. Rehechos: el primero
mira el despachador; el segundo comprueba que **los tres valores aparezcan**, que es lo que el
criterio pide.

## Y la prueba inversa tuvo tres

**a · Un escenario que fallaba sobre el módulo intacto.** Comprobaba `SUJETOS`, que vive en
`patrones.mjs` y **no** en `tracker.mjs`: caía en las cinco mutaciones y las hacía parecer
correctas. Retirado — lo cubren los casos de batería.

**b · Una mutación que tocaba otro sitio.** `L.push(MARCA_AGENTE);` aparece **también** en el
constructor de la parada, y `replace` sustituye la **primera**. Anclada con el `return` que sólo
tiene el constructor del lote.

**c · Y la decimocuarta rotura de escapado.** Al anclar con dos líneas, el salto entró como
carácter literal dentro de una cadena y el arnés dejó de compilar. Se resolvió como manda
`SUITE-R59`: **componiendo** el salto, no escribiéndolo.
