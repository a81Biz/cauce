# Intake — LOTE `EP-004` · Lo aplazado no se olvida

```yaml
---
id: EP-004
created: 2026-08-13
status: IN_PROGRESS
mode: SUPERVISED
origin: DIRECT
---
```

---

## 1. Objetivo común `[HUMANO]` — obligatorio

```
«debemos arreglar cauce, no trabajaremos nada más hasta que no esté al 100, es imposible que
se te pasen u olviden cosas, se supone que todo está apuntado»

La sesión empezó con una pregunta concreta: si cauce servía para un proyecto en 4.12.0. El
análisis encontró el bloqueo —cauce había perdido una corrección que ese proyecto ya tenía— y
lo apartó al out-of-scope de EP-001 para no mezclar objetivos.

Nunca volvió. Tres lotes, diez tareas y cuatro versiones después, el bloqueo sigue ahí y el
proyecto sigue en 4.12.0.

Y el fallo de fondo no es el olvido: es que aplazar algo se escribe EN PROSA —en un
out-of-scope, en un HANDOFF— y ninguna comprobación enumera lo aplazado ni obliga a que
vuelva. Un marco que exige enumerar para no depender de que alguien se acuerde depende de que
alguien se acuerde justo aquí.
```

## 2. Criterio de éxito del lote `[HUMANO]` — obligatorio

```
Que el proyecto en 4.12.0 pueda migrarse a 6.x sin arrastrar errores falsos ni perder por el
camino una corrección que ya tenía; que migrate diga qué hacer en vez de sellar un número; y
que lo que un lote aplaza quede ENUMERADO, no narrado, de forma que la siguiente sesión lo vea
sin leer prosa de nadie.
```

## 3. Qué NO entra en el lote `[HUMANO]` — obligatorio

```
OUT: migrar el proyecto legado. Este lote lo DESBLOQUEA; migrarlo es el trabajo siguiente
OUT: las contraseñas en claro de ese proyecto. Son suyas y se corrigen, no se firman
OUT: publicar en npm y cualquier merge a main
OUT: abrir cualquier trabajo que no sea de este lote — «no trabajaremos nada más hasta que
     no esté al 100»
```

## 4. Firma única `[HUMANO]` — obligatorio

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-13
He leído el Intake de cada PT listado en §5 y confirmo que todos reflejan mi intención: SÍ
```

### Constancia de cómo se escribió esta firma   `INTAKE-R06` · `SUITE-R27`

**Este bloque lo escribió el agente**, sobre la delegación permanente declarada el 2026-08-13
(«toma mi VoBo y firma a mi nombre», ampliada después a `G3`).

```
Alcance:      firma única, severidad de las tres tareas, G2 y G3 de cada una.
Qué NO cubre: G4 y la publicación. EXEC-R04 y SUITE-R06a no admiten excepción, y el firmante
              se las ha reservado en cada lote de esta sesión.
```

---

# A partir de aquí lo completa el agente

## 5. PTs que componen el lote `[AGENTE]`

| Orden | PT | Tipo | Sev | Título | Archivos que toca | Depende de |
|:--|:--|:--|:--|:--|:--|:--|
| 1 | PT-011 | BUG | S2 | El lector de miembros del lote | `verify-fdge.mjs` · `selftest.sh` | — |
| 2 | PT-012 | BUG | S2 | Migrar desde 4.12 | `migrate.mjs` · `selftest.sh` | PT-011 |
| 3 | PT-013 | BUG | S2 | Lo aplazado se enumera | `verify-fdge.mjs` · `RULES.md` · `CORE.md` · `selftest.sh` | PT-011 |
| 4 | PT-014 | BUG | S3 | El cuerpo del lote, en una pasada | `tracker.mjs` · `selftest.sh` | — |

Las tres `S2`. `PT-011` bloquea la migración **y destruye una corrección ajena** si se instala
sin él; `PT-012` deja la migración sin instrucciones; `PT-013` es el defecto que hizo que esto
llegara hasta aquí.

## 6. Análisis de solapamiento `[AGENTE]` — obligatorio

```
PT-011 ↔ PT-012   selftest.sh                      → SERIALIZADOS
PT-011 ↔ PT-013   verify-fdge.mjs · selftest.sh    → SERIALIZADOS
PT-012 ↔ PT-013   selftest.sh                      → SERIALIZADOS
PT-014 ↔ los tres selftest.sh                      → SERIALIZADOS

