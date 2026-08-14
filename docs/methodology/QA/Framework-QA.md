# Framework de Quality Assurance Gobernado por Evidencia (FQAGE)

> Responde: ¿Cómo se valida, desde la perspectiva del usuario real, que lo que se construyó
> funciona end-to-end tal como fue especificado?
>
> **Naturaleza de este documento: explicativo** (`LEX-R22`). Las reglas viven en
> [RULES.md](../RULES.md) §Parte 5 (`QA-R01`..`QA-R19`) y aquí se citan por ID.
>
> Vocabulario: [LEXICON.md](../LEXICON.md) · Procedimiento: [QA-Implementation.md](QA-Implementation.md)
> Prompts: [QA-Prompts.md](QA-Prompts.md)
>
> **Nombre canónico:** el componente se llama **FQAGE** en prosa normativa y **QA** en
> triggers, rutas y nombres de archivo (`LEX-R03`). No hay una tercera grafía.
>
> Suite version: **7.4.0**

---

## Filosofía

El desarrollo de software asistido por IA presenta tres capas de validación independientes:

> **Capa 1 — ¿El código hace lo que dice?** → Tests unitarios (FDGE PHASE 5)
> **Capa 2 — ¿Lo que produce el sistema es válido para el dominio?** → PTSA
> **Capa 3 — ¿El usuario puede usar el sistema como fue diseñado?** → FQAGE

FQAGE ocupa exclusivamente la tercera capa. No remplaza ni solapa las anteriores.

Un sistema puede pasar el 100% de sus tests unitarios, tener un Health Score PTSA de 95 y aun así:

- Tener un flujo de registro que falla silenciosamente en el paso 3.
- Mostrar un estado de error que el usuario no puede recuperar.
- Tener un formulario que acepta datos inválidos sin advertencia.
- Romper la navegación cuando el usuario acciona un camino no-happy-path.
- Cargar en 8 segundos una página crítica cuando el umbral percibido aceptable es 3.

Estos fallos son **invisibles para los tests unitarios** y **invisibles para PTSA** porque ninguno de los dos opera desde el punto de vista del usuario final interactuando con el sistema a través de un navegador real.

FQAGE opera desde ese punto de vista. Y solo desde ese punto de vista.

## Motor Operativo — por qué QA es prompt-driven y PTSA no

QA es **estrictamente prompt-driven**: el agente no avanza de fase sin instrucción explícita.
El humano copia los prompts de [QA-Prompts.md](QA-Prompts.md) fase por fase.

PTSA hace justo lo contrario: `PTSA-R18` le ordena proceder de forma autónoma y ejecutar él
mismo los diagnósticos. En la v3 estas dos filosofías opuestas convivían en la misma suite
**sin que ningún documento explicara la diferencia**, lo que las hacía parecer arbitrarias.

No lo son. El criterio es el mismo que gobierna las compuertas de FDGE
([EXECUTION-MODES.md](../EXECUTION-MODES.md) `EXEC-P1`): **la autonomía es proporcional a la
reversibilidad de la acción.**

| | PTSA | QA |
|:---|:---|:---|
| Qué hace el agente | **Observa**: lee logs, consulta la BD, inspecciona salidas | **Actúa**: navega, rellena formularios, envía, borra, paga |
| Efecto sobre el sistema | Ninguno | Escribe estado real en un sistema desplegado |
| Coste de una acción equivocada | Un hallazgo mal fundado, corregible | Datos corruptos, correos enviados, cobros reales |

Un auditor que solo lee puede ser autónomo sin riesgo. Un agente que ejecuta acciones de
usuario contra un sistema real no puede, porque cada paso es una escritura.

De ahí que `QA-R02` sea innegociable en los tres modos de ejecución: **un caso de prueba no
autorizado es un caso de prueba prohibido**. Y de ahí `QA-R10`: QA no se ejecuta contra
producción sin aislamiento declarado.

---

