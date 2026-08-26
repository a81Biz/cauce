# PT-146 · `tasks.md` — `PHASE 4` Proposal

## Archivos

```
docs/methodology/tools/patrones.mjs         <- AÑADE el campo «etiqueta» a FAMILIAS
docs/methodology/tools/verify-patrones.mjs
docs/methodology/tools/build-core.mjs
docs/methodology/tools/selftest.sh
```

**Cuatro pasos, y cada uno se valida con `build-core --check`** — que es la barra entera de la
tarea, no un paso final. `FDGE-R54` dio `MARGINAL`.

## `PT-146.1` — el campo `etiqueta`

| | |
|:---|:---|
| **Objetivo** | Las diez familias ganan su nombre humano, el que `label` escribía a mano |
| **Validación** | `verify-patrones` comprueba que las diez lo declaran y que **coinciden con el `label` actual** |
| **Archivos** | `tools/patrones.mjs` · `tools/verify-patrones.mjs` |
| **Cubre** | `AC-01` |

Nadie lo consume todavía: si el dato está mal, se ve aquí y no en `CORE.md`.

## `PT-146.2` — `:184` deriva

| | |
|:---|:---|
| **Validación** | `build-core --check` en verde · las cabeceras de sección de `CORE.md` sin cambiar |
| **Archivos** | `tools/build-core.mjs` |
| **Cubre** | `AC-01`, `AC-02` |

Va antes que `:171` y `:183` porque **una etiqueta mal escrita cambia una cabecera**, y una
cabecera distinta es un byte distinto: es el paso donde `--check` tiene más que decir.

## `PT-146.3` — `:171` y `:183` derivan

| | |
|:---|:---|
| **Objetivo** | Las siete familias en prosa y el orden de emisión, desde el contrato |
| **Validación** | `build-core --check` en verde · `LEX`, `EXEC` y `PTSA` **siguen tratándose aparte**, cada una leyendo su archivo |
| **Archivos** | `tools/build-core.mjs` |
| **Cubre** | `AC-01`, `AC-02`, `RC-02`, `RC-03` |

## `PT-146.4` — los triggers, la mitad derivable

| | |
|:---|:---|
| **Objetivo** | Los `[START …]` salen de `COMPONENTES[].triggers`; las operaciones de `LEX-R16` **se quedan como texto** |
| **Validación** | `build-core --check` en verde · un caso que compare el bloque generado con `triggers()` |
| **Archivos** | `tools/build-core.mjs` · `tools/selftest.sh` |
| **Cubre** | `AC-01`, `RC-04` |

**Queda mitad derivado y mitad literal, y se declara.** Las operaciones —`resume PT-XXX`,
`status FDGE`, `delta QA PT-XXX`…— no están en el contrato, y meterlas exigiría un campo con **un
solo consumidor**. Está en la parada de `#281` con su razonamiento.
