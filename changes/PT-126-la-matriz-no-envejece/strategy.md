# Estrategia — `PT-126`   `PHASE 3`

> `FDGE-R54`: viabilidad **`SAFE`**, registrada.

---

## Dónde se mide: donde ya se mira

| Opción | Por qué NO / SÍ |
|:---|:---|
| Un comando nuevo, `tracker matriz --candidatos` | Sería `CE-007` en su **octava** instancia: la herramienta existe y nada la echa en falta. El lote entero está para no repetirla |
| Un paso en CI | CI ya corre `verify`, y `matriz:check` está ahí. Pero CI comprueba **frescura**, no señala candidatos a nadie |
| **Dentro de `sellar`** | **Gana.** Es el patrón de `PT-110`: `sellar` ya recorre deuda, inventario, grafo y documentos de entrada, y se ejecuta **antes de una versión** — el momento exacto en que conviene saber qué se repite |

## El umbral: parámetro declarado, no número escondido

`AC-04` lo exige y hay motivo. Un `3` dentro del código sería una decisión que nadie ve y que
nadie puede cambiar sin tocar una herramienta.

Vive en `REGISTRY.tracker.umbral_clase_sin_dueno`, **con su motivo al lado**: sale de que las
cuatro clases hoy `CERRADA` se cerraron cuando alguien contó, y la menor de esas cuentas fue tres.
Es un juicio y se dice: subirlo dejaría fuera clases que ya se repiten; bajarlo llenaría el
roadmap de cosas que pasaron una vez.

## Dos situaciones, no una

```
sin dueño                        ninguna regla la reclama
tiene regla y NADA EMITE por ella   hay obligación y no puede fallar   ← peor
```

La segunda es peor porque **parece cubierta**. Se publica con frase propia, y hoy la única es
`CE-002` / `SUITE-R59`.

## `AC-02`: avisa y no falla

`RIGE_DESDE` acota `LEX-R31` a la `13.0.0`, así que las 163 entradas anteriores no pasan a estar
incompletas (`SUITE-R09`). Es `CE-014` **evitado a propósito** dentro de la comprobación que nace
para contar `CE-014`.

Y declarar la clase es **opcional**: `PHASE 8` la pide *«si el trabajo cae en una de `LEXICON`
§4.4»*. No todo trabajo repite un tropiezo, y exigirla siempre haría que se inventara una clase
para callar el aviso — peor que no tener el aviso.

## `FPGE` lee, y no transcribe

`FPGE-Implementation` §2 gana una línea de recolección que apunta a `MATRIZ.md` y **no repite el
umbral**: dos números que puedan divergir es `CE-008`, la clase que la matriz cuenta.

## Lo que NO se hace

- **No se prioriza.** La fórmula de `FPGE-R06` no cambia.
- **No se promueve nada.** `FPGE-R04` lo prohíbe y sigue prohibiéndolo.
- **No se da dueño a las seis huérfanas.** Se publican como candidatos.
