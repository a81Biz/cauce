# QA — Prompts Operativos

> Método: [Framework-QA.md](Framework-QA.md) · Procedimiento: [QA-Implementation.md](QA-Implementation.md)
> Reglas: [RULES.md](../RULES.md) §Parte 5 · Vocabulario: [LEXICON.md](../LEXICON.md)
>
> Suite version: **5.3.0**

---

## Antes de cerrar el ciclo                                                  [SUITE-R26]

```
node docs/methodology/tools/verify-qa.mjs
```

Comprueba captura por caso [QA-R03], todo FAIL con su QD [QA-R06], QD con captura [QA-R07],
veredictos cerrados PASS|FAIL [QA-R04], HP en fallo ⇒ QA-F [QA-R09], ningún QD cerrado sin
humano [QA-R11], QR-NNN desde REGISTRY [QA-R13], sin esperas fijas [QA-R16] y todo caso
citando su AC-nn [QA-R19]. Un ciclo que no pasa no se publica.

## Reglas en vigor durante todo el ciclo

| ID | Regla |
|:---|:---|
| `QA-R01` | Opera solo desde el navegador. No lee código, no inspecciona endpoints, no consulta la BD. |
| `QA-R02` | Ningún caso se ejecuta sin ACK al plan; ningún spec se ejecuta sin ACK a los specs. |
| `QA-R03` | Sin captura, el paso no fue ejecutado. |
| `QA-R04` | Solo `PASS` o `FAIL`. La ambigüedad es `FAIL`. |
| `QA-R05` | QA no corrige: documenta, crea el `QD-NNN`, se detiene. |
| `QA-R06` | Todo `FAIL` genera un `QD-NNN`. Sin `QD`, el fallo no existe. |
| `QA-R07` | Todo `QD-NNN` lleva captura del paso fallido, o es inválido. |
| `QA-R08` | Los casos `REG` se ejecutan siempre primero. |
| `QA-R09` | Un `HP` en `FAIL` fuerza clasificación `QA-F`, sea cual sea el porcentaje global. |
| `QA-R10` | No arranca sin `QA_BASE_URL` alcanzable, ni contra producción sin aislamiento. |
| `QA-R11` | El agente no cierra ni promueve un `QD-NNN` sin decisión humana. |
| `QA-R12` | Durante la ejecución no se modifica código, no se reinician servicios, no se altera el estado. Si la URL no responde: detención inmediata. |
| `QA-R13` | `QA-NNN`, `QR-NNN` y `QD-NNN` se asignan desde `REGISTRY.json`, nunca contando el historial. |
| `QA-R14` | Ningún caso depende del estado dejado por otro. |
| `QA-R15` | Selectores: `data-testid` → rol ARIA → label → texto → CSS documentado. Nunca clases de estilo. |
| `QA-R16` | Sin esperas fijas. Se espera una condición observable. |
| `QA-R17` | El score es `STALE` con >3 PTs integrados o >30 días. |
| `QA-R18` | Un `QD` sin acción escala de severidad cada 2 ciclos. |
| `QA-R19` | Todo caso derivado de un PT cita el `AC-nn` que verifica. |

---

# [START QA] — Inicio de Ciclo QA

He iniciado un ciclo de Quality Assurance sobre esta aplicación.

Ejecuta EXCLUSIVAMENTE la PHASE 1 del ciclo QA (Reconocimiento).
No avances a PHASE 2 sin ACK explícito.

## Definición del ciclo

```
Tipo: CICLO COMPLETO
Herramienta: Playwright
```

[Si aplica, el humano puede añadir aquí:]
- URL base: https://[url]
- PTs recientes a cubrir: PT-XXX, PT-YYY
- Flujos adicionales a probar: [descripción libre]
- Credenciales de prueba: [tabla o referencia]

---

## PHASE 1 — Reconocimiento del Sistema

Lee los siguientes documentos en este orden exacto y construye un mapa de flujos candidatos:

1. `docs/enterprise-documentation/02-PRD.md` — casos de uso, roles, reglas de negocio
2. `docs/enterprise-documentation/04-App-Flow.md` — flujos end-to-end
3. `docs/enterprise-documentation/05-UI-UX-Brief.md` — pantallas e interacciones
4. `docs/enterprise-documentation/08-API-Catalog.md` — APIs que la UI invoca
5. Directorio `QA/cases/` — catálogo histórico persistente (para identificar regresiones candidatas)
6. `QA/QA-DEFECTS.md` — defectos abiertos de ciclos anteriores
7. `docs/implementation/HANDOFF.md` — PTs recientes y estado actual

**Solo leer. No modificar nada. No generar casos aún.**

### Verificación de prerequisitos

Antes de continuar, verifica:

- [ ] Existe `docs/enterprise-documentation/02-PRD.md`
- [ ] Existe `docs/enterprise-documentation/04-App-Flow.md`
- [ ] Está definida la URL base (desde el trigger o desde variable de entorno QA_BASE_URL)
- [ ] Existen credenciales de prueba (declaradas en el trigger)

