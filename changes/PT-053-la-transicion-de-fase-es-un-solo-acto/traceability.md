# PT-053 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `avanzar` ejecuta los cinco actos y escribe el checkpoint | E1-E2 · E14 | `selftest.sh` · 3 casos | `evidence/PT-053/salidas/avanzar.txt` | - | ✓ |
| AC-02 | Sin `--nota` no avanza. No es un aviso: es una negativa | E3-E4 | `selftest.sh` · 3 casos | `evidence/PT-053/salidas/avanzar.txt` | - | ✓ |
| AC-03 | Es atómico: si un paso falla, ninguno queda aplicado | E5-E6 | `selftest.sh` · 2 casos | `evidence/PT-053/salidas/atomicidad.txt` | - | ✓ |
| AC-04 | La fase destino se valida: no se salta ni retrocede en silencio | E7-E9 | `selftest.sh` · 3 casos | `evidence/PT-053/salidas/avanzar.txt` | - | ✓ |
| AC-05 | Sin acceso lo dice y no avanza a medias | E10-E12 | `selftest.sh` · 5 casos | `evidence/PT-053/salidas/avanzar.txt` | - | ✓ |
| AC-06 | `avanzar` está en `LEXICON` con las demás acciones del tracker | E13 | `selftest.sh:avanzar esta en LEXICON` | `evidence/PT-053/salidas/selftest.txt` | - | ✓ |

## Declarado NO verificado   `RULE-06`

| Afirmación | Por qué no se verifica | Dónde queda |
|:---|:---|:---|
| Que `avanzar` **se use** | Nada impide editar `REGISTRY.phase` a mano. La medida será contar en `EP-015` cuántas veces `FDGE-R52` vuelve a cazar la misma transición — en `EP-014` fueron **tres** | [`self-review.md`](self-review.md) |
| El camino completo y la atomicidad, por la propia batería | El fixture no declara plataforma. Se ejecutaron contra el repositorio **real**: la nota `5 → 6` de esta tarea la publicó `avanzar` | [`test-scenarios.md`](test-scenarios.md) |
