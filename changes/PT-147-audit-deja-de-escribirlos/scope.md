# PT-147 · `scope.md` — `PHASE 2` Analysis (`2-R`)

## 1. Qué cambia internamente

```
audit.mjs  192-195   PROMPTS    = { FDGE, Foundation, QA, PTSA, FPGE }      5 componentes
           197-202   esperadas  = { FDGE, Foundation, QA, PTSA }            4 componentes
           214       const sigla = comp === 'Foundation' ? 'FND' : comp
           341       refs: ['PTSA/PTSA-V3-Especificacion-Oficial.md', 'PTSA/PTSA-Prompts.md']
```

## 2. Los dos mapas discrepan, y eso es el hallazgo

De los seis componentes:

| | `PROMPTS` | `esperadas` | Consecuencia |
|:---|:---:|:---:|:---|
| FDGE · Foundation · QA · PTSA | sí | sí | sus fases se auditan |
| **`FPGE`** | sí | **no** | tiene prompts declarados y **nadie audita sus fases** |
| **`FIDE`** | **no** | **no** | invisible a la auditoría de fases, entera |

**Dos de los seis componentes no tienen auditadas sus fases, y nunca lo dijeron.** El bucle
recorre `Object.entries(esperadas)`, así que lo que no esté en ese objeto **no aparece** — no sale
en rojo, ni en amarillo: no sale.

Es el mismo patrón que `verify-qa.mjs:7` registra para las reglas —«dos componentes enteros en
cero: `QA` 0/19 y `FPGE` 0/10»— repetido sobre las **fases** y sobre otros dos componentes.

## 3. `:214` es la evidencia más limpia del lote entero

```js
const sigla = comp === 'Foundation' ? 'FND' : comp;
```

No es una lista repetida: es **una excepción codificada como condicional**. `PT-144` la usó como
caso de prueba del diseño del contrato —si `sigla` no fuera un campo, este ternario tendría que
seguir existiendo, escrito en otro sitio— y aquí se cobra.

**Y `audit` mezcla dos vocabularios sin declararlo**: usa la **sigla** como clave (`QA`, no
`FQAGE`) salvo para `Foundation`, al que llama por su **nombre**. Por eso necesita el ternario
sólo para uno. El contrato separa `nombre` de `sigla`, así que cada consumidor pide el que
necesita **sin cambiar ninguna clave**.

## 4. Qué NO debe cambiar

```
No cambia — las cifras de los CUATRO componentes ya auditados. Es la barra.
No cambia — el mecanismo de «cubre»: como se reconoce una fase en un documento
            —PHASE n suelta, rango PHASE a-b, o linea compacta de componente— no se toca.
No cambia — LEXICON. Si FPGE no declara rango, el contrato dice SIN_EVALUAR y audit lo
            MUESTRA; escribir el apartado es PT-f de EP-024.
```

## 5. Qué **sí** cambia, y es el objetivo

```
FPGE y FIDE ENTRAN en la auditoria de fases.
```

Y entran de forma distinta, porque `PT-144` midió que **no son el mismo caso**:

- **`FIDE`** tiene su rango declarado en `LEXICON` §3.5 (`1-5`). Entra con su rango y **se audita
  de verdad**. Puede salir en rojo: sería un hallazgo, no un fallo de la tarea.
- **`FPGE`** no tiene apartado en `LEXICON` §3. Entra como **`SIN_EVALUAR`** y `audit` lo
  **muestra** en vez de omitirlo. Un rango inventado apagaría la comprobación en silencio
  (`RULE-06`).

**La diferencia entre «no aparece» y «aparece como no evaluable» es toda la tarea.** Lo primero es
un hueco invisible; lo segundo es un hueco declarado.

## 6. Barra de calidad

| Métrica | Actual | Objetivo | Cómo |
|:---|:---|:---|:---|
| Literales de componente en `audit.mjs` | **4** | **0** | `grep` |
| Componentes en la auditoría de fases | **4** | **6** | el informe los nombra |
| Cifras de los cuatro ya auditados | — | **iguales** | ejecución antes/después |
| Mapas por componente | **2** | **1** | lectura |

## 7. Riesgo de regresión

```
RC-01  Las cifras de los CUATRO ya auditados no cambian.
       Test: npm run audit antes/despues, componente a componente.

RC-02  «cubre» sigue reconociendo las tres formas de declarar una fase.
       Test: los casos que ya existen en selftest.

RC-03  FIDE y FPGE aparecen, y de forma DISTINTA: uno con rango, otro SIN_EVALUAR.
       Test: NUEVO — y es el que hace la tarea.

RC-04  Un componente con rango en LEXICON que audit no mire se NOMBRA.
       Test: NUEVO — es lo que impide que el hueco vuelva. Sin el, FIDE y FPGE
       entran hoy y el septimo componente se queda fuera manana.
```

**`RC-04` es el que convierte esto en trabajo y no en un parche.** Meter a `FIDE` y `FPGE` arregla
`FIDE` y `FPGE`; la comprobación arregla **la clase**.

## 8. Out of scope

```
OUT: corregir lo que la auditoria de FIDE o FPGE destape. Que aparezcan es el objetivo;
     que salgan limpios NO lo es. Si salen rojos, se declara.
OUT: escribir el apartado de FPGE en LEXICON §3. Es PT-f de EP-024, y hacerlo desde una
     herramienta es la direccion que LEX-R21 prohibe.
OUT: cambiar el mecanismo de «cubre». Reconoce tres formas y funciona.
OUT: unificar las claves de audit entre nombre y sigla. El contrato separa los dos y cada
     consumidor pide el que necesita; cambiar las claves seria un cambio de comportamiento.
```

## 9. Complejidad

```
Complejidad: STANDARD
```

Cuatro sitios, dos mapas que colapsan en uno, y **un cambio de comportamiento deliberado** —dos
componentes entran en una auditoría donde no estaban—. `FDGE-R54` dio `MARGINAL` por lo mismo que
en `PT-145` y `PT-146`: sigue sin haber un `REFACTOR` cerrado con el que comparar. Trabajo atómico
con checkpoint.
