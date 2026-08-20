# PT-066 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Las 20 reglas `CHECK` de `RULES.md` se encuentran | E1 · E6 | `selftest.sh`: «cada regla devuelve SU definicion» | `salidas/caso-real.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-02 | Las 15 `EXEC-R*` se encuentran | E2 · E6 | `selftest.sh`: «cada regla devuelve SU definicion» | `salidas/caso-real.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-03 | Las `LEX-R*` se encuentran | E3 · E6 | `selftest.sh`: «cada regla devuelve SU definicion» | `salidas/caso-real.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-04 | Nunca se devuelve el texto de otra regla | E4 · E6 | `selftest.sh`: «cada regla devuelve SU definicion» | `salidas/caso-real.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-05 | Una regla que de verdad no existe se sigue declarando inexistente | E5 | `selftest.sh`: «una regla inexistente lo sigue siendo» | `salidas/caso-real.txt` | - | VERIFICADO |
| AC-06 | Un caso por cada ID definido, derivado y no escrito a mano | E6 | `selftest.sh`: «cada regla devuelve SU definicion» | `salidas/selftest-completo.txt` | - | VERIFICADO |

## Un caso cubre cinco `AC`, y no es pereza

`E6` recorre el universo **derivado** de los tres documentos propietarios y exige por cada ID
**dos** condiciones: que no sea `null`, y que el texto **empiece por ese mismo ID**. Eso cubre
`AC-01`..`AC-04` por construcción — si alguna `CHECK`, alguna `EXEC-*`, alguna `LEX-*` o alguna
que devolviera texto ajeno fallara, el caso nombra cuál.

Escribir seis casos con muestras habría probado menos: una muestra deja fuera lo que no mira.

## El antes y el después, sobre casos reales

```
ANTES                                    DESPUES
FDGE-R34   no está definida              definida en RULES.md
SUITE-R13  no está definida              definida en RULES.md
EXEC-R14   no está definida              definida en EXECUTION-MODES.md
LEX-R26    no está definida              definida en LEXICON.md
FDGE-R43   devuelve el texto de R29      «Frescura del grafo…»  (el suyo)
FDGE-R19   devuelve el texto de R42      «Commits atómicos…»    (el suyo)
SUITE-R99  no está definida              no está definida       (correcto)
```

Las tres primeras son las que engañaron a este agente en `PHASE 0` de esta sesión.

## Inversa

Devuelto el criterio por mención y severidad:

```
✗ cada regla devuelve SU definicion    cae
FDGE-R34, EXEC-R14, LEX-R26            vuelven a declararse inexistentes
FDGE-R43                               vuelve a devolver texto ajeno
SUITE-R99                              sigue inexistente — correcto, no depende del arreglo
```

`SUITE-R99` es la guarda contra el arreglo fácil: hacer que `definicionDe` devuelva algo siempre
arreglaría las 47 y rompería la única respuesta honesta que la función ya daba bien.