**Si cualquier prerequisito falta:**

```
QA BLOQUEADO.

Prerequisito faltante: [nombre del documento o variable]
Acción requerida: [qué debe hacer el humano]

No puedo generar casos de prueba sin [Foundation / URL / credenciales].
```

**Si todos los prerequisitos están presentes:**

Genera el mapa de flujos identificados:

```
Flujos identificados para este ciclo:

FLUJOS CRÍTICOS (Happy Path):
  - [Nombre del flujo] — Fuente: PRD §X.X UC-XX
  - [Nombre del flujo] — Fuente: App Flow §X
  ...

FLUJOS DE VALIDACIÓN (Edge Cases):
  - [Nombre] — Fuente: PRD regla R-XX
  ...

FLUJOS DE ERROR:
  - [Nombre] — Fuente: App Flow §X (ruta de error)
  ...

REGRESIONES CANDIDATAS (de ciclos anteriores):
  - QA-XXX: [descripción] — Último resultado: PASS en QR-XXX
  ...

FLUJOS NUEVOS (por PTs recientes):
  - [Nombre] — Fuente: PT-XXX ENRICHMENT.md
  ...

Casos no cubiertos en este ciclo (out of scope):
  - [Razón]
```

Registra en `QA/QA-LOG.md`:
```
## [FECHA]
### QR-XXX — INICIO
Hora: [HH:MM]
Acción: [START QA] recibido. Iniciando PHASE 1 — Reconocimiento.
```

**Nota:** El número de ciclo QR-XXX se determina leyendo `QA/qa-score-history.json`.
Si el archivo está vacío o no tiene entradas, el ciclo es QR-001.
Si tiene N entradas, el ciclo es QR-(N+1).

---

## STOP — PHASE 1

Presenta el mapa de flujos y detente.

El humano puede:
- Confirmar el mapa → proceder a PHASE 2 con ese scope.
- Agregar flujos que no detectaste.
- Eliminar flujos del scope.
- Proveerte la URL y credenciales si faltan.

**No avances a PHASE 2 sin confirmación explícita.**

---

# PHASE 2 — Propuesta de Plan de Pruebas

Ejecuta EXCLUSIVAMENTE la PHASE 2 del ciclo QA.

Basándote en el mapa de flujos aprobado en PHASE 1, genera el Plan de Pruebas completo.

## Reglas de generación del Plan

### Para cada flujo identificado, crea los casos según esta lógica:

**Flujo crítico (Happy Path):**
- 1 caso HP obligatorio
- 1–3 casos EC según reglas de validación del PRD
- 1–2 casos EF según flujos de error del App Flow

**Flujo de regresión:**
- 1 caso REG por cada caso que pasó en el ciclo anterior

**Flujo nuevo (por PT reciente):**
- Deriva casos de `changes/PT-XXX-slug/test-scenarios.md`
- Genera al menos 1 HP y los EC/EF relevantes

### Para cada caso, define:

```
### QA-XXX — [Descripción del caso]

**Fuente:** [Foundation PRD §X.X | App Flow §X | PT-XXX test-scenarios | QR-anterior REG]
**Tipo:** HP | EC | EF | REG
**Eje:** Funcionalidad | Validación | Error Flow | Regresión | Accesibilidad | Performance
**Complejidad:** SIMPLE | STANDARD
**Regresión desde:** QR-XXX (si es REG) | N/A (si es nuevo)

**Precondiciones:**
- Sistema en: [URL]
- Usuario de prueba: [rol o fixture name — nunca credenciales reales aquí]
- Estado inicial: [qué debe existir en el sistema antes de ejecutar]

**Pasos:**
1. [Acción del usuario: navegar a, hacer click en, completar campo, etc.]
2. ...
N. [Última acción]

**Resultado esperado:**
- [Condición 1 verificable en el navegador]
- [Condición 2]

**Resultado esperado en caso de fallo:**
- Si [condición]: FAIL → QD-XXX severidad [CRITICAL|HIGH|MEDIUM|LOW]

**Capturas requeridas:**
- Paso X: [qué muestra la captura]
- Paso Y: [qué muestra la captura]
- Último paso: resultado final (éxito o error)
```

### Asignación de números QA-XXX

Consulta `QA/cases/` y `QA/QA-PLAN.md` para encontrar el último número asignado.
Los nuevos casos continúan la secuencia. Los REG conservan su número original.

## Output de la PHASE 2

Sobrescribe `QA/QA-PLAN.md` con:

```markdown
# QA Plan — Ciclo QR-XXX
Fecha: YYYY-MM-DD
Sistema: [nombre]
URL Base: [QA_BASE_URL]
Credenciales de prueba: [tabla de roles — sin passwords]
Foundation utilizada: [fecha de última Foundation]
PTs cubiertos: [lista]
Ciclo anterior: QR-[N-1] (Score: XX — QA-[clasificación])

---

## Resumen de Casos

| ID | Tipo | Eje | Descripción | Estado |
|:---|:---|:---|:---|:---|
| QA-001 | HP | Funcionalidad | [descripción] | PENDING |
...

Total: N casos (X HP, Y EC, Z EF, W REG)

---

## Casos de Prueba

[cada caso con el template completo]
```

