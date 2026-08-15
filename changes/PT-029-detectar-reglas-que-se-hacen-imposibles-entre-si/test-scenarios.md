# PT-029 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `--gate G1` sobre un PT en `PHASE 1` con su intake | **no** exige `manifest.json`, `self-review.md` ni `HISTORY.log` |
| E2 | AC-01 | `--gate G2` sobre un PT en `PHASE 4` | idem |
| E3 | AC-01 | `--gate G3` sobre un PT en `PHASE 7` con manifiesto y self-review | **no** exige `HISTORY.log` |
| E4 | AC-01 | `--gate G4` sobre un PT sin `HISTORY` | **sí** lo exige: `G4` no pierde nada |
| E5 | AC-01 | `--gate G4` sobre un PT sin manifiesto | **sí** lo exige |
| E6 | AC-02 | `exigibleEn` sin compuerta | `false` para todo: sin compuerta no se exige nada |
| E7 | AC-02 | La fase declarada en `EXIGIBLE_DESDE` y la compuerta que le toca | coherentes: la compuerta es la primera **posterior** a la fase |
| E8 | AC-03 | `verify-fdge.mjs` contiene `if (gate) fail(` | **no aparece**: ninguna comprobación se activa con cualquier compuerta |
| E9 | AC-03 | …y el propio caso no pasa por vacío | el archivo se lee y tiene contenido |

`E7` es el que hace que `EXIGIBLE_DESDE` no sea una tabla de números que hay que creerse: comprueba
la **relación** entre la fase y la compuerta, no el valor. Si alguien pone `manifest.json` en `G1`
«porque sí», el caso cae aunque la tabla sea internamente consistente.

`E8` es el entregable real de la tarea: caza la **forma**, no los tres casos. `E9` existe porque
un `chkno` sobre un archivo ilegible pasaría por vacío — el mismo verde falso que `PT-023` encontró.

## Lo que ningún caso puede comprobar

**La otra familia de choque.** `E8` caza que una comprobación se active con cualquier compuerta.
No caza dos reglas que se contradicen **sin fases de por medio**, que es la familia de los cinco
casos que motivaron esta tarea:

```
SUITE-R09 prohíbe editar una entrada de HISTORY
FDGE-R29  prohíbe una segunda entrada
la comprobación leía siempre la primera
⇒ un ledger mal formado era irreparable            (PT-046, EP-012)
```

No hay fase de por medio: hay dos prohibiciones que se cierran mutuamente. Detectarlo exigiría
razonar sobre el **contenido** de las reglas.

**Y `E8` caza la forma literal.** `if (gate !== undefined)` o `if (gate?.length)` expresan lo mismo
y no caen. Ampliar la lista de formas es perseguir el idioma —lo que `SUITE-R44` ya decidió no
hacer— y el sinónimo que falte no se ve hasta que algo ya se perdió.

Se dice porque cerrar esta tarea afirmando que «los choques ya se detectan» sería el verde por
omisión que el marco entero persigue. Se detecta **una** forma de **una** familia.
