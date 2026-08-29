# `PT-181` · self-review

## Lo que se sostiene

- **`AC` verificados: 3, ninguno huérfano.** Cinco casos ejecutables.
- **`AC-02` tiene sus dos mitades, y hacían falta las dos.** Que `chkl` **no** case lo cumple un
  `chkl` roto que no case nunca. La mitad que prueba algo es que `chk`, con la **misma**
  expectativa, **sí** casa: `"regla.mjs"` encuentra `reglaXmjs`. Sin ese segundo caso, `chkl`
  podría ser un alias de `chk` y los tres `AC` seguirían en verde.
- **`chk` no cambia.** Las 215 expectativas con metacaracteres a propósito siguen exactamente igual,
  y la corrida completa —1400+ casos que usan `chk`— es la evidencia de que no se rompió nada.
- **Convenciones** (`11-Conventions.md`): sin `debug`, sin restos.

## Lo que se descartó, y por qué importa decirlo

**Invertir el defecto** —`chk` literal, `chkre` para regex— es el cambio conceptualmente correcto:
lo literal es más frecuente y menos peligroso. Se descartó porque **rompería 215 casos de golpe** en
un arnés de 1401 aserciones, y una migración que nadie puede revisar caso a caso cambia lo que mide
sin que nadie lo note. Queda anotado en `strategy.md §1` por si algún día se reescribe el arnés.

**Detectar y fallar sobre las 96** se descartó por lo que `PT-179` acaba de dejar escrito: ninguna
falla hoy —el punto casa el punto real también—, así que convertirlas en error sería inventar un
defecto donde sólo hay un riesgo, y *«una compuerta que se pone roja sobre comportamiento correcto
enseña a saltársela»*.

**Avisar en cada caso ambiguo** se descartó por ruido: 96 avisos por corrida es exactamente lo que
`PT-199` acaba de eliminar. Se cuenta una vez y se dice una vez.

## Lo que NO se cubre, y consta   `SUITE-R26`

- **Las 96 no se migran ni se auditan.** Lo que esta tarea entrega es la **forma** de decir literal
  y la **cifra visible**. Migrarlas es otro trabajo y el intake ya lo declaraba.
- **La cifra es una heurística**, no una auditoría: punto entre alfanuméricos sin otros
  metacaracteres. Puede marcar alguna que quisiera ser regex —`"### 24.2"` podría serlo— y
  escapársele otra. Establece el orden de magnitud, y así se dice en `discovery.md §6`.

## Una diferencia con la cifra del intake, y se explica

El intake citaba **303 de 1476** —la medida original de `PT-183`— y hoy son **215 de 1401** con
metacaracteres, de las que **96** son ambiguas. Las cifras no son comparables: aquélla contaba
cualquier metacarácter; ésta separa los que están **a propósito** de los que no. No se corrige la
antigua —`SUITE-R09`, y era correcta para lo que medía—: se dice qué mide cada una.

## Sin bloqueadores
