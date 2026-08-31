# `PT-198` — Un comentario en linea hace invisible el status del intake, y el mensaje dice que no existe

```yaml
---
id: PT-198
type: BUG
severity: S3
epic: EP-026
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-28
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

```
$ tracker aplazar EP-023 …
el intake de EP-023 no declara «status»: no se puede sincronizar (SUITE-R08).
```

**Y sí lo declara**, en la línea 5 de su YAML:

```yaml
status: READY              # G1 CHALLENGE aceptado · 2026-08-24
```

## 2. Por qué   `[HUMANO]`

```js
/^status:[ \t]*\S+[ \t]*$/m        // tracker.mjs:3696, :4798, :5148
```

El regex exige **fin de línea** tras el valor. Un comentario `#` —sintaxis YAML **válida**— lo rompe.
La misma expresión está escrita **a mano en tres sitios** del tracker.

## 3. Lo que lo hace defecto, y no una rareza

**El mensaje afirma un hecho falso.** No dice «no puedo leerlo» ni «hay algo después del valor»: dice
**«no declara `status`»**, que es lo contrario de lo que ocurre. Quien lo lea irá a añadir un campo
que ya está.

Es `RULE-06` por el otro lado: no se supone lo que no se sabe, y **tampoco se afirma lo que no se ha
comprobado**. La herramienta no distingue **ausente** de **no parseable**, y al fundirlas manda a
quien lo lee al sitio equivocado — el mismo razonamiento con el que `PT-093` separó una constancia
malformada de una ausente.

## 4. Cómo se arregla, y cómo NO

**No** prohibiendo comentarios en el YAML: son válidos y llevan información que se perdería.
**No** parcheando los tres regex por separado: tres copias de la misma expresión divergen, que es lo
que `SUITE-R38` persigue.

**Sí** leyendo el campo por un único sitio que tolere el comentario, y distinguiendo en el mensaje
«no está» de «no se puede leer».

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | Un `status` con comentario en línea **se lee** | `TS-01` |
| `AC-02` | Un intake **sin** `status` sigue fallando | `TS-02` |
| `AC-03` | Los dos casos dan mensajes **distintos** | `TS-03` |
| `AC-04` | La expresión vive en **un** sitio, no en tres | `TS-04` |

## Cómo termina   `FDGE-R53`

> Termina cuando: el tracker lee un YAML válido, y cuando no puede leerlo lo dice **sin afirmar que
> el campo no existe**.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la única del lote, resuelta el `2026-08-28`. `G3` sigue siendo humana
para todo `BUG` (`EXEC-R05`), y se pedirá con la evidencia delante.
