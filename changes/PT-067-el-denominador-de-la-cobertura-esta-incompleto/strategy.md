# PT-067 — Estrategia   `PHASE 3`

## La decisión de fondo: de dónde sale el universo

`audit` deriva las reglas de una expresión regular propia. `regla.mjs` deriva las suyas de otra.
Son **dos fuentes del mismo hecho** (`SUITE-R38`), y ya divergieron: `PT-066` arregló la de
`regla.mjs` y la de `audit` se quedó como estaba. Arreglar aquí una tercera copia repetiría el
error una vez más.

**El universo se deriva una sola vez, en `patrones.mjs`**, que es el módulo que ya existe para
«los patrones críticos, con su contrato». `audit` y `regla` lo consumen.

| Opción | Por qué no |
|:---|:---|
| Ampliar el regex de `audit` in situ | Deja dos derivaciones y garantiza la próxima divergencia |
| Listar las 223 en un JSON | Un índice a mano que hay que acordarse de actualizar. `PT-069` existe porque eso ya falla |
| **Derivar en `patrones.mjs`** | ✅ Una fuente, contrato probado, y `regla.mjs` puede migrar después |

`regla.mjs` **no se migra en esta tarea**: funciona y está verificado desde `PT-066`. Se deja el
consumo listo y la migración se declara — cambiar dos herramientas a la vez es cómo se pierde
cuál de las dos rompió algo.

## Qué es «tener verificador»

Hoy: `t.includes(id)` sobre cualquier archivo de `tools/`. Eso convierte un comentario en prueba.

Tres criterios posibles:

| Criterio | Problema |
|:---|:---|
| Que el ID aparezca | el actual: 20 reglas cubiertas sólo por comentarios |
| Que aparezca en una línea que no sea comentario | mejor, pero un `const REGLA = 'FDGE-R17'` sin uso también pasaría |
| **Que aparezca en una línea que no sea comentario, y no sólo en `selftest.sh`** | ✅ el arnés prueba las herramientas; no corre en ninguna compuerta |

Me quedo con el tercero **y no invento un cuarto más listo**. Detectar «la cita está dentro de una
condición que puede fallar» es análisis estático de verdad, y `SUITE-R26` dice que esta métrica
aspira, no exige: una medida honesta y simple vale más que una sofisticada que nadie audita.
Lo que el criterio no puede afirmar se declara.

## Por qué la cifra va a BAJAR, y eso es el entregable

```
ANTES    114 / 183     ( 62 % )
DESPUES  ~ 96 / 223    ( ~43 % )
```

Bajar 19 puntos no es una regresión: es la primera vez que la cifra se mide sobre lo que el marco
dice tener. `SUITE-R26` **aspira**, así que nadie falla por el número — pero una cifra inflada
apaga la aspiración, y eso sí rompe algo.

La salida **dirá qué parte del cambio viene de ampliar el universo y qué parte de dejar de contar
menciones** (`AC-04`). Sin ese desglose, quien vea la caída pensará que se rompió algo.

## Orden de trabajo

1. `reglasDelMarco()` en `patrones.mjs`, con su contrato y sus casos.
2. `audit` la consume: `REGLAS_TODAS` deja de tener regex propio.
3. El criterio de «verificador» se endurece, y el desglose se imprime.
4. Los casos previos de `audit` en `selftest.sh` se revisan **uno a uno** — `PT-079` dejó claro
   que hacerlos pasar sin leerlos es cómo se pierde una intención.

## Riesgo declarado

`build-core` y `verify-suite` también leen `RULES.md` por su cuenta. **No se tocan aquí**: esta
tarea no puede convertirse en una migración de cinco herramientas. Queda dicho como deuda, y
`PT-080` —que nace de este mismo descubrimiento— trabaja sobre `verify-suite`.
