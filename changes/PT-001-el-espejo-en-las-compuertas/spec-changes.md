# PT-001 — Cambios de especificación   `PHASE 4`

## Reglas   `RULES.md`

**Ninguna.** `SUITE-R35`, `FDGE-R52` y `FND-R30` conservan su texto íntegro. Este PT no las
cambia: las **ejecuta**. Por eso no se regenera `CORE.md` ni se tocan `LEXICON`,
`EXECUTION-MODES` ni `PHASES`.

## Contrato de `tracker`

| Código | Antes | Después |
|:---|:---|:---|
| `0` | espejo cuadra | igual |
| `1` | divergencia | igual |
| `2` | sin plataforma **o** sin acceso | **solo** sin plataforma declarada |
| `3` | — | plataforma declarada y sin acceso (`FND-R30`) |

Acción nueva `notas PT-NNN`, de solo lectura: cuántas notas de transición lleva el issue de
ese PT. Existe para que `verify-fdge` no necesite su propio cliente de plataforma.

## Contrato de `verify-fdge`

| Situación | Antes | Después |
|:---|:---|:---|
| Trabajo vivo sin issue | no se comprobaba | `✗ SUITE-R35` en `--gate G4` |
| `FDGE-R52` con plataforma declarada | exigía `bitacora.md` | acepta el reanclaje del issue |
| `FDGE-R52` sin plataforma | exigía `bitacora.md` | **igual** |
| Plataforma sin acceso | no aplicaba | `SIN EVALUAR`, y `fail` en `G4` |

## Compuertas

`npm run verify` gana `verify:espejo`. `verificacion.yml` gana un paso, saltado en PRs desde
fork. `cauce verify` no cuenta `2` ni `3` como fallo.

## Datos

Ninguno. `REGISTRY.json` no cambia de forma: `tracker.plataforma` y `allocations[].issue` ya
existen y ya se escriben.

## API · esquema · eventos

No aplica. Procesos CLI sin servicio, sin base de datos y sin dependencias (`RULE-04`).

## Documentación de Foundation

Sin cambios. El defecto no contradice nada de lo documentado: era una regla sin compuerta.
