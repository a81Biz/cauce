# EXECUTION MODES — Compuertas, automatización y lotes

> **Estatus:** normativo. Define cuánta autonomía tiene el agente y dónde el humano decide.
> **Autoridad:** ver `LEX-R21`. Reglas: [RULES.md](RULES.md). Vocabulario: [LEXICON.md](LEXICON.md).
>
> Suite version: **13.5.0**

---

## 1. El problema que resuelve

La suite v3 trataba cada frontera de fase con la misma solemnidad, sin importar si la
acción era reversible. Un typo de una palabra exigía seis aprobaciones humanas; el merge a
la rama principal, el despliegue y el rollback no tenían **ninguna** —de hecho, ni
siquiera estaban especificados.

Eso produce dos fallos simultáneos:

1. **Ceremonia donde no importa.** Un roadmap de 10 ítems exigía ~60 ciclos de
   copiar / pegar / aprobar. La fricción empuja a la gente a saltarse el proceso.
2. **Cero protección donde sí importa.** El ciclo de git estaba especificado con detalle
   quirúrgico hasta el último commit, y ahí paraba. La rama quedaba abierta para siempre.

Y había una tercera incoherencia: **dos filosofías de gobierno opuestas conviviendo sin
explicación**. PTSA ordenaba al agente proceder de forma autónoma y ejecutar él mismo los
diagnósticos. QA declaraba lo contrario: *«estrictamente prompt-driven, el agente no asume
qué hacer sin instrucciones explícitas»*. Ninguna de las dos declaraba su criterio, y el
usuario no podía elegir.

La respuesta no es «más control» ni «menos control». Es **control proporcional a la
reversibilidad**.

---

## 2. Principio

`EXEC-P1` · **La compuerta protege contra lo irreversible, no contra el avance.**

Una frontera de fase merece compuerta humana si, al cruzarla mal, el coste de deshacerlo es
mayor que el coste de haberla revisado. Todo lo demás es ceremonia, y la ceremonia se paga
en fricción, que se paga en bypasses silenciosos.

Aplicando ese criterio, la suite tiene **cuatro compuertas** y ninguna más.

---

## 3. Las cuatro compuertas

| ID | Nombre | Ocurre tras | Qué protege | Coste de cruzarla mal |
|:--|:---|:---|:---|:---|
| **G1** | Definition of Ready | PHASE 1 — Intake | Construir la cosa equivocada | El más alto de todos: todo el trabajo posterior es desperdicio |
| **G2** | Proposal Gate | PHASE 4 — Proposal | Construirla de la forma equivocada | Rework de la implementación completa |
| **G3** | Validation Gate | PHASE 7 — Validation | Declarar terminado algo que no lo está | Un defecto que llega a integración |
| **G4** | Integration Gate | PHASE 9 — Integration | Romper la línea principal | Incidente en producción · rollback |

Todo lo que ocurre entre compuertas es **reversible**: análisis, estrategia, borradores,
código en una rama aislada, evidencia. Se puede tirar y rehacer sin coste externo. Por eso
no lleva compuerta: lleva **checkpoint**.

### 3.1 Compuerta vs checkpoint

```
COMPUERTA (gate)          El agente se detiene. No avanza sin decisión humana.
                          Puede resolverse por ACK explícito o por regla automática
                          declarada, según el modo.

CHECKPOINT                El agente reporta qué hizo y sigue. Queda registrado.
                          El humano puede interrumpir en cualquier momento, pero no
                          se le exige actuar.
```

`EXEC-R01` · Un checkpoint **siempre** produce un registro legible. Auto-avanzar en silencio
está prohibido en todos los modos: la diferencia entre modos es si el humano debe
*responder*, nunca si se le *informa*.

---

## 4. Los tres modos

Se declara uno por proyecto en su `CLAUDE.md`:

```yaml
## FDGE Execution Mode
mode: SUPERVISED        # MANUAL | SUPERVISED | AUTONOMOUS
```

`EXEC-R02` · **`SUPERVISED` es el modo por defecto.** Un proyecto que no declara modo opera
en `SUPERVISED`.

### 4.1 `MANUAL`

Comportamiento de la suite v3. Cada fase termina en STOP y espera ACK. Once paradas por PT.

Para: adoptar el framework por primera vez, dominios de alto riesgo regulatorio, o cuando
se está calibrando la confianza en el agente sobre un codebase nuevo.

