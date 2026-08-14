# PT-045 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

El dispatcher **distingue** dos cosas que trataba igual: «no me diste subcomando» —que es pedir
ayuda— y «ese no existe» —que es un error—. El segundo nombra el subcomando, dice la versión que
corre y da la salida. `npm start` es el arranque que funciona dentro de cauce, y el manual y el
catálogo declaran los dos casos.

```
selftest   445 → 456 casos
```

## Lo que NO arregla, y es la mitad de la historia

**`npx @a81biz/cauce start` sigue sin arrancar desde fuera.** La publicada más alta es `7.1.0` y
`start` nació en la `7.3.0`. Lo único que cambia es que ahora **dice por qué y qué hacer** en vez
de imprimir una ayuda muda donde `start` no aparece.

La causa desaparece al publicar, y publicar está en el `out-of-scope` del lote por decisión
humana explícita. Digo esto arriba y no al final porque es lo que un revisor tiene que saber
antes que nada: **el título de la tarea promete más de lo que la tarea entrega**.

## Lo que un revisor debería atacar

**1 · Es un mensaje de consola.** Otra vez. Lo único mecánico es que el código de salida y el
texto ya no se contradigan.

**2 · Dentro del repositorio, el fallo no lo produce cauce**: lo produce `npx` al resolver el
paquete local, y nunca llega al binario. Ningún caso puede cubrir eso desde aquí — lo que se
comprueba es que el manual **lo declare**, que es lo que se puede.

**3 · `npm start` es una tercera forma de arrancar** en un marco que insiste en tener una sola
puerta (`SUITE-R50`). Mi defensa: no compite, es la misma puerta con el envoltorio que este
repositorio necesita por estar autoalojado. Pero es una forma más, y quien la vea sin el porqué
al lado tiene razón en desconfiar.

**4 · El mensaje sugiere `@latest` sin comprobar que exista una versión más nueva.** Sugiere,
no afirma —«tu copia **puede** ser anterior»—, y comprobarlo exigiría una llamada al registro de
npm desde un comando que tiene que funcionar sin red.

## Desviaciones declaradas

**Sin rama por PT** (`PT-047`), como el resto del repositorio.

## Lo que NO he verificado

Que `npx @a81biz/cauce@latest start` funcione. **No puedo**: exige que la `7.6.0` esté publicada,
y no lo está. Quedará comprobado la primera vez que alguien publique — no antes, y decirlo es
mejor que dar por hecho que funcionará.

## Checklist

- [x] Todos los `AC` verificados con evidencia en disco
- [x] Sin huérfanos en `traceability.md`
- [x] El código hace lo que dice `design.md`
- [x] Delta registrado: ninguno. Es la única de las tres tareas del lote que salió según plan
- [x] Sin regresiones: `selftest` 456/456 · `verify-suite` sin errores · códigos de salida intactos
- [x] `11-Conventions.md` respetado
- [x] Commits atómicos con `PT-045` en el mensaje
- [x] Sin restos de depuración
- [x] `out-of-scope.md` intacto: no se publicó nada
- [x] Sin problemas de seguridad evidentes (`FDGE-R45`)
- [x] Contrato público: los seis subcomandos y los tres códigos de salida, sin cambios

SELF_REVIEW_COMPLETE
