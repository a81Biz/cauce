# `PT-156` · `design.md` — `PHASE 4`

## 1. La tabla de `LEXICON` §3.6

| PHASE | Nombre | Compuerta |
|:--|:---|:---|
| 1 | Compuertas de freshness y confianza | — |
| 2 | Recolección de evidencia | — (solo lectura) |
| 3 | Síntesis de candidatos | — |
| 4 | Cálculo de Priority | — |
| 5 | Orden y desempates | — |
| 6 | Emisión | — |
| 7 | **Stop — decisión humana** | **decisión humana** (`FPGE-R04`) |

Los siete nombres salen **literalmente** de `FPGE-Implementation.md:52-114`. No se inventa
ninguno, no se funde ninguno, no se añade ninguno.

`PHASE 7` es la única fase de la suite cuyo desenlace es **no hacer nada**. Se marca como
compuerta porque lo es: `FPGE-R04` la declara decisión humana.

## 2. El contrato

```js
fases: [1, 7],
```

con el comentario que explica **por qué estuvo `SIN_EVALUAR`** —no por olvido, sino porque no
había fases— para que nadie lo lea como un descuido de `PT-144`.

## 3. La aserción, volteada

```js
const fFPGE = fasesDe('FPGE');
if (!Array.isArray(fFPGE) || fFPGE[0] !== 1 || fFPGE[1] !== 7) { … }
```

Queda idéntica en forma a la de `FIDE` y la de `PTSA`. **Antes exigía lo contrario** —que el
dato NO existiera— y estaba bien mientras no existía: `RULE-06` dice que lo que no se puede
comprobar se declara no evaluable, y esa aserción defendía la declaración. Al aparecer el dato,
la misma aserción pasa a defender que **no vuelva** a declararse desconocido.

## 4. El mapa de fases de `CORE`

```
FPGE  1 Compuertas · 2 Evidencia · 3 Candidatos · 4 Priority · 5 Orden · 6 Emisión
      7 Stop◆ — ordena y se DETIENE: promover es humano (FPGE-R04)
```

Entra por hallazgo, no por plan: la línea anterior tenía **seis** pasos y terminaba en
«promote», que es lo que `FPGE-R04` prohíbe. Que ese bloque esté **escrito a mano** para los
cinco componentes es `PT-165`.

## 5. Lo que este diseño NO resuelve

El bloque de fases de `build-core` sigue tecleado. `FIDE` sigue sin aparecer en él pese a tener
`fases: [1, 5]`. Y `LEXICON` §2 sigue sin nombrar la grafía `[n]` entre los prohibidos, así que
el mismo error puede repetirse en el próximo componente. Los tres se declaran, no se arreglan
aquí (`SUITE-R26`).
