# `PT-163` — un ID definido dos veces en el mismo documento pasaba en verde

> Tarea dentro de la implementación abierta `EP-024` (`FDGE-R51`). Es la **ligera** (`INTAKE-R08`).

```yaml
---
id: PT-163
type: CHORE
epic: EP-024
track: EXPRESS
status: INTEGRATED
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.2.0
origin: DIRECT
---
```

## 1. Qué pasa

`SUITE-R14` promete que `verify-suite` *«rechaza cualquier definición duplicada»*. **Cumplía la
mitad**: `definidasDosVeces` guardaba un `Set` de **documentos**, así que dos definiciones del
**mismo** id en el **mismo** archivo **colapsaban en una**.

Y la mitad que fallaba es **la más fácil de cometer**, porque nadie mira si un ID está libre antes
de escribirlo. `PT-148` escribió `LEX-R33` y `LEX-R34` sobre IDs que existían desde `PT-137` y
`PT-138`: al regenerar, **las dos reglas viejas desaparecieron de `CORE.md`** —el único archivo que
el agente carga— y nada avisó.

## 2. Criterios de aceptación

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| `AC-01` | Un ID definido **dos veces en el mismo documento** se caza | fixture: se duplica y sale rojo |
| `AC-02` | El mensaje **separa** los dos hechos: en dos documentos / dos veces en el mismo | los dos textos |
| `AC-03` | El árbol real no tiene ninguno | `verify-suite` en verde |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: duplicar un ID dentro de un documento pone `verify-suite` en rojo, y el mensaje
> dice **cuál de los dos defectos** es.

## 4. Qué NO entra

- **OUT**: detectar una **cita** a un ID equivocado pero real. Es `PT-164`, y no es lo mismo.

## Firma

```
Firmado por lote: EP-024
```

---

## Observaciones del agente   `INTAKE-R07`

- **`AC-02` no es cosmético.** «En dos documentos» se arregla **eligiendo propietario**; «dos veces
  en el mismo» se arregla **renumerando**. Fundirlos manda a quien lee el fallo a averiguar cuál
  era — el mismo motivo por el que `PT-093` separó una constancia malformada de una ausente.
