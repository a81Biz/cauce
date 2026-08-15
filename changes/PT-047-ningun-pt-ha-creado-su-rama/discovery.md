# PT-047 — Descubrimiento   `PHASE 2` · `2-B`

## Qué manda el marco, con archivo y línea

| Dónde | Qué dice |
|:---|:---|
| `PHASES.md:189` | `PHASE 4` propone la rama: `fix\|feature\|refactor\|chore\|investigate\|hotfix /PT-XXX-slug` — **y no la crea** |
| `PHASES.md:198` | `PHASE 5` paso 1: `git checkout -b <type>/PT-XXX-slug` |
| `RULES.md` `FDGE-R22` | El carril `HOTFIX` **obliga** a `hotfix/PT-XXX-slug`. Es la única mención de una rama en `RULES.md` |
| `FDGE-Prompts.md` `PHASE 8` | El formato canónico de `HISTORY.log` declara `Rama: <type>/PT-XXX-slug` |

## Qué hace el repositorio

```
git branch -a          main · trabajo   (mas origin/desarrollo, que sobra: TD-06)
HISTORY.log            «Rama: trabajo» en las 46 entradas
CLAUDE.md §Ramas       declara DOS ramas y ninguna por tarea
```

**El `CLAUDE.md` contradice a `PHASE 5` por escrito**, y `SUITE-R00` dice que un `CLAUDE.md`
**no puede derogar una regla**. La contradicción no es un descuido de uso: está firmada en el
documento que declara no poder hacerlo.

## Por qué nadie lo vio en 46 tareas

Nada lo comprueba. `verify-fdge` no mira la rama en ningún sitio:

```
grep -n "Rama:" tools/verify-fdge.mjs   →  sin resultados
```

El campo `Rama:` del formato canónico es uno de los **ocho que nadie verifica** —el mismo hueco
que `PT-046` declaró y que `PT-016` tiene abierto—. Se escribe, se lee y no se contrasta con
nada.

## Lo que de verdad hay que decidir, y no es «crear la rama»

Crear la rama es una línea. Lo que no está escrito **en ningún sitio** es la **topología**:

```
1 · ¿a donde mergea una rama de PT?      ¿a «trabajo», o directo a «main»?
2 · ¿donde se resuelve G4?               SUITE-R42 exige un PR «para la rama», y
                                          verify-fdge lo comprueba sobre la rama ACTUAL
3 · ¿cuantas compuertas humanas hay?     hoy una por lote; con rama por PT podrian
                                          ser una por tarea — ocho en EP-013
4 · ¿que pasa con SUITE-R46?             habla de «la rama por defecto», y con dos
                                          niveles de merge hay dos «por defecto» posibles
```

`SUITE-R42` y `SUITE-R46` se escribieron con **un solo nivel de merge** en la cabeza. Con rama
por PT hay dos, y ninguna de las dos reglas dice cuál es el suyo.

## El riesgo que esto destapa

Si una rama de PT mergea a `main`, entonces `G4` es **por tarea** y `EP-013` pasa a tener ocho
compuertas humanas en vez de una. Eso no es un detalle de implementación: **multiplica por ocho
lo que se le pide al firmante**, y `EXEC-R03` dice que un lote existe justamente para que el
humano decida dos veces por lote y no cuatro por PT.

Si mergea a `trabajo`, `G4` sigue siendo una por lote y la rama de PT es una unidad de revisión,
no de integración — pero entonces `SUITE-R42` («`G4` se resuelve sobre un PR abierto para la
rama») necesita decir **para qué rama**.

## Lo que NO se puede hacer

**Rehacer las ramas de los 46 PT ya integrados.** La historia no se reescribe (`SUITE-R06f`), y
un `Rama:` retroactivo sería el mismo rastro falso que este lote ya rechazó dos veces.
