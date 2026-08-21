# Discovery — `PT-096` · `PHASE 2-B`

> Qué · dónde · cuándo · cómo · por qué. La hipótesis de causa va **con su evidencia**
> (`INTAKE-R01`: nada se deduce del código sin medirlo).

---

## QUÉ

El cuerpo publicado de un issue no enlaza al directorio `changes/<ID>-<slug>/` de su tarea, y en
su lugar imprime una nota que se contradice a sí misma y contiene el literal `null`.

```
`changes/EP-019-…/` — en el repositorio, sin enlace: no hay ref durable que lo contenga
> El enlace apunta a `null`, que es donde el contenido existe ahora.
```

---

## DÓNDE

Un solo archivo, tres puntos, **un mismo supuesto**: que el fallo de un enlace es que **apunte
mal**. El de estos diez es que **no apunta**, y las tres ramas terminan en `continue`.

```
docs/methodology/tools/tracker.mjs

:470-475   cuerpoDeIssue
           } else {
             l.push(viva
               ? `> El enlace apunta a \`${ramaDelEnlace}\`, que es donde el contenido existe ahora. Al`
               : …);
           }
           ramaDelEnlace vale null en esta rama, y nada lo comprueba.

:1194      repararEnlacesMuertos
           const ref = refDeEnlace(publicado);
           if (!ref || refExiste(ref)) continue;
           «!ref» = el cuerpo NO enlaza  ->  se salta.

:208       compararEspejo
           if (ref && refExiste && refExiste(ref) === false) { …divergencia… }
           misma guarda: sin ref, no hay divergencia que reportar.
```

Y un cuarto punto, de otra familia pero del mismo cuerpo:

```
:367       const esLote = a?.type === 'EP';
:423       if (esLote && (tareas ?? []).length)  ->  «Tareas de este lote:»
```

---

## CUÁNDO

Medido sobre los 190 issues del tablero, `2026-08-21`:

```
                                        cuerpos
