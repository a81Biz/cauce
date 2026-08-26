# PT-145 · `test-scenarios.md` — `PHASE 4` Proposal

## TS-01 · `AC-02` — los patrones construidos casan los **diez** prefijos

```
DADO   un texto con SUITE-R01 LEX-R01 EXEC-R01 FND-R01 FDGE-R01
       INTAKE-R01 QA-R01 PTSA-R01 FPGE-R01 FIDE-R01
CUANDO se aplica reglaRE()
ENTONCES casa los DIEZ
```
**Ejecutado, no leído.** `SUITE-R59`: un escape degradado no revienta, **casa de menos** — y en un
verificador de reglas, casar de menos es dejar de ver reglas.

## TS-02 · `AC-02` — y rechazan lo que no es una regla

```
CUANDO se aplica reglaRE() a «XYZ-R01»
ENTONCES no casa
CUANDO se aplica a «SUITE-R» sin numero
ENTONCES no casa
```
Sin esto, un patrón demasiado laxo pasa por bueno (`verify-patrones` lo exige de todos).

## TS-03 · `AC-02` — cada uso recibe un patrón **nuevo**

```
DADO   reglaRE('g'), que conserva lastIndex entre llamadas
CUANDO se usa dos veces seguidas sobre el mismo texto
ENTONCES el segundo uso da el MISMO resultado que el primero
```
`verify-patrones.mjs:33` ya documenta que reutilizar un `/g` da resultados que dependen del orden.

## TS-04 · `AC-04` — `comparar-marco` da la misma salida

```
DADO   su salida sobre el arbol real ANTES del cambio
CUANDO se ejecuta despues
ENTONCES es identica
```

## TS-05 · `AC-04` — `verify-suite` da la misma salida en los seis sitios que no cambian

```
DADO   su salida ANTES
CUANDO se ejecuta tras PT-145.3
ENTONCES es identica, byte a byte
```

## TS-06 · `AC-01` — no queda ningún literal

```
CUANDO se busca cualquiera de los diez prefijos o 'FIDE' en los dos archivos
ENTONCES cero apariciones como literal de lista
```

## TS-07 · `AC-03` — `:708` ve los diez, y lo prueba una cita que hoy se escapa

```
DADO   una matriz de compuertas de prueba cuya celda cita «FPGE-R05»
CUANDO se ejecuta verify-suite
ENTONCES FALLA citando EXEC-R08
   Y     HOY no falla — le faltan FPGE y FIDE
```
**Es el escenario que reproduce el agujero**, y el único de esta tarea que cambia comportamiento.

## TS-08 · `RC-03` — el criterio de los opcionales se conserva

```
DADO   un arbol sin el directorio FIDE/ entero
CUANDO se ejecuta verify-suite
ENTONCES no lo cuenta como enlace roto
DADO   un arbol con FIDE/ pero sin uno de sus archivos
ENTONCES SI lo cuenta
```
Es el criterio «deliberadamente estrecho» que documenta `verify-suite.mjs:418`, y el que la tarea
tiene que preservar exactamente.

---

| AC | TS |
|:---|:---|
| AC-01 | TS-06 |
| AC-02 | TS-01 · TS-02 · TS-03 |
| AC-03 | TS-07 |
| AC-04 | TS-04 · TS-05 |
