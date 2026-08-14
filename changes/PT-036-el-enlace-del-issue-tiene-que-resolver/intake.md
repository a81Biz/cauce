# PT-036 — El enlace del issue tiene que resolver

> Tarea de la implementación abierta `EP-009` (`FDGE-R51`).

```yaml
---
id: PT-036
type: BUG
epic: EP-009
track: STANDARD
status: IN_PROGRESS
created: 2026-08-13
structural: no
suite_version: 7.3.0
phase: 2
---
```

## 1. Qué falla   `[HUMANO]`

> «Si voy al enlace que indicas tiene `tree/main/changes/EP-010-...` que no lleva a ningún lado,
> está aún en local. Tener para leerlo sin necesidad de ver el local.»

## 2. Por qué   `[AGENTE]`

`PT-010` fijó el enlace en la rama por defecto razonando que «un issue es un artefacto largo y
una rama es corta». El razonamiento es bueno; el resultado era **404 en el momento en que más se
lee un issue**: al abrirlo, cuando el trabajo aún no se ha integrado.

Lo dijo quien intentó abrirlo, no un caso.

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Una allocation viva enlaza la rama de trabajo, donde el contenido existe | selftest |
| AC-02 | Una `INTEGRATED` enlaza la rama por defecto, que es donde se queda | selftest |
| AC-03 | Sin saber la rama, cae en la por defecto en vez de inventar una | selftest |
| AC-04 | El cuerpo dice a qué rama apunta y que se moverá solo | selftest |
| AC-05 | La transición es automática: el cuerpo se resincroniza en cada pasada | ejecución real |

## 4. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: el enlace de un issue abierto lleva al contenido, sin necesidad de tener el
> repositorio en local.

## 5. Qué NO entra   `[AGENTE]`

- OUT: copiar el intake dentro del issue. Dos copias del mismo texto divergen (`SUITE-R35`, `PT-010`)
- OUT: enlazar a un commit fijo. Envejecería mal: el contenido sigue cambiando durante el trabajo

## 6. Firma

```
Firmado por lote: EP-009
```
