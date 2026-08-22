# Out of scope — `PT-100`

## Del intake `[HUMANO]`
```
OUT: renombrar el directorio en los proyectos destino -> la herramienta se adapta al
     proyecto, no al reves. Y en git un cambio de mayusculas rompe clones

OUT: arreglar la calculadora ni el legado             -> tienen sus ramas y su firmante

OUT: rehacer el vocabulario de QA entero              -> se unifican los DOS conjuntos que
     discrepan, no se rediseña la taxonomia

OUT: los seis type === 'EP' de verify-fdge            -> ENTRAN (L-0 los dejo medidos)
```

## Añadido por el agente `[AGENTE]`
```
OUT: auditar cuantos hechos MAS tienen nombre doble   -> «Cierre del lote» de EP-019
     Se conocen CINCO y los cinco estan arreglados. Un grep no puede encontrar lo que no
     sabe buscar, y decir «no quedan» seria afirmar sin medir.

OUT: que el arnes corra en un sistema sensible a mayusculas  -> «Cierre del lote»
     TD-04 no se reproduce en Windows PORQUE el sistema de archivos no distingue. La
     bateria comprueba que el CODIGO busca las dos grafias, no que el comportamiento sea
     correcto en Linux — y esa distincion hay que decirla, no taparla. CI corre en Linux,
     asi que el caso real lo cubre la corrida de CI y no la local.
```

## Rechazado, para que no vuelva
```
NO: elegir una grafia y renombrar
    Tocaria el arbol de proyectos ajenos. La herramienta acepta las dos y DICE cual uso.

NO: alinear los tres documentos con la herramienta (EDGE|NEG)
    QA-Prompts es el texto que se COPIA a cada proyecto destino: cambiarlo romperia todo
    QA-PLAN ya escrito. Y el unico proyecto que corrio QA reporto INC-012 precisamente
    porque su plan seguia la documentacion.

NO: declarar type: 'EP' canonico y migrar el registro
    Obligaria a tocar diecinueve allocations historicas —SUITE-R09 es append-only— para
    mantener un campo del que nadie tiene que depender.
```
