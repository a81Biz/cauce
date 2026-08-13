# PT-006 — Cambios de especificación   `PHASE 4`

## Regla nueva   `RULES.md`

```
| `SUITE-R42` | HARD | **El merge se propone donde se pueda revisar.** Si el proyecto declara
plataforma (`SUITE-R35`), `G4` se resuelve sobre un pull request abierto para la rama, y
`verify-fdge --gate G4` lo exige. La regla es condicional a propósito: declarar plataforma es
opcional y humano, y un proyecto que no la declara no gana ninguna exigencia. **El agente no
abre el PR ni lo fusiona**: comprueba que exista. Abrirlo es una acción que se describe
(`EXEC-R07`); fusionarlo es humano en los tres modos, sin excepción (`EXEC-R04`, `SUITE-R06a`).
Existía como contrato en `PHASES.md` atribuido a `SUITE-R35`, que no lo contiene: un documento
de procedimiento no enuncia obligaciones, las cita (`LEX-R21`). |
```

## Regla que NO se añade

El mapeo **implementación → milestone** se borra de `PHASES.md` y no sube a ninguna parte.
`PT-003` lo midió: cero milestones en toda la historia, la implementación ya tiene su propio
issue, y añadirlo le daría dos representaciones del mismo hecho en la misma plataforma — que
es lo que `SUITE-R35` existe para impedir.

## `PHASES.md`

El bloque `CONTRATO` pasa de declarar tres mapeos a declarar el que su regla contiene, y cita
la regla nueva para la compuerta.

## Contrato de `tracker`

Acción nueva `pr`, de solo lectura: ¿hay un pull request abierto para la rama actual?

```
0  sí        1  no        2  sin plataforma declarada        3  declarada y sin acceso
```

Los mismos códigos que `espejo`: quien llama ya sabe leerlos.

## Contrato de `verify-fdge`

| Situación | Antes | Después |
|:---|:---|:---|
| `--gate G4` con plataforma y PR abierto | no se miraba | `✓ SUITE-R42` |
| `--gate G4` con plataforma y sin PR | no se miraba | `✗ SUITE-R42` |
| `--gate G4` sin plataforma | no se miraba | no aplica |
| `--gate G4` con plataforma y sin acceso | no se miraba | `✗` — en `G4` la credencial es exigible |

## `CORE.md`

Se regenera: `SUITE-R42` entra en el núcleo y el contrato de `PHASES` cambia.

## Documentación de Foundation

Sin cambios.