Crea también `QA/cases/QA-XXX.md` para cada caso nuevo (los REG ya existen).

---

## STOP — PHASE 2

Presenta el QA-PLAN.md generado y detente.

El humano puede:
- Aprobar el plan completo → proceder a PHASE 3.
- Modificar casos (resultado esperado, precondiciones, pasos).
- Agregar casos que no propusiste.
- Marcar casos como SKIP para este ciclo.
- Cambiar la URL base o las credenciales de prueba.
- Rechazar el plan y solicitar revisión.

**No generes specs ni ejecutes nada sin ACK explícito.**

---

# PHASE 3 — Generación de Specs Playwright

Ejecuta EXCLUSIVAMENTE la PHASE 3 del ciclo QA.

Basándote en el QA-PLAN.md aprobado, genera los archivos `.spec.ts` de Playwright.

## Proceso de generación

### Para cada caso en el plan (excepto los marcados SKIP):

Crea `qa/tests/QA-[NNN]-[slug].spec.ts` siguiendo estas reglas:

### Reglas de generación de specs

**Selectores — orden de preferencia:**
1. `data-testid` (preferido siempre)
2. Roles ARIA: `page.getByRole('button', { name: 'Registrarse' })`
3. Labels: `page.getByLabel('Email')`
4. Texto visible: `page.getByText('Registrarse')`
5. CSS selector específico (documentar por qué se usa)
6. **NUNCA:** clases de styling (`.btn-primary`, `.form-control`)

**Tiempos de espera:**
- Navegación: `waitForURL('**/ruta', { timeout: 5000 })`
- Elementos: `waitForSelector('[selector]', { timeout: 3000 })`
- **NUNCA:** `waitForTimeout(N)` fijo

**Screenshots — obligatorio en:**
- El primer paso (estado inicial)
- Inmediatamente antes de cualquier submit o acción destructiva
- El último paso (estado final)
- El paso exacto en que falla (auto-capturado por Playwright en FAIL)

**Datos de prueba:**
- Nunca en el spec directamente
- Siempre desde `qa/fixtures/test-data.ts`
- Passwords desde `process.env.QA_TEST_PASSWORD`

**Nombre de screenshots:**
```
QA/reports/QR-XXX/evidence/QA-[NNN]-step-[NN]-[descripcion].png
```

### Template de spec

```typescript
// qa/tests/QA-[NNN]-[slug].spec.ts
// Tags obligatorios según tipo del caso:
// HP  → test.describe('[TYPE] @happy-path QA-[NNN]', ...)
// EC  → test.describe('[TYPE] @edge-case QA-[NNN]', ...)
// EF  → test.describe('[TYPE] @error-flow QA-[NNN]', ...)
// REG → test.describe('[TYPE] @regression QA-[NNN]', ...)

import { test, expect } from '@playwright/test';
import { TEST_USERS, TEST_DATA } from '../fixtures/test-data';

// El directorio de reporte se pasa como variable de entorno:
// QA_REPORT_DIR=QA/reports/QR-001 npx playwright test
const REPORT_DIR = process.env.QA_REPORT_DIR || 'QA/reports/current';

test.describe('[TIPO] @[tag] QA-[NNN] — [Descripción del caso]', () => {

  test('[NNN]-[tipo]: [Descripción breve del escenario]', async ({ page }) => {

    // PASO 1 — [Descripción]
    await page.goto('/[ruta]');
    await page.screenshot({ path: `${REPORT_DIR}/evidence/QA-[NNN]-step-01-[descripcion].png` });

    // PASO N — [Descripción]
    await page.[accion]([selector], [valor si aplica]);

    // Screenshot pre-submit
    await page.screenshot({ path: `${REPORT_DIR}/evidence/QA-[NNN]-step-[N]-pre-submit.png` });

    // Submit / acción principal
    await page.click('[data-testid="[btn-selector]"]');

    // Esperar resultado
    await page.waitForURL('**/[ruta-esperada]', { timeout: 5000 });

    // Screenshot resultado
    await page.screenshot({ path: `${REPORT_DIR}/evidence/QA-[NNN]-step-[N+1]-result.png` });

    // ASSERTIONS
    await expect(page).toHaveURL(/[patron]/);
    await expect(page.locator('[data-testid="[selector]"]')).toContainText('[texto esperado]');
  });
});
```

**Regla de tags:** Cada spec debe incluir exactamente uno de estos tags en el `test.describe`:
- `@happy-path` para casos HP
- `@edge-case` para casos EC
- `@error-flow` para casos EF
- `@regression` para casos REG

Estos tags permiten el filtrado por tipo durante la ejecución en PHASE 4.

### Generación de fixtures

Si los fixtures no existen o necesitan nuevos datos:

