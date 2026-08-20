# PT-073 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Evidencia | Estado |
|:---|:---|:---|:---|:---|
| AC-01 | Cada hueco de `PT-072` y `PT-019` tiene su línea | E1 | `salidas/trazabilidad-huecos.txt` | PENDIENTE |
| AC-02 | Los huecos de `CASOS-DE-USO` corresponden a la versión que hay | E2 | `salidas/trazabilidad-huecos.txt` | PENDIENTE |
| AC-03 | El `README` describe lo que un instalador se encuentra hoy | E3 | `salidas/trazabilidad-huecos.txt` | PENDIENTE |
| AC-04 | Ninguna cifra escrita a mano que ya se derive | E4 | `salidas/trazabilidad-huecos.txt` | PENDIENTE |
| AC-05 | El `MANUAL` usa los pasos que la prueba usó | E1 | `salidas/trazabilidad-huecos.txt` | PENDIENTE |

## `AC-01` · hueco → línea

| Hueco | Dónde quedó |
|:---|:---|
| `H1` sin `.gitignore` | `MANUAL` §7, fila 1 |
| `H2` la frase literal del `LAYOUT` | `MANUAL` §7, fila 2 |
| `H3` el formato de `INSTALL.log` | `MANUAL` §7, fila 3 |
| `H4` allocation sin `phase` | `MANUAL` §7, fila 4 |
| `H5` `Reportado por:` | `MANUAL` §7, fila 5 |
| `H6` la plantilla fallaba | `MANUAL` §7, «las dos que ya no verás» — resuelto en `PT-083` |
| `H7` la plataforma obligatoria | ídem — resuelto en `PT-084` |
| `HL-1` `comparar-marco` invierte etiquetas | **PENDIENTE** — ver abajo |
| `HL-2` `migrate` prometía de más | resuelto en `PT-084`; el `README` recoge la limitación real |

## `HL-1` no se documenta: se declara pendiente

`comparar-marco` llama «canónica» al argumento e invierte las etiquetas según desde dónde se
ejecute. **Documentarlo en el manual sería documentar un defecto en lugar de arreglarlo.**

Va como hueco al catálogo, no como instrucción. Arreglarlo es trabajo, y trabajo que esta tarea
no tiene en su alcance.

## `AC-04` · lo que envejeció no era una cifra

El riesgo `D4`/`D5` del primer Foundation era **copiar números**. Aquí lo que había envejecido era
una **afirmación**: «varios agentes a la vez» declarado como hueco entero cuando `EP-016` cerró
tres cuartas partes. Se estrecha a lo que sigue abierto.
