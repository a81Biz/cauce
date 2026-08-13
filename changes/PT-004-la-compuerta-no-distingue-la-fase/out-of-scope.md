# PT-004 — Fuera de alcance   `PHASE 4`

Del intake firmado, ampliado con lo que apareció en `PHASE 3` y `PHASE 4`.

| Fuera | Por qué | Dónde va |
|:---|:---|:---|
| Relajar `FDGE-R15` o `FDGE-R42` | Los artefactos siguen siendo obligatorios; se corrige **cuándo** se exigen | — |
| Quitar `verify-fdge --all` de CI | Apaga la compuerta en vez de arreglarla | — |
| Inventar los artefactos que faltan para poner el verificador en verde | Es el falso verde que el lote existe para eliminar | — |
| `FDGE-R52` e ignorar la plataforma | Es platform-awareness, no phase-awareness. Scope lock (`FDGE-R20`) | `PT-001` · `AC-07` |
| Las etiquetas que `tracker` necesita y no crea | Misma razón | `PT-001` · `AC-08` |
| Hacer `phase` obligatoria y fallar sin ella | Pondría en rojo a todo proyecto instalado: el mismo daño en la otra dirección | Decisión posterior, con su entrada de CHANGELOG |
| Añadir `phase:` a `INTAKE/templates/TAREA.md` | Cambia la plantilla que viaja a todos los proyectos destino. La lectura del registro ya cubre el caso | Decisión posterior |
| Sustituir `afterPhase6` por la fase declarada | Ahí la inferencia por `manifest.json` es correcta. Un cambio sin defecto que lo motive es alcance que crece solo | — |
| Ampliar el grafo a `docs/methodology/tools/` | `TD-01`, ya registrada | Deuda declarada |
| Entrada de `CHANGELOG.md` y número de versión | Es cierre de lote, no de tarea, y `TD-05` sigue sin decidir | Cierre de `EP-001` |
| Merge a `main` y publicación | `G4` humana sin excepción (`EXEC-R04`, `SUITE-R06a`) | — |
