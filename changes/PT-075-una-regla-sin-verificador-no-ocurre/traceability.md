# PT-075 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | La viabilidad tiene fase que la invoca y algo cae si desaparece | E1 · E2 | `selftest.sh`: «PHASE 4 cita la viabilidad» · «…y el prompt de G2 tambien» · «…y la regla existe con su severidad» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-02 | El veredicto queda registrado y `verify-fdge` lo exige | E3 · E4 · E5 | `selftest.sh`: «sin viabilidad registrada, G2 falla» · «…pero antes de G2 solo avisa» · «con viabilidad registrada, G2 pasa» | `salidas/verify-pt075.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-03 | Un acto del agente hacia la plataforma se detecta | E6 · E8 · E9 · E10 · E11 | `selftest.sh`: «UNSAFE en PHASE 5 detiene» · «un PT escrito en la rama de integracion falla» · «…pero lo integrado por su PR no» · «…y sin rama declarada tampoco se acusa» · «en PHASE 9 sin acciones-humanas.md, falla» | `salidas/verify-pt075.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-04 | Las dos reglas salen de la lista de las que nada ejecuta | E12 | `audit --sin-verificar` | `salidas/audit-sin-verificar.txt` | - | VERIFICADO |
| AC-05 | La comprobación inversa está hecha | inversa | revertidos los tres bloques, caen `E3`, `E8` y `E11` | `salidas/inversa.txt` | - | VERIFICADO |
| AC-06 | No se inventa una comprobación que no puede funcionar | E9 · E10 · `TD-14` | `selftest.sh`: los dos casos que impiden el falso positivo · `TD-14` en `10-Technical-Debt` | `salidas/inversa.txt` | - | VERIFICADO CON LÍMITE |

## `AC-06` se declara **con límite**, y el límite es el hallazgo de la tarea

`E9` y `E10` prueban que el verificador **no acusa** a trabajo correcto. Existen porque su
primera ejecución **sí lo acusó**: señaló los dos commits de `PHASE 2`-`4` de esta misma tarea,
que están legítimamente en la rama de integración porque la rama efímera nace en `PHASE 5`
(`FDGE-R19`). Se corrigió acotando el rango a `<rama-del-PT>..<integración>`.

Lo que **no** cubre: que un verificador correcto hoy no produzca falsos positivos en una
topología que este repositorio no tiene. `PT-072` —el proyecto nuevo— es la primera ocasión de
comprobarlo fuera de aquí, y si aparece uno, es un defecto de esta tarea.

## Y `E2` no es un caso, es tres

«Algo cae si la fase deja de nombrarla» se comprueba sobre los **tres** documentos que tienen
que citarla: `RULES.md` la define, `PHASES.md` la abre y `FDGE-Prompts.md` la pone delante del
humano en modo `MANUAL`. El tercero lo añadió `verify-suite` con `SUITE-R20`, no yo: una regla
citada en `PHASES.md` que el prompt no menciona deja al humano sin verla.
