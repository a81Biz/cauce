# `PT-135` — Cambios de especificación   `PHASE 4`

> `SUITE-R06e`: modificar `docs/methodology/` **no se automatiza**.

---

## Ningún documento normativo cambia

Y conviene decir por qué. **No falta ninguna regla**: `FDGE-R17` ya exige que un caso pueda
fallar, y `RULE-06` ya prohíbe confundir «no llegó a correr» con «pasó». Lo que faltaba era que el
arnés lo **comprobara** sobre sí mismo.

Es un caso de `P-003` de la Declaración de Valor y no de `P-001`.

## Lo que sí cambia, y no es normativo

| Dónde | Qué |
|:---|:---|
| `tools/selftest.sh` · `lint_helpers` | deriva su lista, reconoce las dos formas de uso, ancla la posición del comando y descarta heredocs |
| `tools/selftest.sh` | `git_fixture` y `con_phase` viven junto a `build_fixture` |
| `tools/selftest.sh` | el caso del lint exige `ningun helper`, que es **una** respuesta |
| `CLAUDE.md` | declara **18** herramientas, no 16 |

## `CLAUDE.md` no es normativo, y aun así importa

`SUITE-R00` dice que ese archivo **parametriza y no legisla**. La cifra «16 herramientas» era una
cifra escrita a mano que nadie recalculaba, y `FND-R14` la cazó en la corrida completa. Es
`CE-010`, y por eso está en las tareas y no escondida.

## Autoridad

`FDGE-R17` · un caso que no puede fallar no prueba nada.
`RULE-06` · no llegar a correr no es pasar.
`FND-R14` · una cifra escrita a mano caduca.
