# PT-074 — La compuerta de viabilidad necesita una fase que la abra

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-074
type: BUG
epic: EP-017
track: STANDARD
status: READY
phase: 5
created: 2026-08-19
structural: no
suite_version: 9.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «me hace falta la parte del cálculo de la sesión, no lo veo aplicado a ningún pt o ep y
> se supone que debería de estar. No quedó aplicado? no se usa? no lo sabes?»

## 2. Por qué no estaba aplicado

No fue solo un olvido del agente, aunque también lo fue. **Nada lo habría detectado:**

```
$ grep -c viabilidad CORE.md PHASES.md verify-fdge.mjs
CORE.md:0   PHASES.md:0   verify-fdge.mjs:0
```

`PT-059` la escribió como **compuerta** —`AC-02`: «en `MARGINAL` no se inician operaciones
grandes: solo lo atómico»; `AC-03`: «en `UNSAFE` no se ejecuta: checkpoint, handoff y
parada»— y `BLOCKED_BY_CONTEXT` existe en `LEXICON` y en el conjunto `VIVOS` de
`verify-fdge`. Pero **ninguna fase la abre**, así que la compuerta no se cumple ni se
incumple: no ocurre.

Es la misma forma que `FDGE-R19` describe de sí misma: *«el marco mandaba crear la rama
desde la primera versión, ningún verificador la miraba, y 46 tareas seguidas se
implementaron sobre la rama de integración sin que nada lo dijera»*.

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Alguna fase **nombra** la consulta de viabilidad | `CORE.md` y `PHASES.md` la citan en la fase que corresponda |
| AC-02 | El veredicto queda **registrado**, no solo consultado | una tarea que pasó por la compuerta lo declara donde se pueda auditar |
| AC-03 | `MARGINAL` y `UNSAFE` tienen consecuencia observable | `AC-02` y `AC-03` de `PT-059` dejan de ser texto sin punto de aplicación |
| AC-04 | `viabilidad` lee la marca de sesión **correcta** | deja de leer `SESSION.json`; hoy `tracker sesion` dice `41aeaa8` y `viabilidad` dice `258be16` |
| AC-05 | Algo falla si la compuerta vuelve a quedarse sin invocación | un caso que caiga si ninguna fase la nombra |
| AC-06 | El veredicto **se espeja** en la plataforma | `cuerpoDeIssue` lo incluye con su `medido_en`: hoy está en `REGISTRY` y es invisible desde GitHub, y `SUITE-R35` dice que el registro asigna y la plataforma espeja |

**`AC-04` depende de `PT-068`** y podría absorberse allí. Se deja aquí porque es el mismo
síntoma visto desde la compuerta, y porque separarlo permite cerrar `PT-068` sin esperar a
que se decida en qué fase entra la consulta.

## 4. Cómo termina   `FDGE-R53`

> Termina cuando: una fase del procedimiento invoca la consulta de viabilidad, su veredicto
> queda registrado de forma auditable, y un caso cae si esa invocación desaparece.

## 5. Qué NO entra   `[AGENTE]`

- OUT: medir el contexto disponible del modelo. El marco **no puede** y `SIN EVALUAR` es la respuesta honesta (decisión 4 del firmante).
- OUT: cambiar los umbrales de `SAFE`/`MARGINAL`/`UNSAFE`: se derivan y `PT-059` ya los fijó.
- OUT: hacer que la compuerta **prohíba** cuando falta un dato. `PT-059` lo declaró: bloquearía todo para siempre y se acabaría apagando.

## 6. Firma

```
Firmado por lote: EP-017
```
