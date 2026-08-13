# cauce

**Marco de gobernanza para desarrollo asistido por IA.** Trazabilidad, evidencia y control
humano sobre toda decisión irreversible.

```bash
npm i -D @a81biz/cauce
npx cauce install
```

Y después, en Claude Code dentro del proyecto: **«instala el framework»**.

Un cauce no empuja el agua: decide por dónde puede ir. Ninguna regla escrita en un documento
obliga a un modelo a obedecerla — lo que este marco consigue es que lo correcto salga barato y
lo incorrecto quede visible.

```
FIDE → Foundation → FDGE (construir) → QA (verificar UX) → PTSA (auditar producto)
                                     → FPGE (priorizar) → FDGE PHASE 1 (Intake) → …
```

Manual completo: [`docs/methodology/README.md`](docs/methodology/README.md) ·
Cambios y migración desde v3: [`docs/methodology/CHANGELOG.md`](docs/methodology/CHANGELOG.md)

---

## Los tres documentos que gobiernan todo

| Documento | Gobierna |
|:---|:---|
| [`LEXICON.md`](docs/methodology/LEXICON.md) | **Nombres**: fases, identificadores, estados, archivos, triggers |
| [`RULES.md`](docs/methodology/RULES.md) | **Reglas**, todas, con ID estable y severidad |
| [`EXECUTION-MODES.md`](docs/methodology/EXECUTION-MODES.md) | **Compuertas**, autonomía y lotes |

Todo lo demás los cita. Ningún otro documento legisla.

---

## Cómo Claude Code obtiene contexto

Al abrir una sesión aquí, Claude Code carga `CLAUDE.md` (repo) y `~/.claude/CLAUDE.md`
(global), y sabe que este repositorio es la fuente del framework.

**En un proyecto destino**, el contexto lo da su propio `CLAUDE.md`, que contiene las reglas
vinculantes. Se cargan en cada sesión (PHASE 0 de FDGE):

| Fuente | Qué aporta |
|:---|:---|
| `CLAUDE.md` del proyecto | Modo de ejecución, Declaración de Valor, punteros a la autoridad |
| `docs/implementation/REGISTRY.json` | Versión de suite, modo, contadores de IDs, PTs vivos |
| `docs/enterprise-documentation/` | Arquitectura, PRD, TRD, Conventions |
| `docs/implementation/BACKLOG.md` | PTs vivos y su fase actual |
| `docs/implementation/HANDOFF.md` | Bloque `ESTADO`: qué está abierto y cuál es la siguiente acción (`SUITE-R33`) |
| `docs/implementation/HISTORY.log` | Todo el trabajo previo, trazado por `PT-NNN` |
| `docs/implementation/INCIDENTS.log` | Incidentes abiertos |
| `PTSA/RESUMEN.md` | Health Score y hallazgos abiertos |
| `QA/qa-score-history.json` | Historial de scores QA y defectos por ciclo |
| `docs/implementation/ROADMAP.md` | Roadmap priorizado vigente |

---

## Instalar

```bash
npm i -D @a81biz/cauce      # el paquete lleva ámbito; el comando se llama cauce
npx cauce install           # deja el marco en docs/methodology/ y genera su núcleo
```

Y después, en Claude Code, dentro del proyecto:

```
instala el framework
```

El ámbito `@a81biz` es de propiedad, no de uso: npm rechaza `cauce` a secas por parecerse a
paquetes que ya existen. El binario sigue llamándose `cauce`.

`npx cauce install` **se niega** a sobrescribir una copia del marco que difiera de la del
paquete, y dice qué difiere. Una copia distinta puede llevar correcciones que ese proyecto hizo
bajo sus propios PT — pasó, con un verde falso sobre la regla que sostiene la auditoría — así
que sincronizar a ciegas está prohibido en las dos direcciones (`SUITE-R31`).

---

## Instalar: copiar la carpeta y decírselo a Claude

