# QA-Implementation — Framework de Quality Assurance Gobernado por Evidencia

> Responde: ¿Cómo se materializa el FQAGE dentro de un repositorio de software?
>
> Esta implementación materializa los principios del FQAGE mediante artefactos persistentes, un ciclo de propuesta–aprobación–ejecución–reporte, y trazabilidad completa de defectos.

---

# Objetivo de la Implementación

La implementación del FQAGE tiene un único propósito:

**Convertir cada ciclo de QA en un proceso trazable de lectura del sistema, propuesta de casos, aprobación humana, ejecución automatizada en navegador, evidencia por captura de pantalla y reporte estructurado.**

El framework asume que:

- El agente QA no tiene acceso al código fuente durante la ejecución.
- Toda ejecución ocurre sobre la URL del sistema desplegado.
- El humano siempre autoriza qué se prueba antes de que se ejecute.
- Toda evidencia es una captura de pantalla nombrada y fechada.
- Un fallo sin QD-XXX no existe como fallo: es solo una observación.

---

# Estructura de Carpetas

```text
QA/
├── QA-PLAN.md              ← Plan de Pruebas vigente (se sobrescribe en cada ciclo)
├── qa-score-history.json   ← Historial de scores QA (append-only)
├── QA-DEFECTS.md           ← Registro de todos los QD-XXX (append-only)
├── QA-LOG.md               ← Log inmutable de operaciones (append-only)
│
├── cases/
│   └── QA-XXX.md           ← Un archivo por caso de prueba (persistentes entre ciclos)
│
└── reports/
    └── QR-XXX/             ← Un directorio por ciclo de QA ejecutado
        ├── REPORT.md       ← Reporte ejecutivo del ciclo
        ├── summary.json    ← Resultado estructurado (para qa-score-history)
        └── evidence/
            └── QA-XXX-step-YY-[pass|fail].png
```

```text
qa/                         ← Código Playwright (en la raíz del proyecto, no en docs/)
├── tests/
│   └── QA-XXX.spec.ts      ← Un spec por caso de prueba
└── fixtures/
    └── test-data.ts        ← Datos de prueba reutilizables

playwright.config.ts        ← Configuración Playwright (raíz del proyecto)
```

---

# Fases del Ciclo QA

## Visión General

```text
[START QA]
    ↓
PHASE 1 — Reconocimiento
  Lee Foundation docs: PRD, App Flow, UI/UX Brief, API Catalog
  Identifica flujos candidatos
    ↓ STOP
PHASE 2 — Propuesta de Plan
  Genera QA-PLAN.md con todos los casos propuestos
  Cada caso: tipo, eje, precondiciones, pasos, resultado esperado
    ↓ STOP — [ACK HUMANO + REFINAMIENTO]
PHASE 3 — Generación de Specs
  Genera los archivos .spec.ts de Playwright para los casos aprobados
  No ejecuta aún
    ↓ STOP — [ACK HUMANO]
PHASE 4 — Ejecución
  Ejecuta npx playwright test
  Captura screenshots paso a paso
    ↓
PHASE 5 — Análisis de Resultados
  Analiza resultados
  Crea QD-XXX por cada fallo
  Calcula Health Score QA
    ↓
PHASE 6 — Reporte
  Genera QR-XXX/REPORT.md
  Actualiza qa-score-history.json
  Actualiza QA-LOG.md
    ↓ STOP — [HUMAN REVIEW]
PHASE 7 — Promoción de Defectos
  Por cada QD aprobado para promoción:
    → PT-XXX en FDGE (BUG)
    → H-XXX en PTSA (si aplica)
```

---

# PHASE 1 — Reconocimiento

## Propósito

Leer el sistema desde sus documentos de Foundation para entender qué hace, qué flujos existen y qué puede romperse desde la perspectiva del usuario.

## Fuentes obligatorias (en orden)

| # | Documento | Qué extrae QA |
|:--|:---|:---|
| 1 | `docs/enterprise-documentation/02-PRD.md` | Casos de uso, roles de usuario, reglas de negocio |
| 2 | `docs/enterprise-documentation/04-App-Flow.md` | Flujos end-to-end, diagramas de navegación |
| 3 | `docs/enterprise-documentation/05-UI-UX-Brief.md` | Pantallas existentes, componentes interactivos |
| 4 | `docs/enterprise-documentation/08-API-Catalog.md` | Endpoints que la UI invoca (para entender qué puede fallar) |
| 5 | Directorio `QA/cases/` | Catálogo histórico persistente (para identificar regresiones) |
| 6 | `QA/QA-DEFECTS.md` | Defectos abiertos de ciclos anteriores (pueden ser regresión) |
| 7 | `docs/implementation/HANDOFF.md` | Estado actual, PTs recientes (nuevo código = nuevos casos) |

