# Framework de Desarrollo Gobernado por Evidencia (FDGE)

> **Naturaleza de este documento: explicativo.** Explica *por qué* el método es como es.
> **No contiene obligaciones** (`LEX-R22`): las reglas viven en [RULES.md](RULES.md) y aquí
> se citan por ID. Si encuentras una obligación enunciada en este archivo, es un defecto.
>
> Vocabulario: [LEXICON.md](LEXICON.md) · Compuertas y automatización: [EXECUTION-MODES.md](EXECUTION-MODES.md)
> Procedimiento: [FDGE-Implementation.md](FDGE-Implementation.md) · Prompts: [FDGE-Prompts.md](FDGE-Prompts.md)
>
> Suite version: **5.2.2**

---

## Filosofía

El desarrollo de software asistido por IA presenta un problema fundamental:

> **La IA puede implementar más rápido de lo que puede comprender.**

Cuando eso ocurre, los errores dejan de ser fallos de programación y se convierten en fallos
de interpretación. La mayoría de las regresiones, de la deuda técnica y de las soluciones
incorrectas no nacen de código defectuoso: nacen porque se implementó una solución correcta
para un problema mal entendido.

De ahí el principio central del framework:

### Ninguna implementación puede comenzar antes de existir evidencia suficiente de comprensión, y ninguna tarea puede cerrarse antes de existir evidencia suficiente de validación.

La v4 añade una precisión que la v3 daba por supuesta y que resultó ser el hueco más grande
del método: **la comprensión no empieza en el agente, empieza en el humano.** Un framework
que gobierna exhaustivamente al agente y no gobierna en absoluto lo que el humano aporta
está construyendo su cadena de evidencia sobre una interpretación no declarada.

---

# Principios

## 1. Intention Before Discovery
*(nuevo en v4 — `INTAKE-R01`..`INTAKE-R06`, `FDGE-R01`..`FDGE-R05`)*

Antes de que el agente investigue nada, el humano declara qué quiere y qué espera. Los
criterios de aceptación son la definición del negocio; el comportamiento esperado de un bug
es un hecho de negocio. Ninguno de los dos se deriva del código.

En v3 el agente los redactaba y el humano los aprobaba con un ACK. Eso tiene la apariencia
del gobierno y ninguna de sus propiedades: si el agente deduce del código qué *debería* hacer
un bug, deduce el comportamiento con el defecto dentro, lo «arregla» hacia el estado
equivocado, y todos los tests pasan.

Ver [INTAKE/Intake-Protocol.md](INTAKE/Intake-Protocol.md).

## 2. Discovery Before Design
`FDGE-R06`

La solicitud nunca es una especificación. Es una señal inicial que debe expandirse hasta
convertirse en un problema definido.

## 3. Architecture Before Solution
`FDGE-R07`, `FDGE-R08`

Ninguna solución puede diseñarse sin saber dónde ocurre, por qué ocurre, qué componentes
participan y qué dependencias existen. La documentación de Foundation y el grafo de
dependencias son las fuentes. Cuando el grafo no está disponible, eso se declara y baja la
confianza — no se finge haberlo consultado.

## 4. Evidence Before Action
`SUITE-R01`

Toda decisión técnica se apoya en evidencia verificable. Nunca en memoria del agente,
intuición, suposición ni contexto conversacional.

## 5. Human Governance, Proportional to Risk
`SUITE-R05`, `SUITE-R06`, `EXEC-P1`

La IA ejecuta; el humano gobierna. Pero gobernar no es aprobar cada paso: es decidir donde
la decisión es irreversible.

La v3 aplicaba el mismo ACK a cada frontera, sin importar el coste de equivocarse. El
resultado fue seis aprobaciones para un typo y ninguna para el merge —que ni siquiera
estaba especificado. La v4 concentra la autoridad humana en cuatro compuertas y protege
explícitamente una lista cerrada de acciones irreversibles.

