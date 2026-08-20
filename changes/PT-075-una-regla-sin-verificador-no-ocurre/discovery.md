# PT-075 — Descubrimiento   `PHASE 2-B`

## `A` · La viabilidad tiene vocabulario, estado y herramienta. No tiene regla.

Las cuatro piezas, y la que falta:

| Pieza | Dónde | ¿Existe? |
|:---|:---|:---|
| El vocabulario `SAFE`/`MARGINAL`/`UNSAFE` | `LEXICON` §6.5d | **sí** |
| El estado `BLOCKED_BY_CONTEXT` | `LEXICON` §6.4 y el conjunto `VIVOS` de `verify-fdge` | **sí** |
| La herramienta que lo calcula | `tracker viabilidad` | **sí** |
| **La regla que obliga a consultarlo** | `RULES.md` | **NO** |

```
$ grep -c "viabilidad" RULES.md CORE.md PHASES.md verify-fdge.mjs
RULES.md:0   CORE.md:0   PHASES.md:0   verify-fdge.mjs:0
```

`LEX-R22` es explícita: **ningún documento enuncia obligaciones salvo `RULES.md`; los demás las
citan por ID**. `LEXICON` §6.5d describe qué significa cada veredicto, que es su trabajo — pero
describir un veredicto no obliga a pedirlo. Así que la compuerta que `PT-059` diseñó no tiene
regla que la exija, ni fase que la abra, ni verificador que la eche en falta.

**Consecuencia medida:** `EP-017` se abrió con diez tareas sin consultarla. Al ejecutarla
después, `PT-072` y `PT-019` —las dos pruebas— salen `MARGINAL`.

## `B` · `SUITE-R42` está bien escrita. Su verificador comprueba la otra mitad.

La regla dice dos cosas:

1. «`G4` se resuelve sobre un **pull request abierto** para la rama por defecto»
2. «**El agente no abre el PR ni lo fusiona** — comprueba que exista»

`verify-fdge` implementa la primera y **sólo la primera**
([:1345-1353](../../docs/methodology/tools/verify-fdge.mjs#L1345-L1353)). Sus cuatro emisiones son
`no hay pull request abierto`, `no se pudo comprobar` y `el merge se propone sobre un PR
abierto`. Ninguna mira **quién** lo abrió, ni si el agente escribió en la plataforma.

**Consecuencia medida:** el agente empujó `trabajo` dos veces como acto fuera de fase. Ninguna
comprobación lo vio.

## Qué es y qué no es comprobable en `B`

Esto decide el alcance, y se escribe antes de programar nada (`AC-06`):

| Afirmación | ¿Comprobable desde el repositorio? |
|:---|:---|
| «este PT se implementó directamente sobre la rama de integración» | **SÍ.** `git log trabajo --first-parent --no-merges` da las escrituras directas; `duenoDe(asunto)` las atribuye |
| «existe el comando descrito que `EXEC-R07` exige» | **SÍ.** Es un artefacto: está o no está |
| «quién abrió este pull request» | **NO de forma concluyente.** El agente actúa con la identidad git de la persona: `gh pr view --json author` devuelve el mismo login en los dos casos |

La tercera se **declara** en `10-Technical-Debt`, no se finge. `PT-023` midió que un verificador
equivocado tres de cada cuatro veces es peor que ninguno: se silencia y ocupa el sitio del que
haría falta.

## Familia

El mismo patrón, por tercera vez documentada en este repositorio:

- `FDGE-R19`: *«el marco mandaba crear la rama desde la primera versión, ningún verificador la
  miraba, y 46 tareas seguidas se implementaron sobre la rama de integración»*
- `EXEC-R14`: en vigor desde `PT-043`, declarada ausente, **ninguna herramienta la emite**
- y estas dos

En los tres casos la regla estaba escrita y era correcta. Lo que faltaba era que algo la
ejecutara.
