# PT-076 — Escenarios de prueba   `PHASE 4`

| AC | # | Escenario | Se espera |
|:---|:--|:---|:---|
| AC-01 | E1 | Se calcula la huella de `SESSION-<persona>.json` y `SESSION_LOG.md`, se corre la batería, se recalcula | **idénticas** |
| AC-02 | E2 | `coste`, `viabilidad` y `personas` siguen por `TRR` | siguen dando cifras derivadas de las tareas cerradas reales |
| AC-03 | E3 | `sesion abrir` en el fixture | escribe la marca **del fixture** y lo dice |
| AC-03 | E4 | `sesion abrir` dos veces en el fixture | la sobrescribe |
| AC-03 | E5 | `sesion cerrar` en el fixture | da el handoff, dice que no borra la marca y que `HANDOFF.md` queda intacto |
| AC-04 | E6 | Se deriva del código qué acciones escriben y se comprueba que ninguna vaya por `TRR` | **verde**, y el mensaje nombra la acción si cae |
| AC-04 | E7 | Se añade a mano `TRR sesion abrir` | **cae**, nombrando `sesion` |
| AC-05 | E8 | La nota de las 140 existe y dice cuántas | presente en `SESSION_LOG.md` |

## Comprobación inversa

Devueltos los nueve casos a `TRR`:

```
E1  cae — la marca y el ledger cambian tras la pasada
E6  cae — hay acciones que escriben invocadas por TRR
```

Y **siguen pasando** `E2`, `E3`, `E4` y `E5`: lo que los casos comprueban no depende de dónde
se invoque la herramienta. Ese es justo el argumento de que moverlos no pierde cobertura.

## Lo que este conjunto NO prueba

Que una acción que escriba **indirectamente** —llamando a otra que llama a `writeFileSync`— se
detecte. `E6` es una heurística de texto sobre el cuerpo de la función, igual que la de
`fallosPosibles` en `regla.mjs`. Hoy ninguna acción lo hace; el día que alguna lo haga, esto no
la verá y hay que decirlo.
