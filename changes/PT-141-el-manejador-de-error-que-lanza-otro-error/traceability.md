# Trazabilidad — `PT-141`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | El `catch` reporta el fallo real en vez de lanzar otro | `TS-01` `TS-02` | `selftest.sh:un catch que interpola algo fuera de ambito se nombra` | `salidas/selftest-completo.txt` |
| AC-02 | Se enumeran todos, con archivo y línea, sin ahogar en falsos | `TS-03` `TS-04` `TS-05` `TS-06` | `selftest.sh:lo declarado en la funcion que envuelve, tampoco` | `salidas/selftest-completo.txt` |
| AC-03 | El enumerador corre en la batería sobre el árbol real | `TS-08` | `selftest.sh:el arbol real no tiene manejadores rotos` | `salidas/selftest-completo.txt` |
| AC-04 | Un comando que falla a mitad dice qué llegó a hacer | — el mensaje, declarado | — el `catch` arreglado interpola el error | `salidas/manejadores.txt` |
| AC-05 | Lo no mecanizable se declara con su número | `TS-07` | `selftest.sh:sin fuentes devuelve null, no cero` | `salidas/selftest-completo.txt` |

**Cinco criterios, cinco con escenario o declaración.** Ningún Orphan Criterion.

`AC-04` no tiene `TS`: forzar el fallo de la republicación exigiría una plataforma que acepte la
llamada y falle al escribir. Lo que se establece es que **el mensaje ya lo dice**, y está en la
evidencia.
