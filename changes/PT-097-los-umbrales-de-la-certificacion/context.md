# Context — `PT-097`

> `PHASE 2`. Qué se leyó, qué dice, y con cuánta confianza se afirma.

## 1. Qué se leyó

| Fuente | Para qué | Estado |
|:---|:---|:---|
| `PTSA-V3-Especificacion-Oficial.md` | entera, y en particular `§13`, `§14`, `§15`, `§24`, `§26` | vigente |
| `PTSA-R08` `R24` `R26` `R30` `R54` | qué exige cada una y dónde vive | vigente |
| `CORE-PTSA.md` | qué carga el agente con `[START PTSA]` | **generado** — no se edita (`SUITE-R16`) |
| `tools/verify-ptsa.mjs` | qué comprueba hoy | **no menciona la certificación** |
| `PTSA/RESUMEN.md` · `score-history.json` | la letra publicada y su justificación | contiene la banda inventada |
| `PTSA/Findings/H-001..H-009` | impacto × probabilidad de cada hallazgo | leídos, ninguno `CRÍTICO` |
| `PTSA/Phases/PHASE-00-14-corrida.md` | si `PHASE 0` declaró umbrales | **no declara ninguno** |
| `INC-007` del proyecto legado | la medición independiente del mismo hueco | 2026-08-21 |
| `CHANGELOG.md:65` | dónde se apoya la letra publicada | cita la `B` |

## 2. Lo que la especificación **sí** define

```
§13.2   Health = (D1×0.30)+(D2×0.30)+(D3×0.30)+(D4×0.10)
§13.3   cap de dominio: si D1 < 60  ->  Health = min(Health, D1)        <- ANCLA 60
§14.2   riesgo(h) = Impacto × Probabilidad  ∈ [1,16]
§14.3   niveles de hallazgo: 1-3 BAJO · 4-7 MEDIO · 8-11 ALTO · 12-16 CRITICO
§14.4   Risk = min(100, Σ riesgo(h) × 4)
§14.5   niveles de sistema: 0-15 · 16-40 · 41-70 · 71-100
§15.3   Confidence = coverage×0.40 + freshness×0.25 + validez×0.20 + autonomia×0.15
§15.6   «Un Health A con Confidence < 90 NO obtiene A»                  <- ANCLA 90
```

## 3. Lo que **no** define, y es el hueco

**La función `f(Health, Risk, Confidence, health_unstable) -> A|B|C|F`**, que `PTSA-R54` manda
calcular y `PTSA-R08` manda emitir.

`§24` existe —línea `958`— y es *«Reglas de transición»*: la tabla de estados de un **producto**
(`DRAFT → READY → CLOSED …`), con `PTSA-R38` y `PTSA-R39`. No tiene subsecciones. `§24.2` y
`§24.4` se citan desde `§15.6` y `§13.4` y no existen.

## 4. Los cuatro topes, y por qué son el dato clave

```
PTSA-R30   (:725)   freshness = UNKNOWN            ->  no por encima de C
§13.4      (:569)   health_unstable = true         ->  no por encima de B    [cita §24.4]
§15.6      (:744)   Health A con Confidence < 90   ->  no obtiene A          [cita §24.2]
§26        (:1058)  hallazgo CRITICO (12-16)       ->  bloquea >= B
```

**Los cuatro son rebajas.** El documento especifica con detalle cómo **empeorar** una letra que
nunca dice cómo se obtiene — y eso, leído al revés, es la pista: dos de los cuatro nombran la `C`,
y ninguno la define como rango.

## 5. Confianzas — `FDGE-R09`

```
RootCause     98%   no es una inferencia: las secciones no existen y se comprueba con un
                    grep. Medido ademas por un SEGUNDO proyecto de forma independiente
                    (INC-007 del legado) y en las DOS versiones.

Architecture  90%   dos secciones nuevas en un documento, una funcion pura en verify-ptsa
                    y su bateria. No toca pesos ni formulas. -10 porque CORE-PTSA.md es
                    GENERADO y hay que regenerarlo (SUITE-R25, SUITE-R16): tocar el
                    generador y no el generado, o al reves, es un error clasico aqui.

Solution      85%   la funcion se DERIVA entera de lo escrito, que es un criterio mas
                    fuerte que «parece razonable». -15 por una decision que no es
                    derivable y hay que tomar explicitamente: que ocurre cuando falta un
                    dato. Ver §6.
```

Los tres por encima de `70%`: **no procede `INVESTIGATION`** (`FDGE-R09`).

## 6. Lo único que no se deriva, y hay que decidir

**Qué pasa cuando un dato no está.** Si `freshness` es desconocida hay tope `C`; ¿y si falta
`Confidence`, o si no hay hallazgos evaluados?

La especificación no lo dice, y hay dos salidas:

```
(a) tratar el dato ausente como el PEOR valor    ->  la letra sale siempre, y miente hacia abajo
(b) NO emitir letra y publicar los tres scores   ->  lo que hizo el proyecto legado
```

**Se propondrá `(b)` en `PHASE 3`**, y el motivo no es prudencia: `RULE-06` —*«no saber no es
permiso»*— y el precedente que el propio marco fijó en `LEXICON 6.5d` con `SIN EVALUAR`, donde
tratar un hueco como un cero *«convierte un olvido en un dato válido que se propaga»*.

`PT-058` lo midió en el presupuesto de sesión: `restar(100 MEDIDO, SIN EVALUAR)` devolvía `100`
**etiquetado como medido**. Aquí sería peor: una letra es lo único que un stakeholder lee.

## 7. Lo que este contexto NO establece

- **Que `B` sea la letra correcta de `PTSA-2026-08-20`.** Se ha calculado con la función propuesta
  y da `B`, pero la función no está aprobada hasta `G2`. Si en `PHASE 3` cambia, la letra se
  recalcula otra vez y se dice.
- **Que no haya un quinto tope escrito en algún sitio.** Se buscó por `certificac`, por `§24.` y
  por las palabras de los cuatro conocidos; aparecieron cuatro. Un quinto redactado con otras
  palabras no se puede descartar leyendo, y por eso `AC-05` pone la comprobación en el
  verificador: lo que no esté en la función, fallará cuando alguien lo aplique a mano.
- **Que `Risk` participe en la letra.** Hoy **no** aparece en ninguno de los cuatro topes, y
  `§14.5` le da sus propias bandas. Meterlo sería añadir criterio, no derivarlo.
