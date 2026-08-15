# PT-048 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

`cuerpoDeIssue` es **pura y exportada**, así que estos casos corren **sin hablar con GitHub** —
que es justamente para lo que se separó del adaptador.

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | Sin directorio, el cuerpo **no** enlaza | no aparece `/tree/` |
| E2 | AC-02 | …y dice qué hay | «aplazada» y `SUITE-R44` |
| E3 | AC-03 | Con directorio, el enlace sigue | aparece `/tree/` |
| E4 | AC-03 | …y apunta a la rama de trabajo si está viva | la rama de trabajo |
| E5 | AC-04 | Sin el dato en el contexto, el comportamiento es el de hoy | aparece `/tree/` |

## `E5` es el que protege lo demás

Si el dato no viaja —una llamada antigua, un caso que no lo pase— el comportamiento tiene que ser
el de **hoy**, no el nuevo. Un `undefined` no es un «no existe», y tratarlo como tal apagaría el
enlace en **todos** los cuerpos. Por eso la comprobación es `=== false` y no `!hayDirectorio`.