```
1. Copia docs/methodology/ al proyecto (sin FIDE/ si el proyecto ya existe).
2. Abre Claude Code ahí y escribe:   instala el framework
```

Eso es todo. Claude lee [docs/methodology/INSTALL.md](docs/methodology/INSTALL.md) y conduce
las nueve fases **en la conversación** (`SUITE-R28`): enumera el terreno, te presenta los
movimientos que propone y **espera tu decisión ahí mismo**, ejecuta lo que aceptes, crea la
estructura, instala las dependencias que falten pidiéndote permiso una por una, genera el
grafo con `/graphify`, **te redacta la Declaración de Valor** leyendo el repositorio para que
la corrijas, verifica y encadena con `[START FOUNDATION]`.

Los artefactos —`LAYOUT.md`, `REGISTRY.json`, `CLAUDE.md`— se escriben igual: son el registro
auditable. Pero no son por dónde se decide. Escribir un `.md` y decir «léelo y vuelve»
desperdicia el único medio donde ya estás mirando.

Lo que **no** hace sola: mover código sin tu firma (`FND-R22`), inventarse qué hace válido un
producto (`FND-R24`), instalar nada en silencio (`SUITE-R29`) ni tocar la rama principal
(`SUITE-R06`).

El procedimiento manual, paso a paso, sigue abajo para quien lo prefiera o para auditar qué
hizo el agente.

---

## Aplicar el framework a un proyecto

### Escenario A — Proyecto nuevo desde cero (FIDE)

1. Crea una carpeta vacía y ábrela en tu editor.
2. Copia [`docs/methodology/FIDE/FIDE-CLAUDE-Launcher.md`](docs/methodology/FIDE/FIDE-CLAUDE-Launcher.md)
   dentro de un `CLAUDE.md` en su raíz.
3. Ejecuta: `[START FIDE] prompt: "Quiero construir..."`

FIDE investiga el nicho, consensúa contigo la arquitectura, genera la documentación con los
**nombres canónicos**, monta el andamiaje, instala la suite completa y se retira.

### Escenario B — Proyecto existente (legado)

Instrucción lista para copiar y pegar en el proyecto destino:

