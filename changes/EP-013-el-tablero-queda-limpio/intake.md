# EP-013 — El tablero queda limpio

```yaml
---
id: EP-013
created: 2026-08-14
status: CLOSED
mode: SUPERVISED
origin: DIRECT
---
```

## 1. Objetivo común   `[HUMANO]`

> «revisa los PT abiertos todos y definamos para cerrar ya, con la excepción de la tarea de la
> migración que usa otro desarrollo. Necesito que estemos limpios y que sigas el marco de trabajo
> que hoy es la v 7.7.0»

Las ocho aplazadas que **sí se pueden cerrar**. Se hacen juntas porque son la misma pregunta
—«¿qué queda abierto porque hace falta, y qué queda abierto porque nadie lo decidió?»— y porque
cuatro de ellas llevaban entre tres y cinco lotes esperando una decisión que nunca se pidió.

Quedan fuera dos, y por motivos distintos que conviene no mezclar:

```
PT-019  la migracion de referencia   depende del proyecto legado, y ese lo trabaja
                                     el firmante. Se cierra cuando vaya, no antes
PT-025  el orden de cierre en Azure  el adaptador existe y NO HAY proyecto que lo
                                     ejercite. Escribir la guarda a ciegas seria
                                     codigo sin ejecucion, que es lo que este marco
                                     llama hueco declarado
```

## 2. Criterio de éxito del lote   `[HUMANO]`

El tablero queda con **dos** allocations vivas, y las dos porque dependen de algo que no está en
este repositorio. Ninguna sigue abierta por no haberse decidido.

## 3. Qué NO entra en el lote   `[HUMANO]`

```
OUT: PT-019 y PT-025, por lo dicho arriba
OUT: publicar. Decision humana explicita, sostenida en tres lotes
OUT: bajar a cero las 106 reglas sin verificador. La decision fue ACOTAR a las HARD
     que deciden algo; el resto queda como deuda MEDIDA, no como promesa
```

## 4. Firma única   `[HUMANO]`

```
Solicitado por: Alberto Martínez (delegada — «revisa los PT abiertos todos y definamos para
                cerrar ya», 2026-08-14; delegación de G1, G2 y G3 vigente desde 2026-08-14)
Fecha: 2026-08-14
He leído el Intake de cada PT listado en §5 y confirmo que todos reflejan mi intención: SÍ

Las cuatro decisiones que este lote ejecuta, tomadas por el firmante:
  PT-016  «phase» pasa a OBLIGATORIA, con migración. Rompe compatibilidad: MAJOR
  PT-047  rama por PT DE VERDAD. Cede el uso, no el marco
  PT-015  ACOTAR a las HARD que deciden algo; el resto, deuda medida
  las cinco pequeñas, en un solo lote

Estado: FIRMADA · G1 PASS
```

---

# A partir de aquí lo completa el agente

## 5. PTs que componen el lote   `[AGENTE]`

| Orden | PT | Tipo | Sev | Qué resuelve | Depende de |
|:--|:--|:--|:--|:--|:--|
| 1 | `PT-047` | BUG | S3 | Rama por PT: el marco lo manda y ningún PT lo hacía | — |
| 2 | `PT-016` | CHORE | S4 | `phase` obligatoria en el YAML, con su migración | `PT-047` |
| 3 | `PT-015` | CHORE | S4 | Verificador para las HARD que **deciden** y hoy no citan su ID | `PT-047` |
| 4 | `PT-048` | BUG | S3 | El issue de un `DEFERRED` enlaza a un directorio que no existe | `PT-047` |
| 5 | `PT-017` | CHORE | S4 | `migrate` deriva «qué llega nuevo» en vez de tenerlo escrito a mano | `PT-047` |
| 6 | `PT-020` | CHORE | S3 | El grafo cubre las herramientas, no solo `bin` | `PT-047` |
| 7 | `PT-023` | CHORE | S2 | Auditar qué más declaró `PT-018` y no hizo | `PT-047` |
| 8 | `PT-029` | CHORE | S2 | Buscar más choques entre reglas | `PT-023` |

**`PT-047` va primera y no es una preferencia:** cambia **cómo se ejecutan las otras siete**. Si
la rama por PT entra después, las siete se habrán hecho con el defecto que la octava corrige.

**`PT-029` va última** porque `PT-023` es su primer caso concreto: auditar lo que `PT-018`
declaró y no hizo enseña qué forma tiene el defecto que `PT-029` busca en general.

## 6. Análisis de solapamiento   `[AGENTE]`

