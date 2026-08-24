# Trazabilidad — `PT-115`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | LEXICON define PARADA con sus dos listas CERRADAS y su destino | `TS-01` `TS-02` | `selftest.sh:LEXICON declara la parada` | `salidas/casos.txt` |
| AC-02 | RULES define FDGE-R55 con su severidad y su fila en RIGE_DESDE | `TS-03` `TS-04` | `selftest.sh:FDGE-R55 declara desde cuando rige` | `salidas/casos.txt` |
| AC-03 | FDGE-R52 queda como CASO PARTICULAR sin perder ninguna obligacion | `TS-05` | `selftest.sh:FDGE-R52 cita que es su caso particular` | `salidas/casos.txt` |
| AC-04 | La parada vive en el MISMO destino que la nota de reanclaje | `TS-01` | `selftest.sh:LEXICON declara la parada` | `salidas/casos.txt` |
| AC-05 | CORE.md regenerado la lleva | `TS-06` | `selftest.sh:la parada llega a CORE.md` | `salidas/casos.txt` |
| AC-06 | PHASES la nombra y los prompts la explican | `TS-07` | `verify-suite` | `salidas/suite.txt` |

**Seis criterios, seis con `TS`, seis con evidencia ejecutada.**

## `AC-06` salió de una comprobación, no de mí

`SUITE-R20`: *«PHASES.md cita 3 reglas que FDGE-Prompts.md no menciona: FDGE-R55, LEX-R30,
SUITE-R04. **El humano en modo MANUAL no las vería.**»*

Escribir la regla en `PHASES` sin escribirla en los prompts la habría dejado invisible para quien
trabaja a mano — que es justo quien más la necesita.

## La evidencia que decide

`salidas/casos.txt`:

```
✓ FDGE-R55 declara desde cuando rige
✓ ninguna fila mira mas alla de la version que entra
```

La primera impide que la regla juzgue las 131 tareas cerradas antes de existir. La segunda es el
caso que **decidió la versión del lote**, y que estaba mal: tenía la cifra quemada.