## Principio Central

### Ninguna pantalla, flujo o interacción puede declararse funcional sin haber sido ejecutada en un navegador real, por un agente, reproduciendo el comportamiento de un usuario.

Y ningún caso de prueba puede declararse completo sin captura de pantalla verificable como evidencia.

---

## Principios Fundamentales

### 1. User-First Execution

El agente QA no lee el código. No inspecciona endpoints. No consulta la base de datos.

Opera exclusivamente desde el navegador, en la URL de la aplicación desplegada, exactamente como lo haría un usuario real.

Si algo es imposible de verificar desde el navegador, no forma parte del alcance de QA.

---

### 2. Proposal Before Execution

Los casos de prueba no se ejecutan antes de que el humano los haya revisado y autorizado.

El agente propone. El humano decide qué ejecutar. Solo entonces el agente abre el navegador.

Este gate es innegociable. Un caso de prueba no autorizado es un caso de prueba prohibido.

---

### 3. Evidence Is Screenshot

En QA, la evidencia primaria es la captura de pantalla.

No el log. No el código. No la afirmación del agente.

Toda interacción relevante produce una captura. Toda captura se nombra con el identificador del caso y el paso. Toda captura vive en la carpeta de evidencia del ciclo QA.

Sin captura, el paso no fue ejecutado.

---

### 4. Explicit Pass/Fail

Cada caso de prueba termina en exactamente uno de dos estados: **PASS** o **FAIL**.

No existe "parcialmente correcto". No existe "probablemente funciona". No existe "el comportamiento es aceptable aunque no exactamente el especificado".

Si el comportamiento observado coincide con el esperado: **PASS**.
Si diverge en cualquier dimensión: **FAIL**.

La ambigüedad es un **FAIL** hasta que se demuestre lo contrario.

---

### 5. Defect Isolation

Cuando un caso falla, el agente no intenta corregir el problema. No es su rol.

El agente:
1. Documenta el fallo con evidencia.
2. Crea un **QA-Defect (QD-XXX)**.
3. Se detiene y reporta.

El QD-XXX puede ser promovido posteriormente a FDGE (como PT-XXX de tipo BUG) o a PTSA según su naturaleza. Esa decisión la toma el humano.

---

### 6. Session Independence

Ninguna sesión de QA depende de la memoria del agente anterior.

El Plan de Pruebas (`QA/QA-PLAN.md`) es la fuente de verdad. El Reporte (`QA/reports/QR-XXX/`) es la evidencia de cada ciclo. Cualquier sesión futura puede retomar el trabajo leyendo esos dos documentos.

---

### 7. Scope Declared Upfront

Antes de ejecutar cualquier prueba, el alcance está declarado explícitamente en el Plan de Pruebas.

Qué flujos se prueban. Qué URL. Qué credenciales de prueba. Qué datos de entrada. Qué estado inicial se asume.

Un test sin scope declarado no es un test: es una exploración. Las exploraciones no producen evidencia certificable.

---

### 8. Regression by Default

Todo ciclo QA ejecuta los casos marcados como regresión antes de ejecutar casos nuevos.

Una funcionalidad que pasó en el ciclo anterior y falla en el actual es un **regresión crítica**. Se reporta con prioridad máxima independientemente de qué causó el fallo.

---

## Los Cuatro Tipos de Casos QA

### Happy Path (HP)

El flujo principal tal como fue diseñado, con datos válidos, usuario autorizado, sistema en estado correcto.

Es el escenario más optimista. Si falla, todo lo demás es irrelevante.

**Siempre obligatorio.** No puede omitirse ningún Happy Path definido en el PRD.

---

### Edge Case (EC)

Variaciones en los límites del sistema: campos vacíos, valores extremos, cadenas largas, caracteres especiales, combinaciones inusuales de datos válidos.

El sistema no debe romperse. Debe manejar el edge case con comportamiento definido y comunicación clara al usuario.

---

