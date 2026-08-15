# PT-014 — El cuerpo del lote, en una pasada

> Tarea de la implementación abierta `EP-004` (`FDGE-R51`).

```yaml
---
id: PT-014
type: BUG
epic: EP-004
track: STANDARD
status: INTEGRATED
created: 2026-08-13
structural: no
suite_version: 6.0.1
phase: 10
---
```

## 1. Qué se quiere   `[HUMANO]`

> «quiero ver que estés usando lo que quedamos en la v 6.0.1»

Y usándolo apareció esto.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Una sola pasada de `abrir --aplicar` deja el cuerpo del lote completo | Ejecución real: las tareas aparecen con su `#issue` sin repetir el comando |
| AC-02 | El orden de creación deja de importar | El cuerpo del lote se compone **después** de que sus tareas tengan número |
| AC-03 | No se añaden llamadas de más | Se reordena lo que ya hay, no se pide dos veces |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: abrir un lote con sus tareas en una sola ejecución deja el cuerpo del issue
> del lote enumerándolas con su número.

## 4. Qué NO entra   `[AGENTE]`

- OUT: cambiar qué dice el cuerpo. Eso lo fijó `PT-010`
- OUT: reescribir issues ya cerrados

## 5. Firma

```
Firmado por lote: EP-004
```

---

## Evidencia, de hace diez minutos

Al abrir `EP-004` con `tracker abrir --aplicar`, el cuerpo de su issue salió así:

```
- `PT-011` — INTAKE-R08 lee los miembros de todo el texto…
- `PT-012` — migrate.mjs no tiene tramo 4.12 → 6.x…
```

Sin el `#18`, `#19`, `#20`. Una segunda ejecución del mismo comando los puso.

El issue del lote se crea **antes** que los de sus tareas —va primero en el registro— así que
cuando se compone su cuerpo, sus tareas todavía no tienen número. La sincronización posterior
existe, pero en la misma ejecución llega tarde para el lote.

**No es grave y por eso importa cómo se trata:** es exactamente el tipo de cosa que se escribe
en un `HANDOFF` y se pierde. Entra en el lote en vez de en un párrafo.
