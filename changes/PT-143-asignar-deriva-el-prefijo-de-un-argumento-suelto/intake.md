# PT-143 — `asignar` toma el prefijo del primer argumento en mayúsculas

> Tarea dentro de la implementación abierta `EP-021` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-143
type: BUG
epic: EP-021
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-24
structural: no
suite_version: 13.0.0
origen_parada: EP-021
---
```

## 1. Qué se quiere   `[HUMANO]`

`asignar` deriva el prefijo del identificador así:

```js
const prefijo = ARGS.slice(1).find((a) => /^[A-Z]+$/.test(a)) ?? 'PT';
```

El valor de `--tipo` es también un argumento en mayúsculas. Medido con `--ver`:

```
tracker asignar --tipo BUG --severidad S2 --titulo "…"      ->  BUG-001
tracker asignar PT --tipo BUG --severidad S2 --titulo "…"   ->  PT-137
```

Un identificador nace con un prefijo que nadie eligió, y `BUG-001` **no es un espacio de nombres
declarado**: `LEXICON` §4.1 no lo reconoce.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El prefijo **no** se toma del valor de una bandera | un caso con `--tipo BUG` sin `PT` delante |
| AC-02 | Un prefijo fuera de los declarados en `LEXICON` §4.1 **falla** en vez de crearse | un caso con un prefijo inventado |
| AC-03 | Sin prefijo explícito, el defecto sigue siendo `PT` y se **dice** | un caso sin prefijo |
| AC-04 | El resto de acciones que leen argumentos posicionales se revisan por el mismo patrón | una enumeración, con archivo y línea |
| AC-05 | Ningún identificador ya asignado cambia | el registro antes y después |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `tracker asignar --tipo BUG …` sin prefijo explícito crea un `PT`, y un prefijo
> que `LEXICON` no declara falla en vez de inventar un espacio de nombres.

## 4. Qué NO entra   `[AGENTE]`

- OUT: un analizador de argumentos general para todo el tracker. Sería un cambio estructural
  encima de una batería de 1600 casos; aquí se arregla la lectura del prefijo y se **enumera** lo
  demás.
- OUT: renombrar identificadores existentes. `SUITE-R09` es append-only.

## 5. Firma

```
Firmado por lote: EP-021
```

---

## Observaciones del agente   `INTAKE-R07`

- **`CON_VALOR` existe justo para esto** —declara qué banderas llevan valor— y la lectura del
  prefijo no la consulta. La información necesaria estaba a diez líneas.
- **Es `CE-003`**, argumento por detección: se adivina qué es un argumento en vez de leer su
  posición o su bandera. `CE-003` es una de las clases **sin regla que la reclame**, con siete
  instancias contadas.
- Lo encontró el agente ejecutando `--ver` **antes** de escribir, que es para lo que esa bandera
  existe.
