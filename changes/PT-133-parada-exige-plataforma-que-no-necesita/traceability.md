# Trazabilidad — `PT-133`

| AC | Criterio | Escenario | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | `parada` corre sin plataforma y escribe en el ledger | `TS-01` `TS-02` | `selftest.sh:parada corre sin plataforma declarada` | `salidas/casos.txt` |
| AC-02 | Con plataforma sigue tomando la rama del issue | `TS-03` | `selftest.sh:…y con plataforma toma la otra rama` | `salidas/casos.txt` |
| AC-03 | El `AC-03` de `PT-116` se corrige añadiendo, no reescribiendo | `TS-04` | entrada `CORRIGE` en `HISTORY.log` | `../../HISTORY.log` |

**Tres criterios, tres con `TS`, tres con evidencia ejecutada.**

## La evidencia que decide

`salidas/casos.txt` — el primer caso **ejecuta** la rama del ledger. `PT-116` comprobó que la
rama **existe**; esa diferencia es todo el defecto.