La fricción no es gobierno. La fricción produce bypasses silenciosos, y un bypass silencioso
destruye exactamente lo que el framework existe para proteger.

## 6. Atomic Execution
`FDGE-R16`, `FDGE-R19`

La implementación nunca ocurre sobre problemas ambiguos. Toda acción se reduce a una unidad
verificable, y todo commit representa un cambio lógico.

## 7. Evidence After Execution
`SUITE-R02`, `FDGE-R23`, `FDGE-R24`

El código no es evidencia. La ejecución verificable sí. Y la evidencia es proporcional al
tipo de cambio: exigir capturas de pantalla a un PT de backend es ceremonia, no evidencia.

La v4 añade que la evidencia debe ser **mecánicamente verificable**: un manifiesto que
enlaza cada criterio de aceptación con un artefacto real en disco. Un checklist que el
agente rellena sobre sí mismo prepara la revisión humana, pero no puede ser la única
barrera (`FDGE-R25`).

## 8. Session Independence
`SUITE-R03`, `SUITE-R04`

Ninguna sesión depende de la memoria del agente. Todo conocimiento persiste en artefactos.
Una decisión importante que solo existe en el chat no existe.

## 9. Minimal Intervention
`FDGE-R03`, `FDGE-R05`

La pregunta antes de cualquier acción es: *¿cuál es el punto más temprano donde puedo
detectar que esto está mal?*

```
Intake  →  Análisis  →  Propuesta  →  Tests  →  Self-review  →  Revisión humana  →  Rework
  1x         3x           8x          20x         40x              80x            300x
```

Nunca ir al paso más caro si el problema puede detectarse en uno más barato. La v3 enunciaba
este principio y dejaba sin compuerta precisamente el escalón más barato de todos.

## 10. Traceable Completion
*(nuevo en v4 — `FDGE-R15`, `FDGE-R33`..`FDGE-R37`)*

Un trabajo no termina cuando el código funciona. Termina cuando está integrado, trazado
desde la intención hasta la evidencia, y recuperable si sale mal.

La v3 especificaba el workflow de git con detalle quirúrgico hasta el último commit y ahí
paraba: no definía merge, ni CI, ni borrado de rama, ni rollback. La rama quedaba abierta
para siempre y un incidente en producción no tenía ningún camino dentro del framework.

---

# Clasificación

## Complejidad — mide esfuerzo y riesgo técnico

| | Ejemplos | Track |
|:---|:---|:---|
| `TRIVIAL` | Typo, etiqueta, texto estático, ajuste CSS simple | `EXPRESS` |
| `STANDARD` | Bug típico, cambio CRUD, regla de negocio, validación | `STANDARD` |
| `MAJOR` | Módulo nuevo, workflow nuevo, cambio arquitectónico, rediseño de BD | `STANDARD` + análisis de riesgo y regresión obligatorios |

La complejidad decide **cuánto se puede condensar** el recorrido, nunca **qué se puede
omitir**. Condensar es agrupar fases en menos artefactos y menos compuertas; colapsar es
saltárselas. Lo primero está previsto; lo segundo es el antipatrón *Phase Collapse*
(`LEX-R02`, `EXEC-R09`).

## Severidad — mide urgencia de negocio
*(nuevo en v4 — `LEX-R19`, `FDGE-R04`, `INTAKE-R04`)*

`S1` · `S2` · `S3` · `S4`. La declara el humano en el Intake.

Es **ortogonal** a la complejidad. En v3 solo existía la complejidad, de modo que un fallo
crítico de producción y un texto mal alineado recorrían el mismo camino con la misma
urgencia — y no había ningún carril legítimo para lo urgente, lo que empujaba a saltarse el
proceso.

Solo `S1` habilita el track `HOTFIX` (`FDGE-R22`), que difiere el análisis y la propuesta
pero obliga a completarlos retroactivamente en 48 h.

## Tipo

`BUG` · `FEATURE` · `REFACTOR` · `INVESTIGATION` · `CHORE`

