# PT-062 — Estrategia   `PHASE 3`

## Lo que se construye

Un **rango por persona** en `personas`, y la acción que faltaba:

```json
{ "nombre": "Alberto Martínez",
  "git": [ … ],
  "rango": { "PT": [1, 999] } }
```

```
tracker asignar PT --slug lo-que-sea    el siguiente ID DE MI RANGO
tracker asignar PT --ver                cuál sería, sin escribir nada
```

## La decisión que cambió el alcance

`PHASE 2` encontró que **nadie asigna**: `SUITE-R08` afirma que el registro asigna y ninguna acción
lo hace. Un rango declarado que nadie aplica es **decoración** — así que la acción entra en esta
tarea. Con ella, `SUITE-R08` pasa de ser una afirmación a ser ejecutable.

No es ampliar el alcance por gusto: sin la acción, `AC-01`…`AC-05` no se pueden cumplir sobre nada.

## Las cuatro decisiones

### 1. El rango acota; el registro sigue asignando

`SUITE-R08` **no cambia**. El registro sigue siendo el único asignador: lo que hace el rango es
decir **de dónde** saca el número para cada persona. El contador global deja de ser uno y pasa a
ser **el máximo usado dentro de cada rango**, derivado de las allocations — no un campo aparte que
pueda divergir (`SUITE-R38`).

**`counters` se queda como está** para no romper nada, pero deja de ser la fuente cuando hay
rangos: con rangos, el siguiente ID se **deriva** de lo que ya está asignado.

### 2. Sin rangos, exactamente como hoy

`AC-06`. Un proyecto de una persona no declara nada y `asignar` usa `counters` como siempre. Esto
es lo que hace que la tarea no rompa a nadie.

### 3. Solaparse **falla**, y falla al verificar

Dos rangos solapados son **peores que ninguno**: dan confianza sin darla, y la colisión aparece más
tarde, cuando ya hay trabajo hecho. Se comprueba en `verify-fdge` —no solo al asignar— para que se
vea aunque nadie asigne ese día.

### 4. Agotado se dice; nunca se invade

`AC-05`. Invadir el rango del siguiente reproduce exactamente la colisión que esto evita. La acción
**se niega** y dice cuánto queda y qué hacer: ampliar el rango es una decisión humana, como todo lo
que cambia el reparto.

## Cómo se elige un rango

**No se elige solo.** Repartir el espacio de identificadores es una decisión de equipo, y una
herramienta que lo hiciera por su cuenta estaría decidiendo algo que no le toca.

Lo que sí hace `tracker personas` es **enseñar los rangos y sus huecos**, para que quien decida
tenga los datos delante.

## Lo que NO se hace

**No se namespacea el identificador.** Decisión 2 del firmante, y el motivo es duro: `LEX-R04`
declara los IDs permanentes, y `PT-alberto-001` rompería cada referencia escrita en 65 tareas
cerradas.

**No se renumera nada.** `LEX-R04`. Los 65 `PT` existentes se quedan donde están; los rangos
aplican a lo que se asigne desde ahora, y el rango por defecto de la primera persona los incluye.

**No hay servicio central.** El registro es un archivo del repositorio, y eso es lo que permite
asignar sin red.

**No se resuelve el conflicto de merge.** Los rangos hacen que no lo haya *por el identificador*.
Si dos personas tocan líneas contiguas, sigue habiendo un conflicto de texto — pero entonces es uno
de verdad, cuya resolución obvia conserva las dos entradas.

## El riesgo

Que alguien asigne **a mano** —editando el archivo, como se ha hecho hasta hoy— y se salte su
rango. La acción no puede impedirlo.

La defensa es que `verify-fdge` compruebe que **toda allocation cae en el rango de alguien** cuando
hay rangos declarados. Así una asignación a mano fuera de rango se ve en la siguiente verificación,
que es antes de cualquier compuerta.
