# PT-079 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | El enlace apunta a un ref durable | E1 · E3 | `selftest.sh`: «el enlace usa el ref durable» · «sin ref durable no inventa enlace» · «…y lo DICE» | `salidas/enlaces.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-02 | El ref es el del **contenido**, derivado | E2 · E4 | `selftest.sh`: «…y un SHA tambien vale» · «la rama del espejo NO decide» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-03 | Los enlaces rotos quedan arreglados | E5 | medición sobre el tablero **completo** | `salidas/enlaces.txt` · `salidas/reparacion.txt` | - | VERIFICADO |
| AC-04 | **Falla** si un issue vivo enlaza a una rama inexistente | E5 · E6 | `compararEspejo` con `refExiste` inyectado | `salidas/enlaces.txt` · `salidas/reparacion.txt` | - | VERIFICADO |
| AC-05 | `proyectar` registra el SHA del contenido | E7 | `estadoProyectado` con el cuarto resolvedor | `salidas/proyeccion.txt` | - | VERIFICADO |
| AC-06 | La proyección se publica y no depende de acordarse | E14 | `selftest.sh`: «…y PHASE 9 la cita» · «…y el prompt de G4 tambien» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-07 | Una inversa que no revierte **aborta** | E8 · E9 | `selftest.sh`: «una inversa que no casa ABORTA» · «…y una que casa, aplica» | `salidas/inversa.txt` | - | VERIFICADO |
| AC-08 | Una aserción anclada sólo en un ID **se señala** | E10 · E11 | `selftest.sh`: «las aserciones sospechosas se enumeran» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-09 | Un caso que usa un helper posterior **se señala** | E12 | `selftest.sh`: «los helpers usados antes se enumeran» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-10 | La regla está en los **cinco** sitios | E13 · E14 · E15 · E16 | `selftest.sh`: los cinco casos de `SUITE-R56` | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-11 | Lo no comprobable queda declarado | E17 | `TD-16` en `10-Technical-Debt.md` | `salidas/td-16.txt` | - | VERIFICADO |
| AC-12 | La inversa está hecha y **cae de verdad** | inversa | ejecutada con el helper de `AC-07` | `salidas/inversa.txt` | - | VERIFICADO |

## `AC-03` estuvo mal dado por cumplido

Medi «todos arreglados» sobre los issues **vivos** de `EP-017`. Al medir el tablero **completo**
en `PHASE 9` seguían **20 de 40 rotos**, y el motivo es didáctico: `sincronizarCuerpos()` sólo
recorría las vivas — y una tarea viva **tiene** su rama, así que su enlace funciona. El que se
rompe es el de la tarea **cerrada**, que es exactamente para el que existe `SUITE-R56`.

`repararEnlacesMuertos()` cierra el hueco: reescribe el cuerpo sólo si el ref publicado ya no
existe y sólo si hay uno durable al que apuntar. **26 issues reparados.**

## El antes y el después

```
ENLACES DEL TABLERO      ANTES  20 de 40 rotos      DESPUES  0
PROYECCION · SHA         ANTES  columna vacia       DESPUES  el SHA del contenido
LOS CINCO SITIOS         ANTES  0 de 5              DESPUES  5 de 5
```

## `AC-10` no se puede partir

Los cinco sitios son **un** criterio. Una regla sin fase que la cite no se abre; una fase sin
verificador no se cumple; y un manual que no la menciona hace que quien llega nuevo nunca la
ejecute — que es exactamente por lo que la proyección llevaba sin publicarse desde `PT-054`.

## `AC-12` es la primera inversa del lote que no depende de mi memoria

El helper **abortó** ante un patrón inexistente —diciendo «revertir nada certifica lo
contrario»— y sólo entonces revirtió de verdad. Lo motiva que en `PT-074` se me olvidó el
`assert` y la inversa dio verde en los tres casos sin haber cambiado nada.
