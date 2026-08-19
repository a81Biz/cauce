# PT-062 — Descubrimiento   `PHASE 2`

> Medido el 2026-08-18. La colisión está **reproducida**, no supuesta.

## 1. Nadie asigna

`SUITE-R08` dice que **el registro asigna**. Buscando quién ejecuta esa asignación:

```
tracker · acciones conocidas
espejo · abrir · cerrar · notas · pr · estado · pendiente · siguiente ·
checkpoint · avanzar · proyectar · coste · viabilidad · sesion · personas
```

**Ninguna asigna un identificador.** `counters` solo lo escribe `migrate.mjs` al sembrar un
registro nuevo, y `verify-fdge` lo valida. La asignación real la hace **quien edita el archivo a
mano** — hoy, el agente.

Eso no es un defecto mientras haya una persona: el archivo tiene un solo escritor. Con dos, el
único mecanismo que queda es el merge de git.

## 2. Qué hace git con dos asignaciones simultáneas

Reproducido en un repositorio de prueba. Ana y Bruno parten del mismo registro (`PT: 65`) y cada
uno asigna `PT-066`:

```
$ git merge ana
Auto-merging REGISTRY.json
CONFLICT (content): Merge conflict in REGISTRY.json
```

Hasta ahí, bien: hay conflicto y alguien tiene que mirarlo. **Lo que hay dentro es lo preocupante:**

```json
  "counters": { "PT": 66 },        ← fusionado SIN conflicto: los dos pusieron 66
  "allocations": [
    { "id": "PT-065", "slug": "x" },
    { "id": "PT-066",
<<<<<<< HEAD
      "slug": "lo-de-bruno"
=======
      "slug": "lo-de-ana"
>>>>>>> ana
```

**El contador no entró en conflicto.** Los dos escribieron `66`, así que git lo dio por acordado.
El conflicto quedó reducido a **una línea de `slug`**, y quien lo resuelva elige un texto:

- Elige `lo-de-bruno` → **la tarea de Ana desaparece entera**, y el contador dice 66 como si nada.
- Elige `lo-de-ana` → lo mismo al revés.

No hay ninguna resolución del conflicto que conserve las dos tareas, porque **el identificador ya
está duplicado antes de resolver nada**. El daño no es el conflicto: es que el conflicto **parece
pequeño**.

Y si las dos entradas hubieran quedado separadas por otras líneas, git las habría fusionado **sin
conflicto ninguno**: dos `PT-066` distintos en el mismo array, y `LEX-R04` roto en silencio.

## 3. Por qué los rangos lo resuelven

Con rangos reservados, Ana asigna del suyo y Bruno del suyo. Los dos añaden una entrada al array y
git fusiona **las dos**, porque no chocan: `PT-101` y `PT-201` no compiten por el mismo número.

El conflicto de texto puede seguir apareciendo si las líneas están pegadas — pero entonces es un
conflicto **de verdad**, cuya resolución obvia es conservar las dos entradas.

## 4. Lo que hoy existe y hay que respetar

| | |
|:---|:---|
| `counters.PT` | Un entero. `LEX-R04`: los IDs nunca se reutilizan ni se renumeran |
| `SUITE-R08` | El registro asigna. **No cambia**: los rangos acotan de dónde, no quién |
| `personas` (`PT-061`) | Ya existe, y es donde va el rango de cada una |
| 65 `PT` asignados | Del 001 al 065, sin rango. Lo ya asignado **no se toca** |

## 5. Lo que esto obliga

1. Cada persona puede declarar un **rango** en `personas`. Opcional: sin rangos, todo sigue igual.
2. Hace falta que **alguien asigne de verdad** —una acción— o el rango es una declaración que nadie
   aplica. Ese es el hueco real que `PHASE 2` encontró.
3. Dos rangos que se **solapen** tienen que fallar: solapados son peor que ninguno, porque dan
   confianza sin darla.
4. Un rango **agotado** se dice. Invadir el siguiente reproduce exactamente la colisión que esto
   evita, pero más tarde.
5. Y sin rangos declarados, el comportamiento de hoy **no cambia** — un proyecto de una persona no
   declara nada.
