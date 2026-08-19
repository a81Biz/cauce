# PT-061 — Cambios de especificación   `PHASE 4` · `FDGE-R22`

| Documento | Qué cambia | Por qué |
|:---|:---|:---|
| `LEXICON.md` §6.2 | `REGISTRY.json` gana `personas` en su contrato | `LEX-R21` |
| `LEXICON.md` §6.5f | **Nuevo**: la identidad de una persona, y su relación con `firmantes:` | `LEX-R21` · antes que el código |
| `CORE.md` | Regenerado por `build-core` | Deriva de `LEXICON` |

**Ninguna regla nueva, y ninguna modificada.** Entra **vocabulario** y un campo del registro.

**`SUITE-R27` no cambia** y conviene decirlo: sigue siendo la que declara que `firmantes:` es la
única defensa mecánica contra una firma inventada, y sigue siendo cierto que **no prueba** que
firmara una persona. Esta tabla no mejora eso ni lo pretende: responde a **quién atribuir** un
commit, que es otra pregunta.

**`SUITE-R08` no cambia.** El registro sigue asignando. Lo que gana es saber **de quién** es cada
cosa que asigna — y usarlo para repartir identificadores es `PT-062`, no esto.

`verify-suite` gana una comprobación —todo firmante existe como persona— pero **no una regla**: la
obligación que la respalda es `SUITE-R27`, que ya exige que la firma sea contrastable.
