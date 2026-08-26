# `PT-149` · `out-of-scope.md` — `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| `audit` da por cubierta la fase de un componente si el **número** aparece en cualquier sitio del documento | Arreglarlo pondrá en rojo items hoy en verde: es trabajo con su propia medición, no un paso de la tarea que lo encontró | `PT-168` |
| Usar `DICTAMEN` como componente de prueba | Declararlo aquí afirmaría que existe. No aplaza trabajo: `EP-023` ya lo construye, y esto es una exclusión de alcance | — |
| Probar que el componente de prueba **funciona** | No tiene fases reales, ni prompts, ni especificación. Se prueba el alta y la baja, no el componente | — |
| Que `E5` esté completo **ahora** | Se corrigió **dos veces** en esta tarea, y la segunda salió de ejecutarlo otra vez. Lo que sí está es **comprobado**: los trece casos fallan si deja de serlo | — |

Las filas que citaban `PT-164`, `PT-166` y `PT-167` **se han quitado de aquí**: son hallazgos de
`PT-156` y están aplazados en su `out-of-scope`. Repetirlos aquí no los sostenía mejor — los
duplicaba, y un aplazado con dos dueños es un aplazado sin dueño.
