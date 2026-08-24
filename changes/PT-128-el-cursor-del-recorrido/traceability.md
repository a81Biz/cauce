# Trazabilidad — `PT-128`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | el nodo, su dato, de dónde y a dónde | `dice DONDE ESTAS` · `de DONDE VIENES` · `a DONDE PUEDES IR` · `con el DATO del nodo` | `selftest.sh` | `salidas/cursor.txt` |
| AC-02 | los nodos se derivan, no se escriben | `las fases se derivan de PHASES.md` | `selftest.sh` | `salidas/cursor.txt` |
| AC-03 | baja y sube: lote ↔ tarea ↔ fases | `un lote enumera su SUBARBOL` | `selftest.sh` | `salidas/cursor.txt` |
| AC-04 | garantía por **enumeración**, no consulta | `…nombrando cada nodo con su tarea y su fase` | `selftest.sh` | `salidas/cursor.txt` |
| AC-05 | `SIN EVALUAR` distinguible de visitado | `…y distingue SIN EVALUAR de visitado` | `selftest.sh` | `salidas/cursor.txt` |
| AC-06 | no decide ni avanza: informa | `el cursor NO escribe en el registro` · `…y lo DICE` | `selftest.sh` | `salidas/cursor.txt` |

**`AC-04` es el que da valor a los demás**, y es el que la prueba declarada en el intake encontró
sin cumplir: para un lote se **contaba** en vez de enumerar.
