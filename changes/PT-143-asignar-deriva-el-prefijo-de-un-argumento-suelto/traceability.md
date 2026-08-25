# Trazabilidad — `PT-143`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | El prefijo no se toma del valor de una bandera | `TS-01` `TS-02` | `selftest.sh:--tipo BUG sin prefijo ya NO crea BUG-001` | `salidas/selftest-completo.txt` |
| AC-02 | Un prefijo fuera de los declarados falla | `TS-04` `TS-05` | `selftest.sh:un prefijo que LEXICON no declara FALLA` | `salidas/selftest-completo.txt` |
| AC-03 | Sin prefijo explícito, el defecto sigue siendo `PT` | `TS-01` `TS-03` | `selftest.sh:un prefijo declarado sigue funcionando` | `salidas/selftest-completo.txt` |
| AC-04 | El resto de acciones se revisan por el mismo patrón | — enumeración declarada | — `CON_VALOR` es la fuente única | `salidas/prefijo.txt` |
| AC-05 | Ningún identificador ya asignado cambia | — `SUITE-R09` append-only | — el registro antes y después | `salidas/prefijo.txt` |

**Cinco criterios, cinco con escenario o declaración.** Ningún Orphan Criterion.

`AC-04` se cumple **por la vía de la fuente única**, y se dice: en vez de barrer todas las
acciones, la lectura del prefijo pasa a consultar `CON_VALOR`, que es donde ya vive qué banderas
llevan valor. Una lista repetida de banderas a excluir sería la copia que diverge.
