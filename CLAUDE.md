# cauce — marco de gobernanza para desarrollo asistido por IA

## Qué es este repositorio

Repositorio **fuente** de cauce, publicado como [`@a81biz/cauce`](https://www.npmjs.com/package/@a81biz/cauce):
un framework de gobernanza para desarrollo asistido por IA. Garantiza trazabilidad, evidencia y
control humano sobre toda decisión irreversible.

**Aquí no se construye software de negocio: se mantiene y evoluciona el marco.** Pero el marco
se mantiene **bajo el marco** — desde `SUITE-R41` cauce se instala sobre sí mismo, con su
`REGISTRY.json`, su terreno firmado y sus compuertas. Un marco que se mantuviera al margen de
sus propias reglas sería el primer argumento en su contra.

**Versión vigente: 10.0.0** — ver [docs/methodology/CHANGELOG.md](docs/methodology/CHANGELOG.md).

> **Este archivo parametriza y orienta; no es la autoridad sobre el repositorio** (`FND-R12`).
> Lo que diga sobre su arquitectura se subordina a
> [`docs/enterprise-documentation/01-Platform-Overview.md`](docs/enterprise-documentation/01-Platform-Overview.md)
> y [`06-Backend-Architecture.md`](docs/enterprise-documentation/06-Backend-Architecture.md);
> sobre sus convenciones de código, a
> [`11-Conventions.md`](docs/enterprise-documentation/11-Conventions.md). Sobre las reglas de la
> suite manda `RULES.md`, y sobre los nombres, `LEXICON.md` (`LEX-R21`, `SUITE-R00`).

---

## Estructura

```
bin/cauce.mjs                     El binario: install · verify · compare · core · start · regla · version
.github/workflows/                verificacion.yml (bloquea) · publicar.yml (manual, desde main)

docs/methodology/
│
│   ── AUTORIDAD ────────────────────────────────────────────────
├── MANUAL.md                     De cero al primer trabajo cerrado · para quien USA cauce
├── CASOS-DE-USO.md               El catálogo: cada caso con su ruta, y los huecos declarados
├── LEXICON.md                    Vocabulario canónico: fases, IDs, estados, archivos, triggers
├── RULES.md                      TODAS las reglas, con ID estable y severidad
├── EXECUTION-MODES.md            Compuertas, modos de ejecución, lotes EP-NNN
├── PHASES.md                     Procedimiento denso por fase, en forma telegráfica
├── CORE.md · CORE-PTSA.md        GENERADOS por build-core · lo único que carga el agente
├── INSTALL.md                    Las nueve fases de la instalación conversacional
├── Suite-CLAUDE-Template.md      Texto para el CLAUDE.md de los proyectos destino
├── CHANGELOG.md                  Versiones, guía de migración y fuente de la versión vigente
├── README.md                     Manual de la suite
│
│   ── COMPONENTES ──────────────────────────────────────────────
├── Foundation-Protocol.md · Foundation-Implementation.md · Foundation-Prompts.md
├── Framework-FDGE.md      · FDGE-Implementation.md      · FDGE-Prompts.md
├── Framework-FPGE.md      · FPGE-Implementation.md      · FPGE-Prompts.md
├── INTAKE/
│   ├── Intake-Protocol.md
│   └── templates/  BUG-REPORT.md · FEATURE-REQUEST.md · CHANGE-REQUEST.md
│                   EPIC-INTAKE.md · TAREA.md
├── QA/    Framework-QA.md · QA-Implementation.md · QA-Prompts.md
├── PTSA/  PTSA-V3-Especificacion-Oficial.md · PTSA-Prompts.md · templates/COVERAGE.md
├── FIDE/  Framework-FIDE.md · FIDE-Implementation.md · FIDE-CLAUDE-Launcher.md
│
│   ── HERRAMIENTAS ─── 16, y ninguna es opcional ───────────────
└── tools/
    │   verificadores      verify-suite · verify-fdge · verify-qa · verify-ptsa · verify-patrones
    │   generadores        build-core (CORE y overlay) · version (alinea los 21 documentos)
    │   instalación        plan-layout (terreno) · migrate · comparar-marco
    │   seguridad          revisar-secretos (árbol e historia)
    │   estado             tracker (espejo con GitHub o Azure)
    │   consulta           regla — qué exige una regla y qué puede fallar, derivado
    │   compartido         patrones.mjs — los patrones críticos, con su contrato
    │   medición           audit (cobertura mecánica) · selftest.sh (la batería completa)
```

**Dónde vive el código.** No hay `src/`: el ejecutable está en `bin/` y en
`docs/methodology/tools/`, porque las herramientas **viajan dentro del paquete** que se instala
en el proyecto destino — ahí su sitio es `docs/methodology/tools/`. Es una desviación
consciente de la estructura que el propio marco pide, declarada en
[`11-Conventions.md`](docs/enterprise-documentation/11-Conventions.md).

---

## Los seis componentes

| Componente | Trigger | Función |
|:---|:---|:---|
| **FIDE** | `[START FIDE]` | Incubar un proyecto desde una idea de negocio (greenfield). Se retira tras instalar la suite. |
| **Foundation** | `[START FOUNDATION]` | Reverse-engineer del codebase → documentación verificada en `docs/enterprise-documentation/`. |
| **FDGE** | `[START PT]` · `[START EP]` | Gobernar cada sesión: Intake → Análisis → Estrategia → Propuesta → Implementación → Evidencia → Validación → Persistencia → Integración. |
| **FQAGE (QA)** | `[START QA]` | Verificar en un navegador real que el usuario puede usar el sistema. |
| **PTSA** | `[START PTSA]` | Auditar los productos generados contra el dominio de negocio declarado. |
| **FPGE** | `[START FPGE]` | Priorizar qué construir a continuación, con evidencia trazable. |

Ciclo: `FIDE → Foundation → FDGE → QA → PTSA → FPGE → FDGE PHASE 1 (Intake) → …`

---

## Reglas para evolucionar este framework

La v3 tenía la misma regla escrita a mano en cuatro documentos, y las cuatro copias
divergieron —eso produjo ocho defectos críticos, incluido un ruleset que ordenaba destruir
datos. La v4 corrige la causa, no solo los síntomas. **Al modificar la metodología:**

1. **Las reglas van a `RULES.md`.** Con ID estable y severidad. Ningún otro documento
   enuncia obligaciones: las **citan** por ID (`LEX-R22`).
2. **Los nombres van a `LEXICON.md`.** Fases, identificadores, estados, archivos, triggers.
   Introducir un nombre nuevo fuera de ahí es un defecto.
3. **Las compuertas van a `EXECUTION-MODES.md`.**
4. Los `*-Implementation.md` describen procedimiento; los `*-Prompts.md` dan el texto
   copiable; los `Framework-*.md` **explican y nunca mandan**.
5. **Verificar siempre antes de dar por hecho un cambio:**
   ```bash
   node docs/methodology/tools/verify-suite.mjs docs/methodology
   ```
   Detecta vocabulario derogado, reglas citadas que no existen, obligaciones en documentos
   que solo deben explicar, enlaces rotos y versiones desalineadas.
6. Si el cambio rompe compatibilidad: subir `MAJOR` en `CHANGELOG.md` y **escribir la guía
   de migración**. Los proyectos destino ya instalados dependen de ella.
7. Actualizar `Suite-CLAUDE-Template.md` solo si cambia lo que el proyecto destino debe
   **parametrizar** — no para replicar reglas.

**Los componentes son independientes.** Un cambio en FDGE no debe romper QA, PTSA ni FPGE.

---

## Aplicar la suite a un proyecto

Ver [README.md](README.md) en la raíz (escenarios greenfield y legado) o
[docs/methodology/README.md](docs/methodology/README.md) §4 para el detalle.

---

## Ramas   `SUITE-R06a` · `FDGE-R33`

Una sola copia de trabajo. Ahora que existen el remoto y el paquete, el papel de «original» lo
tiene GitHub, no una carpeta: mantener un directorio «original» **más** un clon recrea justo la
divergencia que este marco existe para eliminar (`SUITE-R31`).

| Rama | Para qué | Quién escribe |
|:---|:---|:---|
| `main` | **Segura.** Lo publicado y publicable. `publicar.yml` solo publica desde aquí. | Nadie directamente: llega por merge |
| `trabajo` | Rama de **integración**: recibe el PR de cada tarea. | Nadie directamente: llega por merge de una tarea |
| `<type>/PT-NNN-slug` | **Efímera**, una por tarea. Nace de `trabajo` en `PHASE 5` y se borra al fusionarse. | El trabajo de esa tarea |

El merge de `trabajo` a `main` **es** `G4`: la compuerta de integración, humana por
definición. No es una convención de estilo — es la compuerta escrita en una herramienta que no
depende de que nadie se acuerde.

**El PR de una tarea a `trabajo` NO es `G4`**: es revisión. `G4` no se multiplica por tarea
(`FDGE-R19`, `EXEC-R03`).

```bash
git switch trabajo                              # partir de la integración
git checkout -b feature/PT-NNN-slug             # PHASE 5 · FDGE-R19
npm run verify                                  # antes de proponer nada
```

> Esta tabla declaró durante 46 tareas **dos** ramas y ninguna por tarea, mientras `PHASE 5`
> mandaba crearla — en el documento que `SUITE-R00` dice que no puede derogar una regla.
> Lo corrigió `PT-047`, y lo que lo hizo visible fue auditar el propio uso del marco, no leerlo.

**`origin/desarrollo` sobra.** Este documento describía `desarrollo` como la rama de trabajo
mientras el trabajo ocurría en `trabajo`: la compuerta `G4` estaba escrita sobre una rama que
nadie usaba. Foundation lo registró como divergencia `D8` y aquí se escribe **la que hay**.
Borrar la rama remota sobrante es `SUITE-R06f` —reescritura de historia y borrado de ramas
remotas no se automatizan—, así que queda como acción humana pendiente:

```bash
git push origin --delete desarrollo    # cuando confirmes que no cuelga nada de ella
```

---

# Part 2 — Methodology Suite

> Instalado el 2026-08-13 desde `Suite-CLAUDE-Template.md` (`I6`). Autoalojado: este
> repositorio **es** cauce (`SUITE-R41`), así que la suite que lo gobierna es la que vive en
> `docs/methodology/`, no una copia.

## Qué carga el agente

**`docs/methodology/CORE.md`** — reglas y procedimiento, y nada más (`SUITE-R15`).
Cualquier otro documento se abre **solo** cuando `CORE.md` lo remite para un caso concreto.

Este bloque **no repite las reglas** (`SUITE-R21`): un resumen que se carga en cada sesión es
a la vez coste de tokens y una copia que puede divergir.

```
docs/methodology/CORE.md          ← lo único que se carga por defecto
├── LEXICON.md          nombres: fases, IDs, estados, archivos, triggers
├── RULES.md            reglas de componente, con ID y severidad
├── EXECUTION-MODES.md  compuertas, modos, lotes
└── PHASES.md           procedimiento denso por fase

docs/methodology/CORE-PTSA.md     ← SOLO con [START PTSA] · SUITE-R25
└── PTSA/PTSA-V3-Especificacion-Oficial.md   las 80 reglas de auditoría
```

Orden de autoridad ante conflicto (`LEX-R21`):
`LEXICON` → `RULES` → `EXECUTION-MODES` → **este `CLAUDE.md`** → `PHASES` y `*-Prompts` →
`Framework-*` (explican, nunca mandan).

`SUITE-R00` · Este archivo **parametriza**; no legisla. Ninguna regla puede derogarse aquí.

---

## Parametrización del proyecto

**Única sección que se personaliza.** Todo lo demás son punteros.

```yaml
suite_version: 10.0.0
execution_mode: SUPERVISED        # MANUAL | SUPERVISED | AUTONOMOUS
firmantes:                        # quién puede firmar un Intake y resolver una compuerta
  - Alberto Martínez
plataforma: github                # SUITE-R35 · el registro asigna, la plataforma espeja
```

`SUITE-R27` · La lista `firmantes` es la única defensa mecánica que existe contra una firma
inventada. **No prueba que firmara una persona** —el agente escribe el archivo— pero sí
convierte la firma en una afirmación contrastable: un nombre que no está en la lista falla, y
quien aparece en ella responde de lo que lleva su nombre.

### Declaración de Valor   `FND-R24`

Redactada por el agente en Foundation `PHASE 0` leyendo el repositorio, y firmada por una
persona. PTSA audita los productos reales contra ella.

```
Dominio de negocio:  Gobernanza del desarrollo asistido por IA: hacer que toda decisión
                     irreversible pase por una persona y que toda afirmación tenga
                     evidencia verificable.
Para quién:          Quien construye software con agentes y necesita trazabilidad
                     auditable — incluido el equipo de una sola persona asistida por IA,
                     que SUITE-R22 declara explícitamente soportado.

P-001  Marco normativo         LEXICON · RULES · EXECUTION-MODES · CORE.md compilado
       VÁLIDO si: cada regla tiene ID estable, severidad y un único documento
       propietario, y ninguna se define dos veces.

P-002  Procedimiento ejecutable  PHASES · INSTALL · los *-Implementation y *-Prompts
       VÁLIDO si: un agente puede ejecutar una fase completa sin abrir un documento
       que CORE.md no le remita.

P-003  Verificación mecánica     las 15 herramientas de tools/
       VÁLIDO si: cada regla HARD que declara comprobación tiene un script que puede
       fallar, y el fallo es distinguible del éxito (SUITE-R38).

P-004  Paquete e instalación     @a81biz/cauce · bin/cauce.mjs · publicar.yml
       VÁLIDO si: instalar deja el marco anclado a una versión y sincronizar a ciegas
       es imposible en las dos direcciones.

Estado: FIRMADA. PTSA audita contra esta declaración.
Firmada por: Alberto Martínez
Fecha: 2026-08-13
```

Lo único que no puede redactar el agente es **qué hace válido** un producto: describirá lo que
el sistema entrega, pero si eso sirve o no lo sabe quien conoce el negocio. Las cuatro reglas
de validez de arriba las confirmó el firmante.

---

## Lo que nunca se automatiza — `SUITE-R06`

```
a) merge o push a la rama principal      e) modificar docs/methodology/
b) cerrar un ítem de tipo BUG            f) push --force · reescribir historia
c) migrar o borrar datos                 g) rotar o exponer credenciales
d) tocar producción
```

En este repositorio la cláusula `(e)` cubre **su propio contenido**: `docs/methodology/` es a la
vez el marco instalado y el producto que se mantiene. Modificarlo no es trabajo de paso.

Si un trabajo lo requiere: preparar todo lo demás, detenerse en el punto exacto y
**describir el comando**. No ejecutarlo (`EXEC-R07`).

---

## Verificación

```bash
node docs/methodology/tools/verify-fdge.mjs PT-XXX             # cumplimiento de un PT
node docs/methodology/tools/verify-fdge.mjs --gate G4 PT-XXX   # precondiciones de merge
node docs/methodology/tools/verify-suite.mjs docs/methodology   # coherencia de la metodología
node docs/methodology/tools/build-core.mjs                      # regenerar CORE tras tocar reglas
node docs/methodology/tools/tracker.mjs espejo                  # registro ↔ issues de GitHub
npm run verify                                                  # todo lo anterior, como en CI
```

`FDGE-R34` · `verify-fdge` sin errores es precondición de **G4**.

---

## Regla de cumplimiento

Si cualquier fase, compuerta o precondición está incompleta: **detenerse**, reportar la
condición bloqueante y no continuar hasta resolverla, o hasta que un humano autorice la
excepción dejando registro de esa autorización.
