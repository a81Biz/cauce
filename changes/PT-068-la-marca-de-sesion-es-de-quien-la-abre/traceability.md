# PT-068 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | CasoQA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Un usuario no declarado NO deriva la sesión de otra persona | E1 · E4 | `selftest.sh`: «marca ajena no se hereda» · «…tampoco preguntando por nombre» · «la propia gana al respaldo» | `salidas/caso-real.txt` · `salidas/inversa.txt` · `salidas/antes-identidad-ajena.txt` | - | VERIFICADO |
| AC-02 | La misma persona no aparece como dos sesiones abiertas | E5 | `selftest.sh`: «una persona, una sola sesion» · «…y gana el archivo propio» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-03 | Los mensajes dicen el archivo que de verdad se escribe | E7 | `selftest.sh`: «sesion abrir no dice SESSION.json» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-04 | `sesion cerrar` deja de afirmar algo falso | E8 | `selftest.sh`: «…ni cerrar afirma que se sobrescribe» | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-05 | Con una sola persona declarada nada cambia | E2 · E3 | `selftest.sh`: «sin persona, la marca es mia» · «con mi nombre, es mia» · «cae a SESSION.json si no hay propio» · «…y se dice que es por compatibilidad» | `salidas/selftest-completo.txt` · `salidas/inversa.txt` | - | VERIFICADO |
| AC-06 | El caso cubre la **elección de archivo**, no sólo las funciones puras | E1..E5 | las cinco ramas de `marcaDe()` | `salidas/selftest-completo.txt` | - | VERIFICADO |
| AC-07 | `viabilidad` lee la MISMA marca que `sesion` | E6 | `selftest.sh`: «viabilidad no lee SESSION.json a pelo» · «las dos lecturas usan marcaDe» | `salidas/caso-real.txt` | - | VERIFICADO |

## El antes y el después, contra el repositorio real

```
ANTES    sesion desde 258be16 · 32 commits · 13 194 lineas (MEDIDO)   <- trabajo AJENO
DESPUES  no hay sesion abierta: «tracker sesion abrir» marca el inicio

AC-07    ANTES  sesion 7735ff4  ·  viabilidad 258be16      el mismo tracker, dos respuestas
         DESPUES  las dos 7735ff4
```

## `AC-05` es el que protege, y se comprueba en las dos direcciones

`E2`, `E3` y `E4` **siguen pasando con el arreglo revertido**. Eso no es un caso débil: es la
prueba de que el arreglo no toca el proyecto de una sola persona, que es lo que `AC-05` de
`PT-065` protege y el riesgo real de esta tarea.

Lo que **cae** en la inversa es `E1`: la identidad ajena vuelve a heredar 34 commits.

## `AC-06` es el que faltaba en `PT-065`

Sus seis criterios se comprobaban con marcas construidas **a mano** sobre `sesionDe`, que es
pura. Ninguno ejercitaba **de qué archivo sale** — y su propio `out-of-scope` decía que eso era
lo único que aquella tarea cambiaba.
