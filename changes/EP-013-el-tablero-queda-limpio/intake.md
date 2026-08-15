# EP-013 — El tablero queda limpio

```yaml
---
id: EP-013
created: 2026-08-14
status: IN_PROGRESS
mode: SUPERVISED
origin: DIRECT
---
```

## 1. Objetivo común   `[HUMANO]`

> «revisa los PT abiertos todos y definamos para cerrar ya, con la excepción de la tarea de la
> migración que usa otro desarrollo. Necesito que estemos limpios y que sigas el marco de trabajo
> que hoy es la v 7.7.0»

Las ocho aplazadas que **sí se pueden cerrar**. Se hacen juntas porque son la misma pregunta
—«¿qué queda abierto porque hace falta, y qué queda abierto porque nadie lo decidió?»— y porque
cuatro de ellas llevaban entre tres y cinco lotes esperando una decisión que nunca se pidió.

Quedan fuera dos, y por motivos distintos que conviene no mezclar:

```
PT-019  la migracion de referencia   depende del proyecto legado, y ese lo trabaja
                                     el firmante. Se cierra cuando vaya, no antes
PT-025  el orden de cierre en Azure  el adaptador existe y NO HAY proyecto que lo
                                     ejercite. Escribir la guarda a ciegas seria
                                     codigo sin ejecucion, que es lo que este marco
                                     llama hueco declarado
```

## 2. Criterio de éxito del lote   `[HUMANO]`

El tablero queda con **dos** allocations vivas, y las dos porque dependen de algo que no está en
este repositorio. Ninguna sigue abierta por no haberse decidido.

## 3. Qué NO entra en el lote   `[HUMANO]`

```
OUT: PT-019 y PT-025, por lo dicho arriba
OUT: publicar. Decision humana explicita, sostenida en tres lotes
OUT: bajar a cero las 106 reglas sin verificador. La decision fue ACOTAR a las HARD
     que deciden algo; el resto queda como deuda MEDIDA, no como promesa
```

## 4. Firma única   `[HUMANO]`

```
Solicitado por: Alberto Martínez (delegada — «revisa los PT abiertos todos y definamos para
                cerrar ya», 2026-08-14; delegación de G1, G2 y G3 vigente desde 2026-08-14)
Fecha: 2026-08-14
He leído el Intake de cada PT listado en §5 y confirmo que todos reflejan mi intención: SÍ

Las cuatro decisiones que este lote ejecuta, tomadas por el firmante:
  PT-016  «phase» pasa a OBLIGATORIA, con migración. Rompe compatibilidad: MAJOR
  PT-047  rama por PT DE VERDAD. Cede el uso, no el marco
  PT-015  ACOTAR a las HARD que deciden algo; el resto, deuda medida
  las cinco pequeñas, en un solo lote

Estado: FIRMADA · G1 PASS
```

---

# A partir de aquí lo completa el agente

## 5. PTs que componen el lote   `[AGENTE]`

| Orden | PT | Tipo | Sev | Qué resuelve | Depende de |
|:--|:--|:--|:--|:--|:--|
| 1 | `PT-047` | BUG | S3 | Rama por PT: el marco lo manda y ningún PT lo hacía | — |
| 2 | `PT-016` | CHORE | S4 | `phase` obligatoria en el YAML, con su migración | `PT-047` |
| 3 | `PT-015` | CHORE | S4 | Verificador para las HARD que **deciden** y hoy no citan su ID | `PT-047` |
| 4 | `PT-048` | BUG | S3 | El issue de un `DEFERRED` enlaza a un directorio que no existe | `PT-047` |
| 5 | `PT-017` | CHORE | S4 | `migrate` deriva «qué llega nuevo» en vez de tenerlo escrito a mano | `PT-047` |
| 6 | `PT-020` | CHORE | S3 | El grafo cubre las herramientas, no solo `bin` | `PT-047` |
| 7 | `PT-023` | CHORE | S2 | Auditar qué más declaró `PT-018` y no hizo | `PT-047` |
| 8 | `PT-029` | CHORE | S2 | Buscar más choques entre reglas | `PT-023` |

