# PT-150 — `SEVERIDADES` vive en `tracker.mjs` y contradice a `LEXICON` en los dos extremos

> Tarea dentro de la implementación abierta `EP-022` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-150
type: BUG
epic: EP-022
track: STANDARD
status: DRAFT
phase: 6
created: 2026-08-24
structural: no
suite_version: 13.1.0
origin: DIRECT
---
```

## 1. Comportamiento esperado   `[HUMANO]`

`LEXICON` manda sobre los nombres (`LEX-R21`) y declara **cuatro** severidades:

```
S1  Sistema caído, pérdida de datos, brecha de seguridad, bloqueo total de un flujo crítico.
S2  Flujo crítico degradado; existe workaround.
S3  Flujo no crítico afectado, o feature esperada.
S4  Cosmético, mejora, deuda sin impacto observable.  → «Se agrupa en LOTES.»
```

Lo esperado es que la herramienta acepte exactamente esas cuatro, y que ninguna otra exista.

## 2. Comportamiento observado

`tracker.mjs:2556` declara **otra lista**, dentro del código, y **se la atribuye a `LEXICON`**:

```js
const SEVERIDADES = ['S0', 'S1', 'S2', 'S3'];
```

Medido:

```
$ node docs/methodology/tools/tracker.mjs asignar PT --slug prueba --severidad S4 --ver
  «S4» no es una severidad. LEXICON declara: S0 · S1 · S2 · S3
```

**El mensaje es falso en las dos mitades.** `LEXICON` declara `S4` —y `S4` es precisamente la
severidad que define como «deuda sin impacto observable, **se agrupa en lotes**»— y **no declara
`S0` en ninguna parte**.

**Y el registro ya diverge de las dos maneras.** No es hipotético:

```
S4 · rechazada por la herramienta, presente en 4 allocations
     PT-015 · PT-016 · PT-017 · PT-051   (todas INTEGRATED)
S0 · aceptada por la herramienta, no declarada por LEXICON, presente en 1
     PT-107                              (INTEGRATED)
```

Las cinco están **integradas**, así que se escribieron rodeando la herramienta o antes de que
comprobara nada. Ese rodeo es el síntoma que `PT-103` ya describió para otro campo: *«una regla
que solo se puede cumplir saltándose la herramienta no se cumple: se rodea»*.

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | La escala de severidad se declara **una sola vez**, en `patrones.mjs` con su contrato (`SUITE-R38`), y `tracker.mjs` la consume | `grep` de `'S0'`/`'S3'` en `tracker.mjs`: cero literales de escala |
| AC-02 | La lista declarada es la de `LEXICON`: `S1 S2 S3 S4`. **`LEXICON` es quien cede el dato, no quien lo recibe** (`LEX-R21`) | comparación contra `LEXICON` §Severidad |
| AC-03 | `asignar --severidad S4` **funciona** | ejecución del comando que hoy falla |
| AC-04 | `asignar --severidad S0` **falla**, y el mensaje ya no atribuye a `LEXICON` una lista que no tiene | ejecución · lectura del texto del error |
| AC-05 | El mensaje de error **enumera lo que LEXICON declara de verdad**, derivado, no escrito | el texto sale de la constante, no de una cadena a mano |
| AC-06 | **Lo integrado no se rejuzga.** `PT-107` (`S0`) y los cuatro `S4` siguen como están; nada los reescribe ni los marca inválidos | el registro, sin cambios en esas cinco allocations |
| AC-07 | Un valor de severidad fuera de la escala **no puede entrar al registro por ningún camino** | intento por comando; y si queda otra vía, se declara |

## 4. Cómo termina   `FDGE-R53`

> Termina cuando: `asignar --severidad S4` crea la allocation, `--severidad S0` la rechaza, el
> mensaje de error enumera lo que `LEXICON` declara de verdad, y las cinco allocations históricas
> siguen intactas.

## 5. Qué NO entra   `[AGENTE]`

- OUT: **corregir las cinco allocations históricas.** Están `INTEGRATED`; pedirles una severidad
  distinta es rejuzgar hacia atrás trabajo cerrado, que es justo lo que `RIGE_DESDE` y
  `SUITE-R44` evitan en este repositorio. Si alguien decide normalizarlas, es otra tarea y otra
  decisión.
- OUT: cambiar el significado de ninguna severidad, ni añadir una quinta.
- OUT: revisar otras listas canónicas escritas dentro de herramientas. Si aparecen —y este lote
  sugiere que aparecerán— se declaran; no se arreglan aquí.

## 6. Firma

```
Firmado por lote: EP-022
```

---

## Observaciones del agente   `INTAKE-R07`

- **Entró al lote por decisión del firmante.** El Intake de `EP-022` lo declaraba `OUT` en `§3`
  —misma enfermedad, hecho distinto— y el firmante decidió incorporarlo como `BUG` propio. Queda
  escrito porque cambia el alcance firmado.

- **Es `CE-008` con un agravante que el resto del lote no tiene: el mensaje de error miente con
  autoridad.** No dice «S4 no vale»; dice «**LEXICON declara** S0 · S1 · S2 · S3». Quien lo lea
  corregirá su severidad en vez de ir a `LEXICON`, y la divergencia se hereda al usuario. Los
  otros catorce sitios fallan en silencio; este **enseña el dato equivocado**.

- **`AC-06` protege lo contrario de lo que parece.** La tentación al arreglar esto es «dejar el
  registro limpio». Cinco allocations integradas con severidades que hoy no validan **son la
  evidencia de que el defecto existió**; borrarla es perder el rastro para que cuadre una cifra.

- **Es un `BUG`, así que su cierre no se automatiza** (`SUITE-R06b`, `PTSA-R43`): lo lleva hasta
  `VALIDATION_PENDING` y lo valida y cierra una persona.

- **Solapa con `PT-144`** en `tools/patrones.mjs`. Van serializados: primero el contrato de
  componentes, después el de severidades — mismo mecanismo, dos hechos.
