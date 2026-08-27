# `PT-151` · autorrevisión — `PHASE 6` Evidence

## 1. Lo medido

| Qué | |
|:---|:---|
| Divergencias entre `verify` y CI | **3** — y **una en sentido contrario** |
| Pasos de `verify` | 8 → **9** |
| Batería completa | 23,6 min → **26,0 min** |
| `selftest` | 1765 → **1770** |
| Corridas invalidadas por error propio | **2** |

## 2. Eran tres, y la tercera nadie la buscaba

```
verify-fdge --all   en CI y no en verify        ← la conocida: dejó pasar 8 errores al PR
revisar-secretos    con --historial solo en CI  ← un secreto borrado pasa en local
matriz:check        en verify y NO en CI        ← su rojo NO LO VE NADIE en el PR
```

El intake suponía **una** dirección. Medir encontró las tres, y por eso la comprobación contrasta
**en los dos sentidos**: lo que falta en local **bloquea**, lo que sobra **avisa**.

## 3. La comparación es posible porque se igualó la forma

`revisar-secretos` corría con `--historial` en CI y sin él en local. Comparar **comandos** exigiría
entender banderas; comparar **nombres de script** es trivial — a cambio de que los dos lados
invoquen `npm run <script>`.

**El límite se declara**: si el workflow volviera a invocar la herramienta directamente, la
diferencia sería otra vez invisible.

## 4. La batería cazó una sobredeclaración mía

La primera versión emitía `SUITE-R01`, y `NO_VERIFICABLE` bajó de **6 a 5**. Esa regla está
declarada no verificable **con motivo y firma**, y mi comprobación cubre **un aspecto**, no la
regla. Dar por cubierta la regla entera es `CE-001` —el proxy en lugar del hecho— y en una
herramienta que **publica cobertura** mueve una cifra que alguien usa para decidir.

La obligación comprobable tiene ID propio: **`SUITE-R62`**. Es la **segunda vez en este lote** que
una cifra de cobertura miente por sobredeclarar, y las dos veces la cazó una comprobación escrita
antes, no yo mirando.

## 5. Dos casos del patrón `superado`

Su ancla era `verify-fdge.mjs --all` y cambió **por diseño** a `npm run verify:fdge`. Ajustados con
su motivo escrito — que es lo que `SUITE-R61`, escrita en este mismo lote, exige.

## 6. Rompí dos líneas del `no hacer`, y las dos las escribí yo

**#3 · edité `selftest.sh` mientras corría.** `verify-fdge` pidió un escenario para `AC-04` y añadí
`TS-05` al arnés con la batería viva.

**#0 · lancé una segunda batería con la primera viva.** Las dos escriben el mismo archivo.

**El resultado fue un verde que no valía**: `OK · 1770` en una corrida que arrancó con **1769**
casos, es decir que leyó el arnés a mitad de edición. Descartado y repetido limpio.

**Por qué caí ahí, sin excusa:** mi propia regla —*«mientras la batería corre, avanza
documentos»*— tiene un filo. `verify-fdge` puede pedir un cambio en el **arnés** en mitad de esa
escritura, y la frontera «documento vs herramienta» se cruza sin notarlo. Escribir `TS-05` no se
sintió como tocar una herramienta: se sintió como terminar la trazabilidad.

**Y lo de fondo**: mientras la corrida completa cueste veintiséis minutos, «aprovecho para
adelantar» es irresistible y **la disciplina depende de la memoria**. La memoria falló dos veces en
la misma tarea.

## 7. Lo que NO establece

- Que el paso **haga** lo mismo en los dos sitios. Se comparan nombres.
- Que la batería sea sostenible. **Es medio minuto más cara** de lo que ya costaba, y eso empuja en
  la dirección equivocada. `PT-169` abarató `--solo`; la corrida completa sigue igual.
