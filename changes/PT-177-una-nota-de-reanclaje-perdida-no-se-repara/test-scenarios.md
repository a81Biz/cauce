# `PT-177` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | la nota que falta | `reanclar PT-161 --fase 7` | la cuenta pasa de 6/7 a 7/7 |
| TS-02 | una fase que no ha ocurrido | `--fase 9` sobre un `PHASE 8` | se niega, citando `LEX-R30` |
| TS-03 | sin déficit | `reanclar` sobre quien ya cumple | no publica nada |
| TS-04 | sin poder contar | una tarea sin issue | no publica: `RULE-06` |
| TS-05 | el cuerpo publicado | leer la nota en el issue | declara que **repara una pérdida** |
| TS-06 | la fase no se mueve | registro antes y después | idéntica |

**Dónde viven**: selftest §EP-024 · 4 casos sobre fixture propio.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