## Fuentes opcionales

- `changes/PT-XXX-slug/test-scenarios.md` de PTs recientes → casos candidatos derivados del desarrollo.
- `PTSA/Findings/H-XXX.md` activos → pueden generar casos de verificación QA.

## Output de la PHASE 1

Un mapa de flujos candidatos. No se escribe en ningún artefacto todavía. Es el insumo para la PHASE 2.

```text
Flujos identificados:
- Registro de usuario (crítico — Happy Path)
- Login / Logout
- Recuperación de contraseña
- [Flujo de negocio 1]
- [Flujo de negocio 2]
- [Flujo de error: recurso no encontrado]
- [Validación de formulario: campo email]
```

---

# PHASE 2 — Propuesta de Plan de Pruebas

## Propósito

Generar el `QA/QA-PLAN.md` con todos los casos propuestos para este ciclo. Este documento es el contrato entre el agente y el humano sobre qué se va a probar.

## Fuentes de casos

El agente genera casos desde tres fuentes, combinadas:

### Fuente A — Foundation (inferido)
Casos derivados del PRD, App Flow y UI/UX Brief. Son los casos que el agente infiere deben existir aunque no hayan sido especificados explícitamente.

### Fuente B — FDGE (reutilizados)
Los `test-scenarios.md` de los Proposal Packages de PTs recientes. El agente los adapta a formato QA con pasos de navegación de navegador.

### Fuente C — Humano (declarados)
El humano puede agregar, modificar o eliminar casos propuestos durante el ACK de la PHASE 2.

## Estructura del QA-PLAN.md

```markdown
# QA Plan — Ciclo QR-XXX
Fecha: YYYY-MM-DD
Sistema: [nombre]
URL Base: [QA_BASE_URL]
Credenciales de prueba: [tabla de roles y usuarios de prueba — sin passwords reales]
Última Foundation: [fecha de la última ejecución de Foundation Protocol]
PTs cubiertos por este ciclo: PT-XXX, PT-YYY, PT-ZZZ

---

## Resumen de Casos

| ID | Tipo | Eje | Flujo | Estado |
|:---|:---|:---|:---|:---|
| QA-001 | HP | Funcionalidad | Registro de usuario | PENDING |
| QA-002 | EC | Validación | Registro — email duplicado | PENDING |
| QA-003 | EF | Error Flow | Login — credenciales incorrectas | PENDING |
| QA-004 | REG | Regresión | [Flujo que pasó en QR-002] | PENDING |

---

## Casos de Prueba

### QA-001 — Happy Path: Registro de usuario

**Fuente:** Foundation (PRD §3.1 — Caso de uso UC-01)
**Tipo:** HP (Happy Path)
**Eje:** Funcionalidad
**Complejidad:** STANDARD
**Regresión desde:** N/A (nuevo)

**Precondiciones:**
- Sistema levantado en QA_BASE_URL
- Email de prueba no registrado previamente: qa-test-001@test.local
- Usuario de prueba: ninguno (flujo de registro)

**Pasos:**
1. Navegar a [QA_BASE_URL]/register
2. Completar campo "Nombre": "QA Test User"
3. Completar campo "Email": "qa-test-001@test.local"
4. Completar campo "Password": "[ver fixtures/test-data.ts]"
5. Click en botón "Registrarse"
6. Esperar redirección

**Resultado esperado:**
- El sistema redirige a /dashboard (o página de bienvenida declarada en PRD)
- Se muestra mensaje de confirmación con el nombre del usuario
- El usuario está autenticado (se muestra su nombre en el header)

**Resultado esperado en caso de error:**
- Si el sistema muestra un mensaje de error: FAIL con QD-XXX
- Si el sistema no redirige en 5 segundos: FAIL con QD-XXX
- Si el usuario no aparece autenticado tras redirección: FAIL con QD-XXX

**Capturas requeridas:**
- Paso 1: página de registro inicial
- Paso 5: formulario completo antes de submit
- Paso 6: resultado (éxito o error)

**Estado:** PENDING
```

## Regla de Nomenclatura QA-XXX

- `QA-XXX` es el identificador permanente del caso de prueba.
- Es monótono, nunca se reutiliza, independiente del ciclo.
- El ciclo se identifica con `QR-XXX` (QA Run).
- Un caso QA-001 puede ejecutarse en QR-001, QR-002, QR-003, etc.

## Regla de Número de Ciclo QR-XXX

