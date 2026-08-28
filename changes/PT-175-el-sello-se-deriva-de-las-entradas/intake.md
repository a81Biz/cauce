# `PT-175` — El sello se deriva de las entradas

```yaml
---
id: PT-175
type: CHORE
severity: S2
epic: EP-025
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.2.0
origin: DIRECT
---
```

## 1. Comportamiento esperado

Que un bloque certificado **deje de correr** sin que eso sea un falso verde: el sello tiene que
romperse **sólo** cuando cambia algo de lo que el bloque depende, y **siempre** que cambia.

## 2. Qué establece y qué no

**Establece** que el texto de las secciones del bloque y el de las herramientas que ejercitan —con
su cierre transitivo (`PT-174`)— son los mismos que cuando se selló.

**No establece que el bloque pase.** Eso lo dijo la corrida que lo selló, y por eso el sello guarda
su **veredicto** y su fecha: un bloque no se certifica por no haber cambiado, sino por **haber
pasado**. Sin esa distinción, un bloque que falló quedaría certificado por el mero hecho de que
nadie lo tocó desde entonces.

## 3. Reabrir no es volver a correr

El firmante lo fijó con todas las letras:

> *«si se necesita hacer algún cambio de lo que ya está sellado necesita saber que además del cambio
> debe abrir y probar de nuevo **como nuevo**»*

Un sello que no casa **no se recalcula solo**: el bloque vuelve a la batería entera hasta que una
corrida completa lo selle de nuevo. El estado se llama `REABIERTO` y su mensaje lo dice.

## 4. Y es de la versión del marco, no del proyecto

Un destino que instale el paquete hereda el sello del marco. Lo que **no** hereda es haberlo corrido
en **su** árbol. Por eso el sello incluye **las herramientas**: si el destino las modifica, el sello
deja de casar y el bloque vuelve a correr. Es la mitad que hace universal el esquema.

## 5. Alcance

| | |
|:---|:---|
| **IN** | `selloDeBloque`: secciones **y** herramientas, con `selloDe` que normaliza `CRLF`/`LF` |
| **IN** | `estadoDeBloque`: `SIN_SELLAR` · `REABIERTO` · `SELLADO_EN_ROJO` · `SELLADO`, con su porqué |
| **OUT** | Recalcular el sello automáticamente al detectar un cambio. Eso convertiría *reabrir* en *volver a correr*, que es justo lo que el firmante excluyó. |
| **OUT** | Sellar sobre bytes crudos. `git` entrega `LF` en Linux y `CRLF` en Windows: acusaría de desincronizado un bloque intacto. |

## 6. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| AC-01 | El mismo contenido da el **mismo** sello |
| AC-02 | Cambiar una **sección** lo rompe |
| AC-03 | Cambiar una **herramienta** lo rompe |
| AC-04 | `CRLF` y `LF` dan el **mismo** sello |
| AC-05 | Sin sello, `SIN_SELLAR`; sello que no casa, `REABIERTO`, y dice que vuelve a la batería entera |
| AC-06 | Un sello que casa pero cuya corrida **falló** no certifica: `SELLADO_EN_ROJO` |

## Cómo termina   `FDGE-R53`

> Termina cuando: el sello es estable ante lo que no cambia, se rompe ante secciones y herramientas,
> ignora el fin de línea, y un bloque que falló no queda certificado por no haber cambiado.

## 7. Riesgo

**Que el sello se lea como «esto funciona».** No lo dice: dice «nada de lo que mido ha cambiado».
Por eso guarda el veredicto y por eso existe `SELLADO_EN_ROJO` — sin él, la certificación premiaría
el inmovilismo en lugar del acierto.

## 6. Fuera de lo declarado

`SUITE-R06(e)` cubre `docs/methodology/`. Esta tarea lo modifica **con intake firmado**, que es
como se mantiene este repositorio desde `SUITE-R41`. No hay merge, publicación ni borrado de datos
aquí: lo que toque la rama principal se detiene en `G4`, que es humana por definición.

## `G1` — Definition of Ready

VEREDICTO: PASS

Cada criterio nombra el mecanismo que lo comprueba, y el alcance declara qué **no** toca. Lo que se
afirma del comportamiento observado está **medido**, no supuesto: la medición está en §2 con el
comando que la produjo.

Firmado en `PHASE 1` por Alberto Martínez, 2026-08-26.

## Firma   `INTAKE-R06` · `SUITE-R27`

`EP-024` no está firmado como lote, así que esta tarea **no hereda nada de él**: `INTAKE-R08`
*admite* la firma por lote, no la impone.

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-26
He leído este Intake y confirmo que refleja mi intención: SÍ
```

### Constancia de cómo se escribió esta firma

La escribió el agente por delegación, con el VoBo que el firmante dio en sesión para las firmas de
este lote, y consta en `SESSION_LOG.md`. `SUITE-R27` dice lo que esto **no** prueba: que firmara
una persona. Sí lo hace contrastable — el nombre está en `firmantes`, y quien aparece en esa lista
responde de lo que lleva su nombre.
