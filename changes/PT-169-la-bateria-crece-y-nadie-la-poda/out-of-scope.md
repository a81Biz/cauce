# `PT-169` · `out-of-scope.md` — `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Con secciones acotadas, órdenes de primer nivel escriben a `stderr` sobre el esqueleto | Hay dos salidas —poblar el esqueleto o silenciar— y elegir exige auditar 61 sitios | `PT-171` |
| `AC-03`: declarar dos casos que prueban lo mismo por caminos distintos | Salió del alcance por la Revisión 1: sin el barrido de `PT-167`, la lista mezclaría duplicados con casos que **deliberadamente** miran la misma salida desde dos ángulos | `PT-167` |
| Buscar los casos **invertidos** | Es su propia tarea, y corre **después**: sobre el árbol ya podado | `PT-167` |
| El suelo de 47 s: 211 reconstrucciones de un árbol inerte | Se intentó, cambió el universo de casos de 1749 a 1730, y se revirtió. Exige saber cuál depende de la frescura | — |
| Retirar casos | La tarea entrega el **mecanismo y la regla**; qué se retira lo decide quien pode, y `SUITE-R61` lo obliga a publicarlo | — |
| Paralelizar la batería | Repartir el trabajo que no debería existir es esconderlo | — |
| Convertir los 61 sitios a `muta` | Cambio grande y ciego: rompería casos por razones que nadie sabría atribuir. La adopción **crece y se declara** | — |
