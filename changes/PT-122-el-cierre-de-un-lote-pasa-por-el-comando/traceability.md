# Trazabilidad — `PT-122`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | `tracker` publica el comentario de cierre de un lote, con `MARCA_AGENTE`, y es la única forma sancionada | `TS-01` `TS-02` | `selftest.sh:el cierre de lote lleva la marca del agente` · `…y la accion existe en el despachador` | `salidas/casos-122.txt` · `salidas/cierre.txt` · `salidas/inversa.txt` |
| AC-02 | El comentario **deriva** lo que afirma: versión, tag y commit salen del árbol | `TS-03` `TS-04` `TS-05` `TS-06` `TS-07` `TS-08` | `selftest.sh:la version, el tag y el commit salen de fuera del texto` · `…y el recuento de tareas se cuenta` · `sin tag, NO se afirma que exista` | `salidas/casos-122.txt` · `salidas/cierre.txt` |
| AC-03 | Los diecisiete comentarios ya escritos **no** se editan | `TS-09` `TS-10` | `selftest.sh:el comentario declara que no edita los anteriores` · `…y el comando no tiene forma de editar` | `salidas/casos-122.txt` |
| AC-04 | `SUITE-R43` distingue «comentario humano» de «comentario del agente sin marca» **o declara `SIN EVALUAR`** | `TS-11` `TS-12` `TS-13` `TS-14` `TS-15` `TS-16` | `selftest.sh:SUITE-R43 declara que establece` · `…y que NO establece` · `…y el limite llega al mensaje` · `sin ningun comentario marcado dice null, no «limpio»` | `salidas/casos-122.txt` |

**Cuatro criterios, cuatro con `TS`, cuatro con evidencia ejecutada.** Ningún Orphan Criterion.

---

## `AC-04` se cumple por la **segunda** rama, y se dice cuál

El criterio admite dos salidas: **distinguir**, o **declarar `SIN EVALUAR`**.

**Distinguir no se puede**, y los diecisiete comentarios lo demostraron: un comentario del agente
sin marca es indistinguible de uno humano **por contenido**, y por autor tampoco —el agente
comenta con la credencial de una persona, y `SUITE-R43` es explícita en eso—.

Así que se cumple por la segunda: `comentarioSinResponder` ya devolvía `null` cuando ningún
comentario lleva marca, y ahora el **límite** está declarado en el mensaje y en `SUJETOS`. La
defensa real no es detectarlo: es que exista un comando que no haga falta rodear, y eso es `AC-01`.

## `AC-01` dice «la única forma sancionada» y hay que precisar qué garantiza

Garantiza que **con las herramientas del marco** no se puede producir un cierre sin marca: la marca
va por construcción y no hay rama que la omita. **No** garantiza que nadie escriba un comentario
por fuera — eso es imposible de impedir, y `SUITE-R43` lo asume.

## Lo que esta trazabilidad **no** establece

- **Que el cierre se haya publicado.** `cierre --aplicar` no se ha ejecutado sobre `EP-020`: el
  lote no está integrado, y publicar su cierre antes sería anunciar algo que no ha pasado.
- **Que los diecisiete dejen de contar como humanos.** Se curan solos en cuanto el agente escriba
  uno marcado en ese issue; no se migra nada.
- **Que la marca pruebe autoría.** Es falsificable —cualquiera puede pegarla— y el propio código
  lo declara, igual que `SUITE-R27` declara qué prueba una firma.
