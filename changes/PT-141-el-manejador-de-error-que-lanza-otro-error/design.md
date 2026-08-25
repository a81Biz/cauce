# Diseño — `PT-141`   `PHASE 4`

## `manejadoresRotos(fuentes)`

Devuelve `null` sin fuentes —no se afirma que no haya— y si no, la lista con archivo, línea e
identificador.

| Qué reconoce | Qué NO |
|:---|:---|
| Un `catch` cuyo cuerpo **interpola** un identificador que el archivo no declara **nunca** | El ámbito real: eso exige un analizador |
| Interpolaciones `${…}`, donde el fallo revienta en ejecución | Referencias fuera de una plantilla |

**Sólo afirma lo seguro:** si un identificador no se declara en ninguna parte del archivo, no
puede estar en ámbito dentro de un `catch` suyo.

## Los tres filtros que hicieron falta, y cada uno por su falso positivo

| Filtro | Lo que evitaba |
|:---|:---|
| Declaraciones **en cualquier sitio**, no sólo de nivel superior | `otro`, `padre`, `hijo` — locales de la función que envuelve |
| Descartar el acceso a propiedad (`a.id` → sólo `a`) | `fromCharCode`, `message` |
| Quitar las **cadenas** de la interpolación | `${ref ?? 'sin enlace'}` daba `sin` y `enlace` |

Y un cuarto: **una línea de comentario no se mira**. El comentario que **explica** el defecto lo
contiene, y la autorreferencia ya mordió tres veces en este repositorio.

## Y el mensaje del `catch` arreglado dice qué pasó

```js
catch (e) { fail('SUITE-R56', `… ${ref ?? 'sin enlace'} … (${String(e?.message ?? e)…})`); }
```

Un «no se pudo» mudo obliga a reproducirlo a mano para saber por qué — y esta misma línea costó
una diagnosis.
