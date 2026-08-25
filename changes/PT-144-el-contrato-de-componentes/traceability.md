# PT-144 · `traceability.md` — `FDGE-R15`

> `AC` y `TS` se rellenan en `PHASE 4`. **`Test` y `Evidencia` desde `PHASE 6`** — hasta entonces
> van vacíos a propósito: rellenarlos antes sería afirmar una prueba que no se ha ejecutado.

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `patrones.mjs` exporta los seis componentes y las diez familias, con todos sus campos | TS-01 | `verify-patrones.mjs` · bloque `PT-144` | `evidence/PT-144/verify-patrones.out` | n/a | `CUMPLIDO` |
| AC-02 | Los valores coinciden con los **quince** sitios actuales, campo a campo | TS-02 · TS-03 · TS-04 · TS-05 · TS-06 · TS-07 | `rc03-comparacion.mjs` | `evidence/PT-144/rc03.out` — 20 comparaciones, 0 discrepancias | n/a | `CUMPLIDO` |
| AC-03 | `verify-patrones` comprueba el contrato con aserciones propias y **falla** al romperlo | TS-08 | `ts08.sh` — 7 casos | `evidence/PT-144/ts08.out` | n/a | `CUMPLIDO` |
| AC-04 | Ninguna herramienta cambia de comportamiento | TS-09 | `build-core --check` · `npm run verify` | `evidence/PT-144/core-check.out` · `verify.out` | n/a | `EN VALIDACIÓN` |
| AC-05 | Cada valor declara de dónde sale, y `LEXICON` sigue siendo su fuente | TS-10 | inspección del comentario de contrato | el propio `patrones.mjs` | n/a | `CUMPLIDO` |

**`AC-02` dice quince y el intake decía catorce.** El sitio quince —`verify-suite.mjs:708`, la
alternancia **incompleta**— lo destapó `RC-03` al extraer los literales de los archivos en vez de
copiarlos. Está declarado en la parada de [#279](https://github.com/a81Biz/cauce/issues/279) con
su desenlace, y no detiene el lote: vive en el archivo que ya era de `PT-145`.

**`AC-04` no se marca `CUMPLIDO` hasta tener el exit code de la batería.** `build-core --check`
ya dio `CORE.md sincronizado` y `CORE-PTSA.md sincronizado`, y la primera corrida completa dejó
**un** rojo —`FND-R14`, las cifras de `inventory/services.md`— que era **correcto**: los tres
archivos que esta tarea hizo crecer dejaron el inventario diciendo otra cosa. Recalculadas con
`tracker inventario --aplicar`, que es quien las deriva (`RULE-01`).

La corrida que las confirma está en curso. Marcar `CUMPLIDO` antes de su `EXIT` sería afirmar
una prueba que no ha terminado — y hoy ya se leyó un `0` de un `grep` como si fuera de `verify`.

**`Caso QA` es `n/a` en las cinco filas y no es un descuido.** `QA-R01` dice que `FQAGE` opera
**solo desde el navegador** y este cambio no tiene interfaz: `CASOS-DE-USO.md` ya declara que
`QA` no aplica a este paquete, y lo declara en vez de forzarlo. Un caso de QA sin navegador no es
un QA relajado — es otra cosa con el mismo nombre.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | `patrones.mjs` sigue exportando todo lo que exportaba | `npm run verify`, que ejecuta los 8 importadores | `EN CURSO` |
| RC-02 | `verify-patrones` sigue comprobando `PATRONES` y `selloDe` | 12 patrones · **78** comprobaciones (antes 52) — el recuento **sube**, no baja | `CUMPLIDO` |
| RC-03 | El contrato coincide con los sitios reales | `rc03-comparacion.mjs` — extrae de los archivos, no copia | `CUMPLIDO` |
| RC-04 | Romper un campo hace fallar el verificador | `ts08.sh` — 7 casos, todos por **aserción** | `CUMPLIDO` |

### Lo que `RC-04` encontró, y que es su justificación entera

En su primera ejecución, **seis de siete casos fallaron correctamente y uno pasó en verde**:
duplicar el `orden` de una familia. `ordenDePrefijos()` ordena de forma estable, así que dos
familias con el mismo número conservan su posición y la secuencia emitida no cambiaba — la
aserción de orden no lo veía.

Estaba **especificado** en `design.md` §6 —«orden con huecos o repetido → falla»— y no se había
escrito. **Lo encontró romper el contrato a propósito, no leerlo.** Sin `RC-04`, ese agujero
habría viajado hasta que alguien reordenara `FAMILIAS` y `CORE.md` saliera distinto sin que nada
avisara.
