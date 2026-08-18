# PT-048 — Descubrimiento   `PHASE 2` · `2-B`

## Dónde está, con archivo y línea

```js
// tools/tracker.mjs:258-261
const enlace = url
  ? `[\`${dir}/\`](${url}/tree/${ramaDelEnlace}/${dir})`
  : `\`${dir}/\` — en el repositorio`;
```

El enlace se compone **siempre**, exista el directorio o no. Y `SUITE-R44` dice, con todas las
letras, que un `DEFERRED` está **exento**: *«un aplazado queda exento de las exigencias de
artefactos de un PT en curso —no tiene intake ni ha recorrido fases»*.

**Las dos reglas son correctas por separado.** Juntas producen un enlace a un directorio que la
otra regla garantiza que no existe.

## Medido hoy

```
PT-019  #26   404  →  changes/PT-019-migrar-el-proyecto-legado
PT-025  #35   404  →  changes/PT-025-la-guarda-de-cierre-en-azure
```

Dos de dos. Las otras ocho `DEFERRED` de esta mañana ya no lo son: `EP-013` las activó, y al
hacerlo se les creó el directorio — lo que **enmascaró el defecto** justo mientras se trabajaba
en él.

## Por qué importa más de lo que parece

`PT-036` existe **exactamente** para esto: *«el enlace del issue apunta a donde el contenido
está… apuntar siempre a la principal daba 404 en el momento en que más se lee un issue, al
abrirlo»*. Resolvió el caso de la rama y no el de **que no haya contenido**.

Y en un `DEFERRED` el issue es lo **único** que hay: no tiene intake, ni fases, ni evidencia. Un
enlace roto en el único artefacto de una allocation aplazada es peor que en cualquier otro sitio.

## Lo que NO es el defecto

No es que falte el directorio: `SUITE-R44` dice que no debe existir, y crearlo vacío sería el
`PTSA/` vacío que `SUITE-R32` describe — un espacio sin contenido que desaparece en el primer
clon, y una promesa de artefactos que nadie va a escribir.

Lo que falta es que el cuerpo **diga lo que hay** en vez de enlazar a lo que no hay.
