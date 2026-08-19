# PT-061 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Los rangos de ID por persona | PT-062 |
| El usuario en la rama de tarea | PT-063 |
| Usar la identidad para el coste, el precedente y el techo | PT-064 |
| La sesión por persona | PT-065 |
| Permisos: quién **puede** hacer qué | — |
| Agrupar autores automáticamente por parecido | — |
| Reescribir la historia para unificar autores | — |
| Sustituir `firmantes:` de `CLAUDE.md` | — |

**Las cuatro primeras son el resto del lote**, y todas dependen de ésta: por eso va primera.

**La quinta lleva `—`:** esto dice **quién es**, no **qué puede**. `SUITE-R27` ya declara que la
lista de firmantes no prueba que firmara una persona; esta tabla tampoco lo prueba y no debe
fingirlo. Un sistema de permisos es otra cosa, con otras consecuencias.

**La sexta es el criterio central de la tarea, no un descuido.** Un comando que mirase los autores
y los agrupase por apellido o por dominio de correo convertiría **una duda en un dato** — y las
cuatro tareas siguientes construirían sobre él sin que sus casos lo notaran, porque cada una
comprobaría correctamente sobre una identidad falsa. La herramienta **encuentra** los no
declarados y **propone dónde mirar**; quién es quién lo dice una persona.

**La séptima:** unificar tres autores en 228 commits es `git filter-branch` — reescritura de
historia, que `SUITE-R06f` reserva a una decisión humana explícita. Y no hace falta: la
reconciliación es una **tabla**, no una cirugía.

**Y la octava:** `firmantes:` responde **quién puede firmar**, que es gobierno y vive en
`CLAUDE.md` por decisión de `SUITE-R00`. `personas` responde **quién es quién**, que es un dato que
leen las herramientas. Fundirlas sería convertir una decisión humana en un dato derivado.
