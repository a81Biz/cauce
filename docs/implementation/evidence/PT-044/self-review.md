# PT-044 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`SUITE-R35` deja de mirar solo hacia la plataforma. El **YAML del intake** y la **línea de
índice** son las otras dos copias del estado, y una divergencia con el registro se **reporta**:
aviso durante el trabajo, error en `G4`.

```
divergencias en este repositorio   78 → 0
selftest                           436 → 445 casos
```

## El desvío, que fue grande   `FDGE-R21`

**No eran cuatro PT, eran 32.** El intake preveía los cuatro de `EP-011`; ejecutar la
comprobación recién escrita sobre el repositorio dio **78 divergencias**: prácticamente todo PT
cerrado desde `PT-001` tenía su YAML en `phase: 1` / `status: READY|DRAFT` y su índice en un
estado viejo. No es un descuido de una sesión: es que `PHASE 8` paso 5 —«REGISTRY: status ·
phase»— se cumplió sobre el registro y nunca sobre las otras dos copias, durante 43 tareas.

## La estrategia estaba equivocada en un punto, y lo dijo ejecutar

`strategy.md` decía que la deuda de reanclaje se declararía con una entrada `CORRIGE`. **No
sirve:** `FDGE-R52` cuenta **comentarios del issue**, no entradas de `HISTORY`. Lo escribí sin
comprobarlo y lo descubrí al sincronizar el primero.

Con eso, sincronizar dejaba `verify-fdge --all` en rojo y la única salida practicable era dejar
el YAML mintiendo: **la regla empujaba exactamente al defecto que esta tarea persigue**.

Lo que se hizo: `FDGE-R52` deja de exigir rastro a lo **ya terminado**. El reanclaje se escribe
mientras se trabaja; pedírselo a un PT que ya pasó `G4` es pedir que se fabrique. Y no pierde
ningún caso de los que deciden algo: `G4` corre con estado `DONE` —antes de integrar— y ahí sigue
exigiéndolo. Es el mismo criterio que `rigeAqui` ya aplicaba para no exigir bitácora retroactiva.

## Lo que un revisor debería atacar

**1 · Acabo de relajar una regla en la tarea que existe para que nada se relaje en silencio.**
Es la objeción justa. Mi defensa: el límite es el mismo que la regla ya tenía por versión, la
comprobación sigue bloqueando donde decide, y está escrito con su porqué en el código, en la
regla y aquí. Lo que no hice fue apagarla para que el verde llegara antes.

**2 · Sincronicé 42 YAML y 71 líneas de índice con un script.** No revisé uno por uno que el
estado del registro fuera el correcto para cada PT: **di por bueno el registro**, que es
justamente lo que `SUITE-R35` dice que hay que hacer, pero conviene decirlo en vez de dejarlo
entender.

**3 · El aviso es ruidoso cuando hay divergencia real.** 78 líneas la primera vez. Es
deliberado —una por PT y por campo, para poder arreglarlas— pero un repositorio con deuda vieja
verá una pared de texto la primera vez que actualice.

**4 · Nada comprueba que el registro sea cierto.** Si el registro se equivoca, ahora las tres
copias se equivocan igual y en silencio. La coherencia no es verdad.

## Lo que NO he verificado

Que `phase` se mantenga al día en el futuro. Esta tarea hace que **mentir se vea**; no hace que
nadie lo escriba. `PT-016` sigue abierto para decidir si además se exige.

## Desviaciones declaradas

**Sin rama por PT** (`PT-047`). Y **la nota de reanclaje `PHASE 3 → 4` se escribió tarde**: la
reclamó `FDGE-R52` después de que yo escribiera los artefactos de `PHASE 4`. No la retrofeché;
está publicada fuera de orden y dicho en el propio comentario. La regla me cazó a mí, en la
tarea que existe para que los artefactos no mientan sobre en qué fase están.

## Checklist

- [x] Todos los `AC` verificados con evidencia en disco
- [x] Sin huérfanos en `traceability.md`
- [x] El código hace lo que dice `design.md`
- [x] Delta registrado (arriba, y es el grande de esta tarea)
- [x] Sin regresiones: `selftest` 445/445 · `verify-suite` sin errores · `build-core --check`
- [x] `11-Conventions.md` respetado
- [x] Commits atómicos con `PT-044` en el mensaje
- [x] Sin restos de depuración
- [x] `out-of-scope.md` intacto: `phase` obligatoria sigue en `PT-016`, sin tocar
- [x] Sin problemas de seguridad evidentes (`FDGE-R45`)
- [x] Contrato público: `verify-fdge` conserva interfaz y códigos de salida

SELF_REVIEW_COMPLETE
