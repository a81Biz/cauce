# `PT-192` · `strategy.md` — el camino elegido, y los descartados con su porqué

## El camino: una marca deliberada, y el patrón partido

**1 · El bloque del informe final lleva una marca**, puesta a propósito:

```bash
# cauce:informe-final
```

**2 · Los casos la construyen partida**, para que el fuente no la contenga dos veces:

```bash
_informe() { sed -n "/cauce:info""rme-final/,\$p" "$1"; }
```

El fuente contiene `cauce:info""rme-final`, que **no casa** `cauce:informe-final`. Es exactamente la
técnica con la que `PT-193` sacó las contraseñas del fuente, y la idea con la que `PT-190` sustituyó
la heurística de los 4000 caracteres: **una declaración explícita que vale esté donde esté**.

El bloque extraído deja de depender de cuántas líneas tenga. Puede crecer, y crecer es lo correcto.

---

## Los caminos descartados

### 1 · Ampliar la ventana de 40 a N

**Descartado: es literalmente lo que ya se hizo, y aquí estamos.** `PT-086` la amplió de 14 a 40 por
esta misma causa y dejó escrito que *«extraer por POSICION es fragil en las dos direcciones»*.
Cualquier `N` es igual de arbitrario y sólo mueve el día en que vuelve a pasar — el argumento con el
que `PT-190` rechazó ampliar los 4000 caracteres.

### 2 · Anclar por texto literal

**Descartado, y el arnés ya documenta por qué falló.** `:7355`:

> *«`sed -n "/NINGUN CASO CASA/,/^fi/p"` arrancaba en ESTA MISMA LINEA —que contiene ese texto al
> definirse— y se tragaba medio archivo».*

El arnés **se lee a sí mismo**: cualquier patrón literal está en el archivo dos veces. Por eso el
ancla tiene que ser una marca **que el caso no escriba entera**.

### 3 · Mover el bloque del informe al principio del archivo

**Descartado: no escala y traslada el problema.** Los casos seguirían midiendo por posición, sólo
que desde el otro extremo, y `PT-086` ya avisó de que la fragilidad va **en las dos direcciones**.

### 4 · Que los casos midan la SALIDA en vez del fuente

**Descartado por coste y por riesgo.** Exigiría correr el arnés dentro del arnés — que es lo que
`PT-188` cerró con dos puertas tras medir que podía escribir en el repositorio real.

### 5 · Sustituir los cuatro casos por uno

**Descartado: miden cosas distintas.** Que el recuento exista, que un patrón sin coincidencias sea
rojo, que lo diga con su texto, y que `--solo` lleve dos cifras. Fundirlos perdería tres.

---

## Lo que NO promete   `SUITE-R26`

**No barre todas las extracciones posicionales del arnés.** Cubre las **cuatro** que miden el final
del fuente, que son las que han fallado tres veces. Si al ejecutarlo aparecen otras, se declaran.

**Y la marca es una convención, no una garantía.** Quien borre la línea `# cauce:informe-final`
rompe los cuatro casos — igual que quien borra `cauce:senuelos` deja de eximir un archivo. La
diferencia con hoy es que **borrarla es un acto deliberado y visible**, mientras que añadir una línea
al final no lo es.

## La comprobación inversa

Con el ancla puesta, **añadir líneas al final del bloque no debe romper ningún caso**. Se comprueba
insertando líneas en un arnés falso y verificando que la extracción sigue encontrando lo suyo — lo
que con `tail -40` fallaría.
