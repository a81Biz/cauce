# Estrategia — `PT-137`   `PHASE 3`

## El camino elegido

Un comando nuevo, `tracker retomar`, que escribe la transición `DEFERRED → DRAFT` **sin pedir
intake**, contrasta el firmante y deja rastro.

## Los caminos descartados, con su por qué

**1 · Ampliar `integrar` para que acepte `DEFERRED`.** Descartado. `integrar` existe para
escribir **dos** fuentes a la vez —el registro y el YAML del intake— y su valor es justo esa
atomicidad. Un aplazado no tiene YAML: meterlo ahí obligaría a que el comando tuviera una rama
«a veces no hay intake», que es como se erosiona una garantía hasta que deja de valer.

**2 · Quitarle a `SUITE-R44` la exención de artefactos.** Descartado, y es el más tentador. Si
un aplazado tuviera intake, `integrar` ya funcionaría. Pero la exención es lo que hace **barato**
aplazar: obligar a escribir un intake completo para aparcar algo convierte el aplazamiento en
trabajo, y entonces nadie aplaza — se olvida, que es peor y es el defecto que `SUITE-R44` nació
para cerrar.

**3 · Que `avanzar` trate `DEFERRED` como no terminal.** Descartado. `avanzar` mueve **fases**,
no resucita allocations; y su protección de lo terminal cubre `REJECTED`, donde es correcta.
Aflojarla ahí para arreglar esto abriría un camino de vuelta también para lo rechazado.

**4 · Dejarlo a mano y documentarlo.** Descartado por lo que es: exactamente `CE-006`, y este
lote existe para cerrarla.

## Cómo se verifica

Casos en `selftest.sh` sobre un fixture con una allocation `DEFERRED` **sin directorio** en
`changes/` —que es el caso real— y prueba inversa con supresiones sobre una copia del módulo.

El `AC-06` no se verifica con fixture: se verifica **ejecutando el comando sobre `PT-134`**. Un
comando que sólo funciona en el laboratorio no es el comando que hacía falta.
