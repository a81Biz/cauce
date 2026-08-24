# Trazabilidad — `PT-140`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | Con rama sólo en el remoto, se niega y dice cómo traerla | `TS-02` `TS-03` `TS-04` | `selftest.sh:con rama SOLO en el remoto, se niega` · `…y dice el comando para traerla` | `salidas/selftest-completo.txt` |
| AC-02 | Sin rama en ningún sitio, la crea diciendo que es la primera vez | `TS-01` | `selftest.sh:sin rama en ningun sitio, la crea y lo dice` | `salidas/selftest-completo.txt` |
| AC-03 | Con la rama local, no cambia lo que ya funcionaba | `TS-05` `TS-06` | `selftest.sh:con la rama local, sigue proyectando igual` | `salidas/selftest-completo.txt` |
| AC-04 | Distingue **no poder mirar** de **no existir** | — la rama del código, declarada | — `null` frente a `false`, con su comentario | `salidas/reproduccion.txt` |
| AC-05 | `SUITE-R31` lo cita | — verificación documental | `verify-suite.mjs` | `salidas/verify-suite.txt` |

**Cinco criterios, cinco con escenario o declaración.** Ningún Orphan Criterion.

`AC-04` **no** tiene caso y se dice por qué: forzar el fallo de `git ls-remote` sin tocar la red
exigiría un remoto que exista y falle a la vez. Lo que se establece es que el código **distingue**
los tres estados, no que se haya provocado el tercero.
