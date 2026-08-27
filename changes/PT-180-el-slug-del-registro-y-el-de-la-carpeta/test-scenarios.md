# `PT-180` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | slug distinto en registro y disco | fixture con los dos nombres | la carpeta se encuentra |
| TS-02 | los dos nombres | leer la salida | se nombran ambos, citando `CE-008` |
| TS-03 | sin divergencia | fixture con los dos iguales | **no se dice nada** |
| TS-04 | carpeta inexistente | un `PT` sin carpeta | devuelve la ruta esperada, no una inventada |
| TS-05 | el árbol real | `tracker integrar PT-155 --aplicar` | pasa a `INTEGRATED` |
| TS-06 | ningún sitio a mano | buscar `join(ROOT,'changes'` fuera de `carpetaDe` | sólo dentro del propio ayudante |

**Dónde viven**: selftest §EP-024 · 3 casos sobre fixture propio.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
