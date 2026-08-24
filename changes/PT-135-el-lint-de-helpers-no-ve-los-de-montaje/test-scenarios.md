# Escenarios de test — `PT-135`

> `FDGE-R17`: rojo primero, y **válido**.

| TS | Escenario | Esperado |
|:---|:---|:---|
| `TS-01` | El lint mira los usos de **montaje** | `uso_montaje` |
| `TS-02` | …y también tras un `;` o un `&&` | la expresión los contempla |
| `TS-03` | La lista de helpers **no** está escrita a mano | ausencia de la lista literal |
| `TS-04` | …se deriva de las definiciones del archivo | la derivación está |
| `TS-05` | …y el lint se **excluye a sí mismo** | `grep -v "^lint_"` |
| `TS-06` | La posición del comando se ancla con las comillas | la expresión las lleva |
| `TS-07` | …y las líneas de heredoc se descartan | el filtro está |
| `TS-08` | `git_fixture` y `con_phase` viven junto a `build_fixture` | `JUNTOS` |
| `TS-09` | …y `git_fixture` conserva su **cuerpo** | `git init -q` |
| `TS-10` | El caso del lint ya no casa las dos respuestas | ausencia de `helper\|ninguno` |
| `TS-11` | …exige «ningún helper», que es una sola | `ningun helper` |
| `TS-12` | El lint sale limpio sobre el árbol real | `ningun helper usado antes` |
| `TS-13` | El caso de `PT-109` corre **con su fixture montado** | `AVISO AHORA, ERROR EN G4` |

---

## Los que existen porque algo falló

**`TS-09`** — el más caro de escribir, porque nació de romperlo. La primera rutina que movía las
definiciones decidía si una era de una línea mirando si la línea **termina** en `{`. La de
`git_fixture` termina en un **comentario**, así que se llevó la cabecera y **dejó el cuerpo
huérfano**: la batería murió en silencio —código 0, sin línea de resumen— en el caso siguiente.

Es el mismo defecto que esta tarea persigue —leer el final de la línea en vez del hecho—,
cometido al arreglarlo.

**`TS-13`** — es `AC-05`, y no se da por bueno: se **ejecuta**. Ese caso llevaba un lote entero
pasando sin su fixture, así que «sigue pasando» había que comprobarlo, no suponerlo. Si hubiera
fallado, tocaba decirlo.

**`TS-10` y `TS-11`** — el caso del lint casaba `helper\|ninguno`, es decir **las dos** respuestas
posibles: no podía fallar. Un caso que no puede fallar ocupa el sitio del que haría falta
(`PT-023`), y aquí tapó dos helpers mal colocados durante un lote entero.

**`TS-06` y `TS-07`** — nacieron de los tres falsos positivos que salieron al derivar la lista:
`A` dentro del patrón de un caso, `OTRO` dentro del nombre de otro, `M` dentro de un heredoc.
Misma raíz que `PT-130`, que se acababa de arreglar.

---

## Prueba inversa

Se comprueba **quitando** cada pieza y viendo qué se pierde:

| Se quita | Qué se pierde |
|:---|:---|
| El reconocimiento de usos de montaje | `git_fixture` y `con_phase` vuelven a ser invisibles |
| La derivación de la lista | los dos helpers no están en la lista escrita a mano |
| El anclaje por comillas | reaparecen `A` y `OTRO` |
| El filtro de heredocs | reaparece `M` |
| El patrón estricto del caso | el caso vuelve a no poder fallar |

**Las cinco están medidas en la construcción**, y las tres últimas literalmente: la versión sin
anclaje dio `M`, `A` y `OTRO`, y la versión sin derivar no dio ninguno de los dos reales.
