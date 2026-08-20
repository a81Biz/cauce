# PT-082 — Acciones reservadas al humano   `EXEC-R07`

## 1 · Proteger `trabajo`   ✅ AUTORIZADO Y **EJECUTADO** el 2026-08-19

Cambio de **configuración del repositorio**, no de código. No lo cubre ninguna regla de
`SUITE-R06` —no es merge, ni historia, ni credenciales— pero **sí cambia quién puede hacer qué**,
y por eso se pregunta antes y se escribe después.

**Autoriza:** Alberto Martínez, respondiendo a la pregunta directa sobre si aplicarlo, opción
«Sí, con el mismo check que main», y después: *«este cambio debe quedar documentado conforme el
protocolo, no puede quedar volando nada»*. Este archivo es esa documentación.

### El comando exacto

```bash
gh api -X PUT repos/a81Biz/cauce/branches/trabajo/protection --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["marco"] },
  "enforce_admins": true,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```

### Cómo se comprueba que sigue puesto

```bash
gh api repos/a81Biz/cauce/branches/trabajo/protection \
  --jq '"checks: \(.required_status_checks.contexts) · strict: \(.required_status_checks.strict) · enforce_admins: \(.enforce_admins.enabled)"'
```

### Estado medido

| Rama | Antes | Después |
|:---|:---|:---|
| `main` | `["marco"]` · strict · enforce_admins | sin cambios |
| `trabajo` | **`404 Branch not protected`** | `["marco"]` · strict · enforce_admins |

### Cómo se revierte, si hiciera falta

```bash
gh api -X DELETE repos/a81Biz/cauce/branches/trabajo/protection
```

**No se revierte sin decisión humana**, igual que ponerla. Quitarla devuelve el repositorio al
estado en que `#148` y `#149` se fusionaron en rojo.

### Efecto secundario, buscado

Los **commits directos a `trabajo` dejan de ser posibles**. Es lo que `FDGE-R19` ya decía
—`trabajo` recibe PRs, no trabajo— y que se estaba incumpliendo con commits de mantenimiento.

## 2 · Pull request de la tarea a `trabajo` — **NO es `G4`**   ✅ AUTORIZADO AL AGENTE

Es **revisión** (`FDGE-R19`). Autorizado el 2026-08-19 —respuesta literal: «B»—, excepción
declarada a `SUITE-R42` registrada en `SESSION_LOG.md`.

**Y desde esta tarea el merge ya no depende de que yo mire `gh pr checks`**: GitHub lo rechaza en
rojo. Que sea así es el entregable, no un efecto colateral.

## 3 · `G4` — merge del lote a la rama por defecto   AUTORIZADA, PENDIENTE DE VERDE

El PR `#152` está abierto y **`BLOCKED`** por la protección de `main`. No se fuerza. La
autorización del firmante —«realiza el g4 necesario y realiza los merge y pull»— está registrada
como excepción declarada en `SESSION_LOG.md`, y **autorizar que la ejecute no es autorizar que la
ejecute en rojo**.

## 4 · Publicar   **NO AUTORIZADO**

Sigue vigente «No publiques la 9.0.0». Y `PT-081` sostiene que la versión correcta de `EP-017` es
la `10.0.0`.

## 5 · Borrar la rama efímera tras fusionar   `FDGE-R19`

```bash
git push origin --delete fix/alberto-martinez/PT-082-un-caso-no-depende-de-quien-lo-ejecuta
```

`SUITE-R06f`. Seguro desde `PT-079`: el enlace del issue sobrevive a la rama.
