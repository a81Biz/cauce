# PT-026 — Estrategia   `PHASE 3`

| Camino | Por qué |
|:---|:---|
| Quitar el paso de la CI | Pierde la comprobación donde sí decide | 
| Condicionarlo en el YAML | El YAML no viaja al proyecto destino; las herramientas sí (`RULE-01`) |
| **Que la herramienta sepa dónde está** | Viaja con el paquete y la regla queda en un solo sitio |

`espejo` compara igual y **enumera igual**; lo que cambia es si bloquea. En la rama por defecto
marca cada divergencia como `INFORMATIVO` y añade dónde sí se decide.

**La comparación no depende de la rama.** `compararEspejo()` sigue siendo la misma función pura:
un detector que cambiara de criterio según la rama serían dos detectores divergiendo
(`SUITE-R38`). Lo único que la rama decide es la severidad.

**Ante la duda, bloquea.** Si no se puede saber la rama actual o la rama por defecto, la
respuesta es «no es la principal» y se bloquea: equivocarse hacia `INFORMATIVO` apaga la
compuerta, y equivocarse hacia bloquear solo pide un arreglo de más.