### Error Flow (EF)

Flujos donde el sistema enfrenta condiciones de error: credenciales incorrectas, recursos inexistentes, permisos insuficientes, conexiones fallidas, timeouts.

El sistema debe responder con mensajes de error claros, recuperables y sin exponer información sensible.

---

### Regression (REG)

Casos que ya pasaron en un ciclo anterior y deben seguir pasando.

Son la garantía de que los cambios del último ciclo FDGE no rompieron funcionalidad previamente verificada.

Su fallo tiene prioridad máxima: indica una regresión activa.

---

## Los Seis Ejes de Evaluación

Todo caso QA pertenece a uno o más de los siguientes ejes. El eje determina qué se evalúa, no cómo se ejecuta.

### Eje 1 — Funcionalidad

¿La acción del usuario produce el resultado especificado?

Criterio: el resultado observable en el navegador coincide exactamente con el Acceptance Criteria del Enriquecimiento FDGE o del PRD.

---

### Eje 2 — Validación de Formularios

¿Los formularios aceptan datos válidos y rechazan datos inválidos con mensajes claros?

Criterio: campos requeridos vacíos producen error antes de enviar. Formatos inválidos producen error con descripción. Datos válidos avanzan sin fricción.

---

### Eje 3 — Flujos de Error

¿El sistema falla de forma controlada y recuperable?

Criterio: el usuario siempre sabe qué salió mal y qué puede hacer a continuación. Nunca queda en un estado sin salida visible.

---

### Eje 4 — Regresión

¿Lo que funcionaba sigue funcionando?

Criterio: casos marcados REG del ciclo anterior producen los mismos resultados en el ciclo actual.

---

### Eje 5 — Accesibilidad Básica (WCAG 2.1 AA Nivel Funcional)

¿Los elementos interactivos son navegables y tienen etiquetas descriptivas?

Criterio: elementos de formulario tienen labels. Imágenes tienen alt-text. Contraste suficiente para lectura. Navegación por teclado funcional en flujos críticos.

*Nota: este eje no requiere auditoría WCAG completa. Solo los ítems verificables visualmente en el navegador.*

---

### Eje 6 — Performance Percibida

¿El sistema responde en tiempos aceptables para el usuario?

Criterio: navegación entre páginas < 3 segundos. Carga inicial < 5 segundos. Acciones de usuario (submit, search) dan feedback visual en < 1 segundo.

*Nota: se mide con el cronómetro del agente Playwright, no con herramientas de profiling. Es performance percibida, no performance técnica.*

---

## El Health Score QA

El componente QA produce su propio Health Score independiente del de PTSA.

```
QA Health Score = (Casos PASS / Total casos ejecutados) × 100
```

Se calcula por eje y de forma global. Se almacena en `QA/qa-score-history.json`.

### Clasificación

| Score | Clasificación | Significado |
|:---|:---|:---|
| 95–100 | **QA-A** | Excelente. Sistema listo para producción desde perspectiva QA. |
| 80–94 | **QA-B** | Bueno. Defectos menores que no bloquean flujos críticos. |
| 60–79 | **QA-C** | Aceptable con reservas. Defectos en flujos no críticos. Requiere plan de remediación. |
| < 60 | **QA-F** | No certificado. Defectos en flujos críticos. No debe ir a producción. |

### Regla de Score Crítico

Si **cualquier caso Happy Path falla**, el Score es automáticamente **QA-F**, independientemente del porcentaje global.

Un sistema donde el flujo principal no funciona no puede certificarse, aunque el 90% de los casos restantes pasen.

### Freshness del QA Health Score

`QA-R17` · El QA Health Score se considera **STALE** cuando se cumple cualquiera de estas
condiciones:
- Se integraron más de **3 PTs** desde el último ciclo QA completo.
- Han pasado más de **30 días** desde el último ciclo QA completo.

Un score `STALE` se reporta en `status QA` con alerta.

