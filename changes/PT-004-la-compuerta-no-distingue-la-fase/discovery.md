# PT-004 — Discovery   `PHASE 2` · análisis `2-B` (bug)

## Qué

`verify-fdge` exige a un PT artefactos que produce una fase que ese PT todavía no ha
alcanzado, y falla. Como CI ejecuta `verify-fdge --all`, abrir trabajo correctamente pone el
job en rojo.

## Dónde

[`docs/methodology/tools/verify-fdge.mjs`](../../docs/methodology/tools/verify-fdge.mjs), dos
puntos dentro de `checkPT()`:

| Línea | Comprobación | Artefacto exigido | Fase que lo produce |
|:---|:---|:---|:---|
| `792-793` | `FDGE-R42` | `discovery.md` | `PHASE 2` |
| `808-811` | `FDGE-R15` | `traceability.md` | `PHASE 4` |

## Cuándo

Desde que el PT existe con su `intake.md` firmado. Es decir: **desde el instante en que
`PHASE 1` se ejecuta correctamente**. No hay ventana en la que un PT recién abierto pase.

## Cómo se reproduce

```
$ node docs/methodology/tools/verify-fdge.mjs --all
✗ FDGE-R15   PT-001: falta changes/PT-001-el-espejo-en-las-compuertas/traceability.md
✗ FDGE-R15   PT-002: falta changes/PT-002-cobertura-por-regla/traceability.md
✗ FDGE-R42   PT-003: falta changes/PT-003-el-contrato-de-la-plataforma/discovery.md
3 error(es).   exit 1
```

Ejecutado el 2026-08-13 sobre este repositorio, con los tres PTs en `PHASE 1`, sus intakes
firmados y sus líneas de índice escritas. Antes de abrir `EP-001`, el mismo comando salía
«Sin errores. PTs verificados: 0» — el verificador nunca había visto un PT en este
repositorio.

## Por qué — causa raíz, con evidencia

**No es que falte la noción de fase: es que existe y no se aplica en estos dos puntos.**

`checkPT()` calcula la fase en la línea `757`:

```js
const fase = Number(intake.match(RE_PHASE_YAML)?.[1] ?? enRegistroPT?.phase ?? 0);
```

y la usa **solo** para `FDGE-R52` (bitácora de reanclaje). Las comprobaciones de artefactos no
la miran. Que la ausencia sea un descuido y no una decisión lo prueba el propio código, que
sí razona por fases para las **columnas** de la matriz, con el comentario escrito al lado:

```js
// AC y TS se exigen desde PHASE 4.
if (isEmptyCell(r.ts)) fail('FDGE-R15', …);
// Test y Evidencia solo desde PHASE 6 — antes están legítimamente vacías.
if (!afterPhase6) continue;
```

`afterPhase6` no se deriva de la fase declarada, sino de la existencia de `manifest.json`
(línea `806`): la fase se **infiere de un artefacto**. Ese patrón funciona para `PHASE 6`
porque el manifiesto es su producto característico, y **no puede funcionar** para la
existencia de `traceability.md`, porque ahí el artefacto cuya presencia habría que inferir es
justamente el que se está comprobando. La condición se vuelve circular y por eso se resolvió
exigiéndolo siempre.

**Hipótesis descartada:** que el defecto viniera de que este repositorio no declara `phase` en
sus allocations. Descartada — el fallback `?? 0` lo cubre y no habría fallo; los dos puntos no
consultan `fase` en absoluto.

**Hipótesis descartada:** que `--all` sea más estricto que la verificación por PT. Descartada
— la misma función `checkPT()` sirve a los dos modos.

## Impacto

| | |
|:---|:---|
| Severidad declarada | `S2` — flujo crítico degradado con workaround |
| Workaround existente | ignorar el rojo de CI, o no abrir PTs |
| Alcance | **todo proyecto con la suite instalada**, no solo este. `LEX-R25`: el archivo viaja en el paquete |
| Por qué no se había visto | este repositorio se autoalojó el 2026-08-13 y no había abierto ningún PT. En el proyecto legado que motivó la sesión, todos los PTs revisados están en `PHASE 8` o posteriores |

El workaround es exactamente el daño: una compuerta que se pone roja sobre comportamiento
correcto entrena a ignorarla, y el día que se ponga roja por un motivo real nadie mirará. Es
el razonamiento que motivó `SECRETOS-EXCEPCIONES.md` en 5.2.2, aplicado a otra compuerta.

## Lo que queda por determinar — entra en `PHASE 3`

**De dónde sale la fase de un PT.** Hoy hay tres candidatos y ninguno es autoritativo:

1. `phase:` en el YAML del `intake.md` — la plantilla `TAREA.md` **no lo incluye**, así que
   hoy ningún PT abierto con ella lo declara
2. `phase` en la allocation de `REGISTRY.json` — el instalador no lo siembra y este
   repositorio no lo tiene
3. inferencia por artefactos presentes — es lo que se hace hoy para `PHASE 6`, y es lo que
   produce la circularidad descrita arriba

Decidirlo es `PHASE 3`, y arrastra dos consecuencias que la estrategia tiene que resolver:

- si la fase se declara, **quién la escribe y cuándo** — un campo que nadie actualiza es peor
  que no tenerlo, porque el verificador se apoyaría en un dato muerto
- qué pasa con un PT que **no** declara fase: `RULE-06` prohíbe inventarle un valor por
  defecto que lo haga pasar. Lo no comprobable se declara no evaluable, y eso tiene que ser
  visible en la salida, no un silencio

## Conclusión

Defecto confirmado, localizado y reproducible. Causa raíz determinada: la fase se calcula y
no se consulta en las dos comprobaciones de existencia de artefactos. La corrección no
requiere relajar `FDGE-R15` ni `FDGE-R42` —los artefactos siguen siendo obligatorios—, solo
condicionar **cuándo** se exigen.

Confianzas: RootCause 95 % · Architecture 85 % · Solution 70 % (declaradas en
[context.md](context.md)). Ninguna por debajo del 70 %: el PT sigue como `BUG` y no se
reclasifica a `INVESTIGATION` (`FDGE-R09`).

**Siguiente:** `PHASE 3` — estrategia, con la decisión sobre el origen de la fase y al menos
una alternativa evaluada. No se toca código antes de `G2` (`FDGE-R13`).
