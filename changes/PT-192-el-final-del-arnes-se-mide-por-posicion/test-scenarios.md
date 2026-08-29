# `PT-192` · `test-scenarios.md`

Todos operan sobre un **arnés falso** construido en `$WORK`, no sobre el real: fijar el contenido
del real sería medir la fecha, no la regla.

## `TS-01` — los cuatro casos siguen detectando lo suyo   → `AC-01`

```
DADO   el arnes real
CUANDO los cuatro casos corren
ENTONCES siguen en verde
```

Lo respalda la corrida completa: los cuatro están entre sus 1945 casos.

## `TS-02` — añadir líneas al final NO rompe la extracción   → `AC-02`

```
DADO   un arnes falso con la marca y su informe final
CUANDO se anaden 50 lineas DESPUES del bloque
ENTONCES la extraccion sigue encontrando lo suyo
```

**Es el defecto, fijado.** Con `tail -40` esto falla: 50 líneas empujan el objetivo fuera. Y 50 no
es un número mágico — es holgadamente mayor que las 21 que `PT-191` añadió y rompieron dos casos.

## `TS-03` — el ancla no casa su propia definición   → `AC-03`

```
DADO   un arnes falso donde la marca aparece UNA sola vez
CUANDO se extrae con el patron partido
ENTONCES la extraccion empieza en la marca real, no en la linea que la busca
```

**No es teórico:** el comentario de `selftest.sh:7355` documenta que el intento anterior *«arrancaba
en ESTA MISMA LINEA y se tragaba medio archivo»*. Sin este caso, el arreglo podría reintroducirlo.

## La comprobación inversa   cierre de `PHASE 5`

Con `tail -40` en lugar del ancla, `TS-02` tiene que ponerse **rojo**. Se ejecuta y se anota: un
caso que pasa igual con y sin el arreglo no prueba nada.

## Lo que NO se cubre, y consta   `SUITE-R26`

**Otras extracciones posicionales del arnés.** Hay `tail`/`head`/`sed -n` en más sitios; se cubren
las **cuatro** que miden el final del fuente y que han fallado. Barrer el resto es otro trabajo.

**Y que nadie borre la marca.** Es una convención: quien borra `# cauce:informe-final` rompe los
cuatro casos. Lo que cambia es que **borrarla es deliberado**, mientras que añadir una línea al final
no lo era.
