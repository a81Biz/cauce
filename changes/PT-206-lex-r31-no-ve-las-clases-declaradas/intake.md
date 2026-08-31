# `PT-206` — `LEX-R31` no ve el 76 % de las clases que sí se declaran

```yaml
---
id: PT-206
type: BUG
severity: S3
epic: EP-026
track: STANDARD
status: DRAFT
phase: 8
created: 2026-08-30
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

```
! LEX-R31  PT-203: su entrada de HISTORY.log no declara «Clase de evento: CE-NNN».
```

**Y sí la declara**, en su cabecera: `Clase de evento: CE-005 — verde por no haber mirado`.

```
entradas que DECLARAN una clase :  71
que LEX-R31 llega a ver         :  17
invisibles para la regla        :  54   (76 %)
```

**Tres de cada cuatro entradas que cumplen la regla salen como incumpliéndola.**

## 2. Por qué   `[HUMANO]`

```js
const clase = campo(/^Clase de evento:\s*(CE-\d{3})\s*$/im);   // verify-fdge.mjs:2847
//                                                    ^^^^      exige FIN DE LINEA
```

La convención **mayoritaria del propio `HISTORY.log`** es `CE-NNN — descripción`, y el `\s*$` no la
admite.

## 3. Es el defecto de `PT-198`, en otra herramienta

| | `PT-198` | aquí |
|:---|:---|:---|
| El regex | `/^status:[ \t]*\S+[ \t]*$/m` | `/^Clase de evento:\s*(CE-\d{3})\s*$/im` |
| Lo que rompe | `status: READY  # comentario` | `Clase de evento: CE-005 — descripción` |
| El mensaje | «no declara `status`» | «no declara `Clase de evento`» |
| La verdad | **Lo declara** | **Lo declara** |

**Y `eventos.mjs` sí las cuenta**: clasificó 148 instancias. El mismo hecho se lee de dos formas en
dos herramientas y una se equivoca — `SUITE-R38`, la regla que `PT-198` invocó para llevar el
patrón a `patrones.mjs`.

## 4. Por qué `PT-198` no lo cazó

Midió **`tracker.mjs`** —siete expresiones sobre cuatro campos— y su `discovery` declaró: *«ningún
otro `.mjs` de `tools/` los tiene»*. Cierto para `status`/`phase`/`type`/`epic`; **falso para la
familia entera** de campos anclados a fin de línea. Es `CE-005` en la tarea que cerró `CE-005`: se
miró donde se sabía mirar.

## 5. Qué NO entra   `OUT`

- **Hacer `LEX-R31` bloqueante.** Avisa a propósito: no todo trabajo repite un tropiezo.
- **Retrofechar las entradas anteriores a la regla** (`SUITE-R09`, `CE-014`).
- **Reescribir las 71 cabeceras** para que casen el regex de hoy: el defecto es del regex.

## 6. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | `LEX-R31` ve **las 71**, no 17 | `TS-01` |
| `AC-02` | Una entrada que **no** declara clase sigue avisando | `TS-02` |
| `AC-03` | La lectura de la clase vive en **un** sitio, y `eventos.mjs` usa el mismo | `TS-03` |
| `AC-04` | Se **barre la familia**: cuántos `\s*$` más hay en `tools/` sobre campos con cola legítima, y se declara la cifra | `TS-04` |

`AC-02` es el que impide arreglarlo en la dirección peligrosa: un regex que acepte cualquier cosa
cumple `AC-01` y apaga la regla.

`AC-04` es lo que `PT-198` no hizo: midió **un archivo**; aquí se mide el **directorio**.

## Cómo termina   `FDGE-R53`

> Termina cuando: una entrada que declara su clase se cuenta, y la familia de expresiones ancladas
> tiene cifra en vez de suposición.

## 7. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-30
He leído este Intake y confirmo que refleja mi intención: SÍ
```

## 8. Origen   `FDGE-R55`

Parada de `EP-026` · motivo `hallazgo` · `changes/EP-026-lo-que-da-verde-sin-mirar/paradas/PT-206.md`
