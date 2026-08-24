# Autorrevisión — `PT-122`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

`tracker cierre`: el comentario de cierre de un lote, con la marca del agente **por construcción**
y **derivando** todo lo que afirma. Más el límite de `SUITE-R43` declarado donde protege.

## El hueco, medido

Cerrando `EP-019`, el comentario *«Integrado en main · suite 12.0.0 · tag v12.0.0»* se escribió con
`gh issue comment` en **diecisiete** issues. Salió **sin marca**, y `SUITE-R43` los contó como
humanos: diecisiete comentarios fantasma bloqueando el avance de sus tareas.

`CE-006` repetido diecisiete veces, con la agravante de que el marco **tiene** una marca para esto
y el acto la evitó por no pasar por la herramienta. **El hueco no era de disciplina: era de
herramienta.** No había comando.

## Acertar no es lo mismo que no poder equivocarse

El texto de `EP-019` **acertó** versión, tag y commit —la corrección del propio intake lo deja
claro: no mentía—. Pero estaban escritos a mano, y el mismo texto escrito el día antes del tag
habría anunciado un tag inexistente sin que nada lo impidiera.

Ahora hay **tres** desenlaces para el tag: existe y resuelve · figura y **no** resuelve · no existe
todavía, y entonces dice de quién es el paso.

## `AC-04` se cumple por la segunda rama, y se dice cuál

El criterio admite distinguir **o** declarar `SIN EVALUAR`. **Distinguir no se puede**: por
contenido son indistinguibles —los diecisiete lo demostraron— y por autor tampoco, porque el agente
comenta con la credencial de una persona y `SUITE-R43` es explícita en eso.

Así que se declara. Y la defensa real no es detectarlo: **es que exista un comando que no haga
falta rodear**.

## Los defectos que aparecieron construyéndolo

**1 · El límite vivía sólo en el código.** `SUITE-R38` lo cazó: *«protege a quien ya está leyendo
el código»*. Y hubo que alinearlo **literal** — el mensaje decía `—` donde el límite decía `:`.

**2 · Dos casos míos medían el arnés y no el hecho.** Uno preguntaba a `tracker xxx` por la lista
de acciones, que sin plataforma no se imprime; otro contaba caracteres entre un rótulo en negrita y
su valor. Rehechos.

## Y la prueba inversa tuvo tres defectos suyos

**a** — un escenario comprobaba `SUJETOS`, que vive en `patrones.mjs` y **no** en `tracker.mjs`:
fallaba sobre el módulo **intacto** y caía en las cinco mutaciones, **haciéndolas parecer
correctas**. Es el falso verde más caro que un arnés inverso puede producir.

**b** — una mutación tocaba otro sitio: `L.push(MARCA_AGENTE);` aparece también en el constructor
de la parada, y `replace` sustituye la primera.

**c** — la **decimocuarta** rotura de escapado: al anclar con dos líneas, el salto entró literal en
una cadena y el arnés dejó de compilar. Resuelto **componiéndolo**, como manda `SUITE-R59`.

## Lo que esta tarea NO establece

- **Que el cierre se haya publicado.** `cierre --aplicar` no se ha ejecutado sobre `EP-020`: el
  lote no está integrado, y publicar su cierre antes sería anunciar algo que no ha pasado.
- **Que los diecisiete dejen de contar como humanos.** Se curan solos con el primer comentario
  marcado en su issue; no se migra nada.
- **Que la marca pruebe autoría.** Es falsificable, y el código lo declara — igual que `SUITE-R27`
  declara qué prueba una firma.
- **Que nadie pueda comentar por fuera.** Es imposible de impedir, y no se intenta.

## Estado

| | |
|:---|:---|
| Escenarios | 16 de 16 |
| Prueba inversa | 5 supresiones, 5 escenarios distintos |
| Orphan Criterion | ninguno |
| `verify-fdge` | sin errores |
