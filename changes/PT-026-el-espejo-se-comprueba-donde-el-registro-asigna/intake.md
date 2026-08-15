# PT-026 — El espejo se comprueba donde el registro asigna

> Tarea de la implementación abierta `EP-006` (`FDGE-R51`).

```yaml
---
id: PT-026
type: BUG
epic: EP-006
track: STANDARD
status: INTEGRATED
created: 2026-08-13
structural: no
suite_version: 7.0.0
phase: 10
---
```

## 1. Qué falla   `[AGENTE]`

Arreglado `PT-024`, la CI de `main` volvió a fallar — con otro mensaje:

```
✗ PT-011: su issue #18 declara «G4, fase: 9» y el registro dice «fase: 8».
```

`main` tiene el registro **del momento del merge**. El tablero refleja el trabajo, que sigue
avanzando en `trabajo`. Comparar una foto contra algo vivo **diverge siempre**: no es una
ventana de tiempo, es una propiedad estructural.

Mientras haya trabajo en curso —y siempre lo hay— la CI de `main` estará en rojo. Es un rojo
permanente, que es exactamente lo que `SUITE-R35` existe para evitar.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | En la rama por defecto el espejo **informa** y no bloquea | selftest |
| AC-02 | Fuera de ella sigue bloqueando exactamente igual | selftest |
| AC-03 | Cuando informa, dice **por qué** y dónde sí se comprueba | selftest |
| AC-04 | La comprobación sigue viva en `G4`, que es donde decide | `verify-fdge --gate G4` |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: el espejo bloquea donde el registro asigna y solo informa donde es una foto, y
> la CI de la rama principal deja de tener un rojo que nadie puede arreglar desde ahí.

## 4. Qué NO entra   `[AGENTE]`

- OUT: quitar el espejo de la CI. Informar no es callar
- OUT: quitarlo de `G4`. Ahí es donde la comprobación decide algo
- OUT: sincronizar el tablero desde `main`. Sería el registro de la foto asignando

## 5. Firma

```
Firmado por lote: EP-006
```
