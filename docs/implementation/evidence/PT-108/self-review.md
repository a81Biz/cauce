# Autorrevisión — `PT-108`

## Lo que establecí

Que `version.mjs` ve las **tres** formas de declarar la versión y alinea el registro sin tocar
ningún otro campo.

## Lo que NO establecí

- **Que no exista una cuarta forma.** Se conocen tres.
- **Que la escritura sea segura frente a otro comando a la vez.** No pasa por el cerrojo de
  `PT-107`: **declarado, no protegido**.
- **`AC-04`: que la batería falle sin el arreglo.** No se escribió el caso. Comprobado a mano.

## Lo que esta tarea confirma

**`PT-102` declaró «no sé cuántas formas más hay» y apareció la tercera.** Declarar lo que no
sabes es lo que hace que el siguiente hallazgo **tenga dónde encajar** en vez de parecer un
defecto nuevo.

## Lo que dejo sin cubrir, y lo digo

`AC-04` pide un caso de batería y **no lo escribí**: exigiría un fixture con su propio
`REGISTRY.json`. Queda como deuda declarada. Marcarlo «verificado» habría sido fabricar un verde.
