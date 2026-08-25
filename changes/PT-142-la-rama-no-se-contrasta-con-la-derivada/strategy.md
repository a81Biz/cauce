# Estrategia — `PT-142`   `PHASE 3`

## Los dos caminos, y se toman los dos

**1 · Resolver la contradicción.** `LEXICON` manda: un lote **no** tiene nombre de rama derivable,
y `FDGE-R19` deja de pedir el `type` de un lote. El trabajo de lote viaja en la rama de una de sus
tareas, declarado en `SESSION_LOG.md`.

**2 · Usar `ramaDeTarea` para juzgar**, no sólo para proponer.

## Los caminos descartados, con su por qué

**1 · Dar `type` a los lotes.** Descartado: derogaría `LEX-R27` desde una herramienta, que es lo
que `SUITE-R00` prohíbe. Y un lote no es un ítem de trabajo: no tiene `severity` ni `track`.

**2 · Renombrar las ramas desviadas.** Descartado, y `FDGE-R19` ya lo dice: una rama creada se
**termina como empezó**, porque renombrarla rompe el pull request abierto sobre ella.

**3 · Fallar siempre.** Descartado: convertiría en deuda todas las ramas anteriores. `RIGE_DESDE`
acota desde la `13.1.0`, con el mismo criterio que `FDGE-R52`.

**4 · Adivinar el `type` cuando falta.** Descartado: `RULE-06`. Sin `type` **no hay nombre
esperado y se dice**.

## Cómo se verifica

Cuatro casos sobre `ramaDeTarea` —con `type`, con usuario, sin `type`, y el caso del lote— y la
comprobación corriendo sobre el árbol real en cada corrida de `verify-fdge`.