`QA-R13` · Los identificadores `QA-NNN`, `QR-NNN` y `QD-NNN` se asignan **exclusivamente**
desde `docs/implementation/REGISTRY.json` (`SUITE-R08`): leer el contador, incrementarlo,
escribirlo y registrar la asignación, todo en la misma operación.

- Los ciclos delta se identifican como `QR-NNN-delta-PT-XXX` y **no** consumen un número
  nuevo del contador: reutilizan el `QR-NNN` del último ciclo completo con sufijo.

> **Por qué cambió.** La v3 derivaba el número contando entradas de
> `QA/qa-score-history.json`: *«si tiene N entradas, el ciclo es QR-(N+1)»*. Pero los ciclos
> delta **también** se appendean a ese archivo —el propio documento lo mostraba en su ejemplo
> de `qa-score-history.json`— aunque la regla afirmaba que no incrementan el contador. El
> resultado es que el contador se desalinea con el primer delta y a partir de ahí todos los
> ciclos llevan un número equivocado. Es el antipatrón **Counter Drift**.

## Trazabilidad de los casos hacia FDGE

`QA-R19` · Todo caso `QA-NNN` generado a partir de un PT **cita el `AC-nn` que verifica**.

Un caso QA sin trazabilidad al criterio de aceptación que comprueba es una exploración, no
un caso certificable: nadie puede responder después «¿qué caso QA cubre AC-03?». La cadena
completa está definida en [INTAKE/Intake-Protocol.md §5](../INTAKE/Intake-Protocol.md):

```
Intake            Proposal          Implementación     Evidencia        QA
AC-01  ────────▶  TS-01, TS-02  ─▶  test:línea  ────▶  evidence/…  ──▶  QA-014
(humano)          (agente)          (agente)          (ejecución)      (agente)
```

En el `QA-PLAN.md` esto se declara como:

```
**Fuente:** FDGE PT-042 · AC-01 («POST /items responde 201 con el ID creado»)
```

Los casos derivados de Foundation (Fuente A) citan la sección del PRD o del App Flow de la
que nacen. Los declarados por el humano (Fuente C) citan «humano» y la fecha.

## STOP de PHASE 2 — ACK Humano

El agente presenta el QA-PLAN.md completo y se detiene.

El humano puede:
- Aprobar el plan completo → proceder a PHASE 3.
- Modificar casos (agregar, cambiar resultado esperado, eliminar casos).
- Cambiar la URL o credenciales.
- Marcar casos como `SKIP` (excluidos de este ciclo, sin eliminarse).
- Rechazar el plan y solicitar una propuesta nueva.

**El agente NO procede a PHASE 3 sin ACK explícito.**

---

# PHASE 3 — Generación de Specs Playwright

## Propósito

Convertir los casos aprobados del QA-PLAN.md en archivos `.spec.ts` ejecutables por Playwright. No se ejecuta nada en esta fase.

## Estructura de un spec

```typescript
// qa/tests/QA-001-registro-usuario-happy-path.spec.ts

import { test, expect } from '@playwright/test';

test.describe('QA-001 — Happy Path: Registro de usuario', () => {

  test('HP-001: Usuario completa registro con datos válidos', async ({ page }) => {

    // PASO 1 — Navegar a página de registro
    await page.goto('/register');
    await page.screenshot({
      path: 'QA/reports/QR-XXX/evidence/QA-001-step-01-register-page.png'
    });

    // PASO 2 — Completar nombre
    await page.fill('[data-testid="field-name"]', 'QA Test User');

    // PASO 3 — Completar email
    await page.fill('[data-testid="field-email"]', 'qa-test-001@test.local');

    // PASO 4 — Completar password
    await page.fill('[data-testid="field-password"]', process.env.QA_TEST_PASSWORD!);

    // Screenshot antes de submit
    await page.screenshot({
      path: 'QA/reports/QR-XXX/evidence/QA-001-step-04-form-filled.png'
    });

    // PASO 5 — Submit
    await page.click('[data-testid="btn-register"]');

    // PASO 6 — Esperar resultado
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    await page.screenshot({
      path: 'QA/reports/QR-XXX/evidence/QA-001-step-06-dashboard-after-register.png'
    });

    // ASSERTIONS
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('[data-testid="user-greeting"]')).toContainText('QA Test User');
  });
});
```

## Convenciones de Specs

### Naming de archivos

```
qa/tests/QA-[NNN]-[slug].spec.ts
```

### Naming de screenshots

```
QA-[NNN]-step-[NN]-[descripcion-breve]-[pass|fail].png
```

Ejemplos:
```
QA-001-step-01-register-page.png
QA-001-step-04-form-filled.png
QA-001-step-06-dashboard-after-register.png
QA-001-step-06-dashboard-fail.png       ← cuando falla
```

