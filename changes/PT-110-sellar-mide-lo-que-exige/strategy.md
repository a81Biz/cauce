# Estrategia — `PT-110`

## La decisión

**A-1 · `sellar` mide y dice. No arregla.**

La medición va donde ya están las otras tres —grafo, documentos de entrada, guía de migración—,
con la misma forma: una línea que dice el estado y, si hay deuda, **el comando que la resuelve**.

### Alternativas descartadas

| | Por qué no |
|:---|:---|
| **Que `sellar` lo arregle** | `sellar` informa; arreglar es una decisión (`EXEC-R07`). Y reescribir un documento de Foundation dentro de un comando de estado mezcla responsabilidades |
| **Que `verify-fdge` bloquee** | ya avisa, y bloquear una cifra descriptiva pararía el trabajo por algo que no apaga ninguna comprobación |
| **Recalcularlas en cada tarea** | es lo que hice siete veces a mano; el problema no es cuándo se recalculan sino **dónde se comprueban** |
| **Quitar las cifras del inventario** | son lo único del documento que **se puede** contrastar |

## Por qué «medir y decir» basta aquí

La deuda no es peligrosa: una cifra desviada no apaga ninguna comprobación. Lo que hacía daño era
**cuándo se enteraba uno** — al correr la batería, ya con la decisión de sellar tomada.

Moverla al informe de `sellar` no la hace más grave: la pone **antes** de la decisión.

## Termina cuando

`sellar` publica el estado del inventario junto al del grafo, dice `SIN EVALUAR` si no puede
leerlo, no lo arregla por su cuenta, y la batería falla sin el arreglo.
