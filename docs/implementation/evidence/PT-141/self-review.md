# Autorrevisión — `PT-141`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

El `catch` roto arreglado, y `manejadoresRotos()` para que la forma no vuelva sin que nadie lo
diga.

## El defecto, y por qué había sobrevivido

`tracker.mjs:1849` interpolaba `origen`, que no existe en ese ámbito. **El `catch` que debía
reportar el fallo lanzaba otro**, tapaba el real y mataba el comando. Se vio ejecutando
`abrir --aplicar`: reventó con `origen is not defined` **y aun así había creado el issue #262**.

**Un error dentro de un `catch` es invisible hasta que se ejecuta esa rama, y esa rama sólo corre
cuando algo ya ha ido mal.** Es la ruta menos probada del código y la que más importa: el día que
falla es el día en que hace falta el mensaje.

## Afinar la heurística **es** el trabajo, no un extra

```
primera version   9 hallazgos, SEIS falsos — locales de la funcion que envuelve el catch
afinada           1 hallazgo: el real
arreglado         0
```

**Un detector que grita seis veces de nueve no se usa: se apaga.** Y entonces no detecta nada.

Los cuatro filtros salieron **cada uno de un falso positivo real**, y cada uno tiene su caso:

| Filtro | El falso que lo produjo |
|:---|:---|
| Declaraciones **en cualquier sitio** | `otro`, `padre`, `hijo` |
| Descartar el acceso a propiedad | `fromCharCode`, `message` |
| Quitar las **cadenas** de la interpolación | `${ref ?? 'sin enlace'}` → `sin`, `enlace` |
| Quitar los **comentarios** | el comentario que explica el defecto lo contiene |

El último es **la quinta autorreferencia** de este repositorio: el lint de `PT-135` se encontró a
sí mismo, `PT-130` tuvo lo mismo, y aquí el texto que explica el defecto **es** el defecto para el
detector. Los comentarios se sustituyen por espacios, no se borran: **un hallazgo que apunta a la
línea equivocada es peor que no tenerlo**.

## El defecto que aparecí construyéndolo, y lo cazó un caso

**Los casos importaban el módulo con una ruta absoluta.** En Windows eso no es un especificador de
módulo válido: los ocho reventaron. `mlib` existe desde hace versiones y hace exactamente eso con
`pathToFileURL` — **no consultarlo es la misma forma que `PT-143` arregla en `asignar`**: la
información estaba a diez líneas.

## Y otra rotura de escapado

El `\b` del reconocedor se convirtió en un byte de control `0x08` al insertarlo: el regex
**compilaba y no casaba nada**, y el barrido devolvió **cero** — un cero que parecía una medición.
`CE-002` por cuarta vez en esta sesión, y lo cazó `audit.mjs`, que tiene esa comprobación
exactamente para esto.

## Lo que esta tarea NO establece

- **Que no queden manejadores rotos en `bin/`.** El barrido cubre `docs/methodology/tools/`.
- **Que la heurística sea completa.** Reconoce **la forma que ya mordió** y se declara como
  heurística (`SUITE-R26`).
- **Que `abrir` sea atómico.** `PT-132` ya lo trabajó; aquí se arregla el manejador.

## Estado

| | |
|:---|:---|
| Escenarios | 8 de 8, incluido el del árbol real |
| Falsos positivos eliminados | 4 formas, cada una con su caso |
| Orphan Criterion | ninguno |