```
Aplica cauce al proyecto en <RUTA_ABSOLUTA_DEL_PROYECTO>.
La fuente del framework está en C:/DevOps/claude/docs/methodology/.

--- PASO 0 — INVENTARIO Y LIMPIEZA ---

0a. Inspecciona el árbol completo y lista todo lo que existe.
    No toques nada: solo muestra el inventario y espera confirmación.

0b. Tras el ACK, ejecuta la limpieza en este orden:

    MOVER A src/:
      Todo el código fuente que no sea infraestructura (módulos, librerías propias,
      scripts de negocio, tests). Si ya existe src/, consolida dentro.
      Respeta la estructura interna: mueve el árbol completo, no aplanes.

    DEJAR EN RAÍZ:
      Dockerfile, docker-compose*.yml, .dockerignore
      .env, .env.example, .gitignore, .gitattributes
      package.json / go.mod / requirements.txt / pyproject.toml y lockfiles
      graphify-out/ (salida de Graphify — no tocar)
      README.md y CLAUDE.md existentes (se actualizan más adelante)

    ELIMINAR:
      Documentación antigua que no sea enterprise-documentation ni implementation:
      wikis locales obsoletas, notas sueltas, planificación ad-hoc.
      Artefactos de build no cubiertos por .gitignore (dist/, build/, __pycache__/,
      *.pyc, node_modules/ si no está ignorado).
      Temporales de editor y de sistema (.DS_Store, Thumbs.db, *.swp).

    ANTES DE ELIMINAR: lista exactamente qué se va a borrar y pide confirmación.
    No elimines nada sin ACK explícito.

0c. Confirma el árbol limpio y espera instrucción para continuar.

--- INSTALACIÓN (solo tras el ACK del paso 0) ---

1. Copia docs/methodology/ desde C:/DevOps/claude al proyecto destino,
   EXCEPTO la carpeta FIDE/ (FIDE-R01: FIDE incuba desde fuera y no se instala).

2. Copia el contenido de Suite-CLAUDE-Template.md al CLAUDE.md del proyecto,
   después de sus secciones propias (créalo si no existe).
   Personaliza SOLO dos cosas:
     - el bloque de modo:  suite_version: <la del CHANGELOG>  ·  execution_mode: SUPERVISED
     - la Declaración de Valor (dominio, productos, reglas de validez) — es lo único
       específico del dominio que la suite necesita.

3. Crea docs/implementation/ con:
     REGISTRY.json   ← asignador único de IDs. Contenido inicial:
                       { "suite_version": "<la del CHANGELOG>", "execution_mode": "SUPERVISED",
                         "counters": {"PT":0,"EP":0,"QA":0,"QR":0,"QD":0,
                                      "H":0,"E":0,"P":0,"R":0,"INC":0},
                         "allocations": [] }
     HISTORY.log · INCIDENTS.log · SESSION_LOG.md      (vacíos, append-only)
     RECONCILIATION.log · MIGRATION.log                (vacíos, append-only)
     HANDOFF.md · BACKLOG.md                           (con su encabezado)
     DISCOVERY.md · ENRICHMENT.md · REFACTOR_SCOPE.md  (índices append-only)
     ROADMAP.md · ROADMAP_HISTORY.log
     evidence/
   Crea también la carpeta changes/ en la raíz.

   NO crees PLAN_ACTUAL.md, PENDING_TASKS.md ni CONTEXT_ANALYSIS.md: quedaron derogados
   en la v4. Su contenido vive dentro de changes/PT-XXX-slug/ (FDGE-R39), que es lo que
   permite tener más de un trabajo en vuelo.

4. Crea la estructura PTSA/:
     RESUMEN.md · ESTADO_ACTUAL.md · AUDIT_LOG.md · PENDIENTES.md · RELACIONES.md
     audit-scope.yaml · score-history.json (vacío: [])
     Phases/ · Findings/ · Evidence/ · Products/
   (nombres en inglés — LEX-R14)

5. Crea la estructura QA:
     QA/  QA-PLAN.md · QA-DEFECTS.md · QA-LOG.md · qa-score-history.json ([])
          cases/ · reports/
     qa/  tests/ · fixtures/
     playwright.config.ts en la raíz (template en QA/Framework-QA.md)

6. Enumera el TERRENO antes de documentar nada  [FND-R19..R23]:
     node docs/methodology/tools/plan-layout.mjs --write
     → docs/implementation/LAYOUT.md

     La carpeta que recibe la suite MANDA: es la raíz, sin excepción. El plan detecta
     repositorios git anidados, dónde vive de verdad el código, manifiestos y documentos
     sueltos. PROPONE; no mueve un solo archivo. Lo firma una persona (G0) y lo aceptado
     se ejecuta luego como PT REFACTOR con «Estructural: sí».

     Importa porque G4 es un merge real, PHASE 10 es un rollback real y la evidencia se
     ancla a commits: con la raíz fuera del repositorio, esas tres cosas no tienen dónde
     ocurrir — y no dan error hasta que las necesitas.

5-bis. REGISTRY.json arranca con TODAS sus claves, no solo las que se usan hoy:
     suite_version · execution_mode · counters (a cero) · allocations (vacío)
     foundation {generated, validated_by, pt_at_generation}  ← la escribe Foundation
     graph {generated, scope, pt_at_generation}              ← la escribe /graphify
     Sembrar solo una de las dos deja al lector adivinando si la otra falta o no aplica.

6-bis. Registra lo que ejecutaste  [SUITE-R30]:
     docs/implementation/INSTALL.log  ← append-only, una entrada por acción
     qué se movió y desde dónde · qué se sustituyó y con qué respaldo · qué commit
     lo contiene · qué dependencia se instaló · con qué alcance se generó el grafo.
     Lo que falla también se escribe: un registro que solo cuenta lo que salió bien
     no sirve para revertir, que es para lo que existe.

7. Verifica la instalación:
     node docs/methodology/tools/build-core.mjs docs/methodology     ← genera CORE.md y CORE-PTSA.md
     node docs/methodology/tools/verify-suite.mjs docs/methodology
     node docs/methodology/tools/verify-fdge.mjs --all
     bash docs/methodology/tools/selftest.sh                          ← opcional, 105 casos

8. Confirma qué se creó y espera instrucción para ejecutar [START FOUNDATION].
   El PHASE 0 de Foundation REDACTA la Declaración de Valor leyendo el repositorio y los
   documentos de negocio; el humano la corrige y la firma [FND-R24]. No se pide en blanco.
```

