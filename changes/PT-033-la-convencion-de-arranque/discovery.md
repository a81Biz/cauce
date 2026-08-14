# PT-033 — Descubrimiento   `PHASE 2` · `FDGE-R42`

`SUITE-R48` dejó la respuesta consultable. Lo que no hay es **obligación de mirarla**, y en la
self-review de `PT-030` ya lo escribí: *un comando no puede exigir haber sido llamado*.

## Dónde tiene que estar

`CORE.md` es **lo único** que el agente carga (`SUITE-R15`). Hoy abre con las fases. Si la
consulta va detrás de las reglas, se lee cuando ya se ha decidido — que es tarde.

## Lo que falta definir, y es la mitad del trabajo

**«Haber consultado» no significa nada todavía.** Sin definirlo:

```
· ¿vale la consulta de hace tres turnos?
· ¿vale recordar lo que dijo?
· ¿qué pasa si no hay plataforma?
```

Tres huecos por los que se cuela exactamente el comportamiento que esto quiere impedir. Y
`PT-034` va a necesitar esa definición: si la inventa, son dos definiciones divergiendo
(`SUITE-R38`).
