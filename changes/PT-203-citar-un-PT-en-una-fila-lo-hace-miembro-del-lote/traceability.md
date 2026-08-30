# `PT-203` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Citar un `PT` como origen **no** lo hace miembro del lote | TS-01 | selftest §EP-026 | evidence/PT-203/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | Los miembros reales se siguen detectando | TS-02 · TS-03 | selftest §EP-026 | evidence/PT-203/manifest.json · salida.txt | no aplica | pendiente |
| AC-03 | El mensaje distingue «no es miembro» de «le falta la firma de lote» | TS-04 · TS-05 · TS-06 | selftest §EP-026 | evidence/PT-203/manifest.json · salida.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los tres tienen escenario y caso ejecutable, y no hay escenario sin `AC`.

## Doce casos, no seis · y un bloque que el intake no pedía

Los `AC` son tres y se cumplen tal como estaban escritos. Pero implementar `AC-02` —la pertenencia
la asigna el registro— hizo que `INTAKE-R08` cubriera 62 tareas nuevas, de las que **26 no
cumplen**, y eso introducía 26 avisos permanentes sin dueño. La certificación que lo cierra **no
estaba en el intake** y se declara en [`spec-changes.md`](spec-changes.md), con la autorización del
firmante citada.

Sus seis casos son propios y no se cuelgan de ningún `AC` existente:

| Caso | Qué impide |
|:---|:---|
| `una firma certificada no bloquea` | Que la deuda pare el marco |
| `…y dice a quien le toca corregirla` | Que «certificar» y «silenciar» sean lo mismo |
| `…pero lo VIVO no lo exime la certificacion` | Que una fila cubra trabajo que volvió a estar vivo |
| `…y una fila SIN firmante no exime` | Que la plantilla sin rellenar valga como firma |
| `…y certificar a OTRA no cubre a esta` | Que certificar una tarea abra el lote entero |
| `sin FIRMAS-DE-LOTE.md no se exime nada` | Que el silencio acote — la lección de `bloques-sellados` |

## `AC-02` es donde estaba el defecto grande, y por eso lleva dos escenarios

El intake ve un solo lado —el `FANTASMA`, 7 casos—. La medición encontró el otro: **62 `INVISIBLE`**,
tareas que el registro asigna al lote y cuya firma **no se comprobaba nunca**. `TS-02` no lo cubre
solo, porque el intake podía listarlas; hace falta `TS-03`, que planta un miembro **ausente de la
tabla**.

## `AC-03` absorbe una comprobación que el intake no pedía

`RE_SIGN_BATCH` captura el lote de la línea y lo **tira**, mientras el mensaje lo nombra. Entra aquí
—`TS-05`— porque es la misma línea de código que este `AC` toca, y porque dejarla sería cerrar la
tarea con el mensaje mintiendo por otro sitio. `PT-172` es el caso real: su intake dice `EP-024` y
el registro dice `EP-025`.
