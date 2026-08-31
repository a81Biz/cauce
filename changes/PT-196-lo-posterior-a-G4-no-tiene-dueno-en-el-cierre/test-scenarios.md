# `PT-196` · `test-scenarios.md`

## `TS-01` — una fila POSTERIOR no bloquea `G4`   → `AC-02`

```
DADO   un lote cuya fila de cierre dice «TRAS EL MERGE»
CUANDO corre verify-fdge --gate G4
ENTONCES esa fila NO aparece como sin resolver
```

## `TS-02` — y una fila PENDIENTE sí bloquea   → `AC-02`

```
DADO   el mismo lote con una fila «PENDIENTE»
CUANDO corre verify-fdge --gate G4
ENTONCES bloquea
```

**Sin `TS-02`, `TS-01` lo cumple un `SUITE-R45` que no exija nada.** Es la mitad que prueba que la
distinción existe.

## `TS-03` — `siguiente EP-NNN` dice qué toca en el cierre   → `AC-01`

```
DADO   un lote con todas sus tareas en DONE
CUANDO se pregunta «tracker siguiente EP-NNN»
ENTONCES enumera el acto del cierre que toca, no la fase del intake
```

## `TS-04` — el doble viaje está declarado donde se ejecuta   → `AC-03`

```
DADO   PHASES.md
CUANDO se busca el procedimiento de cierre del lote
ENTONCES dice que hacen falta DOS merges y por que
```

## Lo que NO se cubre, y consta   `SUITE-R26`

**No se elimina el doble viaje.** Lo causa `SUITE-R46`, cuya exigencia es correcta y nació de una
avería real. Se **declara**, que es lo que el intake prometía.

**Y no se automatiza el merge a `main` ni el tag** (`SUITE-R06a`): el cierre los **enumera**, no los
ejecuta.
