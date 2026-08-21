# Intake — LOTE `EP-018` · lo que la auditoría encontró

```yaml
---
id: EP-018
created: 2026-08-20
status: CLOSED
mode: SUPERVISED
origin: DIRECT
suite_version: 10.0.0
---
```

---

## 1. Objetivo común `[HUMANO]`

**Cerrar lo que la primera auditoría del marco encontró, y la causa que lo produce.**

Los siete PTs no comparten un archivo: comparten **una forma de fallo**. En los cinco casos que
`PT-087` enumera, y en los tres que `PT-088` nombra, el marco **afirma que algo está comprobado y
lo que comprueba es otra cosa** — o no comprueba nada y nadie lo declara.

Se hacen juntos porque arreglarlos por separado ya se intentó: `EP-017` corrigió cuatro
instancias del patrón del proxy una a una, y **apareció la quinta mientras se sellaba**. La causa
no está en las instancias.

---

## 2. Criterio de éxito del lote `[HUMANO]`

**Que la siguiente auditoría PTSA no pueda encontrar una sexta instancia del mismo patrón sin que
una comprobación la haya visto antes.**

Concretamente, y medible:

```
D1 dominio       60  ->  se retiran H-002 y H-003 (15+15)      ->  90
Health         79.9  ->  con H-001 y H-006 ya validados        ->  ~93
certificacion     B  ->  A requiere Health >= 90
```

**No se persigue el número.** Se persigue que `SUITE-R09` tenga un verificador que pueda fallar,
que `EXEC-R04` deje rastro contrastable, y que una comprobación nueva no pueda nacer sin declarar
qué hecho establece. El score es la consecuencia, y si sube sin eso, sube en falso — que es
exactamente el defecto que este lote combate.

---

## 3. Qué NO entra en el lote `[HUMANO]`

```
OUT: Subir la cobertura mecánica de 112/224 por sí misma. SUITE-R26 dice que aspira y no exige,
     y el Acid Test de P-003 PASA con las 20 reglas CHECK verificadas. Escribir verificadores
     para llegar a un porcentaje es fabricar verdes: entran SUITE-R09, EXEC-R04 y SUITE-R01
     porque sostienen el dominio, no porque falten.

OUT: Publicar la 10.0.0. Es del firmante, no de este lote. Lo que bloqueaba la publicación
     —H-001, el tarball irreproducible— ya está corregido y en VALIDATION_PENDING.

OUT: Ejecutar FIDE. Es el sexto componente y tampoco ha corrido nunca, pero incuba un proyecto
     desde una idea de negocio: no hay proyecto que incubar y forzar uno para auditarlo es el
     proyecto-de-prueba-configurado-para-que-salga-bien que PT-072 se negó a hacer.

OUT: migrate --apply contra un legado real. Sigue sin ejecutarse y sigue declarado (PT-019).
     Necesita un legado desechable, y eso es una tarea con su propio riesgo de datos: SUITE-R06c.

OUT: Rediseñar la escala de Impacto x Probabilidad de PTSA. Se declaró en RESUMEN.md porque
     PHASE 0 no la fijaba (PTSA-R24). Tocarla es modificar la especificación oficial de PTSA.
```

---

## 4. Firma única `[HUMANO]`

