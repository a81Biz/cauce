# PT-077 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | `avanzar` se detiene ante un `STATE_MISMATCH` | E1 | checkpoint alterado ⇒ no avanza | `salidas/mismatch.txt` | PENDIENTE |
| AC-02 | …y dice la **rama real**, no el código de una función | E1 | el mensaje nombra la rama | `salidas/mismatch.txt` | PENDIENTE |
| AC-03 | Sin checkpoint **no** bloquea | E2 | no tener foto no es tener una mala | `salidas/mismatch.txt` | PENDIENTE |
| AC-04 | No repara el checkpoint: propone el comando | E1 | decidir cuál manda es de `SUITE-R06` | `salidas/mismatch.txt` | PENDIENTE |
| AC-05 | Usa la **misma** función que `siguiente` | E1 | `estadoDelArbol`, no un criterio nuevo | `salidas/mismatch.txt` | PENDIENTE |

## `AC-02` salió de un error mío

La primera versión pasaba las dependencias como funciones cuando el contrato quiere valores. El
mensaje imprimía `real () => gitDe([...])` en lugar de la rama. Bloqueaba correctamente y
**explicaba mal**, que es media compuerta: quien la recibe no puede decidir sin la verdad.

## `AC-03` evita que la guarda se apague sola

Bloquear cuando no hay checkpoint impediría la primera transición de toda tarea nueva — y una
comprobación que estorba siempre se termina desactivando. Es la misma decisión que `PT-085` toma
con `SUSPECT` y con el criterio de contradicción.
