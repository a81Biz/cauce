# PT-010 — Self-Review   `PHASE 6` · `FDGE-R25`

## Antes y después, sobre el mismo issue

```
antes   **EP** · severidad — · sin implementación
        …: [`changes/EP-002-…/`](changes/EP-002-…/)          ← 404 desde un issue

ahora   **Implementación abierta** · El issue se lee sin salir de GitHub…
        Tareas de este lote:
        - `PT-009` · #14 — tracker cerrar comenta sin marca…
        - `PT-010` · #15 — El cuerpo de un issue de EP dice «sin implementación»…
        …: [`changes/EP-003-…/`](https://github.com/a81Biz/cauce/tree/main/changes/EP-003-…)
```

`selftest` 244 → **251** casos.

## La decisión que más se puede discutir

**El enlace apunta a `main`, no a la rama de trabajo.** Antes del merge da 404, y el cuerpo lo
dice. Elegí así porque un issue es un artefacto largo y una rama es corta: un enlace que
funciona hoy y muere en una semana es peor que uno que empieza a funcionar en una semana y no
muere nunca. Es discutible y está escrito en `strategy.md` con la tabla de las dos opciones.

## Lo que un revisor debería atacar

**1 · Introduje un defecto y lo cazó un caso.** `contextoCuerpo` leía `adaptador.repo` al
cargar el módulo, y `estado` corre **sin** adaptador — precisamente la acción que existe para
funcionar sin credencial. Reventaba. Lo dijo su propio caso, no yo.

**2 · Sincronizar sobrescribe el cuerpo sin preguntar.** Si alguien escribiera algo a mano en
el cuerpo de un issue, se perdería. Lo asumo porque el cuerpo siempre lo ha generado `abrir` y
nunca fue un sitio donde escribir — pero es destructivo y no avisa.

**3 · Una llamada más a `gh` por issue abierto**, sumada a las de etiquetas. Con tres va
sobrado.

**4 · Nada comprueba que el enlace resuelva.** Haría falta red en una compuerta. Es el mismo
límite que dejó pasar el defecto original, y sigue ahí: si mañana cambia la forma de las URL de
GitHub, ningún caso lo detectará.

## Lo que NO he verificado

Que el enlace resuelva de verdad tras el merge. Hoy apunta a `main`, donde `EP-003` aún no
está.

SELF_REVIEW_COMPLETE