Sustituye `<RUTA_ABSOLUTA_DEL_PROYECTO>` por la ruta real (`C:/proyectos/mi-app`).

---

## Flujo tras la instalación

Trabaja **desde el proyecto destino**.

```
[START FOUNDATION]              documenta el codebase existente
[FOUNDATION VALIDATED]          ACK humano — habilita el resto de la suite

# Desarrollo. PHASE 0 al inicio de cada sesión.
[START PT] BUG: <título>        abre trabajo → PHASE 1 (Intake) → G1
[START EP] <título>             abre un lote
resume PT-XXX                   retoma un PT en su fase actual
status FDGE                     PTs vivos, ramas, incidentes, hotfixes vencidos

[START QA]                      verifica flujos de usuario en navegador real
delta QA PT-XXX                 re-ejecuta solo los casos afectados por un PT
status QA

[START PTSA]                    audita los productos generados
resume PTSA                     reanuda una auditoría inconclusa
delta PTSA                      re-audita lo afectado sobre una auditoría completa
status PTSA

[START FPGE]                    roadmap priorizado por evidencia
promote FPGE R-NNN              → FDGE PHASE 1 (Intake), con firma humana pendiente
status FPGE
```

Prompts operativos: `docs/methodology/*-Prompts.md`, uno por componente.

---

## Qué cambia respecto a la v3

Si vienes de la 3.0.0, lee la guía de migración del
[CHANGELOG](docs/methodology/CHANGELOG.md). Los cinco cambios que más notarás:

1. **Todo trabajo entra por un Intake firmado.** El humano declara el comportamiento
   esperado y los criterios de aceptación; el agente los formaliza. Antes los inventaba el
   agente y el humano los sellaba con un ACK.
2. **`PHASE` sustituye a `Estado n` / `STATE n` / `FASE n` / `F-n`.** `Estado 4` significaba
   *diseñar* y `STATE 4` significaba *implementar*: un agente que leía ambos documentos
   recibía órdenes contradictorias.
3. **Modos de ejecución.** Cuatro compuertas en lugar de once ACKs, y una lista cerrada de
   acciones que ningún modo automatiza. Más lotes `EP-NNN`.
4. **El ciclo se completa.** `PHASE 9 — Integration` (PR, CI, merge, cierre de rama) y
   `PHASE 10 — Rollback` (incidentes, revert, seguimiento). Antes el workflow de git
   terminaba en el último commit y la rama quedaba abierta indefinidamente.
5. **Verificación mecánica.** `verify-suite.mjs` y `verify-fdge.mjs`. Un checklist que el
   agente rellena sobre sí mismo no es un control; un check que puede fallar sí lo es.

---

## Cuándo volver a este repositorio

- Para evolucionar la metodología (ver las reglas en [`CLAUDE.md`](CLAUDE.md)).
- Para sincronizar mejoras a proyectos destino ya instalados.
- Como referencia normativa ante cualquier duda.

**No uses este repositorio como workspace de desarrollo.** Cada proyecto destino tiene su
propia copia del framework y sus propios artefactos.
