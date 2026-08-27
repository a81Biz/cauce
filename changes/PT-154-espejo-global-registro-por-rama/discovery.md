# `PT-154` · `discovery.md` — `FDGE-R42`

## Qué se investigó

`SUITE-R35` dice que **el registro asigna y la plataforma espeja**. El registro es un archivo
versionado —su contenido depende de la rama— y los issues son globales al repositorio remoto. Se
investigó si el espejo puede contrastar dos cosas de alcance distinto sin producir divergencias que
no existen, y qué hacer si no puede.

## Lo medido

```
main:     194 allocations
trabajo:  203 allocations
sólo en trabajo:  PT-171 PT-172 EP-025 PT-173 PT-174 PT-175 PT-176 PT-177 PT-178   (9)
de esas, con issue publicado en GitHub:  9
```

El barrido empujaba, por cada issue abierto que ninguna allocation reclama:

```
SUITE-R35 · El issue #N «…» está abierto y no lo reclama ninguna allocation
```

Desde `main`, hoy, eso son **nueve afirmaciones falsas**. Las nueve allocations existen, están
firmadas y tienen su issue. Lo que no existe es su **registro en esa rama**.

## Lo que el análisis inicial no dijo

`SUITE-R47` (`PT-026`) ya había resuelto la mitad: en la rama por defecto el espejo **informa y no
bloquea**, porque allí el registro es la foto del último merge y divergiría siempre. **No había
rojo permanente**, que es lo que el dictamen preliminar daba a entender.

Lo que sí quedaba: **informar una afirmación falsa sigue siendo afirmarla**.

## Conclusión

**No se cierra la brecha comparando más fuerte: se declara el alcance.** Un issue cuya allocation no
está en *esta* rama no es un huérfano — es algo que **no se puede evaluar desde aquí**, y `RULE-06`
dice exactamente qué se hace con eso.

La referencia es la rama de integración, porque es donde vive el trabajo en curso antes de `G4`. Un
issue que **tampoco ella** reclama sí es un huérfano de verdad, y ése sigue saliendo en rojo — si no,
se habría cambiado un falso positivo por un falso **negativo**, que es peor (`RULE-02`).

Tres respuestas donde antes había una:

```
reclamado en integración  →  RULE-06 · NO EVALUABLE desde aquí, no huérfano
no lo reclama nadie       →  SUITE-R35 · divergencia, como siempre
no se pudo leer           →  RULE-06 · NO EVALUABLE, y se dice por qué
```

Y el espejo **nombra la rama** de la que salió el registro que leyó: sin eso, su veredicto se lee
como un hecho del repositorio cuando es un hecho de la copia de trabajo.

## Lo que esta investigación NO establece

Que el espejo sea correcto **entre dos ramas de trabajo cualesquiera**. Sólo contrasta contra la de
integración. Dos personas con ramas paralelas seguirían viendo como no evaluable el trabajo de la
otra hasta que llegue a `trabajo` — y eso es lo correcto: desde una rama de tarea, el trabajo ajeno
sin integrar **no se puede** evaluar. Decir otra cosa sería `SUITE-R26`.
