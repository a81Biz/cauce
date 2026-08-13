# PT-008 — Cambios de especificación   `PHASE 4`

## Regla nueva   `SUITE-R43`

```
| `SUITE-R43` | HARD | **Lo que una persona escribe en la plataforma se lee.** Si el proyecto
declara plataforma y el issue de un PT tiene un comentario del humano posterior a la última
nota del agente, el PT no avanza de fase hasta que haya respuesta. Se distingue por **marca de
procedencia** —el agente firma sus comentarios con una marca invisible—, no por autor: el
agente comenta con la credencial de la persona, así que el autor es el mismo. La marca es
falsificable y eso se declara, como `SUITE-R27` declara qué prueba una firma: lo mecanizable es
que la afirmación sea contrastable. Si ningún comentario lleva marca, la comprobación no puede
distinguir y sale `SIN EVALUAR` (`RULE-06`) — se cura sola en cuanto el agente escribe una. |
```

## Contrato de `tracker`

Acción `pendiente PT-NNN`, de solo lectura: `0` limpio · `1` hay comentario sin responder ·
`2` sin plataforma · `3` sin acceso · `4` sin ninguna marca, no evaluable.

## Contrato de `verify-fdge`

Con plataforma declarada, cada PT vivo con issue se comprueba contra `SUITE-R43`.
