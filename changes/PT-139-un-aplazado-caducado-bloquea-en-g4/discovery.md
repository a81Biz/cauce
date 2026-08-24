# Descubrimiento — `PT-139`   `PHASE 2`

## Qué había que mirase un aplazado

**Nada.** Medido sobre las herramientas: `verify-fdge` comprobaba `SUITE-R44` **sólo** sobre las
filas de `out-of-scope.md` —que la cita fuera recíproca— y nunca sobre el aplazado en sí. El
tablero lo mantenía **vivo**, que es lo que `SUITE-R44` pide, y ahí terminaba.

```
PT-134  2026-08-23   sin revision, sin dueno
PT-025  meses antes  sin revision, sin dueno
```

Dos aplazados **idénticos** en el tablero, separados por meses.

## Qué hace falta para que sea comprobable

`PT-138` creó el bloque `aplazamiento` con `revision`. Con eso, la pregunta «¿está caducado?» pasa
a tener respuesta mecánica — y sin él, no la tiene. **Por eso esta tarea va después y no antes.**

## Los dos límites del sitio donde se pone

- **`RIGE_DESDE`.** Los aplazados anteriores a `LEX-R34` no pudieron declarar lo que nadie les
  pedía. Juzgarlos sería `CE-014`.
- **La fecha de hoy.** Un literal en el código o en un caso caduca solo: es `CE-010`. Se deriva
  del último commit, y del reloj del sistema cuando no hay git — la misma lección que `PT-138`
  aprendió dentro de `aplazar`.

## Qué NO se midió

- **Cuántos aplazados caducados hay en proyectos instalados.** No hay acceso.
- **Si el umbral debería ser distinto de «vencido».** Un margen de gracia sería un juicio y no se
  toma aquí.
