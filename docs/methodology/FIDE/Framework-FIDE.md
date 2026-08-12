# Framework FIDE — Investigación y Diseño Evolutivo

> **Naturaleza: explicativo** (`LEX-R22`). Las reglas se citan por ID desde
> [RULES.md](../RULES.md) §Parte 10.
> Procedimiento: [FIDE-Implementation.md](FIDE-Implementation.md) ·
> Lanzador: [FIDE-CLAUDE-Launcher.md](FIDE-CLAUDE-Launcher.md)
> Vocabulario: [LEXICON.md](../LEXICON.md)
>
> Suite version: **5.0.0**

---

## 1. Propósito

**FIDE** es el «Eslabón Cero» de la suite: un motor de incubación que toma una idea de
negocio abstracta, la contrasta con el mercado real, diseña su arquitectura, monta el
andamiaje DevOps y delega la construcción al ciclo operativo.

Actúa como arquitecto de software y consultor de negocio, para que los proyectos nazcan con
viabilidad comercial y coherencia técnica antes de la primera línea de código operativo.

---

## 2. Reglas fundamentales

### 2.1 Soberanía Anfitrión–Huésped
`FIDE-R01`

FIDE opera desde un entorno **anfitrión** global. **Nunca** se instala en el proyecto
generado (el huésped). Incuba desde fuera, inyecta la suite operativa local y se retira.

### 2.2 Idempotencia
`FIDE-R02`

Toda ejecución es idempotente. Si el directorio ya contiene andamiaje o un
`00-Business-Case.md`, FIDE no destruye el progreso: retoma desde donde se quedó o aborta
limpiamente declarando que el proyecto superó la fase de génesis.

### 2.3 Autoridad consultiva, obediencia operativa
`FIDE-R03`

FIDE **debe advertir** si el usuario exige una arquitectura que considera subóptima para el
nicho investigado. Si el usuario insiste, FIDE obedece — y registra obligatoriamente la
decisión en `11-Conventions.md` bajo «Deuda Técnica Aceptada desde el Día Cero».

### 2.4 Compatibilidad con Foundation
`FIDE-R04` — **nueva en v4, y la más importante de las cuatro**

FIDE genera `docs/enterprise-documentation/` con **exactamente** los nombres canónicos de
`LEXICON.md` §6.1, y copia también los documentos de Foundation a `docs/methodology/`.

Este es el defecto que la v4 corrige y que rompía **todos** los proyectos nacidos de FIDE:

| FIDE v3 generaba | Todo lo demás leía |
|:---|:---|
| `00-BUSINESS_CASE.md` | — |
| `01-PRD.md` | `02-PRD.md` |
| `02-ARCHITECTURE.md` | `03-TRD.md`, `06-Backend-Architecture.md` |
| `03-CONVENTIONS.md` | `11-Conventions.md` |

FDGE `PHASE 2-E` abría `02-PRD.md` y encontraba la arquitectura. QA `PHASE 1` buscaba
`04-App-Flow.md` y `05-UI-UX-Brief.md`, que no existían. Y el guardarraíl *No Foundation
Skip* pasaba en verde porque comprobaba que la **carpeta** existiera, no los archivos —de
ahí `FND-R08`, que ahora verifica los archivos del núcleo.

Además, FIDE v3 copiaba «FDGE, QA, PTSA y FPGE» al huésped pero **no** Foundation, mientras
el `CLAUDE.md` que instalaba declaraba `Foundation-Protocol.md` como autoridad normativa.

---

## 3. Las cinco fases

| PHASE | Nombre | Qué produce |
|:--|:---|:---|
| 1 | **Discovery** | Investigación web real: competidores, modelos de monetización, stack óptimo para el nicho. |
| 2 | **Advisory** | Discovery Brief presentado al humano. Iteración hasta consenso. **ACK obligatorio.** |
| 3 | **Blueprinting** | `docs/enterprise-documentation/` con los nombres canónicos. |
| 4 | **Scaffolding** | Repositorio, Docker local, CI/CD, e inyección de la suite operativa completa. |
| 5 | **Handoff** | PRD desglosado en features, primer `ROADMAP.md`, y reemplazo del `CLAUDE.md` anfitrión por el de la suite. |

---

## 4. Qué hereda un proyecto nacido de FIDE

Al terminar `PHASE 5`, el proyecto arranca con:

- `docs/enterprise-documentation/` completa y con nombres canónicos.
- `docs/methodology/` con **toda** la suite —incluido Foundation— excepto `FIDE/`
  (`FIDE-R01`).
- `docs/implementation/` con `REGISTRY.json` inicializado, los ledgers vacíos y los índices.
- `CLAUDE.md` con las reglas vinculantes y `mode: SUPERVISED` declarado.
- Features del PRD volcadas al índice `ENRICHMENT.md` en estado `DRAFT`.
- `ROADMAP.md` con el primer lote propuesto.

`FIDE-R05` · Las features que FIDE vuelca **nacen en `DRAFT`, no en `READY`**: cada una
necesita pasar por `PHASE 1 (Intake)` de FDGE con su firma humana antes de construirse
(`FDGE-R01`). Un PRD generado por un agente a partir de una conversación de consultoría es
un excelente punto de partida y **no** es una declaración de intención firmada.

En v3, FIDE escribía las features con estado `PENDING` —un cuarto valor que no existía en
ninguna máquina de estados de la suite (`LEX-R20`).
