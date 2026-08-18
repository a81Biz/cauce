# PT-054 — Estrategia   `PHASE 3`

## Objetivo

Que exista **un** sitio donde ver en qué se trabaja, sin fusionar nada y sin saber de antemano qué
rama mirar.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Mover la gobernanza a `cauce/<usuario>` | Rompe el vínculo que ata un cambio a su evidencia: hoy es que **viajen en el mismo commit**. `SUITE-R34` quedaría comparando fechas entre dos ramas. **Descartado por el firmante** (decisión 1) |
| `git worktree` para escribir en la otra rama | ~200-500 ms y un directorio más por proyección, y hay que limpiarlo. Para escribir tres archivos |
| `git checkout` a la rama, escribir, volver | Toca el árbol de trabajo **mientras se está trabajando**. Un fallo a mitad deja al usuario en otra rama |
| Un archivo por tarea en la rama proyectada | El agregado es el punto: N archivos vuelven a obligar a saber cuál abrir |
| Escribir solo cuando el usuario lo pida | Es un acto más que se olvida, y `PT-053` acaba de medir qué pasa con esos |
| **Fontanería de git, llamada desde `avanzar`** | Escribe la rama **sin tocar el árbol**, y ocurre en la transición: no hay nada que recordar |

## Solución

```
git hash-object -w    el contenido -> un blob
git mktree            los blobs    -> un arbol
git commit-tree       el arbol     -> un commit, con padre el anterior
git update-ref        el commit    -> refs/heads/cauce/<usuario>
```

**Ninguno toca el directorio de trabajo.** La proyección se escribe mientras se trabaja en otra
rama, y si falla no hay nada que deshacer en el árbol.

### Qué contiene

```
ESTADO.md          una fila por allocation VIVA: id, tipo, estado, fase, rama, SHA
CHECKPOINT.json    el de la tarea en curso, tal cual
```

`ESTADO.md` es el agregado que hoy no existe: **trece ramas en una tabla**. Y cada fila lleva el
**SHA de la rama de la que sale** (`AC-04`) — sin eso, la proyección diría *qué* sin decir *sobre
qué código*, que es el vínculo que `PT-052` puso y esta tarea no puede perder.

### La marca, y por qué

Cada commit de la proyección lleva `cauce:proyeccion` en su mensaje. Un commit **sin** la marca es
humano, y se **reporta**: una rama derivada en la que alguien escribe **deja de serlo**, y no se
notaría de otro modo.

Es el mismo mecanismo que `SUITE-R43` usa con las notas del agente — una marca invisible al leer,
comprobable al verificar.

## Publicar: local por defecto

`update-ref` escribe la rama **local**. Publicarla es `--publicar`, y no va en `avanzar`.

**Y es una decisión, no una omisión.** `SUITE-R06f` deja fuera de lo automatizable la reescritura
de historia y el borrado de ramas remotas; empujar una rama nueva no está en esa lista, pero
**empujar en cada transición** convierte un acto de publicación en un efecto colateral. Quien
quiera verlo desde fuera lo pide; quien trabaje en local lo tiene sin haber publicado nada.

## Sin usuario, no se proyecta

El usuario sale de `git config user.name`. Si no se puede saber, **no se proyecta y se dice**
(`RULE-06`): una rama `cauce/desconocido` sería peor que ninguna.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| La rama de tarea | No se toca. La proyección **lee**; el commit atómico sigue igual. Caso propio |
| El árbol de trabajo | La fontanería no lo toca. Caso propio: tras proyectar, `git status` no cambia |
| `avanzar` | La proyección es un acto **más**, dentro del mismo respaldo. Si falla, se revierte con los demás |
| Una rama `cauce/<usuario>` con historia humana | Se detecta por la marca y se reporta. Caso propio |
| `SUITE-R06f` | No se borra ni se reescribe nada: solo se añade un commit encima |

## Criterios de éxito, derivados de los AC

- `AC-01` → `avanzar` proyecta el estado de lo vivo
- `AC-02` → la rama de tarea conserva artefactos y código juntos
- `AC-03` → un commit humano en la proyección se detecta y se dice
- `AC-04` → cada entrada lleva el SHA del que sale
- `AC-05` → sin usuario no se proyecta, y se dice
- `AC-06` → no se crean, mueven ni borran ramas remotas sin decirlo

## Autorrevisión

**El riesgo es que la proyección se convierta en autorada por descuido.** Basta un `git checkout
cauce/alberto` y un commit para que deje de ser derivada, y a partir de ahí la siguiente
proyección lo sobrescribiría —o peor, no—. Por eso la marca no es un adorno: es lo único que
distingue una rama derivada de una que ya no lo es.

**El segundo riesgo es hacerla obligatoria en `avanzar` sin poder revertirla.** Va dentro del
respaldo: si la proyección falla, la transición entera se revierte. Es coherente con lo que
`PT-053` decidió y no una excepción para el último caso.

Contradicciones: ninguna. `AC` sin cubrir: ninguno.

**Lo que no resuelve:** la identidad multiusuario. Aquí el usuario es el de `git config`, en
singular. Los rangos de ID y la convivencia de dos personas son `EP-016`, y esta tarea deja el
mecanismo hecho para que aquel lote solo tenga que añadir la identidad.
