# PT-068 — Escenarios de prueba   `PHASE 4`

| AC | # | Escenario | Se espera |
|:---|:--|:---|:---|
| AC-01 | E1 | Identidad no declarada · existe `SESSION.json` de otra persona | **no hay sesión**, y se dice. No hereda commits ajenos |
| AC-05 | E2 | `SESSION.json` **sin** campo `persona` | es mía: el proyecto de una sola persona no cambia |
| AC-05 | E3 | `SESSION.json` con **mi** nombre | es mía |
| AC-01 | E4 | Existe mi archivo propio **y** un `SESSION.json` ajeno | gana el propio |
| AC-02 | E5 | `SESSION.json` y `SESSION-<yo>.json`, los dos con mi nombre | aparezco **una** vez, no dos |
| AC-06 | E6 | `viabilidad` y `sesion` sobre el mismo estado | declaran el **mismo** `desde` |
| AC-03 | E7 | `sesion abrir` | el mensaje nombra `SESSION-<persona>.json` |
| AC-04 | E8 | `sesion cerrar` | no afirma que la siguiente sobrescribe `SESSION.json` |

## Inversa

Devuelto el respaldo incondicional:

```
E1  cae — la identidad ajena vuelve a heredar 32 commits
E5  cae — la misma persona vuelve a salir dos veces
E6  cae — viabilidad y sesion vuelven a discrepar
```

Y **siguen pasando** `E2`, `E3` y `E4`: son el comportamiento que `AC-05` protege y que el
arreglo no toca. Si cayeran, el arreglo habría roto el proyecto de una sola persona.
