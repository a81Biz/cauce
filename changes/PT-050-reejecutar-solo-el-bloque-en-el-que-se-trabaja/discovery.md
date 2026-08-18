# PT-050 — Descubrimiento   `PHASE 2` · `2-B`

## Lo medido

```
bateria completa                      205 s   ·  536 casos
chk/chkno neutralizados (no-op)        92 s   ·  el fixture y el setup, solos
                                     ─────
las comprobaciones                    113 s   ·  55 %
```

La segunda cifra se obtuvo **ejecutando**: se generó una copia de `selftest.sh` con `chk` y
`chkno` convertidos en no-op —siguen contando, no comprueban nada— y se cronometró. Lo que queda
es lo que la batería gasta **antes** de comprobar nada.

## El hallazgo que decide el diseño

```
grep -c "^build_fixture" tools/selftest.sh   →   181
```

**El fixture sintético se reconstruye 181 veces**, y esas reconstrucciones son el 45 % del reloj.
No están agrupadas: van intercaladas con los casos, y casi siempre seguidas de una mutación que
las adapta al defecto que se va a inyectar:

```sh
# tools/selftest.sh:239-249
build_fixture; rm -rf "$WORK/graphify-out"
build_fixture; reg_set "r.allocations.push({id:'PT-009', …})"
build_fixture; perl -0pi -e 's/^Estructural: no\n//m' "$WORK/…/HISTORY.log"
```

**Consecuencia directa:** un `--solo` que filtre únicamente `chk`/`chkno` **no puede bajar de
92 s**, porque los 181 fixtures se siguen construyendo. El techo del ahorro es el 55 %, no el 95 %.

## Lo que costaría el otro 45 %, y por qué no es esta tarea

Saltarse los fixtures de los bloques no seleccionados exige que el bloque sea una **unidad que se
pueda no ejecutar**. Hoy no lo es: son sentencias sueltas en un script lineal de 2 400 líneas, y
`bash` no puede saltar sentencias sin envolverlas en funciones.

Convertir las diecinueve secciones en funciones es un refactor de todo el archivo — y `selftest.sh`
lo tocan **cinco** de las seis tareas de `EP-014`. Hacerlo aquí convertiría cada tarea posterior en
un conflicto.

Se mide, se dice, y **no se abre**: el firmante prohibió expandir el alcance de `EP-014`.

## Dónde está, con archivo y línea

```sh
# tools/selftest.sh:64-75   las dos puertas por las que pasa TODO caso
chk()   { local name="$1" pat="$2"; shift 2; local out; out="$("$@" 2>&1)"; … }
chkno() { local name="$1" pat="$2"; shift 2; local out; out="$("$@" 2>&1)"; … }

# tools/selftest.sh:~31   el filtro de argumentos que PT-049 acaba de crear
for _a in "$@"; do case "$_a" in -q|--quiet) QUIET=1 ;; *) …POS="$_a" ;; esac; done
```

**`PT-049` dejó la puerta abierta.** El bucle que separa `-q` de los posicionales ya existe, así
que `--solo` no tiene que inventar el parseo: se añade una rama. Es el efecto de haber puesto esa
tarea primera, y se nota aquí.

Y `chk`/`chkno` son **las dos únicas puertas** por las que pasa cualquier caso: filtrar ahí cubre
los 453 sin tocar ninguno.

## El riesgo que la medida hace visible

Un subconjunto que **parece** la batería es peor que no tener subconjunto. Si `--solo "compuerta"`
imprime «OK · 12 casos» sin decir de cuántos, la siguiente lectura de esa salida —en una evidencia,
en un PR— dirá que la batería pasó.

Es el defecto que `PT-002` corrigió con otro nombre: una cifra sin denominador. Por eso `AC-02`
exige **cuántos de cuántos**, y no es un adorno.

## Lo que NO es el defecto

No es que la batería sea lenta. 205 s para 536 casos que construyen 181 proyectos sintéticos
completos es razonable. El defecto es que **no hay forma de pedir menos** cuando se está iterando
sobre seis casos, y eso obliga a pagarlo entero quince veces en una sesión.

---

## CORRECCIÓN — lo que este descubrimiento afirmó y era falso

> Escrito en `PHASE 5`, al ejecutar el filtro. No se reescribe lo de arriba: se corrige debajo,
> como `FDGE-R29` admite para el ledger. Una medida equivocada que desaparece no enseña nada.

**Este documento afirmó que `chk` y `chkno` son «las dos únicas puertas» por las que pasa
cualquier caso.** Es falso, y lo dijo ejecutarlo: con el filtro puesto, **83 casos seguían
corriendo**.

```
453  chk / chkno
 82  trlib / trlibno        ← la tercera y la cuarta puerta
  1  escrito a mano, con su propio if/pass/bad
────
536
```

El caso escrito a mano —`build-core sin fuentes ⇒ mensaje claro`— no solo puenteaba el filtro:
puenteaba **`revento()`**, así que llevaba desde que se escribió sin la protección que el arnés da
a todos los demás. **Un caso que se salta el arnés se salta todo lo que el arnés protege.**

La cifra que delató el error fue exacta: `536 − 453 = 83`. La misma en las dos ejecuciones, con y
sin patrón — que es lo que hizo evidente que el filtro no filtraba, en vez de que filtrara mal.

**Y la segunda corrección, del techo del ahorro:**

```
balance de EP-013     «≈99 %»    estimado sin medir
strategy.md            55 %      medido, pero con trlib ejecutandose en el aislamiento
medido de verdad       34 %      209 s → 138 s
```

La estimación del 55 % salió de cronometrar una copia con `chk`/`chkno` en no-op — pero
`trlib`/`trlibno` **seguían ejecutándose** en esa medida, así que no era el suelo. El suelo real
son las 181 reconstrucciones del fixture.

**Tres estimaciones, cada una más cerca, y ninguna acertó hasta ejecutar la definitiva.**
