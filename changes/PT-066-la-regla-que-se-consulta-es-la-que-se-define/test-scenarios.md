# PT-066 — Escenarios de prueba   `PHASE 4`

| AC | # | Escenario | Se espera |
|:---|:--|:---|:---|
| AC-01 | E1 | Las 20 reglas `CHECK` de `RULES.md` | se encuentran. Hoy 11 se declaran inexistentes |
| AC-02 | E2 | Las 15 `EXEC-R*` de `EXECUTION-MODES.md` | se encuentran. Hoy ninguna |
| AC-03 | E3 | Las `LEX-R*` de `LEXICON.md` | se encuentran |
| AC-04 | E4 | `FDGE-R43` y `FDGE-R19` | devuelven **su** texto, no el de `SUITE-R29` ni `SUITE-R42` |
| AC-05 | E5 | `SUITE-R99`, que no existe | se sigue declarando inexistente |
| AC-06 | E6 | **Los 197 IDs**, derivados de los tres documentos | cada uno devuelve una definición que **empieza por ese ID** |

## `E6` es el caso, y los demás lo explican

No es una muestra: recorre el universo entero y exige **dos** cosas por ID —que no sea `null` y
que el texto empiece por ese mismo ID—. La segunda es la que faltaba: sin ella, «devuelve algo»
pasaba por «devuelve lo correcto», y así 26 reglas devolvían el texto de otra sin que nadie lo
viera.

## Inversa

Devuelto el criterio por severidad y quitada el ancla:

```
E1 E2 E3 E4 E6   caen
E5               sigue pasando — una regla inexistente lo sigue siendo
```

`E5` es la guarda contra el arreglo fácil: hacer que `definicionDe` devuelva algo siempre
arreglaría los 47 y rompería la única respuesta honesta que la función ya daba bien.
