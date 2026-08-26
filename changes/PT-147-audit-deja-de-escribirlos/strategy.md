# PT-147 · `strategy.md` — `PHASE 3` Strategy

## 1. Objetivo

Que `audit.mjs` deje de escribir los componentes, que **los dos mapas colapsen en uno**, y que
`FPGE` y `FIDE` entren en la auditoría de fases — cada uno como lo que es.

## 2. Los dos mapas son uno, y el contrato ya lo tiene

```
PROMPTS    componente -> archivo de prompts      -> promptsDe()
esperadas  componente -> rango de fases          -> fasesDe()
```

Son **dos proyecciones del mismo hecho**, y `PT-144` dejó las dos funciones. Que hoy sean dos
objetos escritos a mano es lo que permitió que discreparan: `FPGE` en uno y no en el otro, `FIDE`
en ninguno.

**El bucle recorre `esperadas`**, así que lo que no esté ahí **no aparece**. No sale en rojo ni en
amarillo: no sale. Es la forma de fallo que este lote persigue.

## 3. `FIDE` y `FPGE` entran de forma distinta, y esa distinción es de `PT-144`

```
FIDE   LEXICON §3.5 declara PHASE 1-5      -> entra con su rango y SE AUDITA
FPGE   LEXICON §3 no tiene apartado        -> entra como SIN_EVALUAR y SE MUESTRA
```

**«No aparece» y «aparece como no evaluable» no son lo mismo**, y la diferencia es toda la tarea:
lo primero es un hueco invisible, lo segundo un hueco declarado (`RULE-06`).

Meterle a `FPGE` un rango inventado para que la tabla quedara simétrica **apagaría la comprobación
en silencio** — el defecto exacto que `EP-022` existe para quitar.

## 4. `RC-04` es lo que impide que el hueco vuelva

Meter a `FIDE` y `FPGE` arregla `FIDE` y `FPGE`. Lo que arregla **la clase** es que un componente
con rango en `LEXICON` al que `audit` no mire **se nombre**.

Sin eso, los dos entran hoy y el séptimo componente —`DICTAMEN`, `EP-023`— se queda fuera mañana
por el mismo mecanismo: alguien añade la entrada a un mapa y olvida el otro.

## 5. Alternativas evaluadas

| Alternativa | Por qué se rechaza |
|:---|:---|
| **Dejar `FPGE` fuera porque no tiene rango** | Es lo que hace hoy, y es el defecto. `SIN_EVALUAR` existe para esto. |
| **Inventarle un rango a `FPGE`** | Apaga la comprobación en silencio. `RULE-06`. |
| **Mantener los dos mapas y sincronizarlos** | Sincronizar a mano dos copias es lo que ya falló. |
| **Conservar el ternario de `:214` con un segundo caso** | Es lo que el contrato vino a quitar: una excepción codificada como condicional obliga a la siguiente a escribirse igual, al lado. |

## 6. Riesgos

| Riesgo | Mitigación |
|:---|:---|
| **Las cifras de los cuatro ya auditados cambian** | `RC-01`: comparación componente a componente, no del total |
| `FIDE` entra y sale **rojo** | **Es un hallazgo, no un fallo.** `scope.md` §8 lo declara `OUT`: se declara, no se corrige dentro de un `REFACTOR` |
| El mecanismo de `cubre` se toca sin querer | `RC-02`: reconoce tres formas de declarar una fase y no se toca |

## 7. Autorrevisión

```
Contradicciones con el intake:  ninguna. El intake ya declaraba los dos mapas y su
                                discrepancia — lo escribio PT-144 al corregir una frase
                                del agente que estaba mal.
Dependencias faltantes:         ninguna. PT-144, PT-150, PT-145 y PT-146 estan cerradas.
RULE-nn violadas:               ninguna. RULE-06 es la que gobierna el caso de FPGE.
AC no cubiertos:                ninguno.
Alcance que crecio:             RC-04 —la comprobacion que impide que el hueco vuelva—.
                                No estaba en el intake y no estira la tarea: es lo que la
                                separa de un parche.
```
