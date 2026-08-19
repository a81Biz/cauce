# PT-068 — La marca de sesión es de quien la abre

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-068
type: BUG
epic: EP-017
track: STANDARD
status: READY
phase: 5
created: 2026-08-19
structural: no
suite_version: 9.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Que nadie derive como suyo el trabajo de otro. `PT-065` movió la escritura a `SESSION-<persona>.json` y dejó la lectura con `?? SESSION.json`, que ya nadie escribe: un usuario no declarado lee la marca congelada de una sesión cerrada ajena y sus cifras salen etiquetadas `MEDIDO`.»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Un usuario no declarado NO deriva la sesión de otra persona | con `user.name` desconocido, `tracker sesion` no devuelve los commits de Alberto |
| AC-02 | La misma persona no aparece como dos sesiones abiertas | `Otras sesiones abiertas` no lista dos veces el mismo nombre canónico |
| AC-03 | Los mensajes dicen el archivo que de verdad se escribe | `sesion abrir` nombra `SESSION-<persona>.json`, no `SESSION.json` |
| AC-04 | El mensaje de `sesion cerrar` deja de afirmar algo falso | no dice «la sesion siguiente lo sobrescribe» de un archivo que nadie sobrescribe |
| AC-05 | Con una sola persona declarada nada cambia | `AC-05` de `PT-065` sigue verde |
| AC-06 | El caso cubre la **elección de archivo**, no sólo las funciones puras | el arnés ejercita `sesion` con identidades distintas; hoy todos los casos construyen la marca a mano |
| AC-07 | `viabilidad` lee la MISMA marca que `sesion` | hoy no: `tracker sesion` dice `41aeaa8` y `tracker viabilidad` dice `258be16`, el huérfano. El «mayor hecho» del presupuesto está calculado sobre la sesión equivocada **para todos**, no sólo para un usuario no declarado |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: con una identidad no declarada, `tracker sesion` no atribuye trabajo ajeno, y ningún mensaje nombra un archivo distinto del que escribe.

## 4. Qué NO entra   `[AGENTE]`

- OUT: Sincronizar sesiones entre máquinas y cualquier cosa que necesite algo encendido — `PT-065` ya lo declaró fuera.
- OUT: Borrar el `SESSION.json` de alguien que dejó el proyecto: decidir eso es de una persona.
- OUT: Cambiar `sesionDe` ni `handoffDeSesion`: son puras y reciben la marca. Lo que se arregla es **de qué archivo sale**.

## 5. Firma

```
Firmado por lote: EP-017
```
