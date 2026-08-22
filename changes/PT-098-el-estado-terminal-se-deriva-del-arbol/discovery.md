# Discovery — `PT-098` · `PHASE 2-B`

## QUÉ

`avanzar --a <última>` escribe `INTEGRATED` sin comprobar nada, y ese estado **apaga seis
comprobaciones** de `verify-fdge`.

## DÓNDE

```
tracker.mjs
  const terminal = esFinal && !ESTADOS_TERMINALES.has(String(a.status));
  if (terminal) a.status = 'INTEGRATED';

verify-fdge.mjs · los seis que se eximen de lo terminal
  :1368  SUITE-R08 · la fase declarada
  :1388  FDGE-R54 · el veredicto de viabilidad
  :1432  la rama declarada sigue viva
  :1466  fase >= 9
  :1559  fase >= 5 sin rama
  :1591  FDGE-R52 · las notas de reanclaje
```

`INC-011` contó **cinco** — las que alcanzaban a *sus* dos tareas. Son **seis**.

## CUÁNDO

Medido en dos repositorios el 2026-08-21:

```
calculadora   PT-001 y PT-002 en INTEGRATED con «git rev-list --count main» = 2
              al corregir a DONE: cinco comprobaciones encendidas, CUATRO en rojo
              sobre trabajo del dia anterior

cauce         116 allocations · 113 terminales · 91 INTEGRATED
              de las 91: 33 declaran rama, 58 NO
              contrastadas por su directorio en main: 91 de 91, y las 91 CIERTAS
```

## CÓMO — el mecanismo

**1 · El comando escribe un hecho que no comprueba.**

`LEXICON` §5.1 define `INTEGRATED` como *«mergeado a la línea principal»*. `avanzar` lo escribe
porque alguien pidió la última fase — que es otra cosa.

**2 · Seis comprobaciones se eximen de lo terminal, y con razón.**

La exención existe para no exigir bitácora retroactiva a lo integrado antes de la `5.1.0`. **La
exención es correcta**; lo que falla es el dato que la dispara.

**3 · El resultado es un falso VERDE.**

```
verify-fdge --all        verde       las seis se eximen
verify-fdge --gate G4    rojo        «estado INTEGRATED. G4 exige DONE»
```

`INC-011` lo dice mejor que yo: *«un falso rojo se investiga; un falso verde se archiva»*.

**4 · Y nadie lo decidió.**

*«El estado terminal lo escribió el propio comando al avanzar de fase, sin que ningún humano lo
declarara: un `avanzar --a 10` apagó cinco reglas sobre dos `PT` y nadie tuvo que decidirlo.»*

## POR QUÉ · la causa, y el reencuadre

### Causa raíz

**El comando escribe el estado equivocado, no un estado falso.**

`LEXICON` §5.1 distingue dos:

```
DONE          terminado, esperando G4
INTEGRATED    «mergeado a la linea principal»
```

Y `FDGE-R34` es explícita: **`G4` exige `DONE`**, no `INTEGRATED`. Así que el estado que
corresponde al terminar la última fase —antes del merge— es `DONE`.

`avanzar` lleva escribiendo `INTEGRATED` donde el marco esperaba `DONE`.

### La tensión que parecía un choque de reglas, y no lo es

Mi primer diseño era que `avanzar` se **negara**. Está mal: `SUITE-R46` exige el orden contrario
—*«apuntar el estado terminal en la rama de trabajo, mergear, y cerrar después»*— así que negarse
haría imposible lo que otra regla obliga.

Pero `SUITE-R46` habla de un **estado terminal** genérico, y el que se apunta antes del merge es
`DONE`. **No hay choque: hay un comando escribiendo el estado que no toca.**

Es la familia de `PT-029` —reglas que se hacen imposibles entre sí— y por eso conviene decir que
**aquí no lo son**: el detector de `PT-029` no habría encontrado nada, porque no hay dos textos en
conflicto. Hay un texto y un comando que no lo sigue.

### Por qué no lo cazó nada

`--gate G4` **sí** lo caza —dice «`G4` exige `DONE`»— pero sólo cuando alguien abre esa compuerta.
`--all` no. Es lo que `INC-010` de la calculadora llama *«cada compuerta es una revisión
sorpresa»*.

### El contraste ya existe, y no necesita la rama

`PT-096` construyó `refDurableDe`: pregunta a git si `changes/<ID>-<slug>/` está en un ref. Eso
funciona para las **91**, incluidas las **58 sin rama declarada** — que es lo que hacía parecer
inviable la comprobación.

```
INTEGRATED con su directorio en main       91
INTEGRATED solo en «trabajo»                0
sin directorio en ninguno                   0
```

**Los 91 salen ciertos**, así que el arreglo **no abre deuda**. Se midió antes de diseñarlo, no
después.

## Complejidad — `FDGE-R04`

```
Complejidad: STANDARD
```

Una función de contraste, dos líneas en `avanzar`, una comprobación en `verify-fdge`, y su
batería. El mecanismo existe.

## Lo que NO establece

- **Cuántos de los 22 usos de `ESTADOS_TERMINALES` dependen de esto.** Seis en `verify-fdge` están
  contados; los de `tracker` y `patrones` no. `INC-011` lo declara sin medir y aquí tampoco: se
  arregla el **dato**, no cada consumidor.
- **Que las 91 sigan ciertas mañana.** Se midieron hoy — y el arreglo existe para que esa pregunta
  tenga respuesta mecánica en vez de una medición manual.
