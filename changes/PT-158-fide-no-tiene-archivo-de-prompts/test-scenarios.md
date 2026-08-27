# `PT-158` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | `LEX-R15` admite la excepción declarada | buscar la forma exacta en `LEXICON` | «o declara por qué no puede tenerlo» |
| TS-02 | `FIDE` declara por qué | leer el documento del componente | la razón está escrita, no supuesta |
| TS-03 | no se fabricó un archivo vacío | listar `FIDE/` | no existe `FIDE-Prompts.md` de relleno |

**Dónde viven**: selftest §EP-024 · 2 casos · `verify-suite` en la corrida.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
