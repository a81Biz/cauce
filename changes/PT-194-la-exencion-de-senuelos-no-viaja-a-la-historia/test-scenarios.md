# `PT-194` · `test-scenarios.md`

## `TS-01` — el comportamiento en historia queda **declarado**   → `AC-01`

```
DADO   un secreto sintetico en la HISTORIA, en un archivo que declara «cauce:senuelos»
CUANDO corre revisar-secretos --historial
ENTONCES dice que la declaracion exime el ARBOL y NO la historia, con su motivo
```

Lo que se compra no es que deje de fallar —debe fallar—: es que deje de ser un **efecto de por
dónde mira el escáner** y pase a ser una **decisión escrita donde se lee**.

## `TS-02` — un secreto **real** en la historia sigue bloqueando   → `AC-02`

```
DADO   un secreto en la historia, CON la declaracion «cauce:senuelos» puesta
CUANDO corre revisar-secretos --historial
ENTONCES BLOQUEA igual
```

**Es el que impide arreglarlo en la dirección peligrosa, y no es opcional.** Todo lo demás lo
cumple un escáner que deje de mirar la historia o que amplíe la exención. Éste es el único que
prueba que **no** se hizo eso.

## `TS-03` — el mensaje dice **qué ocurre de verdad**   → `AC-03`

```
DADO   el mismo hallazgo de historia
CUANDO se lee el mensaje
ENTONCES nombra el mecanismo previsto —firmar la huella— y no solo «hay una contraseña»
```

`RULE-07`: un mensaje dice **cómo se arregla**, no sólo qué falló. Y aquí importa más que de
costumbre: quien lee el rojo está a punto de decidir, y la decisión peligrosa —«amplío la
exención»— es la cómoda.

## `TS-04` — y en el **árbol** la declaración sigue eximiendo   → `AC-01`

```
DADO   el mismo archivo con «cauce:senuelos» en el ARBOL
CUANDO corre revisar-secretos SIN --historial
ENTONCES no lo reporta
```

Sin `TS-04`, `TS-02` lo cumple un escáner que haya **roto** la exención del árbol. Es la mitad que
prueba que sólo cambió lo que debía cambiar — lo que `PT-190` compró sigue comprado.

## Lo que NO se cubre, y consta   `SUITE-R26`

- **No se promete que ningún fixture vuelva a aparecer en la historia**: eso lo cerró `PT-193`
  ensamblando los literales en dos mitades.
- **La heurística de los 4000 caracteres no se toca** (`CE-014`: los destinos instalados dependen
  de ella).
- **No se retira ninguna huella firmada** ni se reescribe historia (`SUITE-R06f`).
- **Los casos plantan su propio secreto sintético** en un repositorio de fixture con su propia
  historia. No se busca nada en la historia real — y el literal se ensambla en dos mitades, que es
  exactamente la lección de `PT-193` y de `PT-015`.
