# `PT-156` · `strategy.md` — `PHASE 3`

## El orden no es preferencia: es forzoso

```
1. FPGE-Implementation + FPGE-Prompts   →  PHASE n en los dos, a la vez
2. LEXICON §3.6                         →  la tabla, con ESOS nombres
3. patrones.mjs                         →  fases: [1, 7]
4. verify-patrones                      →  la aserción se voltea
5. build-core + CORE.md                 →  regenerar y LEER el diff
```

**Empezar por `LEXICON` habría sido escribir una afirmación sin respaldo.** El apartado declara
un rango de fases; si los documentos operativos siguen numerando `[1]`..`[7]`, no hay fases que
el apartado esté declarando. Sería el defecto que da nombre a `PT-147` —dos mapas que
discrepan— cometido para arreglar otro.

**Y los dos documentos operativos van juntos, en el mismo paso.** Cambiar sólo uno deja la
suite con dos numeraciones vivas sobre el mismo recorrido, que es exactamente lo que `LEX-R01`
existe para impedir.

## Alternativa descartada

**Escribir el apartado con los `[n]` tal cual, como «pasos» en vez de fases.** Habría cerrado
el hueco de `audit` sin tocar nada más. Se descarta: `LEXICON` §2 dice que `PHASE` es la
**única** palabra admitida para un paso de cualquier flujo de la suite. Declarar un componente
con «pasos» en el documento que prohíbe los pasos es derogar una regla desde su propio dueño.

## Lo que este orden hizo aparecer

Nada de esto estaba previsto, y los tres salieron de **ejecutar el orden**, no de leerlo:

- `verify-patrones` tenía la aserción **al revés por diseño** — exigía que el dato NO existiera.
- `build-core` publicaba `FPGE ... → promote`, contra `FPGE-R04`. → `PT-165`
- `RULES.md:94` citaba `retomada` con dos IDs distintos en la misma regla. → `PT-164`
