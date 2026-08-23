# PT-127 — Nada detecta el trabajo sin allocation: solo lo corta una persona

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-127
type: BUG
epic: EP-020
track: STANDARD
status: READY
phase: 8
created: 2026-08-22
structural: no
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «lo empezarás a arreglar, ese arreglo te vas a saltar el marco de trabajo, entonces debes abrir el pt con el bug para poder hacer la corrección necesaria (si no te lo digo, no lo harías) y esto es algo que se debe evitar y debe estar en esta EP»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Un commit que toque rutas gobernadas cita un identificador que existe en `REGISTRY.json` **y estaba vivo** en ese commit | los diez commits del cierre de EP-019 citan «EP-019», que estaba CLOSED, y nada falló |
| AC-02 | El identificador citado cumple el formato de `FDGE-R19`: `<type>: PT-XXX`, un **PT** y no un lote | hoy diez commits dicen «fix: EP-019» y ningún verificador mira el prefijo |
| AC-03 | La comprobación corre en `verify-fdge` con su fila en `RIGE_DESDE`, así que no juzga los 200+ commits anteriores | la inversa sobre un commit histórico: no se mira |
| AC-04 | Distingue los dos casos que el ledger separa: el agente **eligió** rodear el marco, y el marco **obligó** a rodearlo porque la herramienta no podía hacerlo | dos casos, y el segundo remite a la tarea que arregla la herramienta, no acusa al agente |
| AC-05 | Lo que no sea mecanizable se declara con su número (`SUITE-R26`) | audit lo publica como hueco medido, no como promesa |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: un commit que trabaja sin allocation viva falla mecánicamente, en vez de depender de que una persona lo note.

## 4. Qué NO entra   `[AGENTE]`

- OUT: impedir un commit con un hook local: el marco no automatiza actos irreversibles, y un hook que se puede desactivar no es una compuerta
- OUT: reescribir la historia para corregir los commits ya escritos (SUITE-R06f)
- OUT: juzgar los commits anteriores a la fila de RIGE_DESDE

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **La clase faltaba en la matriz y es culpa mía.** La medí en el §2.2 del intake del lote —7 commits, 0 allocations— y no la convertí ni en clase ni en tarea. Lo señaló el firmante. Entra ahora como clase dieciséis.
- **Instancias medidas en el ledger, y el patrón es el que importa:** `PT-082` (commits directos a una rama protegida) · `PT-094` («empecé a repararlo POR FUERA del marco: sin intake, sin PT y sin issue. **Lo cortó el firmante**») · `PT-099` («me obligó a saltarme el marco **TRES VECES** en esta misma sesión») · `PT-103` («cumplir el marco exigía saltársela. Ocurrió **CINCO veces**») · y esta sesión, dos veces más, las dos cortadas por el firmante.
- **Ninguna la detectó un verificador. Todas las cortó una persona, o ninguna.** Ésa es la propiedad que hace la clase distinta de «el acto fuera del comando»: allí hay una herramienta que no se usó; aquí no hay gobierno en absoluto.
- **Y el detector es barato**: `git log` cruzado con `REGISTRY`. Que no exista después de 126 tareas es la medida de que nadie lo había contado.
