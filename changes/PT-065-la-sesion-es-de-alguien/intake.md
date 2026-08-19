# PT-065 — La sesión es de alguien

> Tarea de la implementación abierta `EP-016` (`FDGE-R51`).

```yaml
---
id: PT-065
type: CHORE
epic: EP-016
track: STANDARD
status: READY
created: 2026-08-18
structural: no
suite_version: 8.2.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

`EP-015` lo dejó declarado y sin cerrar:

> «`SESSION.json` es de **una** sesión: al abrir se sobrescribe. Con dos personas trabajando eso no
> basta, y el sitio donde se decide qué hacer con ello es `EP-016`.»

Que la marca de sesión de una persona **no borre la de otra**.

Hoy `tracker sesion abrir` escribe `docs/implementation/SESSION.json`. Dos personas en el mismo
repositorio: la segunda que abra borra el inicio de la primera **sin que nada lo note**, y a partir
de ahí el precedente de la primera sale de una marca que no es suya.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | La sesión declara **de quién** es | selftest |
| AC-02 | Abrir sesión **no borra** la de otra persona | selftest |
| AC-03 | Todo lo que la sesión deriva sale del trabajo de **su** persona | selftest |
| AC-04 | El handoff de cierre sigue siendo **derivado** y sigue sin tocar `HANDOFF.md` | selftest |
| AC-05 | Con una sola persona, el comportamiento de hoy **no cambia** | selftest |
| AC-06 | Una sesión de otra persona **se ve**, y se distingue de la propia | selftest |

`AC-06` no es cosmético: si no se ven, dos personas creen cada una que trabaja sola, y ninguna de
las dos entiende por qué las cifras no cuadran.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: dos personas abren sesión el mismo día, cada una ve la suya y sabe que la otra
> existe, y ninguna marca borra a la otra.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| Quién es quién | PT-061 |
| De quién es cada commit | PT-064 |
| Sincronizar sesiones entre máquinas | — |
| Un servidor de sesiones | — |

**Las dos últimas llevan `—`:** el estado vive en el repositorio y se comparte cuando se comparte el
repositorio. Cualquier cosa más rápida necesita algo que esté encendido, y este marco funciona sin
nada encendido — que es la razón por la que `SUITE-R08` puede asignar sin red.

## 5. Firma

```
Firmado por lote: EP-016
```
