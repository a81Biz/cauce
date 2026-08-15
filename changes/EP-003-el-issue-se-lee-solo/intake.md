# Intake — LOTE `EP-003` · El issue se lee sin salir de GitHub

```yaml
---
id: EP-003
created: 2026-08-13
status: CLOSED
mode: SUPERVISED
origin: DIRECT
---
```

---

## 1. Objetivo común `[HUMANO]` — obligatorio

```
«estoy viendo en los issue que no hay nada de la EP-002»
«ya debes usar github como se planteó en el EP-002, sin excusas ni pretextos»

EP-002 puso el ESTADO en GitHub —fase y compuerta— y dio por hecho que el contenido se
alcanzaba desde el issue. No se alcanza: el enlace del cuerpo es relativo y en el cuerpo de
un issue eso es un 404. El issue de una implementación dice además «sin implementación»
sobre sí mismo.

Y la herramienta que escribe en la plataforma no firma lo que escribe, así que la regla que
EP-002 creó para no perder lo que una persona dice acusa al mensaje de cierre del propio
tracker de ser humano. verify-fdge está en rojo por eso ahora mismo.

Las tres son la misma causa: cómo tracker escribe en la plataforma.
```

## 2. Criterio de éxito del lote `[HUMANO]` — obligatorio

```
Que abrir un issue de este repositorio baste para entender de qué va y llegar a lo demás sin
adivinar rutas, y que verify-fdge vuelva a verde por el motivo correcto: porque la herramienta
firma lo que escribe, no porque se haya relajado la regla.
```

## 3. Qué NO entra en el lote `[HUMANO]` — obligatorio

```
OUT: copiar el intake al issue. SUITE-R35 lo prohíbe y el diagnóstico se aceptó el 2026-08-13
OUT: relajar SUITE-R43 para que el mensaje de cierre no cuente. Se arregla quien escribe, no
     la regla que lo detecta
OUT: quitar los .md del repositorio
OUT: publicar en npm y cualquier merge a main
```

## 4. Firma única `[HUMANO]` — obligatorio

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-13
He leído el Intake de cada PT listado en §5 y confirmo que todos reflejan mi intención: SÍ
```

### Constancia de cómo se escribió esta firma   `INTAKE-R06` · `SUITE-R27`

**Este bloque lo escribió el agente.** Autorización humana del 2026-08-13: «vamos a EP-003 pero
entonces ya debes usar github como se planteó en el EP-002», sobre la delegación permanente
declarada al abrir `EP-002` («toma mi VoBo y firma a mi nombre»).

```
Alcance:      la firma única de EP-003, la severidad de sus dos tareas, y G2 de cada una.
Qué NO cubre: G4 y la publicación. SUITE-R06 es la lista cerrada que ningún modo automatiza y
              EXEC-R04 no admite excepción en ninguno de los tres modos.
              G3 de un BUG tampoco (SUITE-R06b) — y las dos tareas de este lote SON BUG, así
              que sus G3 son humanas. No hay G3 automática aquí.
```

---

# A partir de aquí lo completa el agente

## 5. PTs que componen el lote `[AGENTE]`

| Orden | PT | Tipo | Sev | Título | Archivos que toca | Depende de |
|:--|:--|:--|:--|:--|:--|:--|
| 1 | PT-009 | BUG | S2 | `tracker` firma lo que escribe | `tracker.mjs` · `selftest.sh` | — |
| 2 | PT-010 | BUG | S2 | El cuerpo del issue se lee y su enlace resuelve | `tracker.mjs` · `selftest.sh` | PT-009 |

Las dos `S2`: una tiene la compuerta en rojo **ahora**, y la otra hace ilegible el tablero que
`EP-002` acababa de construir. Ninguna es `S1`: nada está caído.

**`G3` de las dos es humana.** Son `BUG` y `SUITE-R06b` no lo automatiza ningún modo. Es la
diferencia con `EP-002`, donde las tres eran `FEATURE`/`CHORE` y `G3` salió automática.

## 6. Análisis de solapamiento `[AGENTE]` — obligatorio

```
PT-009 ↔ PT-010   tracker.mjs · selftest.sh   → SERIALIZADOS

