# `PT-203` · self-review

## Lo que se sostiene

- **`AC` verificados: 3, ninguno huérfano.** Seis casos sobre seis escenarios.
- **El defecto era el doble de grande, y la mitad grande nadie la veía.** Medido sobre los 26 lotes
  **antes** de escribir el arreglo: 7 `FANTASMA` (se comprobaba a quien no es miembro) y **62
  `INVISIBLE`** (es miembro y su firma no se comprobaba **nunca**). `EP-019` leía **cero** de sus
  diecisiete; `EP-024`, cuatro de veintiocho.
- **`INTAKE-R08` es `HARD` y bloquea**, y llevaba desde `EP-001` corriendo sobre una fracción de sus
  sujetos. Lo que no cubría no daba error: no daba **nada**. Es `CE-005` en la forma más grande
  medida en este lote, y sale justo del criterio de éxito de `EP-026`.
- **La causa se ataca, no el síntoma.** `PT-011` y `PT-022` estrecharon la **heurística de lectura**
  del intake; un tercer recorte habría arreglado los 7 y dejado los 62. `SUITE-R08` ya dice quién
  asigna, y `allocations[].epic` lo tiene escrito para las 229.

## El riesgo se midió **antes**, no después

Derivar del registro hace que una regla `HARD` empiece a cubrir 62 sujetos nuevos. Eso puede
bloquear el lote entero, así que se contó primero:

```
firma de lote correcta      : 173
SIN linea de firma de lote  :  23      firma con OTRO lote : 1 (PT-172)
```

Y sobre el árbol real, ya con el arreglo puesto:

```
! INTAKE-R08  EP-024: 18 tarea(s) TERMINAL(es) sin la linea … NO se retrofechan (SUITE-R09, CE-014)
! INTAKE-R08  EP-025:  6 tarea(s) TERMINAL(es) …
! INTAKE-R08  EP-008:  1 tarea(s) TERMINAL(es) …
! INTAKE-R08  EP-025:  1 intake(s) firman por OTRO lote: PT-172 (dice EP-024)
```

**Nada bloquea, y nada se calla.** Lo terminal se cuenta y se nombra; lo vivo sigue en rojo. Es lo
que este repositorio ya hace con `EXEC-R03` y `LEX-R27`, con el precedente citado en la salida de
la propia herramienta.

## `PT-172` es un hallazgo que la tarea destapa y no tapa

Su intake dice `Firmado por lote: EP-024` y el registro dice `EP-025`. **Nadie lo veía**, porque
`RE_SIGN_BATCH` capturaba el lote y lo **tiraba** mientras el mensaje lo **nombraba** — la
comprobación afirmaba más de lo que miraba. Es exactamente lo que `PT-198` cerró ayer en otra línea,
y cabe aquí porque es la misma línea de código que este `AC` toca.

## El alcance creció, y se declaró en vez de colarse

Los `AC` del intake son tres y ninguno habla de certificar nada. Al implementar `AC-02`,
`INTAKE-R08` empezó a cubrir 62 tareas nuevas y **26 no cumplen**: el arreglo correcto introducía,
por su propia corrección, **26 avisos permanentes sin dueño**. Un aviso que nadie puede resolver es
una compuerta que enseña a ignorarse.

El agente **midió, reportó la cifra y se detuvo**. El `VoBo` del `2026-08-28` cubre `G1`, `G2` y
`G3` de `EP-026` y no cubría certificar trabajo de lotes anteriores. La decisión es del firmante y
está citada en [`spec-changes.md`](../../../changes/PT-203-citar-un-PT-en-una-fila-lo-hace-miembro-del-lote/spec-changes.md).

Lo que entró de más —`FIRMAS-DE-LOTE.md`, su lectura en `INTAKE-R08` e `INTAKE-R09`, y `EP-027`
abierta— tiene **seis casos propios** y no se cuelga de ningún `AC` existente. Los tres límites que
prueban que certificar no es silenciar: lo **vivo** no se exime, una fila **sin firmante** no es una
firma, y certificar a otra **no cubre a ésta**.

## Un `CE-017` que salió por el camino

`INTAKE-R09` bloqueaba el intake de `EP-027` por **citar** `PT-032` y `PT-171` — las dos tareas sin
carpeta que ese lote existe para arreglar. La comprobación acusaba a quien documenta el hecho, y la
única salida habría sido **no nombrar la deuda**, que es perder justo la trazabilidad que este marco
compra. Ahora `INTAKE-R09` honra la certificación, y sólo a quien está escrito en la lista cerrada.

## La poda que el cambio obliga   `SUITE-R61`

Derivar del registro cambió por diseño el hecho que cuatro casos de la sección `lotes` fijaban.
`SUITE-R61` pide publicar la cuenta **por patrón**, aunque sea cero:

