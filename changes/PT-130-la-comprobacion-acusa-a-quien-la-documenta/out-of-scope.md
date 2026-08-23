# Fuera de alcance — `PT-130`

> `SUITE-R44` · La última columna es el destino, y es vocabulario cerrado.

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Reescribir los textos que hoy disparan el falso positivo | Sería **documentar la limitación en vez de quitarla**. El texto que fallaba sigue escrito igual, y ahora pasa | — |
| Arreglar las **once** lecturas de alcance amplio enumeradas | Hacerlo sin un caso que sostenga cada una sería cambiar once comportamientos a ciegas. Se **enumeran** con archivo y línea, que es lo que `RULE-06` pide | `FPGE` · candidatos, vía `MATRIZ.md` |
| Cambiar qué establece `SUITE-R34` | El hecho que vigila es correcto; lo que fallaba era **cómo lo leía** | — |
| Subir la cobertura del registro de sujetos por encima del 3 % | `SUITE-R34` entra ahora; adoptarlo regla a regla es la vía que `PT-087` declaró, y crece por adopción | — |
| Que la línea `tarea:` admita **dos** tareas en curso | El checkpoint es uno (`LEX-R26`). Si eso cambiara, cambiaría el anclaje | — |
| Responder si el trabajo **de lote** puede citar el `EP` en un commit | Es la pregunta que dejó `PT-127`, y es sobre `FDGE-R19`, no sobre esta comprobación. Merece su propia propuesta y su `G2` | `FPGE` · queda declarada |

---

## La pregunta de `PT-127`, y por qué no se responde aquí

`PT-127` midió que **15 commits de `EP-020` citan el lote** donde `FDGE-R19` pide un `PT`, y buena
parte son trabajo *de lote* que no pertenece a ninguna tarea. Su `out-of-scope` la mandó aquí.

**No se responde**, y se dice por qué: es una decisión sobre **qué exige `FDGE-R19`**, no sobre
cómo lee `SUITE-R34`. Cambiar una regla de commits desde una tarea cuyo alcance es el alcance de
las lecturas sería exactamente el tipo de ampliación silenciosa que este lote persigue.

Queda **declarada**, con su medición hecha y su detector construido: quien la abra parte de datos,
no de una impresión.

---

## Lo que esta tarea **produce** y no resuelve

Once lecturas de alcance amplio, con archivo y línea. Ninguna promesa sobre ellas: sólo la cifra
y dónde están. `CE-017` pasa de tener once instancias narradas a tener **una cerrada y su alcance
declarado**.
