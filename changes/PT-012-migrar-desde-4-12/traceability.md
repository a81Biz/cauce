# PT-012 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Enumera lo que un 4.x necesita | TS-01 TS-05 | selftest.sh · «4.12 ⇒ pide el bloque ESTADO» · «con ESTADO ya escrito, no lo pide» | salidas/legado-informe.txt | — | VERIFICADO |
| AC-02 | Dice qué llega nuevo | TS-02 | selftest.sh · «4.12 ⇒ enumera lo que llega» | salidas/legado-informe.txt | — | VERIFICADO |
| AC-03 | La plataforma es opcional | TS-03 TS-07 | selftest.sh · «ofrece la plataforma» · «con plataforma ⇒ pide sincronizar» · «sin plataforma ⇒ no exige el PR» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-04 | Menciona SECRETOS-EXCEPCIONES.md | TS-04 | selftest.sh · «4.12 ⇒ menciona las excepciones» | salidas/selftest-despues.txt | — | VERIFICADO |
| AC-05 | Lo que exige criterio humano no se inventa | TS-01 | El bloque ESTADO se pide, no se escribe | salidas/legado-informe.txt | — | VERIFICADO |
| AC-06 | Un proyecto ya en 6.x no ve el tramo | TS-06 | selftest.sh · «ya en 6.x, el tramo no aparece» | salidas/selftest-despues.txt | — | VERIFICADO |

## Medido contra el proyecto legado

```
antes   1 acción pendiente
ahora   7, todas detectadas sobre SU estado — incluido que EP-009 y EP-014 no declaran fase
```

## Lo que no está verificado, declarado

Que ejecutar la migración entera deje ese proyecto en verde. No puede comprobarse sin migrarlo,
y migrarlo está en el out-of-scope del lote.
