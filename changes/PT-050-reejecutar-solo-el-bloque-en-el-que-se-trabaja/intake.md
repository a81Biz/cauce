# PT-050 — Reejecutar solo el bloque en el que se trabaja

> Tarea de la implementación abierta `EP-014` (`FDGE-R51`).

```yaml
---
id: PT-050
type: CHORE
epic: EP-014
track: STANDARD
status: INTEGRATED
created: 2026-08-15
structural: no
suite_version: 8.0.0
phase: 10
---
```

## 1. Qué se quiere   `[HUMANO]`

> «cómo reducir el coste de tokens sin perder el contexto»

Que estrenar un caso no cueste la batería entera. Hoy no hay forma de correr un subconjunto:
cada vuelta son **dos a cuatro minutos y 541 líneas** para comprobar seis casos nuevos.

En `EP-013` eso ocurrió más de quince veces, y dos de esas vueltas existieron **solo** porque el
caso nuevo estaba mal escrito y había que verlo fallar.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `--solo <patrón>` ejecuta únicamente los casos cuyo nombre casa | selftest |
| AC-02 | Dice **cuántos ejecutó de cuántos hay**: un subconjunto no puede parecer la batería | selftest |
| AC-03 | Un patrón que no casa nada **falla**, no pasa en verde por vacío | selftest |
| AC-04 | El fixture se construye igual: un subconjunto no comprueba menos, comprueba **menos casos** | selftest |

`AC-03` es el caso que `PT-023` aprendió por las malas: un `chkno` sobre un conjunto vacío pasa,
y el silencio parece éxito. Un `--solo` que no casa nada tiene que ser rojo.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `bash selftest.sh --solo "compuerta"` ejecuta solo esos casos, declara «N de
> 520», y `--solo "no-existe-nada-asi"` termina en rojo diciendo que no casó ninguno.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| El modo silencioso | PT-049 |
| Paralelizar la batería | — |
| Reordenar o partir `selftest.sh` en archivos | — |

## 5. Firma

```
Firmado por lote: EP-014
```

## Estado de cierre   `FDGE-R35`

```
INTEGRATED · integrado en la rama por defecto el 2026-08-18
G4 de EP-014 resuelta por Alberto Martinez: «haz el PR y el merge con lo que falte
de G4 para las tareas». El directorio se CONSERVA: es el registro de la propuesta
y de su evidencia.
```
