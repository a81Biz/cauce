# PT-002 — Cobertura mecánica por regla, con su número

> Tarea dentro de la implementación abierta `EP-001` (`FDGE-R51`). Plantilla `TAREA.md`.

```yaml
---
id: PT-002
type: BUG
epic: EP-001
track: STANDARD
status: DRAFT
created: 2026-08-13
structural: no
suite_version: 5.2.3
---
```

## 1. Qué se quiere   `[HUMANO]`

> «lo más importante es resolver la exigencia de seguir el marco de trabajo al pie de la letra»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `audit` publica cuántas reglas tienen verificador que una compuerta ejecuta, sobre el total | La salida incluye el par `n / total`, no un adjetivo |
| AC-02 | El informe distingue tres estados y no dos | Con verificador ejecutado por una compuerta · con verificador que ninguna compuerta ejecuta · sin verificador |
| AC-03 | El informe deja de afirmar «cobertura completa» cuando la cobertura por regla no es completa | Caso de `selftest.sh`: hoy el mismo árbol produce «sin huecos» con 63 HARD sin script; después no |
| AC-04 | Las reglas sin verificador se pueden enumerar, no solo contar | Una marca de la herramienta lista sus identificadores |
| AC-05 | La comprobación por componente que existe hoy no se pierde | Sigue fallando el componente que tenga reglas HARD/CHECK y ninguna verificada |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `audit` sobre este repositorio imprime la cobertura por regla como un
> número con su denominador y no como «sin huecos».

## 4. Qué NO entra   `[AGENTE]`

- OUT: escribir verificadores para las reglas que hoy no tienen ninguno. Esta tarea mide y publica; convertir una regla en script es otro trabajo y otra decisión
- OUT: cambiar `SUITE-R26`, que dice «aspira» y no «exige», y sigue siendo correcta
- OUT: convertir el número en una compuerta que bloquee por debajo de un umbral. Un umbral inventado hoy es una cifra arbitraria con aspecto de norma
- OUT: la cobertura de `PTSA`, que ya tiene su propia matriz (`PTSA-R77`)

## 5. Firma

```
Firmado por lote: EP-001
```

---

## Evidencia de que el defecto existe

Medido el 2026-08-13 sobre este repositorio:

```
audit.mjs   → «Cubiertos: 572 · Cobertura completa: sin huecos»

RULES.md    → 167 reglas · 134 HARD
              82  con verificador que alguna compuerta ejecuta
               9  cuyo único verificador no lo ejecuta ninguna compuerta
              76  sin ningún verificador (63 de ellas HARD)
```

La comprobación está en [`audit.mjs:392`](../../docs/methodology/tools/audit.mjs) y solo
falla si un componente tiene reglas HARD/CHECK y **ninguna** verificada. Con 1 de 20, el
componente pasa. El marco aplica el criterio contrario a las auditorías ajenas —`SUITE-R11`
(«ningún score es válido sin cobertura declarada junto al número») y `PTSA-R78` («coverage =
evaluadas / universo»)— y no a la suya.
