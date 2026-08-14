# PT-034 — Diseño   `PHASE 4` · `FDGE-R21`

```js
start() {
  // 1 · el estado, con su SIN EVALUAR declarado
  const cod = corre('tracker.mjs', ['siguiente', DESTINO]);
  if (cod === 2) di('Sin plataforma declarada: SIN EVALUAR (SUITE-R49).');
  if (cod === 3) di('Plataforma sin acceso: SIN EVALUAR. No se sustituye por una suposición.');
  // 2 · y DESPUÉS el núcleo
  di('Y ahora el núcleo — lo único que se carga (SUITE-R15): …/CORE.md');
}
```

Los códigos `2` y `3` de `tracker` **no son fallos del arranque**: son el `SIN EVALUAR` que
`SUITE-R49` obliga a declarar. Callarlos los convertiría en «no hay nada abierto» — la
degradación silenciosa que `SUITE-R38` documenta.

En la ayuda va **el primero**, marcado `EMPIEZA AQUÍ`.
