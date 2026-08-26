# PT-146 · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | No queda ningún literal de componente en `build-core.mjs` | TS-02 · TS-03 | `verify-patrones` · `rc-etiquetas.mjs` | `evidence/PT-146/salidas/rc-etiquetas.out` | n/a | `CUMPLIDO` |
| AC-02 | `CORE.md` y `CORE-PTSA.md` **byte a byte idénticos** | TS-01 | `build-core --check` ×3 | `evidence/PT-146/salidas/check-*.out` | n/a | `CUMPLIDO` |

**Sólo dos `AC`, y el segundo es toda la tarea.** `build-core` genera lo único que el agente carga
(`SUITE-R15`), así que aquí «comportamiento preservado» no es «sin errores»: es **identidad byte a
byte**, y `build-core --check` existe para medirla.

**`AC-01` cubre cuatro sitios, no los tres del intake.** El cuarto —el mapa `label` de `:184`— lo
encontró `PHASE 2`, y no lo cazó la enumeración de `EP-022` porque **el barrido se hizo con `grep`
sobre patrones de prefijo** y `label` es un objeto: sus claves no casan ninguna alternancia.
Declarado en la parada de [#286](https://github.com/a81Biz/cauce/issues/286).

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | `CORE.md` y `CORE-PTSA.md` idénticos | `build-core --check` **en cada paso** | `CUMPLIDO` |
| RC-02 | El orden de emisión no cambia | TS-04 | `CUMPLIDO` |
| RC-03 | `LEX`, `EXEC` y `PTSA` siguen tratándose aparte, cada una leyendo su archivo | TS-05 | `CUMPLIDO` |
| RC-04 | El bloque de triggers **no se toca** — ver abajo | TS-06 | `CUMPLIDO` |

## Lo que esta tarea **no** establece

**El bloque de triggers no se derivó en absoluto**, y el plan decía «la mitad derivable». El paso
cambió al ejecutarlo:

Derivarlo byte a byte exigiría meter en el contrato **la maquetación del bloque** —agrupamiento
por línea, marcadores `<tipo>: <título>`, separadores `·` y las operaciones de `LEX-R16`—: un
campo con **un solo consumidor**, en el módulo cuya razón de ser es que un hecho tenga un dueño.
Y derivar sólo la mitad habría dejado el bloque partido en dos mecanismos sin ganar nada.

**Y al medirlo apareció algo mayor que la duplicación que venía a arreglar:**

```
el bloque de CORE.md publica    8 triggers
LEXICON §7 declara              13
faltan   [CIERRA] · [IMPLEMENTACIÓN] · [START RECONCILE] · [INSTALL SUITE] · [START MIGRATE]
```

`SUITE-R15` dice que `CORE.md` es **lo único que se carga**; `LEX-R18`, que sin trigger no hay
componente. Añadirlos cambiaría `CORE.md` y `AC-02` lo prohíbe.

**Tiene tarea propia y está enlazada** desde la parada de
[#281](https://github.com/a81Biz/cauce/issues/281). No es una nota al pie.

Está razonado en la parada de [#281](https://github.com/a81Biz/cauce/issues/281), y `TS-06` lo
fija con un caso para que nadie lo «arregle» creyendo que falta.
