# PT-146 · `strategy.md` — `PHASE 3` Strategy

## 1. Objetivo

Que `build-core.mjs` deje de escribir la lista de familias y de componentes, **y que `CORE.md` y
`CORE-PTSA.md` salgan byte a byte idénticos**.

## 2. Es la primera tarea que **amplía** el contrato

`PT-150` y `PT-145` lo consumieron sin tocarlo. Ésta le añade un campo:

```
FAMILIAS[].etiqueta    'Transversales' · 'Nombres' · 'Compuertas y modos' · …
```

Sale del mapa `label` de `build-core:184`, que la enumeración de `EP-022` no cazó porque **se hizo
con `grep` sobre patrones de prefijo** y `label` es un objeto: sus claves no casan ninguna
alternancia.

**Eso confirma el límite que `PT-144` declaró en su `HISTORY`** —«el barrido no cubre otras formas
de nombrar un componente»— y lo hace de la forma más útil: encontrando una.

## 3. Las tres familias que no salen de `RULES.md` se derivan, no se escriben

`build-core` trata cuatro casos por separado:

```js
.concat(proseRules(rules,   [las 7]))      -> familiasEnProsa()
.concat(proseRules(lexicon, ['LEX']))      -> documento === 'LEXICON.md'
.concat(proseRules(exec,    ['EXEC']))     -> documento === 'EXECUTION-MODES.md'
.concat(ptsaCited(rules))                  -> documento === la especificacion de PTSA
```

Los cuatro son **el mismo filtro sobre el mismo campo**. `PT-144` ya puso `documento` en
`FAMILIAS` precisamente porque era lo que explicaba la discrepancia 7-vs-10; aquí se cobra.

**Pero cada uno lee un archivo distinto**, así que no se colapsan en un bucle: se mantienen las
cuatro llamadas y lo que cambia es **de dónde sale el prefijo de cada una**. Colapsarlas sería
reescribir el mecanismo, y `RC-01` no lo permite.

## 4. El orden de los pasos

`MARGINAL` otra vez, y aquí la atomicidad tiene una lectura concreta: **cada paso se valida con
`build-core --check`**, que es la barra entera.

```
1  el campo «etiqueta» en FAMILIAS + su asercion         nadie lo consume todavia
2  :184  label deriva del contrato                        CORE identico
3  :171 y :183  familias y orden                          CORE identico
4  :433-437  los triggers                                 CORE identico
```

Si un paso rompe la identidad byte a byte, se sabe **con un sitio tocado**.

## 5. Alternativas evaluadas

| Alternativa | Por qué se rechaza |
|:---|:---|
| **Colapsar las cuatro llamadas en un bucle sobre `FAMILIAS`** | Cada una lee un archivo distinto. Sería reescribir el mecanismo, no derivar su dato — y `RC-01` mide identidad, no elegancia. |
| Dejar `label` fuera del contrato | Es el sitio dieciséis. Dejarlo sería cerrar el lote con un literal conocido en pie. |
| Poner `etiqueta` en `COMPONENTES` en vez de `FAMILIAS` | `label` tiene diez entradas, no seis: incluye `SUITE`, `LEX`, `EXEC` e `INTAKE`, que son familia y **no** componente. Va donde está el hecho. |
| Generar `CORE.md` y comparar «a ojo» | `build-core --check` existe y mide bytes. |

## 6. Riesgos

| Riesgo | Mitigación |
|:---|:---|
| **`CORE.md` sale distinto y nadie lo nota** | `RC-01`: `build-core --check` en cada paso, no solo al final |
| El orden de emisión cambia | `ordenDePrefijos()` ya tiene aserción contra huecos y repetidos (`PT-144`) |
| Se colapsa el mecanismo de las cuatro llamadas | declarado `OUT`; §3 lo explica |
| `etiqueta` se escribe mal y `CORE.md` cambia de cabeceras | es precisamente lo que `--check` caza: una cabecera distinta es un byte distinto |

## 7. Autorrevisión

```
Contradicciones con el intake:  ninguna. El intake decia TRES sitios; son CUATRO, y esta
                                declarado en la parada de #286 con desenlace «continua».
Dependencias faltantes:         ninguna. PT-144 y PT-145 estan INTEGRATED.
RULE-nn violadas:               ninguna.
AC no cubiertos:                ninguno. El AC-01 del intake —«ningun literal»— cubre los
                                cuatro sitios sin cambiar su enunciado.
Alcance que crecio:             un sitio y un campo. Los dos salen del mismo archivo y del
                                mismo hecho; no estiran la tarea, la completan.
```
