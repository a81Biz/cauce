# PT-147 · `test-scenarios.md` — `PHASE 4` Proposal

## TS-01 · `AC-02` — las cifras de los cuatro ya auditados no cambian

```
DADO   npm run audit ANTES, componente a componente
CUANDO se ejecuta despues
ENTONCES FDGE, Foundation, QA y PTSA dan las MISMAS cifras
```
El **total sí cambia** —entran dos componentes— así que compararlo sería medir lo que no es.

## TS-02 · `AC-03` — `FIDE` entra con su rango y se audita

```
DADO   que LEXICON §3.5 declara PHASE 1-5 para FIDE
CUANDO se ejecuta audit
ENTONCES FIDE aparece en la auditoria de fases
   Y     con rango 1-5, no como no evaluable
```

## TS-03 · `AC-03` — `FPGE` aparece como **`SIN_EVALUAR`**, no omitido

```
CUANDO se ejecuta audit
ENTONCES FPGE APARECE
   Y     dice que LEXICON no declara su rango
   Y     NO sale con un rango inventado
   Y     NO se omite
```
**Es el escenario central.** «No aparece» es indistinguible de «está bien»; `SIN_EVALUAR` dice
exactamente lo que se sabe y lo que no.

## TS-04 · `AC-01` — el ternario desaparece

```
CUANDO se busca «=== 'Foundation' ?» en audit.mjs
ENTONCES cero apariciones
   Y     el informe sigue usando FND para las reglas de Foundation
```

## TS-05 · `AC-04` — un componente con rango al que `audit` no mire **falla**

```
DADO   un componente ficticio con rango declarado y ausente del recorrido
CUANDO se ejecuta la comprobacion
ENTONCES FALLA y lo NOMBRA
```
`RULE-02`. Es lo que impide que el hueco vuelva con el séptimo componente.

## TS-06 · `RC-02` — `cubre` sigue reconociendo las tres formas

```
DADO   «PHASE 3 » suelta, «PHASE 2-4» como rango, y la linea compacta «FND 0 Recon · 1 …»
CUANDO se evalua cada una
ENTONCES las tres cuentan
```
El mecanismo no se toca; el escenario lo fija.

---

| AC | TS |
|:---|:---|
| AC-01 | TS-04 |
| AC-02 | TS-01 |
| AC-03 | TS-02 · TS-03 |
| AC-04 | TS-05 |
| RC-02 | TS-06 |
