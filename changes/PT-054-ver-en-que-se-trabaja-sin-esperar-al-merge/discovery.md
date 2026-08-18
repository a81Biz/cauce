# PT-054 — Descubrimiento   `PHASE 2` · `2-B`

## Lo medido

```
ramas de tarea en el remoto      13
issues abiertos                  12
usuario de git                   «Alberto Martínez»
```

## Qué visibilidad hay hoy, y qué falta

| Dónde | Qué responde | Qué no |
|:---|:---|:---|
| Los issues | Qué está abierto y qué se decidió en cada transición | Están en **la plataforma**, no en el repositorio |
| La rama de tarea | Los artefactos y el código, juntos | Hay que saber **qué rama** mirar: son 13 |
| `trabajo` | El estado agregado | **Solo tras fusionar** cada tarea |
| `CHECKPOINT.json` | La tarea en curso, estructurada | Vive en la rama de esa tarea |

**La visibilidad existe y está repartida en trece sitios.** Para ver en qué se trabaja hay que
saber de antemano dónde mirar, que es justo lo que la pregunta pretende evitar.

## Lo que no puede hacerse, y ordena el diseño

**No se puede mover la gobernanza a otra rama.** Hoy lo que ata un cambio a su evidencia es que
**viajen en el mismo commit**: `FDGE-R19` exige commits atómicos y `SUITE-R34` comprueba contra git
que el estado no quede más viejo que el trabajo —y me ha bloqueado **cuatro veces** en esta sesión,
que es la prueba de que ese vínculo está vivo—.

Separarlos dejaría `SUITE-R34` comparando fechas **entre dos ramas**, que no significa nada.

Por eso la decisión del firmante fue **derivada, no autorada**: la rama de tarea conserva todo, y
`cauce/<usuario>` es una **proyección** que solo escribe la herramienta.

## Cómo se escribe en una rama sin tocar el árbol de trabajo

Esto es lo que hace la tarea posible sin `git checkout` ni `worktree`:

```
git hash-object -w        el contenido -> un blob
git mktree                los blobs    -> un arbol
git commit-tree           el arbol     -> un commit, con padre el anterior
git update-ref            el commit    -> la rama
```

**Ninguno toca el directorio de trabajo.** La proyección se escribe mientras se trabaja en otra
rama, sin cambiar de rama y sin arriesgar nada de lo que hay delante.

## El riesgo, y por qué `AC-03` existe

Una rama derivada **en la que alguien escribe deja de serlo**, y entonces vuelve a haber dos
fuentes — exactamente lo que la decisión 1 del firmante existe para impedir.

Y no se notaría: `cauce/alberto` con un commit humano se ve igual que sin él. Por eso cada commit
de la proyección lleva **una marca**, y un commit sin ella se **reporta**.

Es el mismo mecanismo que `SUITE-R43` usa para distinguir las notas del agente de las de una
persona: una marca invisible al leer, comprobable al verificar.

## Lo que NO es el defecto

No es que falten sitios donde mirar: sobran. Lo que falta es **uno** que los agregue sin depender
de fusionar nada.

Y no es que las ramas de tarea estén mal. Son correctas y tienen que seguir llevándolo todo junto:
la proyección **no las sustituye**, las lee.
