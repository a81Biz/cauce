# PT-026 — Escenarios de prueba   `PHASE 4` · `FDGE-R23`

| # | Escenario | Esperado |
|:---|:---|:---|
| E1 | Etiqueta desalineada | la divergencia se detecta igual |
| E2 | La misma | el mensaje nombra la etiqueta que debe |
| E3 | Todo cuadra | no inventa divergencias |
| E4 | `SUITE-R47` en `RULES.md` y en `CORE.md` | presente |
| E5 | `PHASES.md` dice dónde bloquea | presente |
| E6 | La herramienta distingue la rama | `esRamaPorDefecto` existe |
| E7 | Ante la duda bloquea | declarado en el código |
| E8 | `--gate G4` en la rama de trabajo | el espejo se ejecuta y bloquea |

E1–E3 comprueban lo que **no** cambió: la comparación es la misma función pura. Que un detector
cambiara de criterio según la rama serían dos detectores divergiendo.
