# `PT-117` — Tareas   `PHASE 4`   `FDGE-R16`

Cada una con objetivo único, input, output y método de validación.

---

## T-01 · `asignar` escribe `suite_version` en la allocation

- **Objetivo:** que una allocation recién creada declare bajo qué versión nace.
- **Input:** `docs/methodology/tools/tracker.mjs` · función `asignar`.
- **Output:** la allocation lleva `suite_version` con la versión vigente, derivada de `CHANGELOG.md`.
- **Por qué es la primera:** sin ella `RIGE_DESDE` cae a `'0.0.0'` sobre la allocation sin intake,
  y la comprobación de `T-03` sería **verde por construcción sobre su propio caso de uso**.
- **Validación:** un caso comprueba que la allocation nace con `suite_version`; su inversa,
  que el campo no se inventa cuando la versión no se puede leer.

## T-02 · `parada --desenlace abre` escribe `origen_parada` en la allocation que nace

- **Objetivo:** que el enlace entre una allocation y la parada que la produjo sea un **hecho del
  registro**, no una nota que hay que leer.
- **Input:** `tracker.mjs` · función `parada`, que ya valida `--abre` contra el registro.
- **Output:** `origen_parada: { de, motivo, fecha }` en la allocation citada por `--abre`.
- **Orden dentro del acto:** el registro se guarda **antes** de publicar. Lo reversible primero,
  lo irreversible al final — contrato de `avanzar` (`PT-053`) y el que `PT-132` arregló en `abrir`.
- **Validación:** un caso sobre el cuerpo; otro que comprueba que si la publicación no puede
  ocurrir, **no queda** un `origen_parada` escrito sobre una parada que nadie publicó.

## T-03 · `verify-fdge` exige `origen_parada` en la allocation alcanzada

- **Objetivo:** que abrir trabajo nuevo sin publicar la parada que lo motivó **falle**.
- **Input:** `verify-fdge.mjs` · `checkPT`, junto a las demás comprobaciones con `rige(...)`.
- **Output:** error `FDGE-R55` cuando la allocation está alcanzada y no lleva `origen_parada`.
- **Alcance:** `rige('FDGE-R55')`, que ya vale `[13,0,0]` en `RIGE_DESDE`. Lo anterior **ni se mira**.
- **Colocación:** después de la línea que define `rige`. `PT-103` dejó escrito que una
  comprobación puesta antes revienta la herramienta entera.
- **Validación:** un caso con allocation alcanzada y sin campo ⇒ falla; su inversa con
  `suite_version` anterior ⇒ **silencio**, no se retrofecha.

## T-04 · `verify-suite` compara las dos listas con `LEXICON` §8.5

- **Objetivo:** saldar la deuda que `PT-116` declaró y trasladó aquí.
- **Input:** `verify-suite.mjs` · la comparación que `PT-124` construyó para `TIPOS_DE_ITEM`.
- **Output:** falla si `MOTIVOS_DE_PARADA` o `DESENLACES_DE_PARADA` divergen de `LEXICON` §8.5.
- **Validación:** un caso que **rompe el fixture** —quita una clase del `LEXICON` de prueba— y
  exige el rojo. No se asserta sobre el fuente (`PT-124`, y lo que `PT-116` tuvo que rehacer).

## T-05 · El hook `Stop`, con su límite escrito

- **Objetivo:** segunda red, declarada como tal.
- **Input:** `.claude/settings.json`.
- **Output:** el hook recuerda la parada pendiente, **y** un documento dice que vive fuera del
  paquete y que un proyecto destino que instale cauce **no lo recibe**.
- **Validación:** el hook existe y su límite está escrito. No se le mide eficacia: no la tiene
  fuera de esta máquina, y decirlo es el punto.

## T-06 · El hueco se publica con su cifra

- **Objetivo:** que lo no exigible conste medido, no prometido (`SUITE-R26`).
- **Input:** `RULES.md` `FDGE-R55` ya lo declara; falta que `regla`/`audit` lo publiquen.
- **Output:** el hueco aparece al consultar la regla, con el número de desenlaces exigibles
  frente al total.
- **Validación:** un caso que exige que la cifra salga **derivada**, no escrita a mano — la
  lección de `PT-115`: *atar una aserción a una cifra que crece*.
