# PT-117 — Todo desenlace cita la parada que lo produjo

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-117
type: FEATURE
epic: EP-020
track: STANDARD
status: READY
phase: 1
created: 2026-08-22
structural: no
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «si no te lo digo, no lo harías... y esto es algo que se debe evitar y debe estar en esta EP»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Toda allocation creada desde el RIGE_DESDE de la regla declara `origen_parada`, y `tracker asignar` lo acepta y lo escribe | verify-fdge: allocation nueva sin origen_parada ⇒ error; anterior ⇒ ni se mira |
| AC-02 | El caso NOMBRADO por el firmante está cubierto: un defecto encontrado a mitad de trabajo NO se arregla en línea — se publica la parada y su desenlace abre el PT | un caso que comprueba que la clase de motivo «hallazgo» tiene desenlace «abre PT-NNN» y que verify-fdge lo exige |
| AC-03 | Un hook `Stop` en `.claude/settings.json` recuerda la parada pendiente, como segunda red y declarado como tal | el hook existe y su límite está escrito |
| AC-04 | Lo que NO se puede exigir se declara con su número, no se promete | audit/regla lo publican como hueco medido (SUITE-R26) |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: abrir trabajo nuevo sin haber publicado la parada que lo motivó falla mecánicamente.

## 4. Qué NO entra   `[AGENTE]`

- OUT: exigir la parada cuyo desenlace es «no se abre nada»: no deja rastro contra el que contrastar y se declara como hueco
- OUT: bloquear la conversación. La parada deja rastro; no pide permiso

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Esta tarea existe porque el firmante tuvo que decirlo.** El 2026-08-22 encontré un defecto abriendo `EP-020` y mi impulso fue arreglarlo en línea; hizo falta que el firmante escribiera «debes abrir el pt con el bug». Es la evidencia de la tarea y va en su intake, no en el chat.
- **Aquí está el límite honesto de la épica** (`SUITE-R26`): lo mecanizable es el desenlace que deja rastro. La parada sin desenlace depende del hook y del agente, y eso se dice.
