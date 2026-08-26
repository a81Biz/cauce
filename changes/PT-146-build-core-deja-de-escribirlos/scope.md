# PT-146 · `scope.md` — `PHASE 2` Analysis (`2-R`)

## 1. Qué cambia internamente

**Cuatro sitios, no los tres del intake.** `PHASE 2` encontró el cuarto al leer el archivo:

```
build-core.mjs  171        proseRules(rules, [SUITE FND FDGE INTAKE QA FPGE FIDE])   7 entradas
                183        const order = [… los diez …]                             10 entradas
                184-188    const label = { … los diez, con su nombre humano … }      10 entradas
                433-437    la lista literal de triggers de los seis componentes
```

El mapa `label` no lo cazó la enumeración de `EP-022` porque **se hizo con `grep` sobre patrones
de prefijo**, y `label` es un objeto: sus claves no casan ninguna alternancia. Es una de las
«otras formas de nombrar un componente» que `PT-144` declaró explícitamente que su barrido **no**
cubría.

## 2. `label` trae un dato que el contrato no tiene

```js
SUITE: 'Transversales',  LEX: 'Nombres',  EXEC: 'Compuertas y modos',  FND: 'Foundation',
PTSA: 'Auditoría — definidas en la especificación oficial',
FDGE: 'Desarrollo',  INTAKE: 'Admisión',  QA: 'Verificación de UX',
FPGE: 'Priorización',  FIDE: 'Incubación',
```

Es **cómo se llama cada familia en la cabecera de su sección de `CORE.md`** — un dato de
presentación que no está en `FAMILIAS`. Así que esta tarea **añade un campo** al contrato de
`PT-144`, no solo lo consume. Es la primera que lo hace, y conviene decirlo: el contrato se diseñó
sobre los sitios conocidos, y uno desconocido trajo un campo nuevo.

## 3. La barra es más alta que en `PT-145`

`build-core` **genera `CORE.md` y `CORE-PTSA.md`**, que es lo único que el agente carga
(`SUITE-R15`). Aquí «comportamiento idéntico» no significa «sin errores»: significa
**byte a byte**, y la herramienta para medirlo ya existe.

```
node docs/methodology/tools/build-core.mjs --check docs/methodology
```

El propio archivo documenta el precio de que esto se descuadre (`:194`): hubo un momento en que
`[START PTSA]` **auditaba con el 29 % de su propio ruleset**, porque las reglas no llegaban a
runtime. Un `CORE.md` degradado no falla — deja al agente operando con menos reglas de las que
cree tener.

## 4. La discrepancia 7-vs-10 ya está explicada, y hay que respetarla

`:171` recoge las familias cuyas reglas viven en **la prosa de `RULES.md`**. Las otras tres se
tratan aparte, en las dos líneas siguientes y en `ptsaCited()`:

```js
.concat(proseRules(rules, [las 7]))       <- familiasEnProsa()
.concat(proseRules(lexicon, ['LEX']))     <- LEX vive en LEXICON.md
.concat(proseRules(exec, ['EXEC']))       <- EXEC vive en EXECUTION-MODES.md
.concat(ptsaCited(rules))                 <- PTSA vive en su especificacion
```

**El campo `documento` del contrato es exactamente eso.** `familiasEnProsa()` devuelve las siete;
las otras tres se pueden derivar filtrando por su documento, en vez de escribirlas.

## 5. Qué NO debe cambiar

```
No cambia — CORE.md ni CORE-PTSA.md:  byte a byte. Es la barra, y build-core --check la mide.
No cambia — que reglas entran:        cambia de donde sale la lista, no que se hace con ella.
No cambia — el overlay de PTSA:       SUITE-R25. El contrato DECLARA en_core; no reescribe
                                      como se construye el overlay.
No cambia — patrones.mjs, salvo el campo «etiqueta» que label aporta.
```

## 6. Barra de calidad

| Métrica | Actual | Objetivo | Cómo |
|:---|:---|:---|:---|
| Literales de componente en `build-core.mjs` | **4** | **0** | `grep` |
| `CORE.md` y `CORE-PTSA.md` | — | **idénticos** | `build-core --check` en verde |
| Campo `etiqueta` en `FAMILIAS` | no existe | **10 entradas** | `verify-patrones` |
| `selftest` | 1715 | **no baja** | la batería |

## 7. Riesgo de regresión

```
RC-01  CORE.md y CORE-PTSA.md IDENTICOS.  Es la barra entera de la tarea.
       Test: build-core --check, que ya existe.

RC-02  El ORDEN de emision se conserva. `order` gobierna en que secuencia salen las
       familias, y PT-144 ya puso una asercion contra huecos y repetidos.
       Test: ordenDePrefijos() sin cambios + el CORE identico.

RC-03  Las siete de :171 siguen siendo siete, y siguen SIN incluir LEX, EXEC ni PTSA.
       Test: la asercion de familiasEnProsa() que PT-144 dejo.

RC-04  Los triggers siguen siendo los mismos.
       Test: NUEVO — el bloque de :433-437 comparado con triggers() del contrato.
```

## 8. Out of scope

```
OUT: audit.mjs. Es PT-147.
OUT: cambiar el contenido de CORE.md. RC-01 es la barra: si el generado difiere en un
     byte, la tarea fallo. Cambiar QUE carga el agente es otra decision, y no es esta.
OUT: reescribir el mecanismo de overlay de PTSA (SUITE-R25). El contrato declara
     «en_core»; no toca como se construye.
OUT: anadir a FAMILIAS ningun campo que no salga de un sitio medido. «etiqueta» entra
     porque label existe; nada mas.
```

## 9. Complejidad

```
Complejidad: STANDARD
```

Cuatro sitios en un archivo, un campo nuevo en el contrato, y la barra más exigente del lote
—identidad byte a byte de un artefacto generado—. `FDGE-R54` dio `MARGINAL` por la misma razón que
en `PT-145`: no hay `REFACTOR` cerrado con el que comparar. Trabajo atómico con checkpoint.
