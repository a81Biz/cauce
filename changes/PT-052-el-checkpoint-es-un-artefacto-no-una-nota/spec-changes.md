# PT-052 — Cambios de especificación   `PHASE 4` · `FDGE-R22`

| Documento | Cambio |
|:---|:---|
| `LEXICON.md` §6.2 | **`CHECKPOINT.json` nuevo**: nombre canónico y contrato de campos, junto a los ledgers de `docs/implementation/` |
| `LEXICON.md` · `LEX-R26` | **Regla nueva**: un campo que solo pueda rellenar la memoria **no entra**; y el `sha` que declara tiene que ser **alcanzable** |
| `PHASES.md` · `PHASE 0` | El checkpoint se **lee** al retomar, junto al `HANDOFF`, citando `LEX-R26` |
| `FDGE-Prompts.md` | Lo mismo en el texto copiable (`SUITE-R20`) |
| `INSTALL.md` · `I3` | Declara que `CHECKPOINT.json` **no se siembra vacío**, y por qué |
| `CORE.md` | Regenerado — se compila desde `LEXICON` y `PHASES` |

**Esta tabla empezó con una fila y acabó con seis, y las cinco añadidas las pidió la ejecución.**

`audit` reportó **dos huecos** en cuanto el vocabulario entró en `LEXICON`: una regla que ningún
documento operativo citaba, y un artefacto que ningún instalador declaraba. Al citarlo en
`PHASES.md`, `verify-suite` exigió que `FDGE-Prompts.md` lo dijera **también** — que es
literalmente la lección de `PT-023`: el texto copiable no puede decir menos que la regla que cita.

`PT-023` midió que **nada comprueba** que una declaración de esta tabla se cumpla. Lo que sí hay
—y funcionó— es que el marco no deja que un nombre nuevo quede huérfano: `audit` y `verify-suite`
cazaron las cinco filas que faltaban, una detrás de otra, sin que ninguna lectura las viera.

**No rompe compatibilidad:** añade un artefacto y una obligación sobre él. Ningún proyecto
instalado tiene hoy un `CHECKPOINT.json` que pueda quedar en rojo — y `INSTALL.md` declara que
**no se siembra**, precisamente para que no lo tenga. El lote sigue siendo `MINOR`.

**Consecuencia para el cierre, ya cumplida:** `CORE.md` regenerado. 244 → **245 reglas**.
