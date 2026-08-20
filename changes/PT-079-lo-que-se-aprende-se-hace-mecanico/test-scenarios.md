# PT-079 — Escenarios de prueba   `PHASE 4`

## Familia A · el enlace durable

| AC | # | Escenario | Se espera |
|:---|:--|:---|:---|
| AC-01 | E1 | El directorio existe en la rama de integración | el enlace apunta a `/tree/<integracion>/` |
| AC-02 | E2 | No está en integración pero hay commit | el enlace apunta a `/tree/<sha>/` |
| AC-01 | E3 | No hay ni una cosa ni otra | **sin enlace**, y se dice (`RULE-06`) |
| AC-02 | E4 | El espejo corre desde otra rama | el enlace **no** la nombra: sale del contenido, no de dónde se ejecuta |
| AC-04 | E5 | Un issue vivo enlaza a una rama inexistente | **falla** `SUITE-R56` con su número |
| AC-04 | E6 | Un issue **cerrado** con esa misma rama | no falla: ya pasó `G4` y su enlace apunta a la rama por defecto |
| AC-05 | E7 | `proyectar` sobre una tarea sin rama declarada | la columna `SHA` lleva el del **contenido**, no un guion |

## Familia B · las guardas del arnés

| AC | # | Escenario | Se espera |
|:---|:--|:---|:---|
| AC-07 | E8 | `inversa` con un patrón que **no casa** | **aborta**, y dice cuál no casó |
| AC-07 | E9 | `inversa` con un patrón que casa | revierte y sigue |
| AC-08 | E10 | Aserción anclada sólo en `PT-nnn` o `EP-nnn` | **se enumera** con su línea |
| AC-08 | E11 | Aserción con marca de veredicto | **no** se enumera |
| AC-09 | E12 | Caso que invoca un helper definido más abajo | **se enumera** con su línea |

## Familia C · los cinco sitios

| AC | # | Escenario | Se espera |
|:---|:--|:---|:---|
| AC-10 | E13 | `SUITE-R56` en `RULES.md` | existe, con su severidad |
| AC-10 | E14 | `PHASE 9` y el prompt de `G4` la citan | `verify-suite` en verde |
| AC-10 | E15 | `CASOS-DE-USO` tiene el caso de rastrear una tarea cerrada | presente |
| AC-10 | E16 | `MANUAL` nombra el paso | presente |

## Comprobación inversa

```
revertido el enlace durable    ->  E1 E2 E4 caen · E5 deja de detectar nada
revertida la guarda «inversa»  ->  E8 deja de abortar     <- el fallo que la motivo
revertida la cita de PHASE 9   ->  E14 cae
```

Y **siguen pasando** `E3`, `E6` y `E11`: son las tres que impiden el falso positivo —no inventar
enlace, no acusar a un issue cerrado, no señalar una aserción correcta—. Si cayeran, el arreglo
estaría rompiendo trabajo válido, que es el fallo que `PT-075` `AC-06` prohíbe y que ya cometí
dos veces en este lote.

## Y esta inversa es la primera que no depende de mi memoria

Se ejecuta con el helper `inversa` de la tarea 8, que **aborta si el patrón no casa**. Lo motiva
que en `PT-074` se me olvidó el `assert` y la inversa **dio verde en los tres casos** sin haber
revertido nada — certificando exactamente lo contrario de lo que pretendía comprobar.
