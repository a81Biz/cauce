# Trazabilidad — `PT-124`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | TIPOS_DE_ITEM deriva del vocabulario canonico, no de una lista a mano | `TS-01` | `selftest.sh:los cinco tipos son los de LEXICON 8.1` | `salidas/casos.txt` |
| AC-02 | `asignar --tipo INVESTIGATION` y `--tipo CHORE` funcionan | `TS-02` | `tracker asignar --tipo INVESTIGATION --ver` | `salidas/tipos.txt` |
| AC-03 | El mensaje deja de atribuir a LEXICON una lista que no contiene | `TS-03` | `tracker asignar --tipo CHANGE --ver` | `salidas/tipos.txt` |
| AC-04 | CHANGE y TAREA se resuelven: SALEN, y se dice por que | `TS-04` | `selftest.sh:…y los dos de las plantillas ya no` | `salidas/casos.txt` |
| AC-05 | PT-125 y PT-126 reciben su type CON EL COMANDO | `TS-05` | `tracker tipo PT-125` · `tracker tipo PT-126` | `salidas/tipos.txt` |
| AC-06 | verify-suite compara la constante con LEXICON 8.1 y falla si divergen | `TS-06` | `selftest.sh:la constante divergente de LEXICON falla` | `salidas/casos.txt` |

**Seis criterios, seis con `TS`, seis con evidencia ejecutada.**

## Lo que declaré como `AC` y no lo era

La primera versión tenía un séptimo criterio —«`asignar` escribe también `suite_version`»— marcado
como **no hecho**. `FDGE-R15` lo rechazó al primer intento: *«AC-06 sin escenario de test (Orphan
Criterion)»*.

Tenía razón. **Un `AC` es lo que la tarea entrega**; lo que se declara sin hacer va a
`out-of-scope` con su destino, que es donde `SUITE-R44` lo exige. Usar un criterio como sitio para
declarar convierte la trazabilidad en prosa.

Movido a `out-of-scope.md` → `PT-121`.

## La evidencia que decide

`AC-06` · `salidas/casos.txt`:

```
✓ la constante divergente de LEXICON falla
```

La inversa **rompe la constante en el fixture** y comprueba que `verify-suite` lo caza. La primera
versión de este caso buscaba el texto en el fuente — **eso no comprueba nada**, y lo dice el propio
`selftest.sh` treinta líneas más arriba: *«un ID en un texto que nunca se imprime no cita nada»*.

## Lo que arrastró al cerrarse

```
PT-125  type: INVESTIGATION  ->  DISCOVERY.md        ✓ FDGE-R31
PT-126  type: CHORE          ->  REFACTOR_SCOPE.md   ✓ FDGE-R31
```

Eran los **dos únicos errores** del árbol tras firmar el lote, y se cerraron sin tocarlos.
