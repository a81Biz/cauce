# PT-062 — Autorrevisión   `PHASE 6`

## Lo entregado

```
personas[].rango           { "PT": [1, 999] } · opcional
siguienteEnRango           pura · derivado de lo usado DENTRO del rango
seSolapan · solapes        tocarse por un extremo YA es solaparse
tracker asignar            lo ÚNICO que escribe un identificador
verify-fdge                rangos solapados · allocation fuera de todo rango
LEXICON §6.5f              el contrato · sin regla nueva
casos                      865 → 899
```

## El hallazgo que cambió el alcance

`SUITE-R08` dice que **el registro asigna**. Buscando quién ejecuta esa asignación entre las quince
acciones de `tracker`: **ninguna**. La hacía quien editaba el archivo a mano — durante 65 tareas,
yo.

Con una persona no es un defecto: el archivo tiene un solo escritor. Con dos, el único mecanismo
que queda es el merge de git. Así que la acción entró en la tarea: **un rango que nadie aplica es
decoración**, y sin ella ningún `AC` se cumple sobre nada.

## La colisión, reproducida

No la supuse. Dos ramas, Ana y Bruno, los dos asignan `PT-066`:

```json
  "counters": { "PT": 66 },        ← fusionado SIN conflicto: los dos pusieron 66
  "allocations": [
    { "id": "PT-066",
<<<<<<< HEAD
      "slug": "lo-de-bruno"
=======
      "slug": "lo-de-ana"
```

**El contador no entró en conflicto.** Git lo dio por acordado, y el conflicto quedó reducido a una
línea de `slug`. Quien lo resuelva elige un texto y **la otra tarea desaparece entera**, con el
contador diciendo 66 como si todo estuviera bien.

El daño no es el conflicto: es que **el conflicto parece pequeño**. Y si las dos entradas hubieran
quedado separadas por otras líneas, git las habría fusionado sin conflicto ninguno — dos `PT-066` y
`LEX-R04` roto en silencio.

## `[1,100]` y `[100,200]` **sí** se solapan

Es un `<=` en vez de un `<`, y la inversa enseña que importa: con `<`, esos dos rangos dejan de
solaparse — y el número 100 es **exactamente** el que las dos personas pedirán a la vez. Tres casos
caen solo por eso.

## Dos defectos míos, los dos del mismo tipo

**Un `RegExp` construido con plantilla necesita doble barra.** `` `-(\d+)$` `` dentro de un template
literal busca la letra `d`. `asignar` decía **0 usados** mientras `personas` decía **65** — lo vi
ejecutando las dos seguidas, no leyendo. Pasó **dos veces**: en `tracker` y en `verify-fdge`.

**Y `--slug` no estaba en `CON_VALOR`**, así que `prueba` se tomó por `ROOT`. **Sexta vez** que un
argumento nuevo se cuela por ahí. Ya hay tres guardas —etiquetas, subcomandos, valores— y sigue
apareciendo: el problema no es la lista, es que un posicional y un valor de opción son
indistinguibles por forma cuando la opción no se declara.

## Lo que no queda comprobado

**Que dos personas asignen a la vez de verdad.** La colisión está reproducida y los rangos la
evitan por construcción — pero eso es un argumento, no dos personas reales.

**Que nadie asigne a mano.** `verify-fdge` lo detecta después; impedirlo no se puede, porque el
registro es un archivo y editarlo es legítimo.

**Que los rangos elegidos sean los correctos.** Repartir el espacio es una decisión de equipo.

**Y que este repositorio los use.** No los declara: es de una persona, y `AC-06` dice que sin
rangos todo funciona como hoy. Las comprobaciones se probaron declarándolos **temporalmente** y
restaurando el registro después. Funcionan; no están en uso.
