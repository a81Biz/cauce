# Descubrimiento — `PT-140`   `PHASE 2`

## Dónde está, con archivo y línea

`tracker.mjs:3117`:

```js
const padre = gitDe(['rev-parse', '--verify', `refs/heads/${rama}`]);
...
const args = ['commit-tree', arbol, '-m', mensaje];
if (padre) args.push('-p', padre);
```

Si la referencia local no existe, `padre` es `null`, el commit se crea **sin `-p`**, y la rama
arranca un linaje nuevo. **La salida es idéntica a la del caso bueno:**

```
cauce/alberto-martinez ← <sha> · N allocation(es), 2 archivo(s)
```

## Cómo se vio

Ocurrió el 2026-08-24, dejando una sola rama local a petición del firmante. El comando dijo que
había proyectado 26 allocations y lo que había hecho era **empezar de cero**.

## Por qué no se perdió nada, y por qué eso no consuela

El `push` normal habría sido rechazado por no ser fast-forward. **Protegido por accidente, no por
diseño**: con el rechazo de `git` sin explicación, la lectura obvia —«la rama está rara, la
fuerzo»— sí destruye. Y `--publicar` lleva el `push` dentro.

## La mitad que ya existía

`SUITE-R31` tiene el criterio correcto para el caso hermano: un commit sin la marca
`cauce:proyeccion` **se reporta y no se borra**, porque decidir qué hacer con el trabajo de alguien
es humano. Faltaba la simétrica: cuando la rama local **falta**, tampoco se empieza de cero en
silencio.

## Qué NO se midió

- **Si otras acciones asumen que una rama local existe.** Si las hay es un hallazgo aparte.
