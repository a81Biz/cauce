# Trazabilidad — `PT-135`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | El lint detecta un helper usado como **línea de montaje**, no sólo como comando de un caso | `TS-01` `TS-02` | `selftest.sh:el lint mira los usos de MONTAJE` · `…y tambien tras un «;» o un «&&»` | `salidas/casos-135.txt` · `salidas/lint-antes.txt` |
| AC-02 | La lista de helpers se **deriva** del archivo, no se escribe a mano | `TS-03` `TS-04` `TS-05` | `selftest.sh:la lista de helpers NO esta escrita a mano` · `…se deriva de las definiciones del archivo` | `salidas/casos-135.txt` |
| AC-03 | Los usos anteriores a la definición que existían quedan **enumerados**, y arreglados o declarados uno a uno | `TS-08` `TS-09` `TS-12` | `selftest.sh:git_fixture y con_phase viven junto a build_fixture` · `…y git_fixture conserva su cuerpo` · `el lint sale limpio sobre el arbol real` | `salidas/lint-antes.txt` · `salidas/lint-despues.txt` |
| AC-04 | Un `command not found` en la salida de la batería **no** convive con un `OK` | `TS-10` `TS-11` `TS-12` | `selftest.sh:el caso del lint ya no casa las dos respuestas` · `…exige «ningun helper», que es una sola` | `salidas/selftest-completo.txt` |
| AC-05 | El caso de `PT-109` afectado se comprueba con su montaje **corriendo**, y sigue pasando — o se dice que no | `TS-13` | `selftest.sh:el caso de PT-109 corre con su fixture montado` | `salidas/casos-135.txt` · `salidas/selftest-completo.txt` |

**Cinco criterios, cinco con `TS`, cinco con evidencia ejecutada.** Ningún Orphan Criterion.

---

## `AC-03` enumera **dos**, y los dos se arreglan

`git_fixture` (línea 2402, definido en la 5160) y `con_phase` (2404, definido en la 6754). No se
declaran: se mueven junto a `build_fixture`, y el lint sale limpio después.

Los **tres falsos positivos** que salieron al derivar la lista —`M`, `A`, `OTRO`— no eran usos
anteriores: eran texto dentro de comillas y dentro de un heredoc. No entran en la enumeración
porque no lo son, y por eso el anclaje es parte del arreglo y no un extra.

## `AC-04` se cumple por la vía del caso, y se dice cuál

El criterio pide que un `command not found` no conviva con un `OK`. La implementación no captura
la salida de la batería desde dentro —eso exigiría que el arnés se leyera a sí mismo—: lo que se
hace es que **el caso que vigila el orden pueda fallar**. Con `ningun helper` como patrón, un
helper mal colocado pone la corrida en rojo, y entonces `OK` no aparece.

Se deja escrito porque son dos cosas distintas, y la segunda es la que está.

## `AC-05` se ejecutó, no se supuso

El caso de `PT-109` llevaba un lote entero pasando **sin** su fixture. «Sigue pasando» había que
comprobarlo. Se comprobó en la corrida completa: pasa **con** `git init` y **con** `phase: 8`.

## Lo que esta trazabilidad **no** establece

- **Que no queden helpers mal colocados en otros archivos.** La batería es el único con este
  patrón; extenderlo sin medirlo sería prometer lo no medido.
- **Que la heurística del lint sea completa.** Reconoce dos formas de invocar un helper; una
  tercera —dentro de una sustitución de comando, por ejemplo— no entra.
- **Que `CE-004` esté cerrada.** Esta tarea le quita **una** instancia y deja el mecanismo que
  impide la siguiente. Sigue siendo la clase más repetida del ledger y sin regla que la reclame.
