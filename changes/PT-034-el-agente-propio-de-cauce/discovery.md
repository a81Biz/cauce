# PT-034 — Descubrimiento   `PHASE 2` · `FDGE-R42`

Dos reglas ya intentaron esto y las dos dependen de que el agente pregunte:

```
SUITE-R48  la respuesta es consultable    → pero un comando no puede exigir haber sido llamado
SUITE-R49  la consulta va lo primero      → pero una convención se puede ignorar
```

Lo escribí en las dos self-reviews antes de que nadie me lo señalara, y aun así el hueco seguía
abierto. **No es un problema de redacción: es de arquitectura.**

## Dónde está el punto de entrada

`bin/cauce.mjs` es el binario publicado. Tiene `install`, `verify`, `compare`, `core`, `version`
— y ninguno arranca una sesión. El arranque hoy es «el agente carga `CORE.md`», que es un acto
del agente, no del marco.

## Lo que cambia si el arranque es del marco

Si arrancar **es** ver el tablero y después el núcleo, no hay un paso que saltarse: no existe.
Es la misma diferencia que este marco usa para justificarse entero — una regla escrita frente a
una compuerta escrita en una herramienta.
