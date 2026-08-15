# PT-023 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-03 | `FDGE-Prompts.md` dice «vocabulario cerrado» | aparece |
| E2 | AC-03 | …y dice que la cita es **recíproca** | aparece |
| E3 | AC-03 | …y nombra `—` como uno de los dos valores admitidos | aparece |
| E4 | AC-03 | El párrafo de `SUITE-R44` ya **no** dice «normalmente» | no aparece |
| E5 | AC-04 | `verify-suite` sobre la metodología | sin errores: el texto **cita**, no legisla |
| E6 | AC-01 | Reejecutar `auditar-spec-changes.mjs` sobre el repositorio | recorre **todas** las `spec-changes.md`, y el total de filas y el de candidatos salen de contarlas |
| E7 | AC-02 | …y su salida en el caso de un candidato | lo **enumera** con PT, documento y cambio declarado; no da solo una cifra |

`E6` y `E7` se comprueban **reejecutando** el script que produjo la medida, que se versiona con
la evidencia en `evidence/PT-023/auditar-spec-changes.mjs` precisamente para eso: una medida que
no se puede repetir es una afirmación. Las cifras concretas —110 filas, 4 candidatos— **no** se
asertan: cambian con cada PT nuevo, y fijarlas sería el hecho copiado que `RULE-01` persigue. Lo
que se comprueba es la **forma**: que cuente sobre todas y que enumere en vez de resumir.

## Lo que ningún caso puede comprobar

**Que una declaración de `spec-changes.md` se haya cumplido.** No es un hueco de esta tarea: es
una propiedad de la declaración, y está **medida** en `discovery.md` —110 filas, 4 candidatos,
3 falsos positivos—.

Las dos causas de falso positivo son estructurales y no se afinan:

1. el trabajo de un PT puede entrar bajo un commit del **lote**;
2. una declaración puede cumplirla **otro PT**, y sigue cumplida.

`E1`–`E4` comprueban el **contenido de un documento**, no la regla general. Es menos de lo que
sería deseable y es todo lo que se puede afirmar sin mentir: un control que se equivoca tres de
cada cuatro veces no verifica, solo mete ruido con firma.
