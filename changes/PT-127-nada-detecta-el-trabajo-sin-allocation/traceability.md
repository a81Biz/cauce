# Trazabilidad — `PT-127`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | Un commit que toque rutas gobernadas cita un identificador que existe en `REGISTRY.json` y estaba vivo | `TS-01` `TS-04` `TS-05` | `selftest.sh:un commit con «feat: PT-NNN» y allocation viva no es hallazgo` · `…citar un PT que no existe es trabajo sin allocation` | `salidas/casos-127.txt` |
| AC-02 | El identificador cumple el formato de `FDGE-R19`: `<type>: PT-XXX`, un **PT** y no un lote | `TS-03` `TS-06` `TS-07` | `selftest.sh:citar un LOTE no es citar una allocation` · `…los tipos de commit son los SEIS que declara FDGE-R19` | `salidas/casos-127.txt` |
| AC-03 | La comprobación corre en `verify-fdge` y no juzga los commits anteriores | `TS-11` | `selftest.sh:verify-fdge ejecuta la comprobación y agrupa los commits` | `salidas/verify-fdge.txt` |
| AC-04 | Distingue el rodeo **elegido** del **forzado**, y el segundo remite a arreglar la herramienta | `TS-08` `TS-09` `TS-10` | `selftest.sh:sin excepcion declarada, el rodeo es ELEGIDO` · `…con la excepcion en la MISMA entrada, es FORZADO` · `…la excepcion en OTRA entrada no vale` | `salidas/casos-127.txt` |
| AC-05 | Lo que no es mecanizable se declara con su número (`SUITE-R26`) | `TS-02` | `design.md` §5 · `selftest.sh:un commit que no toca ruta gobernada no necesita allocation` | `salidas/casos-127.txt` · `design.md` |

**Cinco criterios, cinco con `TS`, cinco con evidencia ejecutada.** Ningún Orphan Criterion.

---

## `AC-03` no dice lo que su enunciado sugiere, y se corrige aquí

El intake escribió: *«la comprobación corre en `verify-fdge` **con su fila en `RIGE_DESDE`**, así
que no juzga los 200+ commits anteriores»*.

**Eso es falso, y se midió.** La fila de `FDGE-R19` en `RIGE_DESDE` es `7.7.0`
(`patrones.mjs:166`), no la versión de hoy: la obligación sobre el formato del asunto **estaba en
vigor** cuando se escribieron esos commits. Lo que era nuevo es el verificador, no la regla, y
`SUITE-R09` protege del retrofechado de **reglas**, no de comprobaciones de reglas viejas.

Lo que realmente acota la lectura es la **ventana de 60 commits**, y por eso el criterio se da por
cumplido por esa vía y no por la que el intake suponía. Se deja escrito en vez de dejar que el
documento afirme algo que la medición contradice — es la lección de `PT-100`, donde afirmé antes
de medir y resultó ser falso.

## Lo que esta trazabilidad **no** establece

- Que los 34 commits detectados sean todos incumplimientos. **No lo son**: 15 de `EP-020` son
  trabajo *de lote*, y si eso vale o no es la pregunta que va a `PT-130`.
- Que `FORZADO` pruebe que el marco obligó. Observa **co-ocurrencia declarada** en una entrada
  del ledger, no intención. Declarado en `design.md` §5.
- Que un `PT` abierto **después** del commit que lo cita se detecte. No se detecta aquí; lo cazan
  `FDGE-R52` y `SUITE-R08`.
