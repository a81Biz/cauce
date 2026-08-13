# PT-013 — Lo aplazado se enumera, no se narra

> Tarea de la implementación abierta `EP-004` (`FDGE-R51`).

```yaml
---
id: PT-013
type: BUG
epic: EP-004
track: STANDARD
status: READY
created: 2026-08-13
structural: no
suite_version: 6.0.1
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «es imposible que se te pasen u olviden cosas, se supone que todo está apuntado»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Lo que un lote aplaza a otro es **enumerable** | Una salida lista todo lo aplazado que sigue sin recoger |
| AC-02 | Se **deriva** de lo que ya se escribe | De los `out-of-scope.md`, no de un registro nuevo (`RULE-01`) |
| AC-03 | Aplazar sin decir a dónde se detecta | Un out-of-scope que difiere sin destino es un agujero |
| AC-04 | Cerrar un lote con cosas aplazadas sin recoger **lo dice** | Al cerrar, se enumeran |
| AC-05 | La regla existe en `RULES.md` | Una comprobación sin regla es un capricho del verificador |
| AC-06 | No impide aplazar | Aplazar es legítimo; perderlo de vista no |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: un comando enumera todo lo aplazado y sin recoger de este repositorio, y el
> hallazgo con el que se abrió la sesión aparece en esa lista si no estuviera ya resuelto.

## 4. Qué NO entra   `[AGENTE]`

- OUT: impedir que se aplace nada. Aplazar es una decisión legítima
- OUT: un registro nuevo. Se deriva de lo que ya existe (`RULE-01`)
- OUT: `ROADMAP.md`, que es de `FPGE` y solo su dueño escribe (`SUITE-R10`)
- OUT: interpretar si lo aplazado sigue teniendo sentido. Eso es humano

## 5. Firma

```
Firmado por lote: EP-004
```

---

## Evidencia, y es de esta misma sesión

`EP-001` declaró en su out-of-scope: «la migración del proyecto legado — es la implementación
siguiente». Se abrieron `EP-002` y `EP-003` sin recogerla. Cuatro versiones después seguía sin
hacerse, y lo detectó **una persona preguntando**, no el marco.

Lo aplazado estaba escrito en tres sitios —el out-of-scope del lote, el `HANDOFF` y el
`SESSION_LOG`— y ninguno era **una lista que alguien tuviera que mirar**. Prosa, no enumeración.

Es exactamente la avería que `PTSA-R79` nombra para las auditorías: «la auditoría cierra cuando
la matriz está completa, no cuando el auditor deja de encontrar hallazgos». El marco se lo
exige a PTSA y no se lo exige a sí mismo cuando aplaza trabajo.