**Qué hace FPGE con esa señal** (`FPGE-R08`): aplica un factor `Confidence = 0.7` a todo
candidato de roadmap cuya **única** evidencia sea QA, y lo declara en el racional del ítem.

> La v3 afirmaba que *«FPGE considera el score QA-STALE como baja confianza al priorizar»* y
> no definía ningún factor que consumiera esa señal: el algoritmo de priorización solo
> miraba la freshness de PTSA. Era una promesa sin implementación, y en la práctica un
> defecto QA de hace tres meses pesaba lo mismo que uno de ayer.

`SUITE-R11` · Ningún score es válido sin cobertura y freshness declaradas **junto al número**.

---

## QA-Defect (QD-XXX)

Cuando un caso falla, se crea un QD-XXX. Es el artefacto de trazabilidad del fallo QA.

### Aging de Defectos (escalamiento automático)

`QA-R18` · Un QD que permanece en estado `READY` sin ser promovido ni cerrado escala de
severidad automáticamente:

| Tiempo sin acción | Escalamiento |
|:---|:---|
| 2 ciclos QA completos sin acción | Sube un nivel de severidad (LOW→MEDIUM, MEDIUM→HIGH, HIGH→CRITICAL) |
| 3 ciclos QA completos sin acción | Se reporta en `status QA` como deuda crítica acumulada |

**El agente anota el escalamiento en el Historial del QD y en QA-LOG.md.**
**El escalamiento no puede ser revertido excepto por decisión humana explícita.**

### Anatomía del QD-XXX

```
QD-001

Caso de Origen:  QA-042 (Happy Path — Registro de usuario)
ID asignado:     desde docs/implementation/REGISTRY.json   [QA-R13 · SUITE-R08]
Ciclo QA:        QR-003
Fecha:           2026-06-25
Eje:             Funcionalidad
Severidad:       CRITICAL | HIGH | MEDIUM | LOW
Estado:          READY | IN_PROGRESS | DONE | CLOSED | REJECTED   [LEXICON §5.1]
Verifica:        AC-01 de PT-042    ← QA-R19: todo caso derivado de un PT cita su AC

Descripción del fallo:
  Qué se esperaba: ...
  Qué ocurrió: ...
  Paso en que falló: ...

Evidencia:
  Screenshot: QA/reports/QR-003/evidence/QA-042-step-03-fail.png

Promoción sugerida:
  → PT-XXX (BUG en FDGE)  |  H-XXX (Hallazgo en PTSA)  |  Ninguna (decisión humana)
```

### Severidad del QD-XXX

| Severidad | Definición |
|:---|:---|
| **CRITICAL** | Falla un Happy Path o bloquea un flujo completo. El Score baja automáticamente a QA-F. |
| **HIGH** | Falla un Edge Case con pérdida de datos o comportamiento peligroso. |
| **MEDIUM** | Falla un flujo de error (mensaje incorrecto, estado irrecuperable parcial). |
| **LOW** | Falla de accesibilidad básica o performance percibida fuera de umbral. |

---

## Integración en el Ciclo de la Suite

```
Foundation Protocol
    ↓
FDGE (ciclo de desarrollo)
    ↓
[START QA]  ←── Trigger explícito, a demanda
    ↓
QA lee Foundation (PRD, App Flow, UI/UX Brief)
    ↓
QA propone Plan de Pruebas → [ACK HUMANO]
    ↓
QA ejecuta pruebas con Playwright
    ↓
QA genera Reporte QR-XXX + QD-XXX por cada fallo
    ↓
[HUMAN REVIEW]
    ↓
QD-XXX se promueve a FDGE (PT-XXX BUG) y/o PTSA (H-XXX)
    ↓
PTSA  →  FPGE
```

### Relación con FDGE

- FDGE produce el código. QA verifica que el código funciona desde el punto de vista del usuario.
- Los `test-scenarios.md` de cada Proposal Package son **insumo** para QA, no reemplazo. QA los amplía con su propia perspectiva de usuario.
- Los QD-XXX producidos por QA se promueven como PT-XXX de tipo BUG en FDGE.

