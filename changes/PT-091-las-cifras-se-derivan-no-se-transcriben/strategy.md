# PT-091 — Estrategia   `PHASE 3`

## Caminos considerados

| | Por qué se descarta |
|:---|:---|
| Quitar las cifras del inventario | `PTSA-R76` construye el universo auditable desde él. Un inventario sin cifras deja de ser una fuente mecánica |
| Regenerar Foundation entera | Se ha ejecutado dos veces y **no es lo que falla**: falla que sus cifras no se recalculen entre ejecuciones |
| Un `pre-commit` que las reescriba | Automatiza escritura sobre un documento firmado, y `SUITE-R06` no lo contempla. Además esconde el cambio en un commit ajeno |
| Que la comprobación **falle** | Una cifra desviada **no apaga ninguna comprobación**. Bloquear por ella pondría el árbol en rojo cada vez que alguien añade diez líneas |
| **Un generador + un aviso que dice cómo arreglarlo** ✅ | Es lo que se adopta |

## Por qué avisa y no bloquea, cuando `PT-089` decidió lo contrario

Las dos tareas miran una divergencia entre lo escrito y lo real, y **la severidad es opuesta**.
La diferencia no es de gusto:

```
PT-089   registro terminal + YAML vivo   ->  «fase >= N» no se cumple
                                         ->  las comprobaciones posteriores NO SE EJECUTAN
                                         ->  ERROR

PT-091   cifra desviada en el inventario ->  ninguna comprobacion cambia de resultado
                                         ->  AVISO, y con el comando que lo arregla
```

**La consecuencia decide la severidad, no la gravedad aparente.** Es lo que `PT-023` midió: un
verificador que bloquea donde no hace falta se apaga, y entonces no protege el día que tiene razón.

## El ancla, que es lo que hace útil al resto

`FND-R14` ancla el grafo con `pt_at_generation`. El inventario no tenía equivalente, así que **«al
día» y «nadie lo ha vuelto a mirar» eran indistinguibles**.

`tracker inventario` publica el `HEAD` corto con el que cuadró. Sin eso, un inventario correcto por
casualidad y uno verificado se leen igual.

## Lo que se acepta, y se declara

**Sólo las cifras.** Que `services.md` diga bien cuántas líneas tiene `tracker.mjs` no dice nada
sobre si describe bien **lo que hace**.

Prometer que el inventario está «al día» cuando sólo se comprueban los números sería la novena
instancia del patrón — y va en el mensaje, no en un comentario (`PT-087`).
