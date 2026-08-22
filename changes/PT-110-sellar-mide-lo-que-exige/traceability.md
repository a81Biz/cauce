# Trazabilidad — `PT-110`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | `sellar` mide las cifras y las publica | `sellar mide las cifras del inventario` | `selftest.sh` | `salidas/sellar.txt` |
| AC-02 | dice `SIN EVALUAR` si no puede leerlas | `…y dice SIN EVALUAR cuando no puede leerlas` | `selftest.sh` | `salidas/sellar.txt` |
| AC-03 | no las arregla: nombra el comando | por construcción — `sellar` no escribe el inventario | `selftest.sh` | `salidas/sellar.txt` |
| AC-04 | la batería falla sin el arreglo | los dos casos | `selftest.sh` | `salidas/selftest-completo.txt` |

**`AC-03` se verifica por construcción**: la medición sólo lee. No hay ruta por la que `sellar`
pueda escribir `inventory/services.md`.
