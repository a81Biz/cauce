# `PT-192` · self-review

## Lo que se sostiene

- **`AC` verificados: 3, ninguno huérfano.** Cinco casos ejecutables.
- **`AC-02` lleva tres casos, y los tres hacen falta.** Que el ancla aguante 50 líneas nuevas lo
  cumple cualquier extracción que funcione. El segundo —que con `tail -40`, el **mismo** arnés
  falso, **falla**— es el que prueba que el arreglo hacía falta. Y el tercero impide que ese segundo
  pase **por vacío**.
- **`AC-03` no es teórico.** El comentario de `:7355` documenta que el intento anterior de anclar
  por texto *«arrancaba en esta misma línea y se tragaba medio archivo»*. El caso lo impide.
- **La técnica no se inventa.** El patrón partido es el de `PT-193` con las contraseñas; la marca
  deliberada es la idea de `PT-190` con `cauce:senuelos`.

## Eran CINCO casos, no cuatro

El intake y `discovery.md` cuentan cuatro. Al implementarlo apareció un quinto: `«…y no mira QUIET»`
también usaba `tail -4` sobre el fuente. Se incluye —es el mismo defecto y la misma ventana— y la
cifra queda corregida aquí en vez de dejarse en cuatro.

## Un error mío que el propio arnés cazó

Escribí los casos con `sh -c '_informe_final …'`. **`sh -c` no ve las funciones de bash**, así que
el comando fallaba con *«command not found»*… y el `chkno` **pasaba en verde**: sin salida, nada
casa. Un caso que aprueba porque su comando no existe es exactamente lo que da nombre a este lote.

Reescrito con funciones propias, y añadido el caso `«no pasa por vacío»` que lo habría delatado.
Es la familia de `PT-181` —una aserción que se satisface por la razón equivocada— aparecida mientras
se arregla otra de la misma familia.

## Y un segundo error mío, de orden

Definí `_informe_final()` **junto a los casos nuevos**, al final del archivo — y **tres de sus cinco
usos están 7 000 líneas más arriba**. La corrida por sección pasó (esos casos no estaban en ella) y
la **completa** falló con `command not found`.

Los dos errores de esta tarea son el mismo: **un caso puede fallar por una razón que no es la que
mide**. `sh -c` sin funciones, y una función definida después de usarse. Los dos los destapó
ejecutar, y el segundo sólo la corrida **completa** — la acotada no lo veía.

Movida junto a `chk`, `chkl` y `chknol`, que es donde viven los helpers.

## Lo que NO se cubre, y consta   `SUITE-R26`

- **Otras extracciones posicionales del arnés.** Se cubren las cinco que miden el final del fuente y
  que han fallado tres veces. Hay `tail`/`head`/`sed -n` en más sitios; barrerlos es otro trabajo.
- **Que nadie borre la marca.** Es una convención: quien borra `# cauce:informe-final` rompe cinco
  casos. La diferencia con hoy es que **borrarla es deliberado y visible**, mientras que añadir una
  línea al final no lo era. No se promete más que eso.

## Sin bloqueadores
