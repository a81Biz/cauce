# PT-144 · `strategy.md` — `PHASE 3` Strategy

> `PHASE 3` decide **cómo**, con al menos una alternativa evaluada y las rechazadas con motivo
> (`PHASES`). No crea la Proposal ni toca código.

## 1. Objetivo

Que la lista de componentes de la suite tenga **una sola definición, con contrato**, en
`tools/patrones.mjs` — sin que ninguna herramienta cambie todavía de comportamiento.

Derivado de los `AC` de `scope.md` §8, no de la descripción del problema.

## 2. La decisión de diseño que importa: qué forma tiene el contrato

Los catorce sitios no consultan el mismo dato. Consultan **seis proyecciones distintas** del
mismo hecho:

```
verify-suite  x5   una alternancia de PREFIJOS para construir regex
verify-suite  x1   un Set de los OPCIONALES
comparar-marco x1  el mismo Set de OPCIONALES
build-core    x1   las FAMILIAS cuyas reglas se recogen de la prosa de RULES.md   (7 entradas)
build-core    x1   el ORDEN de emision de los prefijos                            (10 entradas)
build-core    x1   los TRIGGERS
audit         x1   el mapa componente -> archivo de PROMPTS                       (5 entradas)
audit         x1   el mapa componente -> RANGO DE FASES                           (4 entradas)
audit         x1   la SIGLA, via ternario
audit         x1   las REFS de PTSA
```

**Las tres cifras del margen derecho son el hallazgo del lote**: 7, 10, 5 y 4 entradas para seis
componentes. Ninguna lista coincide con otra, y **ninguna dice por qué**.

### Solución elegida — una tabla de componentes, más funciones que la proyectan

```
COMPONENTES     un objeto por componente, con los ocho campos de scope.md §1.
                Es EL HECHO.

proyecciones    funciones puras que derivan cada una de las seis vistas de arriba:
                prefijos()   opcionales()   familias()   ordenDePrefijos()
                triggers()   fasesDe()      siglaDe()
                Son EL USO, y cada una declara por que incluye o excluye a quien excluye.
```

**Por qué esta forma y no un objeto plano que cada herramienta filtre a su gusto:** porque
entonces el criterio de exclusión —por qué `build-core:171` tiene siete entradas y `:183` diez—
seguiría viviendo **en la herramienta**, escrito como un filtro. Habríamos movido el literal sin
mover la decisión, y el lote se llamaría «los componentes se declaran» sin declarar lo que de
verdad diverge.

La diferencia entre `:171` y `:183` es explicable: `LEX`, `EXEC` y `PTSA` no tienen sus reglas en
`RULES.md` —viven en `LEXICON`, `EXECUTION-MODES` y la especificación de PTSA— así que no se
recogen de su prosa, pero sí se ordenan al emitir. **Eso es un campo del contrato**, no un filtro
en `build-core`. Y `LEX` y `EXEC` no son componentes: son familias de reglas, lo que obliga a que
el contrato distinga **componente** de **familia de reglas**, con los seis primeros siendo ambas
cosas y `LEX`/`EXEC` solo lo segundo.

**Esa distinción es el resultado de esta fase**, y no estaba en el intake.

## 3. Alternativas evaluadas

| Alternativa | Por qué se rechaza |
|:---|:---|
| **Un `Set` de nombres y nada más** | No sostiene `Foundation → FND`, ni el rango de fases, ni los opcionales. Obligaría a mantener cuatro estructuras paralelas — que es el estado actual con otro nombre. |
| **Un `.json` de datos junto a `patrones.mjs`** | Un `.json` no puede llevar comentario de contrato, y en este módulo **el porqué de cada valor es la mitad del valor**. `RULE-04` (cero dependencias) no lo impide, pero perderíamos la trazabilidad que el resto del archivo tiene. |
| **Derivarlo de `LEXICON.md` en tiempo de ejecución** | Tentador —`LEXICON` es la fuente (`LEX-R21`)— y **rechazado por `RULE-02`**: si el parseo se degrada, la lista sale vacía y todas las comprobaciones pasan en verde. Sería sustituir catorce literales por un único punto de fallo silencioso. El contrato **cita** de dónde sale cada valor en su comentario; no lo parsea. |
| **Objeto plano, cada herramienta filtra** | Mueve el literal y deja la decisión. Ver §2. |