```typescript
// qa/fixtures/test-data.ts

export const TEST_USERS = {
  newUser: {
    name: 'QA Test User',
    email: `qa-test-${Date.now()}@test.local`,
  },
  existingUser: {
    email: process.env.QA_EXISTING_USER_EMAIL || 'qa-existing@test.local',
  },
  adminUser: {
    email: process.env.QA_ADMIN_USER_EMAIL || 'qa-admin@test.local',
  },
};

export const TEST_DATA = {
  // Agrega datos específicos del dominio según el PRD
};
```

### Configuración Playwright (si no existe)

Si `playwright.config.ts` no existe en la raíz del proyecto, créalo:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'; // Requiere @playwright/test >= 1.40

export default defineConfig({
  testDir: './qa/tests',
  timeout: 30000,
  retries: 0,
  workers: 1, // Previene colisiones de datos al forzar ejecución secuencial
  fullyParallel: false,
  use: {
    baseURL: process.env.QA_BASE_URL || 'http://localhost:3000',
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    headless: true,
  },
  reporter: [
    ['list'],
    // outputFile usa la variable de entorno QA_REPORT_DIR para reportes por ciclo
    ['json', { outputFile: process.env.QA_REPORT_DIR
      ? `${process.env.QA_REPORT_DIR}/results.json`
      : 'qa/reports/current/results.json'
    }],
  ],
});
```

**Regla de ejecución:** Siempre pasar `QA_REPORT_DIR` al ejecutar para que cada ciclo tenga su propio directorio:
```bash
QA_BASE_URL=https://... QA_REPORT_DIR=QA/reports/QR-001 npx playwright test
```

## Output de la PHASE 3

Lista de archivos generados:
```
qa/tests/QA-001-[slug].spec.ts
qa/tests/QA-002-[slug].spec.ts
...
qa/fixtures/test-data.ts (creado o actualizado)
playwright.config.ts (creado si no existía)
```

**IMPORTANTE:** En todos los specs generados, reemplaza la cadena literal `QR-XXX` con el número real del ciclo actual (ej. `QR-001`, `QR-002`). Este número se determinó en PHASE 1 al leer `qa-score-history.json`.

---

## STOP — PHASE 3

Presenta la lista de specs generados y detente.

El humano puede:
- Aprobar los specs → proceder a PHASE 4 (ejecución real).
- Modificar selectores si conoce los IDs reales de la aplicación.
- Ajustar datos de prueba.
- Cambiar assertions.
- Agregar pasos adicionales a casos específicos.

**No ejecutes Playwright sin ACK explícito. El navegador no se abre hasta este punto.**

---

# PHASE 4 — Ejecución

Ejecuta EXCLUSIVAMENTE la PHASE 4 del ciclo QA.

Tienes ACK para ejecutar los specs aprobados.

## Proceso de ejecución

### Paso 1: Verificar que el sistema está disponible

```bash
# En Linux/macOS:
curl -s -o /dev/null -w "%{http_code}" $QA_BASE_URL

# En Windows (PowerShell):
(Invoke-WebRequest -Uri $env:QA_BASE_URL -UseBasicParsing).StatusCode
```

Si el sistema no responde (código != 200/301/302):
```
QA BLOQUEADO — Sistema no disponible.

URL: [QA_BASE_URL]
Respuesta: [código HTTP o error]

No ejecuto pruebas sobre un sistema caído.
Acción requerida: verificar que el sistema está levantado y volver a ejecutar.
```

### Paso 2: Instalar Playwright si es necesario

```bash
# Solo si no está instalado
npx playwright install --with-deps chromium
```

### Paso 3: Ejecutar en orden obligatorio

```bash
# El orden de ejecución es obligatorio: REG → HP → EC → EF
# Los tags @regression, @happy-path, @edge-case, @error-flow están en los test.describe de cada spec.

# 1. PRIMERO: Regresiones
QA_BASE_URL=[url] QA_REPORT_DIR=QA/reports/QR-[N] npx playwright test --grep @regression

# 2. SEGUNDO: Happy Paths
QA_BASE_URL=[url] QA_REPORT_DIR=QA/reports/QR-[N] npx playwright test --grep @happy-path

# 3. TERCERO: Edge Cases
QA_BASE_URL=[url] QA_REPORT_DIR=QA/reports/QR-[N] npx playwright test --grep @edge-case

# 4. CUARTO: Error Flows
QA_BASE_URL=[url] QA_REPORT_DIR=QA/reports/QR-[N] npx playwright test --grep @error-flow

# O ejecutar todos juntos (respeta el orden de los archivos de config):
QA_BASE_URL=[url] QA_REPORT_DIR=QA/reports/QR-[N] npx playwright test --reporter=json,list
```

**Donde QR-[N]** es el número del ciclo actual (determinado en PHASE 1).

### Regla de regresión crítica

Si durante la ejecución de regresiones **cualquier caso REG que pasó en el ciclo anterior falla ahora**:

```
⚠️ REGRESIÓN DETECTADA — QA-[NNN]

