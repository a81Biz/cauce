# `PT-194` · `discovery.md` — la respuesta es que **no debe valer**, y hay que decirlo

## 1. Dónde está exactamente

```js
// revisar-secretos.mjs:91   — el ARBOL
const esSeñuelo = (txt) => RE_DECLARADO.test(txt) || RE_SEÑUELO.test(txt.slice(0, 4000));

// revisar-secretos.mjs:164  — la HISTORIA
revisarTexto(linea.slice(1), `historia ${commit}`, false, 'historia');
//                                                 ^^^^^
```

**No es que la exención «no llegue»: está pasada en duro como `false`.** El tercer parámetro de
`revisarTexto` es `esSeñuelo`, y para la historia siempre vale «no exime».

Lo único que sí actúa por línea es `RE_SEÑUELO.test(linea)` dentro del bucle — la heurística por
palabra en la **misma línea**, no la declaración del archivo.

## 2. Podría llegar, y ése es el punto

El diff de `git log -p` **lleva el archivo** en sus cabeceras `+++ b/ruta`. El escáner las ignora:
recorre línea a línea y sólo distingue `^commit` y `^+`. Es decir, **hacer que la declaración
llegara a la historia es técnicamente fácil**, y eso es justo lo que hace peligrosa esta tarea.

## 3. Por qué la respuesta es que **NO debe valer**   `[HUMANO]` · `RULE-06`

El intake dejó la decisión abierta —*«y puede que la respuesta sea que NO debe valer… Decidirlo es
el trabajo»*—. Es que no:

**La declaración vive en el árbol de HOY; la historia es de SIEMPRE.** `cauce:senuelos` dice «este
archivo, tal como está ahora, es un fixture». Aplicarlo a la historia eximiría **todo lo que ese
archivo tuvo alguna vez** — incluida una credencial real que alguien puso y borró después. El
archivo que hoy declara ser señuelo es exactamente el sitio donde más cómodo resulta esconder algo.

**Y el riesgo va al revés del síntoma.** Lo que motivó la tarea es un falso positivo molesto.
Ampliar mal una exención de seguridad hace que un secreto **real** deje de bloquear. Entre
molestia y agujero, se elige molestia.

**El mecanismo para la historia ya existe y es el correcto**: firmar la huella en
`SECRETOS-EXCEPCIONES.md`, que **sigue mostrándola** en cada revisión y que ata la firma **al
valor** — si el valor cambia, la huella cambia y vuelve a bloquear. Una exención por archivo no
tiene esa propiedad.

## 4. Entonces lo que falta no es una exención: es un **mensaje**

Hoy, cuando un fixture entra en la historia, el rojo dice *«contraseña en texto plano»* — y el
hecho es otro: **está en la historia, la historia no se reescribe, y el camino es firmar la
huella.** Quien lo lea creerá que tiene una credencial expuesta.

Es la misma familia que `PT-198` cerró ayer: **un mensaje que afirma un hecho distinto del que
ocurrió**, y que manda al sitio equivocado.

## 5. Lo que ya se sabe, medido

`FND-R29` bloqueó al commitear `fb10d3de` con la huella `397f02076a3e`, firmada el `2026-08-28`.
**La causa ya la cerró `PT-193`** —el literal se ensambla en dos mitades, como `PT-015` hizo con la
clave AWS—, así que este caso concreto no vuelve. Lo que queda es **qué debe hacer el escáner
cuando vuelva a ocurrir**, que es esta tarea.

```
$ grep -c "cauce:senuelos" docs/methodology/tools/selftest.sh
```

## 6. Lo que NO se toca   `SUITE-R26`

- **La heurística de los 4000 caracteres se queda.** Los destinos ya instalados dependen de ella
  (`CE-014`), y el propio código lo declara en `revisar-secretos.mjs:87`.
- **La exención en el ÁRBOL no cambia.** Funciona y es la que `PT-190` compró.
- **No se reescribe historia** (`SUITE-R06f`).
- **No se promete que ningún fixture vuelva a aparecer en la historia.** Eso lo cerró `PT-193`.
