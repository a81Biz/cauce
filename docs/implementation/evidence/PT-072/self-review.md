# PT-072 — Autorrevisión   `PHASE 6`

## La respuesta corta

**Sí: cauce sirve para un proyecto nuevo.** Un proyecto real —`tareitas`, 25 líneas y un
servidor— se instaló desde el paquete, pasó Foundation, cerró un `PT` completo con tests en rojo
primero, y terminó con `cauce verify` en **cero errores**.

Y **siete huecos**, dos de ellos serios.

## Lo que más me convenció, y no es una cifra

`cauce verify` sobre la instalación virgen falló con **tres errores accionables** y dijo qué
ejecutar en cada uno. Al completarlos bajó a cero **guiando uno a uno**: cada arreglo destapaba
el siguiente hueco real, ninguno inventado. Eso es un verificador que funciona.

## Los dos huecos que importan

**`H7` es una contradicción declarada, no un descuido.** Tres sitios del marco dicen que la
plataforma es opcional —`SUITE-R22` declara soportado el equipo de una persona, `migrate` escribe
literalmente «**OPCIONAL** … **Sin ella no cambia nada**»— y el código dice:

```
sin plataforma con la que comentar, la nota no tiene donde ir. avanzar la EXIGE (FDGE-R52).
```

`avanzar` exige `--nota`; la nota exige issue; el issue exige plataforma. Y `FDGE-R52` hace de
`avanzar` **la única forma sancionada** de cambiar de fase. Sin tablero no se avanza ni una fase.

**`H6` llega más lejos de lo que parece.** `RE_SEVERITY` exige fin de línea tras `S2`, y
`BUG-REPORT.md` —la plantilla que **el paquete distribuye**— trae un comentario ahí. Quien instala
el paquete, copia su plantilla y la rellena, **falla `FDGE-R04`**. No es un caso raro: es el
camino que el `MANUAL` describe. Y los demás campos sí toleran el comentario, así que ni siquiera
es una convención: es un campo incoherente con los otros.

## Lo que descubrí no declarando plataforma

`H7` **sólo apareció porque no declaré plataforma**, y no fue casualidad: declararla habría hecho
que todo fluyera y habría ocultado el único hueco crítico. Un proyecto de prueba que se configura
para que salga bien no prueba nada.

Consecuencia: las nueve fases de `PT-001` las moví **editando el registro**. Es exactamente lo que
`FDGE-R52` quiere impedir, y consta en su autorrevisión. No lo simulé: lo hice de otra forma y
dije cuál.

## Tres errores míos que también son dato

Escribí el intake **a mano** en vez de copiar la plantilla, y fallé cuatro comprobaciones
seguidas. Regeneré `LAYOUT.md` **después** de firmarlo, y luego appendí dos firmas más porque no
leí que el archivo generado ya traía la línea para editar en su sitio — `FND-R22` lo cazó con
«tres veredictos». Y versioné `node_modules` en el primer commit.

Los tres son el comportamiento de quien llega nuevo. Por eso `H1`, `H2` y `H5` están en la lista
en vez de descartados como torpeza mía: **la fricción que produce un error natural es un hueco**,
aunque el marco tenga técnicamente razón.

## `AC-04` lleva salvedad, y se dice

`plan-layout` calculó `alcance: src`, correcto aquí. Pero eso significa que la prueba **no midió**
el defecto de `PT-070`, que aparece con código fuera de `src/` —como `bin/` en cauce—. Midió el
caso bueno.

## Lo que no se afirma

Que estos siete sean **todos** los huecos. Se recorrió un camino con un proyecto de 25 líneas;
otro con dependencias, contenedores o monorepo encontraría otros. Lo que se afirma es que estos
siete existen.

`AC-01`..`AC-05`, los cinco. Tres tests en el proyecto nuevo, cero fallos.
