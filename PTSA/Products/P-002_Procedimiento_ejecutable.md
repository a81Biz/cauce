---
id: P-002
nombre: Procedimiento ejecutable
clase: Primario
estado: IN_REVIEW
auditoria: PTSA-2026-08-20
criterio_de_validez: "un agente puede ejecutar una fase completa sin abrir un documento que CORE.md no le remita"
hallazgos: [H-008]
---

# P-002 — Procedimiento ejecutable

> Producto **Primario** · estado `IN_REVIEW`
> Hallazgos activos: [[H-008]]

## Criterio de validez   `FND-R24`

> «un agente puede ejecutar una fase completa sin abrir un documento que CORE.md no le remita»

Redactado por quien conoce el negocio y firmado el 2026-08-13. **No lo fija el auditor**: el
auditor mide contra él.

## Qué entrega

`PHASES.md` · `INSTALL.md` · los seis `*-Implementation.md` y los seis `*-Prompts.md`, compilados
en el procedimiento denso que `CORE.md` lleva por componente.

## Acid Test   `PTSA-R55`

Sobre ejecuciones **observadas**, no sobre el texto:

| Componente | ¿Ejecutado? | Evidencia |
|:---|:---|:---|
| `FIDE` | no | ningún proyecto incubado |
| `Foundation` | **sí**, dos veces | `docs/enterprise-documentation/` con sus 10 documentos + `inventory/` |
| `FDGE` | **sí**, 82 tareas | `HISTORY.log` · `verify-fdge --all` sin errores |
| `QA` | **no** | `verify-qa`: «No hay QA/ ni ROADMAP.md: nada que verificar» |
| `PTSA` | **sí, esta corrida** | este directorio |
| `FPGE` | **no** | no hay `ROADMAP.md` |

**Tres de seis ejecutados. `H-008`.**

Y el criterio literal —ejecutar una fase sin abrir lo que `CORE.md` no remita— **se sostuvo hoy**:
esta auditoría se ejecutó con `CORE.md` + `CORE-PTSA.md` + la plantilla de `COVERAGE` y nada más.
Eso es evidencia nueva a favor del criterio, en el componente que menos la tenía.

## Cadena de trazabilidad inversa

```
Producto        una fase ejecutada de principio a fin, con sus artefactos en el repositorio
  ← Transformacion   tracker avanzar, que hace los CINCO actos o no hace ninguno (FDGE-R52)
  ← Servicio         tools/tracker.mjs · tools/verify-fdge.mjs
  ← Regla            FDGE-R52 reanclaje por fase · SUITE-R25 que overlay se carga y cuando
  ← Fuente de datos  REGISTRY.json (asigna) · CHECKPOINT.json · el intake de la tarea
  ← Accion de usuario  [START PT] · [START EP] · [START PTSA] y los demas triggers
```

## Estado `IN_REVIEW`, no `VALIDATED`

Porque `PTSA-R56` es explícita: si un producto contradice lo declarado aguas arriba, la cadena se
marca `IN_REVIEW`. El marco publica **seis** componentes y dos no se han ejecutado nunca.
