# PT-038 — El manual de uso

> Tarea de la implementación abierta `EP-010` (`FDGE-R51`).

```yaml
---
id: PT-038
type: FEATURE
epic: EP-010
track: STANDARD
status: IN_PROGRESS
created: 2026-08-13
structural: no
suite_version: 7.4.0
phase: 4
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Falta la explicación en el README del uso, desde el inicio: la creación de un nuevo proyecto,
> la instalación del agente, sobre un trabajo nuevo, uno legado, etc. Para que se pueda generar
> un **manual completo de uso**.»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Se lee de principio a fin y lleva de cero al primer trabajo cerrado | selftest |
| AC-02 | Empieza mandando preguntar al tablero, no leyendo reglas | selftest |
| AC-03 | Dice qué firma la persona y por qué, incluida `G4` | selftest |
| AC-04 | Enlaza al catálogo para el caso concreto | selftest |
| AC-05 | **Cita** reglas por ID; no define ninguna (`SUITE-R21`) | selftest |
| AC-06 | Se encuentra desde donde se busca: los dos `README` y `CLAUDE.md` | ejecución real |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: alguien que llega sin conocer cauce puede ir de cero a su primer `PT` cerrado
> siguiendo un solo documento.

## 4. Qué NO entra   `[AGENTE]`

- OUT: copiar reglas o procedimiento. Se citan (`LEX-R22`, `SUITE-R21`)
- OUT: sustituir a `INSTALL.md` ni a `PHASES.md`. El manual lleva **a** ellos
- OUT: reescribir el `README` de la suite. Es de otra cosa y sirve

## 5. Firma

```
Firmado por lote: EP-010
```
