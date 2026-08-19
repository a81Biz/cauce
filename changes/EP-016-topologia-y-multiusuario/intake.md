# EP-016 — Topología y multiusuario

```yaml
---
id: EP-016
created: 2026-08-18
status: IN_PROGRESS
mode: SUPERVISED
origin: DIRECT
---
```

## 1. Objetivo común   `[HUMANO]`

> **Decisión 2 del firmante, 2026-08-15:** «los IDs multiusuario se reparten por **rangos
> reservados**, sin tocar `SUITE-R08` ni namespacear el identificador».
>
> **Decisión 3:** «el usuario vive en la **rama de tarea** y `trabajo` sigue siendo única, para no
> añadir un cuarto nivel ni multiplicar `G4` contra `EXEC-R03`».
>
> **Y decisión 5, sobre el orden:** «`EP-014` fontanería → `EP-015` continuidad → `EP-016`
> topología, porque el último es el único que rompe compatibilidad».

Que **dos personas puedan trabajar sobre el mismo repositorio sin pisarse** — ni en los
identificadores, ni en las ramas, ni en el estado.

`EP-014` dejó la fontanería y `EP-015` la continuidad. Los dos asumen **una sola persona**, y lo
asumen en sitios que no se ven: el contador de `PT` es único, `SESSION.json` es uno, el precedente
sale de «los commits del día» sin mirar de quién son.

## 2. Criterio de éxito del lote   `[HUMANO]`

> Dos personas abren tarea el mismo día, cada una en su rama, y **nada de lo que el marco deriva
> mezcla su trabajo**: ni el identificador que les asigna, ni la sesión que miden, ni el coste que
> les dice, ni la compuerta que decide por ellas. Y `G4` **sigue siendo una** por lote.

## 3. Lo que este lote hereda medido, no supuesto

**La identidad no es un campo: es un problema de reconciliación.** Medido al abrir el lote, en
este repositorio de **una** persona:

```
217 commits   Alberto Martínez <alberto@a81.biz>
  9 commits   a81Biz <albe.mtz@gmail.com>
  1 commit    Alberto Martínez <albe.mtz@gmail.com>
```

Tres identidades para la misma persona. `ramaDe(usuario)` (`PT-054`) usa `git config user.name`,
que da **una** de las tres según la máquina. Con dos personas esto no es un detalle: es la base de
todo lo demás, y por eso `PT-061` va primera.

**Y dos huecos que `EP-015` declaró y no cerró**, con sus palabras:

- «`SESSION.json` es de **una** sesión: al abrir se sobrescribe. Con dos personas trabajando eso no
  basta.» → `PT-065`
- «El día de dos personas son dos sesiones que `porSesion()` cuenta como una, y el techo histórico
  —del que depende `AC-06` de `PT-059`— sale **inflado**.» → `PT-064`

## 4. Las cinco tareas   `[AGENTE]`

| PT | Sev | Qué resuelve |
|:---|:---|:---|
| `PT-061` | S1 | **Quién es quién**: la identidad se declara en el registro y se reconcilia con git |
| `PT-062` | S1 | **Rangos reservados**: el registro sigue asignando, sin namespacear el ID |
| `PT-063` | S1 | **El usuario en la rama de tarea**: `<type>/<usuario>/PT-NNN-slug` |
| `PT-064` | S2 | **De quién es cada commit**: coste, precedente y techo dejan de mezclar personas |
| `PT-065` | S2 | **La sesión es de alguien**: `SESSION.json` deja de ser uno para todos |

**El orden no es preferencia.** `PT-061` va primera porque las otras cuatro necesitan saber quién
es quién, y hoy no se puede: la misma persona tiene tres identidades. `PT-063` va tercera porque es
la única que **rompe compatibilidad** —toca `FDGE-R19`— y conviene tener la identidad resuelta y
los rangos funcionando antes de mover las ramas.

## 5. Lo que este lote va a romper, dicho antes de empezar   `[AGENTE]`

`FDGE-R19` fija hoy la rama de tarea como `<type>/PT-NNN-slug`. `PT-063` la cambia a
`<type>/<usuario>/PT-NNN-slug`.

**Eso es `MAJOR`** (`SUITE-R19`), y obliga a **guía de migración**: los proyectos ya instalados
tienen ramas vivas con el formato anterior. La guía tiene que decir qué pasa con ellas — y la
respuesta por defecto es **nada**: una rama abierta se termina como empezó, y el formato nuevo
aplica a las que nazcan después.

Se declara aquí, en `PHASE 1`, porque descubrirlo en `PHASE 8` es lo que `FDGE-R22` existe para
impedir.

## 6. Análisis de solapamiento   `[AGENTE]`

