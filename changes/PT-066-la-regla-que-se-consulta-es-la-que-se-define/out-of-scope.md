# PT-066 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Uniformar el formato de los tres documentos propietarios | — |
| El denominador de `audit` | `PT-067` |
| Que las menciones cuenten como cobertura | `PT-078` |
| `fallosPosibles` y `--donde` | — |
| Escribir los verificadores que faltan | `TD-08` |

**La primera lleva `—` y es una decisión, no un aplazamiento.** `EXECUTION-MODES.md` escribe sus
reglas en prosa **a propósito**: son compuertas y modos, no filas de una tabla de componente.
Cambiar el documento para que la herramienta lo parsee más fácil es arreglar lo que está bien
para no arreglar lo que está mal.

**La segunda y la tercera** son el mismo defecto de fondo —confundir mencionar con cumplir— visto
desde `audit` en vez de desde `regla`. Van juntas y después de esta: `PT-067` corrige el
denominador y `PT-078` el numerador.

**La cuarta lleva `—`:** `PT-051` las arregló y tienen casos. Esta tarea toca `definicionDe`, que
es otra función del mismo archivo.