Este caso pasó en QR-[anterior] y falla en QR-[actual].
Esto indica que un cambio reciente rompió funcionalidad verificada.

PTs recientes: [lista]
Posible causa: cambios en PT-XXX que afectaron [flujo]

Continuando ejecución para completar el mapeo de fallos.
Reportaré al terminar con prioridad CRÍTICA.
```

### Regla de No-Intervención

Durante ejecución, el agente **nunca**:
- Modifica código de la aplicación.
- Reinicia servidores o contenedores.
- Altera datos de la base de datos.
- Cambia variables de entorno del sistema.
- Modifica los specs en vuelo.

Si algo impide la ejecución (servicio caído, error de autenticación de fixtures): **STOP** y reportar.

## STOP — PHASE 4 (preparación)

Esta fase no tiene STOP previo a la ejecución — el ACK fue dado en PHASE 3.
Procede automáticamente a PHASE 5 al completar la ejecución.

---

# PHASE 5 — Análisis y Defectos

Ejecuta EXCLUSIVAMENTE la PHASE 5 del ciclo QA.

## Proceso de análisis

### Para cada caso PASS:
Revisa `QA/QA-DEFECTS.md`. Si el caso que acaba de pasar (PASS) tenía un `QD-XXX` asociado en estado `IN_PROGRESS` o `READY`, actualiza el historial de ese defecto en `QA/QA-DEFECTS.md` añadiendo:
`[YYYY-MM-DD]: CLOSED-FIXED — verificado exitosamente en QR-[XXX]`

### Para cada caso FAIL:

Analiza el output de Playwright y la captura de pantalla del fallo.

Para cada FAIL nuevo, genera un QD-XXX con este template:

```markdown
## QD-[NNN]

Ciclo QA: QR-[XXX]
Fecha: [YYYY-MM-DD]
Caso de origen: QA-[NNN]
Tipo del caso: [HP|EC|EF|REG]
Eje: [Funcionalidad|Validación|Error Flow|Regresión|Accesibilidad|Performance]
Severidad: [CRITICAL|HIGH|MEDIUM|LOW]
Estado: READY

### Descripción del fallo

**Esperado:** [resultado exacto que se esperaba]
**Observado:** [resultado exacto que ocurrió]
**Paso fallido:** [número de paso y descripción]
**Error técnico:** [mensaje de Playwright si existe — TimeoutError, AssertionError, etc.]

### Evidencia

Screenshot del fallo: QA/reports/QR-[XXX]/evidence/QA-[NNN]-step-[NN]-fail.png
[Incluir cualquier otra evidencia: logs de consola capturados, red tab si aplica]

### Contexto

Flujo: [nombre del flujo que falla]
Impacto: [descripción de qué no puede hacer el usuario]
¿Bloquea flujo completo?: [SÍ / NO]

### Promoción sugerida

→ [PT-XXX BUG en FDGE | H-XXX en PTSA | Ninguna — decisión humana]
Razón: [por qué sugiero esta promoción]
Severidad sugerida en FDGE/PTSA: [TRIVIAL|STANDARD|MAJOR]

### Historial

[YYYY-MM-DD]: READY — detectado en QR-[XXX]
```

### Asignación de severidad

```
¿El caso fallido es HP (Happy Path)?
    SÍ → CRITICAL automático
    NO ↓

¿El fallo produce pérdida de datos o comportamiento peligroso?
    SÍ → HIGH
    NO ↓

¿El fallo afecta el flujo de error o validación?
    SÍ → MEDIUM
    NO ↓

¿El fallo es de accesibilidad o performance percibida?
    SÍ → LOW
```

### Cálculo del Health Score QA

```
Global Score = (PASS / (PASS + FAIL)) × 100

Score por eje:
  HP Score    = (PASS_HP / TOTAL_HP) × 100
  EC Score    = (PASS_EC / TOTAL_EC) × 100
  EF Score    = (PASS_EF / TOTAL_EF) × 100
  REG Score   = (PASS_REG / TOTAL_REG) × 100
  ACC Score   = (PASS_ACC / TOTAL_ACC) × 100
  PERF Score  = (PASS_PERF / TOTAL_PERF) × 100

Clasificación:
  95–100: QA-A
  80–94:  QA-B
  60–79:  QA-C
  < 60:   QA-F

REGLA CRÍTICA:
  SI (cualquier FAIL en HP): Clasificación = QA-F | Motivo = "Happy Path critical failure"
```

## Appends a QA/QA-DEFECTS.md

Para cada QD-XXX, append al archivo.

Procede automáticamente a PHASE 6 sin STOP.

---

# PHASE 6 — Reporte

Ejecuta EXCLUSIVAMENTE la PHASE 6 del ciclo QA.

## Genera el reporte completo

Crea `QA/reports/QR-[N]/REPORT.md` con esta estructura (sustituye `QR-[N]` con el número real del ciclo):

```markdown
# QA Report — QR-[XXX]

