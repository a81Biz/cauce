# `PT-200` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Un `PT` terminal y sin cambios **no se re-verifica** | TS-01 · TS-05 | selftest §EP-026 · `un PT sellado y sin cambios NO se re-verifica` · `sellar es una decision: sin --sellar no se escribe` | evidence/PT-200/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | Si cambia lo que su sello cubre, **vuelve entero** | TS-02 | selftest §EP-026 · `…y si su artefacto cambia, vuelve` · `…y si cambia el VERIFICADOR, tambien` | evidence/PT-200/manifest.json · salida.txt | no aplica | pendiente |
| AC-03 | Un `PT` **vivo** se verifica siempre, sellado o no | TS-03 | selftest §EP-026 · `un PT vivo se verifica aunque tenga sello` | evidence/PT-200/manifest.json · salida.txt | no aplica | pendiente |
| AC-04 | Sin sellos, se verifican **todos**: el silencio no acota | TS-04 | selftest §EP-026 · `sin sellos se verifican TODOS` | evidence/PT-200/manifest.json · salida.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los cuatro tienen escenario y caso ejecutable, y no hay escenario sin `AC`.

## Cuál sostiene a cuál

- **`AC-02` sostiene a `AC-01`.** Saltar lo terminal lo cumple un `verify-fdge` que ignore todo lo
  `INTEGRATED` sin mirar nada — y eso dejaría la compuerta ciega para el 93 % del repositorio. Sólo
  `AC-02` distingue «sellado» de «ignorado».
- **`AC-04` sostiene a los tres.** Sin él, un `SELLOS-PT.json` corrupto o ausente produciría un verde
  por vacío, que es el falso verde más caro posible aquí.
- **La huella del verificador** es el segundo caso de `AC-02` y es el error más fácil de cometer:
  sin ella, el sello certifica contra reglas que ya no existen.

## Lo declarado sin cubrir

Un cambio en `RULES.md` que no toque `verify-fdge.mjs` **no** invalida el sello, igual que en la
batería (`strategy.md`). Y no se fija ninguna cifra de minutos (`HANDOFF -18`).
