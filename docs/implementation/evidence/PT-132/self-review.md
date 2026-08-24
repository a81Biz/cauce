# `PT-132` — Autorrevisión   `PHASE 6`

## Tres defectos encadenados, y el tercero es el que enseña

```
1  abrir crea el issue (irreversible) ANTES de guardar el registro (reversible)
2  el arreglo obvio —guardar tras cada issue— dispara la guarda de PT-107
3  ...porque HUELLA_AL_LEER es «const»: la guarda asumia UNA escritura por ejecucion
```

**El tercero no lo buscaba nadie.** `PT-107` construyó esa guarda para cazar a **otro proceso**
escribiendo en paralelo. Como ningún comando escribía dos veces, **nunca se ejercitó en el camino
que ahora hacía falta** — y en cuanto hizo falta, se denunció a sí misma.

Es la segunda vez en este lote: `PT-131` encontró que `PT-087` arregló *qué tag mirar* y dejó el
*observable* sin tocar. **Un arreglo anterior que deja el mecanismo sin probar donde importa.**

## Lo provoqué yo, y eso es parte del dato

Ejecuté `abrir --aplicar` en ventanas de dos minutos que expiraron a mitad, **dos veces**. Pero un
comando que duplica cuando se interrumpe es frágil: la interrupción es normal —red, timeout,
`Ctrl+C`— y el marco entero está construido sobre que un acto se completa o no ocurre.

**Y lo encontró el espejo, no yo.** `SUITE-R35` reportó dieciséis issues abiertos que ninguna
allocation reclamaba. Sin esa comprobación habrían quedado ahí, y el tablero habría dicho que el
lote tiene el doble de tareas.

## El daño, y cómo se limpió

```
duplicados        16 · PT-114..PT-126 por dos · PT-129 por TRES
cerrados          16, cada uno con nota marcada que explica la causa
reabiertos        0 — el registro reclama el bueno, reabrirlos seria ruido
espejo            22 allocation(s) viva(s) y 22 issue(s) abierto(s): cuadra
```

## Lo que esta tarea **no** establece

- **Que el resto de `tracker` sea transaccional.** Se arregló **el comando que duplicó**. Los
  demás quedan declarados y sin medir.
- **Que un issue duplicado se pueda borrar.** La plataforma no lo permite sin permisos de admin,
  y `SUITE-R06` no lo contempla. Se cierran.
- **Que el issue adoptado sea el correcto.** Un título repetido a mano también casa — y es
  preferible adoptar uno ajeno, que se ve en el espejo, a crear un duplicado que nadie mira. Está
  escrito en el contrato de la función.
