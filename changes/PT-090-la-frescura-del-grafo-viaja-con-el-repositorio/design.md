# PT-090 — Diseño   `PHASE 4`

## `derivaDelGrafo`: el hash manda, el `mtime` es el respaldo

```js
const esperado = d?.ast_hash ?? d?.semantic_hash ?? null;
const actual = huellaDe(ruta, esperado == null);
if (actual == null) { cambiados.push(`${ruta} (no existe)`); continue; }
if (esperado == null) {
  if (Math.abs(Number(actual) - Number(d?.mtime ?? 0)) > 1) cambiados.push(ruta);
} else if (String(actual) !== String(esperado)) {
  cambiados.push(ruta);
}
```

**El segundo argumento de `huellaDe` dice qué se le está pidiendo.** Sin él, quien la implementa
tendría que adivinar si devolver un hash o un número, y la función acabaría devolviendo los dos
«por si acaso» — que es cómo nacen los datos sin naturaleza que `PT-058` prohibió.

**El respaldo al `mtime` no es cortesía.** Un proyecto con manifiesto anterior no trae hash: dar
todo por cambiado lo pondría en `SUSPECT` permanente el día que actualice, y una comprobación que
nace roja se apaga.

## La huella se calcula sobre contenido **normalizado**

```js
const txt = readFileSync(f, 'utf8').split(String.fromCharCode(13)).join('');
return createHash('md5').update(txt).digest('hex');
```

Sin quitar el `\r`, un checkout con `CRLF` y otro con `LF` darían **hashes distintos para el mismo
archivo**. Sería cambiar un dato que depende de la máquina por otro que también.

Y no es hipotético: `git` avisó de la conversión `CRLF`→`LF` en **cada commit de este lote**.

## `MISSING`: de bloqueo mudo a hecho declarado

```js
return { state: 'MISSING', reason: 'no existe graphify-out/ en este clon — el directorio está
  en .gitignore, así que la frescura NO ES EVALUABLE aquí. No es lo mismo que estar
  desactualizado' };
```

y el aviso global deja de prometer lo que no hace:

```js
`Grafo ${GRAPH.state} — ${GRAPH.reason}.${GRAPH.state === 'MISSING' ? '' : ' Bloquea G2 en PTs MAJOR.'}`
```

**La comprobación no bloqueaba «a veces».** Fuera de la máquina que generó el grafo no llegaba a
evaluarse **nunca**, y aun así decía «Bloquea G2» — una promesa que ningún clon podía cumplir.

Decir «no evaluable aquí» es `SIN EVALUAR` aplicado a un estado, y es lo mismo que `PT-058` fijó
para las cifras: **no medido y medido cero no son el mismo hecho.**

## `rutaRelativaDelManifiesto`

Busca la raíz **dentro** de la ruta, sin resolver el sistema de archivos: el manifiesto puede
nombrar archivos que ya no existen, y `resolve()` no sabría de cuál.

**Si la raíz no aparece, devuelve la ruta tal cual.** Fabricar una relativa plausible sería peor
que decir que no se pudo — y hay un caso que fija ese comportamiento.