**Fecha de ejecución:** [YYYY-MM-DD HH:MM]
**Sistema:** [nombre del sistema]
**URL probada:** [QA_BASE_URL]
**Foundation utilizada:** [fecha]
**PTs cubiertos:** [lista]
**Ciclo anterior:** QR-[N-1] | Score anterior: [XX — QA-Y]

---

## Resultado Global

| Clasificación | Score Global | Total | PASS | FAIL | SKIP | ERROR |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **QA-[A/B/C/F]** | **[XX]/100** | [N] | [N] | [N] | [N] | [N] |

[Si QA-F por HP crítico:]
> ⚠️ SCORE CRÍTICO: uno o más Happy Paths fallaron. Score forzado a QA-F independientemente del porcentaje.

---

## Score por Eje

| Eje | Score | PASS | FAIL | Total |
|:---|:---:|:---:|:---:|:---:|
| Funcionalidad (HP) | [XX]% | [N] | [N] | [N] |
| Validación (EC) | [XX]% | [N] | [N] | [N] |
| Error Flows (EF) | [XX]% | [N] | [N] | [N] |
| Regresión (REG) | [XX]% | [N] | [N] | [N] |
| Accesibilidad | [XX]% | [N] | [N] | [N] |
| Performance | [XX]% | [N] | [N] | [N] |

---

## Defectos Encontrados

| QD | Caso | Tipo | Eje | Severidad | Descripción |
|:---|:---|:---:|:---|:---|:---|
| QD-XXX | QA-XXX | FAIL | [Eje] | [CRITICAL/HIGH/MEDIUM/LOW] | [Descripción breve] |

---

## Detalle de Casos FAIL

[Para cada FAIL, sección completa con descripción, captura embebida y sugerencia de promoción]

### QA-[NNN] — [Descripción]

**Resultado:** FAIL
**Eje:** [eje]
**Severidad:** [CRITICAL|HIGH|MEDIUM|LOW]
**Paso fallido:** [N] — [descripción del paso]

**Esperado:** [qué debía pasar]
**Observado:** [qué pasó]

**Screenshot:** [QA-NNN-step-NN-fail.png](evidence/QA-NNN-step-NN-fail.png)

**Defecto creado:** QD-[NNN]
**Promoción sugerida:** → PT-XXX BUG FDGE | → H-XXX PTSA | → Ninguna

---

## Casos PASS

| QA | Descripción | Tipo |
|:---|:---|:---:|
[tabla completa]

---

## Regresiones verificadas

| QA | Ciclo origen | Resultado previo | Resultado actual |
|:---|:---|:---:|:---:|
[tabla — solo casos REG]

---

## Defectos de ciclos anteriores: estado

| QD | Ciclo origen | Severidad | Estado actual | Verificado en este ciclo |
|:---|:---|:---|:---|:---:|
[tabla de QD abiertos de ciclos anteriores]

---

## Capturas de Evidencia

Total capturas generadas: [N]
Directorio: [QA/reports/QR-XXX/evidence/](evidence/)

---

## Recomendaciones de Promoción

[Para cada QD con severidad CRITICAL o HIGH:]
1. **QD-[NNN] → FDGE** (PT-XXX BUG [MAJOR|STANDARD]): [razón en una línea]

[Para QD MEDIUM:]
2. **QD-[NNN] → FDGE** (PT-XXX BUG STANDARD): [razón]

[Para QD LOW:]
3. **QD-[NNN] → acumular**: [razón — puede agruparse con otros de baja prioridad]

---

## Certificación QA

**Estado:** [QA-A | QA-B | QA-C | QA-F]
**Score:** [XX]/100
**Defectos críticos:** [N]
**Defectos high:** [N]

[Si QA-A:] Sistema apto para producción. Sin defectos que requieran atención inmediata.
[Si QA-B:] Sistema apto para producción con observaciones. Defectos menores pendientes.
[Si QA-C:] Sistema apto con reservas. Requiere plan de remediación antes del próximo ciclo mayor.
[Si QA-F:] Sistema NO certificado. [Motivo específico]. No debe ir a producción hasta resolver defectos críticos.
```

## Genera summary.json

Crea `QA/reports/QR-[N]/summary.json` con la estructura definida en QA-Implementation.md.

## Actualiza qa-score-history.json

Append de la entrada del ciclo actual a `QA/qa-score-history.json`, incluyendo `"type": "FULL"`.

## Actualiza QA-LOG.md

```
### QR-[N] — REPORTE GENERADO
Hora: [HH:MM]
Acción: QR-[N]/REPORT.md generado. Score: [XX] ([QA-clasificación]).
        Defectos: [N] creados (CRITICAL: [N], HIGH: [N], MEDIUM: [N], LOW: [N]).
```

---

## STOP — PHASE 6

El reporte está completo. Presenta el resumen ejecutivo y detente.

Resumen que debes presentar al humano:

```
## QA Report QR-[N] — Resumen Ejecutivo

