# PT-004 — Cambios de especificación   `PHASE 4`

## Reglas   `RULES.md`

**Ninguna.** `FDGE-R15` y `FDGE-R42` conservan su texto íntegro. Lo que cambia es el momento
en que la herramienta las comprueba, no lo que exigen. Por eso este PT **no** regenera
`CORE.md` ni toca `LEXICON`, `EXECUTION-MODES` ni `PHASES`.

Si el texto de una regla hubiera tenido que cambiar, este PT no sería el sitio: sería un
cambio normativo con su propia entrada de CHANGELOG y su `MAJOR`/`MINOR`.

## Contrato de la herramienta   `verify-fdge`

Lo que cambia para quien la ejecuta:

| | Antes | Después |
|:---|:---|:---|
| PT antes de la fase que produce el artefacto | `✗` error · exit 1 | `!` aviso · exit sin cambio |
| PT en la fase o posterior, sin el artefacto | `✗` error | `✗` error — igual |
| PT sin fase declarada | `✗` error | `!` aviso `SIN EVALUAR` con instrucción |
| Código de salida | 1 con trabajo abierto en fase temprana | 0, salvo errores reales |

**El código de salida es el contrato que consume CI.** Este es el efecto que motiva el PT.

## Datos   `REGISTRY.json`

`allocations[].phase` pasa de ser un campo que solo `FDGE-R52` leía a ser el que resuelve la
exigencia de artefactos. **No es un campo nuevo:** el fixture del arnés lo declara en sus
cuatro allocations desde antes de este PT y `verify-fdge.mjs:757` ya lo consultaba.

Ausente sigue siendo válido. Un proyecto que no lo declare no se rompe: cae en la rama
`SIN EVALUAR` con su aviso.

## API · esquema · eventos · contratos externos

No aplica. `verify-fdge` es un proceso CLI sin servicio, sin base de datos y sin dependencias
(`RULE-04`).

## Documentación de Foundation

Sin cambios. El defecto no contradice nada de lo que
[06-Backend-Architecture.md](../../docs/enterprise-documentation/06-Backend-Architecture.md)
o [11-Conventions.md](../../docs/enterprise-documentation/11-Conventions.md) afirman; era una
violación de `RULE-06`, que ya estaba escrita.
