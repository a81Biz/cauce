# PT-075 — Autorrevisión   `PHASE 6`

## Qué se pidió y qué se entrega

> «llevas dos reglas que no quieres seguir y no hay nada que te lo exija, debemos entonces
> empezar por ahí, por aumentar la exigencia para que lo sigas igual que el resto»

Las dos, con lo que ahora las ejecuta:

| | Regla | Antes | Ahora |
|:---|:---|:---|:---|
| `A` | La compuerta de viabilidad | 0 apariciones en `RULES.md`, `PHASES.md`, `CORE.md` y `verify-fdge` | `FDGE-R54` la enuncia · `PHASE 4` y el prompt de `G2` la citan · `verify-fdge` bloquea en `G2` sin veredicto registrado |
| `B` | «El agente no abre el PR ni lo fusiona» (`SUITE-R42`) | sólo se comprobaba que el PR **exista** | `verify-fdge` detecta trabajo del PT escrito **directamente en la rama de integración**, y exige el comando **descrito** de `EXEC-R07` en `PHASE 9` |

Cobertura mecánica: **112/181 → 113/182**. Ninguna de las dos aparece ya en
`audit --sin-verificar`.

## Lo que la ejecución encontró y la lectura no

**La primera ejecución de la comprobación `B` acusó a trabajo correcto.** Señaló los dos commits
de `PHASE 2`-`4` de esta misma tarea, que están legítimamente en la rama de integración porque
la rama efímera nace en `PHASE 5` (`FDGE-R19`).

Corregido acotando el rango a `<rama-del-PT>..<integración>`: lo anterior a ramificar es
antecesor de la rama y queda fuera; lo escrito **después** de ramificar es el acto que la regla
prohíbe. Los casos `E9` —lo integrado por su PR— y `E10` —sin rama declarada— existen para que
ese falso positivo no pueda volver, y no son decorado: nacieron de haberlo cometido.

Es exactamente lo que `AC-06` prohíbe hacer y estuvo a punto de pasar. Se vio ejecutando.

## Tres desviaciones del procedimiento, y las declaro

**1 · Escribí el código antes que los casos.** `FDGE-R17` manda tests en rojo primero y
`tasks.md` lo tenía como tarea 1. Hice la implementación y los casos después. Lo que sí hice
fue ejecutar cada pieza contra un caso real según la escribía —así apareció el falso positivo—,
pero eso no sustituye al orden: un caso escrito después del código tiende a describir lo que el
código hace, no lo que debería hacer.

**2 · Probé sobre el repositorio real en vez de sobre el fixture.** Para comprobar que `B`
detecta un commit indebido, hice un commit vacío en `trabajo`. Su sitio era `selftest.sh`, y
ahí está ahora (`E8`). El commit se eliminó estando aún sin publicar.

**3 · Y eso destruyó trabajo.** Al deshacer ese commit con `git reset --hard` **se perdieron
todas las ediciones sin commitear**: `RULES.md`, `PHASES.md`, `FDGE-Prompts.md`, `CORE.md`,
`tracker.mjs` y `verify-fdge.mjs`. Se rehízo desde los scripts, y desde entonces se commitea
antes de tocar ninguna rama. No se perdió nada definitivamente porque los scripts que generaban
los cambios estaban fuera del árbol; si hubieran sido ediciones a mano, se habrían perdido.

Las tres son del mismo tipo: **prisa por comprobar, en el sitio equivocado**. Es el patrón que
el `HANDOFF` ya tiene declarado como «probar donde trabajo, no donde se decide», y esta vez el
coste no fue un caso que pasa por vacío sino media hora de trabajo rehecho.

## Lo que NO se verifica, y por qué

**Quién abrió un pull request.** Declarado como `TD-14`, no fingido. El agente actúa con la
identidad git de la persona, así que `gh pr view --json author` devuelve el mismo login lo abra
quien lo abra: un verificador sobre ese campo diría «correcto» siempre. `PT-023` midió ese fallo
—75 % de falsos positivos, cuatro causas, ninguna afinable— y la conclusión fue que un
verificador equivocado se silencia y ocupa el sitio del que haría falta.

Lo que hay en su lugar, `acciones-humanas.md`, tiene el estatuto de una firma (`SUITE-R27`): no
prueba que el agente no ejecutara, pero convierte la afirmación en contrastable.

**Que `FDGE-R54` se cumpla de verdad y no sólo conste.** El verificador comprueba que el
veredicto esté escrito. Que quien lo escribió actuara en consecuencia —trabajo atómico en
`MARGINAL`, parada en `UNSAFE`— no es observable desde el repositorio. `AC-03` lo acota a que la
consecuencia **exista** y sea exigible, no a que se obedezca.

**El `medido_en` de todos los veredictos registrados hoy apunta a la sesión equivocada.**
`viabilidad` lee `SESSION.json`, el huérfano: `tracker sesion` dice `41aeaa8` y `viabilidad`
dice `258be16`. Está fuera de alcance a propósito —es `PT-068` `AC-07` y `PT-074` `AC-04`— y por
eso el campo `medido_en` se registra: cuando se corrija, quedará constancia de contra qué se
midió cada veredicto anterior.

## Delta real contra lo planificado

| | Planificado | Real |
|:---|:---|:---|
| Archivos | 7 | 8 — se añadió `FDGE-Prompts.md`, que `verify-suite` exigió con `SUITE-R20`: una regla citada en `PHASES.md` que el prompt no menciona deja al humano en modo `MANUAL` sin verla |
| Fixture | no previsto | los cuatro PT del fixture llevan ahora `viabilidad`: una regla `HARD` nueva obliga también al proyecto sintético, y sin eso cuatro casos verdes se volvieron rojos |
| Casos | ~12 | 13 |

Ninguna sorpresa de diseño. Las dos adiciones las pidió el propio marco al ejecutarlo.