con la linea «Intake, criterios…»           114
SIN enlace                                   10   (+ #148, que es cuerpo de PR)
con el literal «null»                        10
con enlace /tree/ resoluble                  93
```

Los diez: `#160 #162 #163 #164 #165 #166 #167 #168 #169 #181`.

**La ventana cuadra al día.** `PT-079` cerró el `2026-08-19` midiendo *«ENLACES DEL TABLERO:
ANTES 20 de 40 rotos · DESPUÉS 0 de 85»*.

```
issues abiertos ANTES del 2026-08-19     92   enlazan
issues abiertos DESDE el 2026-08-19      11   ninguno enlazaba
                                              (#189 se curo al medir — ver «CÓMO», punto 4)
```

Once de once. No es una muestra: es la población entera.

---

## CÓMO — el mecanismo, paso a paso

**1 · En `PHASE 1` el contenido todavía no existe para git.**

`refDurableDe(a)` pregunta por `changes/<ID>-<slug>/` en dos sitios y en este orden:

```js
if (hay(integracion)) return integracion;                       // ¿esta en «trabajo»?
const sha = gitDe(['log','-1','--format=%H','--', dir]);        // ¿que commit lo contiene?
return sha || null;
```

En `PHASE 1` el `intake.md` **acaba de escribirse y no se ha commiteado**. No está en `trabajo` y
ningún commit lo contiene. Las dos preguntas devuelven vacío y el ref durable es `null`.

**No es un fallo de `refDurableDe`: la respuesta es correcta.** En ese instante, de verdad no hay
ref durable.

**2 · El cuerpo se escribe una vez, y se escribe entonces.**

`cuerpoDeIssue` se invoca al crear el issue. Después solo lo reescriben dos caminos:

```
sincronizarCuerpos()        recorre «vivas»          <- 2 de los 10
repararEnlacesMuertos()     recorre «terminadas»     <- 8 de los 10, y las SALTA por :1194
```

y los dos cuelgan de `cerrarPasada()`, que solo se alcanza desde `abrir()` y desde `indices()`.
**`espejo` no reescribe cuerpos**, y `espejo` es lo que corre en CI (`npm run verify:espejo`).

**3 · Nada lo reporta.**

```
$ node docs/methodology/tools/tracker.mjs espejo
  · 2 allocation(s) viva(s) y 2 issue(s) abierto(s): el espejo cuadra.
  Sin divergencias.
```

Con diez cuerpos rotos publicados. Y ningún verificador mira: `verify-fdge`, `verify-suite`,
`verify-qa` y `verify-ptsa` no contienen ninguna llamada que lea el cuerpo de un issue.

**4 · Que se cure es casualidad, y eso lo empeora.**

Al escribir este intake se ejecutó `tracker indices --aplicar` —el modo derivado de escribir la
línea de índice (`LEX-R12`)—. `indices()` termina en `cerrarPasada()`, así que `#189` se
resincronizó y, como para entonces su directorio **ya estaba en `trabajo`**, quedó con enlace.

Sanó porque coincidieron tres cosas: que estuviera viva, que su contenido ya estuviera en la rama
de integración, y que una acción que existe para escribir índices arrastre una resincronización.
**Ninguna de las tres la garantiza el marco.**

**5 · La secuencia decide el resultado, y nadie la fija.**

Contraste directo, en la misma sesión y con el mismo código:

```
EP-019 (#189)   se abrio el issue ANTES de commitear     -> ref durable null  -> sin enlace
PT-096 (#191)   se commiteo y empujo ANTES de abrir      -> ref durable 3454b2e -> ENLACE OK
```

El cuerpo de `#191` nació correcto:

```
[`changes/PT-096-…/`](https://github.com/a81Biz/cauce/tree/3454b2e8…/changes/PT-096-…)
> El enlace apunta a `3454b2e8…`, que es donde el contenido existe ahora.
```

**El defecto es tanto de secuencia como de lógica.** Y por eso un arreglo que solo reintente más
tarde deja una ventana en la que el issue está publicado y mudo, mientras que uno que solo exija
el commit antes vuelve a depender de que quien trabaja lo haga en ese orden.

---

## POR QUÉ · hipótesis de causa, con su evidencia

### Causa raíz

**`PT-079` sustituyó *«siempre un ref, a veces el equivocado»* por *«un ref durable, o ninguno»*,
que es lo correcto, y no escribió la continuación del «o ninguno».**

Evidencia:

- El cambio está en `HISTORY.log` `PT-079` y su comentario sigue en el archivo: *«Si no hay ref
  durable, no hay enlace»* (`tracker.mjs:396`).
- El respaldo anterior era *«`ramaTrabajo`, o `main`»* — que es **literalmente** lo que producía
  los 14 enlaces muertos. Retirarlo fue acertado.
- La ventana de regresión cuadra al día con el cierre de `PT-079` (§`CUÁNDO`).
- `repararEnlacesMuertos` —la respuesta de `PT-079` al caso durable— se escribió para el cuerpo
  con **enlace muerto** y su primera línea útil descarta el que **no enlaza**.

### Por qué no lo cazó ninguna prueba

`PT-079` midió `0 de 85` **después** de reparar, sobre issues **que ya existían**. El caso que
falla es el del issue **que todavía no existe**, y ese no estaba en la muestra: se crea después.
Es el mismo error de muestreo que el propio `PT-079` documenta sobre sí mismo —*«medí 0 de 17
sobre los issues VIVOS y lo escribí como si fuera el tablero»*—, cometido una vuelta más tarde.

### La cuarta cara, y por qué invierte el arreglo previsto

`esLote` es `a?.type === 'EP'` y el registro guarda **tres** valores para el mismo hecho:

```
EP        16    EP-001 … EP-016
ausente    2    EP-017 · EP-018
EPIC       1    EP-019
```

Los tres últimos lotes fallan la comparación, así que `#162` se publicó como `**PT** · severidad
—` y `#189` como `**EPIC** · severidad S1 · sin implementación asignada`.

**El arreglo evidente sería hacer que la lista aparezca. Sería un error, y lo dice la medición:**

```
issues de lote que HOY llevan «Tareas de este lote:» en prosa:  14
  #13 #17 #31 #34 #41 #48 #52 #53 #59 #71 #73 #89 #90 #91
```

`PT-035` existe exactamente para eso: *«una tarea es SUB-ISSUE de su lote, no un enlace en su
cuerpo»*, y su commit dice *«la plataforma la contaba en PROSA. Un enlace es texto: no da
progreso, no cierra en cascada y no sale en el árbol. Dos representaciones del mismo hecho…»*.
`SUITE-R51` lo eleva a regla `HARD`.

**`PT-035` añadió el anidamiento y no retiró la copia narrada.** Que `esLote` sea falso para los
tres últimos lotes ha estado **tapando** una violación de `SUITE-R51`, no causándola. El
anidamiento real funciona —`PT-096 #191 → sub-issue de EP-019 #189`, verificado en esta sesión—,
así que la lista en prosa es la segunda representación que sobra.

Dirección del arreglo, por tanto: **conservar la cabecera de lote y retirar la lista**.

Y el nombre canónico del `type` de un lote **no se elige aquí**: `LEXICON` no lo declara, y
elegirlo en el código sería inventar vocabulario (`LEX-R21`). Ver `context.md` §4.

---

## Complejidad — `FDGE-R04`

```
Complejidad: STANDARD
```

Un archivo de herramientas más su batería y su documentación. No toca el registro ni el modelo de
datos, no migra nada y no cambia ninguna regla: **hace cumplir `SUITE-R51`, que ya existe**. Lo
que impide llamarlo `TRIVIAL` es que el punto de secuencia admite dos soluciones con
consecuencias distintas y que la cabecera de lote depende de un hueco de `LEXICON`.

## Lo que este descubrimiento NO establece

- **Cuál de las dos soluciones de secuencia se adopta.** Es `PHASE 3`.
- **Que los 10 sean reparables.** Se mide en `PHASE 6`, con su denominador.
- **Que `asignar` sin `phase` entre aquí.** Se encontró ejecutando esta tarea, está declarado en
  `SESSION_LOG.md` con su excepción, y es de `L-1`.
