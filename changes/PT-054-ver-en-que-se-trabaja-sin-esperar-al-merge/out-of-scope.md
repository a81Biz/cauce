# PT-054 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Los rangos de ID y la convivencia de dos personas | EP-016 |
| El usuario en la rama de tarea (`feature/<usuario>/PT-NNN-slug`) | EP-016 |
| Qué rama resuelve `G4` con varias personas | EP-016 |
| Mover los artefactos fuera de la rama de tarea | — |
| Decidir qué hacer con un commit humano en la proyección | — |
| Empujar la proyección en cada transición | — |
| La entrada de `CHANGELOG` del lote y el número de versión | EP-014 |

**La cuarta lleva `—` porque no se va a hacer**: es la opción que la decisión 1 del firmante
descartó, y dejarla como aplazada insinuaría que sigue viva.

**La quinta también, y es deliberada.** Un commit humano en la proyección se **reporta**; qué
hacer con él —rehacerla, conservarlo, preguntar— es una decisión humana (`SUITE-R06`). Borrarlo
automáticamente sería reescribir el trabajo de alguien sin preguntar.

**Y la sexta es la decisión que más discutí conmigo mismo.** Empujar en cada transición daría la
visibilidad sin ningún acto manual, que es lo que este lote persigue — pero convertiría un acto de
**publicación** en un efecto colateral. La frontera que se respeta: el lote quita los actos de
**registrar**, no los de **publicar**.