El tipo determina la variante de análisis, la plantilla de Intake y el criterio de cierre.
Una `INVESTIGATION` no produce código (`FDGE-R10`): cierra con hallazgos y puede originar un
PT nuevo de otro tipo.

## Investigation Gate
`FDGE-R09`

Si la causa raíz, el impacto arquitectónico o las dependencias son desconocidas, o si
cualquier confianza declarada baja del 70 %, `FDGE-R09` reclasifica el trabajo a
`INVESTIGATION` de inmediato y bloquea la planificación de implementación hasta que la
investigación eleve la confianza.

Es el mecanismo que impide que la incertidumbre se disfrace de plan.

---

# El recorrido

Once fases, cuatro compuertas. El detalle operativo está en
[FDGE-Implementation.md](FDGE-Implementation.md); aquí está el porqué de cada una.

| PHASE | Qué resuelve |
|:--|:---|
| **0 · Context** | Que la sesión no arranque desde cero ni desde la memoria del agente. Reconstruye el estado leyendo artefactos. |
| **1 · Intake** | Que exista una intención declarada antes de gastar nada. Compuerta **G1**. |
| **2 · Analysis** | Que el problema esté definido y el sistema comprendido. Bifurca por tipo: `2-B` descubrimiento, `2-E` enriquecimiento, `2-R` scope. |
| **3 · Strategy** | Que se haya elegido un camino habiendo considerado otros, con los riesgos y la regresión sobre la mesa. |
| **4 · Proposal** | Que exista un contrato de lo que se va a construir antes de tocar código. Compuerta **G2**. |
| **5 · Implementation** | Que el código se escriba contra tests que ya fallan, en commits atómicos, dentro del scope. |
| **6 · Evidence** | Que exista prueba ejecutada, no afirmada, enlazada a cada criterio. |
| **7 · Validation** | Que alguien con autoridad declare que está bien. Compuerta **G3**. |
| **8 · Persistence** | Que el conocimiento sobreviva a la sesión. |
| **9 · Integration** | Que el trabajo llegue a la línea principal de forma controlada y la rama se cierre. Compuerta **G4**. |
| **10 · Rollback** | Que exista un camino documentado cuando algo integrado sale mal. |

## Por qué el Proposal Gate es la mejor inversión del ciclo

```
Corregir una propuesta cuesta tokens.
Corregir código implementado cuesta tiempo, tokens y contexto.
```

Antes de G2: **0 líneas modificadas, 0 ramas abiertas** (`FDGE-R13`). El Proposal Package es
la fuente de verdad durante toda la implementación: si algo no está en él, no estaba
planificado (`FDGE-R14`).

## Por qué un bug no lo cierra quien lo arregla
`FDGE-R26`, `LEX-R08`, `EXEC-R05`

Quien implementó el arreglo tiene un modelo mental del problema — el mismo modelo que pudo
estar equivocado. La validación de un bug la hace quien sufrió el síntoma, sobre el sistema
real. En los tres modos de ejecución, sin excepción.

Cuando el bug nació de un defecto QA, la re-ejecución del caso de origen sirve como evidencia
de la validación, pero la decisión de cerrar sigue siendo humana (`FDGE-R28`). Esto cierra el
loop QA↔FDGE, que en v3 quedaba enunciado y sin procedimiento.

## Por qué existe el carril HOTFIX
`FDGE-R22`, `EXEC-R11`

Porque el framework tiene que sobrevivir a las 3 de la mañana. Sin un carril legítimo para
`S1`, la única opción real ante una caída es saltarse el proceso en silencio — y un bypass
silencioso destruye la trazabilidad sin que nadie se entere hasta la siguiente auditoría.

`HOTFIX` difiere el análisis y la propuesta, no los elimina. La documentación retroactiva
vencida bloquea la apertura de trabajo nuevo. Un bypass documentado es recuperable.

---

# El contrato de evidencia

