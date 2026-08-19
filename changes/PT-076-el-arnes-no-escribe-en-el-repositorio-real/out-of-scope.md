# PT-076 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Borrar las 140 entradas del `SESSION_LOG` | — |
| Eliminar `TRR` | — |
| Que `viabilidad` lea la marca correcta cuando hay varias personas | `PT-068` |
| Que el veredicto de viabilidad se espeje en la plataforma | `PT-074` |
| Rehacer los catorce veredictos ya registrados | `PT-074` |
| Detectar una acción que escriba **indirectamente** | — |

**La primera lleva `—` y no aplaza nada:** `SUITE-R09` es append-only. El arreglo es que no
crezcan más; lo escrito se declara (`AC-05`). Borrarlo sería tocar lo que se audita.

**La segunda tampoco:** `TRR` es correcto y necesario. `coste` sobre el fixture mediría cuatro
tareas de mentira.

**La tercera y la cuarta** son los dos eslabones siguientes de la misma cadena, y por eso van
juntas en el orden 3-4-5 del lote: sin esta, las otras dos arreglan algo que la batería vuelve a
romper en la siguiente pasada.

**La quinta:** los veredictos se vuelven a registrar cuando la cadena cierre, y `medido_en` deja
constancia de contra qué se midió cada vez. Rehacerlos ahora sería medirlos otra vez contra una
base todavía rota.

**La sexta lleva `—` y es un límite, no un aplazamiento:** `AC-04` deriva del texto de cada
función si llama a `writeFileSync`. Una acción que escriba a través de otra no se detecta. Hoy
ninguna lo hace. Se declara en vez de fingir que la comprobación cubre más de lo que cubre —es
lo que `PT-051` dejó escrito de la heurística equivalente en `regla.mjs`.
