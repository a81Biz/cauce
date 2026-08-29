# `PT-192` · `discovery.md` — dónde está el defecto, con archivo y línea

## 1. Los cuatro casos

```
selftest.sh:7361   «sin coincidencias, es rojo»          tail -40   busca 'exit 1'
selftest.sh:7362   «…y lo dice con el patron»            tail -40   busca 'NINGUN CASO CASA'
selftest.sh:7370   «con --solo la salida lleva dos cifras» tail -40 busca 'TOTAL de $UNIVERSO'
selftest.sh:7408   «el recuento final existe»            tail -4    busca 'selftest: OK'
```

`$_st` y `$_st2` son **el propio archivo fuente**. Los cuatro apuntan al mismo sitio: el bloque del
informe final, entre el último `chk` y `exit "$FAILED"`.

## 2. La medida, hoy

```
tail -4  · el recuento esta a  3 lineas del final    margen: 1
tail -40 · «exit 1» esta a    33 lineas del final    margen: 7
```

**Siete líneas.** El bloque que `PT-191` insertó tenía 21.

## 3. Lo que ya ocurrió, dos veces, en esta misma épica

- **`PT-191`** puso el bloque del recibo detrás del recuento: empujó el objetivo de `:7361` fuera de
  su ventana y **dos casos se pusieron en rojo** sin que nada de lo que miden hubiera cambiado.
- **`PT-199`** tuvo que colocar su código *«antes del informe final»* **por esta misma razón**, y
  dejarlo escrito en un comentario para que el siguiente no lo rompa.

Y antes de esta épica:

- **`PT-086`** amplió la ventana **de 14 a 40** por exactamente lo mismo, y dejó escrito en `:7359`:
  > *«Extraer por POSICION es fragil en las dos direcciones, y aqui toco esta.»*

**Tres veces la misma causa. Ampliar la ventana es lo que se hizo en `PT-086`, y aquí estamos otra
vez.**

## 4. Por qué el ancla textual ingenuo NO funciona, y consta

El comentario de `:7355` documenta el intento anterior:

> *«Por POSICION, no por texto: `sed -n "/NINGUN CASO CASA/,/^fi/p"` arrancaba en ESTA MISMA LINEA
> —que contiene ese texto al definirse— y se tragaba medio archivo hasta el siguiente `fi`.»*

**El arnés se lee a sí mismo.** Cualquier patrón literal escrito en un caso **está en el archivo dos
veces**: en el sitio que quiere encontrar y en el caso que lo busca. Por eso se eligió la posición —
y por eso el arreglo no puede ser «anclar por texto» sin más.

## 5. La salida, y ya existe en este repositorio

`PT-193` resolvió el mismo problema con las contraseñas de fixture: **ensamblar el patrón en tiempo
de ejecución**, para que el fuente no lo contenga.

```bash
printf 'pass%s = …\n' 'word'      # el fuente NO contiene «password = …»
```

Aplicado aquí: una **marca deliberada** en el bloque del informe final, y los casos la construyen
partida. La marca vale **esté donde esté** — que es exactamente lo que `PT-190` hizo con
`cauce:senuelos` cuando la heurística de los 4000 caracteres resultó ser un desplazamiento.

## 6. Lo que NO está roto

- **Lo que los cuatro casos miden.** Que el recuento exista, que un patrón sin coincidencias sea
  rojo, que `--solo` lleve dos cifras: todo correcto y se conserva.
- **`tail` como herramienta.** El problema no es `tail`: es usar **la distancia al final** como
  identificador de un bloque que crece.