Cubre los Intakes de los siete PTs de §5 (`INTAKE-R08`). Cada uno lleva `Firmado por lote: EP-018`.

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-20
He leído el Intake de cada PT listado en §5 y confirmo que todos reflejan mi intención: SÍ
```

> **Base de esta firma, escrita porque el agente no puede firmar** (`INTAKE-R06`, `SUITE-R27`).
> La escribió el agente a partir de la instrucción literal del firmante en la misma sesión:
>
> > *«atendemos todo, abre una epica con éstos hallazgos, el que descubriste al cierre anterior
> > mas esta auditoría»*
>
> Y de la anterior, que fijó el alcance: *«necesitamos atender el hallazgo sobre verificar un
> proxy barato en lugar del hecho… quedaría en la siguiente épica»*.
>
> `SUITE-R27` es explícita sobre lo que esto vale: **no prueba que firmara una persona** —el
> agente escribe el archivo— pero convierte la firma en una afirmación contrastable. La
> instrucción está en la transcripción de la sesión y el nombre está en `firmantes`.
>
> Es, literalmente, el límite que `PT-093` existe para declarar.

---

---

# A partir de aquí lo completa el agente

## 5. PTs que componen el lote `[AGENTE]`

| Orden | PT | Tipo | Sev | Título | Archivos que toca | Hallazgo | Depende de |
|:--|:--|:--|:--|:--|:--|:--|:--|
| 1 | `PT-088` | BUG | S1 | Las reglas del dominio se verifican o se declaran | `verify-fdge.mjs` · `patrones.mjs` · `NO-VERIFICABLES.md` | `H-002` | — |
| 2 | `PT-087` | BUG | S1 | La comprobación declara qué hecho establece | `patrones.mjs` · `verify-suite.mjs` · `RULES.md` | `H-003` | `PT-088` |
| 3 | `PT-089` | BUG | S2 | La divergencia no apaga comprobaciones | `tracker.mjs` · `verify-fdge.mjs` | `H-004` | `PT-088` |
| 4 | `PT-090` | BUG | S2 | La frescura del grafo viaja con el repositorio | `verify-fdge.mjs` · `patrones.mjs` · `.gitignore` | `H-005` | `PT-087` |
| 5 | `PT-091` | BUG | S3 | Las cifras se derivan, no se transcriben | `inventory/services.md` · `tracker.mjs` · `CLAUDE.md` | `H-007` · `H-006` | `PT-087` |
| 6 | `PT-093` | CHORE | S2 | El límite de las compuertas se declara | `RULES.md` · `EXECUTION-MODES.md` | `H-009` | `PT-088` |
| 7 | `PT-092` | CHORE | S2 | Ejecutar QA y FPGE | `QA/` · `ROADMAP.md` | `H-008` | los seis |

---

## 6. Análisis de solapamiento `[AGENTE]`   `FDGE-R40`

```
Pares que comparten archivos:
  PT-088 <-> PT-087   patrones.mjs                    -> SERIALIZADOS
  PT-088 <-> PT-089   verify-fdge.mjs                 -> SERIALIZADOS
  PT-088 <-> PT-090   verify-fdge.mjs · patrones.mjs  -> SERIALIZADOS
  PT-087 <-> PT-090   patrones.mjs                    -> SERIALIZADOS
  PT-087 <-> PT-091   patrones.mjs (via el generador) -> SERIALIZADOS
  PT-087 <-> PT-093   RULES.md                        -> SERIALIZADOS
  PT-089 <-> PT-091   tracker.mjs                     -> SERIALIZADOS

Orden de ejecución resultante:
  1. PT-088   2. PT-087   3. PT-089   4. PT-090   5. PT-091   6. PT-093   7. PT-092

Motivo del orden: dependencia técnica, no prioridad declarada.
```

**Por qué `PT-088` va antes que `PT-087`, y no al revés.** `PT-087` construye el mecanismo que
obliga a una comprobación a declarar qué hecho establece. `PT-088` escribe **tres comprobaciones
nuevas**. Si `PT-087` fuera primero, las tres nacerían bajo un mecanismo recién estrenado y sin un
solo caso real que lo hubiera ejercitado.

Al revés, las tres de `PT-088` son **el banco de pruebas** de `PT-087`: si el mecanismo no sabe
expresar qué mide `SUITE-R09`, el mecanismo está mal, y se sabe antes de imponerlo a 224 reglas.

Es la lección de `PT-085`, que midió `SUITE-R57` **antes** de escribirla y descubrió que la
definición ingenua daba 13 contra un umbral de 3 — un candado con la llave dentro.

**`PT-092` va último y solo.** `QA` y `FPGE` no comparten archivo con nadie, y ejecutarlos al
final significa ejecutarlos sobre el marco **ya corregido**: si se hicieran primero, sus hallazgos
serían sobre un árbol que este mismo lote está a punto de cambiar.

`EXEC-R08` · secuencial por defecto. Se declara también en `BACKLOG.md`.

---

## 7. Supuestos compartidos `[AGENTE]`   `FDGE-R41`

```
- El Acid Test de P-003 PASA hoy: las 20 reglas CHECK tienen verificador, cero excepciones.
  Si fuera falso, PT-088 dejaría de ser «tres reglas concretas» y pasaría a ser un rediseño.

- SUITE-R09 es mecánicamente comprobable: git sabe si los bytes anteriores de un append-only
  cambiaron. VERIFICADO en PT-088 PHASE 2 antes de escribir nada, no supuesto.

- SUITE-R06(e) cubre todo docs/methodology/, así que los siete tocan material reservado y
  ninguno es trabajo de paso. Es el motivo de que sea un lote y no siete tareas sueltas.

- El auditor de PTSA-2026-08-20 es el mismo agente que escribió buena parte del código
  auditado. Los nueve hallazgos tienen evidencia; qué hallazgos NO se buscaron no es
  contrastable desde dentro. PT-092 no lo resuelve — QA y FPGE los ejecuta el mismo agente.
