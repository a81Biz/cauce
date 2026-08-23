# PT-123 — BACKLOG.md dice que se deriva del registro y nada lo deriva

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-123
type: BUG
epic: EP-020
track: STANDARD
status: READY
phase: 1
created: 2026-08-22
structural: no
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> Que el índice que una compuerta exige se pueda producir con la herramienta que dice producirlo.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `tracker indices` incluye `BACKLOG.md` y lo escribe con `--aplicar`, como ya hace con `DISCOVERY`, `ENRICHMENT` y `REFACTOR_SCOPE` | un caso por cada uno de los cuatro |
| AC-02 | El bloque de la implementación abierta se DERIVA del registro: lote, tareas, orden, estado, fase e issue | alterar el registro cambia el .md sin tocarlo |
| AC-03 | El solapamiento declarado (`FDGE-R40`) tiene su sitio derivado o su sitio declarado, y se dice cuál | DoR-E7 deja de ser incumplible |
| AC-04 | `verify-fdge` avisa cuando `BACKLOG.md` declara una implementación que el registro no tiene abierta | hoy lleva cuatro lotes declarando EP-015, que está CLOSED |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `DoR-E7` se puede cumplir sin editar un archivo a mano.

## 4. Qué NO entra   `[AGENTE]`

- OUT: la prosa de justificación del orden. Se deriva la tabla; el porqué lo escribe quien reparte
- OUT: regenerar el histórico de lotes cerrados

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Apareció intentando cumplir `DoR-E7` al abrir este lote**, y por eso es `S1`: deja una condición de `G1` mecánicamente incumplible.
- **Es la segunda vez que este archivo se queda atrás**, y su propia cabecera registra la primera: «llevó ocho lotes sin regenerarse y llegó a declarar un estado de tres versiones atrás». Hoy lleva cuatro.
- **El bloque `no hacer` prohíbe editarlo a mano**, así que sin generador la única salida practicable es saltarse la regla — que es la definición de `FDGE-R51` aplicada al revés.
