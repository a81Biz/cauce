# PT-059 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `SAFE`/`MARGINAL`/`UNSAFE` derivados | E1-E3 · E15-E16 · E21 | `selftest.sh`: «coste bajo el precedente ⇒ SAFE» · «…y el motivo lleva las dos cifras» · «…y habla de PRECEDENTE» · «HOLGURA esta exportada» · «viabilidad da un veredicto» | `salidas/viabilidad-real.txt` · `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-02 | En `MARGINAL` solo lo atómico | E4-E5 | `selftest.sh`: «dentro de la holgura ⇒ MARGINAL» · «…y restringe a lo ATOMICO» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-03 | En `UNSAFE` no se ejecuta | E6-E7 | `selftest.sh`: «muy por encima ⇒ UNSAFE» · «…y pide checkpoint, handoff y parada» · «…y dice que hay evidencia EN CONTRA» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-04 | `BLOCKED_BY_CONTEXT` en `LEXICON` y no terminal | E17-E20 | `selftest.sh`: «BLOCKED_BY_CONTEXT existe» · «…y NO es terminal» · «…y SI es vivo» · «esta en LEXICON» · «verify-fdge lo cuenta como vivo» | `salidas/verify-suite.txt` · `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-05 | Con `SIN EVALUAR` no aprueba por omisión | E8-E11 · E22 | `selftest.sh`: «coste SIN EVALUAR ⇒ MARGINAL» · «…y NUNCA SAFE» · «precedente SIN EVALUAR ⇒ MARGINAL» · «…y que no se aprueba por omision» · «funciona sin credencial» | `salidas/inversa.txt` · `salidas/viabilidad-real.txt` | - | VERIFICADO |
| AC-06 | Un `UNSAFE` permanente se declara | E12-E14 | `selftest.sh`: «por encima del techo historico ⇒ UNSAFE» · «…y lo marca como NUNCA» · «…y pide PARTIR la tarea» · «y se decide ANTES que el SIN EVALUAR» | `salidas/inversa.txt` | - | VERIFICADO |

**`E14` es el único caso del arnés que vigila un *orden* y no un contenido.** `AC-06` se comprueba
antes que el `SIN EVALUAR`; si se moviera detrás, una tarea que no cabe en ninguna sesión saldría
`MARGINAL` por faltar el precedente y el bucle infinito volvería **sin que ningún otro caso se
enterara**. La inversa lo confirma: es uno de los cuatro que caen.

**`AC-05` se verifica con la inversa, no con la batería.** Que los casos pasen dice que la
implementación hace lo que dicen; que `«coste SIN EVALUAR ⇒ MARGINAL»` **salga `SAFE`** al
neutralizarlo dice que el caso distingue la aprobación por omisión — que, con el disponible en
`SIN EVALUAR` siempre, sería la respuesta normal de la compuerta.
