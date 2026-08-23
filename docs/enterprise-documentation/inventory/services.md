# inventory/services — las 16 herramientas

> Foundation `PHASE 5` · 2026-08-19 · suite 9.0.0 · segunda ejecución.
> Enumeración completa: `ls docs/methodology/tools/`. Líneas **contadas**, no transcritas.
> Códigos de salida: `0` sin errores · `1` con errores · `2` nada que verificar aquí.

| Herramienta | Líneas | Qué hace | Escribe | Ejercitada por |
|:---|---:|:---|:---|:---|
| `selftest.sh` | 7007 | 697 casos sobre un proyecto sintético con defectos inyectados | crea y borra `$WORK` | `npm run selftest` · CI |
| `tracker.mjs` | 4012 | El estado operativo: espejo, consulta, checkpoint, transición, sesión, presupuesto, personas, proyección. **17 acciones** | **sí** · registro, checkpoint, marca de sesión, rama derivada | `npm run verify:espejo` · CI · el agente en cada fase |
| `verify-fdge.mjs` | 2554 | Cumplimiento de los artefactos de un proyecto: registro, terreno, PTs, evidencia, estado, instalación | no | `selftest` · `verificacion.yml` · `cauce verify` |
| `verify-suite.mjs` | 859 | Coherencia de la metodología: vocabulario derogado, reglas citadas inexistentes, obligaciones mal ubicadas, enlaces rotos, versiones | no | `npm run verify:suite` · CI |
| `patrones.mjs` | 2148 | Biblioteca compartida: los patrones críticos con su contrato `casa`/`noCasa`. La única que se importa | no | importada por el resto · `verify-patrones` |
| `build-core.mjs` | 564 | Compila `CORE.md` y `CORE-PTSA.md` desde las fuentes normativas | **sí** · `--check` no | `npm run core` · `core:check` · CI |
| `audit.mjs` | 628 | Cobertura por enumeración: 597 elementos y lo que cada clase debe tener | no | `npm run audit` · CI |
| `migrate.mjs` | 438 | Migración guiada entre versiones de la suite | **sí** con `--apply` | `selftest` · manual |
| `plan-layout.mjs` | 371 | Plan de terreno: repos anidados, dónde vive el código, dependencias, alcance del grafo. **Propone, no mueve** | **sí** `LAYOUT.md` con `--write`, y se niega si ya está firmado | Foundation `PHASE 0` · `selftest` |
| `verify-qa.mjs` | 318 | Cumplimiento de una campaña QA | no | `selftest` |
| `revisar-secretos.mjs` | 230 | Escaneo de secretos en árbol e historia git | no | `npm run verify:secretos` · `verificacion.yml` · `publicar.yml` |
| `regla.mjs` | 261 | Un ID de regla → qué exige y qué verificador puede fallar, derivado. **Defecto vivo `D20`: reporta mal 47 de 196** | no | manual |
| `verify-ptsa.mjs` | 352 | Cumplimiento de una auditoría PTSA | no | `selftest` |
| `version.mjs` | 165 | Alinea la versión en los 21 documentos y `package.json` desde el `CHANGELOG` | **sí** con `--aplicar` | manual · release |
| `comparar-marco.mjs` | 102 | Compara el marco instalado con el del paquete | no | `cauce compare` · `selftest` |
| `verify-patrones.mjs` | 89 | Contrato de `patrones.mjs`: cada patrón con lo que debe casar y lo que no | no | `npm run verify:patrones` · CI |

**Total: 11454 líneas** en 16 archivos (15 `.mjs` + `selftest.sh`).
En la primera ejecución de Foundation eran **5 441**: el código se ha **duplicado**.

Los tres mayores —`selftest.sh`, `tracker.mjs` y `verify-fdge.mjs`— son el **63 %**
del total. Es `TD-02`, y la recomendación no cambia: **no partirlos por tamaño**. Si se parten,
que sea por artefacto verificado, y solo cuando un cambio lo pida.

**Ninguna huérfana.** Las dieciséis están referenciadas desde `package.json`, `bin/cauce.mjs`,
los workflows o `selftest.sh`; la menos citada, `version.mjs`, aparece en 4 sitios.
