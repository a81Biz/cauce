# PT-009 — `tracker` firma lo que escribe

> Tarea de la implementación abierta `EP-003` (`FDGE-R51`).

```yaml
---
id: PT-009
type: BUG
epic: EP-003
track: STANDARD
status: READY
created: 2026-08-13
structural: no
suite_version: 6.0.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «vamos a EP-003»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Todo comentario que escribe `tracker` lleva la marca de procedencia | Caso de `selftest.sh` sobre la función que compone el mensaje de cierre |
| AC-02 | `verify-fdge --all` vuelve a verde | Ejecución real sobre este repositorio |
| AC-03 | La regla no se relaja | `SUITE-R43` conserva su texto; lo que cambia es quién firma |
| AC-04 | Un comentario ajeno sigue bloqueando | El caso que ya existe no cambia de resultado |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `verify-fdge --all` sale sin errores y el mensaje de cierre de `tracker`
> lleva la marca.

## 4. Qué NO entra   `[AGENTE]`

- OUT: relajar `SUITE-R43`. Se arregla quien escribe, no la regla que lo detecta
- OUT: marcar retroactivamente comentarios ya publicados
- OUT: el cuerpo del issue — es `PT-010`

## 5. Firma

```
Firmado por lote: EP-003
```

---

## Evidencia de que el defecto existe

```
$ verify-fdge --all
✗ SUITE-R43  PT-008: hay un comentario sin responder en el issue #12, posterior a la última
             nota del agente.
```

Ese «comentario sin responder» es el mensaje que `tracker cerrar` escribió al cerrar el issue:
`«PT-008 pasó a INTEGRATED. La evidencia está en el repositorio.»`. No lleva marca, así que
`SUITE-R43` lo cuenta como humano.

**Lo cazó la regla que `PT-008` creó, sobre la herramienta que la implementa, en la primera
ejecución posterior.** Nadie lo buscó.
