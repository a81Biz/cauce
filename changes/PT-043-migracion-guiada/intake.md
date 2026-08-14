# PT-043 — Migración guiada

> Tarea de la implementación abierta `EP-011` (`FDGE-R51`).

```yaml
---
id: PT-043
type: FEATURE
epic: EP-011
track: STANDARD
status: INTEGRATED
created: 2026-08-14
structural: no
suite_version: 7.5.0
phase: 9
---
```

## 1. Qué se quiere   `[HUMANO]`

> «migrar un legado como está me parece hasta preocupante»

Conducir las siete decisiones de migrar un legado, no enumerarlas.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Las decisiones humanas de la migración se **conducen** una por una | ejecución |
| AC-02 | Cada una dice qué decide, por qué no puede decidirla la máquina y qué pasa después | selftest |
| AC-03 | El modo restringido se explica al entrar en él, no se descubre | selftest |
| AC-04 | Migrar sin resolverlas sigue siendo imposible: no se relaja `SUITE-R17` | selftest |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `migrate` sobre un proyecto legado real **conduce** sus decisiones humanas
> —numeradas, cada una con qué decide y por qué no puede decidirla una máquina—, explica el modo
> restringido al entrar en él, y esa obligación está escrita como `SUITE-R55` en `RULES.md` con
> sus citas y con casos que la ejecutan.

Escrita al abrir `PHASE 1`, que es donde `EP-011` la dejó pendiente. Lo que la hace observable:
la salida del comando sobre un proyecto real, no la lectura del código.

## 4. Qué NO entra   `[AGENTE]`

- OUT: lo que resuelven las otras cuatro tareas de `EP-011`
- OUT: publicar. Decisión humana: «antes de publicar, debemos solventar todo»

## 5. Firma

```
Firmado por lote: EP-011
```

## Estado de cierre   FDGE-R35

`
CLOSED · integrado en la rama por defecto el 2026-08-14
G4 resuelta por Alberto Martinez: «Firma a mi nombre y cierra el trabajo, realiza el merge
correctamente». El directorio se CONSERVA: es el registro de la propuesta.
`
