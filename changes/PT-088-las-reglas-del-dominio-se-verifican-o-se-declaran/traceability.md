# PT-088 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | `SUITE-R09`: falla si un append-only pierde líneas | E1 | `selftest.sh`: «…y uno al que le faltan lineas CAE» | `salidas/ledger.txt` | VERIFICADO |
| AC-02 | …y **no** falla cuando sólo se añaden líneas | E2 | `selftest.sh`: «un ledger que solo CRECE pasa» | `salidas/ledger.txt` | VERIFICADO |
| AC-03 | …y **no** falla sin repositorio ni versión anterior | E3 | `selftest.sh`: «sin ningun tag no se comprueba, y se dice» | `salidas/ledger.txt` | VERIFICADO |
| AC-04 | `EXEC-R04`: falla si la principal avanzó sin constancia | E4 | `selftest.sh`: «un merge a la principal SIN constancia CAE» | `salidas/g4-constancia.txt` | VERIFICADO |
| AC-05 | …y el nombre está en `firmantes`, no es cualquiera | E5 | `selftest.sh`: «un nombre fuera de firmantes NO cuenta» | `salidas/g4-constancia.txt` | VERIFICADO |
| AC-06 | `SUITE-R01`: verificada **o** declarada con motivo y firma | E6 | `selftest.sh`: «SUITE-R01 esta declarada NO_VERIFICABLE» | `salidas/suite-r01.txt` | VERIFICADO |
| AC-07 | Las tres declaran su fila en `RIGE_DESDE` | E7 | `selftest.sh`: «una suite anterior a 11.0.0 no la sufre» | `salidas/rige-desde.txt` | VERIFICADO |
| AC-08 | `audit` las clasifica; ninguna queda `PENDIENTE` | E8 | `selftest.sh`: «las tres salen de PENDIENTE» | `salidas/suite-r01.txt` | VERIFICADO |
| AC-09 | Cada comprobación **declara qué no establece** | E3 · E4 · E8 | `selftest.sh`: «…el mensaje declara que NO distingue» · «…una alteracion de igual recuento TAMBIEN» · «…el mensaje dice que NO prueba nada mas» | `salidas/sujeto.txt` | VERIFICADO |

## Lo que la batería corrigió de esta misma tabla

`AC-09` decía que `SUITE-R09` *no detecta* una alteración de igual recuento. **Falso**: `git` la
representa como `-vieja` más `+nueva`, así que la caza. El caso que lo ejercitaba salió **rojo**
esperando verde, y lo que se corrigió fue **mi descripción**, no el código.

`AC-05` era **vacuo**: yo sintetizaba el nombre del firmante desde la lista declarada, así que el
filtro por nombre no podía fallar nunca. Ahora el nombre se **extrae** del cuerpo de la constancia,
y el caso negativo escribe «Impostor Anonimo» — que no está en `firmantes` y por eso cae.

## `AC-09` no estaba en el intake, y es el que más importa

Lo trajo `PHASE 2`. Las tres reglas resultaron ser **más estrechas de lo que la regla promete**:

```
SUITE-R09   caza borrados Y modificaciones — no distingue correccion de falsificacion
EXEC-R04    comprueba que hay constancia — no que la autorizacion fuera real
SUITE-R01   no se verifica: se instancia en otras cuatro
```

Sin `AC-09`, un verde de `SUITE-R09` se leería como «el ledger es íntegro», que es **más de lo que
mide** — la séptima instancia del patrón que `PT-087` cierra, escrita por el lote que lo cierra.

Por eso hay **dos casos que asertan sobre el mensaje**, y un tercero que ejercita el límite a
propósito: «…y una alteracion de igual recuento NO» debe pasar en verde. Un límite que nadie
ejercita se olvida y acaba presentándose como garantía.

## Excepción `FDGE-R18` declarada

`AC-06` no tiene archivo de test de comportamiento: **no hay comportamiento que probar**. Su
prueba es que la fila exista en `NO-VERIFICABLES.md` con motivo y firma, y que `audit` la
clasifique. Está declarado en [`strategy.md`](strategy.md).
