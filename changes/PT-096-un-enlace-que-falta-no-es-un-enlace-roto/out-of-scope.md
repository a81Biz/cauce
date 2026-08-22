# Out of scope — `PT-096`

> `PHASE 4`. Transcribe el §8 del intake y **marca lo añadido** por el agente (`FDGE-R02`).

## Del intake, literal `[HUMANO]`

```
OUT: rehacer el mecanismo de ref durable de PT-079    -> es CORRECTO. El defecto no es que
     elija mal el ref: es que el caso «todavia no hay ref» no tiene continuacion

OUT: enlazar a la rama efimera                        -> FDGE-R19 la borra al fusionar y es
     exactamente lo que SUITE-R56 nacio para impedir. Volver ahi seria deshacer PT-079

OUT: reescribir el cuerpo de un issue para cambiar su ESTADO -> aqui solo se arregla el
     enlace, que es dato derivado del registro (SUITE-R35). Ningun issue se abre ni se cierra

OUT: subir la cobertura mecanica por si misma         -> heredado del OUT de EP-019

OUT: las ocho tareas L-1..L-8 de EP-019               -> esta las precede, no las sustituye
```

## Añadido por el agente en PHASE 2–4 `[AGENTE]`

Cuatro cosas se encontraron **ejecutando** y no entran. Cada una con dónde va, porque un
out-of-scope sin destino es una forma de perderlas:

```
OUT: declarar en LEXICON el «type» canonico de un lote      -> L-3
     Tres valores para el mismo hecho en el registro: EP (16), ausente (2), EPIC (1).
     D-1 hace que el arreglo NO dependa de esta decision —deriva del ID, que LEXICON si
     declara—, que es distinto de resolverla. Es AC-09, declarado y trasladado.

OUT: que «tracker asignar» escriba «phase: 1»              -> L-1
     Encontrado ejecutando ESTA tarea: asignar crea la allocation sin «phase», y avanzar
     hace Number(undefined) -> NaN, con lo que «destino !== actual + 1» es siempre cierto.
     NINGUNA tarea creada por asignar puede avanzar. Desbloqueado a mano una vez, con su
     excepcion declarada en SESSION_LOG.md. Es de L-1, dueña del estado.

OUT: BACKLOG.md, que no indexa EP-017, EP-018 ni EP-019    -> se anota, sin dueño aun
     Visto al comprobar donde se indexan los lotes tras retirar la fila de EP-019 de
     DISCOVERY. Ademas declara «3 allocations DEFERRED» y lista cuatro filas, una de
     ellas CLOSED. Es C-1 del lote —estado escrito una vez y nada lo reconcilia— pero
     BACKLOG no es un indice DERIVADO, asi que no lo arregla «tracker indices».

OUT: que ningun verificador lea el cuerpo de un issue      -> resuelto por S-3, no por un
     verificador. Se deja dicho para que nadie lo vuelva a proponer: el sitio de esa
     comprobacion es el ESPEJO y lo dijo intentarlo en PT-079 —«puse la comprobacion del
     enlace en verify-fdge, con funciones que no existen ahi».
```

## Lo que se rechazó y por qué, para que no vuelva

```
NO: que «espejo» reescriba el cuerpo al verlo mudo
    Cerraria el caso solo, y es tentador. Espejo es LECTURA y es lo que corre en CI: un
    verificador que escribe convierte cada corrida en una escritura que nadie pidio, y un
    fallo a mitad deja el tablero como nadie lo dejo. SUITE-R47 ya delimito esto.

NO: exigir el commit antes de abrir el issue como UNICA solucion
    Funciona —#191 nacio con enlace por hacerlo asi— pero deja el resultado colgando del
    orden que use quien trabaje, que es lo que PT-079 acaba de quitar de en medio, y no
    arregla los diez ya publicados. Se recoge como recomendacion en el MANUAL, con la
    maquina comprobandola por detras (S-3).

NO: hacer que la lista «Tareas de este lote» aparezca en los tres lotes que no la tienen
    Es el arreglo evidente de esLote y propagaria una violacion de SUITE-R51 creyendo
    corregir un defecto. La medicion lo ordena al reves: 14 issues la llevan hoy, PT-035
    la declaro defecto, y el anidamiento real ya funciona.
```

## Medición de los seis de `verify-fdge.mjs`, hecha para que `L-3` la encuentre `Revisión 4`

`D-10` dijo «latentes». Medido sobre los 19 lotes del registro, hoy:

```
EP-001..EP-016   type=EP        -> las seis comprobaciones aciertan
EP-017 EP-018    type ausente   -> CLOSED: ninguna las alcanza
EP-019           type=EPIC      -> solo :1388 lo alcanza, y le pide viabilidad… que TIENE

disparos reales hoy: CERO
```

**Y la trampa que esto esconde, que es lo que hay que llevarse:**

`:1388` exime del `FDGE-R54` —«consta el veredicto de viabilidad»— a lo que sea `type === 'EP'`.
`EP-019` pasa **por casualidad**: alguien le registró la viabilidad. El **próximo lote** que se
abra sin registrarla fallará `FDGE-R54` **como si fuera una tarea**, con un mensaje que dirá que
le falta algo que a un lote no se le pide.

No es hipotético: `EP-017` y `EP-018` se abrieron **sin campo `type`**, así que la forma de
escribirlo ya ha cambiado dos veces en tres lotes. La tercera fue `EPIC`.

Sigue siendo `OUT` de `PT-096` —cambiar esas seis altera **veredictos de verificación**, y eso
merece su propia inversa— pero `L-3` ya no tiene que medirlo.
