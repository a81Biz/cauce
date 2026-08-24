# Escenarios de test — `PT-122`

> `FDGE-R17`: rojo primero, y **válido**.

| TS | Escenario | Esperado |
|:---|:---|:---|
| `TS-01` | El cierre de lote lleva la marca del agente | `cauce:agente` |
| `TS-02` | …y la acción existe en el despachador | `firmar, cierre` |
| `TS-03` | La versión, el tag y el commit salen de **fuera** del texto | `LOS TRES` |
| `TS-04` | …y el recuento de tareas se **cuenta** | `1 de 3` |
| `TS-05` | …y nombra las que siguen vivas | la lista |
| `TS-06` | Sin tag, **no** se afirma que exista | `todavia no existe` |
| `TS-07` | …y dice de quién es el paso | `paso 8` |
| `TS-08` | Un tag que **no resuelve** se dice | `SIN EVALUAR` |
| `TS-09` | El comentario declara que no edita los anteriores | `no se editan` |
| `TS-10` | …y el comando no tiene forma de editar | ausencia |
| `TS-11` | `SUITE-R43` declara qué establece | `ultima nota MARCADA` |
| `TS-12` | …y qué **no** establece | `por contenido son indistinguibles` |
| `TS-13` | …y el límite llega al **mensaje** | la frase, en `tracker.mjs` |
| `TS-14` | Sin ningún comentario marcado dice `null`, no «limpio» | `null` |
| `TS-15` | …y con uno marcado y otro después, pendiente | `true` |
| `TS-16` | …y con el marcado al final, limpio | `false` |

---

## Los que existen porque algo falló

**`TS-06`, `TS-07` y `TS-08` juntos** — son los tres desenlaces del tag. Con sólo el primero, una
implementación que **nunca** afirmara el tag también pasaría; con sólo los dos primeros, un tag que
figura y no resuelve pasaría por bueno.

**`TS-14`, `TS-15` y `TS-16` juntos** — los tres estados de la marca. `TS-14` es el que los
diecisiete comentarios pusieron a prueba: sin marca en ninguno, la respuesta correcta es «no lo
sé», no «limpio».

**`TS-13`** — nació de que `SUITE-R38` cazara el límite viviendo sólo en `SUJETOS` y en un
comentario.

**`TS-10`** — el negativo de `AC-03`: no basta con **decir** que no se editan los anteriores; el
comando no debe **poder**.

---

## Prueba inversa

| Se quita | Qué se pone rojo |
|:---|:---|
| La marca en el cierre de lote | `TS-01` |
| La rama del tag ausente | `TS-06` — se afirmaría que existe |
| La distinción «no resuelve» | `TS-08` |
| La declaración de que no se editan los anteriores | `TS-09` |
| El desenlace `SIN EVALUAR` de la marca | `TS-14` |

Cinco supresiones, cinco escenarios distintos.

### Y la inversa tuvo tres defectos suyos

**Un escenario fallaba sobre el módulo intacto**: comprobaba `SUJETOS`, que vive en `patrones.mjs`
y no en `tracker.mjs`, así que caía en las cinco mutaciones y las hacía **parecer** correctas.

**Una mutación tocaba otro sitio**: `L.push(MARCA_AGENTE);` aparece también en el constructor de la
parada, y `replace` sustituye la primera.

**Y la decimocuarta rotura de escapado**: al anclar con dos líneas, el salto entró literal en una
cadena y el arnés dejó de compilar. Se resolvió componiéndolo, como manda `SUITE-R59`.
