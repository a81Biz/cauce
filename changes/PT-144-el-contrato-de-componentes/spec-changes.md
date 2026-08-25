# PT-144 · `spec-changes.md` — `PHASE 4` Proposal

> Cambios a PRD, TRD, API, esquema, contratos o eventos.

## Resumen

```
PRD / 02          sin cambios
TRD / 03          sin cambios
API / 08          sin cambios — este paquete no expone rutas ni endpoints
Esquema de datos  sin cambios — REGISTRY.json no interviene
Eventos           sin cambios
Contratos         UNO NUEVO, interno al paquete. Ver abajo.
```

## Contrato nuevo — interno, no publicado

`tools/patrones.mjs` gana dos exports. **No son API pública del paquete**: `patrones.mjs` es un
módulo interno que consumen las herramientas de `docs/methodology/tools/`, y el paquete no lo
declara como punto de entrada.

```
COMPONENTES   los seis componentes de la suite, con ocho campos
FAMILIAS      las diez familias de reglas, con prefijo, documento propietario y orden
              + siete funciones de proyeccion (design.md 2)
```

**Aditivo y sin ruptura**: ningún export existente se toca, renombra ni reordena (`RC-01`).

## Efecto en la versión de la suite

```
Rompe compatibilidad:  NO
Bump esperado:         ninguno por esta tarea. El lote entero es MINOR por restriccion
                       declarada en EP-022 3 — «aditivo, no rompe ni cambia lo que ya esta».
```

Un proyecto instalado que no actualice **no se entera de nada**: hasta que `PT-145`..`PT-147`
consuman el contrato, ninguna herramienta cambia de comportamiento, que es exactamente `AC-04`.

## Documentación de la metodología

**Ninguna en esta tarea.** Escribir el procedimiento de alta y baja de un componente es `PT-148`,
y va la sexta a propósito: documentar el mecanismo antes de construirlo describiría el
**planeado**, y el planeado y el construido divergen.

`LEXICON`, `RULES.md` y `CASOS-DE-USO.md` **no se tocan aquí**.

## Nota sobre `SUITE-R06(e)`

Esta tarea modifica `docs/methodology/`, así que cae bajo la cláusula que dice que eso no se
automatiza. No es una excepción: es el modo normal de este repositorio, y la autorización del
firmante para el lote está enumerada en `SESSION_LOG.md`.
