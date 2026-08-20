# PT-074 — Descubrimiento   `PHASE 2-B`

## Lo que ya se arregló, y lo que queda

`PT-075` creó `FDGE-R54`: la viabilidad se consulta y **consta** antes de `G2`. Eso cerró la
mitad del problema — la fase existe y el verificador la exige.

`PT-068` cerró la otra causa: el veredicto se calculaba contra la sesión huérfana.

**Queda que se vea.** El firmante lo pidió tres veces —«sigo sin ver el cálculo de la sesión»— y
tenía razón cada vez:

```
$ gh issue view 137 --json body
**BUG** · severidad S1 · de la implementación `EP-017`
Intake, criterios de aceptación y evidencia: [changes/PT-075-…]
```

El veredicto está en `REGISTRY.allocations[].viabilidad` y **no aparece**. Desde la plataforma
es invisible.

## Por qué es un defecto y no una omisión cosmética

`SUITE-R35` dice: **el registro asigna, la plataforma espeja**. El veredicto de viabilidad es
estado del registro —lo escribe `tracker viabilidad --registrar`— y no se espeja. Es la misma
regla que obliga a que el estado, la fase y el lote aparezcan en el issue.

Y hay una consecuencia práctica: el issue es *«lo que está abierto, consultable sin leer el
repositorio entero»*. Un veredicto `MARGINAL` que obliga a trabajo atómico, o un `UNSAFE` que
detiene, son exactamente lo que alguien necesita saber **sin abrir el repositorio**.

## Los quince veredictos hay que rehacerlos

Se registraron el 2026-08-19 con `medido_en: 258be16` — la sesión huérfana, antes de `PT-068`.
La base ya es correcta, así que los quince valores están medidos contra algo que ya no es lo
que se lee.

**El campo `medido_en` existe precisamente para esto**: deja constancia de contra qué se midió
cada registro, así que rehacerlos no borra la historia, la corrige con su fecha.

## Lo que NO hay que rehacer

La fase, la regla y el verificador. `FDGE-R54` está escrita, citada en `PHASE 4` y en el prompt
de `G2`, y `verify-fdge` la exige. `AC-01` y `AC-05` de esta tarea se comprueban contra lo que
`PT-075` ya dejó hecho — y por eso el caso que los cubre **ya existe** y pasa.
