# PT-023 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Cada fila de cada `spec-changes.md` comprobada contra el documento que dice cambiar | E6 | `auditar-spec-changes.mjs` | `evidence/PT-023/salidas/medida.txt` | - | ✓ |
| AC-02 | Lo que se declaró y no se hizo está enumerado, no estimado | E7 | `auditar-spec-changes.mjs` | `evidence/PT-023/salidas/medida.txt` | - | ✓ |
| AC-03 | El hallazgo conocido —`FDGE-Prompts.md` y `SUITE-R44`— queda corregido | E1-E4 | `selftest.sh` · 6 casos | `evidence/PT-023/salidas/inversa.txt` | - | ✓ |
| AC-04 | Lo que no se puede comprobar mecánicamente se dice (`RULE-06`) | E5 | `verify-suite` | `evidence/PT-023/salidas/verify-suite.txt` | - | ✓ |

## Declarado NO verificado   `RULE-06`

| Afirmación | Por qué no se verifica | Dónde queda |
|:---|:---|:---|
| Que una declaración de `spec-changes.md` se haya cumplido | **Medido:** 110 filas, 4 candidatos, **3 falsos positivos**. Tres formas, las tres observadas — commit del lote · lo cumple otro PT · la medida corre antes del commit | [`self-review.md`](self-review.md) |
| Que el texto copiable siga a la regla **en general** | Los casos miran el contenido de **un** documento, no la relación entre `SUITE-R20` y todas las reglas que los `*-Prompts` citan | [`test-scenarios.md`](test-scenarios.md) |