```

---

## 8. Observaciones del agente `[AGENTE]`   `INTAKE-R07`

```
- PT que no encaja con el objetivo común:
    PT-092. Ejecutar QA y FPGE no cierra ninguna instancia del patrón del proxy: cierra TD-15.
    Entra porque H-008 es D1 y sale de la misma auditoría, y porque el objetivo común declarado
    es «lo que la auditoría encontró», no «el patrón del proxy». Si se quiere un lote más
    estrecho, PT-092 es el que sale.

- Solapamiento que hace inviable el orden propuesto:
    Ninguno. Siete pares comparten archivo y los siete quedan serializados. El riesgo real no
    es el solapamiento: es que patrones.mjs lo importan OCHO herramientas, así que cada cambio
    ahí obliga a la batería casi completa —669 de 1118 casos, 405 s, medido en PT-086—.
    Con cinco de los siete tocándolo, la batería parcial ahorrará poco en este lote. Se dice
    ahora para que no parezca una regresión de PT-086 cuando ocurra.

- Supuesto compartido que no está verificado:
    Que SUITE-R01 se pueda descomponer en obligaciones observables. Puede que no, y entonces la
    salida legítima es declararla NO_VERIFICABLE con motivo y firma en NO-VERIFICABLES.md, que
    es para lo que PT-078 dejó el mecanismo. PT-088 debe poder terminar por esa vía sin que
    cuente como fracaso, y su AC lo dirá explícitamente.

- Lote demasiado grande para una sola firma:
    Sí, en un sentido concreto. PT-093 pide una DECISIÓN de diseño sobre cómo se declara el
    límite de las compuertas, y PT-092 abre dos componentes enteros. Ninguno de los dos es
    ejecución mecánica bajo una firma previa: los dos van a devolver la pelota al firmante a
    mitad. Está declarado aquí en vez de descubrirse en PHASE 5.

- Lo que este lote NO arregla, y conviene saberlo al firmar:
    El techo de la certificación. Con H-002 y H-003 cerrados, D1 sube a 90 y el Health a ~93.
    Pero H-008 solo se cierra ejecutando QA y FPGE de verdad, y si esas dos ejecuciones
    encuentran lo que encontró PTSA —nueve hallazgos—, el score BAJA antes de subir.
    Eso no es un riesgo del lote: es el lote funcionando.
```

---

## 9. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-E1 objetivo común declarado                    [x]  §1
DoR-E2 criterio de éxito del lote declarado        [x]  §2, con la cifra y con por qué no es la cifra
DoR-E3 out-of-scope del lote declarado             [x]  §3, cinco salidas cerradas
DoR-E4 firma única presente                        [x]  §4, con su base y su límite declarados
DoR-E5 PTs enumerados con tipo y severidad         [x]  §5, siete
DoR-E6 solapamiento analizado                      [x]  §6, siete pares serializados
DoR-E7 supuestos compartidos declarados            [x]  §7, cuatro
DoR-E8 observaciones del agente                    [x]  §8, cinco y ninguna es «ninguna»
```

**`G1` RESUELTA — APROBADA.**

```
Resuelto por: Alberto Martínez
Fecha: 2026-08-20
Veredicto: APROBADO
```

> Base: *«adelante, tienes mi VoBo para hacer todo lo necesario y terminar con los pendientes,
> comenzar la épica y no parar hasta terminar»*. Constancia en
> [`SESSION_LOG.md`](../../docs/implementation/SESSION_LOG.md), con su límite declarado.
>
> El firmante delega además `G2` y `G3` **por lote** (`EXEC-R03`): se resuelven por tarea sin
> volver a preguntar. `G4` no se delega — es del lote y es suya.

---

## Cierre del lote   `SUITE-R45`

Lo que se resuelve **al cerrar**, y en ningun otro sitio: escrito como fila en cada tarea seria la
misma regla copiada siete veces, y las copias divergen (`SUITE-R38`).

