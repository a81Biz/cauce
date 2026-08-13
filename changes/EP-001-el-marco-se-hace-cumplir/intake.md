# Intake — LOTE `EP-001` · El marco se hace cumplir a sí mismo

> Creado desde `INTAKE/templates/EPIC-INTAKE.md` (`INTAKE-R09`).
> Reglas: [RULES.md](../../docs/methodology/RULES.md) · Compuertas: [EXECUTION-MODES.md](../../docs/methodology/EXECUTION-MODES.md) §7

---

```yaml
---
id: EP-001
created: 2026-08-13
status: DRAFT
mode: SUPERVISED
origin: DIRECT
---
```

---

## 1. Objetivo común `[HUMANO]` — obligatorio

> **TRANSCRIPCIÓN PENDIENTE DE CONFIRMACIÓN.** El agente no declara la intención, la expande
> (`FDGE-R02`). Lo de abajo es la cita literal de la sesión del 2026-08-13; confírmala o
> corrígela antes de firmar.

```
«lo más importante es resolver la exigencia de seguir el marco de trabajo al pie de la letra»

Las tres tareas comparten una sola causa: hay reglas de este marco que se enuncian como
vinculantes y que ninguna compuerta puede hacer cumplir. No se hacen juntas por comodidad —
se hacen juntas porque arreglar una sin las otras deja el mismo informe en verde diciendo
que no queda nada por arreglar.
```

---

## 2. Criterio de éxito del lote `[HUMANO]` — obligatorio

> **TRANSCRIPCIÓN PENDIENTE DE CONFIRMACIÓN.**

```
Que abrir trabajo sin dejar rastro consultable deje de ser posible sin que salte una
compuerta, y que el marco publique cuánta de su propia letra puede sostener con una máquina
y cuánta descansa en que una persona la lea. Ninguna de las dos cosas se consigue con una
sola de las tres tareas.
```

---

## 3. Qué NO entra en el lote `[HUMANO]` — obligatorio

> **TRANSCRIPCIÓN PENDIENTE DE CONFIRMACIÓN.**

```
OUT: la migración del proyecto «Inteligencia de Mercados Energéticos Mexicanos» — es la
     implementación siguiente, y se ejecuta bajo las compuertas que este lote instala
OUT: los defectos de migración medidos el 2026-08-13 (el filtro de miembros de lote, el
     tramo 4.12→5.x, el informe de comparación) — misma razón
OUT: escribir un verificador para las 63 reglas HARD que hoy no tienen ninguno. Este lote
     las CUENTA y las publica; convertirlas en script es otro trabajo y otra decisión
OUT: publicar una versión nueva del paquete
OUT: TD-01, TD-02, TD-04, TD-06 y el borrado de origin/desarrollo
```

---

## 4. Firma única `[HUMANO]` — obligatorio

Cubre los Intakes de **todos** los PTs listados en §5 (`INTAKE-R08`).

El agente **no puede** escribir este bloque (`INTAKE-R06`). Está vacío a propósito.

```
Solicitado por:
Fecha:
He leído el Intake de cada PT listado en §5 y confirmo que todos reflejan mi intención: SÍ
```

---

---

# A partir de aquí lo completa el agente

## 5. PTs que componen el lote `[AGENTE]`

| Orden | PT | Tipo | Sev | Título | Archivos que toca | Depende de |
|:--|:--|:--|:--|:--|:--|:--|
| 1 | PT-001 | BUG | *pendiente* | El espejo entra en las compuertas | `docs/methodology/tools/verify-fdge.mjs` · `package.json` · `.github/workflows/verificacion.yml` · `docs/methodology/tools/selftest.sh` | — |
| 2 | PT-002 | BUG | *pendiente* | Cobertura mecánica por regla, con su número | `docs/methodology/tools/audit.mjs` · `docs/methodology/tools/selftest.sh` | — |
| 3 | PT-003 | INVESTIGATION | *pendiente* | El contrato de la plataforma: implementar o recortar | ninguno (`FDGE-R10`: una investigación no produce código) | PT-001 |

`Sev` está **pendiente**: la severidad la declara el humano (`INTAKE-R04`, `FDGE-R04`) y el
agente no la inventa. Es uno de los dos campos que bloquean `G1`.

`Archivos` sale de `tasks.md` de cada PT, que no existe todavía (se escribe en `PHASE 4`).
Lo de arriba es la previsión declarada en este Intake y es lo que hace computable el
solapamiento ahora (`FDGE-R40`); si `PHASE 4` la contradice, el solapamiento se recalcula.

## 6. Análisis de solapamiento `[AGENTE]` — obligatorio

