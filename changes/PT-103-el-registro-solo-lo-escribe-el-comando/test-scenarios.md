# Escenarios de prueba — `PT-103`

## En la batería

| Caso | Qué establece |
|:---|:---|
| `asignar` acepta el tipo | el campo llega al registro |
| …la severidad | idem |
| …el lote al que pertenece | idem, validado con `esLote` |
| …y arranca en `PHASE 1` | el campo cuya ausencia bloqueaba `avanzar` |
| …y **NO** acepta un tipo inventado | el negativo |
| `verify-fdge` mira si el registro se escribió a mano | la comprobación del **procedimiento** |
| …y la regla existe | `SUITE-R58` en `RULES` |

## La inversa — siete retiradas, siete con efecto

```
S-1  los flags de asignar             caen 2
S-2  el guardia del tipo inventado    caen 2
S-3  phase 1 al nacer                 caen 1
S-4  decir que campos faltan          caen 1
S-5  los flags en CON_VALOR           caen 1   <- salio en cero DOS veces
S-6  la comprobacion de SUITE-R58     caen 1
S-7  el RIGE_DESDE de la regla        caen 1
```

**La allocation se crea de verdad** en un proyecto de mentira y se lee de vuelta del `JSON`.
Medir sobre el texto de la herramienta diría «acepta el flag», no «lo escribe».

## Lo que NO se prueba

- **Que escribir a mano el registro deje de ocurrir.** La regla avisa, no impide.
- **Que los demás comandos no tengan el mismo hueco.**
- **Que el procedimiento entero sea comprobable.** No lo es.
