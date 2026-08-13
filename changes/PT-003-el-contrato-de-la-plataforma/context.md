# PT-003 — Contexto   `PHASE 2` · investigación

## Documentación consultada   `FDGE-R07`

| Fuente | Qué aportó |
|:---|:---|
| `RULES.md` §`SUITE-R35` | El texto **completo** de la regla. Habla de issues y de nada más |
| `PHASES.md:250-256` | Declara el contrato de tres mapeos **bajo el encabezado `[SUITE-R35]`** |
| `LEXICON.md:215` `:566` | Solo `tracker.plataforma` y la herramienta. Ningún nombre nuevo |
| `RULES.md` §`LEX-R21` `LEX-R22` | El orden de autoridad, y que los documentos que explican no mandan |
| `CLAUDE.md` §Reglas para evolucionar | «Las reglas van a `RULES.md`. Ningún otro documento enuncia obligaciones: las **citan** por ID» |
| `RULES.md` §`SUITE-R06a` · `FDGE-R33` | Qué es exactamente lo que no se automatiza en `G4` |

## Estado del grafo

`FRESH`, alcance `bin`. Irrelevante aquí: esta investigación no toca código (`FDGE-R10`).

## La medición

```
RULES.md      «milestone»       0 coincidencias
              «pull request»    0 coincidencias
LEXICON.md    «milestone»       0 coincidencias
PHASES.md:252 implementación abierta → milestone | epic work item
       :254   compuerta G4           → pull request

GitHub        milestones creados en toda la historia del repositorio:  0
              pull requests:  1  (#1, trabajo → main, MERGED 2026-08-13)
tracker.mjs   «milestone» 0 · «pull» 0
```

## Confianzas declaradas   `FDGE-R09`

| Eje | Valor | Sustento |
|:---|:---|:---|
| Root Cause | **95 %** | Se cuenta en los archivos: la regla no dice lo que su procedimiento afirma |
| Architecture | **90 %** | El orden de autoridad está escrito en `LEX-R21` y no admite lectura alternativa |
| Solution | **85 %** | La parte del milestone está decidida por la evidencia; la del PR requiere una decisión humana sobre si sube a regla |

Ninguna bajo el 70 %: la investigación puede cerrar con conclusión (`FDGE-R42`).
