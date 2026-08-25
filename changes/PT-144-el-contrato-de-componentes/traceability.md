# PT-144 · `traceability.md` — `FDGE-R15`

> `AC` y `TS` se rellenan en `PHASE 4`. **`Test` y `Evidencia` desde `PHASE 6`** — hasta entonces
> van vacíos a propósito: rellenarlos antes sería afirmar una prueba que no se ha ejecutado.

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | `patrones.mjs` exporta los seis componentes y las diez familias, con todos sus campos | TS-01 | — | — | n/a | `PENDIENTE` |
| AC-02 | Los valores coinciden con los catorce sitios actuales, campo a campo | TS-02 · TS-03 · TS-04 · TS-05 · TS-06 · TS-07 | — | — | n/a | `PENDIENTE` |
| AC-03 | `verify-patrones` comprueba el contrato con aserciones propias y **falla** al romperlo | TS-08 | — | — | n/a | `PENDIENTE` |
| AC-04 | Ninguna herramienta cambia de comportamiento | TS-09 | — | — | n/a | `PENDIENTE` |
| AC-05 | Cada valor declara de dónde sale, y `LEXICON` sigue siendo su fuente | TS-10 | — | — | n/a | `PENDIENTE` |

**`Caso QA` es `n/a` en las cinco filas y no es un descuido.** `QA-R01` dice que `FQAGE` opera
**solo desde el navegador** y este cambio no tiene interfaz: `CASOS-DE-USO.md` ya declara que
`QA` no aplica a este paquete, y lo declara en vez de forzarlo. Un caso de QA sin navegador no es
un QA relajado — es otra cosa con el mismo nombre.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | `patrones.mjs` sigue exportando todo lo que exportaba | cubierto por `npm run verify`, que ejecuta los 8 importadores | `CUBIERTO` |
| RC-02 | `verify-patrones` sigue comprobando `PATRONES` y `selloDe` | sus casos actuales, y el recuento no baja | `CUBIERTO` |
| RC-03 | El contrato coincide con los catorce sitios | **por escribir** — `PT-144.4` | `PENDIENTE` |
| RC-04 | Romper un campo hace fallar el verificador | **por escribir** — `PT-144.1`, en rojo primero | `PENDIENTE` |
