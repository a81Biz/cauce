# PT-082 — Un caso no depende de quien lo ejecuta, y la rama de integración no acepta rojo

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-082
type: BUG
epic: EP-017
track: STANDARD
status: INTEGRATED
phase: 9
created: 2026-08-19
structural: no
suite_version: 9.0.0
severity: S1
---
```

## 1. Qué está pasando   `[HUMANO]`

Al ejecutar la `G4` autorizada, CI dio **rojo** en el PR `#152`. Un solo caso:

```
✗ viabilidad nombra la sesion abierta  (no apareció: en la sesion abierta en)
```

Y al mirarlo apareció algo peor: **los PR `#148` y `#149` se habían fusionado con ese mismo rojo**.

## 2. Las dos causas, que son distintas

### `A` · el caso depende de quién lo ejecuta

`TRR` corre contra el **repositorio real**, y `viabilidad` resuelve la identidad con
`git config user.name` contrastada contra `personas`. En CI esa identidad es la del runner, no
casa, y `marcaDe` devuelve `null`.

**El código no está mal: `PT-068` está haciendo exactamente lo que debe** — negarse a atribuir la
sesión de otra persona. Lo que está mal es un caso que afirma un resultado dependiente de la
máquina. Reproducido en local antes de tocar nada:

```
identidad ajena      →  «en el DIA 2026-08-19 — no hay sesion abierta»
identidad declarada  →  «en la sesion abierta en 7735ff4»
```

Es la **novena** vez del patrón «probar donde trabajo, no donde se decide», que el propio
`HANDOFF.md` ya lista en su `no hacer`. Esta es la primera que llega a `main`.

### `B` · en `trabajo` el check era consultivo

`verificacion.yml` corre en **todos** los `pull_request`, así que el rojo estaba a la vista en
`#148` y `#149`. Lo que faltaba era el mecanismo:

| Rama | Protección, antes |
|:---|:---|
| `main` | `required_status_checks: [marco]` · `strict` · `enforce_admins` |
| `trabajo` | **ninguna** |

Sin ella, `gh pr merge` fusiona en rojo sin protestar. Es `PT-075` otra vez: la regla «no fusiones
en rojo» existe de hecho y **no la ejecuta nada**.

Y la prueba de que el mecanismo funciona cuando existe: el PR `#152` de la `G4` está `BLOCKED`
por la protección de `main`, con `enforce_admins: true`. **No es contención voluntaria mía.**

## 3. Qué NO es la causa

Descartado midiéndolo: no es que faltaran PR a `main`. El firmante lo preguntó —«¿será necesario
obligar el PR a main cada tanto?»— y la respuesta es **no**: la verificación ya se ejecutaba en la
rama donde trabajamos y ya fallaba. Más merges a `main` habrían añadido ceremonia sin cerrar nada.

## 4. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El caso no depende de la identidad de la máquina | la identidad va inyectada por `GIT_CONFIG_*` |
| AC-02 | La **otra** rama del `if` también tiene caso | una identidad ajena NO hereda la sesión, y lo dice |
| AC-03 | El arreglo se comprueba en las dos direcciones | reproducido en rojo antes, verde después |
| AC-04 | `trabajo` rechaza un merge en rojo | `required_status_checks: [marco]`, `strict`, `enforce_admins` |
| AC-05 | El cambio de configuración queda **documentado**, no volando | el comando exacto y su verificación, en `acciones-humanas.md` |
| AC-06 | La batería sigue verde | `selftest` sin fallos |

## 5. Cómo termina   `FDGE-R53`

> Termina cuando: el caso pasa con cualquier identidad, existe un caso para cada rama del `if`,
> `trabajo` está protegida con el mismo check que `main`, y el cambio de configuración está
> escrito con su comando y su comprobación.

## 6. Qué NO entra   `[AGENTE]`

- OUT: Revisar las otras ocho apariciones del patrón. Están cerradas; aquí se arregla la novena.
- OUT: Cambiar `marcaDe` ni `personaLocal`. Funcionan; el defecto es del caso.
- OUT: Hacer que `verify-fdge` consulte `gh pr checks`. Se evaluó y se descartó: sería evitable
  no ejecutándolo, y depende de tener `gh` autenticado. La protección de rama no se puede evitar.
- OUT: Fusionar el PR `#152`. Es `G4` y espera a que CI esté verde.

## 7. Firma

```
Firmado por lote: EP-017
```
