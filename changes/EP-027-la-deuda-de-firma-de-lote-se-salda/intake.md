# `EP-027` — Saldar la deuda que `PT-203` hizo visible

```yaml
---
id: EP-027
created: 2026-08-29
status: DRAFT
mode: SUPERVISED
origin: DIRECT
---
```

## 1. Objetivo común

**Las 26 firmas de lote certificadas en `FIRMAS-DE-LOTE.md` dejan de estar certificadas porque se
corrigen.**

`PT-203` cambió de dónde sale la pertenencia a un lote: la asigna el **registro** (`SUITE-R08`), no
la tabla del intake. Al hacerlo, `INTAKE-R08` —`HARD`, bloquea— empezó a cubrir **62 tareas que
nunca cubrió**, y **26 no cumplen**. Todas están en estado terminal, así que ponerles la línea
dentro de `PT-203` habría sido reescribir trabajo cerrado para callar una comprobación
(`SUITE-R09` append-only, `CE-014`).

Se certificaron con firma, fecha y dueño. **Este lote es ese dueño.**

Se hacen juntas y no sueltas porque son **un solo hecho con 26 instancias**: dos lotes que se
cerraron sin que nadie comprobara la línea, porque el verificador no miraba ahí. Repartirlas en 26
tareas sería 26 veces la misma decisión.

## 2. Criterio de éxito del lote

**`FIRMAS-DE-LOTE.md` queda vacío de filas vigentes, y `INTAKE-R08` no exime a nadie.**

No es «que las 26 tengan la línea»: es que **la certificación deje de hacer falta**. Si al mirarlas
una resulta que no es miembro de ese lote, el arreglo es el **registro**, no el intake — y eso
también cierra su fila.

## 3. Qué NO entra en el lote

- **No entra ampliar la certificación a nada nuevo.** La lista es cerrada: 26 filas, todas del
  `2026-08-29`. Una fila nueva sería una decisión nueva.
- **No entra tocar `verify-fdge`.** `PT-203` ya dejó la comprobación derivando del registro; aquí
  se salda lo que esa comprobación destapó.
- **No entra reescribir historia** (`SUITE-R06f`). Los intakes se corrigen **añadiendo**, con su
  constancia de por qué se tocan meses después.

## 4. Los `PT` que lo componen

**Sin descomponer todavía.** Se descompone en `PHASE 1` con las 26 filas delante, y el reparto
razonable es por **naturaleza del defecto**, no por identificador:

| | Naturaleza | Cuántas | Qué decide |
|:---|:---|---:|:---|
| A | Sin la línea de firma de lote | 23 | ¿Se añade la línea, o el registro las asignó mal? |
| B | Sin intake en el árbol | 2 | `PT-032` (`EP-008`) y `PT-171` (`EP-024`): ¿existió y se perdió, o nunca hubo? |
| C | Firma que nombra **otro** lote | 1 | `PT-172`: su intake dice `EP-024` y el registro `EP-025`. Una de las dos miente |

`C` es la que **no** es rutinaria: es una divergencia real entre dos fuentes sobre el mismo hecho
—`CE-008`— y decidir cuál manda no es transcribir, es juzgar.

## 5. Orden y su motivo

**`C` primero**, aunque sea una sola fila: si `PT-172` revela que el registro puede asignar mal, el
grupo `A` deja de ser «añadir 23 líneas» y pasa a ser «comprobar 23 asignaciones». El orden barato
al revés sería hacer 23 y descubrirlo al final.

## 6. Dependencias

Depende de que `EP-026` esté **cerrada**: `PT-203` es quien crea `FIRMAS-DE-LOTE.md` y quien hace
que `INTAKE-R08` lo lea. Sin eso, este lote no tiene sobre qué trabajar.

## 7. Solapamiento de archivos

| Archivo | Tareas que lo tocan | Serialización |
|:---|:---|:---|
| `docs/implementation/FIRMAS-DE-LOTE.md` | todas | **Sí**: cada tarea retira sus filas. Serializado por el orden de arriba |
| `changes/PT-NNN-*/intake.md` | grupo `A` | No: cada una toca la suya |
| `docs/implementation/REGISTRY.json` | grupos `A` y `C` | **Sí**: el registro es una fuente única |

## 8. Criterio de éxito del lote

Ver `§2`. **Se declara lo que este lote NO demuestra** (`SUITE-R26`): que no vuelva a abrirse una
deuda de esta forma. Eso lo compró `PT-203` al derivar del registro; aquí sólo se paga la que ya
existía.

## Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:--|:--|
| Entrada en `CHANGELOG.md` | PENDIENTE |
| `FIRMAS-DE-LOTE.md` sin filas vigentes | PENDIENTE |
| Las filas retiradas quedan como registro histórico, no borradas (`SUITE-R09`) | PENDIENTE |

## Firma   `INTAKE-R06` · `SUITE-R27`

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-29
He leído este Intake y confirmo que refleja mi intención: PENDIENTE
```

**`G1` sin firmar a propósito.** Este lote nace de una decisión del firmante —*«necesitamos
corregir o certificar y sellar… De ser necesario ponlos en una épica que atacaremos al terminar
ésta»*, `2026-08-29`—, y esa autorización cubre **abrirlo**, no admitirlo. El `VoBo` del
`2026-08-28` es de `EP-026` y no se estira a otro lote: `G1` se pedirá al empezarlo.
