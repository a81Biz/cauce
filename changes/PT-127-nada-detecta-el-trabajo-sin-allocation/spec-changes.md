# `PT-127` — Cambios de especificación   `PHASE 4`

> Qué documento normativo cambia, y qué dice antes y después. `SUITE-R06e`: modificar
> `docs/methodology/` **no se automatiza** — se propone aquí y se resuelve en `G2`.

---

## Ningún documento normativo cambia su obligación

Y conviene decir por qué, porque es una respuesta que suele esconder trabajo no hecho:

**`FDGE-R19` ya exigía esto desde la `7.7.0`.** Su texto dice, literal: *«Formato obligatorio:
`<type>: PT-XXX <descripción específica>` con `type` ∈ `feat`·`fix`·`refactor`·`test`·`docs`·
`chore`»*. No faltaba la regla: faltaba **algo que la comprobara**.

Eso hace de `PT-127` un caso de `P-003` de la Declaración de Valor —*«cada regla HARD que declara
comprobación tiene un script que puede fallar»*— y no de `P-001`. La regla estaba bien escrita y
salía **gratis**: la mitad enunciada sobre el asunto del commit no la miraba nadie.

## Lo único que se toca en `RULES.md`

Una frase que registra que la mitad huérfana ya tiene verificador, y con qué alcance:

| | |
|:---|:---|
| **Antes** | La regla enuncia el formato del asunto y **nada lo comprueba**. Las tres comprobaciones que citan `FDGE-R19` miran el registro —la rama declarada, el usuario canónico, la topología—, no la historia |
| **Después** | Se añade: *«El formato del asunto lo comprueba `verify-fdge` sobre la ventana de commits recientes, cruzándolo con `REGISTRY.json`: un commit que toca ruta gobernada y no cita un `PT` vivo se nombra, agrupado por lo que dice. Avisa ahora y falla en `G4`»* |

**No se copian los tipos aquí**: siguen siendo los de la propia regla, y la herramienta los lee
de `TIPOS_DE_COMMIT` en `patrones.mjs` para no tener una segunda lista que diverja (`SUITE-R38`,
`LEX-R23`). Es la misma avería que `FDGE-R19` ya persigue en su párrafo sobre el `<type>` de rama.

## Lo que NO se propone tocar, y es la pregunta abierta

El detector midió que **15 commits de `EP-020` citan el lote** sin excepción declarada, y la
mayoría son trabajo *de lote* que no pertenece a ningún `PT`. Que `FDGE-R19` admita —o no— el
identificador del lote para ese trabajo **es una decisión sobre la regla**, no sobre la
herramienta, y cambiarla de paso aquí sería exactamente lo que `SUITE-R06e` reserva a `G2` con
una propuesta propia. Va a `PT-130`.

## Autoridad

`LEX-R21` · la obligación vive en `RULES.md` y ningún otro documento la enuncia.
`SUITE-R06e` · el cambio se propone; lo resuelve `G2`, delegado por lote con constancia en
`SESSION_LOG.md` del 2026-08-22.
