# PT-072 — Estrategia   `PHASE 3`

## Esta tarea no diseña: ejecuta

No hay opciones que sopesar. El intake pide un proyecto nuevo **real** contra el paquete, y
cualquier atajo destruye lo que la tarea mide:

| Atajo | Por qué invalida la prueba |
|:---|:---|
| Instalar copiando `docs/methodology/` | Es lo que hacía la v3, y es lo que el paquete existe para eliminar. No probaría `npm pack` |
| Usar el paquete **publicado** | Es la `8.2.0`. La que hay que probar es la que va a salir |
| Un proyecto de juguete sin código | Foundation no tendría nada que leer, y `plan-layout` nada que decidir |
| Declarar plataforma para que todo fluya | Habría ocultado `H7`, el hueco más grave |

**No se declaró plataforma a propósito**, y ahí apareció el único hueco crítico.

## Qué se decidió sobre la marcha, y por qué

**Un proyecto con código de verdad, aunque mínimo.** `tareitas`: cuatro funciones exportadas y un
servidor. Basta para que Foundation encuentre **tres divergencias reales** y para que el primer
`PT` arregle una de ellas — que es el ciclo entero en miniatura.

**El defecto del primer `PT` sale del baseline, no de mi cabeza.** `D2` la encontró Foundation
leyendo el código. Inventar un bug habría probado que sé escribir un `PT`, no que el marco
encuentra trabajo.

## Qué se hace con los huecos

`SUITE-R44` exige que un diferimiento cite su destino:

| Hueco | Destino |
|:---|:---|
| `H7` la plataforma es obligatoria de hecho | **`PT-082`** |
| `H6` la plantilla falla su propio verificador | **`PT-083`** |
| `H1`..`H5` fricción de arranque | **`PT-073`**, los tres documentos: son lo que el manual tiene que decir |

Ninguno se arregla aquí. `AC-03` pide anotarlos con fase y síntoma, y arreglarlos dentro de la
prueba convertiría la prueba en su propio arreglo.
