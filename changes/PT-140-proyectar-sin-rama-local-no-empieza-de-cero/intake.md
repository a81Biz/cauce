# PT-140 — `proyectar` arranca un linaje nuevo en silencio

> Tarea dentro de la implementación abierta `EP-021` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-140
type: BUG
epic: EP-021
track: STANDARD
status: DRAFT
phase: 8
created: 2026-08-24
structural: no
suite_version: 13.0.0
origen_parada: EP-021
---
```

## 1. Qué se quiere   `[HUMANO]`

`tracker proyectar` toma `refs/heads/<rama>` como padre. Si esa referencia **no existe**, el
commit se crea **sin `-p`** y la rama de proyección arranca un linaje nuevo desde cero. **No hay
aviso**: la salida es idéntica a la del caso bueno.

```
cauce/alberto-martinez ← <sha> · N allocation(es), 2 archivo(s)
```

Ocurrió en esta sesión al dejar una sola rama local. No se perdió nada porque el `push` normal
habría sido rechazado por no ser fast-forward: **protegido por accidente, no por diseño**. Con el
rechazo sin explicación, la lectura obvia —«la rama está rara, la fuerzo»— sí destruye.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Si falta `refs/heads/<rama>` y el remoto **sí** la tiene, `proyectar` se **niega** y dice cómo traerla | un caso con la rama sólo en el remoto |
| AC-02 | Si no existe en ninguna parte, la **crea** diciendo que es la primera vez | un caso sin rama en ningún sitio |
| AC-03 | Con la rama local presente, sigue comportándose igual: el arreglo no cambia la ruta que ya funcionaba | la inversa del caso anterior |
| AC-04 | Distingue **no poder mirar el remoto** de **no existir allí**: no saber no es permiso | un caso sin acceso al remoto |
| AC-05 | `SUITE-R31` lo cita: la simetría de «un commit sin marca se reporta y no se borra» | `verify-suite` sin errores |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `proyectar` sin rama local pero con rama remota se detiene con un mensaje que
> dice qué hacer, y un caso lo ejecuta.

## 4. Qué NO entra   `[AGENTE]`

- OUT: traer la rama automáticamente. Un `fetch` implícito dentro de un comando que escribe es
  justo el efecto colateral que este marco evita: se **describe** el comando.
- OUT: revisar si otras acciones asumen que una rama local existe. Si las hay es un hallazgo
  aparte y se abre aparte.

## 5. Firma

```
Firmado por lote: EP-021
```

---

## Observaciones del agente   `INTAKE-R07`

- **Es `CE-005`**, verde por no haber mirado: la acción informa de éxito sin haber comprobado lo
  único que hacía válido su resultado. `CE-005` es una de las seis clases **sin regla que la
  reclame**, y ésta sería su primera instancia cerrada con mecanismo.
- **`SUITE-R31` ya tiene el criterio correcto para el caso hermano**: un commit sin la marca
  `cauce:proyeccion` se **reporta y no se borra**, porque decidir qué hacer con el trabajo de
  alguien es humano. Falta la mitad simétrica: cuando la rama local **falta**, tampoco se empieza
  de cero en silencio.
- **Lo encontró el agente cometiéndolo**, no una auditoría.
