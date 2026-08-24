# `PT-129` — Autorrevisión   `PHASE 6`

## Delta real contra lo planificado

| | Planificado | Real |
|:---|:---|:---|
| Movimientos | 4 (`E-1`..`E-4`) | **5** — entró `E-5`, que salió implementando |
| Criterios | 8 | **9** |
| Casos | «los casos» | **8** |
| Batería | 1377 | **1385** |

## `E-5` salió implementando, y es la misma clase

`FDGE-R19` exige que un PT vivo en `PHASE 5+` declare su rama en `REGISTRY.allocations[].branch`
—**aviso durante el trabajo, error en `G4`**— y **ningún comando la escribía**. Medido: 47 de 151
la llevan, todas a mano.

Una regla que sólo se puede cumplir escribiendo el registro a mano **es la avería que `PT-103` y
`PT-107` cierran**. Lo descubrió la propia comprobación acusándome: *«PT-129 está en PHASE 5 y no
declara rama»*.

Y `--declarar` escribe **la rama real**, no la propuesta. Son distintas cuando un lote se trabaja
sobre una sola rama, como hizo `EP-019`: **el registro dice dónde está el trabajo, no dónde
debería estar.**

## El falso positivo que sólo apareció ejecutando

`refs/remotes/origin/HEAD` se abrevia a **`origin`** a secas, y salió como rama sobrante en la
primera corrida. Es el puntero a la rama por defecto, no una rama. Leyendo el código no se ve;
ejecutándolo, sí.

## Dos errores de programación, los dos cazados al primer intento

- `git` es un ayudante **local del bloque de `G2`**: mi bloque lo usaba y reventó con
  `ReferenceError`. Se le dio el suyo, con la misma forma que el resto del archivo.
- `REPO` no existe en `verify-fdge`. La rama por defecto **se deriva de `origin/HEAD`**, como ya
  hacía la línea 1482. Copiar lo que ya funciona en vez de inventar otra forma.

## Lo que esta tarea **no** establece

- **Que la topología declarada sea la correcta.** Comprueba que el árbol coincide con lo
  declarado; si lo declarado está mal, esto sale verde.
- **Que la proyección `cauce/<usuario>` esté fresca.** `AC-06` la excluye de las sobrantes; medir
  su frescura queda **declarado y sin hacer**.
- **Que nadie haga caso al aviso.** No es comprobable y no se afirma.
- **El comportamiento contra Azure.** Se mide sobre GitHub, la plataforma declarada.

## Lo que encontró, contra el árbol de verdad

```
! FDGE-R19  topologia de ramas: 2
    «desarrollo»                        no encaja en ninguno de los cuatro tipos
    «fix/…/PT-081-una-regla-nueva-…»    sigue viva y PT-081 esta INTEGRATED
    Borrarlas es SUITE-R06f:  git push origin --delete <rama>
```

Las dos se sabían **por conversación**. Ahora las dice una comprobación, y en `G4` bloquean.
