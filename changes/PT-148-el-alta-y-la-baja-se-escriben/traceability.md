# PT-148 · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `LEXICON` declara el contrato de componente y sus campos | TS-05 | `verify-suite` | `evidence/PT-148/salidas/core-diff.out` | n/a | `CUMPLIDO` |
| AC-02 | `RULES.md` tiene la regla, con ID, severidad y propietario único | TS-06 | `regla.mjs SUITE-R60` · `verify-suite` | `evidence/PT-148/salidas/core-diff.out` | n/a | `CUMPLIDO` |
| AC-03 | `CASOS-DE-USO` tiene la fila de alta y la de baja, **citando** la regla | TS-07 | `verify-suite` · lectura del formato | `evidence/PT-148/salidas/core-diff.out` | n/a | `CUMPLIDO` |
| AC-04 | Si la regla es `CHECK`, **existe el script que puede fallar** (`SUITE-R38`) | TS-01 · TS-02 · TS-03 · TS-04 | `selftest.sh` ×7 | `evidence/PT-148/salidas/selftest-caza.out` · `selftest-rutas.out` · `barrido-*.out` | n/a | `CUMPLIDO` |
| AC-05 | `CORE.md` y `CORE-PTSA.md` regenerados, no editados | TS-08 | `build-core --check` · **lectura del `diff`** | `evidence/PT-148/salidas/build-core.out` · `core-diff.out` | n/a | `CUMPLIDO` |

**`AC-04` es el que costó, y su criterio no es que el barrido cace: es que NO cace comentarios.**
La primera versión cazaba **33 sitios** y **nueve eran legítimos**. Cada exclusión sale de un
falso positivo real, y hay **cuatro casos negativos permanentes** para que nadie «mejore» el
barrido hasta hacerlo insufrible — un verificador desactivado es peor que ninguno.

**`AC-05` no era «sin errores»: era leer el `diff`.** Y leerlo destapó que `LEX-R33` y `LEX-R34`
ya existían desde `PT-137` y `PT-138`: al regenerar, **las dos reglas viejas desaparecieron de
`CORE.md`**. Con `build-core --check` en `EXIT=0` habría pasado.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | `CORE` cambia **sólo** por la regla y el vocabulario nuevos | lectura del `diff` | `CUMPLIDO` |
| RC-02 | Ninguna regla existente cambia de enunciado ni de severidad | `verify-suite` (`SUITE-R14`) | `CUMPLIDO` |
| RC-03 | El vocabulario nuevo no colisiona | `verify-suite` | `CUMPLIDO` |
| RC-04 | La regla nueva **puede fallar** | los siete casos permanentes | `CUMPLIDO` |

## Lo que esta tarea destapó, y **tiene tarea**

- **`PT-163`** — `SUITE-R14` dice que `verify-suite` *«rechaza cualquier definición duplicada»* y
  **no cazó** dos reglas definidas dos veces **dentro del mismo documento**: `definidasDosVeces()`
  compara **entre** documentos, porque la regla dice «en dos documentos».
- **`PT-161`** — `CASOS-DE-USO` afirma ser un «contrato de cobertura» y nada lo comprueba. Ha
  fallado dos veces en este trabajo.

Las dos enlazadas a su parada con `--desenlace abre`.
