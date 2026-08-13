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

> **CONFIRMADO** por Alberto Martínez el 2026-08-13: «te confirmo lo que indicas».
> Transcrito por el agente citando la sesión; la intención la declara el humano (`FDGE-R02`).

```
«lo más importante es resolver la exigencia de seguir el marco de trabajo al pie de la letra»

Las tres tareas comparten una sola causa: hay reglas de este marco que se enuncian como
vinculantes y que ninguna compuerta puede hacer cumplir. No se hacen juntas por comodidad —
se hacen juntas porque arreglar una sin las otras deja el mismo informe en verde diciendo
que no queda nada por arreglar.
```

---

## 2. Criterio de éxito del lote `[HUMANO]` — obligatorio

> **CONFIRMADO** por Alberto Martínez el 2026-08-13.

```
Que abrir trabajo sin dejar rastro consultable deje de ser posible sin que salte una
compuerta, y que el marco publique cuánta de su propia letra puede sostener con una máquina
y cuánta descansa en que una persona la lea. Ninguna de las dos cosas se consigue con una
sola de las tres tareas.
```

---

## 3. Qué NO entra en el lote `[HUMANO]` — obligatorio

> **CONFIRMADO** por Alberto Martínez el 2026-08-13.

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

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-13
He leído el Intake de cada PT listado en §5 y confirmo que todos reflejan mi intención: SÍ
```

### Constancia de cómo se escribió esta firma   `INTAKE-R06` · `SUITE-R27`

**Este bloque lo escribió el agente, no la persona que firma.** `INTAKE-R06` lo prohíbe; la
prohibición se levantó por autorización humana explícita, y la regla de cumplimiento admite
la excepción **siempre que quede registro de ella**. Este es el registro.

```
Autorizado por:  Alberto Martínez
Fecha:           2026-08-13
Cita literal:    «te autorizo a que firmes a mi nombre»
Alcance:         la firma única de EP-001 y la severidad de sus tareas (INTAKE-R04),
                 declaradas en la misma autorización: «usa la severidad necesaria para
                 que comiences en cada PT»
Qué NO cubre:    ninguna otra compuerta. G2, G3 y G4 siguen siendo actos humanos, y G4
                 sin excepción en los tres modos (EXEC-R04, SUITE-R06a).
```

`SUITE-R27` ya dice qué prueba una firma: no es una prueba criptográfica, porque el agente
escribe el archivo y podría escribir cualquier nombre. Lo que la sostiene es que el nombre
esté en `firmantes:` —Alberto Martínez lo está— y que quien aparece responde de lo que lleva
su nombre. Esta constancia añade lo único que faltaba para que la afirmación sea contrastable:
**quién movió la mano**.

> **Hueco detectado al escribir esto.** El marco no tiene forma de representar una firma
> delegada: o el agente escribe el bloque como si lo hubiera escrito la persona, o se
> detiene. No hay tercera opción prevista, y la que se ha usado aquí —firmar y adjuntar la
> constancia— es una convención inventada en esta sesión, no una regla. Queda fuera del
> alcance de este lote (§3) y anotado para decidirlo aparte.

---

---

# A partir de aquí lo completa el agente

## 5. PTs que componen el lote `[AGENTE]`

| Orden | PT | Tipo | Sev | Título | Archivos que toca | Depende de |
|:--|:--|:--|:--|:--|:--|:--|
| 1 | PT-004 | BUG | S2 | La compuerta no distingue la fase | `docs/methodology/tools/verify-fdge.mjs` · `docs/methodology/tools/selftest.sh` | — |
| 2 | PT-001 | BUG | S2 | El espejo entra en las compuertas | `docs/methodology/tools/verify-fdge.mjs` · `package.json` · `.github/workflows/verificacion.yml` · `docs/methodology/tools/selftest.sh` | PT-004 |
| 3 | PT-002 | BUG | S3 | Cobertura mecánica por regla, con su número | `docs/methodology/tools/audit.mjs` · `docs/methodology/tools/selftest.sh` | — |
| 4 | PT-003 | INVESTIGATION | S3 | El contrato de la plataforma: implementar o recortar | ninguno (`FDGE-R10`: una investigación no produce código) | PT-001 |

`Sev` declarada por **delegación explícita** el 2026-08-13 —«usa la severidad necesaria para
que comiences en cada PT»— y no por criterio del agente, que no la inventa (`INTAKE-R04`).
Criterio aplicado: `S2` para lo que degrada un flujo crítico con workaround —el espejo se
puede correr a mano; la compuerta roja se puede ignorar a mano—, `S3` para lo que sigue
cadencia normal. Ninguna es `S1`: nada de esto es sistema caído, y `S1` habilitaría el track
`HOTFIX`, que no corresponde.

`Archivos` sale de `tasks.md` de cada PT, que se escribe en `PHASE 4`.

`Archivos` sale de `tasks.md` de cada PT, que no existe todavía (se escribe en `PHASE 4`).
Lo de arriba es la previsión declarada en este Intake y es lo que hace computable el
solapamiento ahora (`FDGE-R40`); si `PHASE 4` la contradice, el solapamiento se recalcula.

## 6. Análisis de solapamiento `[AGENTE]` — obligatorio

```
Pares que comparten archivos:
  PT-004 ↔ PT-001   verify-fdge.mjs · selftest.sh   → SERIALIZADOS
  PT-004 ↔ PT-002   selftest.sh                     → SERIALIZADOS
  PT-001 ↔ PT-002   selftest.sh                     → SERIALIZADOS
  PT-003            no toca ningún archivo          → sin solapamiento

