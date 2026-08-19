# PT-057 — Diseño   `PHASE 4`

## La función pura

```js
/**
 * La referencia de coste de un tipo de tarea, DERIVADA de las cerradas.
 *
 * `cerradas` son objetos {id, type, complexity, commits, archivos, lineas} que quien llama ya
 * derivó de git — esta función no toca git ni el disco, igual que `estadoDelArbol`.
 */
export function costeDe(cerradas, { tipo, complejidad, minimo = MINIMO_REFERENCIA } = {}) {
  const grupo = (cerradas ?? []).filter((c) =>
    (!tipo || c.type === tipo) && (!complejidad || c.complexity === complejidad));
  const base = { tipo: tipo ?? null, complejidad: complejidad ?? null, casos: grupo.length, minimo };
  if (!grupo.length) return { ...base, referencia: null, motivo: 'ninguna tarea cerrada de este tipo' };
  const m = (campo) => resumen(grupo.map((c) => Number(c[campo]) || 0));
  const medidas = { commits: m('commits'), archivos: m('archivos'), lineas: m('lineas') };
  if (grupo.length < minimo) {
    return { ...base, referencia: null, motivo: `solo ${grupo.length}, y hacen falta ${minimo}`,
      casos_crudos: grupo.map((c) => ({ id: c.id, commits: c.commits, archivos: c.archivos, lineas: c.lineas })) };
  }
  return { ...base, referencia: medidas };
}

/** Mediana y rango. Nunca media: un solo caso la arrastra, y aqui los grupos son de 6 a 13. */
export function resumen(xs) {
  const v = [...xs].sort((a, b) => a - b);
  const mediana = v.length % 2 ? v[(v.length - 1) / 2] : Math.round((v[v.length / 2 - 1] + v[v.length / 2]) / 2);
  return { mediana, min: v[0], max: v[v.length - 1], n: v.length };
}
```

**`referencia: null` con `motivo` es el mismo patrón de tres estados que `estadoDelArbol`
(`PT-056`)**: no hay cifra, y se dice **por qué** no la hay. Un cero o un `NaN` en su lugar
entrarían en `PT-058` y `PT-059` como si fueran medidas.

## La atribución

```js
/**
 * De quien es un commit. El primer PT del ASUNTO, y solo del asunto.
 *
 * PHASE 2 lo midio: 61 de 162 commits nombran mas de un PT y uno nombra DIEZ, porque el cuerpo
 * cita las tareas anteriores —«CORRIGE PT-052»— y eso es lo CORRECTO en una bitacora append-only.
 * Buscar por --grep atribuia a una tarea el trabajo de otras, y con esa medicion BUG/TRIVIAL y
 * BUG/STANDARD salian identicos hasta la linea: 5 commits, 65 archivos, 2708 lineas los dos.
 */
export const duenoDe = (asunto) => (String(asunto ?? '').match(/PT-\d{3}/) ?? [null])[0];
```

## La acción

```
tracker coste                        todos los grupos, ordenados por numero de casos
tracker coste CHORE                  todas las complejidades de CHORE
tracker coste CHORE STANDARD         un grupo
```

Salida de un grupo **con** referencia:

```
  CHORE/STANDARD · 13 tareas cerradas
    commits     2     (1 – 7)
    archivos   26     (19 – 29)
    lineas   1966     (398 – 2491)

  Derivado de 13 de las 53 cerradas. 8 cerradas no tienen commit propio: no costaron cero,
  es que no se puede saber. Es una REFERENCIA de su tipo, no una prediccion de tu tarea.
```

Y **sin** referencia:

```
  CHORE/SIMPLE · 1 tarea cerrada — SIN REFERENCIA (hacen falta 5)
    PT-027    commits 1 · archivos 3 · lineas 73

  Una mediana de una tarea no es una mediana. Ahi esta el caso; el juicio es de quien lo lea.
```

`tracker coste` entra en `SIN_PLATAFORMA`: se deriva de `REGISTRY.json` y de git, y **exigir
credencial para eso fue el defecto que CI le encontró a `PT-056`**.

## Las constantes, donde se puedan discutir

```js
// El umbral de AC-03. Es un JUICIO, no un resultado: nada demuestra que cinco sea el numero.
// Se pone aqui, con nombre, para que se pueda discutir — no enterrado en un `if`.
export const MINIMO_REFERENCIA = 5;
```

## Lo que NO se construye

| Qué | Por qué |
|:---|:---|
| Un archivo con los costes | Diverge en cuanto se cierre la tarea siguiente (`SUITE-R38`) · se recalcula |
| Media, desviación, percentiles | Con grupos de 6 a 13 y rango de diez veces, dan precisión aparente |
| Predicción de **una** tarea | El `out-of-scope` del intake · esto es la referencia de un tipo |
| Coste en tokens | Decisión 4 del firmante · nada en el repositorio lo registra |
| `MEDIDO` / `ESTIMADO` | `PT-058` |
| Decidir con la cifra | `PT-059` |

## La antigüedad, declarada y no resuelta

`BUG/TRIVIAL` sale más caro que `BUG/STANDARD` porque sus tareas son **anteriores a `FDGE-R19`**,
cuando un commit llevaba el trabajo entero. La cifra describe con verdad un pasado que ya no
aplica. La salida dice de **cuántas** tareas sale; **de cuándo**, no — y eso haría falta.

No se hace aquí porque cambia qué significa la referencia (pasa de «tu tipo de tarea» a «tu tipo
de tarea, últimamente»), y esa es una decisión de producto que corresponde a quien firme el lote,
no un detalle de implementación. Queda en `out-of-scope.md` con destino declarado.