### 4.2 `SUPERVISED` — por defecto

Las cuatro compuertas están vivas. Todo lo demás auto-avanza reportando.

Cuatro paradas por PT en lugar de once, sin perder ninguna de las protecciones reales.

### 4.3 `AUTONOMOUS`

G1 y G4 siempre vivas. G2 y G3 se resuelven por regla automática cuando se cumplen las
condiciones de §5, y por ACK humano cuando no.

Para: lotes de trabajo homogéneo y bien especificado —deuda acumulada, corrección de un
conjunto de defectos QA, migración mecánica repetida sobre muchos archivos.

`EXEC-R03` · `AUTONOMOUS` **no** significa «sin humano». Significa que el humano decide dos
veces por lote (al admitirlo y al integrarlo) en lugar de cuatro veces por PT.

---

## 5. Matriz de compuertas

| | `MANUAL` | `SUPERVISED` | `AUTONOMOUS` |
|:---|:---|:---|:---|
| **G1 — DoR** | ACK humano | ACK humano | ACK humano |
| **G2 — Proposal** | ACK humano | ACK humano | **Auto** si se cumplen las 5 condiciones de §5.1; ACK humano si no |
| **G3 — Validation** | ACK humano | ACK humano si `type=BUG`; **auto** para `FEATURE`/`REFACTOR`/`CHORE` que cumplan §5.2 | Igual que `SUPERVISED` |
| **G4 — Integration** | **ACK humano** | **ACK humano** | **ACK humano** |
| Fronteras 0→1, 2→3, 3→4, 5→6, 6→7, 8→9 | ACK humano | Checkpoint | Checkpoint |

`EXEC-R04` · **G4 es humana en los tres modos, sin excepción** (`FDGE-R33`, `SUITE-R06a`).
No existe configuración, urgencia ni tipo de trabajo que la automatice.

**Qué garantiza esta compuerta, y qué no.** Lo mismo que `SUITE-R27` declara de las firmas, y se
dice aquí porque es donde la consecuencia es irreversible:

| Lo que el marco garantiza | Lo que no puede garantizar |
|:---|:---|
| Hace falta un pull request y la verificación en verde, **sin excepción ni para quien administra el repositorio** | Que **una persona** ejecutara el merge. El agente tiene las mismas credenciales |
| Queda **constancia con nombre** —de la lista `firmantes`— y `verify-fdge` la exige por cada avance de la rama por defecto | Que la autorización que esa constancia cita **existiera**. La escribe el agente |
| Ni `force push` ni borrado de la rama por defecto: el rastro no se puede retirar | — |

**`0` revisores aprobadores no es un descuido de configuración.** `SUITE-R22` declara soportado el
equipo de una persona asistida por IA, y nadie puede aprobar su propio pull request. Exigir uno
haría el flujo imposible, no más seguro.

**El control es posterior y contrastable, no preventivo**, y ésa es la afirmación exacta que el
marco puede sostener. Quien figura en `firmantes` responde de lo que lleva su nombre — igual que
en una firma.

`EXEC-R04a` · **La constancia de una `G4` tiene forma fija.** Una entrada en
`docs/implementation/SESSION_LOG.md` cuyo encabezado sea `## <YYYY-MM-DD> · …` y mencione `G4`,
`VoBo` o `autorizad…`, con **un nombre de `firmantes` en su cuerpo**. `verify-fdge` la busca así,
y sin ella el merge falla desde la versión que introduce la comprobación.

Dejarla a criterio de cada sesión la hacía indistinguible de una nota cualquiera: lo que hace
contrastable a una autorización es que se sepa **dónde mirar** y **qué tiene que decir**.

`EXEC-R08` · `HARD` · **Los tres modos exigen lo mismo.** Un modo cambia **quién** resuelve una compuerta
y cuándo se pide confirmación. **Nunca cambia qué se exige**: ni un artefacto menos, ni una regla
que no se comprueba, ni evidencia más floja. La matriz de arriba solo contiene quién resuelve;
que una celda citara un artefacto o una regla significaría que ese modo trata distinto lo
exigido, y `verify-suite` lo comprueba con vocabulario cerrado en vez de adivinar sobre prosa
(`SUITE-R38`, la lección de `PT-018`).

Se escribió porque la fila de `G1` declaraba la firma por lote como algo de `AUTONOMOUS`, y
`INTAKE-R08` vale en los tres: `EP-004` a `EP-007` la usaron en `SUPERVISED`. Una ventaja
aparente de un modo es una vara de medir más floja esperando a que alguien la elija sin decirlo.

