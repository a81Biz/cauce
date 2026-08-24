# Descubrimiento — `PT-127`   `PHASE 2`

> Qué se midió, con qué comando, y qué salió. Ninguna cifra de aquí es recordada.

---

## 1 · La clase existe y está medida: dieciséis instancias, ninguna detectada

El intake del lote midió el caso que la abrió —siete commits en una rama y **cero** allocations
vivas— y el ledger conserva las anteriores. Todas comparten la misma propiedad, y no es la de
«el acto fuera del comando»:

| Instancia | Qué pasó | Quién lo cortó |
|:---|:---|:---|
| `PT-082` | commits directos a una rama protegida | la **protección de rama**, no el marco |
| `PT-094` | «empecé a repararlo POR FUERA del marco: sin intake, sin PT y sin issue» | el **firmante** |
| `PT-099` | «me obligó a saltarme el marco **tres veces** en esta misma sesión» | el **firmante** |
| `PT-103` | «cumplir el marco exigía saltársela. Ocurrió **cinco veces**» | el **firmante** |
| `EP-019` | siete commits, cero allocations; se revirtieron tres | el **firmante** |
| esta sesión | dos veces más | el **firmante** |

**Ninguna la detectó un verificador.** Ahí está la diferencia: en «el acto fuera del comando» hay
una herramienta que existía y no se usó; aquí **no hay gobierno en absoluto**. Nada mira.

## 2 · Qué mira hoy `FDGE-R19`, medido

```
$ grep -n "FDGE-R19" docs/methodology/tools/verify-fdge.mjs
```

Tres comprobaciones, y las tres miran el **registro**, no la historia:

- que una tarea viva declare `branch`
- que el nombre de la rama lleve el usuario canónico
- que la topología de ramas encaje en los cuatro tipos

La regla enuncia además el **formato del asunto del commit** —`<type>: PT-XXX`— y **nada lo
comprueba**. No es un olvido pequeño: es la mitad de la regla.

## 3 · La medición que da origen a la tarea

```
$ git log --format='%s' -n 60 | grep -cE '^(feat|fix|docs|chore|refactor|test): EP-'
```

**33 commits recientes citan un LOTE** donde `FDGE-R19` pide un `PT`, más uno con un tipo que la
regla no declara (`revert:`). Treinta y cuatro commits que tocan `docs/methodology/`,
`docs/implementation/` y `changes/` sin citar ninguna allocation, y **ni un solo aviso**.

## 4 · El dato está disponible y es barato

`git log --format=%H %P %s --name-only` da sha, padres, asunto y rutas de una sola llamada.
`REGISTRY.json` dice qué identificadores existen. El cruce es una función pura.

**Que esto no exista después de 126 tareas es la medida de que nadie lo había contado**, no de
que fuera difícil.

## 5 · Lo que el ledger obliga a distinguir

El ledger registra dos cosas que **no son la misma** y que un detector ingenuo confundiría:

- **ELEGIDO** — el agente rodeó el marco pudiendo no hacerlo.
- **FORZADO** — el marco *obligó* a rodearlo porque la herramienta no podía cumplirlo. `PT-103`
  es literal: *«cumplir el marco exigía saltársela»*.

Tratar los dos igual acusaría a quien no tenía alternativa, y escondería que **lo que hay que
arreglar es la herramienta**. Por eso `AC-04` existe.

## 6 · Lo que NO se puede medir, y se dice

Saber si un identificador estaba vivo **en el momento de aquel commit** exigiría leer el
`REGISTRY.json` de cada commit. Eso convierte una comprobación en una arqueología: se decide con
lo que el registro sabe **hoy**, y el límite se declara en el diseño y en `AC-05`.
