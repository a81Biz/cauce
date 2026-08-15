# PT-047 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

La topología de ramas está escrita, en tres niveles, y `verify-fdge` **mira la rama por primera
vez**:

```
<type>/PT-NNN-slug  →  trabajo  →  main
   PR de la tarea       G4 · una por lote, humana
   revisión, NO G4
```

```
selftest   456 → 466 casos
grep "Rama:" verify-fdge.mjs   antes: 0 líneas
```

Y esta tarea **estrena lo que introduce**: corre sobre `fix/PT-047-ningun-pt-ha-creado-su-rama`,
la primera rama por tarea en 47.

## El supuesto que asumí, y que confirmaste

`PHASE 2` dejó dos topologías posibles y **no eran equivalentes para ti**: rama a `main` habría
convertido `G4` en una compuerta **por tarea** —ocho en `EP-013`—. Asumí `trabajo`, lo declaré en
`strategy.md` con `EXEC-R03` y `FDGE-R33` detrás, y lo pregunté antes de implementar. Dijiste
«sí, es correcto».

Lo escribo aquí porque si no lo hubieras confirmado, todo lo demás de esta tarea estaría mal, y
un revisor tiene derecho a saber que la decisión no fue mía.

## Lo que solo se vio ejecutando

**1 · El aserto inverso pasaba por el motivo equivocado.** `chkno "con rama declarada, silencio"`
buscaba el **ID de la regla**, y con rama declarada la regla emite su `OK` — así que el caso
detectaba lo contrario de lo que decía. Es el mismo defecto que `SUITE-R42` cazó en `PT-043`, y
está anotado en el código junto al arreglo. **Segunda vez en dos lotes.**

**2 · El fixture representaba un estado imposible:** cuatro PT en `PHASE 8` y ninguno con rama.
La regla nueva los puso en rojo con razón. Un arnés que describe un estado que el marco prohíbe
certifica cualquier cosa.

## Lo que un revisor debería atacar

**1 · No hace que nadie cree la rama.** Hace que **no declararla se vea**. Es el mismo límite que
`SUITE-R54` y `SUITE-R55` declaran de sí mismas, y lo digo antes de que se señale.

**2 · Declarar la rama y crearla son dos cosas.** Nada comprueba que `REGISTRY.branch` corresponda
a una rama que exista en git. Podría escribirse un nombre inventado. No lo cierro porque
comprobarlo exige hablar con git desde el verificador, y eso es una decisión de alcance.

**3 · `G4` sigue sin multiplicarse, pero ahora hay un merge más por tarea.** El PR a `trabajo` no
es una compuerta del marco: es revisión. Un revisor puede sostener que un merge sin compuerta es
una puerta abierta. Mi respuesta: `trabajo` no es la línea principal, `verify-fdge --gate G4`
sigue corriendo entera sobre el lote, y `EXEC-R03` dice explícitamente que el lote existe para
que el humano decida dos veces por lote.

**4 · Los 46 PT integrados siguen diciendo `Rama: trabajo`** en `HISTORY.log`, y es verdad: es
donde se hicieron. No se retrofecha nada.

## Lo que NO he verificado

Que la rama por tarea mejore la revisión. Es la razón por la que el marco la pide, y no se puede
medir desde aquí — se medirá cuando alguien revise un PR de tarea y encuentre algo que en un PR
de lote se le habría pasado.

## Checklist

- [x] Todos los `AC` verificados con evidencia en disco
- [x] Sin huérfanos en `traceability.md`
- [x] El código hace lo que dice `design.md`
- [x] Delta registrado (arriba: el aserto y el fixture)
- [x] Sin regresiones: `selftest` 466/466 · `verify-suite` sin errores · `build-core --check`
- [x] `11-Conventions.md` respetado
- [x] Commits atómicos con `PT-047` en el mensaje
- [x] Sin restos de depuración
- [x] `out-of-scope.md` intacto: ninguna rama retroactiva, ningún `origin/desarrollo` borrado
- [x] Sin problemas de seguridad evidentes (`FDGE-R45`)
- [x] Contrato público: `verify-fdge` conserva interfaz y códigos de salida
- [x] **Y la tarea siguió su propia regla**: rama creada en `PHASE 5` y declarada en el registro

SELF_REVIEW_COMPLETE
