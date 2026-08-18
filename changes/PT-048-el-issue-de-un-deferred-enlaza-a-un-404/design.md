# PT-048 — Diseño   `PHASE 4`

## El cambio

`cuerpoDeIssue` es **pura y exportada** —para que un caso pueda comprobarla sin hablar con
GitHub—, así que el dato nuevo viaja en el contexto que ya recibe, no se lee del disco dentro:

```js
// contextoCuerpo(a)  ·  quien llama ya tiene el sistema de archivos delante
hayDirectorio: existsSync(join(ROOT, 'changes', `${a.id}-${a.slug}`))

// cuerpoDeIssue(a, ctx)
const enlace = ctx.hayDirectorio === false
  ? 'Sin artefactos todavía: es una allocation **aplazada** (`SUITE-R44`). Cuando se retome, '
    + 'su `PHASE 1` creará el directorio y este cuerpo se resincroniza solo.'
  : (url ? `[\`${dir}/\`](${url}/tree/${ramaDelEnlace}/${dir})` : `\`${dir}/\` — en el repositorio`);
```

**`=== false` y no `!ctx.hayDirectorio`**: si el dato no viaja —una llamada antigua, un caso que
no lo pase— el comportamiento tiene que ser el de hoy, no el nuevo. Un `undefined` no es un «no
existe», y tratarlo como tal apagaría el enlace en todos los cuerpos.

## Por qué se mira el directorio y no el estado

Un `DEFERRED` es el caso común pero no el único: un PT recién asignado tampoco tiene directorio
hasta que `PHASE 1` lo crea. Con `status === 'DEFERRED'` como criterio, ese seguiría dando 404 —
y sería un defecto nuevo escrito mientras se arregla el viejo.

## Lo que este diseño **no** hace

No crea directorios, no toca la lógica de rama de `PT-036`, y no le da al issue de un aplazado
más contenido del que `SUITE-R44` quiere que tenga. Hace que **no mienta**.
