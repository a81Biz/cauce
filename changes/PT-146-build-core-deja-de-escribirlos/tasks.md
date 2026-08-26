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

## `PT-146.4` — los triggers: **no se derivan, y se dice por qué**

> **Este paso cambió al ejecutarlo, y el cambio se declara.** Se planificó como «derivar la mitad
> derivable». Al medirlo resultó **imposible sin salirse del alcance**, y además destapó un
> hallazgo mayor que la duplicación que venía a arreglar.

| | |
|:---|:---|
| **Objetivo** | Declarar por qué el bloque se queda literal, y **contar** lo que se encontró |
| **Validación** | `build-core --check` en verde: el bloque **no se toca** |
| **Archivos** | ninguno |
| **Cubre** | lo declarado en `HISTORY` |

**Por qué no se deriva.** Byte a byte exigiría meter en el contrato la maquetación del bloque —el
agrupamiento por línea, los marcadores `<tipo>: <título>`, los separadores `·` y las operaciones
de `LEX-R16`—: un campo con **un solo consumidor** en el módulo cuya razón de ser es que un hecho
tenga un dueño. `scope.md` §8 lo declara `OUT`.

**Y lo que se encontró al intentarlo:**

```
el bloque de CORE.md publica     8 triggers
LEXICON §7 declara               13
faltan                           [CIERRA] · [IMPLEMENTACIÓN] · [START RECONCILE]
                                 [INSTALL SUITE] · [START MIGRATE]
```

`SUITE-R15` dice que `CORE.md` es **lo único que se carga**, y `LEX-R18` que sin trigger no hay
componente. **Cinco triggers que `LEXICON` declara no aparecen en el núcleo que el agente lee.**

Añadirlos cambiaría `CORE.md`, que es lo que `AC-02` prohíbe. Queda en la parada de
[#281](https://github.com/a81Biz/cauce/issues/281) como **candidato a tarea propia**.
