# Fuera de alcance — `PT-122`

> `SUITE-R44` · La última columna es el destino, y es vocabulario cerrado.

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Editar los diecisiete comentarios históricos | `SUITE-R09`: append-only. Y el comando no tiene forma de editar nada | — |
| Impedir que una persona comente | La marca **distingue procedencia**; no restringe a nadie | — |
| Distinguir por **contenido** un comentario del agente sin marca de uno humano | **No se puede**, y los diecisiete lo demostraron. La única garantía posible es que la herramienta siempre marque los suyos, que es lo que este comando hace | — |
| Distinguir por **autor** | El agente comenta con la credencial de una persona: `SUITE-R43` es explícita en que la distinción es por marca y **no** por autor | — |
| Migrar los diecisiete para que dejen de contar como humanos | Se cura solo en cuanto el agente escribe uno **marcado** en ese issue, sin tocar la historia | — |
| Crear el tag de la versión | Es el paso 8: humano y **después** del merge (`SUITE-R06a`) | — |
| Que `cierre` marque el lote como `CLOSED` | Eso es estado, y lo escribe `integrar` / `firmar` (`PT-121`). Este comando **publica**, no transiciona | — |

---

## Lo que esta tarea **produce** y no resuelve

El cierre de un lote ya no se puede publicar sin marca **usando las herramientas del marco**. Lo
que sigue siendo cierto —y ahora está declarado— es que un comentario escrito **por fuera** sigue
siendo indistinguible de uno humano por contenido. La defensa no es detectarlo: es que exista un
comando que no haga falta rodear.
