# `PT-201` — Hay comprobaciones que no pueden correr en local y el marco no lo declara

```yaml
---
id: PT-201
type: BUG
severity: S2
epic: EP-026
track: STANDARD
status: READY
phase: 1
created: 2026-08-28
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

Cerrando `EP-025`, **tres veces** `npm run verify` dio verde en local y la CI falló. Las tres veces
la CI tenía razón.

| Regla | Qué mide | Por qué no se reproduce en local |
|:---|:---|:---|
| `SUITE-R34` | último estado vs. último trabajo en `changes/` | Compara marcas de **commit**: antes de commitear el hecho **no existe** |
| `SUITE-R34` | que el bloque `ESTADO` no **contradiga** al registro | Se evalúa sobre lo commiteado |
| `SUITE-R51` | que el issue enlace por un **ref durable** | El ref no existe **hasta el `push`** |
| espejo | registro ↔ issues | Depende de la plataforma y de la rama por defecto |

## 2. Por qué es un defecto del marco   `[HUMANO]`

`SUITE-R01` dice que *«como en CI» dejó de ser una promesa y es una comprobación*: las dos listas se
contrastan en los dos sentidos.

**Y corren lo mismo.** Lo que cambia no es la lista de comandos: es que **algunas comprobaciones
miden hechos que sólo existen después de commitear o publicar**. Correr el mismo comando no basta
cuando el objeto medido todavía no ha nacido.

Eso no está declarado en ningún sitio, así que el verde local se lee como predicción de la CI — y no
lo es. Y un mensaje llegó a **mentir**: `SUITE-R34` dijo *«hubo trabajo en `changes/` después del
último estado»* cuando el estado **sí** estaba actualizado, sólo que sin commitear.

## 3. Cómo se arregla, y cómo NO

**No** quitando esas comprobaciones de `verify`: son correctas y necesarias.
**No** commiteando automáticamente para que pasen: sería fabricar el hecho para aprobar la medida.

**Sí** declarando cuáles son —`SUITE-R01` acota su promesa— y haciendo que **avisen** cuando corren
sobre un árbol sucio, en vez de dar un verde que no significa nada.

## 4. Lo que NO promete   `SUITE-R26`

No promete que el verde local pase a predecir la CI: **no puede**. Promete que se sepa **cuándo no
la predice**, que es lo contrario de suponerlo.

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | Las comprobaciones no reproducibles en local están **declaradas** | `TS-01` |
| `AC-02` | Sobre un árbol sucio, **avisan** en vez de dar verde | `TS-02` |
| `AC-03` | `SUITE-R01` dice dónde deja de valer su promesa | `TS-03` |

## Cómo termina   `FDGE-R53`

> Termina cuando: quien vea un verde local sepa, **sin preguntar**, si predice la CI o no.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la única del lote, resuelta el `2026-08-28`. `G3` sigue siendo humana
para todo `BUG` (`EXEC-R05`), y se pedirá con la evidencia delante.
