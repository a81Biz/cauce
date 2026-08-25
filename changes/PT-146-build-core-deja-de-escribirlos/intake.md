# PT-146 — `build-core` deriva familias, orden y triggers del contrato

> Tarea dentro de la implementación abierta `EP-022` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-146
type: REFACTOR
epic: EP-022
track: STANDARD
status: DRAFT
phase: 1
created: 2026-08-24
structural: no
suite_version: 13.1.0
origin: DIRECT
---
```

## 1. Qué se quiere   `[HUMANO]`

`build-core.mjs` genera `CORE.md` y `CORE-PTSA.md` — **lo único que el agente carga**
(`SUITE-R15`). Tres de los trece sitios están aquí, y su efecto es el más directo de todos: lo
que no entre en `CORE.md` **no llega a runtime**.

```
build-core.mjs:171     proseRules(rules, ['SUITE','FND','FDGE','INTAKE','QA','FPGE','FIDE'])
                       ^ qué familias se recogen de la prosa de RULES.md
build-core.mjs:183     const order = ['SUITE','LEX','EXEC','FND','FDGE','INTAKE','QA','PTSA','FPGE','FIDE']
                       ^ en qué orden se emiten
build-core.mjs:433-437 la lista literal de triggers de los seis componentes
```

Las dos primeras listas **no son iguales entre sí** —una tiene siete entradas y la otra diez— y
esa diferencia es correcta hoy, pero nada la explica ni la comprueba: son dos literales que
alguien mantuvo a mano y que coinciden por costumbre.

El propio archivo documenta a qué se parece el fallo cuando esto se descuadra:
`build-core.mjs:194` recuerda que hubo un momento en que `[START PTSA]` auditaba **con el 29 % de
su propio ruleset**, porque las reglas no llegaban a runtime.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | No queda ningún literal de componente en `build-core.mjs` | `grep` de los diez prefijos: cero |
| AC-02 | Las familias de `:171` y el orden de `:183` se derivan del contrato, y **la diferencia entre ambas queda declarada** en el contrato, no en el código | lectura: qué campo distingue una lista de la otra |
| AC-03 | Los triggers de `:433-437` se derivan del contrato | lectura |
| AC-04 | **`CORE.md` y `CORE-PTSA.md` regenerados son byte a byte idénticos** a los actuales | `build-core --check` en verde sin regenerar |
| AC-05 | Un componente añadido al contrato aparece en `CORE.md` con sus reglas y sus triggers, sin tocar `build-core.mjs` | caso con el componente ficticio de `PT-145` |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `build-core.mjs` no nombra ningún componente, `build-core --check` pasa sin
> diferencias sobre el `CORE.md` actual, y un componente añadido solo al contrato aparece en el
> `CORE.md` generado con sus reglas y sus triggers.

## 4. Qué NO entra   `[AGENTE]`

- OUT: cambiar el contenido de `CORE.md`. `AC-04` es la barra: si el generado difiere en un byte,
  la tarea falló. Cambiar qué carga el agente es otra decisión, y no es esta.
- OUT: cambiar el mecanismo de overlay de PTSA (`SUITE-R25`). El contrato **declara** que PTSA va
  a overlay; no reescribe cómo se construye.
- OUT: `verify-suite.mjs`, `comparar-marco.mjs`, `audit.mjs`.

## 5. Firma

```
Firmado por lote: EP-022
```

---

## Observaciones del agente   `INTAKE-R07`

- **`AC-04` es más fuerte que «no cambia el comportamiento».** Aquí el producto es un archivo
  generado, así que la identidad byte a byte es comprobable y `build-core --check` ya existe para
  comprobarla. No hay motivo para aceptar menos.
- **La discrepancia entre `:171` y `:183` hay que resolverla, no copiarla.** Una lista excluye
  `LEX`, `EXEC` y `PTSA` porque sus reglas viven en otro documento; la otra los incluye porque
  ordena todo lo emitido. El contrato tiene que decir **cuál es cuál con un campo**, o habremos
  movido el literal de sitio sin explicarlo — que es la mitad del defecto.
- **Esta es la tarea con más consecuencia si sale mal**: un `CORE.md` degradado no falla, deja al
  agente operando con menos reglas de las que cree tener.
