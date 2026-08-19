# PT-059 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | Coste menor que el precedente | `SAFE` |
| E2 | AC-01 | …y el motivo dice **de qué sale** | las dos cifras |
| E3 | AC-01 | …y habla de **precedente**, no de capacidad | el texto |
| E4 | AC-02 | Coste por encima del precedente pero dentro de `HOLGURA` | `MARGINAL` |
| E5 | AC-02 | …y dice que solo trabajo **atómico** | el texto |
| E6 | AC-03 | Coste muy por encima | `UNSAFE` |
| E7 | AC-03 | …y pide checkpoint, handoff y parada | el texto |
| E8 | AC-05 | Coste `SIN EVALUAR` | `MARGINAL` — ni `SAFE` ni `UNSAFE` |
| E9 | AC-05 | Precedente `SIN EVALUAR` (sesión recién empezada) | `MARGINAL` |
| E10 | AC-05 | …y dice **cuál** de los dos falta | el texto |
| E11 | AC-05 | …y que **no se aprueba por omisión** | el texto |
| E12 | AC-06 | Coste por encima del techo histórico | `UNSAFE` con `nunca: true` |
| E13 | AC-06 | …y pide **partirla**, no reintentarla | el texto |
| E14 | AC-06 | …y eso se decide **antes** que el `SIN EVALUAR` del precedente | `nunca: true` aunque falte el precedente |
| E15 | AC-01 | `HOLGURA` está declarada con nombre | exportada |
| E16 | AC-01 | …y se puede cambiar sin tocar la función | parámetro |
| E17 | AC-04 | `BLOCKED_BY_CONTEXT` está en `LEXICON` | sí |
| E18 | AC-04 | …y **no** es terminal | no está en `ESTADOS_TERMINALES` |
| E19 | AC-04 | …y **sí** es vivo | está en `VIVOS` |
| E20 | AC-04 | …y `LEXICON` dice que **no es un fallo** | el texto |
| E21 | AC-01 | `tracker viabilidad` sobre una tarea real | un veredicto con sus cifras |
| E22 | AC-05 | …y funciona sin credencial de tablero | igual |

**`E8`–`E11` son `AC-05` y son el corazón.** `PHASE 2` midió que el presupuesto disponible es
`SIN EVALUAR` **siempre**, así que este no es un caso raro: si `SIN EVALUAR` cayera en `SAFE` la
compuerta aprobaría por omisión, y si cayera en `UNSAFE` bloquearía todo para siempre y acabaría
apagada.

**`E14` es el que ordena las comprobaciones.** Una tarea que nunca cabría no puede salir
`MARGINAL` porque falte el precedente: el bucle infinito que `AC-06` existe para impedir se
produciría igual.

**`E18` y `E19` juntos.** Un estado que no es terminal pero tampoco vivo desaparecería del tablero
sin estar cerrado — sería peor que cualquiera de los dos.

## Lo que ningún caso puede comprobar

**Que el veredicto acierte.** Mide **precedente**, no capacidad: la sesión mayor de este
repositorio hizo cuatro veces más que la menor, así que la señal es ruidosa por construcción. Lo
que sí queda garantizado es que la salida diga siempre de qué sale y con qué naturaleza.

**Que `HOLGURA = 1.5` sea el número correcto.** Es un juicio, declarado como tal. Lo que está
medido es qué decide.

**Que `AC-06` llegue a dispararse.** Hoy la mayor referencia de coste es 1 974 líneas y la mayor
sesión registrada 29 286 — un 7 %. La comprobación existirá sin activarse, y eso es lo que se
quiere de una salvaguarda.

**Que alguien obedezca `UNSAFE`.** Nada impide seguir. Lo que queda es que el veredicto y su motivo
estén escritos antes de empezar, no después de quedarse a medias.
