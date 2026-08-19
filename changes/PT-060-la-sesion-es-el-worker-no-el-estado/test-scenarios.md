# PT-060 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `sesionDe` con marca y datos de git | `abierta: true` con las cifras |
| E2 | AC-01 | …y cada cifra lleva su **naturaleza** | `MEDIDO` |
| E3 | AC-01 | …y si git no responde, `SIN EVALUAR` | no cero |
| E4 | AC-01 | …y `desde` sale de la marca, no del día | el sha |
| E5 | AC-01 | Sin marca | `abierta: false` |
| E6 | AC-01 | …y **dice** que el día no es la sesión | el texto |
| E7 | AC-02 | Los estados de sesión **no** están en `VIVOS` ni en `ESTADOS_TERMINALES` | ninguno |
| E8 | AC-02 | …ni `CHECKPOINTING` ni `HANDOFF_REQUIRED` ni `WAITING_NEW_SESSION` | ninguno |
| E9 | AC-03 | `sesion abrir` escribe `SESSION.json` | el archivo |
| E10 | AC-03 | …y abrir otra vez **sobrescribe** | un solo archivo |
| E11 | AC-03 | …y apila una línea en `SESSION_LOG.md` | crece |
| E12 | AC-03 | `sesion cerrar` **no** borra `SESSION.json` | sigue |
| E13 | AC-04 | `handoffDeSesion` sale del checkpoint | `pt`, `phase`, `sha` |
| E14 | AC-04 | …y lleva **qué sigue** | el texto derivado |
| E15 | AC-04 | …y sin checkpoint lo **dice** | `SIN EVALUAR` |
| E16 | AC-05 | `sesion cerrar` **no** reescribe la prosa de `HANDOFF.md` | intacta |
| E17 | AC-05 | …ni sus `decisiones` ni sus `no hacer` | intactos |
| E18 | AC-01 | `viabilidad` usa el `desde` si lo hay | el rango |
| E19 | AC-01 | …y si no lo hay, **lo dice** | el texto |
| E20 | AC-06 | Las tres acciones sobre el repositorio real | ejecutadas |

**`E6` y `E19` son la misma idea en dos sitios**: sin marca, el día **no** es la sesión, y decirlo
es lo que separa esto de una aproximación que se pasa por buena. `PHASE 2` lo midió: hoy coinciden
por casualidad.

**`E7` y `E8` son la corrección a la especificación.** Los tres estados que propone son de sesión,
no de tarea: durante un handoff la tarea sigue `IN_PROGRESS`.

**`E16` y `E17` protegen lo único no derivable.** El bloque `ESTADO` de `HANDOFF.md` lleva las
decisiones del firmante y treinta y tantos «no hacer» que salieron de ejecutar. Derivarlo sería
perderlo.

## Lo que ningún caso puede comprobar

**`AC-06`.** «Una tarea puede recorrer dos sesiones sin repetir el análisis» no es una aserción: se
**ejecuta** y se captura. El guion está en `strategy.md` y la salida irá en la evidencia.

**Que un agente distinto no vuelva a abrirlo todo igualmente.** Lo que queda garantizado es que
**no le haga falta**: que el handoff derivado y `tracker siguiente` basten para continuar.

**Que alguien abra la sesión.** Si nadie ejecuta `sesion abrir` no hay marca, y entonces todo sale
`SIN EVALUAR` — correcto, y peor que tener el dato. La herramienta no puede obligarse a sí misma a
ser usada.