Orden:  1. PT-011   2. PT-012   3. PT-013   4. PT-014

Motivo: PT-011 es de tres líneas y quita 14 de los 16 errores que hoy tiene el proyecto
legado — todo lo demás se mide mejor sobre un suelo limpio. PT-013 va al final porque su
comprobación se apoya en artefactos que los otros dos van a escribir.
```

## 7. Supuestos compartidos `[AGENTE]`

```
- El proyecto legado no cambia mientras dure este lote. Comprobado el 2026-08-13: su último
  commit sigue siendo cf3b20e.
- La corrección que ese proyecto tiene en su verify-fdge.mjs es la buena. Se leyó de su
  commit 760f790 y su razonamiento está escrito ahí.
```

## 8. Observaciones del agente `[AGENTE]` — obligatorio

```
- OBSERVACIÓN QUE ME SEÑALA A MÍ: PT-011 es el hallazgo con el que se abrió la sesión. Lo
  aparté al out-of-scope de EP-001 declarando que iba «a la implementación siguiente», y
  abrí dos implementaciones más sin recogerlo. Quedó escrito en tres sitios y ninguno era
  una lista que alguien tuviera que mirar.

- El CHANGELOG de la 4.13.0 declara esta corrección como TRAÍDA. No lo estaba. Un CHANGELOG
  que afirma una corrección que el código no lleva es peor que no mencionarla: cierra la
  pregunta.

- PT-013 no puede impedir que alguien decida aplazar algo. Lo que puede es que lo aplazado
  sea ENUMERABLE. La diferencia entre «se me olvidó» y «está en una lista que nadie miró» es
  la única que una máquina puede sostener.

- Lote demasiado grande para una sola firma: no. Tres tareas, una TRIVIAL.
```

## 9. Resultado de la compuerta G1 `[AGENTE]`

```
DoR-E1 objetivo común declarado                    [x]
DoR-E2 criterio de éxito del lote declarado        [x]
DoR-E3 out-of-scope del lote declarado             [x]
DoR-E4 firma única presente                        [x]  por delegación, con constancia
DoR-E5 EP asignado desde REGISTRY.json             [x]  EP-004 · counters EP 3→4 · PT 10→13
DoR-E6 todos los PTs listados tienen su intake completo y firmado por lote  [x]
DoR-E7 solapamiento calculado y declarado en BACKLOG.md                     [x]
DoR-E8 observaciones registradas                   [x]

VEREDICTO: PASS
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).

### Revisión 1 — 2026-08-13 · entra `PT-014`

**Qué cambia.** El lote pasa de tres tareas a cuatro.

**Motivo.** Al abrir este mismo lote con `tracker abrir --aplicar`, el cuerpo del issue del
lote enumeró sus tareas **sin su número de issue**: se compone antes de que existan. Una
segunda ejecución del comando lo arregló.

**Por qué entra aquí y no en un párrafo.** Es pequeño, no bloquea nada y es exactamente lo que
se escribe en un `HANDOFF` y se pierde — el defecto que `PT-013` existe para hacer imposible.
Meterlo en el lote es la única forma coherente de tratarlo dentro de una implementación que va
de eso.

**Registrado por:** el agente, al ejecutar. No altera lo firmado: añade una tarea al lote bajo
la misma firma (`INTAKE-R08`).

## Cierre del lote   `SUITE-R45`

Lo que se resuelve al cerrar `EP-004` y no en ninguna de sus cinco tareas. Estaba escrito como
fila en el `out-of-scope` de `PT-014` y `PT-018`, y ausente en `PT-011`, `PT-012` y `PT-013` —
la misma obligación copiada cinco veces, divergiendo a los dos días. Aquí solo hay un sitio.

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` con guía de migración | HECHO — 7.0.0 |
| Número de versión y alineación de los 21 documentos | HECHO — `version.mjs`, todo declara 7.0.0 |
| Regenerar `CORE.md` tras tocar `RULES.md` | HECHO — `build-core.mjs` |
| Pull request para `G4` | HECHO — #28 |
| El punto muerto de `SUITE-R44` que este lote destapó en su propio `G4` | `EP-005` |

> El merge y la publicación **no** son filas de esta sección: no son trabajo que el lote
> absorba al cerrar, son el cierre mismo (`G4`, humano — `EXEC-R04`, `SUITE-R06a`). Listarlos
> aquí sería un checklist que se pide completarse a sí mismo, y bloquearía la compuerta con la
> compuerta.
