# PT-089 — Diseño   `PHASE 4`

## La comprobación

```js
const divergenciaTerminal = (enYaml, enRegistro) => {
  if (!enYaml || !enRegistro) return;
  if (!ESTADOS_TERMINALES.has(String(enRegistro))) return;   // el registro no es terminal
  if (ESTADOS_TERMINALES.has(String(enYaml))) return;        // el YAML tambien lo es
  fail('SUITE-R35', …);
};
```

**Tres guardas y una acusación.** Las dos primeras son las que hacen que no nazca roja: sólo cae
la combinación que apaga comprobaciones.

`enYaml === undefined` sale por la primera: sin campo no hay nada que comparar. Es la misma
distinción de `PT-058` — «no declarado» y «declarado distinto» no son el mismo hecho.

## Lo que va en el mensaje, y no en un comentario

```
«No es una diferencia de opinión: es un archivo que se quedó atrás, y con él las
 comprobaciones de las fases posteriores no llegan a ejecutarse. Se arregla SINCRONIZANDO,
 no eligiendo: la precedencia de PT-004 no cambia. NO establece cuál de las dos fuentes
 tiene razón.»
```

Sin la última frase, el rojo se leería como «manda el registro» — y `PT-004` decidió lo contrario.
`PT-087` hace obligatorio que el límite llegue al mensaje; aquí se aplica el día después de
escribirlo.

## `avanzar`: dónde nacían las seis

```js
const esFinal = Number(destino) === Math.max(...Object.keys(FASES).map(Number));
const terminal = esFinal && !ESTADOS_TERMINALES.has(String(a.status));
if (terminal) a.status = 'INTEGRATED';
```

y en el YAML, **dentro del mismo `try`**, con el mismo respaldo y el mismo `restaurar()`: los
cinco actos o ninguno (`FDGE-R52`).

**`!ESTADOS_TERMINALES.has(a.status)` es la mitad importante.** `FDGE-R53` dice que la tarea
declara cómo termina, así que una `DEFERRED` que llegue a la última fase sigue `DEFERRED`. La
herramienta rellena lo que nadie declaró; no decide por nadie.

Y el `throw` si el intake no declara `status` no es defensivo de más: es el mismo contrato que ya
tenía `phase` — sin campo no se puede sincronizar, y sincronizar a medias es peor que no hacerlo.

## Por qué la fase final se deriva y no se escribe «10»

`Math.max(...Object.keys(FASES))` en vez de la constante. Un `10` a mano es una cifra copiada que
nadie recalcula — exactamente el material de `H-007`, y `RULE-01` lo llama por su nombre.
