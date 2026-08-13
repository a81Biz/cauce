# PT-004 — Estrategia   `PHASE 3`

## Objetivo

Que `verify-fdge` exija cada artefacto **desde la fase que lo produce**, sin relajar
`FDGE-R15` ni `FDGE-R42`, y sin que un PT sin fase declarada se convierta en un hueco
silencioso.

## Hallazgo que cambia la estrategia respecto a `PHASE 2`

`discovery.md` dejó abierta la pregunta «de dónde sale la fase» con tres candidatos. Al leer
el arnés, la pregunta está **ya respondida en el repositorio** y no hacía falta decidirla:

```
selftest.sh:66-69   las cuatro allocations del fixture declaran "phase"
selftest.sh:275     el fixture de continuidad también
verify-fdge.mjs:757 const fase = intake YAML  ??  REGISTRY.allocations[].phase  ??  0
```

La precedencia —intake por encima del registro— **está implementada desde antes de este PT**.
El fixture la ejerce. Lo que falta no es una fuente: es que dos comprobaciones la consulten.

Esto sube la confianza de solución del **70 % al 90 %**: la decisión que bloqueaba `PHASE 3`
no era una decisión, era una lectura que faltaba. Se registra así porque una confianza que
sube sin decir por qué es una cifra inventada.

## Solución propuesta

Condicionar las dos exigencias a la fase ya calculada en `:757`, que está en ámbito en los
dos puntos (`:792` y `:808` caen dentro de la misma función, después de esa línea).

| Comprobación | Hoy | Propuesto |
|:---|:---|:---|
| `FDGE-R42` · `discovery.md` | falla siempre que falte | falla desde `PHASE 2` |
| `FDGE-R15` · `traceability.md` | falla siempre que falte | falla desde `PHASE 4` |
| Fase no declarada en ninguna fuente | se asume `0` en silencio | **aviso explícito**: la exigencia queda `SIN EVALUAR` y se dice cómo declararla |

El tercer punto es el que hace la propuesta compatible con `RULE-06`: hoy el `?? 0` **inventa
un valor por defecto**, y sobre un valor inventado la compuerta diría «todo bien» sobre nada.
Con el cambio, un PT sin fase no pasa por callar: pasa diciendo qué no se pudo comprobar.

## Alternativas evaluadas

**A · Inferir la fase de los artefactos presentes.** Es lo que ya se hace para `PHASE 6` con
`afterPhase6 = manifest !== null` (`:806`). **Rechazada:** para `traceability.md` es circular
—el artefacto cuya presencia habría que inferir es el que se comprueba— y para `discovery.md`
haría que borrar el archivo *satisficiera* la regla. Una comprobación que se cumple
destruyendo su objeto es peor que ninguna.

**B · Derivar la fase del `status` de la allocation.** `IN_PROGRESS` no dice si el PT está en
`PHASE 2` o en `PHASE 7`. **Rechazada:** `LEX-R07` define tres enumeraciones distintas y
`status` no es `phase`; mezclarlas crearía un nombre nuevo fuera de `LEXICON` (`LEX-R20`).

**C · Exigir `phase` obligatoria y fallar sin ella.** **Rechazada por ahora:** ningún PT
abierto con `TAREA.md` la declara —la plantilla no la incluye— y los proyectos ya instalados
tampoco. Convertirla en obligatoria de golpe pone en rojo a todo proyecto existente, que es
el mismo daño que este PT arregla, en la otra dirección. El aviso explícito consigue que se
note sin romper a nadie; hacerla obligatoria es una decisión posterior con su propia entrada
de CHANGELOG.

**D · Quitar `verify-fdge --all` de CI.** **Rechazada:** apaga la compuerta en vez de
arreglarla. Está en el out-of-scope del intake.

## Dependencias

- Ninguna sobre otras tareas del lote para el arreglo en sí.
- **`AC-06` del intake no se puede satisfacer con este PT solo.** Dice «CI puede estar en
  verde con trabajo abierto», y quedará un error ajeno: `FDGE-R52` busca `bitacora.md` e
  ignora la plataforma que `CORE.md` manda usar. Ese defecto es de `PT-001` (`AC-07`), y
  tocarlo aquí violaría el scope lock (`FDGE-R20`). `AC-06` se reformula abajo y su
  verificación completa se traslada al cierre de `PT-001`. Queda registrado como revisión del
  intake, no como cambio silencioso.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Riesgo | Mitigación |
|:---|:---|:---|
| Un PT en fase avanzada deja de ser comprobado por error de umbral | **Alto si ocurre** | Caso inverso obligatorio: fase 4 sin `traceability.md` sigue fallando. Es `AC-03` |
| Proyectos ya instalados cuyas allocations no declaran `phase` | Medio | Caen en la rama «sin evaluar» con aviso. No se rompen y no pasan en silencio |
| Los 180 casos del arnés | Bajo | El fixture declara `phase` en todas sus allocations: los umbrales nuevos no cambian su resultado. Se ejecuta la batería completa |
| Proyectos destino, vía paquete (`LEX-R25`) | Medio | El cambio es de estrictez a la baja salvo en el caso inverso; ningún proyecto pasa a fallar por algo que antes pasaba |

## Restricciones   `11-Conventions.md`

`RULE-02` un fallo distinguible del éxito · `RULE-03` `split(/\r?\n/)` · `RULE-04` cero
dependencias · `RULE-05` un verificador no escribe · `RULE-06` lo no comprobable se declara
no evaluable · `RULE-07` la salida dice qué hacer.

## Criterios de éxito derivados de los AC

1. `verify-fdge --all` sobre este repositorio deja de reportar `FDGE-R15` y `FDGE-R42` sobre
   PTs que no han alcanzado la fase que los produce (`AC-01`, `AC-02`).
2. Un PT en `PHASE 4` sin `traceability.md` sigue fallando (`AC-03`).
3. Un PT sin fase declarada produce un aviso que nombra el campo y dónde escribirlo
   (`AC-04`, `AC-05`).
4. Los 180 casos existentes siguen en verde.

## Autorrevisión

- ¿Contradice el intake? No. `FDGE-R15` y `FDGE-R42` siguen siendo obligatorias.
- ¿Falta alguna dependencia? La de `AC-06`, declarada arriba y trasladada a `PT-001`.
- ¿Alguna `RULE-nn` en riesgo? `RULE-06` era la que estaba violada; la propuesta la restaura.
- ¿Algún AC sin cubrir por la solución? `AC-06`, con su motivo escrito.
