# Out of scope — `PT-099`

## Del intake `[HUMANO]`
```
OUT: cambiar LEXICON §5.1                     -> la maquina de estados esta BIEN
OUT: retrofechar los 51 BUG existentes        -> «lo ya terminado no se retrofecha»
OUT: auditar TODOS los comandos del tracker   -> INC-006 solo midio «avanzar»
OUT: el estado terminal (INC-009/INC-011)     -> es L-1, ya cerrada
```

## Añadido por el agente `[AGENTE]`
```
OUT: la escalera COMPLETA de status           -> «Cierre del lote» de EP-019
     «avanzar» tampoco escribe IN_PROGRESS ni IN_REVIEW. Arreglarla toca el estado de TODAS
     las tareas, no solo de los BUG, y es mas de lo que esta tarea declara. Lo que si cierra
     es la transicion que LEXICON marca «siempre» y que una regla HARD de severidad H exige.
```

## Rechazado, para que no vuelva
```
NO: que «avanzar» se niegue a pasar de la fase de validacion
    Rompe el flujo. La FASE avanza porque el trabajo avanzo; lo que se detiene es el ESTADO.
    Confundirlos es lo que rechace en A-1 de PT-098 y volvia a aparecer aqui.

NO: comprobarlo solo en «--gate G3»
    Repite el defecto de INC-010: «cada compuerta es una revision sorpresa». --all lo ve.
```
