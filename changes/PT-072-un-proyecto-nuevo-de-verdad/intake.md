# PT-072 — Un proyecto nuevo de verdad

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-072
type: INVESTIGATION
epic: EP-017
track: STANDARD
status: INTEGRATED
phase: 9
created: 2026-08-19
structural: no
suite_version: 9.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Demostrar que la 9.0.0 sirve para un proyecto nuevo. Un sitio nuevo real: `FIDE` → `Foundation` → instalación → un `PT` completo hasta `G4`, contra la 9.0.0 empaquetada con `npm pack`, nunca contra la publicada.»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | La instalación se hace desde el paquete, no desde el repositorio | `npm pack` y se instala el `.tgz` en un directorio limpio |
| AC-02 | El proyecto nuevo recorre las nueve fases de una tarea | existe un `PT` con sus artefactos, su evidencia y sus compuertas, fuera de cauce |
| AC-03 | Cada hueco encontrado queda anotado con su fase y su síntoma | una lista, no una impresión: es la entrada de `PT-073` |
| AC-04 | El grafo del proyecto nuevo nace con el alcance correcto | depende de `PT-070`; si no, se declara que la prueba midió el defecto |
| AC-05 | Lo que no se pueda completar se declara, no se rellena | un paso que no salga se anota como hueco, no se simula |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: un proyecto nuevo, fuera de este repositorio, ha cerrado un `PT` completo con la 9.0.0 empaquetada, y los huecos encontrados están escritos con su fase.

## 4. Qué NO entra   `[AGENTE]`

- OUT: Publicar la `9.0.0`.
- OUT: Arreglar los huecos que aparezcan: se anotan aquí y se deciden después. Arreglarlos sobre la marcha expandiría la prueba hasta que dejara de terminar.
- OUT: El proyecto legado: es `PT-019`.

## 5. Firma

```
Firmado por lote: EP-017
```