```
RULES.md            PT-016 · PT-015 · PT-029           → SERIALIZADOS
tools/verify-fdge   PT-016 · PT-015                    → SERIALIZADOS
tools/tracker.mjs   PT-048                             → solo
tools/migrate.mjs   PT-017                             → solo
REGISTRY.graph      PT-020                             → solo
FDGE-Prompts.md     PT-023 (el hallazgo ya encontrado) → solo
PHASES · CLAUDE.md  PT-047                             → primero, y por eso solo

Ejecucion SECUENCIAL, en el orden de §5. Ningun par corre en paralelo.
```

## 7. Supuestos compartidos   `[AGENTE]`

```
- La rama por PT no cambia quien resuelve G4: sigue siendo humana (EXEC-R04). Lo que
  PT-047 tiene que resolver es la TOPOLOGIA —a donde mergea una rama de PT— y eso se
  decide en su PHASE 3, no aqui.
- PT-016 rompe compatibilidad. El lote sube MAJOR y escribe guia de migracion: los
  proyectos instalados dependen de ella (SUITE-R19).
- «Acotar» PT-015 significa reducir su alcance POR ESCRITO en su propio intake, no
  cerrarlo con menos de lo que decia. La diferencia se declara.
```

## 8. Observaciones del agente   `[AGENTE]`   `INTAKE-R07`

```
- Lote demasiado grande para una sola firma: ES EL RIESGO REAL. Ocho tareas, una de
  ellas MAJOR y otra que cambia como se ejecutan las otras siete. FDGE-R41 lo cubre
  —el primer BLOCKED detiene el lote entero— pero conviene decirlo antes: si PT-047
  resulta mas grande de lo que parece, se detienen ocho, no una.
- PT-023 YA tiene hallazgo, encontrado al revisar el tablero para escribir este intake:
  FDGE-Prompts.md cita SUITE-R44 pero OMITE el vocabulario cerrado y la reciprocidad,
  que es exactamente lo que PT-018 declaro que escribiria ahi. Es la segunda vez que
  PT-018 declara un cambio de especificacion que no hizo.
- PT-029 puede encontrar mas trabajo del que cabe en este lote. Si aparece, se aplaza
  con su allocation y su issue (SUITE-R44), no se mete a la fuerza.
```

## 9. Resultado de la compuerta `G1`   `[AGENTE]`

```
DoR-E1 objetivo común declarado                    [x]
DoR-E2 criterio de éxito del lote declarado        [x]
DoR-E3 out-of-scope del lote declarado             [x]
DoR-E4 firma única presente                        [x]
DoR-E5 EP asignado desde REGISTRY.json             [x]
DoR-E6 todos los PTs listados tienen su intake completo y firmado por lote  [x]
DoR-E7 solapamiento calculado y declarado en BACKLOG.md                     [x]
DoR-E8 observaciones registradas                   [x]

VEREDICTO: PASS
```

## Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` y número de versión — **`MAJOR`**, con guía de migración por `PT-016` | HECHO |
| Regenerar `CORE.md` | HECHO |
| Declarar en `10-Technical-Debt.md` lo que queda medido y no resuelto: las reglas sin verificador que `PT-015` no cubre | HECHO |
| Qué pasa con `PT-019` y `PT-025`, las dos que no entran | HECHO |

### Cómo se resolvió cada una   `SUITE-R45`

**1 · `CHANGELOG` 8.0.0 con guía de migración.** `MAJOR` por `SUITE-R08`: un proyecto instalado
con PTs vivos sin `phase` pasa de verde a rojo. La guía da los tres pasos, deriva la fase de lo
que hay en `changes/` cuando no se sabe, y dice explícitamente que **no se adivina hacia arriba**
—poner una fase no alcanzada apaga las comprobaciones que esa fase habilita, que es el defecto que
`PT-044` documentó—. `version.mjs --aplicar` alineó los 21 documentos y `package.json`.

**2 · `CORE.md` regenerado.** 244 reglas, ~24 046 tokens frente a ~76 890 de los documentos
completos: 69 % de reducción. `core:check` en verde.

**3 · La deuda, contada.** `TD-08` en `10-Technical-Debt.md`: **62 reglas sin verificador, 52 de
ellas `HARD`**, enumeradas con la herramienta y **separadas en tres grupos** —verificable y sin
escribir · verificable solo con el sistema delante · sobre el juicio de una persona—. Mezclarlas
habría convertido una decisión del firmante en un número que da miedo. El primer grupo es deuda
real; los otros dos son el límite de `SUITE-R26`, que dice «aspira, no exige».

