# Out of scope — `PT-098`

## Del intake, literal `[HUMANO]`

```
OUT: quitar la exencion de lo terminal      -> existe por una razon buena y quitarla pondria en
     rojo todo repositorio con historia. Falla el DATO, no la exencion

OUT: rellenar los artefactos que faltan     -> «lo ya terminado no se retrofecha» (CORE.md)

OUT: arreglar la calculadora                -> tiene su rama y su firmante

OUT: la transicion de un BUG (INC-006)      -> es L-2, y toca el mismo archivo. SERIADAS
```

## Añadido por el agente `[AGENTE]`

```
OUT: que «--all» ejerza lo que ejerce «--gate G4»   -> «Cierre del lote» de EP-019
     --gate G4 SI caza este caso —«G4 exige DONE»— y --all no. INC-010 de la calculadora lo
     llama «cada compuerta es una revision sorpresa». Cambiar que ejerce --all afecta a TODAS
     las compuertas, no solo a esta, y merece su propia medicion.

OUT: auditar los 22 usos de ESTADOS_TERMINALES      -> sin dueño aun
     Seis en verify-fdge estan contados —INC-011 conto cinco, las que alcanzaban a SUS dos
     tareas—. Los de tracker.mjs (7) y patrones.mjs (5) no se han revisado uno a uno. Aqui se
     arregla el DATO que los dispara, no cada consumidor.

OUT: FND-R14 · que las cifras del inventario se recalculen al sellar  -> «Cierre del lote»
     Van TRES veces en este lote que la bateria cae por cifras caducas, y no es descuido: las
     cifras caducan con el ULTIMO cambio del arbol, y cual es el ultimo no se sabe hasta que la
     tarea termina. El sitio correcto es «tracker sellar», no la memoria de quien trabaja.
```

## Lo que se rechazó, para que no vuelva

```
NO: que «avanzar» se NIEGUE a escribir el estado terminal
    Fue mi primer diseño y rompe SUITE-R46, que exige apuntar el estado terminal ANTES del
    merge. La salida no es una excepcion: es que LEXICON distingue DONE de INTEGRATED y
    FDGE-R34 exige DONE para G4. Escribir DONE SIRVE MEJOR a SUITE-R46 que lo que habia.

NO: derivar INTEGRATED siempre y no guardarlo
    Seria lo mas puro —el estado se calcula, no se almacena— y se rechaza porque el registro
    es la fuente (SUITE-R08), porque git no esta disponible en todos los consumidores, y
    porque romperia la lectura de un registro historico.
```
