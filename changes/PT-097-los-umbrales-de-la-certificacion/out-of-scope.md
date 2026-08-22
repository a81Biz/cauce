# Out of scope — `PT-097`

## Del intake, literal `[HUMANO]`

```
OUT: reauditar el marco con PTSA          -> §5 del lote. Auditar contra una especificacion
     que cita secciones inexistentes reproduce el defecto. Se audita DESPUES

OUT: INC-008 · el multiplicador x4 satura -> el Risk saturado es otro hallazgo del legado.
     L-6 define los umbrales de la LETRA; recalcular Risk de paso es alcance que crece

OUT: cambiar los pesos de las dimensiones -> PTSA-R26 los declara fijos, y tocarlos
     cambiaria el Health de toda auditoria pasada

OUT: retirar una certificacion ya emitida -> SUITE-R09 es append-only. Se RECALCULA con la
     definicion nueva, y si el resultado difiere se dice; no se borra
```

## Añadido por el agente en `PHASE 2–4` `[AGENTE]`

```
OUT: que verify-suite cace SECCIONES citadas que no existen   -> «## Cierre del lote» de EP-019
     Hoy caza REGLAS citadas que no existen, no secciones. Si lo hiciera, este defecto habria
     saltado el dia que se escribio §15.6. No entra: es otra comprobacion, sobre otro
     documento, y con su propio riesgo de falsos positivos —una cita a «§X» en prosa no
     siempre es una referencia—. La medicion queda hecha: DOS citas rotas, :569 y :744.

OUT: recalcular el Risk publicado (73)                        -> INC-008, sin dueño aun
     Se nota al mirar los hallazgos: con H-001 y H-006 ya CLOSED, los activos son siete y
     Σ riesgo(h) = 37, que con el x4 satura en 100. El 73 se calculo cuando los dos seguian
     activos. NO se toca aqui: la letra no depende de Risk (D-7), asi que recalcularlo no
     cambiaria ninguna letra y solo abriria el defecto del multiplicador.

OUT: meter Risk en la funcion de la letra                     -> rechazado en A-3
     No aparece en ninguno de los cuatro topes y tiene sus bandas propias en §14.5. Añadirlo
     seria AÑADIR criterio en una tarea que existe para no inventar ninguno.

OUT: hacer obligatorio que PHASE 0 declare umbrales           -> rechazado en A-4
     Trasladaria el hueco al proyecto destino: cada auditoria inventaria los suyos y dejarian
     de ser comparables, que es lo que una certificacion existe para permitir.
```

## Lo que se rechazó, para que no vuelva

```
NO: inventar la banda C (60-74, 75-89, o la que sea)
    Es lo que hizo el agente que audito. Exige una tercera ancla que el documento no
    declara, y seria cometer el defecto AL CORREGIRLO. La salida real es que C no es una
    banda sino un techo — lo dicen las dos unicas reglas que la nombran.

NO: retirar PTSA-R08 y dejar de exigir letra
    El enunciado del lote lo admite —«o deja de exigir una letra»— y se rechaza porque la
    letra SI se puede derivar. Retirar una regla que se puede cumplir es perder capacidad
    para no hacer el trabajo. Lo que tenia de razon se recoge en S-3: no emitirla cuando
    falta un dato, que era el caso real que la hacia imposible.
```
