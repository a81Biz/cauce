# PT-007 — El issue lleva la fase y la compuerta

> Tarea de la implementación abierta `EP-002` (`FDGE-R51`). Plantilla `TAREA.md`.

```yaml
---
id: PT-007
type: FEATURE
epic: EP-002
track: STANDARD
status: INTEGRATED
created: 2026-08-13
structural: no
suite_version: 5.3.0
phase: 8
---
```

## 1. Qué se quiere   `[HUMANO]`

> «así podemos usarlo hasta de máquina de estados para saber qué va cuándo»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El issue declara en qué fase está su PT | Etiqueta derivada del registro, una sola por issue |
| AC-02 | El issue declara qué compuerta espera | Etiqueta `G1`..`G4` cuando hay una pendiente |
| AC-03 | El estado se **deriva**, nunca se lee de vuelta | `tracker` escribe desde `REGISTRY.json`; ninguna lectura de GitHub alimenta el registro |
| AC-04 | El espejo comprueba también el estado | Una etiqueta que no corresponde al registro es divergencia |
| AC-05 | Sin plataforma declarada no cambia nada | Caso de `selftest.sh` |
| AC-06 | Se puede leer «qué va cuándo» sin abrir el repositorio | `tracker estado` imprime el tablero: PT, fase, compuerta, a quién espera |
| AC-07 | Las etiquetas nuevas se crean si faltan | Como ya hace `abrir` (`FND-R30`) |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `tracker espejo` falla si la etiqueta de fase de un issue no corresponde a la
> fase que declara el registro.

## 4. Qué NO entra   `[AGENTE]`

- OUT: que el estado se pueda cambiar desde GitHub. La plataforma espeja; no asigna (`SUITE-R08`, `SUITE-R35`)
- OUT: GitHub Projects. Las etiquetas bastan y un tablero añadiría una segunda representación del mismo hecho
- OUT: milestones
- OUT: publicar el contenido de cada fase en el issue. Es trabajo aparte y no pertenece a esta tarea

## 5. Firma

```
Firmado por lote: EP-002
```

---

## La condición que hace esto seguro

El estado en GitHub es **derivado**. `tracker` lo escribe leyendo `REGISTRY.json` y el espejo
comprueba que coincida; en ningún punto se lee una etiqueta para decidir nada dentro del
repositorio.

Si el estado se pudiera editar en GitHub habría dos fuentes de verdad, y esa es exactamente la
avería que la v4 nació para eliminar. Que la etiqueta sea de solo escritura desde el registro
es lo que separa un espejo de una segunda fuente.
