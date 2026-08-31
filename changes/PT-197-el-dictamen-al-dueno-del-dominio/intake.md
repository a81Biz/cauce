# `PT-197` — DICTAMEN: el septimo componente y el entregable ejecutivo al dueno del dominio

```yaml
---
id: PT-197
type: FEATURE
severity: S2
epic: EP-026
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-28
structural: no
suite_version: 13.4.0
---
```

## 1. De dónde viene   `[MEDIDO]`

De `EP-023`, admitido el `2026-08-24` con `G1` **`CHALLENGE`**: el agente objetó que el lote **no
estaba descompuesto** (`DoR-E6`) y el firmante ordenó admitirlo igualmente, *«para que no se me
olvide»*.

Cuatro días después seguía con **cero tareas**, y sus cuatro filas de cierre en `PENDIENTE`
**bloquearon el `G4` de `EP-025`**. `EP-023` se aplazó con reentrada, fecha y dueño (`SUITE-R44`), y
su trabajo es esta tarea.

**El `CHALLENGE` tenía razón**, y ésa es la primera cosa que este intake registra: el hueco no
desapareció del registro — reapareció en la compuerta de otro lote.

## 2. Qué es el Dictamen   `[HUMANO]`

El **séptimo componente**: el entregable ejecutivo al dueño del dominio. Los seis actuales —FIDE,
Foundation, FDGE, FQAGE, PTSA, FPGE— gobiernan **cómo se construye**. Ninguno produce el documento
que responde, a quien paga y decide, **qué se ha construido y si sirve**.

`PT-149` ya dejó **probado** que un componente se da de alta sin tocar herramienta, que era su
precondición técnica.

## 3. Por qué va la ÚLTIMA del lote, y por qué es la que peor encaja

**Es la única `FEATURE`** entre trece tareas. El criterio de éxito de `EP-026` —que nada dé verde sin
mirar— **no la cubre**, y eso está declarado en `§8` del intake del lote: cerrarla no demuestra nada
sobre el objetivo del lote.

Está aquí porque el firmante decidió no abrir un lote nuevo, y va última por un motivo que sí es del
lote: **construir el Dictamen sobre un marco cuya verificación todavía miente sería auditar con una
regla torcida.** Las doce anteriores enderezan la regla.

## 4. Lo que este intake NO puede afirmar   `SUITE-R26`

**No sabe todavía qué hace válido un Dictamen.** Eso es lo que `FND-R24` dice que el agente no puede
redactar: describirá lo que el producto entrega, pero si sirve o no lo sabe quien conoce el negocio.
La especificación del componente **empieza** por una decisión del firmante, y este intake lo declara
en vez de suponerla.

Por eso los `AC` de abajo son de **forma**, no de contenido: lo que el Dictamen debe decir se
decide en `PHASE 2`, con el firmante.

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | El Dictamen existe como **componente declarado**, sin tocar herramienta (`PT-149`) | `TS-01` |
| `AC-02` | Tiene su especificación, su trigger y su sitio en `CASOS-DE-USO.md` | `TS-02` |
| `AC-03` | Produce **un** entregable sobre este repositorio, y el firmante dice si sirve | `TS-03` |

`AC-03` es la única evidencia posible de que el componente vale: `EP-023` ya lo había escrito —«es
`T5`, y es la única evidencia de que el componente sirve»— y se conserva.

## Cómo termina   `FDGE-R53`

> Termina cuando: el dueño del dominio puede leer **un** documento y saber qué se construyó y si
> sirve, y ese documento lo produce el marco y no una sesión.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la única del lote, resuelta el `2026-08-28`. `G3` sigue siendo humana
para todo `BUG` (`EXEC-R05`), y se pedirá con la evidencia delante.
