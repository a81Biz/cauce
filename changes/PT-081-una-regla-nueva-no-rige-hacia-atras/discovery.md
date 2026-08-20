# PT-081 — Descubrimiento   `PHASE 2`

## Lo medido

Cada regla se buscó en `CHANGELOG.md` tomando su **última** aparición: el archivo va de más nuevo
a más viejo, así que la primera es la mención más reciente y la última es la introducción. Lo digo
porque **la primera medición la hice al revés** y dio `FDGE-R53 → 7.6.0`, que es falso.

| Regla | Introducida en | `DESDE = [5,1,0]` la trata como | ¿Correcto? |
|:---|:---|:---|:---|
| `FDGE-R52` — reanclaje por fase | **5.0.0** | 5.1.0 | no rige sobre tareas de `5.0.0`. Menor, y **por defecto**: deja fuera, no de más |
| `FDGE-R53` — la tarea declara cómo termina | **5.1.0** | 5.1.0 | ✅ exacto |
| `FDGE-R54` — la viabilidad consta antes de `G2` | **no aparece** | 5.1.0 | ❌ rige sobre todo lo escrito desde el 12 de agosto |

## Dónde está, con archivo y línea

[verify-fdge.mjs:991](docs/methodology/tools/verify-fdge.mjs#L991):

```js
const DESDE = [5, 1, 0];
```

`rigeAqui` se calcula **una vez** con esa constante y gobierna **tres** comprobaciones:
[:999](docs/methodology/tools/verify-fdge.mjs#L999) `FDGE-R53`,
[:1048](docs/methodology/tools/verify-fdge.mjs#L1048) `FDGE-R54` y
[:1224](docs/methodology/tools/verify-fdge.mjs#L1224) `FDGE-R52`.

Una constante compartida sólo puede ser correcta para las reglas que nacieron el mismo día.

## El segundo hallazgo, y es peor

```
menciones de FDGE-R54 y SUITE-R56 en la entrada 9.0.0 del CHANGELOG:  0
```

**Dos reglas `HARD` nuevas, con verificadores que fallan, que no están en el registro de
versiones.** No es que estén mal ubicadas: no están.

`SUITE-R19` exige guía de migración, y la de `9.0.0` dice:

> **Ningún proyecto instalado tiene que hacer nada.** Todo lo que entra es **opcional** y todo lo
> que existe sigue funcionando.

Era cierto el 18 de agosto, cuando `9.0.0` era `EP-016` y su único cambio no opcional era un
**aviso**. Ha dejado de serlo, y nadie lo notó porque **nada comprueba que una guía de migración
siga siendo verdad mientras su versión sigue abierta**.

## Consecuencia, concreta

Un proyecto instalado en `8.2.0` que actualice a `9.0.0`: sus tareas en vuelo llevan
`suite_version: 8.2.0`, que es `≥ 5.1.0`, así que `rigeAqui` es **cierto** y
`verify-fdge --gate G2` **falla** por no tener `viabilidad` — una regla que no existía cuando esas
tareas se escribieron, y que la guía de migración dice que no les afecta.

## Por qué `EP-017` no cabe en la `9.0.0`

`9.0.0` **no está publicada**: `npm view @a81biz/cauce version` devuelve `8.2.0`. Doblar trabajo en
una versión sin publicar sería legítimo en general. Aquí no, por dos razones:

1. La entrada `9.0.0` es el **registro fechado de `EP-016`** — cinco tareas, una regla modificada,
   su guía de migración. Reescribirla para que además signifique `EP-017` borra qué lote trajo
   qué: exactamente la enfermedad que este lote combate.
2. Las reglas nuevas **rompen compatibilidad**. `CLAUDE.md` regla 6: «Si el cambio rompe
   compatibilidad: subir `MAJOR` y escribir la guía de migración».

## Conclusión

Tres defectos encadenados, y sólo el primero es de código:

| | Qué | Dónde |
|:---|:---|:---|
| `1` | Una constante `DESDE` para reglas nacidas en versiones distintas | `verify-fdge.mjs:991` |
| `2` | `FDGE-R54` y `SUITE-R56` no están en el `CHANGELOG` | `CHANGELOG.md` §9.0.0 |
| `3` | La guía de migración de `9.0.0` afirma algo que dejó de ser cierto | `CHANGELOG.md` §9.0.0 |

Y ninguno lo detecta nada. El tercero es el que da la razón al firmante: **esto no es la `9.0.0`**.
