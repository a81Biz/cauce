# Diseño — `PT-136`   `PHASE 4`

> La propuesta completa. Es lo que `G2` resuelve.

---

## 1 · `tracker validar <ID…> --firmante "Nombre" [--fecha AAAA-MM-DD] [--aplicar]`

```
valida   el firmante está en «firmantes»            (SUITE-R27)
exige    type == BUG                                (FDGE-R26)
exige    status == VALIDATION_PENDING               (LEX-R08)
escribe  status → DONE
         compuertas.G3 = { firmante, fecha }
```

**Todas o ninguna**: se recorren primero todas las allocations y sólo se escribe si las validaciones
pasan para todas.

## 2 · `tracker integrar` aprende el lote

```
tarea   status == DONE   → INTEGRATED
lote    status == READY  → CLOSED, y sólo si ninguna tarea sigue viva
```

«Viva» = no está en `ESTADOS_TERMINALES` ni es `DEFERRED`. `DONE` **no** es terminal: espera `G4`.
Y cuando bloquea, **nombra** las tareas: contar no dice cuál.

## 3 · Ninguno exige plataforma

Los dos escriben el registro y el YAML, locales. `SUITE-R22` declara soportado el proyecto sin
tablero, y `PT-133` ya pagó esta lección en `parada`.

## 4 · Lo que este diseño NO hace

- **No decide.** Registra.
- **No permite** cerrar un lote con trabajo dentro, ni con bandera.
- **No toca** las validaciones históricas.
