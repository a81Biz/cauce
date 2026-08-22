# Context — `PT-100`

## 1. Lo medido

```
TD-04     verify-qa.mjs:36  join(ROOT, 'QA')      <- dos grafias
          verify-qa.mjs:37  join(ROOT, 'qa', …)      en LINEAS CONSECUTIVAS
          y si no encuentra: process.exit(2) «nada que verificar» — EN VERDE

INC-012   verify-qa.mjs:66  tipo(HP|REG|EDGE|NEG)
          QA-Prompts.md:583 tipo(HP|EC|EF|REG)
          PHASES.md:595     tipo(HP|EC|EF|REG)
          CORE.md:1003      tipo(HP|EC|EF|REG)      <- 3 documentos contra 1 herramienta
          LEXICON           no los declara           <- el hueco real

INC-008   tracker.mjs:2670  docs/implementation/TRANSICIONES.log
          RULES.md:172      «bitacora.md del PT»
          PHASES.md:395     «changes/PT-NNN-slug/bitacora.md»

L-0       registro          type: EP x16 · ausente x2 · EPIC x1
          verify-fdge       SEIS «type === 'EP'»
          LEXICON §8.1      enumera el type de una TAREA, ninguno para un lote
```

## 2. Quién manda en cada caso

| Hecho | Autoridad | Quién estaba mal |
|:---|:---|:---|
| grafía de `QA/` | ninguna la declara | **las dos líneas del mismo archivo** |
| tipo de caso `QA` | `LEXICON` (`LEX-R21`) — y no lo declaraba | la herramienta, contra tres documentos |
| destino de la nota | `RULES.md` (`LEX-R22`) | **la regla**, no la herramienta |
| `type` de un lote | `LEXICON` — y no lo declaraba | la pregunta, no la respuesta |

**Dos de los cuatro no tenían autoridad**, y ahí está la causa: `LEX-R21` dice que los nombres van
a `LEXICON`, y ninguno de esos dos estaba.

## 3. El caso de `INC-008` merece decirse aparte

`tracker.mjs:2509` dice *«la nota vive **ahora** en `TRANSICIONES.log`»*: fue un cambio
**deliberado**, con su motivo —append-only, `SUITE-R09`— y la regla no lo siguió.

**No es que la herramienta se desviara: es que la regla se quedó atrás.** Y por eso el arreglo va
en la regla, no en la herramienta: un ledger por repositorio es mejor que uno por tarea, y
`SUITE-R09` lo respalda.

## 4. Confianzas — `FDGE-R09`

```
RootCause     98%   las cinco discrepancias estan citadas por archivo y linea, y tres de
                    ellas las midio otro proyecto de forma independiente.
Architecture  92%   tres archivos, LEXICON y la regeneracion de CORE. -8 porque tocar RULES
                    cambia el texto de una regla HARD, que no es lo mismo que tocar codigo.
Solution      90%   -10 porque «que gana» no siempre es derivable: en INC-008 hay que
                    ELEGIR, y elegir es lo que §3 documenta.
```

## 5. Lo que este contexto NO establece

- **Cuántos hechos más tienen nombre doble.** Se conocen cinco. Un `grep` no puede encontrar lo
  que no sabe buscar, y eso queda declarado.
- **Que `QA/` en mayúsculas sea la grafía correcta.** El arreglo **no elige**: busca las dos y
  dice cuál encontró. Elegir obligaría a renombrar el árbol de proyectos ajenos, que es `OUT`.
