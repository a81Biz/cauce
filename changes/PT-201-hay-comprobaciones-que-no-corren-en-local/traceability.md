# `PT-201` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Las comprobaciones no reproducibles en local están **declaradas** | TS-01 | selftest §EP-026 · `SUITE-R62 dice donde deja de valer` | evidence/PT-201/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | Sobre un árbol sucio, **avisan** en vez de dar verde | TS-02 · TS-03 | selftest §EP-026 · `sobre un arbol SUCIO se dice desde donde se mira` · `…y sobre uno LIMPIO no se dice nada` | evidence/PT-201/manifest.json · salida.txt | no aplica | pendiente |
| AC-03 | `SUITE-R62` dice dónde deja de valer su promesa | TS-01 · TS-04 | selftest §EP-026 · `SUITE-R62 dice donde deja de valer` · `el mensaje no afirma lo que no sabe` | evidence/PT-201/manifest.json | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los tres tienen escenario y caso ejecutable, y no hay escenario sin `AC`.

## `TS-03` es el que sostiene a `AC-02`

`TS-02` lo satisface un aviso que aparezca **siempre**, y eso no informa de nada. Sólo `TS-03`
—sobre un árbol limpio no se avisa— distingue «avisa cuando hace falta» de «avisa y punto».

## Lo declarado sin cubrir

`SUITE-R51` no tiene caso propio: su hecho sólo existe tras el `push` (`test-scenarios.md`). Y el
inventario de once reglas es una aproximación medida, no una auditoría regla a regla.
