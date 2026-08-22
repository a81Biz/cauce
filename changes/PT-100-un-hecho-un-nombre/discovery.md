# Discovery — `PT-100` · `PHASE 2-B`

## QUÉ

Cinco hechos con dos nombres cada uno, y los cinco deciden si algo se verifica.

## DÓNDE Y CÓMO

### `TD-04` · el peor, y peor de lo que su entrada decía

```js
const QA    = join(ROOT, 'QA');            // :36
const SPECS = join(ROOT, 'qa', 'tests');   // :37
```

**Líneas consecutivas del mismo archivo.** La entrada de `TD-04` lo describía como «el verificador
busca `QA/` y git guardó `qa/`» — un desajuste entre herramienta y proyecto. Es peor: el desajuste
está **dentro de la herramienta**.

Y la salida cuando no encuentra:

```js
console.log('No hay QA/ … : nada que verificar.');
process.exit(2);
```

**Correcto para un proyecto sin `QA`, e indistinguible de uno que sí lo tiene con la otra
grafía.** Es la forma de `PT-096`: una salida escrita para un caso legítimo cubriendo uno que no
lo es.

**En Windows no se reproduce**, y eso es parte del defecto: el sistema de archivos no distingue,
así que se escribió y se probó donde no se ve. **Décima instancia** del patrón «probar donde
trabajo, no donde se decide».

### `INC-012` · tres documentos contra una herramienta

```
verify-qa.mjs     HP|REG|EDGE|NEG
QA-Prompts:583    HP|EC|EF|REG
PHASES:595        HP|EC|EF|REG
CORE:1003         HP|EC|EF|REG        (generado de PHASES)
LEXICON           —                    <- y aqui esta la causa
```

Un `QA-PLAN` escrito siguiendo la documentación **fallaba la verificación**; uno escrito para
pasarla **contradecía la documentación**. Y `LEXICON` no declaraba el vocabulario, así que no
había a quién preguntar.

### `INC-008` · la regla se quedó atrás, no la herramienta

`tracker.mjs:2509` dice *«la nota vive **ahora** en `TRANSICIONES.log`»* — cambio deliberado, con
su motivo (`SUITE-R09`, append-only). `RULES.md:172` seguía diciendo `bitacora.md` del PT.

**Aquí el que estaba mal era el documento.** Y decidirlo importa: `LEX-R22` dice que las reglas
mandan, pero una regla que describe un comportamiento que ya no existe no manda: desinforma.

### `LEX-R27` · lo que `L-0` dejó

```
registro     type: EP x16 · ausente x2 · EPIC x1
verify-fdge  SEIS «type === 'EP'»
LEXICON      §8.1 enumera el type de una TAREA. Para un lote, nada.
```

`PT-096` arregló los **ocho** de `tracker.mjs` derivando del ID. Quedaban seis, y la pregunta sin
responder.

## POR QUÉ · la causa común

**Dos de los cinco hechos no tenían dónde estar declarados.** `LEX-R21` dice que los nombres van a
`LEXICON`, y ni el tipo de caso `QA` ni el `type` de un lote estaban ahí.

Cuando un nombre no tiene autoridad, **cada herramienta elige el suyo** — y ninguna está mal,
porque no hay contra qué contrastarla. Es la enfermedad de la v3 que `LEXICON` nació para curar,
reaparecida **dentro de las herramientas** en vez de entre documentos.

## Complejidad — `FDGE-R04`

```
Complejidad: STANDARD
```

Tres archivos de herramientas, `LEXICON`, `RULES`, `PHASES` y la regeneración de `CORE.md`. No
cambia ninguna regla de fondo: **declara dos nombres que faltaban y alinea lo que discrepaba**.

## Lo que NO establece

- Cuántos hechos más tienen nombre doble. Cinco conocidos.
- Que `QA/` sea la grafía correcta: el arreglo **no elige**, busca las dos y dice cuál usó.