Una tarea no existe como completada hasta que existe evidencia.

| Estado canónico | Significa |
|:---|:---|
| `DRAFT` / `READY` / `IN_PROGRESS` / `BLOCKED` | Sin evidencia suficiente |
| `IN_REVIEW` | Con evidencia técnica, pendiente de revisión |
| `VALIDATION_PENDING` | Con evidencia, esperando validación humana. **Terminal para el agente.** |
| `DONE` | Validado técnicamente, aún no en la línea principal |
| `INTEGRATED` | En la línea principal |
| `CLOSED` | Terminal |
| `REVERTED` | Estuvo integrado y se revirtió. Requiere `INC-NNN` |

La enumeración completa y las transiciones válidas están en `LEXICON.md` §5.

La v3 mantenía en paralelo un «vocabulario conceptual» (`INCOMPLETO`/`IMPLEMENTADO`/
`CERRADO`) y un vocabulario canónico, más tres valores de artefacto inventados en los
prompts (`DISCOVERY_PENDING`, `ENRICHMENT_PENDING`, `SCOPE_PENDING`) de los cuales uno
—`SCOPE_PENDING`— nunca se cerraba porque la fase de persistencia buscaba otro nombre. En v4
hay una sola enumeración.

---

# Relación con los demás componentes

FDGE **construye**. Los demás consumen lo que produce:

- **QA** verifica desde el navegador que el usuario puede usar lo construido. Sus casos
  citan los criterios de aceptación de origen (`QA-R19`).
- **PTSA** audita si los productos que el sistema genera son válidos para su dominio.
- **FPGE** lee la historia y los hallazgos y propone qué construir a continuación. Entrega
  sus ítems aprobados a **PHASE 1 (Intake)**, no al análisis (`FPGE-R10`): el trabajo nacido
  del roadmap también necesita intención humana declarada.

Ninguno escribe en los artefactos de otro (`SUITE-R10`). La única escritura entre
componentes es la promoción, y siempre la dispara un humano.

---

# Criterios de éxito

Una sesión FDGE es correcta cuando:

* Todo trabajo entró por un Intake firmado y superó G1.
* Los criterios de aceptación los declaró el humano; el agente los formalizó.
* Toda implementación tuvo análisis arquitectónico previo con sus fuentes declaradas.
* Toda estrategia consideró al menos una alternativa y su rechazo está justificado.
* Ninguna rama se abrió antes de G2.
* Toda implementación comenzó con tests en rojo, salvo excepción declarada (`FDGE-R18`).
* Los commits son atómicos, nombrados y trazables al PT.
* Cada criterio de aceptación tiene test y evidencia enlazados; no hay criterios huérfanos.
* La evidencia es ejecutada, no afirmada, y su manifiesto valida.
* Ningún bug se cerró sin validación humana.
* El trabajo llegó a la línea principal por G4 y su rama está cerrada.
* Cualquier sesión futura puede reconstruir el trabajo leyendo solo artefactos.

# Criterios de fracaso

Los antipatrones tienen nombre para poder señalarlos sin discutir. La lista completa, con
la regla que cada uno viola, está en [RULES.md](RULES.md) §Parte 9.

Los cinco que más daño hacen:

**Phantom Criteria** — criterios de aceptación inventados por el agente y sellados sin leer.
Es el fallo que produce trabajo impecablemente ejecutado sobre el problema equivocado.

**Silent Bypass** — saltarse el framework por urgencia en lugar de usar `HOTFIX`. Destruye
la trazabilidad y no deja rastro de que se destruyó.

**Self-Certification** — tratar el self-review del agente como control suficiente.

**Global State Collision** — poner el estado de un PT en una ruta compartida sobrescribible.
Hace imposible tener dos trabajos en vuelo, y ninguna instrucción puede compensarlo.

**Dangling Branch** — trabajo terminado que nunca se integra ni se cierra. El framework
declara el éxito y el código nunca llega a nadie.
