# PT-144 · `scope.md` — `PHASE 2` Analysis (`2-R`)

> El artefacto de alcance de un `REFACTOR`/`CHORE`: qué cambia, qué **no**, la barra medible,
> los controles de regresión y el rollback (`PHASES` · `2-R`).

## 1. Qué cambia internamente

**Un archivo, un export nuevo.** `docs/methodology/tools/patrones.mjs` pasa a declarar el
contrato de los seis componentes de la suite, con los ocho campos que el intake enumera y que
salen de lo que hoy está escrito a mano en los catorce sitios:

```
nombre        FDGE · FQAGE · PTSA · Foundation · FPGE · FIDE
sigla         la de sus reglas — separada de «nombre» POR EL CASO Foundation → FND
prefijo       FDGE-Rnn · QA-Rnn · PTSA-Rnn · FND-Rnn · FPGE-Rnn · FIDE-Rnn
directorio    QA/ · PTSA/ · FIDE/ · null cuando no tiene directorio propio
obligatorio   false SOLO para FIDE hoy (FIDE-R01: el INSTALL no lo copia)
triggers      [START QA] · [START PTSA] · …
fases         el rango que declara LEXICON §3 — o «no lo sé», nunca inventado (RULE-06)
en_core       si sus reglas van a CORE.md o a un overlay propio (PTSA)
```

Y `verify-patrones.mjs` gana las aserciones que lo comprueban, siguiendo el precedente de
`selloDe` (ver `context.md` §4).

## 2. Qué NO debe cambiar

```
No cambia — comportamiento observable:  NINGUNA herramienta cambia lo que hace. Nadie
                                        consume el contrato todavia: eso es AC-04.
No cambia — interfaces publicas:        ningun export existente de patrones.mjs se toca,
                                        renombra ni reordena.
No cambia — archivos:                   SOLO tools/patrones.mjs y tools/verify-patrones.mjs.
                                        Las otras cuatro herramientas son PT-145..PT-147.
No cambia — CORE.md:                    build-core no se toca, asi que el nucleo generado
                                        tiene que salir identico.
No cambia — esquema de datos:           REGISTRY.json no interviene.
```

**Y el límite de alcance del lote, que aquí es donde más aprieta** (`EP-022` §3): el contrato
describe **componentes**. Si empieza a describir reglas o fases más allá del **rango** que
`LEXICON` §3 ya declara, se salió.

## 3. Barra de calidad — medible

| Métrica | Valor actual | Valor objetivo | Cómo se comprueba |
|:---|:---|:---|:---|
| Componentes declarados en `patrones.mjs` | **0** | **6**, con los 8 campos | lectura del export |
| Campos que discrepan de los 14 sitios de hoy | sin medir | **0** | comparación mecánica campo a campo contra los literales actuales |
| Aserciones del contrato en `verify-patrones` | **0** | **≥1 por campo con invariante** | el verificador falla al romper cualquiera |
| Diferencia en la salida de `npm run verify` | — | **ninguna** | ejecución antes/después |
| `CORE.md` / `CORE-PTSA.md` | — | **idénticos** | `build-core --check` en verde |

La cuarta fila es la que hace de esta tarea un no-cambio comprobable, y no una afirmación.

## 4. Riesgo de regresión

Un `REFACTOR` necesita sus `RC-nn` con test **antes** de empezar. Aquí el riesgo real no es que
algo se rompa —nadie consume el contrato— sino que **el contrato mienta** y nadie se entere hasta
que `PT-145` derive de él.

```
RC-01  patrones.mjs sigue exportando TODO lo que exportaba, con el mismo nombre y valor.
       Test: los 8 importadores que el grafo lista siguen arrancando y dando el mismo
       resultado. Cubierto por «npm run verify» completo, que los ejecuta todos.

RC-02  verify-patrones sigue comprobando PATRONES y selloDe como hoy.
       Test: sus casos actuales siguen pasando, y el recuento total no baja.

RC-03  El contrato COINCIDE con los catorce sitios, campo a campo.
       Test: NUEVO — hay que escribirlo. Es el unico RC sin red hoy, y es el que
       importa: un contrato que diverge del literal que va a sustituir convierte
       PT-145..PT-147 en un cambio de comportamiento disfrazado de refactor.

RC-04  Romper un campo del contrato HACE FALLAR verify-patrones.
       Test: NUEVO — RULE-02. Sin el, RC-03 se cumple hoy y se pierde manana.
```

**`RC-03` y `RC-04` se escriben en rojo antes de implementar** (`FDGE-R17`). No hay excusa de
cobertura: son deterministas y no dependen de nada externo.

## 5. Cobertura de tests: estado actual

```
Cobertura del area afectada:   selftest.sh ejecuta verify-patrones en cada corrida
                               (1695 casos en la bateria completa, medido hoy)
Cobertura requerida:           RC-01 y RC-02 YA estan cubiertos por esa bateria.
                               RC-03 y RC-04 NO existen y son el trabajo de PHASE 5.

Se puede empezar hoy:          SI. La red de RC-01/RC-02 esta viva y en verde
                               (npm run verify EXIT=0, selftest OK 1695 casos).
```

## 6. Rollback

Trivial y sin estado: el cambio es **aditivo** sobre dos archivos y no toca datos, esquema ni
artefactos generados. Revertir el commit deja el árbol exactamente como estaba, y `AC-04`
garantiza que nada haya empezado a depender de él dentro de esta tarea.

## 7. Out of scope

```
OUT: tocar verify-suite.mjs, comparar-marco.mjs, build-core.mjs o audit.mjs.
     Son PT-145, PT-146 y PT-147, y cada una tiene su propia G1 heredada.
OUT: declarar DICTAMEN ni ningun componente que no exista hoy. El contrato describe
     LO QUE HAY; una entrada para un componente futuro afirmaria que existe.
OUT: la escala de severidad. Es PT-150, serializada detras de esta tarea.
OUT: anadir eventos.mjs y matriz.mjs al alcance del grafo. Se declaro en context.md §6;
     corregirlo es otra decision.
OUT: cualquier campo del contrato que no salga de los catorce sitios medidos. Un campo
     «por si acaso» es alcance que crece solo.
```

## 8. Criterios de aceptación — versión canónica

Los del `intake.md` §2, con `AC-03` precisado por `context.md` §4. **Esta es la lista con la que
trabajan `traceability.md` y `manifest.json`** (`FDGE-R15`, `FDGE-R23`):

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `patrones.mjs` exporta los seis componentes con los ocho campos | lectura del export |
| AC-02 | Los valores **coinciden con los catorce sitios actuales**, campo a campo | `RC-03` |
| AC-03 | `verify-patrones` comprueba el contrato con aserciones propias, al modo de `selloDe`, y **falla** al romperlo | `RC-04` |
| AC-04 | Ninguna herramienta cambia de comportamiento | `npm run verify` con el mismo resultado · `build-core --check` en verde |
| AC-05 | La declaración dice de dónde sale cada valor, y `LEXICON` sigue siendo su fuente | comentario de contrato, como el resto del módulo |