**4 · `PT-019` y `PT-025` siguen `DEFERRED`, y los motivos son distintos.**

| PT | Por qué sigue fuera | Qué lo desbloquea |
|:---|:---|:---|
| `PT-019` (#26) | Depende del proyecto legado «Inteligencia de Mercados Energéticos Mexicanos», que es el **caso de prueba** del marco y lo trabaja el firmante | Que el firmante vaya allí a trabajar. Hasta entonces solo se ejecuta `migrate` **sin** `--apply` |
| `PT-025` (#35) | No existe un proyecto de Azure DevOps que lo ejercite. Escribir la guarda de cierre a ciegas sería código sin ejecución | Que aparezca un proyecto real en Azure |

No es la misma espera: uno aguarda a un proyecto **que existe**, el otro a uno **que no**.
Conviene no mezclarlos, porque el segundo podría no llegar nunca y eso también es una respuesta.

Los dos conservan su issue abierto (`SUITE-R44`: aplazar algo lo **pone** en el tablero, no lo
saca) y, desde `PT-048`, el cuerpo de ese issue dice que aún no tiene artefactos en vez de enlazar
a un directorio que no existe.

> El merge, la publicación y lo que se verifique después del cierre no son filas: `SUITE-R45`.

---

## Constancia de la compuerta `G4`   `EXEC-R04` · `SUITE-R06a`

```
G4 resuelta el 2026-08-15 por Alberto Martinez:

  «Cierra primero G4 de EP-013. Una vez integrado en main, sincroniza la rama de
   trabajo conforme al procedimiento existente, ejecuta la verificacion y, si queda
   verde, inicia PT-049. No modifiques el alcance de EP-014 ni adelantes tareas del
   lote.»

Pull request de «trabajo» a «main»: #93.
```

SUITE-R42 dice que el agente no abre ni fusiona el PR de la rama por defecto, y EXEC-R04 y
SUITE-R06a dejan el merge en manos humanas sin excepcion. Esto es una persona autorizando con
registro, que es lo que la regla de cumplimiento admite, y ocurrio igual en EP-011 (6eb9825) y
EP-012 (4dd9b01).

### Excepcion declarada, y por que

`--gate G4 EP-013` **bloqueo**, y no por una fila de este lote:

```
✓ SUITE-R45   EP-013: cierre del lote declarado y resuelto (4 fila(s))
✓ SUITE-R42   el merge se propone sobre un pull request abierto
✓ CI del PR #93: verify-fdge --all sin errores sobre 49 PT

✗ SUITE-R45   EP-014: 4 fila(s) de «## Cierre del lote» sin resolver en G4
```

`checkEpics()` recorre **todos** los `EP-*` de `changes/` y `enG4 = gate === 'G4'` es global, no
del lote que la compuerta evalua (`verify-fdge.mjs:640` y `:724`). Con eso, cerrar un lote exige
que **cualquier otro lote abierto** tenga resueltas unas filas que describen trabajo aun no hecho.

Es el **tercer caso** de la familia que `PT-029` catalogo: una comprobacion que hace imposible el
estado que otra regla obliga a atravesar. `FDGE-R49` contempla que haya un lote abierto mientras
ocurre otra cosa; `SUITE-R45` supone que el lote que cierra **es** el lote abierto. Esa suposicion
se cumplio en `EP-011`, `EP-012` y `EP-013` porque cada uno nacio despues de cerrar el anterior, y
se rompio al abrir `EP-014` antes de esta compuerta — decision del agente, señalada en el intake
de `EP-014` como precedente roto pero no vista como bloqueo.

**Lo que NO se hizo para desbloquearla.** `RE_RESUELTA` acepta cualquier `PT-nnn` en la celda, asi
que escribir «→ PT-053» en las cuatro filas de `EP-014` las habria dado por resueltas y la
compuerta se habria puesto verde. Eso es «fabricar artefactos para poner una compuerta en verde»,
que esta en el «no hacer» del `HANDOFF`.

**Lo que se hizo.** El firmante autorizo la excepcion sabiendo cual era, y el defecto queda
**registrado como `PT-055`**, `DEFERRED`, con su issue abierto (`SUITE-R44`: aplazar algo lo pone
en el tablero). Arreglarlo aqui habria expandido `EP-014`, que el firmante prohibio en el mismo
acto.

Es el mismo patron que la `G4` de `EP-011`: integrar con una comprobacion en rojo, **declarada** y
abierta como allocation — entonces fue `PT-046`, y ese `PT-046` acabo cerrando el callejon que lo
motivo.
