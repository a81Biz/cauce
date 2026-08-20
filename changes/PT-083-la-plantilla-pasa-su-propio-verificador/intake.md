# PT-083 — La plantilla que distribuye el paquete pasa su propio verificador

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-083
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

Quien instala el paquete, copia la plantilla que **el paquete trae** y la rellena, **falla
`FDGE-R04`**.

No es un caso raro. Es el camino que el `MANUAL` describe.

## 2. El defecto, exacto

`BUG-REPORT.md`, distribuida en el paquete:

```yaml
severity: S2               # [HUMANO] S1 | S2 | S3 | S4
```

`verify-fdge.mjs`:

```js
const RE_SEVERITY = /^\s*severity:\s*(S[1-4])\s*$/im;
```

El `$` exige fin de línea inmediatamente después de `S2`. El comentario que trae la plantilla lo
rompe, y el mensaje acusa de no declarar la severidad a quien **sí** la declaró:

```
✗ FDGE-R04   PT-001: intake.md no declara severity: S1..S4 (la declara el humano, INTAKE-R04).
```

## 3. Lo que lo hace peor que un regex estricto

**Los demás campos sí toleran el comentario.** `type`, `track`, `status`, `phase` y `id` pasan con
su `# [AGENTE] …` detrás. Sólo `severity` no.

Así que no es una convención del marco —«los campos van limpios»— que la plantilla incumple. Es
**un campo incoherente con los otros cinco**, y no hay forma de que quien rellena lo adivine.

## 4. Encontrado ejecutando, no leyendo

Salió en `PT-072`, sobre un proyecto nuevo real, y sólo después de que yo cometiera el error de
al lado: escribí el intake **a mano** en vez de copiar la plantilla, fallé cuatro comprobaciones,
y **entonces** copié la plantilla —que es lo que el manual manda— y falló ésta.

Leyendo el regex nunca lo habría visto: hay que rellenar la plantilla para que salte.

## 5. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | La plantilla rellenada **tal cual** pasa `FDGE-R04` | caso con la línea literal de `BUG-REPORT.md` |
| AC-02 | El criterio es el mismo para los seis campos | ninguno tolera lo que otro rechaza |
| AC-03 | Una severidad **inválida** sigue fallando | `severity: S9` y `severity:` vacío no pasan |
| AC-04 | Las cuatro plantillas se comprueban, no sólo la de `BUG` | `FEATURE-REQUEST`, `CHANGE-REQUEST`, `EPIC-INTAKE`, `TAREA` |
| AC-05 | La comprobación es **mecánica** | un caso rellena cada plantilla y la pasa por `verify-fdge` |

## 6. `AC-05` es el que impide que vuelva

Arreglar el regex quita el síntoma. Lo que impide la próxima es un caso que **rellene cada
plantilla del paquete y la valide**: hoy no existe, y por eso una plantilla pudo divergir de su
verificador sin que nada lo dijera. Es `PT-075` otra vez —una regla sin verificador no ocurre—
aplicada a los artefactos que el paquete distribuye.

## 7. Cómo termina   `FDGE-R53`

> Termina cuando: las cuatro plantillas del paquete, rellenadas tal como se distribuyen, pasan
> `verify-fdge`, y existe un caso que lo comprueba para cada una.

## 8. Qué NO entra   `[AGENTE]`

- OUT: Reescribir las plantillas. Los comentarios en línea son **útiles** —dicen quién rellena
  qué— y quitarlos empeoraría la plantilla para arreglar el verificador. Se arregla quien lee.
- OUT: Relajar la validación de severidad. `AC-03` fija que `S9` y el vacío siguen fallando.
- OUT: Los otros seis huecos de `PT-072`. `H7` es `PT-084`; el resto van a `PT-073`.

## 9. Firma

```
Firmado por lote: EP-017
```
