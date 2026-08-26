# `PT-169` · autorrevisión — `PHASE 6` Evidence

## 1. Lo medido

| Qué | |
|:---|:---|
| Batería completa | **1 415 445 ms · 23,6 min** — **sin cambio** |
| `--solo`, cualquier patrón | **252 373 → 47 466 ms** |
| Casos | 1749 → **1752** (los tres nuevos, y ninguno más) |
| Sitios que mutan un fixture | **61** · con `muta`: **3** |
| Coste de los 208 casos `trlib` | **~14 s entre todos** |
| `CORE` | 263 → **264** reglas |

## 2. Medir primero cambió la tarea

El encargo era *«quitar lo que ya no se usa o se duplica»*. **La poda no era el cuello de
botella.** Los 208 casos `trlib` —los que más «sobraban» a ojo— cuestan **catorce segundos entre
todos**, y una corrida filtrada costaba **252 segundos sin asertar nada**.

Empezar podando —lo natural— habría retirado casos legítimos persiguiendo segundos que estaban en
otro sitio.

## 3. La corrección grande ya estaba escrita, sin cablear

`PT-086` dejó el mecanismo y su diagnóstico en un comentario: *«una sección inactiva se salta
ENTERA: sus casos y su andamiaje. `--solo` filtraba solo aserciones»*. **Y lo cableó sólo a
`--afectados`.**

El concepto que hacía falta —«las secciones están filtradas»— estaba **pegado a su origen**:
`AFECTADOS` significaba a la vez *qué se filtra* y *por qué*. Separarlo en `ACOTADO` fue todo.

Es la forma que este marco lleva dos lotes persiguiendo: **un hecho con dos nombres, o dos hechos
con uno**.

## 4. La regla nace `CHECK`, y hubo que ganárselo dos veces

**Primera**: `regla.mjs` dijo *«ningún verificador la emite con su nombre»*. `verificadoresDe`
**excluye `selftest.sh` a propósito** — una regla que sólo comprueba el arnés no la comprueba nada
en un proyecto destino. La comprobación tuvo que ir a `audit`, que **viaja dentro del paquete**.

**Segunda**: llamé `avisa()` a la primitiva nueva, y la derivación busca **`fail(` y `warn(`**. La
regla seguía saliendo como no comprobada — cierto para la derivación y falso para el lector. Un
nombre propio para un concepto que ya tenía nombre es `CE-008` por el lado del vocabulario.

Y `audit` ganó un **tercer estado**. Sabía decir `hueco` o `cubierto`; una **adopción en curso** no
es ninguna de las dos, y sin ese estado la única salida era mentir en alguna dirección: bloquear
por algo que crece a propósito, o callarlo.

## 5. Tres errores míos

**5.1 · Cité la clase de evento equivocada.** Escribí que la regla era dueña de `CE-016` — que es
*«trabajar sin allocation»*. La clase correcta es **`CE-011`**, *«un arreglo deja tests del estado
anterior»*, que es literalmente esto. Lo cazó mirar el catálogo antes de dar por buena la cita, no
un verificador: `LEX-R32` comprueba que la clase **exista**, y `CE-016` existe.

**5.2 · Leí mal mi propia medición.** Registré *«`--solo PT-098` tarda 237 s»* como si midiera 409
casos. **No medía ninguno**: el patrón casa **nombres de caso**, y los de ese bloque no contienen
«PT-098». Daba cero **antes también**. La conclusión —el coste era fijo— no cambia; la cifra decía
otra cosa.

**5.3 · Intenté bajar el suelo y rompí el universo.** Reutilizar el esqueleto en vez de
reconstruirlo bajaba de 47,4 a **41,6 s**… y dejaba el universo en **1730** casos: diecinueve
dejaban de ejecutarse. Mi razonamiento —*«es seguro porque está inerte»*— era falso. **Revertido**:
seis segundos no valen cambiar lo que la batería mide, y `AC-07` dice exactamente eso.

## 6. `FDGE-R15` me corrigió una forma de fingir rigor

Escribí `AC-03` como **«no cumplido — declarado»**, creyendo que declarar la ausencia bastaba.
`verify-fdge` lo rechazó como **Orphan Criterion**.

Tenía razón: **un criterio sin escenario es un criterio que nadie comprueba**, y anotarlo como
incumplido lo deja igual de huérfano *mientras aparenta rigor*. O es criterio y tiene prueba, o no
es criterio de esta tarea. Salió a `out-of-scope` con destino `PT-167`, por Revisión — no
borrándolo, que es lo que `SUITE-R09` impide.

`AC-04` casi cae en lo mismo: estaba como *«cumplido por la regla»* sin `TS`.

## 7. Lo que esta tarea NO establece

- **Que la batería completa sea más rápida.** No lo es: 23,6 min antes y después. Lo que se
  abarató es iterar.
- **Que la adopción de `muta` avance.** `audit` publica **3 de 61** con denominador; que suba lo
  decide quien escriba el próximo fixture, y la regla le obliga a mirarlo, no a moverlo.
- **Que la cuenta por patrón de un lote sea completa.** No es mecanizable (`SUITE-R26`): la regla
  impide el silencio, no el error de quien cuenta.
- **Que no haya casos duplicados.** Salió del alcance → `PT-167`.
- **El suelo de 47 s.** Son 211 reconstrucciones de un árbol inerte, y quitarlas exige saber cuál
  depende de la frescura.
