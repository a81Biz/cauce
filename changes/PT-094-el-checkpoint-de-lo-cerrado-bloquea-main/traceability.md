# PT-094 — Trazabilidad   `FDGE-R15`

| AC | Criterio | Caso | Evidencia | Estado |
|:---|:---|:---|:---|:---|
| AC-01 | `verify-fdge --all` pasa en `main` y en otra rama | corrida en la rama de tarea y en `trabajo` | `salidas/verde.txt` | VERIFICADO |
| AC-02 | Un checkpoint terminal no se contrasta, y se dice | `un PT INTEGRATED no se contrasta` · `…y dice por que, citando SUITE-R36` | `salidas/verde.txt` | VERIFICADO |
| AC-03 | …y uno vivo **sí** se contrasta | `un PT IN_PROGRESS SI se contrasta` · `…y un DRAFT tambien` · `DONE espera G4: sigue vivo` | `salidas/verde.txt` | VERIFICADO |
| AC-04 | `avanzar` deja de escribir una rama que no existe | `avanzar pasa ramaDeclaradaViva` | `salidas/verde.txt` | VERIFICADO |
| AC-05 | Un caso reproduce el fallo y **falla sin el arreglo** | los tres del PT terminal, en inversa | `salidas/inversa.txt` | VERIFICADO |
| AC-06 | El límite de `detached HEAD` llega al mensaje | `SUJETOS['LEX-R26']` + `limitesQueNoLleganAlMensaje` en `verify-suite` | `salidas/verde.txt` | VERIFICADO |
| AC-09 | Otra rama, **misma historia**, no es discrepancia | `otra rama, misma historia: corresponde` · `la rama sola ya no dispara` · `…ni con un sha ANTECESOR` · `solo la rama: verify-fdge NO falla` | `salidas/verde.txt` | VERIFICADO |
| AC-10 | Otra **historia** sí lo es, y la rama corrobora | `…pero con OTRA historia si` · `…y entonces enumera LAS DOS` · `no saberlo arrastra la rama tambien` · `otra historia + otra rama: FALLA` | `salidas/verde.txt` | VERIFICADO |

## `AC-09` y `AC-10` van en pareja, y por eso son dos criterios y no uno

Uno solo se cumpliría **apagando** la comprobación de rama. `AC-10` es el que lo impide: lo que
sigue cazando —otra historia— tiene tantos casos como lo que deja de cazar.

Y cuatro casos que ya existían cambiaron de escenario: usaban «mismo sha, otra rama», que ahora
**es** correspondencia. Pasan a usar «otra historia», que es el caso peligroso que siempre
tuvieron que ejercitar. La comprobación es más estrecha y los casos, más exigentes.

## `AC-01` se comprobó en **dos** ramas sobre el mismo árbol, y ése es el punto

El atajo descartado —`tracker checkpoint PT-092`— pasa en la rama donde se ejecuta y falla en la
otra. Comprobar una sola rama no habría distinguido el arreglo del atajo.

## `AC-03` es la mitad que impide la salida fácil

Devolver `null` para **todo** checkpoint deja el repositorio verde y quita la guarda que `PT-056`
construyó: un `sha` real describiendo un árbol que ya no existe **mientras la tarea sigue
abierta**. Tres casos lo sostienen, y el de `DONE` es el que decide si está bien trazado: un `PT`
en `DONE` espera `G4` con su rama viva.

## La derogación de `PT-056`, escrita donde se lee

Su caso `E3` decía `rama distinta ⇒ NO corresponde`. **Se conserva con el veredicto invertido** en
vez de borrarse:

```
otra rama, misma historia: corresponde     ^true$
…y la rama no figura como discrepancia     (inverso: «rama» NO aparece)
```

Borrarlo habría hecho desaparecer que alguien decidió lo contrario y por qué. `PT-056` no eligió
mal: quería cazar «estás en otra rama», y midiendo salió que lo que cazaba de verdad era el caso
legítimo — **cambiar de rama dentro de la misma historia pasa en cada merge**.

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
