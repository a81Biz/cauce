# PT-014 — Estrategia   `PHASE 3`

## Tres caminos, y dos se descartan por lo que cuestan

| Camino | Por qué no |
|:---|:---|
| Llamar a `sincronizarCuerpos()` también en la rama que crea | Funciona, pero **edita cada issue justo después de crearlo**: una llamada de más por allocation, para arreglar algo que nunca debió pasar. `AC-03` lo excluye |
| Diferir la creación del lote a una segunda vuelta | Es la solución que el problema sugiere y la que peor envejece: dos vueltas donde había una, y una rama de código que solo corre a veces |
| **Crear las tareas antes que su lote** | Con la dependencia en un solo sentido, un orden basta. Cero llamadas nuevas |

## Lo que se hace

Una función pura, `ordenDeApertura(pendientes)`, que pone los `EP` al final. `abrir()` itera
sobre ella en vez de sobre `pendientes`.

Pura y exportada por la razón de siempre en esta herramienta: se prueba **sin credenciales**.
El arnés importa el módulo y comprueba el orden; no hace falta GitHub para verificar que un
lote va detrás de sus tareas.

## Por qué el orden es suficiente y no una casualidad

Si algún día el cuerpo de un `PT` necesitara el número de su lote, habría ciclo y ningún orden
serviría. Hoy no lo necesita, y el diseño del cuerpo —el `PT` cita a su lote por identificador,
que no depende de la plataforma— es deliberado (`PT-010`). Queda escrito en el comentario de la
función para que quien lo rompa vea qué está rompiendo.
