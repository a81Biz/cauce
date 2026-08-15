# PT-045 — Diseño   `PHASE 4`

## El dispatcher distingue dos cosas que hoy trata igual

```js
const desconocido = comando && !comandos[comando];
if (!comando || comando === '--help' || comando === '-h' || desconocido) {
  if (desconocido) {
    di(`«${comando}» no es un subcomando de cauce ${VERSION}.`);
    di('Si lo esperabas, tu copia puede ser anterior a la que lo trae:');
    di(`  npx @a81biz/cauce@latest ${comando}`);
    di('');
  }
  … la ayuda de siempre …
  process.exit(desconocido ? 2 : 0);
}
```

Los códigos no cambian —`0` sin subcomando, `2` con uno desconocido, y ya eran correctos—: lo
que cambia es que el segundo caso **diga qué pasó**. Hoy los dos imprimen exactamente lo mismo y
la única diferencia es un número que nadie ve.

Nombrar la versión no es adorno: es lo único que permite a alguien en `7.1.0` entender que el
manual no miente, que su copia es vieja.

## `npm start`

```json
"start": "node bin/cauce.mjs start"
```

Es el arranque **que funciona aquí**. `npx @a81biz/cauce start` no puede funcionar dentro de este
repositorio —`npx` resuelve el paquete local y no hay binario, ni debe haberlo (`SUITE-R41`)— y
eso no es un defecto que arreglar: es una consecuencia de estar autoalojado.

## El manual distingue los dos casos

`MANUAL.md` §4 y `CASOS-DE-USO.md` `A5` pasan a decir las dos formas, con la condición de cada
una:

```
en tu proyecto            npx @a81biz/cauce start
dentro de cauce mismo     npm start          (npx resuelve el paquete local: SUITE-R41)
```

## Lo que este diseño **no** hace

No publica, no instala nada, no cambia `SUITE-R50` ni el orden tablero → núcleo. Y **no hace que
`npx @a81biz/cauce start` funcione desde fuera** mientras la publicada sea `7.1.0`: hace que
diga por qué y qué hacer.
