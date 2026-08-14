# PT-018 — El destino no es prosa

> Tarea de la implementación abierta `EP-004` (`FDGE-R51`).

```yaml
---
id: PT-018
type: BUG
epic: EP-004
track: STANDARD
status: INTEGRATED
created: 2026-08-13
structural: no
suite_version: 6.0.1
phase: 10
---
```

## 1. Qué se quiere   `[HUMANO]`

> «éstas dos cosas que encontraste es necesario asegurar dentro de las reglas que no ocurran, el
> comportamiento propio del sistema debería de evitar, solventar o adelantarse a éste tipo de
> errores. No es un problema de código son temas de redacción y no puede ser que el sistema no
> pueda cuadrarlos»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El destino de una fila de out-of-scope es **vocabulario cerrado** | O `—`, o la cita de un identificador. Nada más. Sin lista de palabras |
| AC-02 | Desaparece la heurística | `RE_APLAZA` deja de existir: no hay nada que adivinar |
| AC-03 | Un destino en prosa **falla**, diga lo que diga | «Decisión posterior», «ya veremos» o «mañana» dan lo mismo |
| AC-04 | La cita tiene que ser **recíproca** | Un `DEFERRED` citado declara en su `origin` de qué fila viene |
| AC-05 | Citar un PT que no cubre lo aplazado **falla** | Es el agujero de hoy: `PT-012` citaba `PT-013` y pasaba |
| AC-06 | Citar un hermano del mismo lote vale | Si se está haciendo ahora, no está aplazado |
| AC-07 | Las filas existentes que solo explican no se rompen | `—` sigue siendo válido y es la mayoría |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `SUITE-R44` no contiene ninguna lista de palabras, y una fila con destino en
> prosa falla en `G4` diga lo que diga.

## 4. Qué NO entra   `[AGENTE]`

- OUT: cambiar la plantilla de out-of-scope para todos los proyectos destino sin migración — se declara qué pasa con los existentes
- OUT: interpretar si el PT citado *de verdad* cubre el trabajo. Lo que se exige es reciprocidad declarada, no comprensión

## 5. Firma

```
Firmado por lote: EP-004
```

---

## Los dos agujeros, y por qué son el mismo

`PT-013` dejó dos limitaciones declaradas:

1. **La heurística es una lista de palabras.** Se le escapó «posteriores» y podría escapársele
   cualquier redacción nueva.
2. **Citar cualquier identificador satisface la regla.** `PT-012` citaba `PT-013` —que no iba a
   hacer ese trabajo— y pasaba.

Las dos salen de lo mismo: **el destino es prosa libre**, así que la comprobación tiene que
adivinar dos cosas — si esa prosa significa «aplazado» y si el sitio al que apunta sirve.

Un formato que no admita prosa no necesita adivinar ninguna de las dos. Es la diferencia entre
un detector y una **gramática**.
