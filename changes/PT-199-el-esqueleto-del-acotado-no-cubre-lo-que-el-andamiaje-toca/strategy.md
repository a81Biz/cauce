# `PT-199` · `strategy.md` — el camino elegido, y los descartados con su porqué

## El camino: el esqueleto se DERIVA del arnés, no se enumera

Las 174 rutas de `$WORK` **ya están escritas** en `selftest.sh`. El esqueleto deja de tener una lista
propia y las extrae del fuente:

```
selftest.sh  ──grep──▶  las 174 rutas  ──▶  esqueleto inerte
   la fuente              derivadas            montado
```

**Es retroactivo por construcción.** Nadie declara nada y nadie mantiene nada: la ruta que una tarea
futura añada al andamiaje entra en el esqueleto **el mismo día que se escribe**, porque el esqueleto
la lee del mismo sitio donde ella vive.

Es exactamente la forma que `PT-176` eligió para el bloque de una sección —*«ya está escrito en la
historia… no hace falta que nadie declare nada»*— y la que `PT-091` aplicó a las cifras del
inventario.

### Cómo se distingue un archivo de un directorio

Por el último segmento: con punto ⇒ archivo vacío; sin punto ⇒ directorio. Y el orden importa,
porque `docs/implementation` y `docs/implementation/HISTORY.log` conviven:

1. `mkdir -p` del **directorio padre** de cada ruta,
2. los que parecen directorio, `mkdir -p`,
3. los que parecen archivo **y no existen ya como directorio**, `: >`.

Es una heurística, y se dice: no adivina bien un archivo sin extensión. Por eso no basta sola, y va
acompañada de `AC-02`.

### Y `REGISTRY.json` conserva su contenido

El esqueleto de hoy no escribe un `REGISTRY.json` vacío por casualidad: escribe
`{"allocations":[]}`, que es **JSON válido**. Un archivo vacío haría reventar a las herramientas que
lo parsean. Se mantiene después de la derivación.

---

## Los caminos descartados

### 1 · Añadir a mano las dos rutas que fallan hoy

**Descartado: es el defecto, no el arreglo.** Dejaría la cobertura en 4 de 174 y la siguiente ruta
nueva volvería a fallar. Es la misma respuesta con la que `PT-190` rechazó ampliar los 4000
caracteres del escáner: *«cualquier número es igual de arbitrario y sólo mueve el día en que vuelve
a pasar»*.

### 2 · Enumerar las 174 en el esqueleto

**Descartado: una lista a mano de 174 entradas es peor que una de 2.** Da la impresión de estar
completa, nadie la contrasta, y envejece igual. La cifra no cambia la naturaleza del defecto.

### 3 · Redirigir el `stderr` del andamiaje a `/dev/null`

**Descartado, y es el peor de todos.** Callaría los 33 errores **y también el que sea real algún
día**. `RULE-06` prohíbe exactamente esto: no se tapa lo que no se sabe. La corrida quedaría limpia
y menos fiable que ahora.

### 4 · Que el andamiaje no se ejecute cuando la sección está inactiva

**Descartado por coste y riesgo.** Exigiría envolver el montaje de **cientos** de casos —hoy es
código de shell suelto entre `chk` y `chk`— y cada envoltura es una oportunidad de cambiar lo que un
caso mide. Es una reescritura del arnés, no este arreglo. Queda anotado: si algún día se reestructura
`selftest.sh`, ésta es la salida limpia.

### 5 · Montar el fixture completo aunque la sección esté inactiva

**Descartado: destruye el motivo del acotado.** `build_fixture` completo copia el árbol y arranca
`node`; hacerlo en las secciones saltadas devolvería la corrida acotada a los tiempos de la
completa, que es justo lo que `EP-025` eliminó.

### 6 · Arreglar de paso las rutas construidas en variables

**Descartado por alcance, y declarado.** `local d="$WORK/p191"; … "$d/a.sh"` no lo ve un `grep` de
`$WORK/`. Perseguirlas exigiría interpretar el shell. `AC-02` cubre la consecuencia —**si falta
algo, se sabe**— sin fingir que el problema no existe.

---

## La comprobación inversa

Con el arreglo puesto, **quitar** del esqueleto la derivación tiene que devolver los errores. Se
ejecuta y se anota en la evidencia: un arreglo que no se puede quitar no se ha probado.