`EXEC-R05` · **G3 es humana para todo `BUG` en los tres modos** (`FDGE-R26`, `LEX-R08`).
Un bug lo declara resuelto quien lo sufrió, no quien lo arregló.

### 5.1 Condiciones para auto-resolver G2 (`AUTONOMOUS`)

Las cinco, simultáneamente. Si falta una, G2 pasa a ACK humano:

```
[ ] complexity ∈ {TRIVIAL, STANDARD}            — MAJOR siempre requiere ACK
[ ] severity ∈ {S3, S4}                         — S1/S2 siempre requieren ACK
[ ] spec-changes.md no introduce breaking change en contrato público
[ ] tasks.md no toca ningún archivo listado en «Files Requiring Extra Care»
    de 11-Conventions.md
[ ] la estrategia no contradice ninguna Hard Rule RULE-nn de 11-Conventions.md
```

### 5.2 Condiciones para auto-resolver G3 (`SUPERVISED` y `AUTONOMOUS`)

```
[ ] type ≠ BUG                                  — EXEC-R05
[ ] suite de tests completa en verde
[ ] cobertura no desciende respecto a la línea base
[ ] evidence/PT-XXX/manifest.json válido        — FDGE-R23
[ ] traceability.md sin AC huérfanos            — FDGE-R15
[ ] self-review.md sin bloqueadores
[ ] verify-fdge.mjs sin errores
```

`EXEC-R06` · Estas condiciones son **verificables mecánicamente**, no declarativas. Auto-
resolver G3 significa que `verify-fdge` pasó, no que el agente afirmó que pasó. Un checklist
que el propio agente rellena sobre sí mismo no es un control (`FDGE-R25`).

---

## 6. Lista cerrada de acciones nunca automatizadas

`SUITE-R06` en forma operativa. **En ningún modo, bajo ninguna circunstancia:**

```
a)  merge o push a la rama principal
b)  cierre de un ítem de tipo BUG
c)  migración, borrado o transformación destructiva de datos
d)  cualquier operación contra un entorno de producción
e)  modificación de los documentos de docs/methodology/
f)  git push --force, reescritura de historia, borrado de ramas remotas
g)  rotación, generación o exposición de credenciales
```

`EXEC-R07` · Si un PT requiere una de estas acciones para completarse, el agente prepara
todo lo demás, se detiene en el punto exacto y **describe el comando a ejecutar**. No lo
ejecuta y no continúa sin confirmación.

---

## 7. Lotes — `EP-NNN`

### 7.1 Qué es

Un `EP-NNN` agrupa PTs relacionados bajo una sola admisión y una sola sesión de trabajo.
**No sustituye a los PTs** (`FDGE-R38`): cada uno conserva su directorio, su ciclo completo,
su evidencia y su entrada en `HISTORY.log`. Lo que el lote comparte es la ceremonia.

Sustituye al concepto huérfano `Sprint S-nnn`, que en v3 aparecía una sola vez en un
template de `HISTORY.log` y no estaba definido en ningún otro sitio (`LEX-R20`).

### 7.2 Cómo se abre

```
promote FPGE R-003..R-007 as EP-003
```
o directamente:
```
[START EP] Deuda de validación de formularios
```

### 7.3 El desbloqueo que lo hace posible

`FDGE-R39` es la regla que convierte los lotes de una aspiración en algo ejecutable.

En v3, `PLAN_ACTUAL.md`, `PENDING_TASKS.md` y `CONTEXT_ANALYSIS.md` eran **archivos
globales sobrescribibles**, y `FDGE-Implementation.md` lo declaraba sin ambigüedad: *«Solo
puede existir un plan activo»*. Dos PTs en vuelo se destruían mutuamente. No era una
política que se pudiera relajar con instrucciones: era una **imposibilidad física**.

En v4, todo estado de trabajo vive en `changes/PT-XXX-slug/` (`LEX-R13`). Las rutas globales
que quedan son ledgers append-only (`HISTORY.log`, `SESSION_LOG.md`, `INCIDENTS.log`),
índices (`DISCOVERY.md`, `ENRICHMENT.md`, `REFACTOR_SCOPE.md`) o vistas regenerables
(`HANDOFF.md`, `BACKLOG.md`). Ninguna es sobrescribible por un PT individual.

