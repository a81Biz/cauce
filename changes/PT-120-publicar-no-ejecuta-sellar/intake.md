# PT-120 — publicar.yml no ejecuta sellar, y verify-fdge corre sin GH_TOKEN

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-120
type: BUG
epic: EP-020
track: STANDARD
status: DRAFT
phase: 1
created: 2026-08-22
structural: no
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> Que la compuerta que autoriza lo único irreversible del marco compruebe de verdad lo que dice comprobar.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `publicar.yml` ejecuta `tracker sellar` y bloquea si el sello no está resuelto | la corrida falla sobre un árbol con la guía de migración incompleta |
| AC-02 | El paso `verify-fdge --all` recibe `GH_TOKEN` en `publicar.yml` Y en `verificacion.yml` | la corrida deja de emitir «sin acceso a la plataforma ... SIN EVALUAR» para SUITE-R43 |
| AC-03 | Un paso que no puede evaluar una regla NO cierra con «Sin errores» sin decir cuántas quedaron `SIN EVALUAR` | un caso que cuenta los SIN EVALUAR y exige que aparezcan en el resumen |
| AC-04 | `sellar` deja de derivar «tag anterior» del CHANGELOG y lo lee de los tags reales, o declara que no puede | hoy imprime «tag anterior v12.0.0» y ese tag no existe |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: ninguna corrida puede autorizar una publicación declarando verde una regla que no llegó a mirar.

## 4. Qué NO entra   `[AGENTE]`

- OUT: crear los tags que faltan: es acto humano (SUITE-R06a) y va con PT-121
- OUT: cambiar qué comprueba verify-fdge. Aquí sólo se le da acceso a lo que ya intenta mirar
- OUT: republicar la 12.0.0. No se puede y se dice

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Medido en la corrida `32600060157`**: 108 avisos `SUITE-R43 ... SIN EVALUAR` sobre 108 PT, y el paso cerró con «Sin errores. PTs verificados: 108». `FDGE-R34` llama a esa comprobación precondición de `G4`.
- **No se afirma que con token hubiera fallado**: sobre el estado de `main` la divergencia de `SUITE-R35` no existía. Se afirma que `SUITE-R43` **nunca** se ha evaluado en CI, en ninguna de las dos corridas, desde que existe.
- **Va inmediatamente después de `PT-113`** y antes de volver a publicar: arreglar la compuerta que dejó salir el defecto es lo que impide repetirlo.
