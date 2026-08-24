# Trazabilidad — `PT-129`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | FDGE-R19 enumera todos los tipos de rama o remite al documento que los declara | `TS-01` `TS-02` `TS-03` | `verify-suite` · `core:check` | `salidas/verify.txt` |
| AC-02 | Existe una comprobacion que ENUMERA las ramas reales y las contrasta con la topologia | `TS-07` `TS-10` | `selftest.sh:las cuatro de la topologia encajan` | `salidas/casos.txt` |
| AC-03 | Una rama efimera cuya tarea esta terminal se reporta | `TS-08` | `selftest.sh:efimera sobre tarea terminal ⇒ se nombra` | `salidas/casos.txt` |
| AC-04 | Una rama que no encaja en ningun tipo se nombra, no se ignora ni se borra sola | `TS-07` `TS-12` | `selftest.sh:rama fuera de la topologia ⇒ se nombra` | `salidas/casos.txt` |
| AC-05 | La comprobacion informa y NO borra | `TS-12` | `selftest.sh:rama fuera de la topologia ⇒ se nombra` | `salidas/verify.txt` |
| AC-06 | La proyeccion cauce/usuario NO se reporta como sobrante | `TS-09` | `selftest.sh:las cuatro de la topologia encajan` | `salidas/casos.txt` |
| AC-07 | El type de una rama tiene UN SOLO vocabulario, el que LEXICON declara | `TS-01` `TS-06` | `selftest.sh:ramaDeTarea deriva del type del item` | `salidas/rama-con-tipo.txt` |
| AC-08 | Sin type, ramaDeTarea NO inventa: devuelve null y quien llama lo dice | `TS-04` `TS-05` | `selftest.sh:sin type no hay nombre de rama` | `salidas/rama-sin-tipo.txt` |
| AC-09 | Un comando escribe allocations[].branch, que FDGE-R19 exige desde PHASE 5 | `TS-13` | `tracker rama PT-129 --declarar` | `salidas/verify.txt` |

**Nueve criterios, nueve con `TS`, nueve con evidencia ejecutada.** Ningún Orphan Criterion.

---

## `AC-09` y `TS-13` salieron de `PHASE 5`

No estaban en la propuesta. Los descubrió **la propia comprobación acusándome**: *«PT-129 está en
`PHASE 5` y no declara rama»*. Al ir a declararla salió que **ningún comando escribe ese campo** —
47 de 151 lo llevan, todas a mano.

`TS-13` = `tracker rama PT-129 --declarar` escribe la rama **real** en el registro y `verify-fdge`
pasa de `!` a `✓ rama declarada`.

Se declaran como ampliación en vez de aparecer en el diff sin explicación, igual que `AC-07` y
`AC-08`, que salieron de `PHASE 2`.

## La evidencia que decide

`salidas/verify.txt`:

```
! FDGE-R19  topologia de ramas: 2
    «desarrollo»                     no encaja en ninguno de los cuatro tipos
    «fix/…/PT-081-una-regla-nueva-…» sigue viva y PT-081 esta INTEGRATED
```

Las dos se sabían **por conversación**. Ahora las dice una comprobación, y en `G4` bloquean.

Y `salidas/rama-sin-tipo.txt` es la inversa de `AC-08` contra el árbol de verdad: `PT-125` no
tiene `type` por el defecto de `PT-124`, y la herramienta **dice que falta** en vez de inventar un
`chore/`.