### 7.4 Análisis de solapamiento

El cálculo de solapamiento lo exige **`FDGE-R40`** en `RULES.md` — y con él la consecuencia que
esta sección no puede enunciar: los PTs que comparten archivos **se serializan**. Aquí va la
forma del plan que se declara en `BACKLOG.md`:

```markdown
## EP-003 — Deuda de validación de formularios
Modo: SUPERVISED · Admitido: 2026-08-05 · Firma: [nombre]

| Orden | PT | Tipo | Sev | Archivos | Depende de |
|:--|:--|:--|:--|:--|:--|
| 1 | PT-101 | REFACTOR | S4 | src/forms/validator.ts | — |
| 2 | PT-102 | BUG | S3 | src/forms/validator.ts | PT-101 (mismo archivo) |
| 3 | PT-103 | BUG | S3 | src/auth/login.tsx | — |

Solapamiento detectado: PT-101 ↔ PT-102 (src/forms/validator.ts) → serializados.
PT-103 es independiente pero se ejecuta en secuencia (ver EXEC-R08).
```

`EXEC-R15` · La ejecución de un lote es **secuencial** por defecto. La ejecución concurrente
en worktrees separados es una extensión opcional que exige, además, una política declarada
de resolución de conflictos; no forma parte del comportamiento base.

> **Llevaba el ID `EXEC-R08`, que ya tenía dueño**: *«los tres modos exigen lo mismo»*, en §5.
> Dos obligaciones distintas bajo un identificador, y las citas de `CASOS-DE-USO`, `MANUAL` y
> `CHANGELOG` apuntaban todas a la primera — así que ésta **no la citaba nadie**, y renumerarla no
> rompe ninguna referencia. Lo destapó `PT-163` en su primera corrida: hasta hoy `definidasDosVeces`
> contaba **documentos**, no definiciones, y dos IDs iguales en el mismo archivo colapsaban en uno.

### 7.5 Regla de parada

**`FDGE-R41`** en `RULES.md` manda detener el lote **completo** ante el primer `BLOCKED` o el
primer fallo de compuerta no resuelto — y que el **`EP-NNN` pase a `BLOCKED`**, con el PT causante
y el motivo en `BACKLOG.md`. No continúa «con los que sí pudieron».

El motivo: los PTs de un lote suelen compartir supuestos. Si uno falla porque el supuesto
era falso, seguir con el resto multiplica el rework en vez de contenerlo. El humano puede
retirar el PT problemático del lote y reanudar explícitamente.

### 7.6 Cierre

Un `EP-NNN` pasa a `CLOSED` cuando todos sus PTs están `INTEGRATED` o `CLOSED`, o han sido
retirados del lote de forma explícita. El cierre se registra en `HISTORY.log` con una
entrada propia que enumera sus PTs.

---

## 8. Recorridos por track

### 8.1 `STANDARD`

```
PHASE 0  Context
PHASE 1  Intake                      ──── G1 ────
PHASE 2  Analysis           checkpoint
PHASE 3  Strategy           checkpoint
PHASE 4  Proposal                    ──── G2 ────
PHASE 5  Implementation     checkpoint
PHASE 6  Evidence           checkpoint
PHASE 7  Validation                  ──── G3 ────
PHASE 8  Persistence        checkpoint
PHASE 9  Integration                 ──── G4 ────
```

### 8.2 `EXPRESS` — solo `complexity: TRIVIAL`

```
PHASE 0  Context
PHASE 1  Intake                      ──── G1 ────
PHASE 2+3+4  bloque condensado       ──── G2 ────   (un solo artefacto: strategy.md)
PHASE 5  Implementation     checkpoint
PHASE 6  Evidence           checkpoint             (evidencia mínima, ver §8.4)
PHASE 7  Validation                  ──── G3 ────
PHASE 8  Persistence        checkpoint
PHASE 9  Integration                 ──── G4 ────
```

`EXEC-R09` · `EXPRESS` **condensa; no colapsa**. Las fases ocurren y se documentan; solo se
agrupan en menos artefactos y menos compuertas. Omitir Intake, evidencia, validación,
persistencia o integración está prohibido en cualquier track (`LEX-R02`).

`EXEC-R10` · Si durante `EXPRESS` el agente detecta que el trabajo no es `TRIVIAL`, se
detiene y el PT vuelve a PHASE 2 en track `STANDARD` (`FDGE-R21`). No se «termina rápido
porque ya casi está».

