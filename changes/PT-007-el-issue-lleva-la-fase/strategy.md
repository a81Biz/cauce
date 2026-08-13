# PT-007 — Estrategia   `PHASE 3`

## Objetivo

Que el tablero de GitHub responda «qué va cuándo» sin abrir el repositorio, **derivándolo** del
registro.

## Solución

Dos etiquetas por issue vivo, ambas derivadas:

```
fase: N      de REGISTRY.allocations[].phase
G1..G4       del mapa de CORE.md §Fases — PHASE 1◆G1 · 4◆G2 · 7◆G3 · 9◆G4
```

Y `tracker estado`, que imprime el tablero sin tocar la plataforma: PT, tipo, severidad, fase,
compuerta e issue, leyendo solo el registro. Es lo que responde la pregunta en local; las
etiquetas la responden en GitHub.

El espejo gana una tercera comprobación: **la etiqueta tiene que corresponder al registro**. Sin
ella, publicar el estado sería escribirlo y no comprobarlo — que es como se separan dos copias.

## Alternativas evaluadas

**A · Un campo `gate` en `REGISTRY.json`.** **Rechazada:** es derivable de la fase. Un campo que
alguien tiene que actualizar es un hecho copiado (`RULE-01`), y el marco ya tiene cicatrices de
eso.

**B · GitHub Projects con columnas.** **Rechazada:** añade una segunda representación del mismo
estado, con su propio sitio donde divergir. Las etiquetas viven en el issue que ya existe.

**C · Escribir el estado en el cuerpo del issue.** **Rechazada:** el cuerpo se escribió una vez
al abrir y no se toca; reescribirlo en cada transición convierte el issue en un documento
mutable sin historial, que es lo contrario de lo que da el repositorio.

**D · Milestone por fase.** **Rechazada:** `PT-003` ya descartó los milestones.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Riesgo | Mitigación |
|:---|:---|:---|
| Etiquetas viejas que ya no corresponden | Medio | Al sincronizar se quitan las de fase que sobran; solo una por issue |
| Proyectos sin plataforma | Ninguno | Todo detrás de `tracker.plataforma` |
| El espejo se vuelve más estricto y rompe a alguien | Medio | Las etiquetas se crean y sincronizan con `abrir --aplicar`; el error dice el comando |
| Los 227 casos | Bajo | Batería completa |

## Criterios de éxito

Los siete `AC` del intake. El que manda es `AC-03`: el estado se **deriva**, nunca se lee de
vuelta.
