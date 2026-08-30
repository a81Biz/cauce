# `PT-187` · `strategy.md`

## La decisión

**Un comando `tracker versiones` que contrasta las cuatro fuentes y dice la divergencia con su
dirección.** No una compuerta: un dato que hoy no existe.

```
$ node tools/tracker.mjs versiones

  package.json  13.4.0     tags 20     CHANGELOG 47     npm 13

  TAG y NO publicada          (7): 1.0.0 · 5.2.0 · 9.0.0 · 10.0.0 · 13.2.0 · 13.3.0 · 13.4.0
  PUBLICADA y NO en CHANGELOG (0): ninguna
  PUBLICADA y NO tag          (0): ninguna
  EN CHANGELOG y NO tag      (28): 3.0.0 … 8.1.0

  npm: consultado el 2026-08-30. Sin red se dice SIN EVALUAR y no se da por cuadrado.
```

## Las cuatro divergencias no valen lo mismo, y el comando lo dice

| | Qué significa | ¿Es defecto? |
|:---|:---|:---|
| **tag sin publicar** | Se etiquetó y no se publicó | **No necesariamente**: `SUITE-R06a` reserva publicar al firmante, y un tag puede esperar |
| **publicada sin `CHANGELOG`** | Se publicó sin la guía de migración | **Sí** — `SUITE-R19` |
| **publicada sin tag** | Se publicó algo que el repositorio no marca | **Sí** |
| **`CHANGELOG` sin tag** | Se documentó una versión que nunca se etiquetó | **Depende**, y por eso se declara |

**Presentar las cuatro como «divergencias» a secas sería el defecto contrario**: convertir una
diferencia legítima en una alarma. El comando las separa por lo que significan.

## `AC-02` decide cómo se comporta sin red, y lo reproduje midiendo

Mi primer intento de contrastar las cuatro fuentes falló así:

```
npm: sin acceso
  TAG y NO en npm: 1.0.0 10.0.0 11.0.0 12.0.0 13.0.0 13.1.0 …   (las 20)
```

La llamada a `npm` falló, el `catch` dejó el conjunto **vacío**, y salieron **veinte divergencias
inventadas** con aspecto de hallazgo. Si eso hubiera sido la herramienta, habría reportado trabajo
que no existe.

**Así que el fallo va en las dos direcciones**: sin red se puede dar por cuadrado lo que no lo
está, y también inventar lo que no ocurre. **La segunda es peor, porque parece trabajo.**

De ahí la forma: sin red, el bloque de npm sale **`SIN EVALUAR`** —el vocabulario que `LEX-R21` ya
declara— y las tres comparaciones que **no** necesitan red siguen dándose. `SUITE-R22` declara
soportado el proyecto sin ella, y una comprobación que se apaga entera por falta de red apaga
también lo que sí podía decir.

## Lo que se descarta

| | Por qué no |
|:---|:---|
| Hacerlo fallar | Un tag sin publicar es legítimo: `SUITE-R06a` reserva publicar al firmante. Una compuerta que bloquea lo legítimo enseña a saltársela |
| Publicar para cuadrarlas | `npm publish` es acto del firmante (`SUITE-R06g`) y está fuera de este lote por su `§3` |
| Crear los tags que faltan | `SUITE-R06a`, y además 28 son de la historia temprana: retrofecharlas es `CE-014` |
| Escribir las cifras en un documento | Caducan al día siguiente — `CE-010`, que este lote ya ha pagado dos veces |

## Alcance, y su límite declarado   `SUITE-R26`

**Dentro:** el comando que contrasta las cuatro y dice qué falta en cada dirección, con `SIN
EVALUAR` cuando npm no responde.

**Fuera, y consta:**
- **No se publica, no se etiqueta y no se retrofecha nada.**
- **No se promete que las cuatro coincidan**: es legítimo que un tag exista antes de publicar, y
  que una versión publicada hace meses no tenga entrada retroactiva (`SUITE-R09`, append-only).
- **Las 28 del `CHANGELOG` sin tag no se juzgan**: son de la historia temprana. Se cuentan.
- **No entra en `npm run verify`** todavía: consultar la red en cada corrida cambiaría el coste de
  una comprobación que hoy no lo tiene, y `SUITE-R22` declara soportado el proyecto sin red.
  Dónde se invoca es una decisión que se toma con el dato delante, no antes.

## El riesgo, y cómo se acota

El riesgo es **el falso hallazgo por falta de red**, que ya reproduje. Por eso su caso no es
opcional: sin red, el bloque de npm dice `SIN EVALUAR` y **no** enumera divergencias — y hay una
pareja que fija que las tres comparaciones locales **sí** se siguen dando.
