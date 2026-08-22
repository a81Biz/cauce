# Strategy — `PT-100`

## 1. Objetivo

Que ninguna verificación decida si corre por **cómo se escribió** un nombre.

## 2. Solución

### `S-1` · El espacio de `QA` se **busca**, no se supone `AC-01`

```js
const GRAFIAS_QA = ['QA', 'qa'];
const dirQA = GRAFIAS_QA.map((g) => join(ROOT, g)).find(existsSync) ?? join(ROOT, 'QA');
```

**No elige una grafía**: acepta las dos y **dice cuál encontró**. Elegir obligaría a renombrar el
árbol de proyectos ajenos, que es `OUT` del intake — la herramienta se adapta al proyecto.

Y cuando no encuentra ninguna, la salida **dice dónde buscó**. Sin eso, «nada que verificar» era
correcto para un proyecto sin `QA` e indistinguible de uno que sí lo tiene.

### `S-2` · `LEXICON` declara los tipos de caso `QA` `AC-02` `AC-05`

`LEX-R28`: `HP` · `EC` · `EF` · `REG`, con qué significa cada uno. Es lo que dicen los **tres**
documentos; la herramienta se alinea.

**La causa no era que la herramienta estuviera mal: era que no había a quién preguntar.**

### `S-3` · `FDGE-R52` declara el destino que la herramienta usa `AC-03`

Gana `TRANSICIONES.log`, y **contra la costumbre**: aquí el documento estaba desactualizado, no la
herramienta. `tracker.mjs:2509` documenta que el cambio fue deliberado —append-only, `SUITE-R09`—
y un ledger por repositorio es mejor que uno por tarea.

> `LEX-R22` dice que las reglas mandan sobre las herramientas. Pero una regla que describe un
> comportamiento que ya no existe **no manda: desinforma**. La regla se actualiza.

### `S-4` · `LEXICON` declara que un lote **no lleva `type`** `AC-04` `AC-05`

`LEX-R27`. Y los seis `type === 'EP'` de `verify-fdge` pasan al helper que `patrones.mjs` exporta
desde `PT-096`.

**Se declara la ausencia, no un valor.** Las dos respuestas valían —`EP` o «ninguno»— y ésta es la
que no obliga a migrar diecinueve allocations ni a mantener un campo que nadie necesita.

## 3. Alternativas evaluadas

### `A-1` · Renombrar `qa/` a `QA/` en los proyectos — rechazada

Es `OUT` del intake. Tocaría el árbol de proyectos ajenos, y en un repositorio ya publicado un
cambio de mayúsculas en git es una operación que rompe clones.

### `A-2` · Elegir `EDGE|NEG` y cambiar los tres documentos — rechazada

Tres documentos contra una herramienta: la mayoría no decide, pero **`QA-Prompts` es el texto que
se copia a cada proyecto destino**. Cambiarlo rompería todo `QA-PLAN` ya escrito.

### `A-3` · Declarar `type: 'EP'` como canónico y migrar el registro — rechazada

Obligaría a tocar diecinueve allocations históricas —`SUITE-R09` es append-only— para mantener un
campo del que **nadie tiene que depender**. Derivar del ID no necesita migración.

## 4. Riesgos

```
RIE-1  tocar RULES.md cambia el texto de una regla HARD. No cambia su OBLIGACION —la nota
       sigue siendo obligatoria— sino el destino que nombra. CORE.md se regenera

RIE-2  cambiar RE_TIPO_CASO puede romper un QA-PLAN escrito con el vocabulario viejo. No
       hay ninguno: este repositorio no tiene QA-PLAN, y el unico proyecto que corrio QA
       —la calculadora— reporto INC-012 precisamente porque su plan seguia la documentacion

RIE-3  «GRAFIAS_QA» acepta dos. Si un proyecto tiene AMBAS —como este, por Windows— gana la
       primera de la lista. Se declara: es determinista y se dice cual se uso
```

## 5. Criterios de éxito

```
AC-01  verify-qa encuentra las dos grafias y dice cual · no sale en verde sin encontrar
AC-02  un vocabulario de tipos, declarado en LEXICON y usado por la herramienta
AC-03  un destino para la nota, declarado en la regla
AC-04  cero «type === 'EP'» en verify-fdge
AC-05  LEXICON declara los dos nombres que faltaban
AC-06  la bateria falla sin el arreglo, con los negativos
```

## 6. Autorrevisión

- **¿Inventa vocabulario?** Declara dos nombres que **faltaban**, que es lo contrario. Y ninguno es
  nuevo: `HP|EC|EF|REG` ya estaba en tres documentos, y «un lote no lleva `type`» es lo que
  `PT-096` ya había implementado sin declararlo.
- **¿Cambia una regla `HARD`?** Sí, `FDGE-R52`, y sólo el **destino que nombra** — no su
  obligación. Va con su motivo en la propia regla.
- **¿Elige por los proyectos destino?** No: `S-1` acepta las dos grafías.
