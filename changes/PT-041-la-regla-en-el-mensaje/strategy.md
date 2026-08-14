# PT-041 — Estrategia   `PHASE 3`

Una sola herramienta cubre las dos tareas, porque **son la misma pieza vista por dos lados**:
qué puede fallar y cómo se llega a la regla salen del mismo sitio.

```
regla SUITE-R44        qué exige, en qué documento vive, qué herramientas la comprueban
regla --fallos         TODO lo que puede fallar, derivado del código
regla --sin-comprobar  las reglas que nadie emite con su nombre
```

**No inventa.** Si una regla no está en ningún documento, lo dice — y eso es un defecto del
marco, no una laguna de quien pregunta. Si nadie la comprueba, lo dice: no significa que no se
cumpla, significa que si falla no lo dirá con su ID (`RULE-06`).

El documento propietario se **deriva** del prefijo con el mismo mapa que usa `verify-suite`. Un
segundo mapa escrito a mano divergiría (`SUITE-R38`).
