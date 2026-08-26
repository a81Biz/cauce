# `PT-149` · autorrevisión — `PHASE 6` Evidence

## 1. Lo medido

| Qué | |
|:---|:---|
| Herramientas que veían el componente **sin tocarlas** | **1 de 4** |
| Fijaciones que impedían el alta | **6** — dos en `COMPONENTES`, cuatro en `FAMILIAS` |
| Pasos reales del alta | **6**, y `E5` declaraba **uno** |
| `selftest` | 1736 → **1747** casos, cero rojos |
| Rastros de `Zeta` en el árbol real tras la batería | **0** |
| `CORE.md` | **263** reglas, sin cambio · gana la línea de `FIDE`, que faltaba |

## 2. El criterio de éxito del lote no se cumplía

`PT-144`..`PT-148` construyeron el contrato y **escribieron** el procedimiento. Esta tarea empieza
**ejecutándolo**, y esa decisión produjo todo lo demás: leer `E5` no dice que sea falso; dar de
alta un componente, sí, en el primer intento.

`E5` declaraba dos cosas y **las dos eran falsas**:

> *«Entrada: añadir su entrada a `COMPONENTES`»* · *«Fin: `npm run verify` en verde»*

```
verify-suite      SÍ lo ve — deriva la alternancia. Es lo que PT-145 construyó
audit             APARENTEMENTE — da por cubiertas sus fases en dos documentos
                  donde no aparece NI UNA VEZ            → PT-168
build-core        NO — «Zeta», «ZTA» y «[START ZETA]»: CERO veces en CORE.md
verify-patrones   NO — seis fijaciones, y sólo dos se veían venir
```

## 3. La corrección tiene dirección, y eso es lo que la separa de un apagado

Las seis fijaciones eran **correctas como retrato de hoy y falsas como contrato**: convertían el
alta en una edición de herramienta, que es literalmente lo que `E5` declara defecto y no paso.

**El contrato puede crecer y no puede encoger.** Pero cada una necesitó preguntarse *qué protegía
de verdad*, porque no era lo mismo en las cuatro de `FAMILIAS`:

| Aserción | Lo que se conserva |
|:---|:---|
| `fams.length` | que no falte ninguna de las diez |
| `prefijos()` | que ninguno desaparezca: si desaparece, **sus reglas se vuelven invisibles y todo pasa en verde por no mirarlas** |
| `familiasEnProsa()` | **por qué** son siete: `LEX`, `EXEC` y `PTSA` fuera, porque sus reglas no viven en `RULES.md`. En los dos sentidos |
| `ordenDePrefijos()` | el **orden relativo** — `CORE.md` se emite con él |

**`ordenDePrefijos()` es el que más fácil habría sido estropear.** Cambiar «igual a la lista» por
«contiene la lista» habría dejado de comprobar el orden. Se comprueba la **subsecuencia** de las
diez conocidas: admite una familia nueva, no admite un reordenamiento. Y hay un caso permanente
que lo fija.

## 4. El paso que no decía nadie

**`prefijos()` sale de `FAMILIAS`, no de `COMPONENTES`.** Un componente con reglas propias necesita
entrada en **las dos** listas. Es `LEX-R36` hecho operación — la distinción que `PT-148` escribió
como vocabulario, aquí convertida en un paso obligatorio del alta que ni `E5` ni mi propia
corrección de ayer mencionaban.

Sin esa entrada, las reglas del componente son **invisibles al verificador**: el defecto exacto que
abrió `EP-022`, reproducido por la vía de dar de alta un componente siguiendo el manual.

## 5. Dos errores míos, y los dos los cazó la batería

**5.1 · Escribí el fixture tocando sólo el contrato**, que es lo que `AC-01` pedía y lo que yo
mismo había medido como falso horas antes. Tres de los seis rojos de la primera pasada son mis
propias comprobaciones cazándolo — incluida, palabra por palabra, la que escribí ayer en `PT-156`:
*«un rango sin documento del que salir es un rango INVENTADO»*.

**5.2 · Di por roja la batería final por el código de salida.** El comando terminaba en
`grep -c "✗"`, que devuelve `1` cuando la cuenta es **cero**. El arnés reportó fallo sobre una
batería **en verde**. Es la misma familia que el error que este repositorio ya tiene medido —leer
el `exit` de una tubería como si fuera el del verificador— por el otro extremo, y se resolvió como
entonces: **mirando el archivo, no el código**.

## 6. Lo que esta tarea NO establece

- Que el componente de prueba **funcione**. No tiene fases reales, ni prompts, ni especificación.
  Se prueba el **alta y la baja**, no el componente.
- Que `audit` audite de verdad las fases. Da por cubierta una fase si el **número** aparece en
  cualquier sitio del documento → **`PT-168`**, `S1`.
- Que `E5` esté completo **ahora**. Se corrigió dos veces en esta misma tarea, y la segunda salió
  de ejecutarlo otra vez. Lo que sí está es **comprobado**: los once casos fallan si deja de serlo.
