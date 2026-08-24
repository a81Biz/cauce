# Escenarios de test — `PT-127`

> `FDGE-R17`: rojo primero, y **válido**. Un escenario que no puede fallar no prueba nada.

| TS | Escenario | Esperado |
|:---|:---|:---|
| `TS-01` | commit con `feat: PT-127`, `PT-127` en el registro, toca `docs/methodology/` | **sin hallazgo** |
| `TS-02` | commit con asunto informe, toca sólo `README.md` y `package.json` | **sin hallazgo** — el negativo |
| `TS-03` | commit con `docs: EP-020`, toca `changes/` | `NO_ES_PT` |
| `TS-04` | commit con `fix: PT-999`, `PT-999` no está en el registro | `NO_VIVO` |
| `TS-05` | commit con `fix: PT-127`, pero no se puede decidir si vive | `SIN_EVALUAR` |
| `TS-06` | commit con **dos padres** y asunto `Merge pull request #215`, toca `RULES.md` | **sin hallazgo** |
| `TS-07` | `TIPOS_DE_COMMIT` expone exactamente los seis de `FDGE-R19` | `feat fix refactor test docs chore` |
| `TS-08` | ledger sin excepción que nombre el identificador | `ELEGIDO` |
| `TS-09` | ledger con identificador **y** `FDGE-R19` **y** «excepción» en la **misma** entrada | `FORZADO` |
| `TS-10` | la palabra en una entrada y el identificador en **otra** | `ELEGIDO` — el troceo trocea |
| `TS-11` | `verify-fdge` ejecuta la comprobación y agrupa | aparece `commit(s):` con los sha |

---

## Los tres que existen porque algo falló al escribirlos

**`TS-06`** — la primera versión metía `merge` en la lista de tipos. Ese caso habría pasado igual
y por la razón equivocada: no se estaría comprobando la forma del commit, sino un vocabulario
inventado. El caso ejerce `padres: 2` **con** un asunto que ningún tipo casa, así que sólo pasa
si la exclusión es por forma.

**`TS-10`** — la regresión que casi se publica. El troceo del ledger era
`split(/\b(?=## )/)`, que **no trocea**: un límite de palabra no cae entre un salto de línea y
una almohadilla, porque las dos son no-palabra. 226 entradas salían como **una**, y «la misma
entrada» volvía a ser el documento entero — es decir, exactamente la laxitud que el troceo existía
para quitar. Lo vio medir el troceo, no leerlo.

**`TS-02`** — sin él, una comprobación que marcase **todo** pasaría `TS-03`, `TS-04` y `TS-05`
sin despeinarse. Es el caso que hace válidos a los otros.

---

## Prueba inversa

Quitando cada cambio por separado:

| Se quita | Qué se pone rojo |
|:---|:---|
| `commitSinAllocation` de `patrones.mjs` | `TS-01`..`TS-07` — no importa |
| la exclusión por número de padres | `TS-06` |
| `RUTAS_GOBERNADAS` (marcar todo) | `TS-02` |
| el troceo por encabezado en `clasificaRodeo` | `TS-10` |
| `checkTrabajoSinAllocation` de `verify-fdge` | `TS-11` |

Cinco cambios, cinco rojos distintos. Ninguno sale cero.
