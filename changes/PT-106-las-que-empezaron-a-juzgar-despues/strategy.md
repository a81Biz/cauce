# Estrategia — `PT-106`

## La decisión

**A-1 · Se deriva del árbol, y solo para las que lo necesitan.**

Dos mitades, y la segunda es la que casi se pierde:

1. **Las veinte** que empezaron a emitir después del primer commit declaran su `RIGE_DESDE`, con
   la versión que el proyecto tenía en ese commit.
2. **Las ciento veinticinco restantes no llevan nada**, y eso es una decisión, no una omisión.

### Alternativas descartadas

| | Por qué no |
|:---|:---|
| **Las 151, como decía el reparto** | 125 serían restricciones **inventadas** |
| **Derivar del `CHANGELOG`** | medido: 2 de cada 10 falsas, y en silencio |
| **Escribirlas a mano** | veinte cifras a ojo es exactamente lo que este lote persigue |
| **Ponerla a todas las que emiten** | las 38 del primer commit no tienen nada anterior que juzgar |

## Por qué la mitad de la tarea es no tocar

Una regla que existe desde el primer commit del repositorio **no puede haber juzgado mal nada**:
no hay trabajo anterior a ella. Darle un `RIGE_DESDE` diría «antes de esta versión no regía», y
eso es **falso**: regía desde siempre.

Por eso hay **dos casos que comprueban la ausencia** y una retirada que devuelve el valor
equivocado para ver que se caza.

## Termina cuando

Las veinte declaran su versión real, las demás no llevan nada, ninguna cifra sale del
`CHANGELOG`, y la batería falla sin el arreglo.
