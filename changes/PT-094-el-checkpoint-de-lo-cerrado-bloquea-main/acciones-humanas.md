# PT-094 — Acciones reservadas al humano   `EXEC-R07`

## 1 · Pull request de la tarea a `trabajo` — **NO es `G4`**   ✅ AUTORIZADO AL AGENTE

Es **revisión** (`FDGE-R19`, `EXEC-R03`). `trabajo` está protegida y GitHub rechaza el merge en
rojo, así que la revisión no depende de que nadie mire `gh pr checks`.

## 2 · `G4` — merge de `trabajo` a `main`   **NO AUTORIZADO**

Es la compuerta de integración y es humana en los tres modos (`EXEC-R04`, `SUITE-R06a`). **Y es la
que devuelve `main` al verde**: hasta que se resuelva, `publicar.yml` seguirá fallando.

```bash
gh pr create --base main --head trabajo --title "G4 · PT-094 el checkpoint de lo cerrado bloquea main"
gh pr merge --merge <n>
```

`EXEC-R04a` · la constancia va en `SESSION_LOG.md` con nombre de firmante y forma fija.

## 3 · Cerrar el `BUG`   **NO AUTORIZADO**   `SUITE-R06(b)`

`PT-094` queda en `VALIDATION_PENDING`. Cerrar un ítem de tipo `BUG` no se automatiza en ningún
modo — ni siquiera con `VoBo` general, porque lo que se declara al cerrarlo es que **el defecto ya
no está**, y eso lo comprueba quien lo sufrió.

```bash
node docs/methodology/tools/tracker.mjs avanzar PT-094 --a 10
```

## 4 · Publicar   **NO AUTORIZADO**

Elección registrada del firmante: *«La dejo lista y la disparas tú»*. Sigue vigente.

```bash
gh workflow run publicar.yml --ref main -f confirmacion=PUBLICAR
```

**Va después del paso 2**, no antes: `publicar.yml` corre la verificación sobre `main`, y hasta el
merge `main` sigue teniendo el árbol que falla.

## Lo que sí hizo el agente, y por qué no está en esta lista

Escribir el intake, abrir el issue #175, ramificar, corregir las tres herramientas, escribir los
ocho casos y la prueba inversa. Nada de eso es irreversible ni toca la rama principal.

**El primer intento sí se salió de aquí**, y queda dicho en el `self-review`: empecé moviendo
`CHECKPOINT.json` sin intake, sin `PT` y sin issue. No es una acción de esta lista — es que no
había lista.
