# PT-075 — Estrategia   `PHASE 3`

## `A` · la viabilidad

| # | Opción | Por qué no / por qué sí |
|:--|:---|:---|
| A1 | Citar `LEXICON` §6.5d desde `PHASES.md` y nada más | **No.** `LEX-R22`: una fase **cita** obligaciones, no las crea. Sin regla en `RULES.md` no hay nada que citar, y `verify-suite` reporta la cita colgante |
| A2 | Regla nueva en `RULES.md` + cita en `PHASES.md` + verificador | **Sí.** Es el camino que el propio marco define para una obligación nueva |
| A3 | Que `tracker avanzar` lo calcule y lo escriba solo, sin regla | **No.** Automatizarlo sin obligarlo lo deja como hoy: si alguien no usa `avanzar`, no ocurre. Y una compuerta que se cumple sola no es una compuerta |

**Elegida: A2.** Regla nueva `FDGE-R54`. Es `FDGE` y no `EXEC` porque gobierna el **ciclo de
vida de una tarea**, no el modo de ejecución.

**Dónde se exige.** En `G2`, no en `G1`. `PT-059` es «no empezar lo que no se puede terminar»,
y lo que se empieza es la **implementación**: en `G1` la tarea todavía no tiene complejidad
propuesta —la propone `PHASE 2`— y sin complejidad no hay coste típico con el que comparar.
Antes de `G2` se **avisa**; en `G2` **bloquea**.

**Cómo se registra.** `REGISTRY.allocations[].viabilidad`, escrito por
`tracker viabilidad PT-NNN --registrar`. Todos sus campos se **derivan** —veredicto, coste,
naturaleza, la marca de sesión contra la que se midió— así que `LEX-R26` se cumple: no hay
ninguno que sólo pueda rellenar la memoria.

## `B` · el acto del agente hacia la plataforma

| # | Opción | Por qué no / por qué sí |
|:--|:---|:---|
| B1 | Comprobar el autor del PR con `gh pr view --json author` | **No como prueba.** El agente actúa con la identidad git de la persona: devuelve el mismo login en los dos casos. Sería un verificador que dice «correcto» siempre |
| B2 | Prohibir al agente ejecutar `git push` con un hook | **No.** Un hook vive en la máquina, no en el repositorio versionado, y `SUITE-R06f` no automatiza esa clase de cosas. Además no es lo que la regla pide |
| B3 | Detectar la **consecuencia**: un PT con rama declarada cuyos commits están directamente en la rama de integración | **Sí.** Mecánico, sin falsos positivos y es exactamente el daño que la regla evita |
| B4 | Exigir el **comando descrito** que `EXEC-R07` manda escribir | **Sí, y complementa a B3.** Si el agente ejecutó en vez de describir, la descripción falta: la omisión se ve |

**Elegidas: B3 y B4.** Y **B1 se declara no comprobable** en `10-Technical-Debt`, con su motivo.

**Por qué B3 no tiene falsos positivos.** Sólo mira PTs que **declaran rama** en
`REGISTRY.allocations[].branch`. Las tareas anteriores a la `8.3.0` no la declaran y quedan
fuera, con el mismo criterio de `FDGE-R19`: *«pedir una rama a 46 tareas integradas es pedir que
se invente»*. Y un PR fusionado aparece en `--first-parent` como **un commit de merge**, así que
el trabajo legítimamente integrado no cuenta como escritura directa.

## El riesgo, nombrado

**Fabricar un verificador que no puede funcionar.** Es el riesgo central de esta tarea, porque la
petición es «que algo lo exija» y la tentación es escribir algo que parezca exigirlo.

Se contiene declarando por escrito, **antes** de programar, qué es comprobable y qué no — la
tabla está en `discovery.md` — y llevando lo tercero a `10-Technical-Debt` en vez de a un
`fail()` que siempre pase.

## Alcance del cambio

```
docs/methodology/RULES.md                FDGE-R54, regla nueva
docs/methodology/PHASES.md               la cita en PHASE 4
docs/methodology/CORE.md                 REGENERADO por build-core, no editado
docs/methodology/tools/verify-fdge.mjs   FDGE-R54 y la segunda mitad de SUITE-R42
docs/methodology/tools/tracker.mjs       viabilidad --registrar
docs/methodology/tools/selftest.sh       los casos y la inversa
docs/enterprise-documentation/10-Technical-Debt.md   lo que NO es comprobable
```

Regla nueva ⇒ **`MINOR`** en `CHANGELOG`, no `PATCH`. Lo fija el lote al cerrar.