| Patrón | Cuántos | Cuáles |
|:---|---:|:---|
| **superado** — el hecho cambió por diseño | 4 | `citar un PT en prosa…` · `ni siquiera al de al lado` · `el de la tabla sí exige su firma` · `sin tabla, respaldo al barrido completo` |
| **invertido** — sólo pasa mientras existe el defecto | 0 | — |
| **hueco** — perdió su premisa y se queda en verde | 0 | — |

**Ninguno se retira: los cuatro se repuntan**, porque lo que miden —que citar no afilia y que el
miembro real sí se exige— sigue siendo cierto y sigue importando. El cuarto cambia de nombre:
`sin tabla, respaldo al barrido completo` → `sin tabla, el registro sigue mandando`, porque el
respaldo que nombraba **ya no existe**.

**Y habrían quedado en «hueco» si no se toca el fixture.** Su `REGISTRY.json` no mencionaba el
lote, así que `EP-001` se quedaba **sin miembros** y las comprobaciones pasaban sin medir nada.
Eso es exactamente el patrón que `SUITE-R61` persigue porque **no se delata solo**: la corrida por
sección daba verde. **Lo destapó la corrida completa**, no la lectura — la lección de `PT-192`,
otra vez.

## Dos errores míos en la poda, y los dos los cazó ejecutar

1. **El `perl` insertaba `epic` dentro del objeto anidado.** `("id":"PT-001"[^}]*)` se paraba en la
   llave de cierre de `viabilidad`, así que el campo caía dentro de él. Se inserta justo detrás del
   `id`.
2. **El `chkno` miraba toda la salida.** El mensaje **correcto** nombra la cita en verde
   —«identificador(es) citado(s) que NO son miembros»—, así que buscar `PT-003` en la salida entera
   fallaba **por encontrarlo donde debe estar**. Se mira la línea que **reclama**, y se añade el
   caso que impide que eso pase por vacío.

## Lo que NO se hace, y consta   `SUITE-R26`

- **Las 26 no se corrigen: se certifican.** Ponerles la línea hoy sería reescribir trabajo cerrado
  para callar una comprobación (`SUITE-R09` es append-only, `CE-014`). Corregirlas es **`EP-027`**,
  abierta con intake y **sin `G1`**: la autorización del firmante cubre **abrirla**, no admitirla.
  Y siguen dichas con nombre y dueño en cada corrida.
- **`INTAKE-R09` sigue leyendo la tabla.** «Lista `PT-NNN` y no existe su carpeta» es una
  comprobación sobre lo que el intake **declara**, y ése es su sitio. Lo que cambia es de dónde sale
  la **pertenencia**.
- **No se promete que la tabla y el registro coincidan.** Citar de dónde salió una tarea sigue
  siendo legítimo — es lo que `FDGE-R55` premia — y ahora sale nombrado en verde.
- **El respaldo de `PT-011` se retira.** Existía «para no dejar de comprobar en silencio los intakes
  escritos antes de que la plantilla tuviera tabla». El razonamiento era correcto **y no funcionó**:
  `EP-019` tiene filas, así que el respaldo nunca entró y sus diecisiete quedaron sin comprobar
  igual. Derivar del registro lo hace innecesario.

## Lo que pasó DESPUÉS de `PHASE 8`, y que también consta

Este documento se escribió con la tarea en `PHASE 6`. Después, en la misma rama, ocurrieron cuatro
cosas que ningún artefacto recogía — y dejarlas fuera era el defecto que este lote persigue:

1. **`SUITE-R34` bloqueó el CI, con razón.** Escribí el análisis de `PT-194`, `PT-195`, `PT-202` y
   `PT-187` y tres paradas, todo en `changes/`, **después** del último sello del `HANDOFF`. Es la
   lección `-16` y la incumplí yo.
2. **Al arreglarlo apareció el hueco que lo hace fácil de incumplir**: `avanzar` es el **único** que
   estampa el estado, y sólo al cambiar de fase. El sello se puso **a mano** para desbloquear el PR
   y **se declara** —`HANDOFF -30`—, con el valor derivado que `avanzar` habría escrito. El hueco es
   `PT-205`.
3. **Tres paradas abiertas, ninguna buscada** (`FDGE-R55`): `EP-028` (el coste de la verificación),
   `PT-204` (124 de 244 reglas que nada ejecuta) y `PT-205`.
4. **Dos intakes desmentidos por medir**: `publicar.yml` **no viaja** (`PT-202`), y las cifras de
   versiones de `PT-187` eran tres y son siete, cero y veintiocho.

El detalle completo está en la continuación de la entrada de `HISTORY.log`, añadida y no editada
(`SUITE-R09`).

## Sin bloqueadores
