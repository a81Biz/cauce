# `PT-203` — Citar un PT en una fila del intake del lote lo convierte en miembro

```yaml
---
id: PT-203
type: BUG
severity: S3
epic: EP-026
track: STANDARD
status: READY
phase: 1
created: 2026-08-28
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

Escribiendo el intake de `EP-026`:

```
✗ INTAKE-R08  PT-178: pertenece a EP-026 pero su intake no lleva «Firmado por lote: EP-026».
```

**`PT-178` no pertenece a `EP-026`.** Está en `EP-024`, `INTEGRATED`, y su intake lo dice.

## 2. Por qué   `[HUMANO]`

```js
.filter((l) => /^\s*\|/.test(l))
.flatMap((l) => [...l.matchAll(/\bPT-\d+\b/g)].map((m) => m[0]));   // verify-fdge.mjs:1574
```

Los miembros del lote se extraen de **cualquier `PT-NNN` en una fila de tabla**. La tabla de `§5`
tenía una columna **«Origen»** —`← PT-178`, `← PT-180`, `← PT-191`— y las tres se leyeron como
miembros.

## 3. Lo que lo hace defecto y no descuido de quien escribe

- **La plantilla no lo advierte.** `EPIC-INTAKE.md` pide una tabla de PTs y no dice que citar un
  identificador en **cualquier** fila lo afilie.
- **El intake es prosa razonada, no un formulario.** Decir de dónde salió cada tarea es justo lo que
  `FDGE-R55` premia; aquí **castiga**.
- **El mensaje manda al sitio equivocado**: propone tocar el intake de una tarea de otro lote,
  integrada desde hace días.
- Misma familia que `PT-198`: una extracción frágil que no distingue lo que busca de lo que se le
  parece, y un mensaje que presenta como hecho un fallo de lectura.

## 4. Cómo se arregla, y cómo NO

**No** prohibiendo citar identificadores en el intake: es información que el marco quiere.

**Sí** haciendo que la pertenencia se lea de **una columna o sección declarada** —o del registro,
que es quien asigna (`SUITE-R08`)— en vez de de cualquier celda.

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | Citar un `PT` como origen **no** lo hace miembro del lote | `TS-01` |
| `AC-02` | Los miembros reales se siguen detectando | `TS-02` |
| `AC-03` | El mensaje distingue «no es miembro» de «le falta la firma de lote» | `TS-03` |

## Cómo termina   `FDGE-R53`

> Termina cuando: un intake puede decir de dónde salió cada tarea sin que eso cambie de quién es.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la única del lote, resuelta el `2026-08-28`. `G3` sigue siendo humana
para todo `BUG` (`EXEC-R05`), y se pedirá con la evidencia delante.
