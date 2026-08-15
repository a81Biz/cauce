# PT-015 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

Cuatro reglas `HARD` que **deciden algo** pasan a emitir su ID al fallar.

```
reglas sin verificador que las emita   105 → 101
selftest                               479 → 485 casos
```

| Regla | Qué pasaba |
|:---|:---|
| `SUITE-R38` | `verify-patrones` **era** su comprobación y no la nombraba |
| `FND-R29` | `revisar-secretos` la citaba solo en el pie de las excepciones firmadas |
| `SUITE-R47` | `tracker` la citaba donde **informa**, no donde **bloquea** |
| `FDGE-R39` | nadie la comprobaba: artefactos de PT en rutas globales |

## El hallazgo que ordena la tarea

**Las `CHECK` sin verificador son cero.** No es casualidad: `CHECK` significa «un script la
verifica y bloquea la integración», y las 24 lo hacen. El hueco entero está en `HARD`, que
`SUITE-R26` solo dice que **aspira**. Sin esa medida, la tarea habría parecido «faltan 105» en
vez de «falta lo que decide, y la mayoría de lo demás no es mecanizable».

## Cuatro cosas que solo dijo ejecutar

**1 · Citar la regla en el texto no la cierra.** Lo «arreglé» metiendo el ID dentro del mensaje,
volví a medir, y seguía diciendo **104** en vez de 101. `regla --fallos` deriva de `fail('ID', …)`
y una mención en prosa no la ve — **con razón, porque mencionar no es emitir**. Hubo que darles a
las dos herramientas la forma `fail(regla, msg)`. Lo dijo volver a medir **después** de darlo por
hecho, que es la única razón por la que se vio.

**2 · `existsSync` no distingue mayúsculas en Windows.** `discovery.md` colisionaba con el índice
legítimo `DISCOVERY.md`, y `enrichment.md` con `ENRICHMENT.md`: `FDGE-R39` ponía en rojo cualquier
repositorio sano. Los tres artefactos de `PHASE 2` quedan fuera de la lista, y está comentado por
qué. Es la misma trampa que `TD-04` anota para `QA/` y `qa/`.

**3 · Mi propio mensaje mentía.** Escribí `«${REPO.rama}» no es la rama por defecto` — y
`REPO.rama` **es** la rama por defecto. Además se repetía una vez por divergencia. Leyendo, el
nombre de la variable parecía el correcto; ejecutando, el mensaje decía «main no es main».

**4 · Tercer aserto que tropieza con el `OK` de su propia regla.** `chkno "FDGE-R39"` casaba con
el mensaje de éxito. Van **tres en dos lotes** —`SUITE-R42` en `PT-043`, `FDGE-R19` en `PT-047`,
esta—. El inverso correcto es siempre la **exigencia**, nunca el ID, y a estas alturas debería ser
un reflejo.

## Lo que un revisor debería atacar

**1 · «Decide algo» es una definición mía.** La escribí en `strategy.md` —*un gate lo consulta o
una herramienta bloquea por ello*— y es defendible, pero nadie me la pidió. Con otra definición,
el alcance sería otro.

**2 · Cerré cuatro de 105 y la tarea se llama «verificadores para las HARD sin uno».** El título
promete más de lo que entrega. Lo compensa que el alcance reducido esté escrito **en la regla**
—`SUITE-R26` ahora dice qué se cubre y qué queda medido— y no solo en este documento.

**3 · Las tres primeras cuestan una línea y cierran una regla cada una.** Un revisor puede decir
que eso es cosmético: la comprobación ya existía. Mi respuesta es que `SUITE-R53` existe
justamente porque un fallo que no lleva a su regla obliga a deducirla, y que las tres
herramientas que **son** una regla eran el peor sitio para que faltara.

**4 · `FDGE-R39` comprueba doce nombres de archivo.** No cubre un artefacto de PT con otro nombre
en una ruta global. Es una lista, y las listas se quedan cortas — está dicho aquí.

## Lo que NO he verificado

Cuántas de las 101 restantes son mecanizables. Enumerarlas una a una es trabajo de días, no cabía,
y prometerlo habría sido justo lo que esta tarea evita. Queda **medido** por
`regla --sin-comprobar`, que lo dice con su número.

## Checklist

- [x] Todos los `AC` verificados con evidencia en disco
- [x] Sin huérfanos en `traceability.md`
- [x] El código hace lo que dice `design.md`
- [x] Delta registrado (arriba: los cuatro hallazgos)
- [x] Sin regresiones: `selftest` 485/485 · `verify-suite` · `verify-patrones` · `verify-fdge --all`
- [x] `11-Conventions.md` respetado
- [x] Commits atómicos con `PT-015` en el mensaje
- [x] Sin restos de depuración
- [x] `out-of-scope.md` intacto: `FDGE-R13` y `FDGE-R20` siguen fuera, con su motivo
- [x] Sin problemas de seguridad evidentes (`FDGE-R45`)
- [x] Contrato público: los tres verificadores conservan sus códigos de salida
- [x] Rama propia creada en `PHASE 5` y declarada en el registro (`FDGE-R19`)

SELF_REVIEW_COMPLETE
