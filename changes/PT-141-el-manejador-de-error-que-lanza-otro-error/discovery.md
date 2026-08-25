# Descubrimiento — `PT-141`   `PHASE 2`

## El defecto, con archivo y línea

`tracker.mjs:1849`:

```js
catch { fail('SUITE-R56', `${a.id}: su issue #${a.issue} tiene el enlace ${origen} y no se pudo reescribir.`); }
```

`origen` no existe en ese ámbito — la variable se llama `ref`. **El `catch` que debía reportar el
fallo lanza un `ReferenceError` distinto**, tapa el real y mata el comando.

## Cómo se vio

Ejecutando `tracker abrir --aplicar` el 2026-08-24: reventó con `origen is not defined` **y aun
así había creado el issue #262**. Un comando que falla y deja efecto es lo contrario de lo que
este marco promete.

## Por qué había sobrevivido

**Un error dentro de un `catch` es invisible hasta que se ejecuta esa rama, y esa rama sólo corre
cuando algo ya ha ido mal.** Es la ruta menos probada del código y la que más importa: el día que
falla es el día en que hace falta el mensaje.

## La medición del árbol

Un barrido de los `catch` de `tools/` que interpolan identificadores no declarados en su archivo:

```
primera heuristica    9 hallazgos, SEIS de ellos falsos — locales de la funcion que envuelve
tras afinarla         1 hallazgo: tracker.mjs:1859, el real
tras arreglarlo       0
```

**Un detector que grita seis veces de nueve no se usa: se apaga.** Por eso afinar la heurística es
parte del trabajo y no un extra.

## Qué NO se midió

- **Si hay manejadores rotos en `bin/`.** El barrido cubre `docs/methodology/tools/`.
- **Errores de ámbito fuera de un `catch`.** Ahí los caza la ejecución normal.
