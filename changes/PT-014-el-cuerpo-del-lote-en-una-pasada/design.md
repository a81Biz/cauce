# PT-014 — Diseño   `PHASE 4` · `FDGE-R21`

```js
export const ordenDeApertura = (pendientes) =>
  [...(pendientes ?? [])].sort((x, y) => (x?.type === 'EP' ? 1 : 0) - (y?.type === 'EP' ? 1 : 0));
```

Tres propiedades, y las tres se comprueban:

- **No muta.** Copia con `[...]`. `abrir()` guarda el registro después; ordenar su lista en
  sitio cambiaría el archivo por un efecto colateral invisible.
- **Estable.** `Array.prototype.sort` lo es desde ES2019, así que dos tareas conservan el orden
  del registro — el que la persona ve al leerlo.
- **Tolera la nada.** `undefined` da lista vacía, no excepción.

`abrir()` cambia en una línea: itera `ordenDeApertura(pendientes)`. Nada más.
