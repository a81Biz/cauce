# PT-007 — Discovery   `PHASE 2` · análisis `2-E`

## Qué falta hoy

El issue de un PT dice **que existe**. No dice en qué fase está ni qué compuerta espera. Para
saber «qué va cuándo» hay que abrir `REGISTRY.json`.

```
gh issue list   →  #10 PT-006 · el-contrato-vuelve-a-su-regla   [tarea]
REGISTRY.json   →  PT-006 · phase 8 · DONE
```

La etiqueta `tarea` distingue una tarea de una implementación y nada más.

## Por qué importa, con el caso que lo demostró

`EP-001` se cerró y hubo que **reabrirlo**: `PT-005` apareció al abrir el PR, en un job de CI.
Durante ese rato el estado real del lote no estaba en el tablero — estaba en una ejecución que
nadie miraba. Quien mirase GitHub habría visto cinco issues abiertos sin saber que cuatro
estaban terminados y uno esperaba una compuerta humana.

## De dónde sale el estado, y por qué no hace falta un campo nuevo

`REGISTRY.allocations[].phase` ya existe —lo instauró `PT-004`— y la compuerta se **deriva** de
la fase con el mapa que `CORE.md` §Fases ya declara:

```
PHASE 1 ◆ G1      PHASE 4 ◆ G2      PHASE 7 ◆ G3      PHASE 9 ◆ G4
```

Nada que almacenar dos veces (`RULE-01`). Si mañana cambia el mapa de fases, la etiqueta cambia
sola.

## La condición que hace esto seguro

**Solo escritura desde el registro.** `tracker` publica la etiqueta leyendo `REGISTRY.json`; el
espejo comprueba que coincida. En ningún punto se lee una etiqueta de GitHub para decidir algo
dentro del repositorio.

Si el estado se pudiera cambiar desde GitHub habría dos fuentes y volveríamos a la avería que
la v4 nació para eliminar. Que la etiqueta sea de solo escritura es lo único que separa un
espejo de una segunda fuente.

## Conclusión

No hay defecto que corregir: hay capacidad que falta. La plataforma sabe menos de lo que el
registro sabe, y por eso hay que abrir el repositorio para saber qué toca.

Confianzas: RootCause 90 % · Architecture 90 % · Solution 85 %.