Sistema: [nombre] | URL: [url]
Fecha: [YYYY-MM-DD]

Score: [XX]/100 → Clasificación: QA-[A|B|C|F]

Casos:     [N] total | [N] PASS | [N] FAIL | [N] SKIP
Defectos:  [N] nuevos (CRITICAL: [N] | HIGH: [N] | MEDIUM: [N] | LOW: [N])

Defectos que requieren acción inmediata:
[lista de CRITICAL y HIGH con descripción breve]

Regresiones detectadas: [SÍ — lista | NINGUNA]

Recomendaciones de promoción:
[lista resumida]

Reporte completo: QA/reports/QR-[N]/REPORT.md
```

El humano puede ahora:
- Revisar el reporte completo.
- Aprobar promociones: "promote QD-XXX to FDGE" o "promote QD-XXX to PTSA".
- Diferir defectos: "defer QD-XXX".
- Cerrar defectos como aceptados: "close QD-XXX as accepted".

**No promueves nada sin instrucción explícita del humano.**

# PHASE 7 — Promoción de Defectos

## promote QD-XXX to FDGE

El defecto entra por FDGE PHASE 1 (Intake), no por el análisis. Transcribe el caso QA como
BORRADOR de los campos [HUMANO] y **NO firmes el Intake**: un caso QA puede haberse escrito
sobre un supuesto equivocado, y el comportamiento esperado sigue siendo del humano.
                                                                             [INTAKE-R06]

Ejecuta EXCLUSIVAMENTE la promoción de un QD a FDGE.

### Proceso

1. Lee `QA/QA-DEFECTS.md` — entrada del QD-[XXX].
2. Lee `QA/reports/QR-[ciclo-del-QD]/REPORT.md` — detalle del fallo.
3. Append a `docs/implementation/DISCOVERY.md`:

```markdown
## PT-[SIGUIENTE] — QD-[NNN]: [Título del defecto]

Fecha: [YYYY-MM-DD]
Tipo: BUG
Complejidad: [TRIVIAL|STANDARD|MAJOR] (derivada de severidad QD: CRITICAL→MAJOR, HIGH→STANDARD, MEDIUM→STANDARD, LOW→TRIVIAL)
Origen: QA QD-[NNN] — QR-[ciclo]

### Expansión

Qué: [descripción del fallo tal como fue observado en QA]
Dónde: [flujo: página, formulario, acción de usuario]
Cuándo: [condiciones de reproducción — del caso QA]
Cómo: [síntoma observable — de la captura de pantalla]
Por qué (hipótesis): [si el agente puede inferir — si no, "Desconocido. FDGE PHASE 1-B debe investigar."]

### Comportamiento esperado

[del resultado esperado del caso QA]

### Comportamiento actual

[del resultado observado]

### Impacto

Usuarios afectados: [usuarios con acceso al flujo fallido]
Impacto de negocio: [flujo bloqueado/degradado]

### Evidencia QA

Screenshot: QA/reports/QR-[ciclo]/evidence/QA-[NNN]-step-[NN]-fail.png
Reporte QA: QA/reports/QR-[ciclo]/REPORT.md

### Estado

DISCOVERY_PENDING — Esperando FDGE PHASE 1-B
```

4. Actualiza `QA/QA-DEFECTS.md` — cambia estado del QD:

```markdown
### Historial
[fecha-original]: READY — detectado en QR-[XXX]
[fecha-hoy]: IN_PROGRESS — promovido a PT-[YYY] en FDGE
```

5. Actualiza `QA/QA-LOG.md`:

```
### QD-[NNN] — PROMOCIÓN A FDGE
Hora: [HH:MM]
Acción: QD-[NNN] promovido a PT-[YYY] (BUG [MAJOR|STANDARD|TRIVIAL]).
        Entry añadida a DISCOVERY.md. Equipo FDGE debe iniciar PHASE 2-B.
```

Confirma al humano:

```
QD-[NNN] promovido exitosamente.

PT-[YYY] creado en DISCOVERY.md como BUG [MAJOR|STANDARD|TRIVIAL].
Para iniciar el trabajo: pegar PHASE 2-B en una sesión FDGE referenciando PT-[YYY].

QD-[NNN] cambiado a estado: IN_PROGRESS
```

---

## promote QD-XXX to PTSA

Ejecuta EXCLUSIVAMENTE la promoción de un QD a PTSA.

### Proceso

1. Lee `QA/QA-DEFECTS.md` — entrada del QD-[XXX].
2. Determina el siguiente número H-XXX disponible en `PTSA/Findings/`.
3. Crea `PTSA/Findings/H-[NNN].md`:

```markdown
# H-[NNN] — [Título del hallazgo]

**Origen:** QA QD-[NNN] — QR-[ciclo]
**Fecha de detección:** [fecha del QD]
**Dimensión:** [D1 Dominio | D2 Técnica | D3 Proceso | D4 Gobierno | D5 Operacional]
**Severidad:** [CRITICA|ALTA|MEDIA|BAJA] (traducir: CRITICAL→CRITICA, HIGH→ALTA, MEDIUM→MEDIA, LOW→BAJA)
**Estado:** ABIERTA

