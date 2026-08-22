# Descubrimiento — `PT-107`

## No se buscó: ocurrió

`PT-106` se asignó, se trabajó entera —código, casos, inversa, documentación— y al ir a leer su
estado **no existía en el registro**.

```
node -e "...PT-106..."   ->  TypeError: Cannot read properties of undefined
counters.PT              ->  105     (habia sido 106)
allocations              ->  124     (habian sido 125)
```

## La cronología, reconstruida

```
t0   abrir PT-105 --aplicar   (segundo plano)   lee REGISTRY   124
t1   asignar PT-106                             escribe        125
t2   abrir PT-105 --aplicar   termina           escribe        124   <- pisa
```

`abrir` no hizo nada malo: escribió **el registro que había leído**. El problema es que lo
escribió **entero**, y entre medias había cambiado.

## Dónde está, con archivo y línea

```
tracker.mjs:1259   const reg = leerJSON(...)     UNA lectura, al arrancar el proceso
tracker.mjs:1671   writeFileSync(...)            escritura ENTERA
tracker.mjs:1995   writeFileSync(...)            ENTERA
tracker.mjs:2291   writeFileSync(...)            ENTERA
tracker.mjs:2748   writeFileSync(...)            ENTERA
```

## Lo que se comprobó antes de arreglar

Contra `HEAD`: **120 allocations anteriores intactas** y las cuatro nuevas presentes. **Solo**
`PT-106`. Se restauró con el mismo identificador porque el contador había retrocedido.

## Por qué es `S0` y no `S1`

Las demás tareas de este lote producen un **verde falso**: una comprobación que no ve algo. Esta
**borra un dato** — la categoría que `SUITE-R06c` nunca automatiza.

Y el modo de fallo es el peor posible: **silencioso y con el contador reciclado**, así que el
siguiente `asignar` reutiliza el identificador. `LEX-R04` exige que un ID sea monotónico y nunca
reutilizado; esta pérdida lo rompe sin decirlo.

## Lo que este descubrimiento NO establece

- **Si `CHECKPOINT.json` y `SESSION.json` tienen el mismo patrón.** Se escriben igual. Declarados
  y sin medir.
- **Cuántas veces ha pasado antes.** Una pérdida silenciosa no deja rastro; contra `HEAD` no hay
  ninguna, pero eso solo cubre esta sesión.
