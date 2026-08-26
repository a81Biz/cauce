# `PT-148` · autorrevisión — `PHASE 6` Evidence

## 1. Lo medido

| Qué | |
|:---|:---|
| `SUITE-R60` en `RULES.md` | `CHECK`, con su barrido — `regla.mjs SUITE-R60` la resuelve |
| `LEXICON` §3.6 y §3.7 | los nueve campos del componente, los cuatro de la familia, y la distinción |
| `CASOS-DE-USO` `E5` · `E6` | alta y baja, **citando** la regla sin enunciarla (`LEX-R22`) |
| Aciertos del barrido sobre el árbol real | **33 → 0** |
| Casos permanentes | **7**: uno caza, **cuatro fijan lo que NO debe cazar**, dos son el árbol real |
| `selftest` | 1720 → **1727** casos |
| `CORE.md` | tres reglas nuevas y **nada más** — el `diff` se leyó |

## 2. La regla nace `CHECK`, y hubo que ganárselo

`RULES.md`: *«marcar `CHECK` una regla que ningún script verifica es una promesa falsa»*.

Media comprobación ya existía —`verify-patrones`, con las aserciones de `PT-144`, `PT-150`,
`PT-145` y `PT-146`—. La otra media **no**: que ninguna herramienta nombre un componente era
cierto *hoy* porque `PT-145`..`PT-147` lo dejaron así, y **nada lo impedía mañana**.

## 3. El criterio del barrido se midió, no se supuso

**La primera versión cazaba 33 sitios. Nueve eran legítimos**, y cada exclusión sale de uno real:

```
17  verify-patrones.mjs   ES la prueba del contrato: siglaDe('Foundation') === 'FND' TIENE
                          que nombrarlo. El contrato y su prueba son una unidad.
 7  selftest.sh           el arnes: sus fixtures construyen estados rotos a proposito.
 4  join(ROOT, 'PTSA')    una RUTA. LEX-R03 dice que QA se usa «en triggers, RUTAS y
                          nombres de archivo».
 1  QA: maxOf('QA', ...)  un PREFIJO DE IDENTIFICADOR. «QA» es sigla y espacio de nombres
                          a la vez, POR DISENO: un literal asi es ambiguo por construccion.
 1  matriz.mjs prosa      un span de codigo markdown en el texto que la herramienta GENERA.
```

**Y el criterio que decide si sirve no es que cace: es que no cace comentarios.** Este lote
escribió decenas que citan componentes al explicar por qué existe algo. Un barrido que los cace se
desactiva en la primera corrida, y **un verificador desactivado es peor que ninguno**.

Por eso hay **cuatro casos negativos permanentes**: sin ellos, nada impide que alguien «mejore» el
barrido hasta hacerlo insufrible.

## 4. Dos errores míos, y los dos son de la clase que el lote persigue

### 4.1 · El escape se degradó **dentro del verificador de esa clase**

La exclusión de rutas quedó en disco como `/^Hjoin\(/` — ese `^H` es el byte `0x08`: `\b`
degradado. **El regex compilaba y no casaba nada**, así que los cuatro `join(ROOT, 'PTSA')`
seguían saltando.

`SUITE-R59` avisa exactamente de esto y el repositorio lo tiene medido **ocho veces**. Ésta es la
**novena**, y se cometió construyendo el barrido que persigue la duplicación.

**No se encontró leyendo**: en pantalla el `if` se veía correcto. Salió mirando los **bytes** con
`cat -A`.

Y no se arregló reescribiendo el escape, sino **quitando el regex**: `codigo.includes("join(")`.
El patrón más seguro es el que no se escribe.

**Con una lectura que conviene no perder**: las ocho anteriores las cazó `verify-patrones`, porque
los patrones de `PATRONES` viajan con sus ejemplos. **Ésta no la cazó nada** — era un regex suelto
dentro de un `if`, sin contrato.

### 4.2 · Escribí dos reglas con IDs ocupados, y `verify-suite` no lo cazó

`LEX-R33` y `LEX-R34` existían desde `PT-137` y `PT-138`. Les puse encima el vocabulario del
contrato, y al regenerar **las dos reglas viejas desaparecieron de `CORE.md`**:

```
-`LEX-R33` **H** retomada — el rastro de un aplazado que vuelve.
-`LEX-R34` **H** aplazamiento — un aplazado dice cuándo se revisa y quién responde.
```

**Dos reglas vigentes fuera del núcleo que el agente carga**, sin que nada dijera nada. Es el daño
que `build-core.mjs:194` documenta —`[START PTSA]` con el 29 % de su ruleset— por otra vía.

**Por qué no lo cazó, medido**: `definidasDosVeces()` compara **entre documentos**, porque
`SUITE-R14` dice «en dos **documentos**». Las dos definiciones estaban en el **mismo** archivo,
`LEXICON.md`, §3.6 y §5.

Corregido a `LEX-R35`/`LEX-R36`. El hueco es **`PT-163`**, enlazado.

**Lo encontró leer el `diff`** — que es lo que `RC-01` exigía: *«el `diff` se lee, no se supone»*.
Con `build-core --check` en `EXIT=0` habría pasado.

## 5. Lo que esta tarea deja para `PT-149`

El procedimiento está escrito y la regla puede fallar. Lo que **no** está es la prueba de que el
alta y la baja **se ejecutan** — que es el criterio de éxito del lote entero, y es `PT-149`.
