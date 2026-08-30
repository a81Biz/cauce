# `PT-205` · `test-scenarios.md`

## `TS-01` — el verde local avisa de lo que romperá en CI   → `AC-01`

```
DADO   un arbol con changes/ sucio y HANDOFF.md limpio
CUANDO corre verify-fdge
ENTONCES lo dice ANTES de commitear, en un bloque propio
```

## `TS-02` — y cuando NO hay nada pendiente, el bloque **no aparece**   → `AC-01`

```
DADO   un arbol limpio
CUANDO corre verify-fdge
ENTONCES el bloque «PENDIENTE AL EMPUJAR» no sale
```

**Sin `TS-02`, `TS-01` lo cumple un aviso que salga siempre** — y un aviso que sale siempre es
ruido, y el ruido no se lee. Ése es el riesgo entero de esta tarea.

## `TS-03` — el aviso lleva el **comando**, no sólo el diagnóstico   → `AC-01` · `AC-04`

```
DADO   un issue cuyo cuerpo no enlaza y cuyo intake YA esta en el arbol
CUANDO corre verify-fdge
ENTONCES dice «tras git push: tracker abrir --aplicar»
```

`RULE-07`: un mensaje dice **cómo se arregla**. Es lo único que separa un viaje de CI de cinco
segundos.

## `TS-04` — existe una vía sancionada de sellar el estado sin cambiar de fase   → `AC-02`

```
DADO   un arbol con trabajo en changes/ y el estado atrasado
CUANDO se invoca el comando de sellado
ENTONCES el sello se escribe, DERIVADO, sin tocar la prosa
```

## `TS-05` — y el sello sigue siendo derivado, no escrito a mano   → `AC-02` · `AC-03`

```
DADO   ese sellado
CUANDO se compara con lo que «avanzar» escribiria
ENTONCES la fecha sale de git y el hecho del registro
```

## `TS-06` — la prosa del `HANDOFF` no se toca   → `AC-03`

```
DADO   un HANDOFF con «decisiones:» y «no hacer:»
CUANDO se sella
ENTONCES las dos siguen ahi, intactas
```

`LEX-R26`: lo que no se deriva no se escribe. La prosa del `HANDOFF` es lo único del estado que no
se deriva, y estamparla sería inventar.

## `TS-07` — sin red, se dice y no se da por cuadrado   → `AC-01`

```
DADO   que la plataforma no responde
CUANDO se predice SUITE-R51
ENTONCES se declara SIN EVALUAR, no «no hay nada pendiente»
```

`SUITE-R22` declara soportado el proyecto sin red, y `PT-187` midió lo que pasa cuando un `catch`
deja un conjunto vacío: **inventa divergencias o las oculta**. Aquí ocultarlas sería devolver el
viaje de CI que la tarea quita.

## Lo que NO se cubre, y consta   `SUITE-R26`

- **No se predice lo que de verdad no se puede saber en local** — el límite de `PT-201`, en pie.
- **No se toca ninguna de las tres reglas**: las tres tenían razón.
- **No se declara completa la lista de roturas de esta clase.** Se cubren las **tres medidas** y el
  mecanismo queda abierto para la cuarta. Decir «ya están todas» sin barrer sería `CE-005`.
