# Tareas — `PT-127`   `PHASE 5`

| # | Qué | Dónde | Estado |
|:---|:---|:---|:---|
| 1 | `RUTAS_GOBERNADAS` — las cuatro rutas que el marco gobierna | `tools/patrones.mjs` | ✔ |
| 2 | `TIPOS_DE_COMMIT` — los seis de `FDGE-R19`, una sola vez | `tools/patrones.mjs` | ✔ |
| 3 | `commitSinAllocation` — pura, cinco clases y tres salidas limpias | `tools/patrones.mjs` | ✔ |
| 4 | `clasificaRodeo` — `ELEGIDO` / `FORZADO`, troceando por entrada | `tools/patrones.mjs` | ✔ |
| 5 | `CAR.SEPARADOR` y `CAR.UNIDAD` — los dos separadores ASCII de `git log` | `tools/patrones.mjs` | ✔ |
| 6 | `checkTrabajoSinAllocation` — lee git, agrupa e informa | `tools/verify-fdge.mjs` | ✔ |
| 7 | Los once casos de batería | `tools/selftest.sh` | ✔ |
| 8 | Los dos límites, declarados en `design.md` §5 y en `AC-05` | `changes/PT-127-*/` | ✔ |

---

## Los cuatro defectos que aparecieron **construyendo** esto

Se listan porque son la evidencia de que la comprobación se comprobó, y no sólo se escribió.

**1 · El parseo veía UN commit de sesenta.** El formato era `%H%x1f%s%x1e` — separador al
**final**. Con `--name-only` los archivos se escriben *después* del formato, así que un separador
final deja la cabecera del commit siguiente pegada al bloque anterior. Lo delató una salida que
decía `1 commit(s) recientes` sobre una ventana de 60.

**2 · `merge` en la lista de tipos.** Legislar desde una herramienta lo que `FDGE-R19` no dice.
Sustituido por el número de padres.

**3 · La clasificación mentía en 34 de 34.** `clasificaRodeo` buscaba el identificador y la
palabra «excepción» en el ledger **entero**. Como el documento menciona `EP-019` en un sitio y
«excepción` en otro, **todos** los hallazgos salían `FORZADO` — un motivo plausible y falso,
que además repartía la culpa al revés.

**4 · Y el arreglo del 3 tampoco troceaba.** `split(/\b(?=## )/)` devuelve **una** entrada de
226. Medirlo fue lo que lo vio; leerlo no lo habría visto nunca.

El cuarto es el que importa: **el arreglo de un defecto de laxitud era igual de laxo, y parecía
correcto.** Por eso `TS-10` existe y por eso mide el troceo en vez de confiar en él.
