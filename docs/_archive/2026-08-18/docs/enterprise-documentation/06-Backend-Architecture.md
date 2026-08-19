# 06-Backend-Architecture — arquitectura del sistema

> Foundation `PHASE 3` · 2026-08-13 · suite 5.2.3
> No hay backend en el sentido habitual: no hay servidor, ni proceso residente, ni estado
> compartido. Lo que hay son **dos artefactos ejecutables y un cuerpo normativo**, y su
> arquitectura es la de un compilador con verificadores.

## Vista general

```
                    ┌─────────────────────────────────────────┐
   FUENTES          │  LEXICON.md · RULES.md                  │  autoridad
   normativas       │  EXECUTION-MODES.md · PHASES.md         │  (se editan a mano)
                    └────────────────┬────────────────────────┘
                                     │ build-core.mjs          SUITE-R16
                    ┌────────────────▼────────────────────────┐
   NÚCLEO           │  CORE.md      ← lo único que se carga   │  generado · sellado
   compilado        │  CORE-PTSA.md ← overlay, solo [START PTSA]│  SUITE-R25
                    └────────────────┬────────────────────────┘
                                     │ lo lee el agente
                    ┌────────────────▼────────────────────────┐
   ARTEFACTOS       │  REGISTRY.json · HISTORY.log · changes/ │  los escribe el agente
   del proyecto     │  evidence/ · LAYOUT.md · HANDOFF.md     │  siguiendo el núcleo
                    └────────────────┬────────────────────────┘
                                     │ verificadores
                    ┌────────────────▼────────────────────────┐
   VERIFICACIÓN     │  verify-fdge · verify-qa · verify-ptsa  │  exit 0 · 1 · 2
                    │  verify-suite · verify-patrones · audit │
                    └─────────────────────────────────────────┘
```

La dirección importa: **las fuentes normativas nunca se generan y el núcleo nunca se edita**.
Invertir esa flecha reintroduce la divergencia entre copias que la v4 nació para eliminar.

## Los dos ejecutables

### `bin/cauce.mjs` — el punto de entrada publicado

221 líneas, sin dependencias. Responsabilidad única: **poner archivos donde van y ejecutar
verificadores**. No decide nada ([bin/cauce.mjs:15-18](../../bin/cauce.mjs#L15-L18)) — la
instalación de verdad es conversacional y la conduce el agente leyendo `INSTALL.md`.

Piezas internas:

| Pieza | Qué resuelve |
|:---|:---|
| `esCauce()` / `AUTOALOJADO` | Identidad del destino por nombre de paquete, no por ruta (`SUITE-R41`) |
| `divergencia()` | Compara el árbol del paquete con el del destino por SHA-1 de contenido y clasifica en `difieren` y `soloDestino` |
| `copiarCarga()` | Copia recursiva de `docs/methodology/` creando directorios |
| `corre()` | Ejecuta una herramienta del **destino**, no del paquete: verifica lo que el proyecto tiene instalado, no lo que el paquete trae |

### `docs/methodology/tools/` — las quince herramientas

Sin framework y sin clases: cada una es un script que lee archivos, acumula en tres listas
(`errors`, `warnings`, `passed`) e imprime. La composición es por proceso, no por importación —
`corre()` y el selftest las invocan con `execFileSync`. La única excepción es `patrones.mjs`,
que **sí** se importa: es la biblioteca compartida.

| Familia | Herramientas | Entrada → salida |
|:---|:---|:---|
| Generación | `build-core` · `version` | Fuentes normativas → núcleo sellado · CHANGELOG → 21 documentos alineados |
| Verificación del marco | `verify-suite` · `verify-patrones` · `audit` | `docs/methodology/` → errores de coherencia, patrones rotos, huecos de cobertura |
| Verificación del proyecto | `verify-fdge` · `verify-qa` · `verify-ptsa` | Artefactos del proyecto → cumplimiento por regla |
| Instalación y terreno | `plan-layout` · `migrate` · `comparar-marco` | Árbol del proyecto → propuestas que **no** ejecuta |
| Seguridad | `revisar-secretos` | Árbol + historia git → hallazgos, firmados o no |
| Estado | `tracker` | `REGISTRY.json` ↔ issues de GitHub |
| Compartido | `patrones` | Los patrones críticos con su contrato |
| Medición | `selftest.sh` | Proyecto sintético + defectos inyectados → 180 casos |

## Decisiones de arquitectura, y qué las obliga

| Decisión | Por qué no puede ser de otra manera |
|:---|:---|
| **Cero dependencias** | Las herramientas se ejecutan desde el `docs/methodology/tools/` del proyecto destino, donde no hay `node_modules` propio |
| **Composición por proceso** | Cada verificador tiene que poder correr solo, en CI y desde `cauce verify`. Un fallo de uno no puede tumbar a los demás: `corre()` captura el estado y sigue |
| **Estado en el sistema de archivos** | No hay base de datos ni proceso residente. `REGISTRY.json` es el asignador; los ledgers son append-only; la evidencia se ancla a commits. El «reloj» es git, el único que no depende de nadie (`SUITE-R34`) |
| **El núcleo es un artefacto compilado** | Cargar la suite entera cuesta ~59 500 tokens por sesión; el núcleo más el `CLAUDE.md` del proyecto, ~16 000, con todas las directivas |
| **Overlays por componente** | PTSA tiene 80 reglas propias que no caben en el núcleo sin encarecer todas las sesiones. Se carga solo con `[START PTSA]`; sin él auditaría con 23 de 80 (`SUITE-R25`) |
| **El verificador se verifica** | El selftest construye un proyecto sintético, inyecta un defecto y comprueba que el verificador lo caza. Y `revento()` invalida el caso si la herramienta lanza una excepción: una herramienta rota no imprime el patrón buscado, así que sin esa comprobación el arnés certificaba verificadores muertos |

## Flujo de datos de una verificación

```
verify-fdge --all
   ├─ lee   docs/implementation/REGISTRY.json        estado, versión, modo, allocations
   ├─ lee   docs/implementation/{HISTORY,INCIDENTS}.log · HANDOFF.md · LAYOUT.md · INSTALL.log
   ├─ lee   changes/PT-NNN-slug/*                    intake, estrategia, trazabilidad
   ├─ lee   evidence/PT-NNN/manifest.json            y comprueba que los archivos existen
   ├─ lee   docs/enterprise-documentation/           por ARCHIVOS del núcleo (FND-R08)
   ├─ lee   docs/methodology/CHANGELOG.md            la versión vigente (SUITE-R40)
   ├─ ejec. git log -1 --format=%ct -- <ruta>        frescura del estado (SUITE-R34)
   └─ sale  0 · 1                                    con PASA / AVISOS / ERRORES por regla
```

Nada se escribe. Los verificadores son de solo lectura sobre los artefactos: el que decide
corregir es quien lee la salida.
