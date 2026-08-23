# PT-129 — FDGE-R19 enumera tres niveles, el arbol tiene cuatro tipos, y nada compara las ramas reales

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-129
type: BUG
epic: EP-020
track: STANDARD
status: READY
phase: 1
created: 2026-08-22
structural: si
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «ahora veo que tenemos ramas como cauce/ chore/ y fix/ y no es algo que esté en la convención del propio marco de trabajo, necesitas corregirlo, asegurar la regla de negocio y meterla como tarea para que no vuelva a ocurrir»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `FDGE-R19` enumera **todos** los tipos de rama que el marco produce, o remite explícitamente al documento que declara los que faltan | hoy dice «la topología de ramas es esta, en tres niveles» y `tracker proyectar` crea un cuarto tipo, `cauce/<usuario>`, declarado sólo en `LEXICON` §810 y §875 |
| AC-02 | Existe una comprobación que **enumera las ramas reales** —locales y remotas— y las contrasta con la topología declarada | hoy `verify-fdge` mira `allocations[].branch`, que es el campo DECLARADO, y nunca pregunta al árbol qué ramas hay |
| AC-03 | Una rama efímera cuya tarea está en estado terminal se **reporta**: `FDGE-R19` dice que se borra al fusionarse y nada lo comprueba | `origin/fix/alberto-martinez/PT-081-una-regla-nueva-no-rige-hacia-atras` sigue viva con `PT-081` en `INTEGRATED` |
| AC-04 | Una rama que no encaja en ningún tipo declarado se **nombra**, no se ignora ni se borra sola | `desarrollo` lleva declarada sobrante desde la divergencia `D8` de Foundation |
| AC-05 | La comprobación **informa y no borra**: borrar una rama remota es `SUITE-R06f` y no se automatiza | la inversa: la herramienta describe el comando y no lo ejecuta (`EXEC-R07`) |
| AC-06 | `cauce/<usuario>` declara además cuándo está **vieja**, igual que el grafo declara `SUSPECT` | hoy dice «13 allocation(s) vivas» con 18 vivas, y nada lo advierte |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: preguntar «qué ramas hay y cuáles sobran» se responde enumerando el árbol, no leyendo una regla.

## 4. Qué NO entra   `[AGENTE]`

- OUT: borrar `origin/desarrollo` ni ninguna otra rama remota: es `SUITE-R06f` y queda como acción humana descrita
- OUT: renombrar las ramas ya creadas. `FDGE-R19` ya declara que una rama se termina como empezó, porque renombrarla rompe el pull request abierto sobre ella
- OUT: cambiar la convención de nombres. Se completa la enumeración; no se inventa una topología nueva
- OUT: regenerar la proyección aquí. `tracker proyectar` ya existe; lo que falta es que algo diga cuándo está vieja

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **No es que `cauce/` esté fuera de convención: es que la regla no la enumera.** `LEXICON` §810 la declara —«la proyección DERIVADA del estado (PT-054)»— y `LEX-R21` pone a `LEXICON` por encima de `RULES`, así que la rama es legítima. Lo que está mal es que `FDGE-R19` afirme «la topología de ramas es **esta**, en tres niveles» y esa enumeración esté incompleta.
- **Una enumeración que se presenta como completa y no lo es** es la misma familia que `PTSA-R79` cierra en las auditorías: se termina cuando la enumeración está completa, no cuando el que la escribe deja de recordar tipos.
- **Y el hueco de fondo es el proxy en lugar del hecho, décima instancia**: `verify-fdge` comprueba el campo `branch` que la allocation DECLARA y nunca enumera las ramas que EXISTEN. Con eso, una rama puede sobrevivir a su tarea —o existir sin ninguna— sin que nada lo note. Es donde se esconde el trabajo sin allocation que persigue `PT-127`.
- **Severidad `S2` y no `S1`, declarado para que sea contestable**: hoy no bloquea ninguna compuerta ni corrompe ningún estado. Lo que produce es que la topología sea **inverificable**, y dos ramas sobrantes que nadie echa en falta. Si el firmante lo ve como `S1`, se sube: la severidad es suya (`INTAKE-R06`).
