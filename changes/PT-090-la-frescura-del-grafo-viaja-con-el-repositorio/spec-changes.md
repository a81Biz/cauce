# PT-090 — Cambios de especificación   `SUITE-R00` · `LEX-R22`

**Ninguna regla nueva, y ninguna cambia de severidad.** `FDGE-R43` ya existía; lo que cambia es
**qué mira** y **qué dice cuando no puede mirar**.

| Documento | Cambio |
|:---|:---|
| — | ninguno |

## Sin `RIGE_DESDE`, y por qué

La comprobación pasa a ser **más laxa**, no más estricta: deja de acusar por `mtime` y deja de
prometer un bloqueo que no ejecutaba. Un proyecto que hoy pasa, sigue pasando.

`RIGE_DESDE` protege del caso contrario — una regla que empieza a fallar sobre el pasado — y aquí
no lo hay. Añadir la fila sería una que alguien tendría que mantener sin que proteja de nada, y es
la misma decisión que `PT-089` `AC-05`.

## Lo que un proyecto destino nota

**Menos ruido, y un mensaje que dice la verdad.**

```
antes   Grafo MISSING — no existe graphify-out/. Bloquea G2 en PTs MAJOR.
ahora   Grafo MISSING — no existe graphify-out/ en este clon — el directorio esta en
        .gitignore, asi que la frescura NO ES EVALUABLE aqui. No es lo mismo que estar
        desactualizado.
```

Y los `SUSPECT` espurios desaparecen: los que salían por `mtime` movido sin que el contenido
cambiara.

**Nada que hacer al actualizar.** Un manifiesto sin `ast_hash` se sigue midiendo por `mtime`,
así que la primera regeneración es la que lo pone al día — y no hay paso obligatorio.
