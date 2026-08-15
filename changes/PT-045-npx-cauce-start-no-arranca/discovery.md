# PT-045 — Descubrimiento   `PHASE 2` · `2-B`

## Dos causas distintas, medidas por separado

`MANUAL.md` §4 y `CASOS-DE-USO.md` `A5` documentan **`npx @a81biz/cauce start`** como el punto de
entrada. Falla, y por dos razones que no tienen nada que ver entre sí.

### Causa 1 · dentro del repositorio de cauce

```
$ npx @a81biz/cauce start
"cauce" no se reconoce como un comando interno o externo
```

`npx` ve que el `package.json` local **declara ese mismo nombre**, da el paquete por presente y
busca su binario en `node_modules/.bin/cauce`. No existe, y no debe existir: instalarlo como
dependencia de sí mismo dejaría dos copias completas del marco, que es lo que `SUITE-R41`
prohíbe explícitamente.

**No hay nada que arreglar en `npx`.** Lo que falla es que el manual documenta, como único
arranque, un comando que en este repositorio no puede funcionar — y este repositorio es el
primer sitio donde alguien lo va a probar.

### Causa 2 · fuera, con la versión publicada

```
$ cd /tmp/limpio && npx @a81biz/cauce@7.1.0 start
cauce 7.1.0 — marco de gobernanza para desarrollo asistido por IA
  cauce install [ruta]   …
  cauce verify  [ruta]   …
  cauce compare [ruta]   …
  cauce core    [ruta]   …
exit=2
```

`start` nació en la `7.3.0`; la publicada más alta es `7.1.0`. El binario **hace lo correcto** —
ayuda y código `2`— pero **no dice qué ha pasado**: no nombra el subcomando que no reconoció, no
dice que puede ser una versión vieja, y no dice qué hacer. Quien lo lea concluye que el manual
miente.

## Un tercer hallazgo, del propio dispatcher

```
node bin/cauce.mjs arrancar   → ayuda · exit 2     ✓ correcto
node bin/cauce.mjs            → ayuda · exit 0     ✓ correcto
```

Los códigos están bien; lo que falta es el **mensaje**. `bin/cauce.mjs:último bloque` trata igual
«no me diste subcomando» —que es una petición de ayuda— y «me diste uno que no existe» —que es un
error del que hay que salir—. La única diferencia es el código de salida, que nadie ve.

Es exactamente lo que `SUITE-R53` corrigió para las reglas: *«todo mensaje de fallo cita su
regla, y deducirla no puede ser el camino»*. Aquí el fallo no cita nada.

## Lo que NO se puede arreglar desde aquí

**Publicar la `7.6.0`**, que es lo que haría desaparecer la causa 2. Es decisión humana explícita
—«no publicamos aún porque nos falta algo más»— y está en el `out-of-scope` del lote.

Lo que sí se puede: que quien tropiece con cualquiera de las dos causas **reciba una frase que
le diga qué hacer**, en vez de una ayuda muda o un «no se reconoce».
