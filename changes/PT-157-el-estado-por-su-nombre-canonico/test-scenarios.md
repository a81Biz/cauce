# `PT-157` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | los cinco estados terminales por su nombre | un bloque `ESTADO` por cada uno | ninguno produce contradicción |
| TS-02 | la lista se deriva | leer el código del patrón | sale de `ESTADOS_TERMINALES`, no de un literal |
| TS-03 | una contradicción real | bloque que dice «sigue en curso» sobre un `CLOSED` | sigue saliendo — el arreglo no apaga nada |

**Dónde viven**: selftest §EP-024 · 6 casos `mlib`.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
