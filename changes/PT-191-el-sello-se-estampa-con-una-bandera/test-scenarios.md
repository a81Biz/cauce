# `PT-191` · `test-scenarios.md`

Los cuatro se ejecutan en `selftest.sh`, sección `EP-025`, y los cuatro **apuntan el sellador a un
árbol sintético** vía `MTH_RAIZ` — que es lo que `PHASE 5` le añade. Ninguno toca el repositorio
real ni su `SELLOS.json`.

## `TS-01` — sin recibo no se sella, aunque venga `--verde`   → `AC-01`

```
DADO   un árbol sin docs/implementation/CORRIDA.json
CUANDO se invoca  sellar-bloques --verde
ENTONCES no sella, y dice «no hay recibo»
```

Es el caso base: la bandera sola deja de bastar. Fija el **cero de lo prohibido**.

## `TS-02` — una corrida que falló no certifica   → `AC-02`

```
DADO   un recibo con  "veredicto": "HAY FALLOS"
CUANDO se invoca  sellar-bloques --verde
ENTONCES no sella, y dice «una corrida que fallo»
```

Es la distinción entera de `PT-175`: un bloque se sella por haber **pasado**, no por que alguien
lanzara el sellador después de una corrida cualquiera.

## `TS-03` — un recibo de OTRA batería se rechaza   → `AC-03`

```
DADO   un recibo con  "veredicto": "OK"  y una huella de arnés que no es la actual
CUANDO se invoca  sellar-bloques --verde
ENTONCES no sella, y dice «otra bateria»
```

Éste es el que convierte `-11` del `HANDOFF` en comprobación: editar la batería invalida el recibo
sin que nadie tenga que acordarse.

## `TS-04` — un recibo válido SÍ sella   → `AC-04`

```
DADO   un recibo con  "veredicto": "OK"  y la huella REAL del arnés
CUANDO se invoca  sellar-bloques --verde
ENTONCES no aparece «NO SE SELLA»: el sellador acepta
```

**`TS-04` no es adorno, y por eso se escribe aparte.** `TS-01` a `TS-03` los pasa enteros un
sellador que se niegue **siempre**. Sin este cuarto, el arreglo podría estar roto y los tres
primeros seguirían verdes: sería un caso que fija el cero de lo prohibido y deja el hecho correcto
sin nadie que lo mire. La huella se calcula **en el momento**, con `git hash-object` sobre el arnés
que el fixture está usando — no se transcribe un valor, que caducaría al primer cambio de la
batería (`-18`).

## La comprobación inversa   `FDGE`, cierre de `PHASE 5`

Con el arreglo puesto y `CORRIDA.json` borrado a mano, `TS-04` tiene que ponerse **rojo**. Un caso
que pasa igual con y sin el arreglo no prueba nada; se ejecuta y se anota en la evidencia.

## Lo que NO se cubre, y consta   `SUITE-R26`

**«Sólo `--todo` escribe recibo»** queda declarado y sin caso propio. Probarlo exigiría anidar la
batería dentro de sí misma — que es exactamente lo que `PT-188` acaba de impedir con dos puertas,
tras medir que el arnés podía escribir en el repositorio real. Un `grep` al código sería otro proxy
(`CE-001`) y no se escribe: se dice que no está cubierto.
