# `PT-161` — `CASOS-DE-USO` se declara contrato de cobertura y nada lo comprobaba

> Tarea dentro de la implementación abierta `EP-024` (`FDGE-R51`). Es la **ligera** (`INTAKE-R08`).

```yaml
---
id: PT-161
type: CHORE
epic: EP-024
track: EXPRESS
status: DONE
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.2.0
origin: DIRECT
---
```

## 1. Qué pasa

El encabezado de `CASOS-DE-USO.md` dice de sí mismo:

> *«su **contrato de cobertura**: un caso que no esté aquí es un hueco **declarado**, no un
> silencio»*

**Y nada lo comprobaba.** Falló **dos veces** en `EP-022` —con `DICTAMEN` y con el alta/baja de un
componente— y las dos veces lo encontró alguien echándolo en falta al leer.

## 2. Criterios de aceptación

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| `AC-01` | Un **trigger sin caso** en el catálogo se caza, y se dice cuál | fixture: se borra uno |
| `AC-02` | El catálogo real no tiene ninguno | `audit` en verde |
| `AC-03` | Lo que **no** es comprobable se declara | `SUITE-R26` |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: quitar un trigger del catálogo pone `audit` en rojo nombrándolo, y el catálogo
> real no tiene ninguna puerta sin caso.

## 4. Qué NO entra

- **OUT**: comprobar que el catálogo esté **completo**. Un caso que no entre por un trigger —una
  operación de mantenimiento, una decisión— **no es detectable**, y se dice.

## Firma

```
Firmado por lote: EP-024
```

---

## Observaciones del agente   `INTAKE-R07`

- **La promesa entera no se puede verificar y su parte derivable sí.** El catálogo dice **dónde
  entrar**, y los puntos de entrada son los **triggers**, que el contrato ya declara. Comprobar eso
  no es comprobar la promesa: es comprobar **lo que de ella es comprobable**, y decir el resto.
