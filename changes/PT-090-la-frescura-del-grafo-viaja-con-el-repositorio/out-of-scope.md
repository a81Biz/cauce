# PT-090 — Fuera de alcance   `SUITE-R44`

| Qué queda fuera | Por qué | Destino |
|:---|:---|:---|
| **Versionar `graphify-out/`** | **2,3 MB medidos**, medio de ellos `graph.html` regenerable, y un conflicto de merge por regeneración. `SUITE-R37` ya lo declara regenerable | `—` |
| Generar el grafo en **CI** | `FDGE-R32` reserva el disparo a una persona. Automatizarlo es exactamente lo que esa regla impide | `—` |
| Versionar sólo `manifest.json` | Un manifiesto sin grafo describe algo que no está: `FDGE-R43` pasaría a comprobar la frescura de un archivo ausente | `—` |
| Que en un clon limpio la frescura **se compruebe** | No se resuelve aquí. Pasa a decir «no evaluable», que es honesto y no es lo mismo | `—` |
| `TD-17` | Se actualiza con la decisión tomada al cerrar el lote, junto con la entrada del `CHANGELOG` | `EP-018` |
| Cambiar el **alcance** del grafo | Lo calcula `plan-layout` desde `PT-070` y coincide con `REGISTRY.graph.scope` | `—` |

## La primera fila es la que había que decidir, y se decide con una cifra

`H-005` la presentaba como una de tres salidas equivalentes. **No lo son**: dos cuestan casi cero
y una cuesta 2,3 MB en la historia más un conflicto por regeneración.

Y el hallazgo daba por hecho que versionar **resolvería** el problema. **No lo resolvería**: las
rutas del manifiesto son absolutas, así que seguiría sirviendo sólo en un disco.