### 8.3 `HOTFIX` — solo `severity: S1`

```
PHASE 0  Context
PHASE 1  Intake  (mínimo: qué pasa, esperado, impacto, firma)  ──── G1 ────
PHASE 5  Implementation     checkpoint
PHASE 6  Evidence           checkpoint
PHASE 9  Integration                                            ──── G4 ────
         ↓
   ⏱ 48 h para completar retroactivamente PHASE 2, 3, 4, 7 y 8
```

El carril `HOTFIX` lo define **`FDGE-R22`** en `RULES.md`, y ahí está su enunciado completo:
sólo para `severity: S1`, rama `hotfix/PT-XXX-slug`, un `INC-NNN` abierto, y `PHASE 2, 3, 4, 7 y
8` completadas retroactivamente en 48 h.

Aquí sólo se explica **cómo se ejecuta**: difiere el análisis, la propuesta y la validación
formal; no los elimina.

`EXEC-R11` · **Un hotfix con documentación retroactiva vencida bloquea la apertura de todo
PT nuevo.** El bloqueo se levanta completando la documentación, nunca ignorándolo.

Este carril existe por una razón concreta: en v3 no había ninguno, así que ante una caída
de producción la única opción real era **saltarse el framework en silencio**. Un bypass
documentado es recuperable y auditable; uno silencioso destruye la trazabilidad y nadie se
entera hasta la siguiente auditoría.

### 8.4 Evidencia mínima por track

`FDGE-R24` exige evidencia proporcional al cambio. Concretado:

| Track | Evidencia mínima |
|:---|:---|
| `STANDARD` | Salida completa de tests + cobertura + una prueba por `AC` según la naturaleza del cambio |
| `EXPRESS` | Una verificación ejecutada del cambio (captura, salida de comando o test) + confirmación de que la suite sigue en verde |
| `HOTFIX` | Prueba de que el síntoma desapareció en el entorno afectado + suite en verde. El resto se completa en la ventana de 48 h |

En los tres casos, `manifest.json` es obligatorio (`FDGE-R23`).

---

## 9. Cambiar de modo

`EXEC-R12` · El modo se declara en el `CLAUDE.md` del proyecto y **solo lo cambia un
humano**. Es un documento de metodología en lo que respecta a `SUITE-R06e`: el agente no
edita su propio nivel de supervisión.

`EXEC-R13` · Un cambio de modo se registra como una entrada en `HISTORY.log`, con fecha,
modo anterior, modo nuevo y motivo. Sin registro, no se puede auditar por qué un PT tuvo las
compuertas que tuvo.

`EXEC-R14` · **Restricción automática de compuertas.** Cuando se cumple cualquiera de las
condiciones de abajo, el agente **opera como si el modo fuera `MANUAL`** y lo declara al
inicio de la sesión.

No es un cambio de modo y no contradice a `EXEC-R12`: el valor declarado en `CLAUDE.md` no
se toca —solo un humano lo edita—. Es una **restricción temporal** que se levanta sola en
cuanto la condición desaparece. Se registra en `SESSION_LOG.md`, no en `CLAUDE.md`.

Condiciones:

```
- clasificación QA-F vigente
- Health Score PTSA < 60, o D1 < 60
- un INC-NNN abierto sin causa raíz documentada
- documentación retroactiva de un HOTFIX vencida
- Foundation ausente o con más de 10 PTs de antigüedad
```

El motivo: la autonomía se apoya en la calidad de la evidencia disponible. Cuando esa
evidencia se degrada, la autonomía deja de estar justificada. Se restaura resolviendo la
condición, no desactivando la comprobación.

---

## 10. Qué reporta el agente en cada checkpoint

`EXEC-R01` en forma concreta. Un checkpoint produce, como mínimo:

```
PHASE <n> — <Nombre>  ·  PT-XXX  ·  <track>  ·  modo <MODE>

Hecho:        [1-3 líneas]
Artefacto:    [ruta]
Desviaciones: [respecto a lo planificado, o «ninguna»]
Riesgos:      [nuevos detectados, o «ninguno»]
Siguiente:    PHASE <n+1> — <Nombre>   [avanzando | esperando G<n>]
```

En `MANUAL` el bloque termina en `STOP`. En `SUPERVISED` y `AUTONOMOUS` el agente continúa
tras emitirlo, salvo que la siguiente frontera sea una compuerta viva.
