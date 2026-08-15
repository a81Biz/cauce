# PT-016 — `phase` obligatoria en el YAML del intake

> Tarea de la implementación abierta `EP-013` (`FDGE-R51`).

```yaml
---
id: PT-016
type: CHORE
epic: EP-013
track: STANDARD
status: DONE
created: 2026-08-14
structural: no
suite_version: 7.7.0
phase: 8
---
```

## 1. Qué se quiere   `[HUMANO]`

> «phase pasa a ser obligatoria, con migración — decisión del firmante, 2026-08-14»

Que un intake sin `phase` deje de salir `SIN EVALUAR`. Hoy `PT-044` hace que un `phase` que miente se **vea**; esto hace que no escribirlo tampoco pase.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Un intake sin `phase` **falla**, en vez de quedar `SIN EVALUAR` | selftest |
| AC-02 | Las plantillas de `INTAKE/templates/` lo declaran obligatorio | selftest |
| AC-03 | Un proyecto instalado en una versión anterior no se rompe **sin aviso**: la migración lo enumera | selftest |
| AC-04 | El `CHANGELOG` lleva su guía de migración, y la versión sube `MAJOR` | verify-suite |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: un intake sin `phase` **falla** en vez de quedar SIN EVALUAR, la plantilla lo declara obligatorio, y el CHANGELOG lleva su guía de migración — los proyectos instalados dependen de ella (`SUITE-R19`).

## 4. Qué NO entra   `[AGENTE]`

- OUT: lo que resuelven las otras siete tareas de `EP-013`
- OUT: publicar. Decisión humana explícita, sostenida en tres lotes

## 5. Firma

```
Firmado por lote: EP-013
```
