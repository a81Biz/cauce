# Intake — LOTE (`EP-NNN`)

> Copiar a `changes/EP-NNN-slug/intake.md` (`INTAKE-R09`).
> Cada PT del lote conserva **su propio** `intake.md` completo (`FDGE-R38`). Lo que el lote
> ahorra es la ceremonia de firmar varias veces, no el contenido.
> Reglas: [RULES.md](../../RULES.md) · Compuertas: [EXECUTION-MODES.md](../../EXECUTION-MODES.md) §7

---

```yaml
---
id: EP-NNN                 # [AGENTE] asignado desde REGISTRY.json
created: YYYY-MM-DD
status: DRAFT              # DRAFT → READY tras G1 → IN_PROGRESS → CLOSED | BLOCKED
mode: SUPERVISED           # modo con el que se ejecutará el lote
origin: DIRECT             # DIRECT | FPGE R-NNN..R-MMM
---
```

---

## 1. Objetivo común `[HUMANO]` — obligatorio

Qué tienen en común estos PTs y por qué se hacen juntos y no sueltos.

```
```

> *Ejemplo: «Toda la validación de formularios del alta de cliente. Se hacen juntos porque
> comparten el mismo validador y arreglarlos por separado obligaría a tocarlo tres veces.»*

---

## 2. Criterio de éxito del lote `[HUMANO]` — obligatorio

Cómo sabrás que el lote entero mereció la pena. **No es la suma de los AC de cada PT**: es
lo que solo se consigue haciéndolos juntos.

```
```

> *Ejemplo: «Ningún formulario del flujo de alta acepta datos inválidos sin mensaje, y el
> validador queda con una sola implementación en vez de tres.»*

---

## 3. Qué NO entra en el lote `[HUMANO]` — obligatorio

Un lote crece aún más fácil que un PT suelto: cada trabajo parecido «ya que estamos» es un
candidato a colarse.

```
OUT:
OUT:
```

---

## 4. Firma única `[HUMANO]` — obligatorio

Cubre los Intakes de **todos** los PTs listados en §5 (`INTAKE-R08`). Cada uno de esos
Intakes debe llevar en su bloque `## Firma` la línea `Firmado por lote: EP-NNN`, o
`verify-fdge` los rechazará como no firmados.

El agente **no puede** escribir este bloque (`INTAKE-R06`).

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
| 1 | PT-101 | | | | | — |
| 2 | PT-102 | | | | | |

El campo **Archivos** sale de `tasks.md` de cada PT y es lo que hace computable el
solapamiento (`FDGE-R40`).

## 6. Análisis de solapamiento `[AGENTE]` — obligatorio

```
Pares que comparten archivos:
  PT-1xx ↔ PT-1yy   (ruta compartida)   → SERIALIZADOS

Orden de ejecución resultante:
  1. …
  2. …

Motivo del orden: [dependencia técnica | solapamiento | prioridad declarada]
```

Se declara también en `BACKLOG.md` (`FDGE-R40`). La ejecución es **secuencial** por defecto
(`EXEC-R08`).

## 7. Supuestos compartidos `[AGENTE]`

Qué dan por cierto todos los PTs del lote. Es lo que justifica `FDGE-R41`: si uno falla
porque un supuesto era falso, seguir con el resto multiplica el rework en vez de contenerlo.

```
-
```

## 8. Observaciones del agente `[AGENTE]` — obligatorio

Desafíos al lote (`INTAKE-R07`). «Ninguna» solo si de verdad no hay ninguna.

```
- PT que no encaja con el objetivo común:
- Solapamiento que hace inviable el orden propuesto:
- Supuesto compartido que no está verificado:
- Lote demasiado grande para una sola firma:
```

## 9. Resultado de la compuerta G1 `[AGENTE]`

```
DoR-E1 objetivo común declarado                    [ ]
DoR-E2 criterio de éxito del lote declarado        [ ]
DoR-E3 out-of-scope del lote declarado             [ ]
DoR-E4 firma única presente                        [ ]
DoR-E5 EP asignado desde REGISTRY.json             [ ]
DoR-E6 todos los PTs listados tienen su intake completo y firmado por lote  [ ]
DoR-E7 solapamiento calculado y declarado en BACKLOG.md                     [ ]
DoR-E8 observaciones registradas                   [ ]

VEREDICTO: PASS | FAIL | CHALLENGE
Motivo (si FAIL o CHALLENGE):

CHALLENGE aceptado por:      (solo si el veredicto fue CHALLENGE y el humano decidió
                              proceder igualmente — sin esta línea el lote no avanza)
```

---

## Cierre del lote

`EP-NNN` pasa a `CLOSED` cuando todos sus PTs están `INTEGRATED`/`CLOSED` o fueron retirados
explícitamente. Se registra una entrada propia en `HISTORY.log` enumerándolos.

Si un PT se bloquea, **el lote entero se detiene** y `EP-NNN` pasa a `BLOCKED` con el PT
causante y el motivo declarados en `BACKLOG.md` (`FDGE-R41`). El humano puede retirar ese PT
y ordenar reanudar.

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).

<!-- ## Revisión 1 — YYYY-MM-DD
Qué cambia:
Motivo:
Firmado por: -->
