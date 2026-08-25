# `PT-145` · autorrevisión — `PHASE 6` Evidence

## 1. Lo medido

| Qué | Antes | Después |
|:---|:---|:---|
| Literales de componente en `verify-suite.mjs` | **7** | **0** |
| Literales en `comparar-marco.mjs` | **1** | **0** |
| Prefijos que ve `:716` | **8** | **10** |
| Salida de `verify-suite` sobre el árbol | — | **idéntica**, `diff` vacío |
| Salida de `comparar-marco` | — | **idéntica** |
| `selftest` | 1711 | **1715** casos |
| `npm run verify` | — | `EXIT=0` |

## 2. Se comprobó qué destapaba `:716` **antes** de cerrarlo

El agujero era real: la comprobación que guarda `EXEC-R08` llevaba ocho prefijos, así que una
celda de la matriz de compuertas que citara `FPGE-Rnn` o `FIDE-Rnn` **pasaba en verde**.

Medido sobre el árbol real antes de tocarlo: **la matriz no cita hoy ninguna de las dos**. El
agujero existía y **no estaba siendo explotado**.

Se cierra igual, y conviene decir por qué: **una comprobación que sólo funciona mientras nadie
escriba lo que no debe no es una comprobación.** El caso permanente lo prueba con tres citas
—`SUITE`, que ya se cazaba; `FPGE` y `FIDE`, que no— más una que **no** debe cazarse, para que el
patrón no pase por laxo.

## 3. Cuatro pasos atómicos, y no fue ceremonia

`FDGE-R54` dio **`MARGINAL`** —no hay ningún `REFACTOR` cerrado con el que comparar el coste, así
que no aprueba por omisión ni prohíbe sin evidencia— y `PHASES` lo traduce a trabajo atómico con
checkpoint.

Sirvió en el paso 2: `comparar-marco` era la única herramienta del lote **sin una sola arista** a
`patrones.mjs`, y hacerlo solo, con un archivo tocado, dejó claro que el import funcionaba antes
de tocar los otros siete sitios.

## 4. Se rechazó una constante compartida, y el motivo estaba ya escrito en el repositorio

Los cinco usos de `verify-suite` mezclan `/g` con sin banderas. `verify-patrones.mjs:38` ya
documenta que *«un regex con `/g` conserva `lastIndex` entre llamadas: reutilizarlo daría
resultados que dependen del orden»*.

Por eso el contrato expone **funciones que devuelven un patrón nuevo**, no constantes. Y `:289`
recibe la alternancia **como texto**, porque compone su propio patrón alrededor: darle un `RegExp`
le obligaría a deshacerlo.

## 5. Dos errores míos, de la misma familia

**5.1 · El heredoc se comió las barras invertidas.** El primer intento de sustituir los seis
sitios usó un heredoc con los patrones literales dentro, y las secuencias `\b` y `\d` se
degradaron: la sustitución no encontró nada.

Es **exactamente el fallo del que avisa `SUITE-R59`** —«el escape que no existe no se rompe»— y
que este repositorio ha medido ocho veces. Se rehizo con el script en un archivo y las barras
construidas con `chr(92)`, sin escribir ninguna. **Y volvió a ocurrir** al escribir esta misma
evidencia con un heredoc: dos veces en una tarea.

**5.2 · El fixture pasaba por una razón ajena.** El caso de `EXEC-R08` copiaba sólo los `*.md` de
la metodología, sin las subcarpetas. `verify-suite` ahogaba la salida en enlaces rotos y truncaba
antes de llegar a la comprobación: **tres casos daban rojo por el motivo equivocado**.

Es la misma clase que `PT-150` cometió afirmando sobre el identificador en vez de sobre el
mensaje, y que `PT-144` cometió con el caso que esperaba un `SyntaxError`. **Tercera instancia en
tres tareas**: una comprobación que pasa —o falla— por el motivo equivocado no es una
comprobación.

Corregido copiando el árbol entero, y el comentario del fixture lo dice.

## 6. Lo que esta tarea deja para las siguientes

- **`PT-146`** tiene la barra más alta del lote: `CORE.md` byte a byte idéntico.
- **`PT-147`** hereda el hallazgo de que `audit` tiene **dos** mapas por componente que discrepan,
  y `FPGE`/`FIDE` entran en la auditoría de fases por primera vez.
- El contrato de `PT-144` lleva ya **tres consumidores** —`PT-150` y las dos herramientas de
  ésta— y **no ha hecho falta cambiarlo ni una vez**. Era lo que `PT-144` no podía establecer por
  sí misma.
