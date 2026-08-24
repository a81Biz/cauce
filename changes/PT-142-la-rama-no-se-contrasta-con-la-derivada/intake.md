# PT-142 — nada compara el nombre de una rama con el que la regla deriva

> Tarea dentro de la implementación abierta `EP-021` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-142
type: BUG
epic: EP-021
track: STANDARD
status: DRAFT
phase: 1
created: 2026-08-24
structural: no
suite_version: 13.0.0
origen_parada: EP-021
---
```

## 1. Qué se quiere   `[HUMANO]`

`patrones.mjs · ramaDeTarea` deriva el nombre correcto de una rama a partir del registro, y se usa
**una sola vez**, en `tracker rama`, como **propuesta**. `topologiaDeRamas` sólo comprueba que la
rama **contenga** un identificador que exista. Con eso, tres ramas de esta sesión pasaron:

```
                     deriva la herramienta                          existia
PT-113 (BUG)   bug/alberto-martinez/PT-113-la-guia-…-incompleta   chore/…/PT-113-apertura
PT-081 (BUG)   bug/alberto-martinez/PT-081-una-regla-…            fix/…/PT-081-…
EP-020         null — «sin type no hay nombre de rama»            chore/…/EP-020-viaje-de-vuelta
```

La tercera fila es la peor: la herramienta **se niega** a nombrarla y devuelve `null` para que
nadie invente el nombre. Se inventó igual.

**Y hay una contradicción de reglas detrás.** `FDGE-R19` manda nombrar la rama de lote «con el
`type` del propio lote»; `LEX-R27` dice que **un lote NO lleva `type`** —`tracker tipo` lo rechaza
citando esa regla—. `LEXICON` manda sobre `RULES` (`LEX-R21`), así que la rama de lote **no tiene
forma derivable**, y la regla pide un dato que otra regla prohíbe que exista.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | La contradicción `FDGE-R19` / `LEX-R27` se **resuelve**, y se dice cuál cede | `verify-suite` sin errores y la regla reescrita |
| AC-02 | Una rama de tarea cuyo nombre no coincide con `ramaDeTarea` se **nombra**: aviso durante el trabajo, error en `G4` | casos con `type` erróneo y con slug erróneo |
| AC-03 | La comparación **no juzga hacia atrás**: lo anterior a esta versión no se retrofecha (`RIGE_DESDE`) | un caso con `suite_version` previa |
| AC-04 | Sin `type` en el registro no hay nombre esperado, y se **dice** en vez de adivinar (`RULE-06`) | un caso con allocation sin `type` |
| AC-05 | El mensaje enseña el nombre **derivado**, no sólo que está mal | el texto del mensaje |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `verify-fdge` compara cada rama de tarea con lo que `ramaDeTarea` deriva de su
> allocation, y la rama de un lote tiene una forma que no se contradice con `LEX-R27`.

## 4. Qué NO entra   `[AGENTE]`

- OUT: renombrar ramas existentes. `FDGE-R19` ya declara que una rama anterior se **termina como
  empezó**, porque renombrarla rompe el pull request abierto sobre ella.
- OUT: borrar ramas. Es `SUITE-R06f` y no se automatiza: se describe el comando.

## 5. Firma

```
Firmado por lote: EP-021
```

---

## Observaciones del agente   `INTAKE-R07`

- **Es `CE-007`**: existe la herramienta y nada la echa en falta. `ramaDeTarea` lleva versiones
  derivando el nombre correcto sin que ninguna comprobación lo use para juzgar.
- **La contradicción explica el error, no lo excusa.** El agente inventó el nombre del lote
  teniendo delante un `null` que decía «no lo sé». Pero una regla que pide un dato que otra
  prohíbe **produce** ese error, y arreglar sólo la conducta lo dejaría volver.
- **Lo destapó el firmante**, revisando las ramas que quedaban en el remoto.
