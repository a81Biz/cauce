# `PT-201` · `discovery.md` — dónde está el defecto, con archivo y línea

## 1. Los tres casos medidos, en un solo cierre

Cerrando `EP-025`, `npm run verify` dio **verde en local** y la CI falló **tres veces**. Las tres, la
CI tenía razón.

| # | Regla | Qué dijo la CI |
|:--|:---|:---|
| 1 | `SUITE-R34` | «Hubo trabajo en `changes/` después del último estado» |
| 2 | `SUITE-R34` | «El bloque `ESTADO` contradice al registro» |
| 3 | `SUITE-R51` | «publica la ruta SIN enlace y el contenido ya está en un ref durable» |

Y una cuarta, al abrir `EP-026`: otra vez `SUITE-R51`, sobre 19 issues.

## 2. La causa, con línea

```
docs/methodology/tools/verify-fdge.mjs:729-737
```

```js
const fecha = (ruta) => {
  const o = execFileSync('git', ['log', '-1', '--format=%ct', '--', ruta], …);
  return o ? Number(o) : 0;
};
const tEstado  = fecha('docs/implementation/HANDOFF.md');
const tTrabajo = fecha('changes');
```

**`git log` sólo ve commits.** Lo que hay en el árbol de trabajo es invisible para esta
comprobación. `npm run verify` corre sobre el **árbol de trabajo**; `SUITE-R34` mide el **árbol
commiteado**. Son dos objetos distintos, y nada lo dice.

`SUITE-R51` es el mismo patrón un paso más allá: el **ref durable** al que el issue debe enlazar no
existe hasta el `push`. En local no puede haberlo, así que la comprobación **sólo puede pasar**.

## 3. El inventario, medido

Reglas de `verify-fdge.mjs` cuyo veredicto depende de algo que el árbol de trabajo no contiene:

```
miran la HISTORIA de git   7   EXEC-R04 · EXEC-R04a · FDGE-R19 · FDGE-R55 · LEX-R26
                               SUITE-R34 · SUITE-R44
miran la PLATAFORMA        6   FDGE-R19 · FDGE-R45 · FDGE-R52 · FDGE-R55 · SUITE-R35 · SUITE-R43
                           --
distintas                 11
```

**La cifra es aproximada y se dice**: sale de asociar cada uso de `git log`/`rev-parse`/`show` o del
adaptador de plataforma con la primera regla que se cita después. No sustituye a comprobar una por
una — lo que establece es el **orden de magnitud**: no son una ni dos.

A ellas se suma el espejo (`tracker.mjs`), que compara registro contra issues y por tanto depende de
la red y de la rama por defecto.

## 4. Por qué esto NO contradice a `SUITE-R62`, y por eso es más difícil de ver

**La regla es `SUITE-R62`, no `SUITE-R01`.** Este intake la atribuyó mal y se corrige aquí:
`SUITE-R01` es *Evidence Before Action* y está declarada **no verificable**; `SUITE-R62` es la que
comprueba que *«lo que se ejecuta en local es lo que ejecuta CI»*, y es **una forma concreta de
`SUITE-R01` que no la agota** —lo dice ella misma—. `CLAUDE.md` cita `SUITE-R01` en su sección de
verificación, y de ahí venía la confusión.

`SUITE-R62` contrasta las dos listas **en los dos sentidos**: lo que falta en local **bloquea**, lo
que sobra **avisa**. **Y corren lo mismo**: eso lo garantiza y lo verifica.

Y ya declara un límite, con precisión:

> **Lo que NO establece** (`SUITE-R26`): que el paso **haga** lo mismo en los dos sitios. Se
> comparan **nombres de script**, que es lo comparable.

**Pero ése no es este límite.** `SUITE-R62` avisa de que dos pasos con el mismo nombre podrían hacer
cosas distintas. Lo que falta es lo contrario: **el mismo paso, haciendo exactamente lo mismo, mide
un objeto que en local todavía no existe**. Correr el mismo comando no basta cuando el hecho medido
nace al commitear o al publicar.

## 5. El agravante: un mensaje que afirma algo falso

`SUITE-R34` dijo *«Hubo trabajo en `changes/` después del último estado»* cuando el estado **sí**
estaba actualizado — sólo que sin commitear. Quien lo lea irá a actualizar un `HANDOFF` que ya está
al día.

Es la misma familia que `PT-198` y `PT-203`: la herramienta no distingue **el hecho** de **su
propia incapacidad de verlo**, y al fundirlos manda a quien lo lee al sitio equivocado.

## 6. Lo que NO está roto

- **Las once comprobaciones.** Miden lo correcto, y en CI —donde el árbol está commiteado y
  publicado— son exactas. El defecto no es lo que miden: es que **nada declara cuándo su verde no
  significa nada**.
- **`SUITE-R62`.** Su promesa es cierta y su comprobación funciona. Lo que falta es **este**
  límite, distinto del que ya declara.
