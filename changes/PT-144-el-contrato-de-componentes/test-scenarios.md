# PT-144 · `test-scenarios.md` — `PHASE 4` Proposal

> Cada `TS-nn` cita su `AC` (`FDGE-R15`). Los de contrato se escriben **en rojo** antes de
> implementar (`FDGE-R17`), y su rojo es la evidencia de que la comprobación puede fallar
> (`RULE-02`).

## TS-01 · `AC-01` — el contrato existe y está completo

```
DADO   patrones.mjs
CUANDO se importan COMPONENTES y FAMILIAS
ENTONCES COMPONENTES tiene exactamente 6 entradas
   Y     cada una lleva los 8 campos, ninguno undefined
   Y     FAMILIAS tiene exactamente 10 entradas
   Y     cada una lleva prefijo, documento y orden
```
Rojo hoy: los dos exports no existen.

## TS-02 · `AC-02` — `familiasEnProsa()` reproduce `build-core:171`

```
DADO   el literal ['SUITE','FND','FDGE','INTAKE','QA','FPGE','FIDE']
CUANDO se llama familiasEnProsa()
ENTONCES devuelve EXACTAMENTE esas 7, en cualquier orden
   Y     NO incluye LEX, EXEC ni PTSA
```
El «no incluye» es la mitad que importa: sin él, una función que devolviera las diez pasaría.

## TS-03 · `AC-02` — `ordenDePrefijos()` reproduce `build-core:183`

```
DADO   el literal ['SUITE','LEX','EXEC','FND','FDGE','INTAKE','QA','PTSA','FPGE','FIDE']
CUANDO se llama ordenDePrefijos()
ENTONCES devuelve esa misma secuencia, EN EL MISMO ORDEN
```
Aquí el orden **sí** es parte del contrato: `CORE.md` se emite con él, y `AC-04` exige que el
generado salga idéntico.

## TS-04 · `AC-02` — `opcionales()` reproduce los dos `Set(['FIDE'])`

```
DADO   verify-suite.mjs:425 y comparar-marco.mjs:39
CUANDO se llama opcionales()
ENTONCES devuelve un Set con FIDE y solo FIDE
```

## TS-05 · `AC-02` — `prefijos()` reproduce la alternancia de los cinco sitios

```
DADO   (SUITE|LEX|FDGE|INTAKE|QA|PTSA|FPGE|FND|FIDE|EXEC)
CUANDO se construye la alternancia desde prefijos()
ENTONCES contiene los mismos 10 prefijos, sin faltar ni sobrar ninguno
   Y     se construye SIN una sola barra invertida escrita a mano  [SUITE-R59]
```

## TS-06 · `AC-02` — `siglaDe()` cubre el caso irregular

```
DADO   audit.mjs:214, que hoy es un ternario
CUANDO se llama siglaDe('Foundation')
ENTONCES devuelve 'FND'
   Y     siglaDe('FDGE') devuelve 'FDGE'
   Y     siglaDe('FQAGE') devuelve 'QA'      <- LEX-R03, el caso que el ternario no tenia
```

## TS-07 · `AC-02` — `fasesDe()` distingue no-declarado de rango

```
CUANDO se llama fasesDe('FIDE')
ENTONCES devuelve [1, 5]                     <- LEXICON 3.5 SI lo declara
CUANDO se llama fasesDe('FPGE')
ENTONCES devuelve SIN_EVALUAR                <- LEXICON no tiene apartado para FPGE
   Y     NO devuelve un rango, ni [] , ni null
```
**Este es el escenario que más fácil se falsea.** Un `[]` haría que `PT-147` auditara cero fases
de `FPGE` y saliera en verde — apagar la comprobación en silencio, que es el defecto del lote.

## TS-08 · `AC-03` — romper el contrato HACE FALLAR

```
DADO   el contrato completo y verify-patrones en verde
CUANDO se le quita la sigla a Foundation
ENTONCES verify-patrones sale 1 y NOMBRA el componente y el campo
CUANDO se repite el orden de dos familias
ENTONCES verify-patrones sale 1
CUANDO se le pone a FPGE un rango inventado
ENTONCES verify-patrones sale 1
```
`RULE-02` en su forma ejecutable. Sin `TS-08`, `TS-01`..`TS-07` se cumplen hoy y divergen mañana.

## TS-09 · `AC-04` — nada cambió

```
DADO   npm run verify EXIT=0 y selftest OK 1695 casos, medido antes de tocar nada
CUANDO se ejecuta despues del cambio
ENTONCES EXIT=0
   Y     el recuento de casos NO baja
   Y     build-core --check no reporta diferencia en CORE.md ni CORE-PTSA.md
```

## TS-10 · `AC-05` — cada valor dice de dónde sale

```
DADO   COMPONENTES y FAMILIAS
CUANDO se lee su comentario de contrato
ENTONCES cada campo cita el documento del que procede
   Y     ninguno cita LEXICON.md como algo que se PARSEA en runtime  [design.md 5]
```

---

## Mapa `AC` → `TS`

| AC | TS |
|:---|:---|
| AC-01 | TS-01 |
| AC-02 | TS-02 · TS-03 · TS-04 · TS-05 · TS-06 · TS-07 |
| AC-03 | TS-08 |
| AC-04 | TS-09 |
| AC-05 | TS-10 |

Ningún `AC` sin `TS`, ningún `TS` sin `AC`.