### Convención de selectores

El agente QA **prefiere** selectores `data-testid` declarados en la documentación Foundation (UI/UX Brief o Conventions).

Si no existen:
1. Roles ARIA (`role=button[name="Registrarse"]`)
2. Labels (`label:has-text("Email")`)
3. Texto visible (`text="Registrarse"`)
4. Selectores CSS como último recurso (documentar en el spec por qué)

**El agente NUNCA usa selectores basados en clases CSS de styling** (`.btn-primary`, `.form-input`). Son frágiles y no reflejan la intención del usuario.

### Manejo de tiempos de espera

```typescript
// ✅ Correcto: esperar condición específica
await page.waitForURL('**/dashboard', { timeout: 5000 });
await page.waitForSelector('[data-testid="success-message"]', { timeout: 3000 });

// ❌ Prohibido: sleep fijo
await page.waitForTimeout(2000); // nunca usar en producción QA
```

### Datos de prueba

Los datos de prueba nunca se hardcodean en el spec. Viven en:

```typescript
// qa/fixtures/test-data.ts
export const TEST_USERS = {
  newUser: {
    name: 'QA Test User',
    email: 'qa-test-001@test.local',
  },
  existingUser: {
    email: process.env.QA_EXISTING_USER_EMAIL || 'qa-existing@test.local',
    // password: desde process.env.QA_TEST_PASSWORD
  },
};
```

### Estrategia de datos de prueba

Establece la estrategia antes de ejecutar el primer ciclo QA:

| Escenario | Estrategia recomendada |
|:---|:---|
| **Ambiente de staging dedicado** | Usuarios de prueba creados una vez. Emails del dominio `@test.local`. No afectan producción. |
| **Solo ambiente de producción** | STOP. QA no debe ejecutarse contra producción sin aislamiento. Solicitar al humano que provisione staging. |
| **Datos persistentes entre ciclos** | Los usuarios creados en QR-001 pueden existir en QR-002. Usar `QA_EXISTING_USER_EMAIL` como variable de entorno para el usuario que ya existe. El `newUser` debe tener un email único por ciclo (usar timestamp: `` qa-test-${Date.now()}@test.local ``). |
| **Sistema sin roles múltiples** | Solo usar `newUser` y `existingUser`. Omitir `adminUser`. |
| **Sistema con roles múltiples** | Definir una entrada en `TEST_USERS` por cada rol declarado en el PRD. Cada rol tiene su propia variable de entorno para email y password. |

**Regla de aislamiento:** Ningún test QA debe depender del estado dejado por otro test. Cada caso es independiente. Si el caso requiere que un usuario exista, ese usuario debe existir antes del test (setup en `beforeAll` o fixture dedicado).

## STOP de PHASE 3 — ACK Humano

El agente presenta los specs generados y se detiene.

El humano puede:
- Aprobar los specs → proceder a PHASE 4 (ejecución).
- Modificar selectores si conoce los reales.
- Agregar datos de prueba específicos del entorno.
- Pedir ajustes en assertions.

**El agente NO ejecuta Playwright sin ACK explícito.**

---

# PHASE 4 — Ejecución

## Propósito

Ejecutar los specs aprobados con Playwright y capturar resultados.

## Comando de ejecución

```bash
# Ejecutar todos los casos del ciclo
QA_BASE_URL=https://[url] npx playwright test --reporter=json

# Ejecutar un caso específico
QA_BASE_URL=https://[url] npx playwright test QA-001 --reporter=json

# Ejecutar solo regresiones
QA_BASE_URL=https://[url] npx playwright test --grep @regression
```

## Regla de Ejecución

El agente ejecuta los casos en este orden obligatorio:

1. **Casos REG (Regresión)** — siempre primero. Si hay regresiones críticas, el agente las reporta inmediatamente sin esperar a completar el ciclo.
2. **Casos HP (Happy Path)** — segundo. Si cualquier Happy Path falla, el agente anota el FAIL crítico y continúa (no aborta).
3. **Casos EC (Edge Cases)** — tercero.
4. **Casos EF (Error Flows)** — cuarto.

## Regla de No-Intervención

Durante la ejecución, el agente **NO modifica código**, **NO reinicia el servidor**, **NO altera el estado del sistema**.

Si el sistema está caído o la URL no responde: **STOP** inmediato, reporte de bloqueo, esperar instrucciones del humano.

## Estado de cada caso durante ejecución

```
PENDING → RUNNING → PASS | FAIL | SKIP | ERROR
```

