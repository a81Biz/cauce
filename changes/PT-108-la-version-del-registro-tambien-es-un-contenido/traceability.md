# Trazabilidad — `PT-108`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | `version.mjs` ve el `suite_version` del registro | desalinear a `9.9.9` y detectarlo | `a mano, sobre el registro real` | `salidas/alineado.txt` |
| AC-02 | no toca ningún otro campo | leer allocations y contador tras alinear | `a mano` | `salidas/alineado.txt` |
| AC-03 | el límite del cerrojo queda declarado | por construcción — el comentario lo dice | `tools/version.mjs` | `salidas/alineado.txt` |
| AC-04 | la batería falla sin el arreglo | — | **NO CUBIERTO** | — |

**`AC-04` no está cubierto y se dice.** La comprobación se hizo a mano sobre el registro real; un
caso de batería exigiría un fixture con su propio `REGISTRY.json`, y no se escribió. Es deuda
declarada, no un verde.
