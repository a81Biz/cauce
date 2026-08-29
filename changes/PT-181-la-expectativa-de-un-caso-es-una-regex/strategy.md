# `PT-181` · `strategy.md` — el camino elegido, y los descartados con su porqué

## El camino: dos piezas

**1 · `chkl` y `chknol` — la expectativa LITERAL.** `grep -qF` en vez de `grep -q`. Un punto es un
punto.

```bash
chk    "nombre"  "^phase:"     comando     # regex, como hasta hoy
chkl   "nombre"  "regla.mjs"   comando     # literal: el punto es un punto
chknol "nombre"  "regla.mjs"   comando     # literal, negado
```

**2 · La corrida DECLARA cuántas expectativas parecen literales y se interpretan.** Igual que
`PT-199` declara las raíces que no puede derivar: la cifra deja de crecer a ciegas, y quien añada un
caso ve que existe la forma literal.

`chk` **no cambia**. Las 215 que usan metacaracteres a propósito siguen exactamente igual.

---

## Los caminos descartados

### 1 · Invertir el defecto: `chk` literal, `chkre` para regex

**Descartado: rompería 215 casos de golpe.** Es el cambio conceptualmente correcto —lo literal es
más frecuente y menos peligroso— pero una migración masiva que nadie puede revisar caso a caso, en
un arnés de 1401 aserciones, cambia lo que mide sin que nadie lo note. Queda anotado: si algún día
se reescribe el arnés, ésa es la salida limpia.

### 2 · Escapar las 96 a mano

**Descartado, y el intake ya lo declaraba.** 96 ediciones que nadie puede revisar una a una, y el
siguiente caso volvería a escribirse sin escapar porque **nada habría cambiado en el mecanismo**.
Arregla los síntomas de hoy y no la causa.

### 3 · Detectar y FALLAR sobre las ambiguas

**Descartado: pondría 96 casos en rojo sobre comportamiento correcto.** Ninguna de las 96 falla hoy
—el punto casa el punto real también—, así que convertirlas en error sería inventar un defecto donde
sólo hay un riesgo. Es lo que `PT-179` acaba de declarar: *«una compuerta que se pone roja sobre
comportamiento correcto enseña a saltársela»*.

### 4 · Avisar en cada caso ambiguo

**Descartado por ruido.** 96 avisos por corrida es exactamente lo que `PT-199` acaba de eliminar
—33 líneas que entrenaban a no leer la salida—. Se cuenta **una vez** y se dice **una vez**.

### 5 · Ampliar `SUITE-R59` para cubrir esto

**Descartado: son dos defectos distintos.** `SUITE-R59` cubre el patrón que **se rompe** —error de
sintaxis de `grep`—; éste **funciona y significa otra cosa**. Meterlos en una regla obligaría a que
su comprobación mezclara dos cosas que fallan de forma distinta.

---

## Lo que NO promete   `SUITE-R26`

**No promete que las 96 se revisen.** Muchas son inofensivas y alguna podría querer ser regex. Lo
que promete es que **exista la forma de decirlo** y que **la cifra sea visible**.

**Y la cifra es una heurística**, no una auditoría: punto entre alfanuméricos sin otros
metacaracteres. Se dice en `discovery.md §6`.

## La comprobación inversa

Con `chkl` puesto, una expectativa literal con `.` **no** debe casar un carácter cualquiera en su
lugar. Y `chk` con la misma expectativa **sí** debe casarlo — porque si las dos se comportan igual,
`chkl` no está haciendo nada.
