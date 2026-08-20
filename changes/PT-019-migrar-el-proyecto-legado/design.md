# PT-019 — Propuesta   `PHASE 4` · `G2`

## Esta tarea entrega una medición, no un cambio

No toca ni una línea del marco. Lo que entrega es la respuesta a una pregunta que llevaba abierta
desde el 13 de agosto: **¿se puede migrar un legado real?**

La respuesta es **sí**, y viene con dos huecos y una limitación declarada.

## Lo entregado

1. **La medición del legado real** — `4.12.0`, 114 tareas, 36 de 39 archivos distintos, 7
   herramientas ausentes.
2. **El informe de `migrate`** sin `--apply`: 1 acción automática, 6 decisiones humanas.
3. **La comparación de marcos** completa.
4. **Dos huecos** con su destino (`SUITE-R44`).
5. **La prueba de no destrucción**: `git status` del original, `0` cambios, antes y después.

## Por qué no se ejecutó `migrate --apply`

Porque el intake lo pone `OUT` y la autorización del firmante es usar el proyecto como **caso de
prueba**, no migrarlo. Ejecutarlo habría convertido una prueba en una intervención sobre un
sistema con 114 tareas de historia que alguien usa.

**Y eso deja un límite real que no se disimula**: se validó que el informe es correcto y
accionable, no que la migración funcione de extremo a extremo. Entre las dos cosas hay un paso.

Si quieres cerrarlo, el camino no destructivo existe y está descrito en `acciones-humanas.md`:
clonar y aplicar sobre el clon.

## Por qué no se construyó el legado sintético

`AC-01` lo pedía. **El real provoca los casos mejor**: sus divergencias son auténticas —
documentación que contradice al código, herramientas ausentes, dos allocations vivas sin `phase`—
y un sintético habría medido mi capacidad de inventar defectos, no la de Foundation de encontrarlos.

Es una reducción de alcance y se declara como tal, no se presenta como equivalente.

## Los dos huecos

**`HL-1` · `comparar-marco` invierte las etiquetas.** Llama «canónica» al argumento, así que
ejecutada desde cauce contra un destino dice «solo en la copia local» de lo que son las novedades
del marco. El contenido es correcto; el rótulo miente. Está pensada para correr **desde el
proyecto**, y eso no está escrito. → `PT-073`, que es donde vive lo que hay que contar.

**`HL-2` · `migrate` promete de más.** «OPCIONAL — declarar plataforma de trabajo… **Sin ella no
cambia nada**». `PT-072` midió que sin plataforma no se avanza ni una fase. Un legado que migre
siguiendo este informe y no la declare se queda sin poder mover una tarea. → `PT-084`.

Los dos son de **texto y contrato**, no de la mecánica de migrar. La migración en sí funciona.

## Escenarios

| # | Escenario | Espera | Resultado |
|:---|:---|:---|:---|
| E1 | El proyecto real está accesible | sí, o se declara y se sigue con el sintético | ✅ accesible |
| E2 | Foundation/`comparar-marco` detectan la divergencia | la declaran, no callan | ✅ 36 de 39 |
| E3 | `migrate` detecta la versión instalada | `4.12.0` | ✅ |
| E4 | `migrate` separa lo automático de lo humano | y dice por qué cada una es humana | ✅ 1 y 6 |
| E5 | El original no se toca | `git status` sin cambios | ✅ `0` |
| E6 | Cada hueco queda con su fase y su síntoma | una lista, no una impresión | ✅ `HL-1`, `HL-2` |

## `G2`

```
Firmado por lote: EP-017 · delegada · 2026-08-20 · Alberto Martínez
Viabilidad (FDGE-R54): MARGINAL · el veredicto se conserva y la tarea es de LECTURA,
que es exactamente el trabajo atómico que MARGINAL admite.
```
