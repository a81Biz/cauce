# inventory/services — las 15 herramientas

> Foundation `PHASE 5` · 2026-08-13. Enumeración completa: `ls docs/methodology/tools/`.
> Códigos de salida: `0` sin errores · `1` con errores · `2` nada que verificar aquí.

| Herramienta | Líneas | Qué hace | Escribe | Ejercitada por |
|:---|---:|:---|:---|:---|
| `verify-fdge.mjs` | 1027 | Cumplimiento de los artefactos de un proyecto: registro, terreno, PTs, evidencia, estado, instalación | no | `selftest` · `verificacion.yml` · `cauce verify` |
| `selftest.sh` | 1110 | 180 casos sobre un proyecto sintético con defectos inyectados | crea y borra `$WORK` | `npm run selftest` · CI |
| `build-core.mjs` | 491 | Compila `CORE.md` y `CORE-PTSA.md` desde las fuentes normativas | **sí** · `--check` no | `npm run core` · `core:check` · CI |
| `verify-suite.mjs` | 488 | Coherencia de la metodología: vocabulario derogado, reglas citadas inexistentes, obligaciones mal ubicadas, enlaces rotos, versiones | no | `npm run verify:suite` · CI |
| `audit.mjs` | 403 | Cobertura por enumeración: 572 elementos y lo que cada clase debe tener | no | `npm run audit` · CI |
| `plan-layout.mjs` | 327 | Enumera el terreno y **propone**; `--write` produce `LAYOUT.md` sin firmar | con `--write` | `selftest` · `INSTALL.md` `I0` |
| `migrate.mjs` | 289 | Migra un proyecto a la versión vigente; `--dry-run` por defecto | con `--apply` | `selftest` bloque D |
| `verify-qa.mjs` | 268 | Un ciclo QA y un roadmap FPGE: capturas, veredictos cerrados, QD, freshness | no | `selftest` · `cauce verify` |
| `verify-ptsa.mjs` | 224 | Matriz de cobertura de una auditoría y coherencia del score | no | `selftest` · `cauce verify` |
| `tracker.mjs` | 205 | Espejo entre `REGISTRY.json` y los issues de la plataforma | `REGISTRY` con `abrir --aplicar` | `selftest` bloque P |
| `revisar-secretos.mjs` | 191 | Secretos en el árbol y, con `--historial`, en los commits | no | `npm run verify:secretos` · CI · `cauce verify` |
| `patrones.mjs` | 147 | Los patrones críticos y el sello, con su contrato. **Biblioteca importada**, no ejecutable | no | Importada por 5 herramientas |
| `version.mjs` | 106 | Alinea los 21 documentos y `package.json` con el `CHANGELOG` | con `--aplicar` | `selftest` bloque S |
| `comparar-marco.mjs` | 102 | Qué difiere entre la copia del proyecto y la de referencia, **y en qué dirección** | no | `selftest` · `cauce compare` |
| `verify-patrones.mjs` | 79 | Ejecuta el contrato `casa`/`noCasa` de cada patrón | no | `npm run verify:patrones` · CI |

**Ningún módulo huérfano:** las 15 se invocan desde `package.json`, `bin/cauce.mjs`,
`verificacion.yml` o `selftest.sh`. Comprobado herramienta a herramienta.

**Composición por proceso, no por importación.** `bin/cauce.mjs` las ejecuta con `execFileSync`
sobre la copia **del destino**, no la del paquete: verifica lo que el proyecto tiene instalado.
La única excepción es `patrones.mjs`, que se importa.
