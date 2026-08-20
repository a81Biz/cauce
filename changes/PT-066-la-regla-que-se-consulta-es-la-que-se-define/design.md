# PT-066 — Diseño   `PHASE 4`

## El cambio, en `definicionDe`

```js
// antes  (regla.mjs:55)
if (linea.includes(`\`${id}\``) && /HARD|SOFT/.test(linea)) { ... }

// despues
const RE_DEFINE = {
  'RULES.md':           (id) => new RegExp('^\\\\|\\\\s*`' + id + '`\\\\s*\\\\|'),
  'LEXICON.md':         (id) => new RegExp('^\\\\|\\\\s*`' + id + '`\\\\s*\\\\|'),
  'EXECUTION-MODES.md': (id) => new RegExp('^`' + id + '`\\\\s*·'),
};
```

**El ancla `^` es todo el arreglo.** Una definición **empieza** por su ID; una mención aparece
dentro del texto de otra regla. Distinguirlas no necesitaba más.

**La severidad desaparece del criterio.** Servía de filtro grosero contra menciones y era lo que
dejaba fuera las 20 `CHECK` de `RULES.md` y las 15 `EXEC-*` en prosa.

## El orden de búsqueda no cambia

```js
for (const f of [DUENO[pref], 'RULES.md', 'LEXICON.md', 'EXECUTION-MODES.md'].filter(Boolean))
```

El documento propietario primero, y el resto como red por si un prefijo nuevo no está en `DUENO`.
Con el ancla puesta, buscar en los otros ya no puede devolver una mención.

## Lo que NO cambia

| Pieza | Por qué |
|:---|:---|
| `DUENO` | Ya existe y su comentario dice por qué no se duplica (`SUITE-R38`) |
| `fallosPosibles` y `--donde` | `PT-051` los arregló y tienen casos |
| El mensaje cuando de verdad no existe | Es correcto: el problema era que salía 21 veces de más |
| El formato de los tres documentos | `EXECUTION-MODES.md` escribe en prosa a propósito |

## Y el caso que lo prueba

No es una muestra: recorre **los 197 IDs** de los tres documentos y exige que cada uno devuelva
**su propia** definición.

```
para cada ID definido en RULES.md, LEXICON.md, EXECUTION-MODES.md:
    d = definicionDe(ID)
    d NO es null                       <- no lo declara inexistente
    d.texto EMPIEZA por ese mismo ID   <- no devuelve el de otra regla
```

La segunda condición es la que faltaba. Sin ella, «devuelve algo» pasaba por «devuelve lo
correcto» — que es exactamente cómo 26 reglas devolvían el texto de otra sin que nadie lo viera.

## Delta respecto a la estrategia

Ninguna.
