# PT-024 — Diseño   `PHASE 4` · `FDGE-R21`

```js
export function cerrablesSinAdelantarse(muertas, enPrincipal) {
  if (!Array.isArray(enPrincipal)) return { cerrables: [], adelantadas: [], evaluable: false };
  …
  if (!estadoEnPrincipal.has(a.id)) { cerrables.push(a); continue; }   // nació en esta rama
  if (VIVOS.has(alla)) adelantadas.push({ ...a, statusEnPrincipal: alla });
  else cerrables.push(a);
}
```

| Caso | Resultado | Por qué |
|:---|:---|:---|
| La principal la ve viva | **no se cierra** | cerrar dejaría a la principal en rojo |
| La principal ya la ve terminal | se cierra | las dos ramas coinciden |
| La principal no la conoce | se cierra | nació en esta rama; no contradice nada |
| No se pudo leer la principal | **no se cierra nada** | no saber no es permiso |

`VIVOS` es el mismo conjunto que usa el espejo. Un segundo criterio escrito a mano divergiría
(`SUITE-R38`).

## El orden que la regla fija

```
1. trabajo: estado terminal apuntado        2. merge
3. cerrar --aplicar  ← ahora la principal ya lo sabe
```

Lo que hice fue `2 → 3 → 1`, y el paso 1 solo llega a la principal en el merge siguiente.