### Relación con PTSA

- PTSA audita los **productos generados** por el sistema (documentos, cursos, reportes).
- QA audita la **experiencia de uso** del sistema.
- Son independientes. QA puede encontrar que la UX falla aunque PTSA certifique que los productos son válidos.
- Los QD-XXX de severidad HIGH o CRITICAL que afecten la validez semántica de un producto pueden escalarse también a PTSA como H-XXX.

### Relación con FPGE

- FPGE lee el QA Health Score y los QD-XXX abiertos como evidencia de priorización.
- Un ciclo QA-F bloquea automáticamente la recomendación de nuevas features hasta que los defectos críticos sean resueltos.

---

## La Herramienta: Playwright

El framework QA está estandarizado sobre **Playwright** como herramienta de automatización de navegador.

**Versión mínima requerida: `@playwright/test >= 1.40`**
(Verifica con: `npx playwright --version`)

Esta versión mínima garantiza soporte de: tags de test nativos, `--grep` por nombre, `QA_REPORT_DIR` vía variables de entorno en config, y `screenshot: 'on'` estable.

### Por qué Playwright

- Soporte nativo multi-browser (Chromium, Firefox, WebKit).
- Screenshots nativos por paso con un solo comando.
- Modo headless y headed (para revisión visual humana).
- CLI completa, usable por agentes sin interfaz gráfica.
- Soporte de waitForSelector, waitForNavigation y timeouts configurables.
- Grabación de video de sesión completa (modo debug).
- Sin dependencia de un servidor de tests: puede correr contra cualquier URL.

### Configuración base

```typescript
// playwright.config.ts (raíz del proyecto destino)
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './qa/tests',
  timeout: 30000,
  retries: 0,
  workers: 1, // Previene colisiones de datos
  fullyParallel: false,
  use: {
    baseURL: process.env.QA_BASE_URL || 'http://localhost:3000',
    screenshot: 'on',           // screenshot en cada paso
    video: 'retain-on-failure', // video solo si falla
    trace: 'retain-on-failure', // trace solo si falla
    headless: true,
  },
  reporter: [
    ['list'],
    ['json', { outputFile: 'qa/reports/results.json' }],
  ],
});
```

### Variable de entorno obligatoria

```
QA_BASE_URL=https://[url-del-sistema-a-probar]
```

El agente nunca asume la URL. La lee de la variable de entorno o del Plan de Pruebas. Si ninguna existe, **STOP** y reporta al humano.

---

## Lo que QA NO es

| Esto NO es QA en este framework | Por qué |
|:---|:---|
| Tests unitarios de funciones | Responsabilidad de FDGE PHASE 5 |
| Tests de API sin interfaz de usuario | Responsabilidad de FDGE (evidencia API) |
| Auditoría de productos generados por IA | Responsabilidad de PTSA |
| Performance técnica (latencia, throughput) | Fuera del alcance (es performance percibida) |
| Auditoría de seguridad (pentest, OWASP) | Componente separado no incluido en esta suite |
| Inspección de código fuente | Prohibido en QA — el agente no lee código |

---

## Criterios de Éxito del Componente QA

- Todo ciclo QA comienza con un Plan de Pruebas aprobado por el humano.
- Todo caso ejecutado tiene captura de pantalla verificable.
- Todo fallo produce un QD-XXX con severidad, evidencia y promoción sugerida.
- El Health Score QA se calcula y registra en cada ciclo.
- Ningún ciclo QA se considera completo sin Reporte QR-XXX generado.
- Ninguna promoción de QD-XXX a FDGE o PTSA ocurre sin aprobación humana.
- Cualquier sesión futura puede reproducir un ciclo QA leyendo `QA/QA-PLAN.md` y `QA/reports/QR-XXX/`.