| Estado | Significado |
|:---|:---|
| `PASS` | El resultado observado coincide con el resultado esperado. |
| `FAIL` | El resultado observado diverge del esperado. Genera QD-XXX. |
| `SKIP` | Marcado para no ejecutar en este ciclo (por el humano en PHASE 2). |
| `ERROR` | El spec no pudo ejecutarse (error de Playwright, URL caída, timeout de infraestructura). No es un FAIL del sistema: es un problema de ejecución QA. |

---

# PHASE 5 — Análisis de Resultados

## Propósito

Procesar los resultados de Playwright, crear QD-XXX por cada FAIL y calcular el Health Score QA.

## Proceso de análisis

### Para cada caso FAIL:

1. Identificar el paso exacto en que falló.
2. Identificar la captura de pantalla del fallo.
3. Redactar la descripción del fallo: qué se esperaba, qué ocurrió, diferencia.
4. Asignar severidad (CRITICAL / HIGH / MEDIUM / LOW).
5. Sugerir promoción (→ PT-XXX BUG en FDGE / → H-XXX en PTSA / → ninguna).
6. Crear entrada en `QA/QA-DEFECTS.md`.

### Cálculo del Health Score QA

```
Global Score = (Total PASS / (Total PASS + Total FAIL)) × 100

Score por eje:
  Funcionalidad   = (PASS HP / Total HP) × 100
  Validación      = (PASS EC formval / Total EC formval) × 100
  Error Flows     = (PASS EF / Total EF) × 100
  Regresión       = (PASS REG / Total REG) × 100
  Accesibilidad   = (PASS acc / Total acc) × 100
  Performance     = (PASS perf / Total perf) × 100
```

### Regla del Score Crítico

```
SI cualquier caso HP tiene estado FAIL:
    QA Score = QA-F  (independiente del porcentaje calculado)
    Motivo: "Happy Path critical failure"
```

## Archivo QA-DEFECTS.md

Append-only. Registro permanente de todos los defectos encontrados en todos los ciclos.

```markdown
## QD-001

Ciclo QA: QR-001
Fecha: 2026-06-25
Caso de origen: QA-001
Eje: Funcionalidad
Severidad: CRITICAL
Estado: READY

### Descripción

**Esperado:** El sistema redirige a /dashboard después del registro exitoso.
**Observado:** El sistema muestra pantalla en blanco y no redirige.
**Paso en que falló:** Paso 6 — waitForURL('/dashboard', timeout: 5000) → TimeoutError

### Evidencia

Screenshot: QA/reports/QR-001/evidence/QA-001-step-06-dashboard-fail.png

### Promoción sugerida

→ PT-XXX (BUG en FDGE) — el comportamiento esperado está en el PRD §3.1 UC-01.
El agente no puede determinar si es frontend o backend sin inspección de código.
Clasificar como MAJOR hasta que FDGE determine causa raíz.

### Historial

2026-06-25: READY — detectado en QR-001
```

---

# PHASE 6 — Reporte

## Propósito

Generar el Reporte ejecutivo del ciclo `QA/reports/QR-XXX/REPORT.md` y actualizar el historial de scores.

## Estructura del REPORT.md

