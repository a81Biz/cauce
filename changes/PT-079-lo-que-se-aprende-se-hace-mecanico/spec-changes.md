# PT-079 — Cambios de especificación   `PHASE 4`

`FDGE-R22`.

| Qué | Antes | Después |
|:---|:---|:---|
| Regla | no existía | **`SUITE-R56`**, HARD: el rastro de una tarea sobrevive a la rama |
| Enlace del issue | la rama donde corre el espejo | ref durable: integración, o commit, o ninguno |
| `PHASE 9` | no nombraba la proyección | la publica, citando `SUITE-R56` |
| `ESTADO.md` de la proyección | columna `SHA` vacía sin rama declarada | el SHA del **contenido** |
| `CASOS-DE-USO.md` | sin caso de trazabilidad ni de proyección | `A5` ampliado + caso nuevo en `C` |
| `MANUAL.md` | no nombraba `proyectar` | el paso, en el recorrido de una tarea |
| El arnés | una inversa podía no revertir **en silencio** | `inversa` **aborta** si el patrón no casa |

**`SUITE-R56` es regla nueva ⇒ `MINOR`** en `CHANGELOG.md`. La versión la fija `EP-017` al
cerrar, no esta tarea.

**Migración: ninguna.** Los issues vivos se resincronizan con `tracker abrir --aplicar`; los
cerrados no se tocan, porque su enlace ya apunta a la rama por defecto.

**Y una precisión sobre qué NO cambia de especificación:** `FDGE-R19` sigue borrando la rama
efímera y la proyección sigue siendo derivada. Lo que cambia no es el diseño de ninguna de las
dos — es que el enlace deje de apuntar a algo que el propio marco borra a propósito.
