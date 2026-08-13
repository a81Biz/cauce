# PT-006 — Estrategia   `PHASE 3`

## Objetivo

Que `PHASES.md` no enuncie obligaciones que su regla no contiene, y que la transición de `G4`
tenga una regla propia con comprobación que pueda fallar.

## La regla nueva

`SUITE-R42`, el siguiente identificador libre. Condicionada: **solo rige si el proyecto declara
plataforma**. Texto en `spec-changes.md`.

Va como regla propia y no dentro de `SUITE-R35` porque `SUITE-R35` trata del **espejo del
estado** —qué está abierto— y esto trata de **dónde se propone un merge**. Meterlas juntas
haría que una regla dijera dos cosas, y `SUITE-R14` existe para lo contrario.

## Cómo se comprueba

`verify-fdge --gate G4` pregunta a `tracker` si hay un PR abierto para la rama actual, por el
mismo camino que ya usa para el espejo y las notas: el verificador hace cumplir, el adaptador
habla con la plataforma.

```
0  hay PR abierto para la rama       1  no lo hay
2  sin plataforma declarada          3  declarada y sin acceso
```

Mismos códigos que `espejo`, por coherencia: quien llama ya sabe leerlos.

## Qué NO hace

**No abre el PR.** La comprobación mira que exista. Abrirlo es una acción que se describe
(`EXEC-R07`) y fusionarlo es humano sin excepción (`EXEC-R04`). Una compuerta que se abre a sí
misma el camino no es una compuerta.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Riesgo | Mitigación |
|:---|:---|:---|
| Un proyecto con plataforma que fusiona sin PR | **Alto y buscado** | Es el cambio. Va en la guía de migración con el comando para abrirlo |
| Un proyecto sin plataforma | Ninguno | La regla está condicionada. Caso del arnés |
| `G4` de `EP-001`, que está en curso | Medio | Su PR #7 ya existe: la comprobación pasa |
| Los 219 casos | Bajo | Batería completa |
| `CORE.md` | Bajo | Se regenera; `build-core --check` y `verify-suite` lo validan |

## Criterios de éxito

1. `PHASES.md` no menciona milestone y su contrato cita `SUITE-R35` y `SUITE-R42` (`AC-01`).
2. `RULES.md` contiene `SUITE-R42` (`AC-02`).
3. `--gate G4` falla sin PR y pasa con él (`AC-03`).
4. Sin plataforma, nada cambia (`AC-04`).
5. Sin acceso, `SIN EVALUAR` fuera de `G4` y fallo dentro (`AC-05`).
6. `build-core --check` y `verify-suite` en verde (`AC-06`).

## Autorrevisión

- ¿Contradice el intake? No.
- ¿`RULE-nn` en riesgo? Ninguna: `tracker` sigue siendo el único que habla con la plataforma.
- ¿Algún AC sin cubrir? `AC-07` es negativo —que el agente no fusione— y se cubre por
  construcción: no hay código que fusione.
