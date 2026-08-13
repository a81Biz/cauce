# PT-004 — Trazabilidad   `FDGE-R15`

`AC` y `TS` se declararon en `PHASE 4`. `Test` y `Evidencia`, en `PHASE 6`.

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Un PT en PHASE 1 no falla por artefactos de fases posteriores | TS-01 | selftest.sh · «PHASE 1 sin traceability ⇒ no falla» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-02 | Una INVESTIGATION en PHASE 1 no falla por no tener discovery.md | TS-02 | selftest.sh · «PHASE 1 sin discovery ⇒ no falla» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-03 | La ausencia sí falla cuando el PT declara haber alcanzado la fase | TS-03 TS-04 | selftest.sh · «PHASE 4 sin traceability ⇒ falla» · «PHASE 2 sin discovery ⇒ falla» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-04 | La fase de un PT es legible sin adivinarla | TS-05 TS-06 | selftest.sh · «el aviso dice dónde declararla» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-05 | Un PT sin fase declarada no se vuelve invisible | TS-05 | selftest.sh · «sin fase declarada ⇒ SIN EVALUAR» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-06 | CI en verde salvo lo atribuible a otras tareas del lote | TS-07 | selftest.sh · 188 casos, 0 fallos | salidas/verify-fdge-antes.txt · salidas/verify-fdge-despues.txt | — | PARCIAL |

## `AC-06` está PARCIAL, y por qué no lo doy por verificado

Medido: `verify-fdge --all` pasó de **4 errores a 1**, y ese 1 es
`✗ FDGE-R52 · PT-004: está en PHASE 5 y su bitácora tiene 0 notas`.

El reanclaje de este PT está escrito donde `CORE.md` manda —comentarios del issue
[#6](https://github.com/a81Biz/cauce/issues/6), porque hay plataforma declarada— y el
verificador solo busca `bitacora.md`. Corregirlo pertenece a `PT-001` (`AC-07`) y tocarlo
aquí violaría el scope lock (`FDGE-R20`).

Escribir además `bitacora.md` pondría el error en verde **hoy mismo**, y es exactamente lo que
no voy a hacer: duplicaría el reanclaje en dos sitios, que es lo que `SUITE-R35` prohíbe, y
convertiría una evidencia en un adorno.

`AC-06` se cierra con `PT-001`. Está declarado en la Revisión 1 del [intake](intake.md), en
[strategy.md](strategy.md) y en el manifiesto, con `verified: false`.

## `CasoQA` en `—`

`FQAGE` opera desde un navegador contra una URL desplegada (`QA-R01`) y esto es una herramienta
de línea de comandos. No aplicable, declarado en vez de dejado en blanco.
