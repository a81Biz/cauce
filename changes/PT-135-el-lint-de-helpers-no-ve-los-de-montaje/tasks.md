# Tareas — `PT-135`   `PHASE 5`

| # | Qué | Dónde | Estado |
|:---|:---|:---|:---|
| 1 | La lista de helpers se **deriva** del archivo | `tools/selftest.sh` · `lint_helpers` | ✔ |
| 2 | Se reconocen las **dos** formas de usar un helper | `tools/selftest.sh` · `lint_helpers` | ✔ |
| 3 | La posición del comando se **ancla**: no casa dentro de comillas | `tools/selftest.sh` | ✔ |
| 4 | Las líneas de heredoc se descartan | `tools/selftest.sh` | ✔ |
| 5 | `git_fixture` y `con_phase` viajan junto a `build_fixture` | `tools/selftest.sh` | ✔ |
| 6 | El caso del lint **puede fallar** | `tools/selftest.sh` | ✔ |
| 7 | `CLAUDE.md` declara **18** herramientas, no 16 | `CLAUDE.md` | ✔ |

---

## El defecto que apareció **arreglándolo**, y es el mismo

La primera rutina que movía las definiciones decidía si una era de **una sola línea** mirando si
la línea **termina** en `{`:

```python
if lineas[ini].rstrip().endswith('{'):   # ← falso para git_fixture
```

`git_fixture() {  # git inicializado, para que «sesion abrir» tenga un HEAD que marcar` termina en
el **comentario**. Así que se llevó sólo la cabecera y **dejó el cuerpo huérfano**.

La batería murió **en silencio** —código 0, sin línea de resumen— justo en el caso siguiente. Se
vio porque el archivo de salida tenía 1015 líneas y ninguna decía `selftest:`.

**Es exactamente el defecto que esta tarea persigue**: leer el final de la línea en vez del hecho.
Cometido al arreglarlo, y por eso queda escrito.

Corregido: una definición es de una línea sólo si la propia línea **la cierra** —termina en `}`—.

## Y una cifra más que nadie recalculaba

`CLAUDE.md` seguía diciendo **16 herramientas** con `eventos.mjs` y `matriz.mjs` ya publicadas.
Lo dijo `FND-R14` en la corrida completa: son **18**. Es `CE-010`.
