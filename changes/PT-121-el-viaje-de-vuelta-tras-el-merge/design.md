# Diseño — `PT-121`   `PHASE 4`

> La propuesta completa. Es lo que `G2` resuelve.

---

## 1 · `tracker integrar <ID> [--aplicar]`

```
entra    status == DONE                      (FDGE-R34 lo exige para G4)
escribe  intake.md   status: -> INTEGRATED    ← primero, reversible
         registro    allocations[].status     ← y sólo si el primero salió bien
sale     nada más: el issue lo cierra «cerrar», DESPUÉS (SUITE-R46)
```

**Sin `--aplicar` enumera** lo que haría, nombrando **las dos** fuentes. Sin intake **falla y no
toca el registro**: escribir sólo una mitad deja las dos fuentes divergiendo, que es el defecto
que este comando cierra.

## 2 · `tracker firmar <ID> --compuerta G1 --firmante "Nombre" [--aplicar]`

```
entra    status == DRAFT                      G1 produce READY desde DRAFT
valida   el firmante está en «firmantes»      (SUITE-R27)
escribe  registro    status -> READY
         registro    compuertas.G1 = { firmante, fecha }
```

Sólo `G1`. Otra compuerta produce otro estado, y fingir que son el mismo sería inventar una
transición.

## 3 · Ninguno exige plataforma

Los dos entran en `SIN_PLATAFORMA`. Escriben archivos del repositorio; pedirles credencial dejaría
sin viaje de vuelta al proyecto que no declara tablero (`SUITE-R22`).

## 4 · `sellar` comprueba los dos tags   `AC-06`

```
tag anterior        v12.0.0 resuelve.
tag de esta version v13.0.0 todavía NO existe, y es lo normal: lo crea el
                    paso 8, humano y DESPUÉS del merge (SUITE-R06a).
```

Tres desenlaces para el anterior: **ninguno** · **figura y no resuelve** · **resuelve**. El de en
medio importa: un nombre en la lista no prueba que haya árbol, y «lo sellado» se calcula sobre ese
árbol.

Y el orden se deriva con `--sort=v:refname`, no con el de por defecto. El alfabético pone `v10`,
`v11` y `v12` **antes** de `v4.13.0`, y leer el final de esa lista da `v9.0.0` — el error de
medición que este intake tuvo que corregir.

## 5 · `FDGE-R19` y `PHASES.md`

`FDGE-R19` declara que el trabajo de lote usa la **forma de tarea** con el `type` del lote, y por
qué. `PHASES.md` §`PHASE 9` gana el bloque **`EL VIAJE DE VUELTA`** con los tres comandos, su
orden y su salida; `FDGE-Prompts.md` lo lleva copiable.

## 6 · Lo que este diseño NO hace

- **No automatiza el merge** (`EXEC-R04`).
- **No cierra issues.**
- **No crea tags.**
- **No responde** si el trabajo de lote puede citar el `EP` en un commit.
