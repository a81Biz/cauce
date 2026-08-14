# PT-021 — Citar el propio lote no puede pasar G4 nunca

> Tarea de la implementación abierta `EP-005` (`FDGE-R51`).

```yaml
---
id: PT-021
type: BUG
epic: EP-005
track: STANDARD
status: INTEGRATED
created: 2026-08-13
structural: no
suite_version: 7.0.0
phase: 10
---
```

## 1. Qué falla   `[AGENTE]`

```
la fila dice   «Entrada de CHANGELOG.md y número de versión → Cierre de EP-004»
la regla dice  «citar el propio lote solo vale si ya está CLOSED»
pero           un lote llega a CLOSED DESPUÉS del merge, y el merge ES G4
```

Bloqueo por construcción. Lo escribí ayer en `PT-018` con esta intención: impedir que una tarea
aplace a su propio lote y el lote cierre sin hacerlo — «lo hará este lote» es la promesa que
falló en `EP-001`. La intención es correcta; el estado elegido para comprobarla, no.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Citar el propio lote vale si el lote está `DONE` o `CLOSED` | selftest |
| AC-02 | Sigue fallando si el lote está `DRAFT` o `IN_PROGRESS` | selftest — es la intención original, intacta |
| AC-03 | `EP-004` pasa `G4` en sus cinco tareas | ejecución real |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: un lote cuyo trabajo está completo puede cerrarse citándose a sí mismo, y uno
> que sigue abierto no.

## 4. Qué NO entra

- OUT: la fila que falta. Es `PT-022`
- OUT: aceptar cualquier estado. `DRAFT` e `IN_PROGRESS` siguen bloqueando

## 5. Firma

```
Firmado por lote: EP-005
```
