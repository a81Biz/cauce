# Autorrevisión — `PT-130`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

`contradiceElRegistro` ancla la línea `tarea:` a su **sujeto** —el primer identificador, que es lo
que la línea presenta en curso—; `SUITE-R34` declara su alcance en el registro de sujetos de
`PT-087`; y las otras **once** lecturas de alcance amplio quedan enumeradas con archivo y línea.

## Cómo apareció, y es la parte que importa

Escribiendo en el `HANDOFF` que los commits del cierre citaban `EP-019` **estando `CLOSED`** —es
decir, **registrando el defecto** que `PT-127` acababa de dotar de detector— `SUITE-R34` se puso
en rojo.

**La comprobación acusó a quien documentaba el hecho que ella vigila.** Es `CE-017`, y es la única
clase que se vuelve **más** probable cuanto **mejor** se escribe el ledger.

## El arreglo, y lo que deliberadamente no es

**Anclar al sujeto.** La línea `tarea:` afirma **una** tarea en curso —el checkpoint es uno,
`LEX-R26`— y todo lo demás es contexto.

Lo que **no** es: esquivar la palabra. El `HANDOFF` ya advertía de citar identificadores en prosa,
y seguir esquivándolos sería documentar la limitación en vez de quitarla. **El texto que fallaba
sigue escrito igual**, y `TS-13`/`TS-14` lo comprueban.

## Y no se pierde nada de lo que existía para cazar

| Línea | Antes | Ahora |
|:---|:---|:---|
| `PT-126 … citaban EP-019 estando CLOSED` | **falla** | pasa |
| `PT-126 … el cierre de EP-019 dejó esto pendiente` | **falla** | pasa |
| `PT-096 sigue en curso` (está `INTEGRATED`) | falla | **falla** |
| `PT-096 INTEGRATED, cerrada el martes` | pasa | pasa |

## Los dos defectos que aparecieron construyéndolo

**1 · El enumerador midió cero, y el cero parecía una medición.** `BS_D` ya contenía el punto y le
añadí otro: buscaba `\..includes` y no casaba nada, en un árbol donde `grep` encuentra cuatro a
simple vista. **Un cero que no se contrasta con nada es indistinguible de un cero real** — y es
exactamente por eso que la función devuelve `null` cuando no puede mirar.

Decimotercera rotura de escapado de la sesión; la respuesta fue la de `SUITE-R59`.

**2 · La prueba inversa tenía una mutación infiel.** «Sin anclar al sujeto» cambiaba **qué**
identificador es el sujeto, no el **alcance** de la lectura, así que tumbaba un escenario distinto
del que declaraba. **Una supresión que no reproduce el defecto que suprime no prueba nada, aunque
salga roja.**

Rehecha restaurando el bucle sobre todos los identificadores —el comportamiento anterior de
verdad— y con `TS-03`, el escenario que **sólo** el anclaje salva.

## Lo que esta tarea NO establece

- **Que las once lecturas enumeradas sean defectos.** Son candidatas a mirar.
- **Que sean todas.** Son las que la heurística encuentra hoy; enumera **formas**, no intenciones.
- **Que `CE-017` esté cerrada.** Tiene **una** instancia cerrada y su alcance declarado.
- **Que el trabajo de lote pueda citar el `EP`.** Es la pregunta que dejó `PT-127`, es sobre
  `FDGE-R19`, y **no se responde aquí**. Queda declarada con su medición hecha.

## Estado

| | |
|:---|:---|
| Escenarios | 14 de 14 |
| Prueba inversa | 5 supresiones, 5 escenarios distintos |
| Orphan Criterion | ninguno |
| `verify-fdge` | sin errores |
