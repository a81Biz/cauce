# Diseño — `PT-122`   `PHASE 4`

> La propuesta completa. Es lo que `G2` resuelve.

---

## 1 · `comentarioDeCierreDeLote({ lote, version, tag, commit, tareas })`

**Puro y exportado.** Un caso puede ejercerlo sin hablar con la plataforma — que es justo la razón
por la que el defecto existía: nadie comprobaba lo que se escribía.

Devuelve el texto con `MARCA_AGENTE` **al final y por construcción**: no hay rama que lo omita.

## 2 · Los tres desenlaces del tag

```
tag y commit        - **Tag** `v9.9.9` → `abc12345`
tag sin commit      - **Tag** `v9.9.9` → **SIN EVALUAR**: el tag no resuelve
sin tag             - **Tag** `v1.0.0` **todavía no existe**. Crearlo es el paso 8: humano
                      y DESPUÉS del merge (`SUITE-R06a`). Este comentario no afirma que exista.
```

El de en medio importa: un nombre en la lista de tags no prueba que haya árbol.

## 3 · `tracker cierre EP-NNN [--aplicar]`

```
deriva    versión → registro
          tag     → git rev-parse --verify v<versión>^{commit}
          tareas  → allocations con epic == EP-NNN, contra ESTADOS_TERMINALES
enumera   sin --aplicar: imprime el texto y NO habla con nadie
publica   con --aplicar: un comentario en el issue del lote y en el de cada tarea
```

**Sin `--aplicar` no exige plataforma**: sólo deriva y escribe en pantalla. Exigir credencial para
enumerar un texto dejaría al proyecto sin tablero sin poder ni verlo (`SUITE-R22`).

## 4 · El límite de `SUITE-R43`

En el **mensaje** y en `SUJETOS`:

```
establece    todo comentario posterior a la última nota MARCADA del agente está sin
             responder, y si ninguno lleva marca lo dice SIN EVALUAR en vez de suponerlo
noEstablece  un comentario sin marca se atribuye a una persona, así que uno del agente
             escrito FUERA del comando cuenta igual: por contenido son indistinguibles
```

`SUITE-R38` exige que un límite declarado aparezca en algún mensaje real, y lo cazó: la primera
versión lo tenía sólo en el registro y en un comentario.

## 5 · Lo que este diseño NO hace

- **No edita nada.** No hay función de edición en el comando.
- **No restringe quién comenta.**
- **No afirma un tag que no existe.**
- **No cuenta `DONE` como terminal**: `DONE` espera `G4` y sigue vivo (`SUITE-R08`).
