# PT-006 — El contrato vuelve a su regla

> Tarea de la implementación abierta `EP-002` (`FDGE-R51`). Plantilla `TAREA.md`.

```yaml
---
id: PT-006
type: CHORE
epic: EP-002
track: STANDARD
status: READY
created: 2026-08-13
structural: no
suite_version: 5.3.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «vamos a EP-002»

Recogiendo el PT de seguimiento que `PT-003` propuso en su conclusión (`FDGE-R42`): retirar de
`PHASES.md` los dos mapeos que `SUITE-R35` no contiene, y subir a `RULES.md` el del pull
request con su comprobación.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `PHASES.md` deja de enunciar obligaciones que su regla no contiene | El mapeo del milestone desaparece; el contrato cita lo que `SUITE-R35` dice |
| AC-02 | El mapeo `G4` → pull request queda en `RULES.md` | Regla propia, condicionada a que el proyecto declare plataforma |
| AC-03 | La regla nueva tiene comprobación que puede fallar | `verify-fdge --gate G4` exige PR abierto para la rama cuando hay plataforma |
| AC-04 | Sin plataforma declarada no cambia nada | Caso de `selftest.sh`: `REGISTRY.json` sin `tracker` no gana ninguna exigencia |
| AC-05 | Sin acceso a la plataforma se declara, no se aprueba | `SIN EVALUAR` fuera de `G4`; en `G4` falla, igual que el espejo |
| AC-06 | `CORE.md` se regenera y la suite sigue coherente | `build-core --check` y `verify-suite` en verde |
| AC-07 | El agente no fusiona el PR | La comprobación mira que **exista**; abrirlo es `EXEC-R07`, fusionarlo es humano |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `RULES.md` contiene la regla del pull request, `PHASES.md` no declara ningún
> mapeo que su regla no tenga, y `verify-fdge --gate G4` falla si no hay PR con plataforma
> declarada.

## 4. Qué NO entra   `[AGENTE]`

- OUT: milestones. `PT-003` los descartó con evidencia — cero en toda la historia, y darían a un `EP` dos representaciones del mismo hecho
- OUT: que el agente fusione el PR. `G4` es humana sin excepción (`EXEC-R04`)
- OUT: crear el PR automáticamente. Se comprueba que exista; abrirlo sigue siendo un acto que se describe
- OUT: el adaptador de Azure DevOps

## 5. Firma

```
Firmado por lote: EP-002
```

---

## Por qué esto sube a `RULES.md` y no se queda donde está

`PT-003` lo midió: `RULES.md` tiene **cero** apariciones de «pull request» y `PHASES.md` lo
declara bajo el encabezado `[SUITE-R35]`. `LEX-R21` pone `PHASES` por debajo de `RULES`, y el
`CLAUDE.md` de este repositorio es explícito: «Ningún otro documento enuncia obligaciones: las
**citan** por ID».

Hay dos salidas coherentes —borrarlo, o subirlo— y la evidencia empuja a subirlo: la práctica
ya existe (el PR #1 se abrió y se fusionó), abrir un PR no es automatizar `G4`, y es la única
transición de la máquina de estados que hoy no comprueba nadie.