## Descripción

[descripción del fallo QA traducida al lenguaje de PTSA — cómo afecta el producto o la experiencia]

## Evidencia

Tipo: Captura de pantalla de navegador (QA Playwright)
Archivo: QA/reports/QR-[ciclo]/evidence/QA-[NNN]-step-[NN]-fail.png
Caso QA: QA-[NNN]
Reporte QA: QA/reports/QR-[ciclo]/REPORT.md

## Recomendación

[qué debe hacerse para resolver este hallazgo]

## Trazabilidad

QD origen: QD-[NNN]
QA Ciclo: QR-[ciclo]
```

4. Actualiza `PTSA/RESUMEN.md` agregando el nuevo H-[NNN] a la lista de Hallazgos Activos para evitar desincronización.
5. Actualiza `QA/QA-DEFECTS.md` — cambia estado del QD con el H-XXX asignado.
6. Actualiza `QA/QA-LOG.md`.

---

## defer QD-XXX

Marca el QD como diferido al próximo ciclo QA.

```
QD-[NNN] diferido.

Motivo registrado: [motivo dado por el humano o "acumulado para próximo ciclo"]
Estado en QA-DEFECTS.md: READY (sin cambios)

El caso QA-[NNN] se marcará automáticamente como candidato REG en el próximo ciclo.
```

---

## close QD-XXX as accepted

El humano acepta el comportamiento como-es. El defecto se cierra sin remediación.

```
QD-[NNN] cerrado como comportamiento aceptado.

Registrando en QA-DEFECTS.md:
Estado: CLOSED
Motivo: ACCEPTED — comportamiento declarado aceptable por [humano] el [fecha]

El caso QA-[NNN] se actualizará para cambiar el resultado esperado en el próximo ciclo.
```

---

# delta QA PT-XXX — Delta QA

Para re-ejecutar solo los casos afectados por un PT reciente sin correr el ciclo completo.

## Proceso

1. Lee `docs/implementation/HANDOFF.md` para entender qué cambió en PT-[XXX].
2. Lee `changes/PT-[XXX]-slug/test-scenarios.md` (si existe) para identificar los flujos afectados.
3. Identifica en `QA/cases/` los casos relacionados con los flujos afectados (por eje y nombre de flujo).
4. Identifica los casos REG de esos flujos (casos que ya pasaron en un ciclo anterior).
5. Propone un plan reducido con mínimo: los HP del flujo afectado + los REG asociados.
6. STOP — ACK del plan reducido.
7. Tras ACK: genera los specs necesarios (reutiliza o actualiza los existentes).
8. STOP — ACK de los specs.
9. Ejecuta: `QA_BASE_URL=[url] QA_REPORT_DIR=QA/reports/QR-[N]-delta-PT-[XXX] npx playwright test`.
10. Analiza resultados, crea QD-XXX si aplica, genera reporte identificado como `QR-[N]-delta-PT-[XXX]`.
11. Append a `qa-score-history.json` con el ciclo delta, incluyendo `"type": "DELTA"`.

**Nota:** Un ciclo delta no reemplaza un ciclo completo. Registra en `QA-LOG.md` como:
```
### QR-[N]-delta-PT-[XXX] — DELTA QA
Hora: [HH:MM]
Acción: Delta QA para PT-[XXX]. [N] casos ejecutados. Score parcial: [XX]%.
```

---

# status QA — Consultar Estado

Reporta el estado actual de QA sin ejecutar nada.

Lee:
- `QA/qa-score-history.json` — último score y clasificación
- `QA/QA-DEFECTS.md` — QD abiertos y en remediación
- `QA/QA-LOG.md` — última operación
- `docs/implementation/HISTORY.log` — PTs completados desde el último ciclo QA

Si `QA/qa-score-history.json` no existe o está vacío, reporta:
```
Estado QA: SIN CICLOS PREVIOS
Ningún ciclo QA ha sido ejecutado en este proyecto.
Usar [START QA] para iniciar el primer ciclo.
```

Si hay ciclos previos, reporta:

```
## Estado QA — [YYYY-MM-DD HH:MM]

Último ciclo: QR-[N] ([fecha])
Score: [XX]/100 → QA-[A|B|C|F]
Freshness: [N días desde el último ciclo]
Alerta freshness: [FRESCO | REVISAR si han pasado >30 días o >3 PTs sin ciclo QA]

Defectos abiertos: [N]
  CRITICAL: [N] | HIGH: [N] | MEDIUM: [N] | LOW: [N]

Defectos en remediación (en FDGE): [N]
  [lista de QD con su PT-XXX asociado]

Defectos cerrados (ciclo actual): [N]

PTs completados desde el último ciclo QA: [lista de PT-XXX de HISTORY.log]
Recomendación: [CICLO COMPLETO recomendado si hay PTs sin cubrir | DELTA si los cambios son menores]
```
