# PT-063 — Estrategia   `PHASE 3`

## Lo que se construye

```
FDGE-R19                  el formato pasa a <type>/<usuario>/PT-NNN-slug
ramaDeTarea(...)          pura · la propone, con el canónico de PT-061
tracker rama PT-NNN       dice cómo se debe llamar · no la crea
verify-fdge               AVISA si una rama viva no lleva usuario
```

## La decisión difícil: avisar, no fallar

`PHASE 2` dejó la pregunta abierta: si nada comprueba el formato, ¿se comprueba ahora?

| Opción | Qué pasa |
|:---|:---|
| **Fallar** | Las 22 ramas existentes son de dos niveles: fallarían **todas**. Rompe `AC-04` |
| **Nada** | La regla sigue siendo un texto que nadie aplica — el defecto que `FDGE-R19` **documenta de sí misma** |
| **Avisar** | Se ve, no bloquea, y las existentes siguen valiendo |

**Avisar**, y con una condición que lo hace honesto: el aviso **dice desde cuándo aplica**. Una
rama creada antes de `8.3.0` no es un incumplimiento — es una rama de antes.

Lo que **no** se hace es fallar «a partir de la próxima versión»: una comprobación que cambia de
severidad con el tiempo es una que nadie puede razonar. Si algún día debe bloquear, será una
decisión declarada, no un temporizador.

## El usuario sale de `PT-061`, no de `git config`

```
Alberto Martínez  →  personaLocal  →  nombre canónico  →  alberto-martinez
```

Es `AC-05`, y el motivo lo midió `PT-061`: desde la máquina que produjo los 9 commits de `a81Biz`,
leer `git config` a pelo habría dado `chore/a81biz/PT-063-…` — otra rama, para la misma persona.

**Sin `personas` declaradas**, el usuario sale de `git config` como hoy y la rama sigue siendo de
dos niveles. Un proyecto de una persona no cambia nada.

## `trabajo` y `G4` no se tocan, y se comprueba

`AC-02` y `AC-03` son criterios sobre lo que **no** debe pasar, y esos son los que más fácil se dan
por buenos sin mirar. Se comprueban:

- No existe `trabajo/<usuario>` en ninguna parte del marco.
- `verify-fdge --gate G4` sigue exigiendo **un** PR para la rama por defecto — el del lote.
- `EXEC-R03` sigue diciendo que `G4` es una por lote.

## La rama se **propone**, no se crea

`tracker rama PT-NNN` dice cómo debe llamarse y **no ejecuta `git checkout`**. Crear una rama es
tocar el árbol de trabajo, y `PT-054` ya decidió que la herramienta no lo hace: si falla a mitad,
deja a quien la usa en otro sitio.

Además, `EXEC-R07` dice que lo que no se automatiza **se describe**. Esto lo describe.

## Lo que NO se hace

**No se renombra ninguna rama.** Romperían los PR abiertos sobre ellas. `AC-04`: una rama abierta
**se termina como empezó**.

**No hay `trabajo/<usuario>`.** Decisión 3 del firmante: un cuarto nivel obligaría a decidir quién
integra el trabajo de quién antes de `trabajo`.

**No se multiplica `G4`.** `EXEC-R03`: una por lote. Por persona serían ocho compuertas en un lote
de ocho tareas.

**No se toca `cauce/<usuario>`.** Esa es la rama derivada de `PT-054` y ya lleva usuario; son cosas
distintas y las dos siguen.

## El riesgo

Que el aviso se vuelva ruido: si cada verificación de cada tarea antigua lo repite, se ignora. Por
eso el aviso es **por PT vivo**, no por rama del remoto — y las tareas terminadas no se revisan,
con el mismo criterio con que `FDGE-R19` y `FDGE-R52` se acotaron: *pedir una rama a 46 tareas
integradas es pedir que se invente*.
