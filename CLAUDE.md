# C:/DevOps/claude — AI Development Methodology Suite

## Qué es este repositorio

Repositorio **fuente** de la AI-Assisted Software Development Methodology Suite: un framework
de gobernanza para desarrollo asistido por IA. Garantiza trazabilidad, evidencia y control
humano sobre toda decisión irreversible.

**Este no es un proyecto de desarrollo.** Es la metodología misma. Aquí no se construye
software: se mantiene y evoluciona el framework que se aplica a proyectos externos.

**Versión vigente: 4.0.0** — ver [docs/methodology/CHANGELOG.md](docs/methodology/CHANGELOG.md).

---

## Estructura

```
docs/methodology/
│
│   ── AUTORIDAD ────────────────────────────────────────────────
├── LEXICON.md                    Vocabulario canónico: fases, IDs, estados, archivos, triggers
├── RULES.md                      TODAS las reglas, con ID estable y severidad
├── EXECUTION-MODES.md            Compuertas, modos de ejecución, lotes EP-NNN
├── Suite-CLAUDE-Template.md      Texto para el CLAUDE.md de los proyectos destino
├── CHANGELOG.md                  Versiones y guía de migración
├── README.md                     Manual de la suite
│
│   ── COMPONENTES ──────────────────────────────────────────────
├── Foundation-Protocol.md · Foundation-Implementation.md · Foundation-Prompts.md
├── Framework-FDGE.md      · FDGE-Implementation.md      · FDGE-Prompts.md
├── Framework-FPGE.md      · FPGE-Implementation.md      · FPGE-Prompts.md
├── INTAKE/
│   ├── Intake-Protocol.md
│   └── templates/  BUG-REPORT.md · FEATURE-REQUEST.md · CHANGE-REQUEST.md
├── QA/    Framework-QA.md · QA-Implementation.md · QA-Prompts.md
├── PTSA/  PTSA-V3-Especificacion-Oficial.md · PTSA-Prompts.md
├── FIDE/  Framework-FIDE.md · FIDE-Implementation.md · FIDE-CLAUDE-Launcher.md
│
│   ── HERRAMIENTAS ─────────────────────────────────────────────
└── tools/ verify-suite.mjs · verify-fdge.mjs
```

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
| `desarrollo` | Donde se trabaja. | El trabajo diario |

El merge de `desarrollo` a `main` **es** `G4`: la compuerta de integración, humana por
definición. No es una convención de estilo — es la compuerta escrita en una herramienta que no
depende de que nadie se acuerde.

```bash
git switch desarrollo      # trabajar
npm run verify             # antes de proponer el merge
```
