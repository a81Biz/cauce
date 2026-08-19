# PT-065 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `archivoSesion` con persona | `SESSION-alberto-martinez.json` |
| E2 | AC-05 | …sin persona | `SESSION.json` |
| E3 | AC-01 | …y normaliza igual que las ramas | sin acentos, con guiones |
| E4 | AC-02 | Dos personas ⇒ **dos archivos distintos** | nombres distintos |
| E5 | AC-06 | `sesionesAjenas` con dos marcas | la del otro |
| E6 | AC-06 | …y **no** la propia | no aparece |
| E7 | AC-06 | …y las que no declaran persona **no** cuentan como ajenas | fuera |
| E8 | AC-01 | La marca declara **de quién** es | `persona` |
| E9 | AC-03 | `sesion abrir` escribe el archivo de su persona | existe |
| E10 | AC-02 | …y **no** toca el de otra | intacto |
| E11 | AC-05 | Al leer, si no hay propio, cae a `SESSION.json` | funciona |
| E12 | AC-06 | `tracker sesion` enseña las ajenas | el texto |
| E13 | AC-04 | `sesion cerrar` sigue derivando el handoff | el handoff |
| E14 | AC-04 | …y sigue sin tocar `HANDOFF.md` | intacto |
| E15 | AC-05 | Con una sola persona, todo como hoy | igual |

**`E10` es `AC-02` y es el criterio del lote aplicado aquí**: nadie escribe el archivo de nadie, así
que **no hay conflicto que resolver**. `PHASE 2` lo reprodujo: hoy hay uno en cada merge.

**`E7` importa**: una marca sin persona —la de un proyecto de una persona— **no** es «la sesión de
otro». Contarla como ajena haría que alguien viera una sesión fantasma.

**`E2` y `E11` son la compatibilidad.** Sin `personas` declaradas, el archivo es `SESSION.json` y
todo funciona como hoy.

## Lo que ningún caso puede comprobar

**Que dos personas trabajen a la vez de verdad.** El conflicto está reproducido y esto lo evita por
construcción — pero es un argumento, no dos personas.

**Que las sesiones ajenas se miren.** Se enseñan; que alguien las lea no se comprueba.

**Que no se acumulen archivos.** Son **uno por persona**, no uno por día, así que no crecen. El de
alguien que deje el proyecto se queda — y eso es un archivo, no un problema.
