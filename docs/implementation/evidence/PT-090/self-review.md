# PT-090 — Autorrevisión   `PHASE 6`

## `H-005` describía un defecto y había dos

**El manifiesto guarda `ast_hash` en la misma línea que `mtime`, y la función usaba el `mtime`.**
No es que el dato bueno no existiera: se eligió el barato teniéndolo al lado.

Es la forma más pura del patrón que este lote persigue. No «faltaba información» — había **dos
señales** y se cogió la que no describe el hecho.

**Y las rutas del manifiesto son absolutas.** Eso invalida el análisis de `H-005`, no lo matiza:
el hallazgo daba por hecho que versionar el grafo resolvería el problema, y **no lo resolvería**
— el manifiesto sólo sirve en un disco donde el proyecto esté exactamente en esa ruta.

## La prueba de que el arreglo era ése

Antes decía `SUSPECT · 6 de 17`, incluyendo archivos que yo no había tocado. Después:

```
SUSPECT · 5 de 17 — docs/methodology/tools/patrones.mjs, …/selftest.sh, …/tracker.mjs,
                    …/verify-fdge.mjs, …/verify-suite.mjs
```

**Exactamente los cinco que edité en este lote, ni uno más.** Cuando el cambio es pasar de un
proxy al hecho, la señal suele ser ésta: menos ruido *y* más precisión a la vez.

## La salida «versionar» se descartó con una cifra

`H-005` presentaba tres salidas como equivalentes. **No lo son:**

```
versionar graphify-out/     2,3 MB medidos, medio de ellos graph.html regenerable,
                            mas un conflicto de merge por cada regeneracion
mtime -> hash               casi cero: el hash YA esta en el manifiesto
MISSING explicito           una linea
```

Y `SUITE-R37` ya declara `graphify-out/` **regenerable**, con el `no hacer` prohibiendo
corregirlo a mano. Versionar un artefacto que el marco declara desechable es contradecirse.

## Dos decisiones para que el arreglo no sea otro dato que depende de la máquina

**La huella se calcula sobre contenido sin `\r`.** Sin eso, un checkout con `CRLF` y otro con
`LF` darían hashes distintos para el mismo archivo — cambiar un dato que depende de la máquina
por otro que también. Y no es hipotético: `git` avisó de esa conversión en **cada commit de este
lote**.

**Si la raíz no aparece en la ruta, se devuelve la ruta tal cual.** Fabricar una relativa
plausible sería peor que decir que no se pudo, y hay un caso que lo fija.

## `MISSING` no bloqueaba «a veces»

Fuera de la máquina que generó el grafo **no llegaba a evaluarse nunca**, y aun así el mensaje
decía «Bloquea `G2` en PTs `MAJOR`» — una promesa que ningún clon podía cumplir.

Ahora dice «no evaluable aquí», que es `SIN EVALUAR` aplicado a un estado. Y hay **dos** casos:
uno comprueba que dice el hecho nuevo, otro que **dejó de decir** el falso. Sin el segundo, el
mensaje podría decir las dos cosas y el primero seguiría verde.

## Lo que NO se resuelve, y está declarado

**En un clon limpio el grafo sigue sin existir.** La comprobación pasa de un bloqueo que nadie
alcanzaba a un «no evaluable» — honesto, y **no es lo mismo que comprobarlo**.

Cerrarlo exige versionar el grafo o generarlo en CI: la primera con su coste medido arriba, la
segunda contra `FDGE-R32`, que reserva el disparo a una persona.

`AC-01`..`AC-05`, los cinco.
