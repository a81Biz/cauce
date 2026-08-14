# PT-030 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Responde que produce la fase y que la cierra | E1 E3 | selftest.sh - «deriva que produce la fase» - «nombra tambien la fase siguiente» | salidas/selftest.txt | - | VERIFICADO |
| AC-02 | La compuerta se deriva de la fase | E2 E4 E11 | selftest.sh - «y con que se cierra» - «la compuerta se DERIVA de la fase» - «y G4 sigue siendo humana» | salidas/selftest.txt | - | VERIFICADO |
| AC-03 | Un comentario sin responder bloquea | E5 E6 | selftest.sh - «un comentario sin responder bloquea» - «y lo dice antes que nada» | salidas/selftest.txt | - | VERIFICADO |
| AC-04 | Sin phase, SIN EVALUAR | E7 E9 | selftest.sh - «sin phase declarada, sin evaluar» - «sin allocation no hay trabajo» | salidas/selftest.txt | - | VERIFICADO |
| AC-05 | Lo terminado no tiene siguiente | E8 E10 | selftest.sh - «lo terminado no tiene siguiente» - «las once fases estan declaradas» | salidas/selftest.txt | - | VERIFICADO |
| AC-06 | La regla esta citada donde se lee | E12 E13 E14 | selftest.sh - «SUITE-R48 existe en RULES» - «llega al nucleo» - «y PHASES manda consultarlo» | salidas/selftest.txt | - | VERIFICADO |

## Lo que NO se logro, y no se disimula

El intake humano pedia que el agente «no sepa hacer nada» sin consultar. **Un comando no puede
exigir haber sido llamado**, asi que lo entregado es mas debil: la respuesta existe fuera de la
memoria del agente, es citable, y cuando se equivoque se podra senalar donde decia otra cosa.
Declarado en `strategy.md` y en `out-of-scope.md` en vez de dejarlo pasar por cumplido.