```
tools/tracker.mjs       PT-061 · PT-062 · PT-063 · PT-064 · PT-065    -> SERIALIZADOS
tools/patrones.mjs      PT-061 (identidad) · PT-064 (atribucion)       -> SERIALIZADOS
tools/verify-fdge.mjs   PT-062 (rangos) · PT-063 (formato de rama)     -> SERIALIZADOS
tools/verify-suite.mjs  PT-061 (firmantes vs personas)                 -> solo
LEXICON                 PT-061 · PT-062 · PT-063 · PT-065              -> SERIALIZADOS
RULES                   PT-063 modifica FDGE-R19                       -> solo · es el MAJOR
REGISTRY.json (esquema) PT-061 (personas) · PT-062 (rangos)            -> SERIALIZADOS

Ejecucion SECUENCIAL, en el orden de la seccion 4. Ningun par corre en paralelo.

El solapamiento REAL de este lote no esta en los archivos: esta en que las cuatro ultimas
tareas dependen de PT-061 para saber de quien es algo. Si PT-061 se equivoca, las cuatro
heredan el error sin que sus propios casos lo noten — cada una comprobaria correctamente
sobre una identidad falsa. Por eso PT-061 lleva AC-03: un autor no declarado se REPORTA.
```

## 7. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| Permisos, control de acceso o quién puede firmar qué | — |
| Un cuarto nivel de rama entre la tarea y `trabajo` | — |
| Multiplicar `G4` por persona | — |
| Resolver conflictos de merge entre personas | — |
| Publicar | — |

**Las tres primeras llevan `—` porque son decisiones ya tomadas** y este lote las **aplica**, no
las revisa: `EXEC-R03` mantiene `G4` como una compuerta por lote, y la decisión 3 del firmante
mantiene `trabajo` única.

**La cuarta:** un conflicto de merge lo resuelve una persona. El marco puede decir **que existe**;
resolverlo es trabajo, no gobernanza.

**Y la quinta:** publicar es del firmante y sigue fuera (`SUITE-R06`).

## 8. Firma

```
Firmado por: Alberto Martínez
Fecha: 2026-08-18
Constancia: «tienes mi VoBo para terminar y publicar correctamente lo necesario, cerrar
completamente la épica y comenzar con la EP-016 sin parar hasta terminar»
Alcance: las decisiones 2, 3 y 5 del 2026-08-15 fijan el diseño de este lote; el reparto en
cinco tareas y su orden los derivó el agente de lo que EP-015 dejó medido.
```

## Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` y número de versión | **HECHO** · 9.0.0 · `MAJOR`: `FDGE-R19` modificada |
| **Guía de migración**, obligatoria por ser `MAJOR` (`SUITE-R19`) | **HECHO** · y la respuesta es que **ningún proyecto instalado tiene que hacer nada**: todo lo que entra es opcional |
| Regenerar `CORE.md` | **HECHO** · las cinco tocaron `LEXICON`; `PT-063` además `RULES` y `PHASES` |
| **El criterio de éxito, ejecutado**: dos personas el mismo día sin mezclarse | **HECHO con su límite declarado** · ejecutado con una persona y la segunda **simulada**; qué se ejecutó y qué no, abajo |
| Los dos huecos que `EP-015` dejó declarados: ¿cerrados o vueltos a declarar? | **HECHO** · los dos **cerrados** — `PT-064` y `PT-065` |

## El criterio de éxito: qué se ejecutó y qué no

> «Dos personas abren tarea el mismo día, cada una en su rama, y nada de lo que el marco deriva
> mezcla su trabajo.»

**Lo ejecutado**, contra este repositorio:

```
tracker personas         las tres identidades reconciliadas en UNA persona
tracker asignar          asigna del rango, y con el rango agotado se NIEGA
tracker rama PT-NNN      chore/alberto-martinez/PT-NNN-slug
tracker coste --de X     filtra, y DICE de quién es la cifra
tracker sesion           ve la ajena simulada y NO la toca
verify-fdge              rangos solapados y allocation fuera de rango: FALLA
```

**Lo que NO se ejecutó, y es el límite del lote:** *dos personas de verdad*. Este repositorio tiene
**una**, con tres identidades. Cada mecanismo se probó con la segunda persona **simulada** —un
rango declarado a mano, una marca de sesión escrita a mano, un `--de` con un nombre inventado— y
las colisiones que se evitan están **reproducidas** con dos ramas de git.

Eso demuestra que **los mecanismos hacen lo que dicen**. No demuestra que dos personas trabajando
de verdad no encuentren un caso que nadie ha visto — y por eso `PT-061` reporta en vez de adivinar,
y `PT-062` comprueba los rangos en `verify-fdge` y no solo al asignar.

**Se declara `PARCIAL` en vez de darlo por bueno.** `SUITE-R45` existe para que un lote no cierre
marcando casillas que no están hechas.

## Los dos huecos de `EP-015`, cerrados

| Lo que `EP-015` declaró | Dónde se cerró |
|:---|:---|
| «`SESSION.json` es de una sesión: con dos personas eso no basta» | `PT-065` · una marca por persona |
| «El día de dos personas son dos sesiones y el techo sale inflado» | `PT-064` · el techo se calcula por persona |

Los dos estaban escritos en el `manifest.json` de `EP-015` como **no verificado**, y los dos
tienen ahora una tarea cerrada con su evidencia. Un lote que hereda huecos declarados y los cierra
es la única forma de que declararlos no sea una excusa.

> El merge, la publicación y lo que se verifique después del cierre no son filas: `SUITE-R45`.
