# PT-071 — Publicar comprueba lo mismo que verificar

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-071
type: BUG
epic: EP-017
track: STANDARD
status: INTEGRATED
phase: 10created: 2026-08-19
structural: no
suite_version: 10.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Que el verde que autoriza una publicación sea el mismo que verifica el repositorio. `verificacion.yml` corre 8 comprobaciones y `publicar.yml` corre 5: faltan `verify:patrones`, `tracker espejo` y `verify-fdge --all`, la que `FDGE-R34` llama precondición de `G4`.»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `publicar.yml` corre el mismo conjunto que `verificacion.yml` | las dos listas de pasos coinciden, o la diferencia está declarada por escrito en el propio workflow |
| AC-02 | `verify-fdge --all` corre antes de publicar | el paso existe y bloquea |
| AC-03 | Los dos workflows hacen el mismo checkout | ninguno clona en superficial si el otro no lo hace: los casos derivados del historial fallaban sólo en uno |
| AC-04 | La comprobación de que coinciden no depende de que alguien mire | algo falla si un workflow gana un paso y el otro no |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `publicar.yml` corre las mismas comprobaciones que `verificacion.yml`, o declara por escrito cuál omite y por qué, y algo lo comprueba.

## 4. Qué NO entra   `[AGENTE]`

- OUT: Publicar la `9.0.0`: reservado por el firmante y posterior al cierre del lote.
- OUT: Configurar el Trusted Publisher de npm: vive fuera del repositorio.
- OUT: Reordenar o acelerar los pasos existentes.

## 5. Firma

```
Firmado por lote: EP-017
```
