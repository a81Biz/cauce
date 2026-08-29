# `PT-201` · `test-scenarios.md`

## `TS-01` — las comprobaciones no reproducibles están DECLARADAS   → `AC-01`

```
DADO   RULES.md
CUANDO se consulta SUITE-R62
ENTONCES dice donde deja de valer su promesa, y nombra la clase de comprobacion
```

Se comprueba sobre el árbol real, con `regla.mjs`, que es la herramienta que el marco ofrece para
contestar «qué exige esta regla».

## `TS-02` — sobre un árbol SUCIO, se avisa   → `AC-02`

```
DADO   un repositorio con cambios sin commitear en lo que la comprobacion mira
CUANDO corre verify-fdge
ENTONCES dice que su veredicto es sobre lo COMMITEADO, no sobre lo que hay delante
```

## `TS-03` — sobre un árbol LIMPIO, NO se avisa   → `AC-02`

```
DADO   un repositorio sin cambios pendientes
CUANDO corre verify-fdge
ENTONCES no aparece ningun aviso
```

**Éste es el que impide que el arreglo se convierta en ruido.** `TS-02` lo satisface un aviso que
aparezca siempre — y un aviso permanente no informa de nada: sería la misma avería que esta tarea
arregla, con otra forma. Es el argumento de `SECRETOS-EXCEPCIONES.md`: *«una compuerta siempre roja
enseña a saltársela»*.

## `TS-04` — el mensaje de `SUITE-R34` deja de afirmar lo que no sabe   → `AC-03`

```
DADO   un HANDOFF actualizado pero SIN COMMITEAR, y trabajo commiteado en changes/
CUANDO corre la comprobacion
ENTONCES no dice «hubo trabajo despues del estado» a secas: dice desde donde mira
```

El mensaje actual afirma un hecho **falso** en ese escenario, y manda a actualizar un `HANDOFF` que
ya está al día.

## Lo que NO se cubre, y consta   `SUITE-R26`

**Las once comprobaciones, una por una.** El inventario de `discovery.md §3` es una **aproximación
medida** —asocia cada uso de `git log` o del adaptador con la primera regla citada después— y no se
afirma exacto. Lo que se cubre es la clase y el aviso; auditar las once es otro trabajo.

**Y no se cubre `SUITE-R51` con un caso propio**: su hecho —el ref durable— sólo existe tras el
`push`, así que reproducirlo en la batería exigiría publicar. Se declara aquí en vez de fingir.
