# PT-053 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Proyectar a `cauce/<usuario>` en cada transición | PT-054 |
| Evaluar el presupuesto antes de avanzar | EP-015 |
| Que `avanzar` resuelva compuertas | — |
| Que `avanzar` haga commit o push | — |
| Impedir que alguien edite `REGISTRY.phase` a mano | — |
| La entrada de `CHANGELOG` del lote y el número de versión | EP-014 |

**La tercera y la cuarta llevan `—` y son fronteras, no pereza.**

`EXEC-R04` y `SUITE-R06a` dejan las compuertas en manos humanas **sin excepción**: un comando que
las resolviera sería el sitio donde esa regla se rompe sin que nadie lo note.

Y un comando que además commitea **decide qué entra en el commit**. `SUITE-R34` exige que el estado
viaje con el trabajo, pero **agrupar es una decisión de la tarea**, no del tracker: `PT-052` metió
seis documentos en un commit y `PT-049` dos, y las dos veces fue correcto por razones distintas.

**La quinta también lleva `—`, y es el límite honesto de esta tarea.** No hay forma de impedir la
edición manual sin quitar el acceso al archivo, y quitarlo rompería todo lo demás. Lo que hay es
que `FDGE-R52` lo cazará **después** —que es donde estábamos— pero ahora con un camino fácil que no
lo requiere. Que eso baste es un juicio, y está declarado como tal en `test-scenarios.md`.
