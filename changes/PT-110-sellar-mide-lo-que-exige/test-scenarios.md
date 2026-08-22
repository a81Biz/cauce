# Escenarios de prueba — `PT-110`

## En la batería

| Caso | Qué establece |
|:---|:---|
| `sellar` mide las cifras del inventario | la medición está donde se decide sellar |
| …y dice `SIN EVALUAR` cuando no puede leerlas | `RULE-06` |

## Lo que NO se prueba

- **Que la descripción en prosa del inventario sea cierta.** Se miden las cifras, y el propio
  mensaje de `FND-R14` lo declara.
- **Qué más debería mirar `sellar`.** Se añade el que cayó siete veces.
