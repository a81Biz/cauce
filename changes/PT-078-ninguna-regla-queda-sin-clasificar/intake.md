# PT-078 — Ninguna regla queda sin clasificar

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-078
type: FEATURE
epic: EP-017
track: STANDARD
status: INTEGRATED
phase: 9
created: 2026-08-19
structural: no
suite_version: 10.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «asegura que nadie se pierda o pueda no seguir ésa regla ni ninguna otra, para éso es todo
> ésta EP»

`PT-075` arregló **dos** reglas concretas. Esto es el mecanismo: que **ninguna** regla pueda
incumplirse en silencio, y que la cifra que lo mide no mienta.

## 2. Lo que hay hoy, medido

`audit` publica la cobertura y **la publica mal en las dos direcciones**:

```
                      audit publica    medido de verdad
  universo                    181                223
  sin verificador              60                131
  HARD sin verificador         51                 87    (sobre las 148 HARD de RULES.md)
```

**El denominador está incompleto.** `audit` cuenta las 181 filas de `RULES.md` y deja fuera las
15 `EXEC-R*` de `EXECUTION-MODES.md` y las 27 `LEX-R*` de `LEXICON.md`. Entre las omitidas,
`EXEC-R04` —`G4` humana sin excepción— y `EXEC-R14`, que estuvo en vigor desde `PT-043` sin que
nada lo dijera.

**Y el numerador cuenta menciones como verificadores.** Comprobado a mano:

| Regla | Dónde «aparece» | ¿`audit` la da por cubierta? |
|:---|:---|:---:|
| `SUITE-R01` | cadena de ejemplo en un mensaje de ayuda de `regla.mjs` | **sí** |
| `SUITE-R09` | sólo comentarios | **sí** |
| `SUITE-R03` | un comentario, y dentro del **mensaje de otra regla** | **sí** |

Es `TD-09` —`SUITE-R22` contada como cubierta porque el caso que demuestra que **no** lo está la
nombra— pero sistémico: **36 reglas `HARD`** figuran cubiertas sólo por estar mencionadas.

## 3. Por qué esto es el lote entero, y no una tarea más

`TD-08` dice que la deuda es «una decisión mientras la cifra esté a la vista», y advierte: *«el
día que se redondee a cobertura completa, vuelve a ser un engaño»*. **Ya está redondeada.** No
hizo falta inflar el numerador a propósito: bastó con contar menciones y olvidar dos documentos.

Y el efecto no es estadístico. Es el que el firmante lleva tres mensajes señalando: una regla que
nadie ejecuta **no se cumple ni se incumple, no ocurre**. Pasó con la compuerta de viabilidad
(`PT-074`), con `EXEC-R14` (`D17`), con la rama por tarea durante 46 tareas (`FDGE-R19`) y con la
mitad de `SUITE-R42` (`PT-075`).

## 4. Qué se entrega, y qué NO

**No** es escribir 131 verificadores. Es que **ninguna regla quede sin clasificar**, y que estar
sin clasificar sea un **fallo**, no una estadística.

Tres estados, exhaustivos y excluyentes:

```
VERIFICADA        alguna herramienta la EMITE: fail|warn|ok('ID').
                  Mencionarla en un comentario o en el mensaje de otra NO cuenta.

NO_VERIFICABLE    con motivo escrito, como TD-14 hizo con «quien abrio el PR».
                  Es una decision, y por eso lleva firma.

PENDIENTE         verificable y sin escribir. Deuda DECLARADA, con su cifra publicada.
```

Lo que cambia no es cuántas hay en cada casilla: es que **no exista una cuarta casilla
silenciosa**.

## 5. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El universo son las **223** reglas de los tres documentos propietarios | `audit` informa sobre 223, no 181; el mapa sale del mismo sitio que usa `regla.mjs` (`DUENO`), no de una copia (`SUITE-R38`) |
| AC-02 | Cubierta significa **emitida**, no mencionada | `SUITE-R01`, `SUITE-R03` y `SUITE-R09` vuelven a la lista de las que nada ejecuta |
| AC-03 | Toda regla tiene **exactamente uno** de los tres estados | una regla sin clasificar hace **fallar** `audit`, no lo informa |
| AC-04 | `NO_VERIFICABLE` exige motivo | sin motivo escrito, la clasificación no vale y falla |
| AC-05 | La cifra `PENDIENTE` **no puede crecer en silencio** | si sube respecto a la declarada, falla: añadir una regla `HARD` sin verificador deja de ser gratis |
| AC-06 | Las 223 quedan clasificadas | ninguna en la cuarta casilla |
| AC-07 | Un `PENDIENTE` que se resuelve **se nota** | al escribir su verificador pasa a `VERIFICADA` sin tocar la clasificación a mano |

**`AC-05` es el corazón.** Sin él, esto es una foto: se clasifica hoy y mañana alguien añade
`SUITE-R56` sin verificador y nadie se entera. Con él, la deuda es un techo que sólo baja.

**`AC-03` es lo que responde a la petición.** Hoy una regla puede no tener verificador **y no
constar en ninguna parte**. Después, no.

## 6. Cómo termina   `FDGE-R53`

> Termina cuando: las 223 reglas del marco están clasificadas en `VERIFICADA`, `NO_VERIFICABLE`
> con motivo, o `PENDIENTE`; una regla sin clasificar hace fallar `audit`; y la cifra de
> `PENDIENTE` no puede subir sin que algo falle.

## 7. Qué NO entra   `[AGENTE]`

- OUT: escribir los verificadores de las `PENDIENTE`. Esta tarea las **cuenta y las expone**; escribirlas es `TD-08` y se ataca «por orden de daño, no de facilidad».
- OUT: convertir en `NO_VERIFICABLE` lo que sólo es incómodo. El motivo se escribe y se firma: `PTSA-*`, `QA-*` y `FIDE-*` necesitan el sistema delante, y eso es un motivo; «cuesta» no lo es.
- OUT: cambiar `SUITE-R26` («aspira, no exige»). Sigue aspirando; lo que deja de poder es **no saberse**.
- OUT: la detección de emisión indirecta —una herramienta que emite a través de otra—. Es la misma heurística de texto que `PT-051` acotó en `regla.mjs`, con su límite declarado.

## 8. Firma

```
Firmado por lote: EP-017
```
