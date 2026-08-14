# Intake — LOTE `EP-002` · GitHub responde qué va cuándo

> Creado desde `INTAKE/templates/EPIC-INTAKE.md` (`INTAKE-R09`).

---

```yaml
---
id: EP-002
created: 2026-08-13
status: CLOSED
mode: SUPERVISED
origin: DIRECT
---
```

---

## 1. Objetivo común `[HUMANO]` — obligatorio

```
«ésta reapertura confirma aún más que necesitas usar github, así podemos usarlo hasta de
máquina de estados para saber qué va cuándo»

El estado del trabajo vive en REGISTRY.json, y para leerlo hay que abrir el repositorio. La
plataforma responde hoy «qué está abierto» y nada más: no dice en qué fase está cada cosa ni
qué compuerta espera a quién. Lo demostró EP-001 al reabrirse — PT-005 apareció en un job de
CI que nadie estaba mirando, y el estado real estuvo un rato fuera del registro.

Las tres tareas comparten esa causa: la plataforma sabe menos de lo que el repositorio sabe, y
por eso hay que abrir el repositorio para saber qué toca.
```

## 2. Criterio de éxito del lote `[HUMANO]` — obligatorio

```
Que mirando el tablero de GitHub se pueda responder «qué va cuándo» —qué fase, qué compuerta,
a quién espera— sin abrir el repositorio; que lo que el humano escriba en un issue no pueda
quedar sin leer; y que el contrato de la plataforma esté enunciado donde manda y no donde se
procedimenta.

Y una condición que no es negociable, porque es la avería que la v4 nació para eliminar: el
registro sigue ASIGNANDO y GitHub sigue ESPEJANDO (SUITE-R08, SUITE-R35). El estado que se
publique en la plataforma se DERIVA del registro. Si se pudiera editar allí habría dos fuentes
divergiendo.
```

## 3. Qué NO entra en el lote `[HUMANO]` — obligatorio

```
OUT: quitar los .md del repositorio. El diagnóstico se aceptó el 2026-08-13: verify-fdge lee
     archivos, un issue no está versionado, y declarar plataforma es opcional
OUT: que el estado se pueda cambiar desde GitHub. La plataforma espeja; no asigna
OUT: milestones. PT-003 los descartó con evidencia: cero en toda la historia, y darían a un
     EP dos representaciones del mismo hecho
OUT: el adaptador de Azure DevOps
OUT: fusionar a main y publicar en npm — G4 y la publicación son actos humanos (SUITE-R06a,
     EXEC-R04), y ninguna delegación los cubre
```

## 4. Firma única `[HUMANO]` — obligatorio

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-13
He leído el Intake de cada PT listado en §5 y confirmo que todos reflejan mi intención: SÍ
```

### Constancia de cómo se escribió esta firma   `INTAKE-R06` · `SUITE-R27`

**Este bloque lo escribió el agente.** Autorización humana explícita del 2026-08-13: «toma mi
VoBo y firma a mi nombre para que avances de forma automática».

```
Alcance:      la firma única de EP-002, la severidad de sus tres tareas, y G2 de cada una.
Qué NO cubre: G4 y la publicación en npm. SUITE-R06 es la lista cerrada de lo que ningún
              modo automatiza, y EXEC-R04 dice que G4 es humana en los TRES modos sin
              excepción. Una delegación que cubriera G4 dejaría al marco sin la única
              compuerta que protege lo irreversible.
              G3 de un BUG tampoco (SUITE-R06b) — en este lote no hay ninguno.
