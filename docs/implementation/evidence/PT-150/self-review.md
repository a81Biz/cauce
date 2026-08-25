# `PT-150` · autorrevisión — `PHASE 6` Evidence

## 1. El defecto era más grande que el intake

El intake describía **una** herramienta con una lista equivocada. Lo medido:

| Fuente | Escala | |
|:---|:---|:---|
| `LEXICON` §8.3 | `S1 S2 S3 S4` | **la fuente** (`LEX-R21`) |
| `verify-fdge.mjs:166` | `S1 S2 S3 S4` | correcta, pero **escrita a mano** dentro de un regex |
| `INTAKE/templates/` ×3 | `S1 \| S2 \| S3 \| S4` | correcta |
| `tracker.mjs:2556` | `S0 S1 S2 S3` | **la que miente, y cita a `LEXICON`** |

**Las dos herramientas se contradecían entre sí**, no solo con el documento:

```
severity: S4    verify-fdge la ACEPTA  ·  tracker asignar la RECHAZA
severity: S0    tracker la ACEPTA      ·  verify-fdge no la reconoce
```

Había un rango donde el marco se contradecía consigo mismo, y **ninguna de las dos herramientas
podía enterarse**: cada una tenía su propia copia.

## 2. Su agravante propio

Los quince sitios de `PT-144` fallan **en silencio**. Este **enseñaba el dato equivocado**:

```
«S4» no es una severidad. LEXICON declara: S0 · S1 · S2 · S3
```

Las dos mitades son falsas. Quien lo lea corrige su severidad en vez de ir a `LEXICON`, y la
divergencia **se hereda al usuario**. Por eso el arreglo no es solo la lista: el texto ahora se
**deriva** de la constante, así que no puede volver a divergir del dato.

## 3. Y sale del paquete

`INTAKE/templates/CHANGE-REQUEST.md` trae `severity: S4` **por defecto**, y `asignar` lo
rechazaba. Es la clase de `PT-083` —«la plantilla que el paquete distribuye fallaba su propio
verificador»— sobre otro campo, y **afecta a todo proyecto instalado**.

**La plantilla no se tocó, y esa fue una decisión.** `S4` es el valor correcto para un
`CHANGE-REQUEST`: `LEXICON` lo define como «deuda sin impacto observable, **se agrupa en lotes**»,
que es lo que un `CHORE` de lote es. Cambiarla a `S3` habría acomodado el documento al defecto.
**El que estaba mal era el comando.**

Y el caso que lo prueba **lee el valor del archivo**, no lo escribe:

```bash
sed -n 's/^severity:[[:space:]]*\(S[0-9]\).*/\1/p' INTAKE/templates/CHANGE-REQUEST.md
```

Es la lección de `RC-03` en `PT-144`: una comprobación que compara contra una copia del dato no
comprueba nada.

## 4. Cómo entraron las cinco divergencias

Contrastado con sus intakes, y son **dos historias distintas**:

- **`PT-107`** declara `severity: S0` **en su propio intake**. El humano lo escribió, la
  herramienta lo aceptó, y `FDGE-R04` no lo caza porque lee el intake **y `PT-107` hereda del
  lote** (`FDGE-R51`), además de estar `INTEGRATED`.
- **Los cuatro `S4`** no declaran `severity` en su frontmatter: son anteriores a que `asignar`
  escribiera el campo (`PT-103`), así que su severidad **se escribió a mano en `REGISTRY.json`**.

**Eso es lo que obligó a comprobar el registro y no solo el intake.** `FDGE-R04` mira `severity:`
del intake y se salta los que heredan del lote — así que una severidad inválida en el registro
**no la miraba nadie**.

## 5. `AC-07` no promete lo que no puede dar

El intake pedía que una severidad inválida no entrara «por ningún camino». **No es alcanzable**:
`REGISTRY.json` es un archivo y se escribe a mano — así entraron los cuatro `S4`.

Lo que se garantiza, y se dice:

```
por comando      asignar la rechaza
por verificador  se CAZA en trabajo VIVO, en la corrida siguiente
a mano           sigue siendo posible
```

Prometer la garantía completa habría sido `SUITE-R26`. Se precisó en `strategy.md` §7 y quedó en
`traceability.md`.

## 6. Lo integrado no se rejuzga, y es un criterio, no una omisión

Las cinco allocations históricas siguen exactamente como estaban:

```
PT-015 S4 INTEGRATED · PT-016 S4 INTEGRATED · PT-017 S4 INTEGRATED
PT-051 S4 INTEGRATED · PT-107 S0 INTEGRATED
```

`git diff` sobre `REGISTRY.json` no toca ninguna. La tentación al arreglar esto es «dejar el
registro limpio», y esas cinco entradas **son la evidencia de que el defecto existió**: borrarlas
para que cuadre una cifra sería perder el rastro.

Mismo criterio de `RIGE_DESDE` y `SUITE-R44`: **lo que se exige, se exige a lo vivo**.

## 7. Un caso mío medía la razón equivocada

Los tres casos de `AC-06`/`AC-07` afirmaban sobre el **identificador** —`"PT-001"`— y el fixture
nombra los tres por `FDGE-R01`, porque no tienen `changes/`. Uno pasaba en verde **por una razón
ajena** a lo que decía comprobar.

Corregidos para afirmar sobre **el mensaje de severidad**, no sobre el id. Es la misma clase de
error que `PT-144` cometió con el caso que esperaba un `SyntaxError`: **una comprobación que pasa
por el motivo equivocado no es una comprobación**.

## 8. Lo que esta tarea deja probado del mecanismo de `PT-144`

Era su motivo de orden: estrenar el contrato sobre un hecho pequeño y aislado antes de que cuatro
herramientas dependan de él.

**Funcionó.** El patrón —constante canónica, comentario que cita sin parsear, aserciones propias
en `verify-patrones`— se aplicó a un segundo hecho sin cambiar nada de `PT-144`, y con un caso
que aquel no tenía: un **patrón construido** (`RE_SEVERIDAD`) en vez de una lista. `SUITE-R59` se
cumple sin escribir una sola barra invertida.
