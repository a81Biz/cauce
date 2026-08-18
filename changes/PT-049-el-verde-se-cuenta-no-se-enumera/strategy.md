# PT-049 — Estrategia   `PHASE 3`

## Objetivo

Que las dos herramientas puedan decir **qué falló y sobre cuántos** sin enumerar los cientos de
`✓` que no informan — y que el recuento **nunca** se pierda por el camino.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Que `-q` sea el modo por defecto | El verde enumerado es lo que hace **creíble** el rojo la primera vez que alguien lee la salida. Lo que sobra es repetirlo quince veces, no tenerlo |
| Redirigir el verde a un archivo y el resto a la consola | Dos salidas para un veredicto. El archivo nadie lo abre, y quien lo abra ya no sabe si es de esta ejecución |
| Un `--verbose` que invierta el defecto | Es el mismo cambio con la carga al revés: obliga a recordar una bandera para ver lo normal |
| Filtrar con `grep` desde quien llama | Es lo que se hizo en `EP-013` quince veces, y por eso se mide aquí. Un `grep` no sabe qué es el recuento: lo pierde o lo arrastra por casualidad |
| Callar también los avisos | 19 de los 43 dicen «aún no toca» y sobran, pero los otros 24 son hallazgos. Distinguirlos **no es lo que esta tarea firmó** |
| **`-q` explícito, que calla la enumeración del verde y nada más** | Es la línea exacta entre lo que informa y lo que se repite |

## Solución

Una bandera, el mismo comportamiento, distinta impresión:

```
selftest.sh -q         520 casos, 0 fallos            ← 541 → 2 lineas
verify-fdge --all -q   los 43 avisos, 0 errores, 49   ← 507 → 46 lineas
```

**Tres invariantes, y las tres tienen caso propio:**

```
1  el RECUENTO se imprime siempre. Un «sin errores» sin denominador es lo que
   PT-002 corrigio, y PT-023 lo volvio a encontrar en otra forma: el silencio
   parece exito
2  con fallos, -q los enumera TODOS. No es un modo que ademas esconda
3  el codigo de salida es IDENTICO con y sin -q. El modo imprime, no decide
```

La tercera es la que impide que esto se convierta en un atajo: si `-q` pudiera cambiar el `exit`,
sería una segunda forma de aprobar, y habría dos verdades sobre el mismo árbol.

## Por qué es barata

**Las dos herramientas ya cuentan.** `selftest` lleva `TOTAL` derivado —desde que dos cifras
escritas a mano divergieron— y `verify-fdge` cierra con «PTs verificados: N». No se añade una
capacidad: se **deja de imprimir** una que ya está contada.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| La CI, que lee la salida completa | No se toca: sin `-q` la salida es **idéntica**. Caso propio que la compara |
| El `exit` de `npm run verify` | `AC-04` lo exige igual con y sin `-q`, y tiene su caso en las dos direcciones |
| Los casos que aseveran sobre la salida | Los 520 existentes corren sin `-q`. Si alguno cambia, es que `-q` alteró el modo normal |
| `revento()`, que detecta una herramienta rota | Sigue leyendo la salida completa: `-q` no se usa dentro del arnés |
| `audit`, `verify-suite`, `tracker` | Fuera de alcance. Esta tarea toca **dos** herramientas |

## Criterios de éxito, derivados de los AC

- `AC-01` → `-q` deja fallos y recuento, en las dos
- `AC-02` → el recuento no se calla **nunca**, ni con `-q` ni con la batería en verde
- `AC-03` → con fallos, los enumera todos
- `AC-04` → el `exit` no depende del modo

## Autorrevisión

**El riesgo de esta tarea es pasarse.** Medir dio 43 avisos en `verify-fdge`, 19 de ellos diciendo
«aún no toca», y la tentación evidente es acallarlos de paso —bajaría de 46 líneas a 27 y se
sentiría como progreso—. No entra: no es lo que la tarea firmó, y decidir el alcance a mitad de
la implementación es exactamente lo que `PT-023` midió que sale mal.

Se deja **medido y dicho** en el `discovery`, para que si merece tarea la tenga con su intake.

Contradicciones con otras reglas: ninguna. `AC` sin cubrir: ninguno.

**Lo que no resuelve:** que la salida de `verify-fdge` siga siendo larga incluso en `-q`. La causa
no es el verde, y esta tarea no la toca.
