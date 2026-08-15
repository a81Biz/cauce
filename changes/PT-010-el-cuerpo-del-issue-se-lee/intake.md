# PT-010 — El cuerpo del issue se lee, y su enlace resuelve

> Tarea de la implementación abierta `EP-003` (`FDGE-R51`).

```yaml
---
id: PT-010
type: BUG
epic: EP-003
track: STANDARD
status: INTEGRATED
created: 2026-08-13
structural: no
suite_version: 6.0.0
phase: 8
---
```

## 1. Qué se quiere   `[HUMANO]`

> «estoy viendo en los issue que no hay nada de la EP-002»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El cuerpo de un issue de `EP` no dice «sin implementación» sobre sí mismo | Caso de `selftest.sh` sobre la función que compone el cuerpo |
| AC-02 | El enlace al intake resuelve desde un issue | Absoluto, derivado del remoto |
| AC-03 | Si no se puede derivar la URL, no se inventa | Se escribe la ruta sin enlace y se dice por qué (`RULE-06`) |
| AC-04 | El cuerpo dice de qué va sin salir de GitHub | Título del trabajo y, en un `EP`, sus tareas con su enlace |
| AC-05 | Los issues abiertos ya creados se sincronizan | `abrir --aplicar` actualiza también el cuerpo |
| AC-06 | Sigue sin copiar el intake | `SUITE-R35`: referencia, no copia |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: el cuerpo de un issue de `EP` enlaza su intake con una URL que resuelve y no
> se contradice, y los issues abiertos existentes quedan sincronizados.

## 4. Qué NO entra   `[AGENTE]`

- OUT: copiar el intake al issue (`SUITE-R35`)
- OUT: reescribir los issues ya cerrados
- OUT: comprobar automáticamente que un enlace resuelve — sería pedir red en una compuerta

## 5. Firma

```
Firmado por lote: EP-003
```

---

## Evidencia de que el defecto existe

El cuerpo del issue #9, que es el de la implementación `EP-002`:

```
**EP** · severidad — · sin implementación

Intake, criterios de aceptación y evidencia: [`changes/EP-002-…/`](changes/EP-002-…/)
```

**Dos cosas mal en cuatro líneas.** Dice «sin implementación» sobre la implementación misma
—el generador usa un solo texto y un `EP` no tiene campo `epic`—, y el enlace es relativo: en
el cuerpo de un issue de GitHub eso apunta a `github.com/a81Biz/cauce/changes/…`, que no
existe.

Por eso al abrir `#9` no había «nada de EP-002»: lo único que había era un enlace roto.

**Ninguna comprobación lo habría detectado.** No hay nada en el marco que compruebe que un
enlace resuelve ni que un texto no se contradice. Lo vio una persona mirando el tablero.