```markdown
# QA Report — QR-XXX

**Fecha de ejecución:** YYYY-MM-DD HH:MM
**Sistema:** [nombre]
**URL probada:** [QA_BASE_URL]
**PTs cubiertos:** PT-XXX, PT-YYY
**Ejecutado por:** Agente QA (Playwright v[version])

---

## Resultado Global

| Clasificación | Score | Total casos | PASS | FAIL | SKIP | ERROR |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **QA-B** | **87/100** | 23 | 20 | 2 | 1 | 0 |

---

## Score por Eje

| Eje | Score | PASS | FAIL |
|:---|:---:|:---:|:---:|
| Funcionalidad (HP) | 100% | 5/5 | 0 |
| Validación (EC) | 80% | 8/10 | 2 |
| Error Flows (EF) | 83% | 5/6 | 1 |
| Regresión (REG) | 100% | 3/3 | 0 |
| Accesibilidad | 75% | 3/4 | 1 |
| Performance | 100% | 2/2 | 0 |

---

## Defectos Encontrados

| QD | Caso | Eje | Severidad | Descripción breve |
|:---|:---|:---|:---|:---|
| QD-001 | QA-015 | Validación | MEDIUM | Campo email acepta formato inválido sin error |
| QD-002 | QA-019 | Error Flow | HIGH | Error 500 en login no muestra mensaje al usuario |
| QD-003 | QA-022 | Accesibilidad | LOW | Botón "Guardar" sin aria-label en modal de edición |

---

## Casos PASS

| QA | Descripción | Tipo |
|:---|:---|:---|
| QA-001 | HP: Registro de usuario | HP |
| QA-002 | HP: Login con credenciales válidas | HP |
| ... | ... | ... |

---

## Casos FAIL

### QA-015 — Campo email acepta formato inválido
**Eje:** Validación
**Paso fallido:** Paso 3 — submit con email "notanemail"
**Esperado:** Mensaje de error de validación antes del submit
**Observado:** El formulario hace submit y retorna error 400 del servidor (sin mensaje en UI)
**Severidad:** MEDIUM
**Screenshot:** [QA-015-step-03-email-validation-fail.png](evidence/QA-015-step-03-email-validation-fail.png)

---

## Capturas de Evidencia

[Ver directorio: evidence/](evidence/)

Total capturas: 67
Por caso: promedio 3.2 capturas

---

## Defectos Pendientes de Ciclos Anteriores

| QD | Ciclo origen | Severidad | Estado | Verificado en este ciclo |
|:---|:---|:---|:---|:---|
| QD-000 (ejemplo) | QR-000 | HIGH | READY | NO — no hay caso REG asociado aún |

---

## Recomendaciones

1. QD-002 (HIGH — Error 500 sin mensaje): promover a PT-XXX BUG MAJOR. Afecta flujo de Login.
2. QD-001 (MEDIUM — validación email): promover a PT-XXX BUG STANDARD.
3. QD-003 (LOW — aria-label): acumular con otros hallazgos de accesibilidad para un PT de mejora.

---

## Estado de Certificación QA

**QA-B** — Sistema apto para producción con observaciones.
Defectos críticos: 0
Defectos high: 1 (QD-002 — requiere resolución antes de próximo deploy mayor)
```

## Archivo summary.json

```json
{
  "cycle": "QR-001",
  "date": "2026-06-25",
  "system": "nombre-del-sistema",
  "url": "https://url-base",
  "pts_covered": ["PT-042", "PT-043"],
  "global_score": 87,
  "classification": "QA-B",
  "happy_path_critical_fail": false,
  "cases": {
    "total": 23,
    "pass": 20,
    "fail": 2,
    "skip": 1,
    "error": 0
  },
  "scores_by_axis": {
    "functionality_hp": 100,
    "validation_ec": 80,
    "error_flows": 83,
    "regression": 100,
    "accessibility": 75,
    "performance": 100
  },
  "defects": ["QD-001", "QD-002", "QD-003"],
  "defects_critical": 0,
  "defects_high": 1,
  "defects_medium": 1,
  "defects_low": 1
}
```

## Archivo qa-score-history.json

```json
[
  {
    "cycle": "QR-001",
    "type": "FULL",
    "date": "2026-06-25",
    "global_score": 87,
    "classification": "QA-B",
    "defects_opened": 3,
    "defects_critical": 0
  },
  {
    "cycle": "QR-002-delta-PT-042",
    "type": "DELTA",
    "date": "2026-07-10",
    "global_score": 100,
    "classification": "QA-A",
    "defects_opened": 0,
    "defects_critical": 0
  }
]
```

---

# PHASE 7 — Promoción de Defectos

## Propósito

Convertir los QD-XXX aprobados por el humano en trabajo accionable dentro de FDGE o PTSA.

## Flujo de promoción

```text
QD-XXX (READY)
    ↓
Human Review de QR-XXX/REPORT.md
    ↓
Para cada QD, el humano decide:
    → PROMOVER A FDGE  : "promote QD-XXX to FDGE"
    → PROMOVER A PTSA  : "promote QD-XXX to PTSA"
    → ACUMULAR         : "defer QD-XXX" (se mantiene READY para el próximo ciclo)
    → CERRAR           : "close QD-XXX" (comportamiento aceptado como-es)
```

## Comando de promoción

```
promote QD-XXX to FDGE
```

El agente:
1. Asigna un `PT-NNN` desde `docs/implementation/REGISTRY.json` (`SUITE-R08`).
2. Crea `changes/PT-NNN-slug/` y copia `INTAKE/templates/BUG-REPORT.md` como `intake.md`.
3. Transcribe como **borrador** de los campos `[HUMANO]`: el comportamiento esperado del
   caso QA de origen, el comportamiento observado, los pasos del caso, el entorno y la
   captura del fallo. Los marca explícitamente como borrador.
4. **No firma el Intake** (`INTAKE-R06`). El humano debe confirmar que el comportamiento
   esperado del caso QA es efectivamente el comportamiento que el negocio quiere: un caso
   QA puede haberse escrito sobre un supuesto equivocado.
