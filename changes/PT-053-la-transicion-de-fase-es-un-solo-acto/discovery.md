# PT-053 — Descubrimiento   `PHASE 2` · `2-B`

## Lo medido

```
notas de reanclaje en EP-013     75
notas de reanclaje en EP-014     32   (cuatro tareas cerradas y dos abiertas)
                                ───
transiciones registradas        107   ·  x 5 actos manuales = ~535 operaciones
```

Y los cinco actos, tal como se ejecutan hoy uno a uno:

```
1  tracker siguiente             consultar que toca         SUITE-R48
2  gh issue comment              la nota de reanclaje       FDGE-R52
3  REGISTRY.json  -> phase       el registro asigna         SUITE-R08
4  intake.md YAML -> phase       el PT dice de si mismo     PT-004
5  el indice / el espejo         cuando cambia el estado    SUITE-R35
```

Desde `PT-052` hay un **sexto**: `tracker checkpoint`. Lo que esta tarea tiene que evitar es que
cada mejora del marco añada un acto más a una lista que ya se olvida.

## Lo que falló, y no es una impresión

`FDGE-R52` cazó la misma transición **tres veces en `EP-014`**, y cada una enseñó algo distinto:

| Tarea | Qué pasó | Qué enseñó |
|:---|:---|:---|
| `PT-049` | Avancé el registro a `PHASE 2` y me puse a medir | La regla que este lote existe para automatizar cazó a su primera tarea |
| `PT-050` | Consolidé `3→4` y `4→5` en una nota | **No es estilo: es aritmética.** El issue quedó con 4 notas cuando `PHASE 6` exige 5 |
| `PT-051` | Volví a consolidar, **avisando en la propia nota** de lo que `PT-050` acababa de enseñar | **Predecir el fallo no lo evita** |

El tercero es el que cierra el argumento. No fue un descuido: fue una decisión informada, tomada
sabiendo el coste exacto, y **falló igual**. Hubo que publicar una nota más — el trabajo que
consolidar pretendía ahorrar.

Y en `EP-013`, `SUITE-R34` puso la CI en rojo **por separar el estado del trabajo en dos commits**:
el mismo defecto desde otro ángulo, cuatro de los cinco actos.

## Por qué falla siempre en el mismo punto

**La nota es lo último que se hace y por eso es lo primero que se olvida.** Los actos 3, 4 y 5
tienen consecuencia inmediata —el verificador los pide en la siguiente ejecución—; el 2 no la tiene
hasta que alguien cuenta las notas, y contar notas es lo que `FDGE-R52` hace **después**.

```
avanzar el registro   ->  se nota en el siguiente verify
escribir la nota      ->  no se nota hasta que alguien cuenta
```

Un acto sin consecuencia inmediata, repetido 107 veces, se salta. **No es un problema de
disciplina: es un problema de orden.**

## Lo que ya existe y no hay que reinventar

| Acto | Ya derivado en |
|:---|:---|
| qué toca ahora y qué sigue | `queSigue()` · función pura y exportada |
| la fase destino y su compuerta | la tabla `FASES` de `tracker` |
| el estado del espejo | `abrir --aplicar` |
| el checkpoint | `checkpointDe()` · `PT-052`, función pura |

**Los seis actos ya están escritos y probados por separado.** Lo que falta es que sean **uno**, y
que el que no tiene consecuencia inmediata —la nota— pase a tenerla: **si falta, no se avanza**.

## El riesgo que la medida hace visible

Un comando que hace seis cosas y falla en la tercera deja el repositorio **a medias**, que es
exactamente el estado del que salieron los ocho fallos de CI de `EP-013`. La atomicidad no es
elegancia: es el requisito.

Y hay un acto que **no se puede deshacer**: publicar el comentario. Eso ordena el diseño —lo
irreversible va al final, y todo lo anterior tiene que poder revertirse—.

## Lo que NO es el defecto

No es que las notas sobren, ni que sean largas. Son el único artefacto que reconstruye una sesión
perdida y su coste es de **escritura**, no de lectura: no se cargan en la siguiente sesión.

Y no es que `tracker` esté mal repartido. Cada acción hace bien lo suyo. Lo que falta es la que
las llama en orden y **se niega a avanzar sin la que se olvida**.
