# PT-006 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`SUITE-R42` en `RULES.md`: si el proyecto declara plataforma, `G4` se resuelve sobre un pull
request abierto, y `verify-fdge --gate G4` lo exige. `PHASES.md` deja de declarar el milestone
y cita la regla. `tracker` gana `pr`, de solo lectura.

## Resultado

```
selftest                       219 → 227 casos, 0 fallos
verify-suite                   sin errores de coherencia
verify-fdge --gate G4 PT-005   ✓ SUITE-R42 · el merge se propone sobre un pull request abierto
CORE.md                        230 reglas (eran 229)
```

## Lo que un revisor debería atacar

**1 · Añadí una regla vinculante.** No es capacidad: cambia lo que un proyecto debe tener para
cumplir `G4`. Está acotada a proyectos que declaran plataforma, pero **la versión de este lote
no puede ser `MINOR`** y eso hay que decidirlo en el cierre. Lo dejé declarado en el intake del
lote antes de escribir una línea.

**2 · La comprobación mira la rama actual.** Si alguien ejecuta `--gate G4` desde otra rama, no
encuentra PR y falla. Es lo correcto —`G4` se resuelve sobre la rama que se fusiona— pero el
mensaje no lo dice con esas palabras.

**3 · `tracker pr` no comprueba a qué base apunta el PR.** Un PR de `trabajo` a otra rama
contaría. En este repositorio solo existe `main` como base; en uno con varias, no basta.

**4 · Dos casos existentes se sustituyeron, no se relajaron.** Uno exigía `milestone` en
`PHASES.md` — afirmaba el contrato que esta tarea retira, y mantenerlo habría perpetuado el
defecto. El otro fijaba `/ 167` en la cobertura y se rompió al hacer 168 reglas: **lo escribí
yo, en el mismo PT que había declarado que las cifras no se fijan**. Ahora comprueba forma.

## Lo que NO he verificado

- **Que `--gate G4` falle sin PR contra GitHub de verdad.** El caso del arnés cubre «sin
  plataforma»; el «con plataforma y sin PR» solo se puede ver en una rama sin PR, y esta tiene
  el #7. Queda declarado, no simulado.

SELF_REVIEW_COMPLETE