| Que | Como se resuelve | Estado |
|:---|:---|:---|
| Entrada en `CHANGELOG.md` con guia de migracion | `SUITE-R19` · y esta vez **enumerando** las reglas nuevas, que es lo que `PT-087` arregla | **HECHO** · entrada `11.0.0` con las tres nuevas nombradas, y `sellar` lo comprueba |
| Numero de version | `MAJOR` si `PT-087` o `PT-088` introducen reglas `HARD` nuevas; `MINOR` si solo anaden verificadores a reglas que ya existian | **HECHO** · `11.0.0`. Entran verificadores que **pueden fallar** en proyectos que hoy pasan — el criterio con el que subio la `10.0.0` |
| `RIGE_DESDE` de toda regla nueva | `PT-081` · sin fila, rige hacia atras | **HECHO** · `SUITE-R09`, `EXEC-R04` y `EXEC-R04a` en `[11,0,0]`. `verify-suite` cazo la tercera en cuanto llego a `CORE` |
| Sello de la version | los ocho pasos de `tracker sellar`, con la bateria **completa** (`SUITE-R57`) | **HECHO** hasta el paso 6. Los pasos 7 y 8 —PR a `main` y tag— son del firmante |
| Segunda auditoria PTSA | `PTSA-R20` · el score caduca el **2026-09-20** | `PT-092` la dejo como `R-004` del `ROADMAP.md`, con su prioridad. **No se ejecuta aqui**: revalidar es una corrida entera, no un paso de cierre |
| `H-002`..`H-005`, `H-007`, `H-009` a `VALIDATION_PENDING` | con evidencia post-correccion observada (`PTSA-R39`) | **HECHO** · los seis, cada uno con su revision y su evidencia |
| `H-001` y `H-006`, ya corregidos | pendientes de que el firmante los valide y cierre | **HECHO** · `CLOSED` los dos. Y `INC-001` registra que este cierre **se perdio una vez** sin que nada avisara |
| `TD-15` · `TD-17` | retirados o actualizados con la decision tomada | **HECHO** · `TD-15` separa «no aplica» de «pendiente» y queda `FIDE`; `TD-17` sigue abierto con la decision de **no versionar** el grafo, y su coste medido |
| Lo que las tareas aplacen | cada `out-of-scope.md` cita un identificador que lo sostiene (`SUITE-R44`) | **HECHO** · siete `out-of-scope.md`, y lo aplazado vive en `ROADMAP.md` con `R-NNN` |
| `H-008` no se cierra | `QA` **no aplica** y `FIDE` sigue pendiente | **DECLARADO** en `PT-092` · `VALIDATION_PENDING`. Es lo unico del lote que no queda resuelto, y se dice |

## Lo que el lote no cerro, y por que

**`FIDE`.** Es el ultimo componente sin ejecutar y el **primer candidato del roadmap**. Necesita un
proyecto que incubar, e inventarlo para cerrar un numero seria justo lo que este lote combate.

**La segunda corrida de PTSA.** `EP-018` cambio siete de los nueve hallazgos, asi que el `Health`
79.9 ya no describe el arbol. Revalidar es una corrida entera y esta en `R-004`, no aqui.

**`INC-001`.** Nada comprueba que un cierre de PTSA siga cerrado. Reconstruido y registrado; el
arreglo es `R-005`, con la maxima `EvidenceWeight` porque su evidencia es un incidente observado.

**Ninguna fila se marca sin su evidencia.** Una celda vacia no pasa, por lo mismo que no pasa en
`SELLO.md` ni en `LAYOUT.md` (`FND-R22`).

---

## 10. Trazabilidad al origen

| Hallazgo | Dim | Sev | Estado en PTSA | PT |
|:---|:---|:---|:---|:---|
| [`H-001`](../../PTSA/Findings/H-001.md) | D2 | ALTA | **VALIDATION_PENDING** — corregido en la auditoría | — |
| [`H-002`](../../PTSA/Findings/H-002.md) | D1 | ALTA | OPEN | `PT-088` |
| [`H-003`](../../PTSA/Findings/H-003.md) | D1 | ALTA | OPEN | `PT-087` |
| [`H-004`](../../PTSA/Findings/H-004.md) | D3 | MEDIA | OPEN | `PT-089` |
| [`H-005`](../../PTSA/Findings/H-005.md) | D2 | MEDIA | OPEN | `PT-090` |
| [`H-006`](../../PTSA/Findings/H-006.md) | D4 | BAJA | **VALIDATION_PENDING** — corregido en la auditoría | `PT-091` (la causa) |
| [`H-007`](../../PTSA/Findings/H-007.md) | D4 | MEDIA | OPEN | `PT-091` |
| [`H-008`](../../PTSA/Findings/H-008.md) | D1 | MEDIA | IN_REVIEW | `PT-092` |
| [`H-009`](../../PTSA/Findings/H-009.md) | D1 | MEDIA | OPEN | `PT-093` |

**Ningún hallazgo se cierra al cerrar su PT.** `PTSA-R44`: los de tipo `BUG` y `DOMAIN` los valida
y cierra una persona, y `PTSA-R39` exige evidencia post-corrección observada en la fuente real.
El lote los deja en `VALIDATION_PENDING` con su evidencia; el cierre es un acto aparte.

Auditoría de origen: [`PTSA/RESUMEN.md`](../../PTSA/RESUMEN.md) · `PTSA-2026-08-20` ·
Health 79.9 · Risk 73 · Confidence 0.94 · coverage 0.89 · certificación **B**.
