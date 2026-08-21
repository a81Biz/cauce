# PT-092 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | `QA` ejecutado y `verify-qa` sin errores | E7 · E8 | `selftest.sh`: «el catalogo declara que QA no aplica» · «…y dice por que no se forzo» | `salidas/qa.txt` | VERIFICADO |
| AC-02 | `FPGE` ejecutado: `ROADMAP` con `R-NNN` trazables | E1 · E2 | `selftest.sh`: «hay ROADMAP con candidatos» · «…y todo candidato cita su evidencia» | `salidas/fpge.txt` | VERIFICADO |
| AC-03 | El roadmap **consume** los hallazgos abiertos de PTSA | E1 · E11 | `selftest.sh`: «hay ROADMAP con candidatos» · «…y tiene candidato en el roadmap» | `salidas/fpge.txt` | VERIFICADO |
| AC-04 | `FPGE-R05`: la frescura se declara en el encabezado | E3 | `selftest.sh`: «…y declara la frescura de sus fuentes» | `salidas/fpge.txt` | VERIFICADO |
| AC-05 | Las fricciones de las ejecuciones quedan escritas | E6 · E10 | `selftest.sh`: «…y dice que el orden es un juicio» · «INC-001 registrado en el ledger» | `salidas/fpge.txt` · `salidas/qa.txt` | VERIFICADO |
| AC-06 | `TD-15` con `FIDE` como único pendiente | E9 | `selftest.sh`: «TD-15 separa «no aplica» de «pendiente»» | `salidas/qa.txt` | VERIFICADO |

## `AC-01` se cumple **declarando**, y el intake lo previó

> *«Si la conclusión es que `QA` no aplica, esa es una salida legítima — pero entonces se declara
> en `CASOS-DE-USO.md` como hueco, y **no** se deja `TD-15` diciendo "nunca ejecutado", que es
> indistinguible de "no se pudo"».*

Es lo que se hizo, y es la razón de que `AC-06` exista en el mismo intake: sin él, declarar el
hueco habría dejado la deuda diciendo lo mismo de antes.

## `AC-05` recogió tres fricciones, y una es un incidente

`FPGE-R01` exige evidencia en toda línea con un `R-NNN`. Dos de los seis factores de la prioridad
son juicio. Y **`INC-001`**: ejecutar `PHASE 2` destapó que el cierre de dos hallazgos había
desaparecido diecisiete commits antes, sin que nada avisara.

**Ejecutar encuentra lo que leer no encuentra** — que es el argumento de `EP-017` entero, repetido
en la última tarea de `EP-018`.
