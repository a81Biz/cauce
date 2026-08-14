# PT-026 — Diseño   `PHASE 4` · `FDGE-R21`

```js
if (esRamaPorDefecto()) {
  for (const d of div) notas.push(`INFORMATIVO · ${d.regla} · ${d.mensaje}`);
  notas.push('… donde decide es en G4, sobre la rama de trabajo');
  return;                       // sin fail() → exit 0
}
for (const d of div) fail(d.regla, d.mensaje);
```

`esRamaPorDefecto()` compara `git rev-parse --abbrev-ref HEAD` con la rama que el adaptador
declara. Cualquier fallo o cualquier `null` → `false` → bloquea.

| Dónde | Comportamiento |
|:---|:---|
| Rama de trabajo | bloquea |
| Pull request | bloquea (no está en la rama por defecto) |
| Rama por defecto | informa, exit 0 |
| Rama desconocida | bloquea |

`G4` no cambia: `verify-fdge --gate G4` sigue ejecutando el espejo y sigue bloqueando, porque
`G4` se resuelve sobre la rama de trabajo.