La tercera es la que más costó descartar y la que mejor explica el diseño: **`LEXICON` manda sobre
el dato, pero un verificador no puede depender de parsear prosa para saber qué tiene que
verificar.**

## 4. Dependencias y restricciones

```
Depende de:     nada. Es la primera tarea del lote y su radio de impacto es cero.
Le depende:     PT-150, PT-145, PT-146, PT-147 — cinco tareas.
Restricciones:  RULE-01  el contrato ES la aplicacion de esta regla
                RULE-02  romper un campo tiene que HACER FALLAR verify-patrones
                RULE-04  cero dependencias: JS plano, sin paquetes
                RULE-06  un rango de fases que LEXICON no declare se dice, no se inventa
                SUITE-R38 un hecho con una definicion y su contrato
                SUITE-R59 nada de escapes escritos a mano al construir patrones
```

## 5. Riesgos

| Riesgo | Mitigación |
|:---|:---|
| **El contrato diverge de los catorce literales** y `PT-145`..`PT-147` se convierten en cambios de comportamiento disfrazados de refactor | `RC-03`: comparación mecánica campo a campo, en rojo antes de implementar |
| El rango de fases de `FPGE` y `FIDE` | **Medido en esta fase, y los dos casos son distintos** — ver §5.1 |
| El contrato crece hasta describir reglas o fases | `scope.md` §7, y es verificable: si aparece un campo que no sale de los catorce sitios, se salió |
| «Componente» y «familia de reglas» se confunden | §2 los separa explícitamente; `LEX` y `EXEC` son la prueba |

### 5.1 El rango de fases: se fue a mirar, y los dos casos no son el mismo

`LEXICON` §3 —«Mapa de fases por componente»— tiene **cinco** apartados para **seis**
componentes:

```
3.1 FDGE         PHASE 0-10     declarado
3.2 FQAGE        PHASE 1-7      declarado
3.3 PTSA         PHASE 0-14     declarado
3.4 Foundation   PHASE 0-6      declarado
3.5 FIDE         PHASE 1-5      declarado
--- FPGE         NO EXISTE el apartado
```

Cruzado con los dos mapas de `audit.mjs`, el resultado es:

| | `LEXICON` §3 | `audit` `esperadas` | Qué significa |
|:---|:---|:---|:---|
| `FIDE` | **1-5, declarado** | ausente | El dato **existe** y `audit` no lo mira. El contrato lo lleva, y `PT-147` empieza a auditarlo |
| `FPGE` | **no declarado** | ausente | El dato **no existe**. El contrato dice `SIN EVALUAR` (`RULE-06`) |

**No son el mismo caso y no se resuelven igual.** Meter a `FPGE` un rango inventado para que la
tabla quede simétrica sería apagar una comprobación en silencio — el defecto exacto que este lote
existe para quitar. Y dejar a `FIDE` fuera «porque `FPGE` tampoco está» sería perder un dato que
`LEXICON` ya declara.

`LEXICON` §3 sin apartado para `FPGE` es un hueco de la metodología, **no de esta tarea**: se
declara, se lleva como `SIN EVALUAR`, y si merece trabajo entra como tarea propia. No se arregla
aquí (`scope.md` §7).

## 6. Criterios de éxito

Los `AC-01`..`AC-05` de `scope.md` §8. **Ninguno se añade aquí**: `PHASE 3` decide el cómo, no
amplía el qué.

## 7. Autorrevisión

```
Contradicciones con el intake:        ninguna. §2 PRECISA el intake (componente vs familia
                                      de reglas) — es material nuevo, no contrario.
Dependencias faltantes:               ninguna.
RULE-nn violadas:                     ninguna. La alternativa que habria violado RULE-02
                                      —parsear LEXICON— se rechazo por eso.
AC no cubiertos por la estrategia:    ninguno. AC-01/02 los cubre COMPONENTES; AC-03 las
                                      aserciones; AC-04 el hecho de no tocar consumidores;
                                      AC-05 el comentario de contrato.
Alcance que crecio en esta fase:      la distincion componente/familia. Cabe dentro de los
                                      catorce sitios medidos —sale de build-core:171 vs
                                      :183— asi que NO es alcance nuevo: es alcance que el
                                      intake no habia visto todavia.
```