5. Registra el PT en `docs/implementation/DISCOVERY.md` (índice, una línea).
6. Actualiza `QA/QA-DEFECTS.md`: el `QD` pasa a `IN_PROGRESS` con el `PT-NNN` anotado.
7. Actualiza `QA/QA-LOG.md`.

> La v3 entregaba el defecto directamente a `STATE 1` escribiendo el análisis en
> `DISCOVERY.md`. En v4 entra por **PHASE 1 (Intake)** como cualquier otro trabajo: el
> origen de un PT no exime de declarar la intención.

```
promote QD-XXX to PTSA
```

El agente:
1. Asigna un `H-NNN` desde `REGISTRY.json`.
2. Crea `PTSA/Findings/H-NNN.md` con la descripción del fallo QA y su dimensión.
3. Vincula el `QD-XXX` como evidencia del hallazgo.
4. Actualiza `QA/QA-DEFECTS.md` con el `H-NNN` asignado.

## Cierre de un QD — y el cierre del loop QA ↔ FDGE

`QA-R11` · **El agente nunca cierra un `QD-XXX` por sí solo.**

Un `QD-XXX` pasa a `CLOSED` cuando se cumple una de estas dos condiciones:

**(a) Corregido y verificado.** El `PT-NNN` asociado alcanzó `DONE` o `INTEGRATED` **y** el
caso QA de origen se re-ejecutó con resultado `PASS`.

**(b) Aceptado.** El humano lo marca `REJECTED` con motivo (comportamiento aceptado tal cual).

### El procedimiento que faltaba

`FDGE-R28` · El loop entre QA y FDGE se cerraba mal en v3 porque las dos mitades estaban
enunciadas y ninguna conectada:

- FDGE dejaba todo `BUG` en `VALIDATION_PENDING` esperando a un humano (`FDGE-R26`).
- QA declaraba que un `QD` se cierra cuando el PT cierra **y** el caso QA vuelve a pasar.
- Nadie decía **quién ejecuta esa re-ejecución ni cuándo**, así que el humano quedaba a
  cargo de un procedimiento que no estaba escrito. En la práctica, los `QD` se quedaban
  abiertos y el escalado automático de severidad (`QA-R18`) los subía de nivel sin que
  nadie hubiera hecho nada mal.

El procedimiento explícito es:

```
1. El PT llega a FDGE PHASE 7 (Validation) en estado VALIDATION_PENDING.

2. Se ejecuta:  delta QA PT-XXX
   QA re-ejecuta el caso de origen del QD y los casos REG relacionados.

3. Resultado del caso de origen:

   PASS → QA lo reporta como evidencia de validación disponible.
          El HUMANO cierra el PT (FDGE PHASE 7) y el QD queda apto para CLOSED.
          La ejecución QA es evidencia; la decisión de cerrar sigue siendo humana.

   FAIL → el arreglo no resolvió el defecto.
          El QD permanece en IN_PROGRESS. El PT vuelve a FDGE PHASE 2 con la
          nueva evidencia. NO se abre un QD nuevo: es el mismo defecto.

4. Con el PT cerrado y el caso en PASS, el humano marca:  close QD-XXX
```

---

# Artefactos Persistentes

## QA-PLAN.md

**Tipo:** Sobreescribible (se reemplaza en cada ciclo)

El plan de un ciclo es específico a ese ciclo. No es histórico. El histórico lo tiene `qa-score-history.json` y `QA-LOG.md`.

## QA-DEFECTS.md

**Tipo:** Append-only

Registro permanente de todos los QD-XXX generados en todos los ciclos. Nunca se elimina una entrada. Los estados se actualizan en la misma entrada (se agrega al Historial del QD).

## QA-LOG.md

**Tipo:** Append-only

Registro inmutable de operaciones: inicio de ciclo, ACK del plan, ejecución, reporte generado, promociones.

```markdown
## 2026-06-25

### QR-001 — INICIO
Hora: 00:45
Acción: [START QA] recibido. Iniciando PHASE 1 — Reconocimiento.

### QR-001 — PLAN PROPUESTO
Hora: 01:10
Acción: QA-PLAN.md generado. 23 casos propuestos. STOP — esperando ACK.

### QR-001 — PLAN APROBADO
Hora: 01:30
Acción: ACK recibido. Plan aprobado con modificaciones: QA-010 eliminado, QA-011 modificado.
        Procediendo a PHASE 3 — Generación de Specs.

### QR-001 — SPECS APROBADOS
Hora: 01:55
Acción: ACK recibido. Ejecutando Playwright.

### QR-001 — EJECUCIÓN COMPLETADA
Hora: 02:18
Acción: 20 PASS, 2 FAIL, 1 SKIP. Generando reporte.

### QR-001 — REPORTE GENERADO
Hora: 02:25
Acción: QR-001/REPORT.md generado. Score: 87 (QA-B). QD-001, QD-002, QD-003 creados.

### QR-001 — PROMOCIONES
Hora: 10:30
Acción: QD-002 promovido a PT-048 (BUG MAJOR — login error 500). 
        QD-001 promovido a PT-049 (BUG STANDARD — email validation).
        QD-003 diferido a próximo ciclo.
```

