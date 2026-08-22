# Diseño — `PT-105`

## El peldaño

```
estadoDeFase(a, destino, ctx)

  BUG  &&  destino === faseValidacion       ->  VALIDATION_PENDING     PT-099
  !BUG &&  destino === faseValidacion + 1   ->  DONE                   PT-105
  ctx.esFinal                               ->  DONE | INTEGRATED      PT-098
  si no                                     ->  null  («no se toca»)
```

Tres guardas, cada una con su caso:

| Guarda | Por qué | Lo prueba |
|:---|:---|:---|
| `tipo !== 'BUG'` | un `BUG` se detiene y lo cierra una persona | `S-2` |
| `destino === faseValidacion + 1` | el hecho es cerrar Validación, no otra fase | `S-4` |
| `!ESTADOS_TERMINALES.has(st)` | `REJECTED`, `DEFERRED` e `INTEGRATED` no se pisan | `S-3` |

## La fase, por nombre

`faseValidacion` se deriva buscando el **nombre** en `FASES`, no un número literal. Es la misma
atadura que `PT-099` dejó, y hay un caso que la comprueba: renumerar las fases apagaría un
literal **en silencio**.

## Lo que se dice al escribirlo

```
PT-NNN: cerro Validacion, asi que pasa a DONE — el estado que FDGE-R34 exige para G4,
        que es la fase siguiente. La firma de G3 va en la linea «Compuertas:» de
        HISTORY.log; esto solo escribe el estado que esa firma implica.
```

La distinción importa: **el comando no firma nada**. Escribe el estado que una firma humana ya
registrada implica.

## Lo que NO se hizo

**No se toca `FDGE-R34`.** La regla está bien: `SUITE-R46` exige apuntar el estado terminal
**antes** del merge. Lo que faltaba era el comando.

**No se retrofecha nada.** Los quince `FEATURE` históricos llegaron a `INTEGRATED` y eso es un
hecho del árbol (`SUITE-R09`).