```

---

# A partir de aquí lo completa el agente

## 5. PTs que componen el lote `[AGENTE]`

| Orden | PT | Tipo | Sev | Título | Archivos que toca | Depende de |
|:--|:--|:--|:--|:--|:--|:--|
| 1 | PT-006 | CHORE | S3 | El contrato vuelve a su regla | `RULES.md` · `PHASES.md` · `verify-fdge.mjs` · `tracker.mjs` · `selftest.sh` | — |
| 2 | PT-007 | FEATURE | S3 | El issue lleva la fase y la compuerta | `tracker.mjs` · `selftest.sh` | PT-006 |
| 3 | PT-008 | FEATURE | S2 | No se cierra fase con comentarios sin responder | `tracker.mjs` · `verify-fdge.mjs` · `RULES.md` · `selftest.sh` | PT-007 |

Severidad declarada por la misma delegación. `S2` para `PT-008` porque es el único que ataca
una pérdida de información ya ocurrida —comentarios humanos que nadie relee—; `S3` para los
otros dos, que mejoran la lectura del estado sin que hoy se pierda nada.

`G3` de las tres es **automática**: ninguna es `BUG`, y `SUPERVISED` la resuelve sola cuando se
cumplen las condiciones de `EXEC §5.2`. No hace falta delegación para eso.

## 6. Análisis de solapamiento `[AGENTE]` — obligatorio

```
Pares que comparten archivos:
  PT-006 ↔ PT-007   tracker.mjs · selftest.sh          → SERIALIZADOS
  PT-006 ↔ PT-008   verify-fdge.mjs · RULES.md · selftest.sh → SERIALIZADOS
  PT-007 ↔ PT-008   tracker.mjs · selftest.sh          → SERIALIZADOS

Orden de ejecución resultante:
  1. PT-006   2. PT-007   3. PT-008

Motivo: los tres tocan tracker.mjs o verify-fdge.mjs, así que van en serie por solapamiento.
El orden dentro de la serie es por dependencia: PT-006 deja el contrato dicho donde manda —y
es lo que PT-007 y PT-008 espejan—; PT-008 va al final porque necesita que el issue ya lleve
estado para saber contra qué comparar un comentario.
```

## 7. Supuestos compartidos `[AGENTE]`

```
- El registro sigue siendo el único asignador. Todo lo que se publique en GitHub se DERIVA de
  REGISTRY.json; nada se lee de vuelta como fuente.
- `gh` sigue disponible donde la credencial es exigible. Si no, el espejo sale con código 3 y
  se declara SIN EVALUAR, que es lo que PT-001 dejó montado.
- Las etiquetas de la plataforma son escribibles por `tracker abrir`. Se comprobó en EP-001:
  las crea si faltan.
```

## 8. Observaciones del agente `[AGENTE]` — obligatorio

```
- PT que no encaja con el objetivo común: ninguno.

- Solapamiento que hace inviable el orden: ninguno. Los tres en serie.

- DESAFÍO AL ALCANCE, y es el importante: PT-006 añade una regla vinculante a RULES.md. Eso
  no es «capacidad añadida»: cambia lo que un proyecto debe tener para cumplir G4, que es el
  criterio con el que la 5.0.0 subió a MAJOR. La versión de este lote no puede ser MINOR.
  Queda declarado aquí y decidido en el cierre, no de paso.

- SUPUESTO NO VERIFICADO: que `gh issue view --json comments` devuelva también los comentarios
  de un issue con muchos. No se ha probado con más de una decena. PT-008 depende de ello.

- Lote demasiado grande para una sola firma: no. Tres tareas, una TRIVIAL y dos STANDARD.
```

## 9. Resultado de la compuerta G1 `[AGENTE]`

```
DoR-E1 objetivo común declarado                    [x]
DoR-E2 criterio de éxito del lote declarado        [x]
DoR-E3 out-of-scope del lote declarado             [x]
DoR-E4 firma única presente                        [x]  por delegación, con constancia
DoR-E5 EP asignado desde REGISTRY.json             [x]  EP-002 · counters EP 1→2 · PT 5→8
DoR-E6 todos los PTs listados tienen su intake completo y firmado por lote  [x]
DoR-E7 solapamiento calculado y declarado en BACKLOG.md                     [x]
DoR-E8 observaciones registradas                   [x]

VEREDICTO: PASS
```

---

## Cierre del lote

`EP-002` pasa a `CLOSED` cuando sus tres PTs están `INTEGRATED`/`CLOSED`.

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