## cases/QA-XXX.md

**Tipo:** Persistente entre ciclos. Actualizables.

Cada caso de prueba tiene su propio archivo con el histórico de ejecuciones.

```markdown
# QA-001 — Happy Path: Registro de usuario

**Creado en:** QR-001
**Fuente:** Foundation PRD §3.1 UC-01
**Tipo:** HP
**Eje:** Funcionalidad

## Definición

[... misma definición del QA-PLAN.md ...]

## Historial de Ejecuciones

| Ciclo | Fecha | Resultado | QD asociado |
|:---|:---|:---|:---|
| QR-001 | 2026-06-25 | PASS | — |
| QR-002 | 2026-07-10 | PASS | — |
| QR-003 | 2026-08-01 | FAIL | QD-007 |
```

---

# Sistema de Identificadores

## QA-XXX — Caso de Prueba

- Identificador permanente del caso.
- Monotónico, nunca reutilizable.
- No depende del ciclo en que fue creado.

## QR-XXX — Ciclo QA (QA Run)

- Identifica una ejecución completa del ciclo QA.
- Monotónico, nunca reutilizable.
- Un caso QA-XXX puede ejecutarse en múltiples QR-XXX.

## QD-XXX — QA Defect

- Identifica un defecto encontrado.
- Monotónico, nunca reutilizable.
- Un QD-XXX puede originar un PT-XXX en FDGE y/o un H-XXX en PTSA.

---

# Casos Especiales

## QA en proyectos sin Foundation completo

Si `docs/enterprise-documentation/` no existe o está incompleto:

**STOP en PHASE 1.** El agente reporta:

```
QA NO PUEDE EJECUTARSE.

Razón: La documentación Foundation no está disponible.
QA infiere los flujos desde Foundation (PRD, App Flow, UI/UX Brief).
Sin Foundation, los casos de prueba serían suposiciones sin base, no QA gobernado.

Acción requerida: Ejecutar [START FOUNDATION] y [FOUNDATION VALIDATED] antes de [START QA].
```

Excepción: si el humano provee explícitamente los flujos a probar como parte del trigger `[START QA]`, el agente puede proceder usando esa descripción como Fuente C (humano). Lo documenta en `QA-LOG.md`.

## QA Delta (re-ejecución parcial)

Para re-ejecutar solo los casos afectados por PTs recientes sin correr el ciclo completo:

```
delta QA PT-XXX
```

El agente:
1. Identifica los casos QA relacionados con PT-XXX (por eje de flujo afectado).
2. Identifica los casos REG relevantes.
3. Propone un plan reducido → ACK → ejecuta → reporte parcial.

El reporte se identifica como `QR-XXX-delta-PT-YYY` en el historial.

## Consultar estado QA

```
status QA
```

Reporta: Score actual, clasificación, QD-XXX abiertos y su estado, fecha del último ciclo (freshness).

---

# Reglas Absolutas

| # | Regla | Violación |
|:--|:---|:---|
| R01 | El agente NO ejecuta pruebas sin ACK al Plan de Pruebas. | Invalida el ciclo. |
| R02 | El agente NO ejecuta specs sin ACK a los specs generados. | Invalida el ciclo. |
| R03 | El agente NO modifica código durante ejecución QA. | Prohibido. |
| R04 | El agente NO cierra QD-XXX sin aprobación humana. | Prohibido. |
| R05 | El agente NO promueve QD-XXX a FDGE o PTSA sin aprobación humana. | Prohibido. |
| R06 | Todo caso FAIL debe tener QD-XXX. Sin QD, el FAIL no existe como hallazgo. | Invalida el reporte. |
| R07 | Todo QD debe tener captura de pantalla del paso fallido. | Sin captura = sin evidencia = QD inválido. |
| R08 | Si cualquier HP falla, el Score es QA-F aunque el resto pase. | Regla de Score Crítico. |
| R09 | QA no puede iniciarse sin `QA_BASE_URL` definida y verificable. | STOP en PHASE 1. |
| R10 | Casos REG se ejecutan siempre primero. | Orden obligatorio. |
