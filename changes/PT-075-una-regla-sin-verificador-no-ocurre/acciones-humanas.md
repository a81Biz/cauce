# PT-075 — Acciones reservadas al humano   `EXEC-R07` · `SUITE-R42`

Lo que ningún modo de ejecución automatiza se **describe** con su comando exacto y **no se
ejecuta**. Este archivo es el rastro de que el agente se detuvo donde debía.

## 1 · Pull request de la tarea a la rama de integración — **NO es `G4`**

Es **revisión** (`FDGE-R19`, `SUITE-R42`). El agente no lo abre.

```bash
git push -u origin fix/alberto-martinez/PT-075-una-regla-sin-verificador-no-ocurre

gh pr create \
  --base trabajo \
  --head fix/alberto-martinez/PT-075-una-regla-sin-verificador-no-ocurre \
  --title "PT-075 fix: una regla sin verificador no ocurre" \
  --body "Cierra parcialmente EP-017 (#127) · issue #137

FDGE-R54 y la mitad de SUITE-R42 que no tenia verificador.
Evidencia: docs/implementation/evidence/PT-075/
selftest 989/989 · cobertura 112/181 -> 113/182"
```

## 2 · `G4` — merge del lote a la rama por defecto

**No corresponde a esta tarea.** `G4` es del **lote**, no se multiplica por tarea (`EXEC-R03`,
`FDGE-R33`), y es humana en los tres modos sin excepción (`EXEC-R04`, `SUITE-R06a`). Se describe
cuando `EP-017` cierre.

## 3 · Publicar la `9.0.0`

**Reservado y no autorizado.** Condición explícita del firmante en el primer mensaje de la
sesión —«`G4` y publicar son míos. No publiques la 9.0.0»— y condicionada además a que el lote
cierre. No se describe el comando porque no procede todavía.
