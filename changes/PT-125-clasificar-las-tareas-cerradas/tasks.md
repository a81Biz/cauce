# Tareas — `PT-125`   `PHASE 5`

| # | Qué | Dónde | Estado |
|:---|:---|:---|:---|
| 1 | Extracción del material: las frases con que el ledger se autodescribe | `tools/eventos.mjs` | ✔ |
| 2 | Las diecisiete señas, apretadas a frases autodescriptivas | `tools/eventos.mjs` | ✔ |
| 3 | La cita **literal** de cada señal | `tools/eventos.mjs` | ✔ |
| 4 | El ordinal que la propia cita declara, cuando lo declara | `tools/eventos.mjs` | ✔ |
| 5 | Revisión humana: `INSTANCIA` vs `MENCION`, catorce corregidas con su motivo | `tools/eventos.mjs` | ✔ |
| 6 | Un registro por entrada **recorrida**, con sus tres estados | `EVENTOS.jsonl` | ✔ |
| 7 | La diferencia de denominador, en la cabecera del archivo | `EVENTOS.jsonl` | ✔ |
| 8 | `INCIDENTS.log` recorrido, y los cinco `INC` ausentes declarados | `EVENTOS.jsonl` | ✔ |

---

## Los tres defectos que aparecieron construyéndolo

**1 · El primer matcher salió inflado.** 43 `CE-006` y 41 `CE-008` en 159 entradas. La causa:
`a mano` y `diverg` aparecen en cualquier frase que explique por qué algo se automatizó. Apretado
a frases autodescriptivas: 70 señales.

**2 · Catorce de las 70 eran menciones, no instancias.** `PT-127` dice literalmente *«**no** es el
acto fuera del comando»* y quedaba clasificada como tal. Nombrar una clase no es incurrir en ella
— es `CE-001` cometido en la tarea que existe para contar instancias de `CE-001`.

**3 · La clave `(tarea, clase)` no distinguía dos entradas de la misma tarea.** `EP-019` tiene
tres —el cierre y dos `CORRIGE`— y la lista de menciones marcaba **las dos** de `CE-002` cuando
una sí es instancia. Se afinó con un fragmento de la cita, que es lo único que las separa.

**Y una rotura de escapado más**, la de esta sesión: el extractor de ordinales devolvía **1** de
26 porque un `\b` escrito a través de un heredoc llegó como barra literal seguida de `b`. Es
`CE-002`, y la respuesta fue la que `SUITE-R59` prescribe: escribir el archivo, no pasarlo por la
línea de comandos.
