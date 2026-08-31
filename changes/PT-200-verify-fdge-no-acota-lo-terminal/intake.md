# `PT-200` — verify-fdge revisa los 198 PT cada vez, y 189 estan en estado terminal

```yaml
---
id: PT-200
type: BUG
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

## 1. Qué pasó   `[MEDIDO]`

Dos pasos del mismo `verificacion.yml`:

| Paso | Qué hace |
|:---|:---|
| `Batería de casos · salta los bloques sellados` | **acota**: 1923 → 126 casos, `−93 %` |
| `Cumplimiento de los artefactos propios` | **no acota**: los revisa todos, siempre |

```
PT en el registro         198
en estado TERMINAL        189   (95 %)
vivos                       9
```

`verify-fdge --all` recorre los 198 en cada corrida, y tarda entre **9 y 14 minutos**.

## 2. Por qué es un defecto   `[HUMANO]`

El 95 % de ese trabajo se hace sobre tareas `INTEGRATED`, `CLOSED`, `REJECTED` o `DEFERRED`: **su
trabajo ya está en `main` y su issue ya está cerrado.**

`EP-025` construyó entero el mecanismo del sello para la batería —bloques, huella, recibo,
veredicto— y **la otra mitad de la verificación quedó fuera**. Lo dijo el firmante:

> *«si se selló la prueba, el artefacto también»*

Y el coste no es sólo tiempo: es que **cada minuto de compuerta que no aporta información empuja a
saltársela**, que es el mismo argumento con el que `EP-025` justificó acotar la batería.

## 3. Cómo se arregla, y cómo NO

**No** con un `--desde` por fecha ni un tope de N tareas: cualquier número es arbitrario y sólo
mueve el día en que vuelve a doler. Es el argumento con el que `PT-190` rechazó ampliar los 4000
caracteres.

**Sí** con la forma que `PT-175` y `PT-191` ya dejaron probada: un `PT` terminal se sella, y el
sello guarda la **huella de aquello que podría invalidarlo**.

## 4. Lo que NO promete, y es la decisión de diseño   `SUITE-R26`

**Qué invalida el sello de un `PT` terminal no es obvio y no se supone aquí.** Candidatos: que
cambien sus artefactos, que cambie una regla que lo juzga, o que cambie el propio verificador. El
sello de la batería lo resolvió incluyendo **las herramientas** en la huella; aquí la respuesta
puede ser distinta. Elegirla **es** el trabajo (`RULE-06`).

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | Un `PT` terminal y sin cambios **no se re-verifica** | `TS-01` |
| `AC-02` | Si cambia lo que su sello cubre, **vuelve entero** | `TS-02` |
| `AC-03` | Un `PT` **vivo** se verifica siempre, sellado o no | `TS-03` |
| `AC-04` | Sin sellos, se verifican **todos**: el silencio no acota | `TS-04` |

`AC-04` copia la lección de `bloques-sellados`: su silencio significa «no acotes», nunca «no hay
nada que correr».

## Cómo termina   `FDGE-R53`

> Termina cuando: lo terminal deja de re-verificarse **con una razón declarada**, esa razón es la que
> invalida su sello, y un sello que no casa devuelve la tarea a la verificación completa.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la única del lote, resuelta el `2026-08-28`. `G3` sigue siendo humana
para todo `BUG` (`EXEC-R05`), y se pedirá con la evidencia delante.
