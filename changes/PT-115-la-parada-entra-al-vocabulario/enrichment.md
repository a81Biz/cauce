# `PT-115` — Enriquecimiento   `PHASE 2-E`

> Qué existe ya, qué falta, y con qué granularidad.

---

## E-1 · Lo que el marco ya tiene

| Regla | Qué cubre | Granularidad |
|:---|:---|:---|
| `EXEC-R01` | «un checkpoint **siempre** produce registro legible. Auto-avanzar en silencio está prohibido» | el checkpoint |
| `FDGE-R52` | tres líneas en el issue **por transición de fase**: qué se cierra · dónde se está · qué sigue | la **fase** — nueve por tarea |
| `SUITE-R43` | un comentario humano sin responder **bloquea** el avance | la respuesta |
| `SUITE-R04` | «una decisión que sólo existe en el chat **no existe**» | el principio, sin mecanismo |

**El principio ya está escrito.** `SUITE-R04` dice exactamente lo que el firmante pidió. Lo que
falta no es la regla: es la **granularidad** y el **destino**.

## E-2 · El hueco, medido en esta misma sesión

La unidad de registro es la **fase** —nueve por tarea— y la unidad de interacción es la **parada**
—decenas—. Entre dos transiciones el agente se detiene muchas veces, y cada explicación muere en
la conversación.

**Medido el `2026-08-22/23`:** seis tareas cerradas —`PT-131`, `PT-129`, `PT-132`, `PT-114`,
`PT-124`, `PT-123`— con **todos** sus hallazgos explicados sólo en el chat. Sus issues tenían
únicamente las notas de `FDGE-R52`. Lo señaló el firmante, no un verificador.

Las seis explicaciones se publicaron **a mano** después. Ese acto es el que esta cadena de tareas
convierte en comando.

## E-3 · Y el marco ya pagó por el mismo hueco

`PT-101` nació de esta frase del firmante:

> *«es el tropiezo más recurrente y no se ve en ningún lado, sólo está en las conversaciones y las
> reparaciones únicamente son una vez por vez»*

Veintisiete roturas de escapado contadas en comentarios de cinco archivos, ninguna sumando con
otra. **La misma forma, un artefacto distinto.**

## E-4 · Qué hay que nombrar, y dónde va cada cosa

```
LEXICON    el termino PARADA · sus clases de MOTIVO · sus clases de DESENLACE · donde vive
RULES      la obligacion de publicarla, con severidad y RIGE_DESDE
CORE       generado, para que el agente lo cargue sin abrir nada mas
```

`LEX-R21` y la regla 2 de «Reglas para evolucionar este framework» no dejan alternativa:
**introducir un nombre nuevo fuera de `LEXICON` es un defecto por definición.**

## E-5 · El destino: el mismo que la nota de reanclaje

`FDGE-R52` ya resolvió dónde va un rastro de tarea: **issue si hay plataforma,
`TRANSICIONES.log` si no** —`PT-084` lo corrigió cuando descubrió que sin plataforma no se podía
avanzar ni una fase—.

Inventar un archivo nuevo sería un hecho con dos nombres (`LEX-R22`). La parada va al mismo sitio.

## E-6 · La relación con `FDGE-R52`, y no es coincidencia

**Una transición de fase es una parada cuyo desenlace es «cambio de fase».** `FDGE-R52` no
desaparece ni se relaja: pasa a ser el **caso particular** que ya está implementado y verificado.

Eso importa mecánicamente: `contarNotas` cuenta con `RE_NOTA` —`PHASE n → m`— y una parada que no
sea transición **no debe** casar ese patrón, o inflaría el recuento de `FDGE-R52` y una tarea
parecería tener reanclajes que no tuvo.

---

## Qué establece, y qué no

**ESTABLECE:** que el principio ya existe (`SUITE-R04`), que el hueco es de granularidad y no de
regla, que el destino ya está resuelto, y que `FDGE-R52` es el caso particular.

**NO ESTABLECE:** cuáles son las clases de motivo ni de desenlace. Es una decisión de diseño y va
en `PHASE 3`.