**`PT-047` va primera y no es una preferencia:** cambia **cómo se ejecutan las otras siete**. Si
la rama por PT entra después, las siete se habrán hecho con el defecto que la octava corrige.

**`PT-029` va última** porque `PT-023` es su primer caso concreto: auditar lo que `PT-018`
declaró y no hizo enseña qué forma tiene el defecto que `PT-029` busca en general.

## 6. Análisis de solapamiento   `[AGENTE]`

```
RULES.md            PT-016 · PT-015 · PT-029           → SERIALIZADOS
tools/verify-fdge   PT-016 · PT-015                    → SERIALIZADOS
tools/tracker.mjs   PT-048                             → solo
tools/migrate.mjs   PT-017                             → solo
REGISTRY.graph      PT-020                             → solo
FDGE-Prompts.md     PT-023 (el hallazgo ya encontrado) → solo
PHASES · CLAUDE.md  PT-047                             → primero, y por eso solo

Ejecucion SECUENCIAL, en el orden de §5. Ningun par corre en paralelo.
```

## 7. Supuestos compartidos   `[AGENTE]`

```
- La rama por PT no cambia quien resuelve G4: sigue siendo humana (EXEC-R04). Lo que
  PT-047 tiene que resolver es la TOPOLOGIA —a donde mergea una rama de PT— y eso se
  decide en su PHASE 3, no aqui.
- PT-016 rompe compatibilidad. El lote sube MAJOR y escribe guia de migracion: los
  proyectos instalados dependen de ella (SUITE-R19).
- «Acotar» PT-015 significa reducir su alcance POR ESCRITO en su propio intake, no
  cerrarlo con menos de lo que decia. La diferencia se declara.
```

## 8. Observaciones del agente   `[AGENTE]`   `INTAKE-R07`

```
- Lote demasiado grande para una sola firma: ES EL RIESGO REAL. Ocho tareas, una de
  ellas MAJOR y otra que cambia como se ejecutan las otras siete. FDGE-R41 lo cubre
  —el primer BLOCKED detiene el lote entero— pero conviene decirlo antes: si PT-047
  resulta mas grande de lo que parece, se detienen ocho, no una.
- PT-023 YA tiene hallazgo, encontrado al revisar el tablero para escribir este intake:
  FDGE-Prompts.md cita SUITE-R44 pero OMITE el vocabulario cerrado y la reciprocidad,
  que es exactamente lo que PT-018 declaro que escribiria ahi. Es la segunda vez que
  PT-018 declara un cambio de especificacion que no hizo.
- PT-029 puede encontrar mas trabajo del que cabe en este lote. Si aparece, se aplaza
  con su allocation y su issue (SUITE-R44), no se mete a la fuerza.
```

## 9. Resultado de la compuerta `G1`   `[AGENTE]`

```
DoR-E1 objetivo común declarado                    [x]
DoR-E2 criterio de éxito del lote declarado        [x]
DoR-E3 out-of-scope del lote declarado             [x]
DoR-E4 firma única presente                        [x]
DoR-E5 EP asignado desde REGISTRY.json             [x]
DoR-E6 todos los PTs listados tienen su intake completo y firmado por lote  [x]
DoR-E7 solapamiento calculado y declarado en BACKLOG.md                     [x]
DoR-E8 observaciones registradas                   [x]

VEREDICTO: PASS
```

## Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` y número de versión — **`MAJOR`**, con guía de migración por `PT-016` | pendiente |
| Regenerar `CORE.md` | pendiente |
| Declarar en `10-Technical-Debt.md` lo que queda medido y no resuelto: las reglas sin verificador que `PT-015` no cubre | pendiente |
| Qué pasa con `PT-019` y `PT-025`, las dos que no entran | pendiente |

> El merge, la publicación y lo que se verifique después del cierre no son filas: `SUITE-R45`.
