# `PT-191` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Sin recibo no se sella, aunque venga `--verde` | TS-01 | selftest §EP-025 · `sin recibo NO se sella, aunque venga --verde` | evidence/PT-191/manifest.json | no aplica | pendiente |
| AC-02 | Un recibo cuyo veredicto no es `OK` no certifica | TS-02 | selftest §EP-025 · `…un recibo en rojo tampoco certifica` | evidence/PT-191/manifest.json | no aplica | pendiente |
| AC-03 | Un recibo de **otra** batería se rechaza | TS-03 | selftest §EP-025 · `…y un recibo de OTRA bateria se rechaza` | evidence/PT-191/manifest.json | no aplica | pendiente |
| AC-04 | Un recibo válido **sí** sella | TS-04 | selftest §EP-025 · `…y un recibo VALIDO si sella` | evidence/PT-191/manifest.json | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los cuatro del intake tienen escenario y caso ejecutable, y no hay escenario
sin `AC`.

`AC-04` existe porque `AC-01` a `AC-03` los satisface un sellador que se niegue siempre. Es el
único de los cuatro que puede distinguir «arreglado» de «roto en la otra dirección».

**Lo declarado sin cubrir** —que sólo `--todo` escriba recibo— está en `test-scenarios.md` y en el
intake §4, con su motivo: probarlo exigiría anidar la batería dentro de sí misma, que es lo que
`PT-188` acaba de impedir. No se cuenta como `AC`, así que no deja ninguno huérfano.
