# PT-060 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `SESSION.json` y sus campos derivados | E1-E6 · E18-E19 | `selftest.sh`: «con marca, la sesion esta abierta» · «…y el «desde» sale de la MARCA» · «sin datos de git ⇒ SIN EVALUAR» · «sin marca, no hay sesion» · «viabilidad nombra la sesion abierta» | `salidas/ac06-dos-sesiones.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-02 | Los estados de sesión no entran en el registro | E7-E8 | `selftest.sh`: «CHECKPOINTING no es estado terminal» · «…ni estado vivo» · «HANDOFF_REQUIRED tampoco» · «ninguno es status en REGISTRY.json» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-03 | Se sobrescribe; las transiciones se apilan | E9-E12 | `selftest.sh`: «sesion abrir escribe la marca» · «abrir otra vez sobrescribe» · «…y sigue habiendo UN solo SESSION.json» · «…y dice que NO borra la marca» | `salidas/ac06-dos-sesiones.txt` | - | VERIFICADO |
| AC-04 | El handoff se deriva del checkpoint | E13-E15 | `selftest.sh`: «el handoff dice que tarea» · «…y en que fase» · «…y sobre que commit» · «…y QUE SIGUE» · «sin checkpoint lo DICE» | `salidas/ac06-dos-sesiones.txt` | - | VERIFICADO |
| AC-05 | No sustituye `HANDOFF.md` | E16-E17 | `selftest.sh`: «HANDOFF conserva sus decisiones» · «…y sus «no hacer»» · «…y «sesion cerrar» no los borra» | `salidas/ac06-dos-sesiones.txt` | - | VERIFICADO |
| AC-06 | Dos sesiones sin repetir el análisis | E20 · **ejecutado** | ejecución capturada, cinco pasos | `salidas/ac06-dos-sesiones.txt` | - | VERIFICADO |

**`AC-06` es el único del lote que no se comprueba con un caso.** Se ejecutó y está capturado: los
cinco pasos, con la salida real de cada uno. Y con su límite dicho — los cinco ocurrieron dentro de
la **misma** sesión, así que lo demostrado es que la información **basta**, no que un contexto
vacío la use bien.

**`AC-05` se verifica mirando lo que NO cambió.** El diff de `HANDOFF.md` tiene exactamente una
línea: `actualizado:`, y la puso `tracker avanzar`, no `sesion cerrar`. Las `decisiones`, los `no
hacer`, `tarea`, `siguiente` y `compuerta` quedaron intactos — que es lo que se quería proteger.
