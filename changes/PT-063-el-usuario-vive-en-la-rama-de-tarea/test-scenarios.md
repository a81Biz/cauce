# PT-063 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `ramaDeTarea` con usuario | `chore/alberto-martinez/PT-063-slug` |
| E2 | AC-01 | …con el tipo en mayúsculas | en minúsculas |
| E3 | AC-01 | …y el usuario normalizado igual que `cauce/<usuario>` | sin acentos, con guiones |
| E4 | AC-05 | …con el nombre canónico, no el de `git config` | `alberto-martinez`, no `a81biz` |
| E5 | AC-04 | **Sin** usuario | dos niveles, como hoy |
| E6 | AC-04 | `ramaLlevaUsuario` con una rama de dos niveles | `false` |
| E7 | AC-04 | …y con una de tres | `true` |
| E8 | AC-02 | No existe `trabajo/<usuario>` en el marco | ninguna aparición |
| E9 | AC-02 | …y `LEXICON` sigue declarando `trabajo` como **una** | el texto |
| E10 | AC-03 | `verify-fdge --gate G4` sigue exigiendo **un** PR del lote | el texto |
| E11 | AC-03 | …y `EXEC-R03` sigue diciendo una `G4` por lote | el texto |
| E12 | AC-01 | `tracker rama PT-NNN` propone el nombre | el nombre |
| E13 | AC-04 | …y **no** crea la rama | no cambia de rama |
| E14 | AC-04 | `verify-fdge` **avisa**, no falla, con una rama de dos niveles | aviso |
| E15 | AC-05 | …y solo si hay `personas` declaradas | sin ellas, nada |
| E16 | AC-06 | `FDGE-R19` dice el formato nuevo | el texto |
| E17 | AC-06 | …y sigue diciendo todo lo demás que decía | los tres niveles, `G4`, los commits |

**`E5` y `E14` juntos son `AC-04`.** Sin usuario resuelto la rama sigue teniendo dos niveles, y una
rama de dos niveles **avisa pero no falla**. Las 22 declaradas hoy tienen que seguir valiendo: una
rama abierta **se termina como empezó**.

**`E8`–`E11` son criterios sobre lo que NO debe pasar.** Son los que más fácil se dan por buenos
sin mirar, y por eso se comprueban: `trabajo` sigue siendo una y `G4` sigue siendo una por lote.

**`E17` es el que protege lo que no cambia.** `FDGE-R19` dice muchas cosas —commits atómicos, sus
prefijos, los tres niveles, que el PR de tarea es revisión, que `G4` no se multiplica— y esta tarea
cambia **una**. Un caso que solo mirase el formato nuevo pasaría aunque el resto se hubiera
perdido.

## Lo que ningún caso puede comprobar

**Que dos personas trabajen sin pisarse en las ramas.** El formato lo hace posible; que ocurra
necesita dos personas.

**Que alguien use `tracker rama`.** Propone; crear la rama sigue siendo un comando que se escribe a
mano, por decisión de `PT-054` y `EXEC-R07`.

**Que el aviso se lea.** Si cada verificación lo repite, se ignora. Por eso es por PT **vivo** y no
por rama del remoto — pero que alguien haga caso no se comprueba desde aquí.
