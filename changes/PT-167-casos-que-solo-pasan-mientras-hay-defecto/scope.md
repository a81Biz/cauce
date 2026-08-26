# `PT-167` · `scope.md` — `PHASE 2-R`

## Qué se toca

| Archivo | Qué cambia |
|:---|:---|
| `patrones.mjs` | `identificadoresDeHueco()` · `casosInvertidos()` |
| `audit.mjs` | emite `SUITE-R61` con la lista de candidatos |
| `selftest.sh` | ocho casos: cuatro que cazan los conocidos, tres que **no** cazan los legítimos, uno sobre el árbol real |

## Qué NO se toca

**Arreglar los casos que el barrido encuentre.** Señalar y arreglar son dos cosas. Hoy el árbol
real da **cero**, porque `PT-156` ya reescribió los cuatro conocidos.

**La batería.** `PT-169` la abarató y podó primero, a propósito: este barrido corre sobre el árbol
ya ordenado.