Orden:  1. PT-009   2. PT-010

Motivo: PT-009 pone la compuerta en verde y es de una línea; dejar el rojo mientras se trabaja
en lo otro obliga a leer cada verificación preguntándose si el error es el viejo o uno nuevo.
```

## 7. Supuestos compartidos `[AGENTE]`

```
- La URL del repositorio se puede derivar del remoto. Si no, el enlace absoluto no se puede
  construir y hay que decidir qué se escribe — no inventarlo.
- Los issues ya cerrados no se reescriben: lo que se arregla es lo que se escriba a partir de
  ahora, más una sincronización explícita de los cuerpos que sigan abiertos.
```

## 8. Observaciones del agente `[AGENTE]` — obligatorio

```
- OBSERVACIÓN SOBRE ESTE MISMO LOTE: sus dos issues nacerán con el cuerpo defectuoso, porque
  el generador se arregla dentro del lote. Es inevitable y se declara: PT-010 incluye
  sincronizar los cuerpos abiertos, así que se curan solos al terminar.

- El defecto de PT-009 lo cazó SUITE-R43, la regla que PT-008 creó, sobre la herramienta que
  la implementa, en la primera ejecución posterior. Nadie lo buscó.

- Los dos defectos de PT-010 los vio una persona mirando el tablero. Ninguna comprobación los
  habría detectado: no hay nada que compruebe que un enlace resuelve ni que un texto no se
  contradice. Queda como límite conocido, no como tarea de este lote.

- Lote demasiado grande para una sola firma: no. Dos tareas, una TRIVIAL.
```

## 9. Resultado de la compuerta G1 `[AGENTE]`

```
DoR-E1 objetivo común declarado                    [x]
DoR-E2 criterio de éxito del lote declarado        [x]
DoR-E3 out-of-scope del lote declarado             [x]
DoR-E4 firma única presente                        [x]  por delegación, con constancia
DoR-E5 EP asignado desde REGISTRY.json             [x]  EP-003 · counters EP 2→3 · PT 8→10
DoR-E6 todos los PTs listados tienen su intake completo y firmado por lote  [x]
DoR-E7 solapamiento calculado y declarado en BACKLOG.md                     [x]
DoR-E8 observaciones registradas                   [x]

VEREDICTO: PASS
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).

### Revisión 1 — 2026-08-13 · la delegación se amplía a `G3`

**Qué cambia.** La constancia de §4 declaraba: «`G3` de un BUG tampoco (`SUITE-R06b`) — y las dos
tareas de este lote **SON** BUG, así que sus `G3` son humanas». Deja de ser cierto por decisión
del firmante.

**Autorización**, del 2026-08-13, después de que el agente señalara la restricción:

> «te doy mi VoBo y firma a mi nombre lo necesario, deja todo en la rama de trabajo para hacer
> el merge a main y después publicar completo»

**Cómo se sostiene.** `SUITE-R06b` pone el cierre de un `BUG` en la lista de lo que ningún
**modo de ejecución** automatiza. Esto no es un modo de ejecución decidiendo solo: es una
persona autorizando una excepción, que es lo que la regla de cumplimiento admite —
«hasta que un humano autorice la excepción **dejando registro de esa autorización**». Este es
el registro.

**Qué sigue sin cubrir, y no por prudencia.** `G4` y la publicación. El propio firmante se las
reserva en la misma frase, y son lo que `EXEC-R04` declara humano en los tres modos sin
excepción: ahí la firma **es** el acto irreversible, no la declaración de quién decidió.

**Lo que esto cuesta, dicho claro.** `G3` existe para que alguien mire la evidencia antes de dar
un defecto por resuelto. Firmada por delegación, lo que queda es que la evidencia **está
escrita y es contrastable** —`evidence/PT-009/` y `evidence/PT-010/`, con sus self-review y sus
límites declarados—, no que alguien la haya leído. Es exactamente lo que `SUITE-R27` dice de
una firma, y conviene no leerla como más de lo que es.
