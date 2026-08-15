# PT-044 — El YAML del intake no puede mentirle al verificador

> Tarea de la implementación abierta `EP-012` (`FDGE-R51`).

```yaml
---
id: PT-044
type: BUG
epic: EP-012
track: STANDARD
status: INTEGRATED
created: 2026-08-14
structural: no
suite_version: 7.6.0
phase: 9
---
```

## 1. Qué se quiere   `[HUMANO]`

> «hazlos en orden»

Que el YAML de un intake no pueda declarar una fase que el registro contradice sin que nada
avise.

## 2. Comportamiento esperado y observado   `[HUMANO]`

**Observado.** `changes/PT-039..PT-042/intake.md` declaran `status: DRAFT` y `phase: 1` mientras
`REGISTRY.json` declara `INTEGRATED` y `phase: 9`. En `verify-fdge` el YAML **manda** sobre el
registro, así que la comprobación de `FDGE-R52` —`if (rigeAqui && fase >= 2)`— nunca llegó a
ejecutarse en los cuatro. Pasaron su compuerta sin que se evaluara si dejaron notas de reanclaje.
No las dejaron: `tracker notas` da `0` en los cuatro.

**Esperado.** Que una divergencia entre el YAML y el registro se **reporte**, en vez de decidirse
en silencio a favor de uno de los dos.

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Si el YAML del intake y el registro declaran fases o estados distintos, se **reporta** | selftest |
| AC-02 | La precedencia sigue siendo la de `PT-004` —manda el YAML— y se dice cuál se usó | selftest |
| AC-03 | Coinciden ⇒ ni error ni aviso: no se paga ruido por lo normal | selftest |
| AC-04 | Los cuatro intakes de `EP-011` quedan sincronizados y `verify-fdge --all` sin errores | ejecución |
| AC-05 | El **índice** tampoco puede contradecir al registro: `FDGE-R31` comprueba el valor, no que coincida | selftest |

> `AC-05` sale de mirar: `REFACTOR_SCOPE.md` declara `PT-039`…`PT-041` en `VALIDATION_PENDING` y
> `PT-042` en `READY` mientras el registro dice `INTEGRATED` en los cuatro, y `FDGE-R31` da verde
> porque solo comprueba que el estado sea **canónico**. Es el mismo defecto que el YAML, en un
> tercer archivo.

## 4. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `verify-fdge --all` reporta la divergencia YAML↔registro allí donde exista, y
> `PT-039`…`PT-042` dejan de tenerla sin que se fabrique ninguna nota de reanclaje retroactiva.

## 5. Qué NO entra   `[AGENTE]`

- OUT: escribir notas de reanclaje con fecha de hoy para transiciones que ocurrieron ayer. Sería
  un rastro falso, y es lo que el `HANDOFF` prohíbe explícitamente
- OUT: hacer `phase` obligatoria en la plantilla — es una decisión aparte: `PT-016`
- OUT: cambiar la precedencia de `PT-004`. El YAML sigue mandando; lo que cambia es que callar
  deje de ser una opción

## 6. Firma

```
Firmado por lote: EP-012
```

## Estado de cierre   `FDGE-R35`

```
CLOSED · integrado en la rama por defecto el 2026-08-14
G4 resuelta por Alberto Martinez: «tienes mi VoBo para G4, realiza el merge y el tracker
para cerrar». El directorio se CONSERVA: es el registro de la propuesta.
```