Orden de ejecución resultante:
  1. PT-004
  2. PT-001
  3. PT-002
  4. PT-003

Motivo del orden:
  PT-004 primero por dependencia de compuerta, no por solapamiento: mientras la compuerta
  esté roja por un motivo ajeno a las demás tareas, ninguna de ellas puede demostrar que la
  dejó verde, y las tres se ejecutarían con el mismo rojo de fondo.
  PT-001 después: comparte verify-fdge.mjs con PT-004 y añade la comprobación del espejo
  sobre un verificador que ya distingue la fase.
  PT-002 tercero: solapa solo en selftest.sh.
  PT-003 al final: decide sobre el contrato que PT-001 acaba de volver exigible. Decidirlo
  antes sería decidir sobre un contrato que nadie comprueba.
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

- Lote demasiado grande para una sola firma: no. Cuatro tareas, tres de ellas TRIVIAL.

- PT-004 no estaba previsto: apareció al EJECUTAR PHASE 1, cuando verify-fdge falló sobre
  los tres primeros PTs por exigirles artefactos de fases que aún no habían alcanzado. Se
  incorpora al lote por orden humana del 2026-08-13 y no por decisión del agente. Encaja
  con el objetivo común —una compuerta que no distingue trabajo correcto de trabajo
  incompleto es otra forma de regla que no se puede hacer cumplir— y pasa a ser la primera
  del orden.

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
DoR-E1 objetivo común declarado                    [x]  confirmado 2026-08-13
DoR-E2 criterio de éxito del lote declarado        [x]  confirmado 2026-08-13
DoR-E3 out-of-scope del lote declarado             [x]  confirmado 2026-08-13
DoR-E4 firma única presente                        [x]  firmada por delegación, con constancia
DoR-E5 EP asignado desde REGISTRY.json             [x]  EP-001, counters EP 0→1 · PT 0→4
DoR-E6 todos los PTs listados tienen su intake completo y firmado por lote  [x]  los cuatro
DoR-E7 solapamiento calculado y declarado en BACKLOG.md                     [x]
DoR-E8 observaciones registradas                   [x]

VEREDICTO: PASS

Resuelto el 2026-08-13 con las tres declaraciones humanas que faltaban:
  1. severidad de las cuatro tareas (INTAKE-R04), por delegación explícita
  2. firma única (INTAKE-R06), por delegación explícita y con constancia en §4
  3. confirmación de §1, §2 y §3

Y con la incorporación de PT-004, que el humano ordenó admitir en el lote —«el bloqueo entra
como cuarta tarea»— tras aparecer al ejecutar PHASE 1.

EP-001 pasa a IN_PROGRESS. Las tareas pasan a READY. Arranca PT-004 en PHASE 2.

CHALLENGE aceptado por:      (no aplica: el veredicto fue PASS)
```

---

## Cierre del lote

`EP-001` pasa a `CLOSED` cuando sus tres PTs están `INTEGRATED`/`CLOSED` o fueron retirados
explícitamente, con entrada propia en `HISTORY.log`. Si un PT se bloquea, el lote entero se
detiene (`FDGE-R41`).

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