```
Pares que comparten archivos:
  PT-001 ↔ PT-002   (docs/methodology/tools/selftest.sh)   → SERIALIZADOS
  PT-003            no toca ningún archivo                 → sin solapamiento

Orden de ejecución resultante:
  1. PT-001
  2. PT-002
  3. PT-003

Motivo del orden: solapamiento en selftest.sh entre 1 y 2 (ambos añaden casos a la misma
batería). PT-003 va al final por dependencia técnica: su decisión es sobre el contrato que
PT-001 acaba de volver exigible, y decidirlo antes sería decidir sobre un contrato que nadie
comprueba.
```

Declarado también en [BACKLOG.md](../../docs/implementation/BACKLOG.md) (`FDGE-R40`).
Ejecución **secuencial** (`EXEC-R08`).

## 7. Supuestos compartidos `[AGENTE]`

```
- El remoto GitHub a81Biz/cauce y el token de `gh` siguen disponibles en CI. Si no, el
  espejo no se puede comprobar donde importa y PT-001 pierde su compuerta.
- `REGISTRY.tracker.plataforma` sigue siendo `github`. Con la clave ausente, tracker sale
  con código 2 («sin plataforma configurada») y hay que decidir si eso es fallo o exención.
- Las 15 herramientas de tools/ se mantienen como el único lugar donde vive la
  comprobación mecánica. Si aparece una comprobación fuera de ahí, la cuenta de PT-002
  deja de ser cierta el día que se escriba.
```

## 8. Observaciones del agente `[AGENTE]` — obligatorio

Desafíos al lote (`INTAKE-R07`).

```
- PT que no encaja con el objetivo común: ninguno.

- Solapamiento que hace inviable el orden propuesto: ninguno.

- Supuesto compartido que no está verificado: el acceso de `gh` en CI. Verificado en local
  (autenticado como a81Biz); en el runner depende de un token que este Intake no ha visto.
  PT-001 tiene que declarar qué hace el verificador cuando no hay credencial: fallar o
  exentarse. Fallar por falta de token convierte la compuerta en un rojo permanente, y una
  compuerta siempre roja enseña a saltársela — es literalmente el motivo por el que existe
  SECRETOS-EXCEPCIONES.md.

- Lote demasiado grande para una sola firma: no. Tres tareas, dos de ellas TRIVIAL.

- DESAFÍO AL ALCANCE: PT-002 mide y publica; no arregla. Publicar «82 de 134» puede leerse
  como que el marco reconoce estar a medias. Lo es, y `SUITE-R26` ya lo admite al decir que
  una regla HARD «aspira» a comprobación mecánica. Pero conviene que quien firma sepa que
  el número va a ser público en la salida de la herramienta.

- OBSERVACIÓN SOBRE ESTE MISMO ARCHIVO: no he podido escribir en prosa los identificadores
  de las tareas de la implementación siguiente, ni citar como precedente ninguna tarea
  ajena al lote. El lector de miembros de `INTAKE-R08` recorre TODO el texto del intake del
  lote, así que cualquier identificador mencionado aquí se convierte en miembro y dispara un
  fallo. La consecuencia es que este Intake está escrito sin referencias cruzadas, que es
  justo lo que da trazabilidad. El defecto queda registrado como evidencia de primera mano;
  su corrección está en el out-of-scope §3 porque pertenece a la implementación siguiente.
```

## 9. Resultado de la compuerta G1 `[AGENTE]`

```
DoR-E1 objetivo común declarado                    [~]  transcrito, sin confirmar
DoR-E2 criterio de éxito del lote declarado        [~]  transcrito, sin confirmar
DoR-E3 out-of-scope del lote declarado             [~]  transcrito, sin confirmar
DoR-E4 firma única presente                        [ ]  AUSENTE — INTAKE-R06
DoR-E5 EP asignado desde REGISTRY.json             [x]  EP-001, counters EP 0→1
DoR-E6 todos los PTs listados tienen su intake completo y firmado por lote  [x]
DoR-E7 solapamiento calculado y declarado en BACKLOG.md                     [x]
DoR-E8 observaciones registradas                   [x]

VEREDICTO: FAIL
Motivo: faltan dos campos que solo puede declarar una persona:
  1. la severidad de PT-001, PT-002 y PT-003 (INTAKE-R04) — §5, columna Sev
  2. la firma única (INTAKE-R06) — §4, bloque vacío
Y tres transcripciones (§1, §2, §3) pendientes de confirmación o corrección: las escribió
el agente citando la sesión, y el humano declara la intención (FDGE-R02).

El lote permanece en DRAFT. No avanza a PHASE 2 (FDGE-R01, FDGE-R05).

CHALLENGE aceptado por:
```

---

## Cierre del lote

`EP-001` pasa a `CLOSED` cuando sus tres PTs están `INTEGRATED`/`CLOSED` o fueron retirados
explícitamente, con entrada propia en `HISTORY.log`. Si un PT se bloquea, el lote entero se
detiene (`FDGE-R41`).

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
