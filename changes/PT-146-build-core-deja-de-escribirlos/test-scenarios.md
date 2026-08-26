# PT-146 · `test-scenarios.md` — `PHASE 4` Proposal

## TS-01 · `AC-02` — `CORE.md` y `CORE-PTSA.md` **byte a byte**

```
DADO   CORE.md y CORE-PTSA.md tal como estan hoy
CUANDO se ejecuta build-core --check tras CADA uno de los cuatro pasos
ENTONCES «sincronizado» las cuatro veces
```
**Es la barra entera de la tarea**, y se mide en cada paso, no al final. Un `CORE.md` degradado no
falla: deja al agente operando con menos reglas de las que cree tener — y este archivo documenta
que hubo un momento en que `[START PTSA]` auditaba con el **29 %** de su propio ruleset.

## TS-02 · `AC-01` — las diez familias declaran su etiqueta, y coincide con la de hoy

```
DADO   el mapa label de build-core:184 tal como esta hoy
CUANDO se compara con el campo «etiqueta» de FAMILIAS
ENTONCES coinciden las diez, cadena a cadena
```
**Se lee del archivo, no se copia al test.** Es la lección de `RC-03` en `PT-144`, y la que
destapó el sitio quince.

## TS-03 · `AC-01` — romper una etiqueta hace fallar el verificador

```
CUANDO se le quita la etiqueta a una familia
ENTONCES verify-patrones falla POR ASERCION, y NOMBRA la familia
```
`RULE-02`. Por aserción, no por excepción: un caso que espera un crash pide certificar un
verificador muerto, y el arnés lo invalida.

## TS-04 · `RC-02` — el orden de emisión no cambia

```
CUANDO se compara ordenDePrefijos() con el «order» de hoy
ENTONCES misma secuencia, EN EL MISMO ORDEN
```
Ya existe como aserción desde `PT-144`; aquí se cobra, porque `order` gobierna en qué secuencia
salen las secciones de `CORE.md`.

## TS-05 · `RC-03` — las tres que no salen de `RULES.md` siguen tratándose aparte

```
DADO   que LEX vive en LEXICON.md, EXEC en EXECUTION-MODES.md y PTSA en su especificacion
CUANDO se ejecuta build-core
ENTONCES cada una se recoge LEYENDO SU ARCHIVO, no la prosa de RULES.md
   Y     familiasEnProsa() sigue devolviendo SIETE, sin LEX, EXEC ni PTSA
```
Es lo que explicaba la discrepancia 7-vs-10 y lo que `PT-144` puso en el campo `documento`.
Colapsar las cuatro llamadas en un bucle rompería esto, y por eso está `OUT`.

## TS-06 · `RC-04` — los triggers derivados son los del contrato

```
DADO   el bloque de triggers del CORE.md generado
CUANDO se comparan sus [START …] con triggers()
ENTONCES coinciden
   Y     las operaciones de LEX-R16 —resume, status, delta, promote, audit— SIGUEN
         estando, como texto
```
La segunda mitad es la que declara el límite: el bloque queda **mitad derivado, mitad literal**, y
el caso lo fija para que nadie lo «arregle» por accidente creyendo que falta.

---

| AC | TS |
|:---|:---|
| AC-01 | TS-02 · TS-03 · TS-06 |
| AC-02 | TS-01 |
| RC-02 | TS-04 |
| RC-03 | TS-05 |
| RC-04 | TS-06 |
