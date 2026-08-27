# `PT-184` · `test-scenarios.md`

| TS | Escenario | Cómo se ejecuta | Qué tiene que salir |
|:---|:---|:---|:---|
| TS-01 | rama publicada | `origin/chore/alberto/PT-1-x` | queda `chore/alberto/PT-1-x` |
| TS-02 | forma larga | `remotes/origin/chore/alberto/PT-1-x` | queda igual |
| TS-03 | rama local de tres | `chore/alberto/PT-1-x` | **conserva** el primer nivel |
| TS-04 | rama de dos niveles | `cauce/alberto` | queda igual |
| TS-05 | ninguna rama conserva prefijo | sobre las ramas que `git` lista aquí | «NINGUNA CONSERVA PREFIJO», en cualquier clon |
| TS-06 | una desviación real | una rama que no casa la derivada | sigue reportándose |

**Dónde viven**: selftest §EP-024 · 5 casos.

Los escenarios que comprueban lo que la herramienta **rechaza** son mayoría a propósito: es
donde está el riesgo de que un arreglo se convierta en «acepta siempre», y `RULE-02` pide que
el fallo siga siendo distinguible del acierto.
