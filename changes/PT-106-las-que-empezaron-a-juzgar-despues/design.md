# Diseño — `PT-106`

## De dónde sale cada cifra

```
1. las HARD que emiten          grep de fail|warn|gap|bad en tools/ y bin/
2. menos las que ya la declaran
3. git log -S "'<regla>'" --reverse -- docs/methodology/tools/
4. si el commit es el PRIMERO   -> no lleva fila
5. si es posterior              -> git show <sha>:package.json  -> la version
```

**Cada fila lleva su `sha` en el comentario.** No es decoración: es lo que permite recalcularla y
lo que distingue un dato derivado de uno escrito a ojo.

## Las veinte

| Regla | Versión | | Regla | Versión |
|:---|:---|---|:---|:---|
| `FDGE-R19` | 7.7.0 | | `SUITE-R35` | 5.0.0 |
| `FDGE-R39` | 7.7.0 | | `SUITE-R38` | 7.7.0 |
| `FDGE-R48` | 4.14.0 | | `SUITE-R40` | 5.2.1 |
| `FDGE-R49` | 4.14.0 | | `SUITE-R42` | 5.3.0 |
| `FDGE-R51` | 4.14.0 | | `SUITE-R43` | 6.0.0 |
| `FND-R29` | 7.7.0 | | `SUITE-R44` | 6.0.1 |
| `FND-R30` | 5.2.3 | | `SUITE-R45` | 7.0.0 |
| `SUITE-R31` | 8.0.0 | | `SUITE-R46` | 7.0.0 |
| `SUITE-R33` | 5.0.0 | | `SUITE-R47` | 7.7.0 |
| `SUITE-R34` | 5.0.0 | | `SUITE-R51` | 7.3.0 |

## Lo que NO se escribe, y por qué

```
87  no emiten                    una regla que no puede fallar no juzga nada
38  desde el primer commit       no hay nada anterior que puedan juzgar mal
 7  ya la tienen, decidida a mano  y DOS de ellas discrepan del CHANGELOG: son la prueba
```

## El comentario del bloque

Lleva la medición completa y el motivo del descarte del `CHANGELOG`. No es prosa: es lo que
impide que alguien «complete» las 125 que faltan creyendo que se olvidaron.
