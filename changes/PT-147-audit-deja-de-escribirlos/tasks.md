# PT-147 · `tasks.md` — `PHASE 4` Proposal

## Archivos

```
docs/methodology/tools/audit.mjs
docs/methodology/tools/selftest.sh
```

**Ningún archivo compartido con otra tarea viva.** `PT-148` y `PT-149` tocan documentos y el
`selftest`; el solapamiento con `PT-149` en `selftest.sh` se serializa (`EP-022` §6).

## `PT-147.1` — la línea base, medida

| | |
|:---|:---|
| **Objetivo** | Las cifras de `audit` **por componente**, antes de tocar nada |
| **Validación** | `npm run audit` capturado · `fase: 40` es el total de hoy |
| **Cubre** | `RC-01` |

Sin esto, «las cifras no cambian» no es comprobable: el total sí va a cambiar —entran dos
componentes— y lo que tiene que quedar igual es **cada uno de los cuatro**.

## `PT-147.2` — un mapa, desde el contrato

| | |
|:---|:---|
| **Objetivo** | `PROMPTS` y `esperadas` colapsan; el bucle recorre `COMPONENTES` |
| **Validación** | los cuatro ya auditados dan **las mismas cifras** · `FIDE` y `FPGE` **aparecen** |
| **Archivos** | `tools/audit.mjs` |
| **Cubre** | `AC-01`, `AC-02`, `RC-01`, `RC-03` |

## `PT-147.3` — `SIN_EVALUAR` se muestra

| | |
|:---|:---|
| **Objetivo** | `FPGE` sale como no evaluable, **no omitido** |
| **Validación** | el informe lo **nombra** y dice que `LEXICON` no declara su rango |
| **Archivos** | `tools/audit.mjs` |
| **Cubre** | `AC-03`, `RC-03` |

## `PT-147.4` — el ternario desaparece

| | |
|:---|:---|
| **Validación** | `grep 'Foundation' ?` : cero · `siglaDe('Foundation')` da `FND` en el informe |
| **Archivos** | `tools/audit.mjs` |
| **Cubre** | `AC-01` |

## `PT-147.5` — la comprobación que impide que vuelva

| | |
|:---|:---|
| **Objetivo** | Un componente con rango en `LEXICON` al que `audit` no mire **falla** |
| **Validación** | caso con un componente ficticio con rango, ausente del recorrido |
| **Archivos** | `tools/selftest.sh` |
| **Cubre** | `AC-04`, `RC-04` |

**Es el paso que separa la tarea de un parche.** Los cuatro anteriores arreglan `FIDE` y `FPGE`;
éste arregla la clase.
