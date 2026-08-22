# Descubrimiento — `PT-106`

## La medición, en orden

```
152  reglas HARD en RULES.md
 87  no emiten en ninguna herramienta  -> no pueden juzgar
 65  emiten
   7  ya declaran RIGE_DESDE
  58  candidatas
  38  su emision existe desde el PRIMER COMMIT (7ef06b42, 2026-08-12)
  20  su emision llego DESPUES          <- estas
```

## Por qué el `CHANGELOG` no sirve, con la prueba

El `CHANGELOG` tiene 41 entradas de versión y nombra 166 reglas: parece la fuente natural. Se
contrastó contra las diez filas ya escritas a mano:

```
seis   IGUAL
dos    DISCREPAN     EXEC-R04   consta 8.1.0   rige 11.0.0
                     SUITE-R09  consta 4.13.0  rige 11.0.0
dos    NO DERIVABLES  LEX-R08 y SUITE-R58 entran con esta version
```

**Dos de cada diez.** Y no habría fallado nada: habría quedado escrito, y sería mentira.

La razón es semántica: el `CHANGELOG` registra cuándo se **redactó** una regla. `RIGE_DESDE`
dice desde cuándo **juzga**, y eso es cuando apareció su **comprobación** — que puede llegar años
después, o nunca.

## De dónde sí sale

Del árbol:

```
git log -S "'SUITE-R46'" --reverse -- docs/methodology/tools/   -> f0de9489
git show f0de9489:package.json                                  -> 7.0.0
```

Cada fila trazable a su `sha`. Ninguna cifra inventada.

## Lo que este descubrimiento NO establece

- **Si las reglas de `PTSA` necesitan lo mismo.** Numeración y verificador aparte.
- **Que las 87 que no emiten deban emitir.** Es otra pregunta —la cobertura mecánica, que `audit`
  ya mide— y no esta.
