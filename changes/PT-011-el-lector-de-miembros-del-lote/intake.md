# PT-011 — El lector de miembros del lote

> Tarea de la implementación abierta `EP-004` (`FDGE-R51`).

```yaml
---
id: PT-011
type: BUG
epic: EP-004
track: STANDARD
status: READY
created: 2026-08-13
structural: no
suite_version: 6.0.1
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «debemos arreglar cauce, no trabajaremos nada más hasta que no esté al 100»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Citar un PT en prosa **no** lo convierte en miembro del lote | Caso con un intake de lote que menciona un PT ajeno en un párrafo |
| AC-02 | Una fila de tabla **sí** lo convierte en miembro | Caso inverso: el que está en la tabla sigue exigiendo su firma |
| AC-03 | Un intake de lote **sin ninguna tabla** no deja de comprobarse | Respaldo al barrido completo, para no romper los lotes escritos antes |
| AC-04 | El proyecto legado baja de 16 errores a 2 | Ejecución real de `verify-fdge` de cauce contra ese repositorio |
| AC-05 | El CHANGELOG deja de afirmar una corrección que el código no lleva | La 4.13.0 la declara traída; se dice dónde estaba realmente |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `verify-fdge` de cauce sobre el proyecto legado deja de reportar
> `INTAKE-R08` sobre PTs citados en prosa, y el caso inverso sigue exigiendo la firma del lote.

## 4. Qué NO entra   `[AGENTE]`

- OUT: la puerta de versión para `INTAKE-R08` —que una regla nueva no se cobre sobre trabajo cerrado—. Es una decisión normativa aparte
- OUT: migrar el proyecto legado
- OUT: tocar nada de ese proyecto

## 5. Firma

```
Firmado por lote: EP-004
```

---

## Evidencia, y de dónde sale

`verify-fdge.mjs:640`:

```js
const pts = [...txt.matchAll(/PT-\d+/g)].map((m) => m[0]);
```

Barre **todo el texto** del intake del lote. Un párrafo como «con el método que ya funcionó en
`PT-006`» convierte a `PT-006` en miembro y dispara un fallo sobre un PT cerrado hace semanas.

**Ese proyecto ya lo arregló** en su commit `760f790`, leyendo los miembros solo de las filas de
tabla y conservando el barrido completo como respaldo. El `CHANGELOG` de cauce 4.13.0 declara
esa corrección **traída**, y el código nunca la llevó.

Medido el 2026-08-13 con cauce 6.0.1 contra ese repositorio: **13 `INTAKE-R08` falsos** y un
`INTAKE-R09` que sale de lo mismo — un `PT-088` citado en prosa. Catorce de dieciséis errores.
