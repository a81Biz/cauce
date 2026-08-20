# PT-084 — La plataforma es opcional o no lo es

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-084
type: BUG
epic: EP-017
track: STANDARD
status: INTEGRATED
phase: 9
created: 2026-08-19
structural: no
suite_version: 10.0.0
severity: S1
---
```

## 1. Qué está pasando   `[HUMANO]`

Un proyecto que **no declara plataforma** no puede avanzar ni una fase.

Encontrado ejecutando `PT-072` sobre un proyecto nuevo real, y **sólo porque no declaré
plataforma a propósito**: declararla habría hecho que todo fluyera y habría ocultado esto.

## 2. La cadena, medida

```
tracker avanzar   →  exige --nota          «avanzar exige --nota con contenido» (FDGE-R52)
--nota            →  exige issue           «PT-001 no tiene issue: la nota no tendria donde ir»
issue             →  exige plataforma      «sin plataforma con la que comentar, la nota no
                                            tiene donde ir. avanzar la EXIGE (FDGE-R52)»
```

Y `FDGE-R52` hace de `avanzar` **la única forma sancionada** de cambiar de fase: el `HANDOFF` lo
tiene en su `no hacer` — *«avanzar de fase a mano editando `REGISTRY.phase`: existe `tracker
avanzar`, que hace los CINCO actos o no hace ninguno»*.

## 3. Lo que el marco promete, y que es falso

| Dónde | Qué dice |
|:---|:---|
| `SUITE-R22` | declara **soportado** el equipo de una sola persona asistida por IA |
| `migrate` | «**OPCIONAL** — declarar plataforma de trabajo… **Sin ella no cambia nada**» |
| `CLAUDE.md` de un destino | puede no declararla; nada obliga |

**«Sin ella no cambia nada» es falso.** Sin ella no se avanza ni una fase, y por tanto no se
recorre ninguna tarea.

## 4. Por qué es `S1`

No es una molestia: es la diferencia entre que el marco sirva o no sirva a un proyecto que no
quiere tablero. Y el marco **dice tres veces** que sirve.

Y hay un agravante de honestidad: en `PT-072` moví las nueve fases editando el registro, que es
justo lo que `FDGE-R52` existe para impedir. Está declarado, pero la salida honesta no puede ser
«incumple la regla y lo dice».

## 5. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Sin plataforma, `avanzar` **funciona** | caso con `plataforma` ausente: la fase cambia |
| AC-02 | La nota **no se pierde**: va a algún sitio duradero | queda en un ledger del repositorio, no en el aire |
| AC-03 | Con plataforma, el comportamiento **no cambia** | los casos actuales siguen verdes: la nota va al issue |
| AC-04 | `avanzar` sigue exigiendo `--nota` | `FDGE-R52` intacta: el acto que se olvida sigue siendo obligatorio |
| AC-05 | `migrate` deja de prometer lo que no cumple | si la plataforma sigue cambiando algo, se dice qué |
| AC-06 | Un proyecto sin tablero recorre un `PT` entero | reejecutado sobre el proyecto de `PT-072` |

## 6. La decisión que NO toma esta tarea

**No convierte la plataforma en obligatoria.** Sería la salida fácil y rompería `SUITE-R22`, que
es una promesa del marco, no un detalle. La nota tiene que poder vivir sin tablero.

Dónde vive es lo que hay que decidir, y hay un candidato natural: el `SESSION_LOG.md` o un ledger
propio de transiciones, append-only (`SUITE-R09`), que es donde ya viven los hechos que no tienen
plataforma. Se propone en `PHASE 4`, no aquí.

## 7. Cómo termina   `FDGE-R53`

> Termina cuando: un proyecto sin plataforma declarada recorre las nueve fases de un `PT` con
> `tracker avanzar`, la nota queda registrada de forma duradera, y con plataforma nada cambia.

## 8. Qué NO entra   `[AGENTE]`

- OUT: Quitar la obligación de `--nota`. Es `FDGE-R52` y es correcta: el acto que se olvida.
- OUT: Un adaptador nuevo de plataforma. `PT-025` es otra cosa.
- OUT: Los otros seis huecos de `PT-072`. `H6` es `PT-083`; el resto van a `PT-073`.

## 9. Firma

```
Firmado por lote: EP-017
```
