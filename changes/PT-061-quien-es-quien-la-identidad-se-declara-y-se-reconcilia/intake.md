# PT-061 — Quién es quién

> Tarea de la implementación abierta `EP-016` (`FDGE-R51`).

```yaml
---
id: PT-061
type: CHORE
epic: EP-016
track: STANDARD
status: READY
created: 2026-08-18
structural: no
suite_version: 8.2.0
phase: 2
---
```

## 1. Qué se quiere   `[HUMANO]`

Que el marco sepa **de quién** es un commit, una rama y una sesión — y que lo sepa sin adivinarlo.

Medido al abrir el lote, en un repositorio de **una sola persona**:

```
217 commits   Alberto Martínez <alberto@a81.biz>
  9 commits   a81Biz <albe.mtz@gmail.com>
  1 commit    Alberto Martínez <albe.mtz@gmail.com>
```

**Tres identidades para la misma persona.** `ramaDe(usuario)` usa `git config user.name`, que da
una de las tres según la máquina. Con dos personas, cualquier cosa que el marco derive de «quién»
sería falsa la mitad de las veces.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Las personas se **declaran** en `REGISTRY.json`, con sus identidades de git | selftest |
| AC-02 | Un commit se atribuye a una persona **declarada**, no a un nombre de git | selftest |
| AC-03 | Un autor de git que **no** está declarado se **reporta**; no se inventa a quién pertenece | selftest |
| AC-04 | La lista de firmantes de `CLAUDE.md` y las personas del registro **no divergen** en silencio | `verify-suite` |
| AC-05 | El nombre canónico de una persona es **uno**, y de él sale su rama (`PT-054`) | selftest |

`AC-03` es el que impide que esto empeore las cosas: atribuir por parecido —mismo apellido, mismo
dominio— convertiría una duda en un dato, que es lo que `EP-015` pasó cuatro lotes aprendiendo a
no hacer.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: preguntar de quién es un commit responde con una **persona declarada** o dice que
> no lo sabe, y las tres identidades de este repositorio se reconcilian en una sola persona sin
> tocar la historia.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| Los rangos de ID | PT-062 |
| El usuario en la rama de tarea | PT-063 |
| Usar la atribución para el coste y el precedente | PT-064 |
| Permisos: quién **puede** hacer qué | — |
| Reescribir la historia para unificar autores | — |

**La cuarta lleva `—`**: esto dice **quién es**, no **qué puede**. `SUITE-R27` ya declara que la
lista de firmantes no prueba que firmara una persona; esto tampoco lo prueba, y no debe fingirlo.

**Y la quinta:** `git filter-branch` sobre 227 commits para unificar tres nombres es reescribir
historia (`SUITE-R06f`), y no hace falta: la reconciliación es una **tabla**, no una cirugía.

## 5. Firma

```
Firmado por lote: EP-016
```
