# Trazabilidad — `PT-117`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | Toda allocation alcanzada declara `origen_parada`, y `tracker parada` lo escribe | `TS-01` `TS-03` `TS-06` `TS-07` | `selftest.sh:una allocation alcanzada sin origen_parada falla` | `salidas/casos.txt` |
| AC-02 | El caso que señaló el firmante está cubierto: el hallazgo a mitad de trabajo no se arregla en línea | `TS-03` `TS-04` `TS-08` | `selftest.sh:«abre» deja el enlace en la allocation que nace` | `salidas/casos.txt` `salidas/negativas.txt` |
| AC-03 | El hook `Stop` existe **y su límite está escrito** | `TS-11` | el hook y el documento que declara que no viaja en el paquete | `salidas/hook.txt` |
| AC-04 | Lo que NO se puede exigir se declara con su número, no se promete | `TS-12` | `selftest.sh:la cifra del hueco es DERIVADA` | `salidas/hueco.txt` |
| AC-05 | `verify-suite` compara las dos listas con `LEXICON` §8.5 — deuda heredada de `PT-116` | `TS-10` `TS-11` | `selftest.sh:las clases de la parada y LEXICON no divergen` | `salidas/casos.txt` |

**Cinco criterios, cinco con `TS`.** Las columnas `Test` y `Evidencia` se cierran en `PHASE 6`
(`FDGE-R15`): antes están legítimamente vacías.

## Las dos evidencias que deciden

`salidas/casos.txt` — el par `TS-06` / `TS-07`. El primero exige que una allocation alcanzada sin
`origen_parada` **falle**; el segundo, que una anterior **ni se mire**. Sin el segundo, el primero
pasaría igual si la comprobación retrofechara todo el trabajo ya integrado — y eso rompería a
todo proyecto destino que actualizara.

`salidas/hueco.txt` — la cifra de lo que `FDGE-R55` **no** puede exigir, derivada de las listas.
Es lo que impide que esta tarea se lea como «la regla ya es exigible», que sería falso.

## Un `AC` que no existe, y consta

**No hay `AC` para «la parada de desenlace `continua` se cumplió».** No deja rastro: nada puede
probar la ausencia de algo que no se escribe. Escribirlo como criterio lo haría huérfano
(`FDGE-R15`) o, peor, verde sin comprobar nada. Va a `out-of-scope.md` con su motivo.
