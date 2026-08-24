# Estrategia — `PT-122`   `PHASE 3`

> `FDGE-R54`: viabilidad **`SAFE`**, registrada.

---

## No se prohíbe comentar: se hace imposible producir un cierre sin marca

El intake lo dejó fuera de alcance con precisión: *«impedir que una persona comente»* no entra. La
marca **distingue procedencia**; no restringe a nadie.

Lo que sí se hace es que el cierre de un lote **tenga comando**. Mientras no lo tuviera, la única
forma era a mano — y a mano no lleva marca. El hueco no era de disciplina: era de herramienta.

## Derivar, no escribir

El texto de `EP-019` acertó versión, tag y commit. **Acertar no es lo mismo que no poder
equivocarse.** Aquí:

```
versión   del registro
tag       de git tag --sort=v:refname, buscando el de ESTA versión
commit    de a dónde apunta ese tag
tareas    contadas contra ESTADOS_TERMINALES, no transcritas
```

Y el orden por **versión** y no por alfabeto, que es lo que `PT-121` acabó de arreglar en `sellar`:
el alfabético pone `v10` antes de `v4.13.0`.

## Si el tag no existe, no se dice que existe

Es la decisión que hace útil el comando. Un cierre publicado el día antes del tag anunciaría un
tag inexistente, y eso es una afirmación falsa con forma de dato. El texto dice que **falta** y de
quién es el paso: el 8, humano y **después** del merge (`SUITE-R06a`).

Tres desenlaces para el tag, no dos: **existe y resuelve** · **figura y no resuelve** · **no
existe todavía**.

## El límite de `SUITE-R43` se declara donde protege

`AC-04` admite dos salidas: distinguir, o declarar `SIN EVALUAR`. **No se puede distinguir por
contenido** — los diecisiete lo demostraron—, así que se declara, y se declara **en el mensaje**:
un límite que vive sólo en un comentario del código protege a quien ya está leyendo el código, no
a quien lee el rojo.

Y en el registro de sujetos de `PT-087`, que es donde una comprobación dice qué establece y qué no.

## Lo que NO se hace

- **No se editan los diecisiete.** `SUITE-R09`: append-only. Y el comando no tiene forma de
  editar nada.
- **No se impide a nadie comentar.**
- **No se publica sin `--aplicar`.** Sin la bandera enumera el texto derivado y no habla con
  nadie — así que tampoco exige plataforma para eso.
