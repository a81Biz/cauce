# PT-094 — Trazabilidad   `FDGE-R15`

| AC | Criterio | Caso | Evidencia | Estado |
|:---|:---|:---|:---|:---|
| AC-01 | `verify-fdge --all` pasa en `main` y en otra rama | corrida en la rama de tarea y en `trabajo` | `salidas/verde.txt` | VERIFICADO |
| AC-02 | Un checkpoint terminal no se contrasta, y se dice | `un PT INTEGRATED no se contrasta` · `…y dice por que, citando SUITE-R36` | `salidas/verde.txt` | VERIFICADO |
| AC-03 | …y uno vivo **sí** se contrasta | `un PT IN_PROGRESS SI se contrasta` · `…y un DRAFT tambien` · `DONE espera G4: sigue vivo` | `salidas/verde.txt` | VERIFICADO |
| AC-04 | `avanzar` deja de escribir una rama que no existe | `avanzar pasa ramaDeclaradaViva` | `salidas/verde.txt` | VERIFICADO |
| AC-05 | Un caso reproduce el fallo y **falla sin el arreglo** | los tres del PT terminal, en inversa | `salidas/inversa.txt` | VERIFICADO |
| AC-06 | El límite de `detached HEAD` llega al mensaje | `SUJETOS['LEX-R26']` + `limitesQueNoLleganAlMensaje` en `verify-suite` | `salidas/verde.txt` | VERIFICADO |

## `AC-01` se comprobó en **dos** ramas sobre el mismo árbol, y ése es el punto

El atajo descartado —`tracker checkpoint PT-092`— pasa en la rama donde se ejecuta y falla en la
otra. Comprobar una sola rama no habría distinguido el arreglo del atajo.

## `AC-03` es la mitad que impide la salida fácil

Devolver `null` para **todo** checkpoint deja el repositorio verde y quita la guarda que `PT-056`
construyó: un `sha` real describiendo un árbol que ya no existe **mientras la tarea sigue
abierta**. Tres casos lo sostienen, y el de `DONE` es el que decide si está bien trazado: un `PT`
en `DONE` espera `G4` con su rama viva.

## La prueba inversa

Deshecha la guarda de estado terminal, caen **tres casos y sólo esos**:

```
✗ un PT INTEGRATED no se contrasta          (no apareció: ^null$ · salió: false)
✗ …y dice por que, citando SUITE-R36        (no apareció: SUITE-R36 · salió: undefined)
✗ …sin inventar discrepancias               (apareció: chore/borrada)
✓ un PT IN_PROGRESS SI se contrasta
✓ sin «status» se contrasta igual
```

Y `verify-fdge --all` vuelve al rojo exacto que bloqueó `main` y `publicar.yml` dos veces.

**Los casos que siguen en verde son la mitad que importa**: el arreglo cae sobre lo cerrado y deja
intacto lo vivo.

## Lo que estos casos NO establecen

Que `publicar.yml` publique. Establecen que **la verificación que lo detenía deja de detenerlo**.
Publicar es irreversible y lo dispara una persona (`SUITE-R06`); hasta que alguien lo haga, no hay
evidencia de que el resto del flujo funcione.
