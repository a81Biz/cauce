# PT-057 — Descubrimiento   `PHASE 2`

> Todo lo de aquí está **medido** contra este repositorio el 2026-08-18, no supuesto. Los comandos
> están en `salidas/` y se pueden repetir.

## 1. Qué hay que responder

`AC-01` pide que el coste **se derive** de tareas cerradas. Antes de derivar nada hay que saber
**de dónde**, y ahí es donde estaba la trampa.

Cerradas hoy: **53** (`INTEGRATED` 50 · `CLOSED` 3), de 60 allocations.

## 2. La señal obvia está contaminada

Lo primero que parece razonable es buscar los commits que nombran la tarea:

```
git log --all --no-merges --grep "PT-NNN"
```

Da esto:

```
BUG/STANDARD            14 tareas · mediana commits 5 · archivos 66 · lineas 2708
BUG/TRIVIAL              7 tareas · mediana commits 5 · archivos 65 · lineas 2708
```

**`TRIVIAL` y `STANDARD` idénticos hasta la línea.** No es una coincidencia estadística: es que la
medición no está midiendo lo que dice. La causa, contada:

| commits en la historia | 162 |
|:---|---:|
| sin ningún `PT` en el mensaje | 56 |
| con **uno** | 45 |
| con **varios** | **61** |

Uno de ellos nombra **diez** tareas. Es consecuencia directa de cómo se escriben aquí los mensajes
—`CORRIGE PT-052`, «el mismo defecto que `PT-023` encontró»— y de que `SUITE-R09` hace la bitácora
append-only: **citar tareas anteriores es lo correcto**, y precisamente por eso `--grep` atribuye a
una tarea el trabajo de otras.

**Si esta medición se hubiera aceptado**, el estimador habría dicho que un `TRIVIAL` cuesta lo
mismo que un `STANDARD`, con toda la autoridad de un número derivado del historial real.

## 3. Las tres señales que sí existen, con su cobertura

| Señal | Cómo se deriva | Cobertura | ¿Discrimina? |
|:---|:---|:---|:---|
| **Commits propios** | primer `PT-NNN` del **asunto** del commit | 45/53 · **85 %** | **sí** |
| **Carpeta `changes/PT-NNN/`** | archivos y bytes | 52/53 · **98 %** | **casi nada** |
| **Campos de `HISTORY.log`** | `Archivos modificados:` etc. | 19/57 · **33 %** | sí, donde está |

### 3.1 El asunto del commit es la mejor atribución disponible

Atribuir por el **primer `PT` del asunto** —no por el cuerpo— da 86 commits con dueño y 45 tareas
con al menos uno. Las cifras dejan de ser idénticas:

```
BUG/STANDARD           13 tareas · commits 1 · archivos 24 · lineas  665
CHORE/STANDARD         13 tareas · commits 2 · archivos 26 · lineas 1966
BUG/TRIVIAL             7 tareas · commits 3 · archivos 24 · lineas 1577
FEATURE/STANDARD        6 tareas · commits 1 · archivos 23 · lineas  689
BUG/SIMPLE              3 tareas · commits 1 · archivos 19 · lineas  308
INVESTIGATION/STANDARD  1 tarea   · commits 1 · archivos  6 · lineas  323
CHORE/TRIVIAL           1 tarea   · commits 1 · archivos 26 · lineas 1018
CHORE/SIMPLE            1 tarea   · commits 1 · archivos  3 · lineas   73
```

**`BUG/TRIVIAL` sigue saliendo más caro que `BUG/STANDARD`**, y ahora eso **es un dato, no un
artefacto**: los `TRIVIAL` de este repositorio son antiguos y llevaban commits grandes, de antes de
que `FDGE-R19` impusiera el commit atómico. La cifra dice algo verdadero sobre el pasado del
repositorio; lo que no puede es presentarse como si describiera el presente.

### 3.2 La señal más completa es la que menos informa

`changes/PT-NNN/` existe para **52 de 53** tareas cerradas — casi perfecta. Y esto es lo que mide:

```
BUG/STANDARD    9 artefactos    CHORE/STANDARD  10 artefactos
FEATURE/STANDARD 9 artefactos   BUG/TRIVIAL      9 artefactos
BUG/SIMPLE       9 artefactos   FEATURE/COMPLEX  9 artefactos
```

**Nueve o diez, siempre.** Es exactamente lo que el marco exige en `PHASE 4`, así que la señal está
**saturada por construcción**: cuenta el cumplimiento del procedimiento, no el esfuerzo. Los bytes
sí varían (6 KB a 23 KB) y son la parte utilizable.

Que la señal con mejor cobertura sea la peor predictora es el resultado menos esperado de esta
fase, y el que evita construir el estimador sobre ella por parecer «la más limpia».

### 3.3 `HISTORY.log` es prosa, no una tabla

57 entradas `## PT-`, y los campos aparecen en:

```
Estructural: 59   Compuertas: 58   Estado: 55   Severidad: 45   Rama: 45
Evidencia: 32     Lote: 23         Criterios: 19   Archivos modificados: 19
```

`Archivos modificados:` está en **19 de 57**. `HISTORY.log` cumple lo que `SUITE-R09` le pide
—registro append-only y legible— y **no** es una fuente estructurada. Derivar de ahí obligaría o a
reescribir la bitácora, que `SUITE-R09` prohíbe, o a aceptar un 33 % de cobertura.

Lo que sí es estructurado y completo es **`REGISTRY.json`**: `type`, `complexity`, `severity`,
`structural` y `epic` están en las 60 allocations. Es la fuente de las **dimensiones de
comparación** que pide `AC-02`; el coste sale de git.

## 4. Lo que esto obliga a que haga `AC-03`

Con la atribución buena, tres grupos tienen **una sola tarea** y uno tiene tres:

```
INVESTIGATION/STANDARD  1     CHORE/TRIVIAL  1     CHORE/SIMPLE  1     BUG/SIMPLE  3
```

Una mediana de una tarea **no es una mediana**. Y 8 de las 53 cerradas no tienen ningún commit con
su nombre en el asunto: no es que costaran cero, es que **no se puede saber** — trabajo anterior a
la convención de mensajes. `AC-03` no es una cortesía: sin él, el estimador daría una cifra para
`CHORE/SIMPLE` calculada sobre **73 líneas de una única tarea**.

## 5. Lo que queda fuera y por qué

El coste **en tokens** no aparece por ninguna parte, y no puede aparecer: nada en el repositorio lo
registra. Es la decisión 4 del firmante y el `out-of-scope` del intake. Lo que hay son archivos,
commits y líneas — **señales observables**, que es literalmente lo que se pidió.

Y esto da el coste **típico de un tipo de tarea**, no el de una tarea concreta: la dispersión
dentro de un grupo (665 a 1966 líneas de mediana entre grupos, y más dentro) hace que prometer lo
segundo sea vender una predicción donde hay una referencia.
