# Descubrimiento — `PT-122`   `PHASE 2`

> Qué se midió, con qué comando, y qué salió.

---

## 1 · Diecisiete comentarios sin marca

Medido el 2026-08-22, cerrando `EP-019`: el comentario *«Integrado en main · suite 12.0.0 · tag
v12.0.0»* se escribió con `gh issue comment` en **diecisiete** issues. Salió **sin marca**, y
`SUITE-R43` los contó como **humanos** — diecisiete comentarios fantasma que bloqueaban el avance
de sus tareas.

Es `CE-006` —el acto hecho fuera del comando— repetido diecisiete veces, con la agravante de que
el marco **tiene** una marca para exactamente esto y el acto la evitó por no pasar por la
herramienta.

## 2 · Lo que el texto afirmaba, y por qué acertar no basta

El comentario decía la versión, el tag y el commit, **y los tres eran correctos**. La corrección
del propio intake lo deja claro: *«no mentía: `v12.0.0` existe y apunta a `5b184af`»*.

Pero estaban **escritos a mano**. Y acertar no es lo mismo que no poder equivocarse: el mismo
texto, escrito el día que el tag no exista todavía, anunciaría un tag inexistente sin que nada lo
impidiera.

## 3 · Qué existía ya, medido

```
$ grep -n "MARCA_AGENTE" docs/methodology/tools/tracker.mjs
298:  export const MARCA_AGENTE = '<!-- cauce:agente -->';
```

La marca existe desde `PT-008`, y `mensajeDeCierre` —el de **un issue de tarea**— la lleva. Lo que
no existía era **el cierre de un LOTE**: ningún comando lo producía, así que la única forma era a
mano, y a mano no lleva marca.

## 4 · Y el límite de `SUITE-R43`, medido

`comentarioSinResponder` ya devuelve **tres** estados —`true` pendiente, `false` limpio, `null`
`SIN EVALUAR` cuando ningún comentario lleva marca—, y eso está bien.

El hueco es otro y no se puede cerrar por contenido: **un comentario del agente sin marca es
indistinguible de uno humano**. Los diecisiete lo demostraron. La única garantía posible es que la
herramienta **siempre** marque los suyos — que es lo que `AC-01` pide y lo que hace que el hueco
deje de producirse.

---

## Conclusión

**`tracker cierre` existe**, lleva la marca por construcción, y **deriva** todo lo que afirma: la
versión del registro, el tag de `git tag --sort=v:refname` y el commit de donde ese tag apunta.

**Si el tag no existe, no dice que existe**: dice que falta y de quién es el paso —el 8, humano y
después del merge—. Un comentario que anuncia un tag inexistente es exactamente la clase de
afirmación que este marco existe para impedir.

**Los diecisiete no se editan** (`SUITE-R09`), y el propio texto nuevo lo declara.

**Y el límite de `SUITE-R43` queda escrito donde protege**: en su mensaje, no sólo en un
comentario del código. Un límite que vive sólo en el código protege a quien ya está leyendo el
código.
