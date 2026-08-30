# `PT-187` · `discovery.md` — tres cifras del intake corregidas por medir

## 1. Lo medido, hoy

```
tags: 20   CHANGELOG: 47   npm: 13   package.json: 13.4.0

TAG y NO publicada          (7): 1.0.0 · 5.2.0 · 9.0.0 · 10.0.0 · 13.2.0 · 13.3.0 · 13.4.0
PUBLICADA y NO en CHANGELOG (0): ninguna
PUBLICADA y NO tag          (0): ninguna
EN CHANGELOG y NO tag      (28)
```

## 2. Lo que el intake decía, y lo que hay

| El intake decía | Medido |
|:---|:---|
| «`v9.0.0`, `v10.0.0` y `v5.2.0` tienen tag y no están en npm» | **Son siete**, no tres: añade `1.0.0` y las tres últimas |
| «`4.13.0`, `5.0.0` y `5.1.0` están en npm y no en el `CHANGELOG`» | **Ninguna.** Las 13 publicadas están todas en el `CHANGELOG` |
| *(no lo veía)* | **28 de las 47 del `CHANGELOG` no tienen tag** |

Las cifras del intake venían del `HANDOFF`, que las declaraba de una medición anterior. **Es
`CE-010` en directo**: una cifra transcrita a un documento mientras el árbol sigue cambiando. Se
corrige aquí y se deriva en la herramienta, que es lo único que no caduca.

## 3. Las cuatro divergencias no valen lo mismo

| | Qué significa | ¿Es defecto? |
|:---|:---|:---|
| **tag sin publicar** (7) | Se etiquetó y no se publicó | **No necesariamente.** `SUITE-R06a` reserva publicar al firmante: un tag puede esperar |
| **publicada sin `CHANGELOG`** (0) | Se publicó sin escribir la migración | **Sí, `SUITE-R19`.** Hoy: ninguna |
| **publicada sin tag** (0) | Se publicó algo que el repositorio no marca | **Sí.** Hoy: ninguna |
| **`CHANGELOG` sin tag** (28) | Se documentó una versión que nunca se etiquetó | **Depende**, y es lo que hay que declarar |

**Las 28 son de la historia temprana** —`3.0.0` a `8.1.0`— y no se retrofechan (`SUITE-R09`,
`CE-014`). Lo que importa no es la cifra: es que **hoy nadie la sabía**.

## 4. Nadie compara. Medido

```
$ grep -rn "npm view|registry.npmjs" docs/methodology/tools/*.mjs bin/cauce.mjs
(sin coincidencias)
```

**Ninguna herramienta consulta npm.** `version.mjs` alinea los 21 documentos entre sí, y
`verify-suite` comprueba que las versiones internas no diverjan — pero el registro externo no lo
mira nadie. Las cuatro fuentes son correctas por separado y **nadie las contrasta**, que es la
forma de este lote.

## 5. `AC-02` no es teórico: lo reproduje escribiendo esto

Mi primer intento de medir fue así:

```
$ node -e "... execFileSync('npm',['view','...','versions','--json']) ..."
npm: sin acceso
  TAG y NO en npm: 1.0.0 10.0.0 11.0.0 12.0.0 13.0.0 13.1.0 ... (las 20)
```

La llamada a `npm` falló, el `catch` dejó el conjunto **vacío**, y el resultado fue **«las 20 tags
sin publicar»** — una alarma falsa que parecía un hallazgo. Si esto hubiera sido la herramienta,
habría reportado veinte divergencias inventadas por no tener red.

**Ése es exactamente `AC-02`**: *«sin acceso a npm, se dice — no se da por cuadrado»*. Y la
medición demuestra que el fallo va en **las dos direcciones**: sin red se puede dar por cuadrado lo
que no lo está, y también **inventar divergencias que no existen**. La segunda es peor, porque
parece trabajo.

`SUITE-R22` declara soportado el proyecto sin red, así que esto no es un caso raro.

## 6. Lo que NO se toca   `SUITE-R26`

- **No se publica nada.** `npm publish` es acto del firmante (`SUITE-R06g`) y está fuera de este
  lote por su `§3`.
- **No se crean tags** (`SUITE-R06a`).
- **Las 28 sin tag no se retrofechan** ni se juzgan: se cuentan y se dicen.
- **No se promete que las cuatro coincidan.** Es legítimo que un tag exista antes de publicar.
  Se promete que la diferencia sea **visible y contable**.
