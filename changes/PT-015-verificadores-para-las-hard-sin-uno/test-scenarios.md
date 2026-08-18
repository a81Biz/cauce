# PT-015 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-02 | `verify-patrones` con un patrón roto | el mensaje cita `SUITE-R38` |
| E2 | AC-02 | `revisar-secretos` con una huella sin firmar | cita `FND-R29` |
| E3 | AC-02 | `tracker espejo` bloqueando | cita `SUITE-R47` |
| E4 | AC-02 | Un artefacto de PT en `docs/implementation/` | `✗ FDGE-R39` |
| E5 | AC-02 | Sin artefactos en rutas globales | **no** aparece |
| E6 | AC-01 | El universo está enumerado y clasificado | `SUITE-R26` lo declara |
| E7 | AC-03 | El alcance reducido está escrito | `RULES.md` dice qué queda fuera |
| E8 | AC-04 | `regla --sin-comprobar` sigue midiendo el resto | imprime su número |

## `E5` es el que evita el ruido

Sin él, `FDGE-R39` podría estar gritando sobre cualquier repositorio sano y nadie lo notaría
hasta que alguien dejara de leerla — que es cómo una comprobación deja de servir.
