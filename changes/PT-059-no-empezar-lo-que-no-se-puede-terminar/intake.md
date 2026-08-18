# PT-059 — No empezar lo que no se puede terminar

> Tarea de la implementación abierta `EP-015` (`FDGE-R51`).

```yaml
---
id: PT-059
type: CHORE
epic: EP-015
track: STANDARD
status: READY
created: 2026-08-18
structural: no
suite_version: 8.1.0
phase: 7
---
```

## 1. Qué se quiere   `[HUMANO]`

> «**Nunca comenzar una unidad de trabajo que probablemente no pueda completarse dentro del
> presupuesto disponible.**» · Y: «`BLOCKED_BY_CONTEXT` significa que la tarea **no está
> fallando**: significa que no debe ejecutarse todavía.»

La compuerta que **detiene antes de empezar**, con sus tres estados, y el estado de tarea que dice
que la espera **no es un fallo**.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `SAFE` / `MARGINAL` / `UNSAFE`, con el criterio de cada uno **derivado** y no escrito a mano | selftest |
| AC-02 | En `MARGINAL` **no se inician operaciones grandes**: solo lo atómico | selftest |
| AC-03 | En `UNSAFE` **no se ejecuta**: checkpoint, handoff y parada | selftest |
| AC-04 | `BLOCKED_BY_CONTEXT` es estado de **tarea**, está en `LEXICON`, y **no es terminal** | `verify-suite` |
| AC-05 | Con el presupuesto en `SIN EVALUAR`, la compuerta **no aprueba por omisión** | selftest |
| AC-06 | Un lote entero en `UNSAFE` para siempre **se declara**, no se repite en bucle | selftest |

**`AC-05` es el corazón.** Una compuerta que ante la falta de datos deja pasar es peor que no
tenerla: aprobaría justo cuando menos sabe.

**`AC-06` cierra el bucle infinito** que la especificación deja abierto: si una tarea nunca cabe,
`BLOCKED_BY_CONTEXT` se repetiría para siempre. Lo que hace falta entonces es **partirla**, y eso
se dice en vez de reintentarse.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: una tarea cuyo coste típico excede el presupuesto disponible **no se inicia**,
> queda en `BLOCKED_BY_CONTEXT` con su checkpoint, y una tarea que **nunca** cabría lo dice en vez
> de bloquearse en bucle.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| De dónde sale la cifra y su naturaleza | PT-057 · PT-058 |
| `SESSION.json` y el handoff derivado | PT-060 |
| Que la compuerta resuelva `G1`..`G4` | — |
| Partir automáticamente una tarea que no cabe | — |

**La tercera lleva `—`:** ésta es una compuerta de **viabilidad**, no de **gobernanza**. `G1`..`G4`
siguen decidiendo lo que decidían, y confundirlas metería una condición técnica en una decisión
humana.

**La cuarta también:** partir una tarea cambia su alcance, y el alcance lo firma una persona
(`INTAKE-R06`). La compuerta dice **que hay que partirla**; no lo hace.

## 5. Firma

```
Firmado por lote: EP-015
```
