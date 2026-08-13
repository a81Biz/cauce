# PT-002 — Cambios de especificación   `PHASE 4`

## Reglas   `RULES.md`

**Ninguna.** `SUITE-R26` conserva su texto —«aspira a comprobación mecánica»— y es precisamente
lo que hace que publicar sin umbral sea lo correcto. `CORE.md` no se regenera.

## Contrato de `audit`

| | Antes | Después |
|:---|:---|:---|
| Cobertura de reglas | no se publicaba | `citadas · ejecutadas · total`, con desglose HARD |
| Estados | 2 (componente con algo / sin nada) | 3 por regla, **más** la de componente intacta |
| Frase final | «Cobertura completa: sin huecos» | acotada a lo auditado, con la cifra al lado |
| Sin poder derivar quién ejecuta qué | no aplicaba | `SIN EVALUAR` (`RULE-06`) |
| Banderas | ninguna | `--sin-verificar` · `--sin-compuerta` enumeran |
| Código de salida | `1` si hay huecos | **igual** |

El código de salida es lo que consumen `npm run verify` y CI. No cambia: la cobertura informa,
no bloquea.

## Datos · API · esquema · eventos

No aplica. Proceso CLI sin servicio, sin base de datos y sin dependencias (`RULE-04`), que no
escribe (`RULE-05`).

## Documentación de Foundation

Sin cambios. El defecto no contradice nada de lo documentado.
