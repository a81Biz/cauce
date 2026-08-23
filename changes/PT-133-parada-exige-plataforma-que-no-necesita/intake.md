# PT-133 — `parada` exige plataforma para escribir en `TRANSICIONES.log`

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-133
type: BUG
epic: EP-020
track: STANDARD
status: READY
phase: 8
created: 2026-08-23
structural: no
suite_version: 13.0.0
origen_parada: PT-117
---
```

## 1. Qué se quiere   `[HUMANO]`

Nace de la **parada de `PT-117`** publicada en `#235` (`motivo: hallazgo`, `desenlace: abre`).
No se arregló en línea: es exactamente lo que el firmante exigió el 2026-08-22 —*«debes abrir el
pt con el bug»*— y lo que `AC-02` de `PT-117` existe para hacer exigible.

`tracker parada` no está en `SIN_PLATAFORMA`, así que un proyecto sin tablero sale antes de llegar
a su propio código:

```
El proyecto no declara plataforma de trabajo en REGISTRY.json
```

La rama que escribe en `TRANSICIONES.log` **está escrita** —es el `else` de la publicación— pero
es **inalcanzable**. `PT-116` la declaró cumplida en su `AC-03` con `verified: true`.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `parada` corre en un proyecto que no declara plataforma y escribe en `TRANSICIONES.log` | un caso que la **ejecuta** sobre el fixture, que no declara tablero |
| AC-02 | Con plataforma, sigue publicando en el issue: el arreglo no cambia la ruta que ya funcionaba | la inversa del caso anterior |
| AC-03 | El `AC-03` de `PT-116` se corrige en su evidencia: estaba en verde sobre una ruta inalcanzable | `FDGE-R29`: entrada `CORRIGE` en `HISTORY.log`, no reescritura |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `tracker parada` escribe en `TRANSICIONES.log` en un repositorio sin plataforma,
> y un caso lo ejecuta de verdad.

## 4. Qué NO entra   `[AGENTE]`

- OUT: revisar las otras acciones de `SIN_PLATAFORMA`. Si hay más en la misma situación es un
  hallazgo aparte y se abre aparte — mezclarlos haría imposible saber cuál rompió qué.
- OUT: reescribir el `manifest.json` de `PT-116`. `SUITE-R09` es append-only: la corrección se
  **añade** (`FDGE-R29`), no se borra la afirmación equivocada.

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **`PT-084` midió este mismo defecto en `avanzar`**: exigía plataforma, y un proyecto sin ella no
  podía avanzar ni una fase. `PT-116` **citó ese precedente en su propio `AC-03`** —está escrito
  en su `manifest.json`— y volvió a cometerlo en el archivo de al lado, **en la misma sesión**.
  Es la clase que `EP-020` persigue: la lección estaba escrita y no impidió su repetición.
- **Cómo se escapó, que es lo que hay que arreglar de fondo:** la evidencia de aquel `AC-03` fue
  *«la rama sin `adaptador.comentar`»*. Se comprobó que la rama **existe**, no que se **ejecuta**.
  Es la misma clase que `PT-124` nombró y la que `PT-116` tuvo que rehacer en su propio caso de
  `ROOT` a mitad de tarea: **tres instancias en dos tareas seguidas**.
- Lo cazó un caso de `PT-117` que no buscaba esto.
