# Descubrimiento — `PT-121`   `PHASE 2`

> Qué se midió, con qué comando, y qué salió.

---

## 1 · El hueco, medido cerrando `EP-019`

`PHASE 9` manda, literal: *«tras el merge: tag si aplica · borrar rama · **PT→INTEGRATED** ·
**intake.md CLOSED**»*.

**Ningún comando lo hacía.** Se escribía **a mano en dos sitios** —el registro y el YAML del
intake— y por eso divergían: cerrando `EP-019`, el estado terminal se quedó en la rama de tarea y
`main` declaró el lote `DRAFT` con sus **diecisiete** tareas en `DONE` durante todo el ciclo de
publicación.

Es `CE-006` —el acto hecho fuera del comando— por la única razón que lo hace inevitable: **no
había comando**. Y `CE-009`, porque el estado terminal acababa escrito a mano.

## 2 · Y el gemelo, por el otro extremo

```
$ node docs/methodology/tools/tracker.mjs avanzar EP-020 --a 2 --nota x
el intake de EP-020 no declara «phase»: no se puede sincronizar (SUITE-R08).
```

`avanzar` se niega sobre un lote, **y hace bien**: `SUITE-R08` exime a los `EP` de declarar
`phase`, porque un lote no tiene fases de tarea. Pero eso deja el otro extremo igual de huérfano:
**al pasar `G1`, un lote debe quedar `READY` y también había que escribirlo a mano.**

## 3 · Las tres partes son el mismo hueco visto desde tres sitios

No hay comando (`AC-01`, `AC-05`), no hay rama declarada (`AC-02`), no hay fase que lo nombre
(`AC-03`). Partirlas dejaría a cada una sin la evidencia de las otras.

## 4 · Los tags: el intake nació de una medición falsa, y consta

El intake afirmaba que faltaban tags. **Es falso, y el error fue de medición**: `git tag -l | tail -5`
ordena **lexicográficamente**, así que `v10`, `v11` y `v12` quedan *antes* de `v4.13.0` y el final
de la lista da `v9.0.0`. Se leyó el final del alfabeto y se llamó «el último tag».

Derivado bien:

```
$ git tag -l 'v*' --sort=-v:refname | head -4
v12.0.0 v11.0.0 v10.0.0 v9.0.0
```

`AC-04` quedó **retirado** por eso. Lo que sobrevive es `AC-06`: que `sellar` **compruebe** los
tags en vez de suponerlos.

## 5 · Qué comprobaba `sellar`, medido

Ya derivaba el anterior con `--sort=-v:refname` —correcto— y lo publicaba. **No comprobaba** dos
cosas:

- que el tag anterior **resuelva** a un commit. Un nombre en la lista no lo prueba, y «lo sellado»
  se calcula sobre **su árbol**: sin árbol, es `SIN EVALUAR`.
- que el tag de la versión que va a sellarse **todavía no exista** — que es lo normal, porque
  crearlo es el paso 8, humano y **después** del merge.

---

## Conclusión

**El viaje de vuelta tiene comando**: `tracker integrar` escribe `DONE -> INTEGRATED` en el
registro **y** en el YAML, en un solo acto y con lo reversible primero. Su gemelo,
`tracker firmar`, escribe el estado que produce `G1`, contrastando la firma contra la lista
(`SUITE-R27`).

**`FDGE-R19` declara la forma de rama del trabajo de lote** —la de tarea, con el `type` del
propio lote— **y dice por qué**: inventar un cuarto nivel para un acto que ocurre una vez por lote
añadiría vocabulario que la forma existente ya cubre.

**`PHASES.md` y `FDGE-Prompts.md` declaran dónde ocurre**, con su artefacto y su salida.

Y **`sellar` comprueba los dos tags** en vez de suponerlos.
