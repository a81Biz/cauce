# PT-016 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`phase` deja de ser opcional para un `PT` **vivo**. Faltar pasa de `SIN EVALUAR` —que no aprueba
ni bloquea, y salía **gratis**— a **error**.

```
selftest                              466 → 479 casos
errores nuevos en este repositorio      0
```

Y las **tres** listas de estados terminales que este mismo lote había ido creando se unifican en
una constante exportada con contrato.

## Lo que solo se vio ejecutando

**1 · La comprobación estaba donde no siempre corre.** La escribí dentro de `exigible()`, que solo
se invoca si algún artefacto se comprueba: un `PT` con todos sus artefactos presentes **no la
alcanzaba nunca**. El caso salió en rojo con la implementación ya terminada, y la lectura del
código no lo habría dicho — parecía el sitio natural. Ahora se comprueba **una vez**, justo tras
calcular la fase.

Efecto secundario que mejora la salida: los cinco `SIN EVALUAR` por artefacto pasan a ser **un**
mensaje. Cinco líneas diciendo lo mismo enterraban la única que hay que leer.

**2 · El caso tropezaba con su propio mensaje.** `chkno "SIN EVALUAR"` fallaba porque el error
nuevo **cita** esa frase para explicar qué cambió. Un aserto que se rompe contra el texto que
introduce no prueba nada: pasó a comprobar que desaparecen los avisos **por artefacto**.

**3 · Me salté la nota `PHASE 3 → 4` por tercera vez.** Misma transición, misma causa: `PHASE 4`
produce seis artefactos, empiezo a escribirlos y doy la transición por hecha. `FDGE-R52` la
reclamó las tres veces —`PT-044`, `PT-016`, y una consolidada en `PT-044`—. **No es despiste, es
un patrón**, y merece más que una disculpa: la nota debería escribirse **antes** de abrir el
primer artefacto de la fase siguiente, no después.

## El alcance que creció, y por qué se aceptó

El intake pedía exigir `phase`. Al escribirlo apareció que `FDGE-R52` (`PT-044`), `FDGE-R19`
(`PT-047`) y esta regla preguntaban lo mismo —«¿está terminado?»— **cada una con su copia de la
lista**. Tres copias del mismo hecho es exactamente lo que `SUITE-R38` prohíbe, y la cuarta habría
divergido.

Se unificó. No es refactor de paso: es que este marco tiene cicatrices documentadas de justo eso,
y las tres copias nacieron **hoy**, en tres tareas del mismo lote, sin que ninguna viera a las
otras.

## Lo que un revisor debería atacar

**1 · Rompe compatibilidad, y eso siempre se puede discutir.** Un proyecto instalado con `PT`
vivos sin `phase` pasa de verde a rojo. La defensa es que `migrate` ya lo enumeraba desde el tramo
de `5.0.0` —la migración existía, lo que faltaba era la consecuencia— y que el `CHANGELOG` lleva
guía. Pero es un `MAJOR`, y quien lo sufra tiene derecho a preguntarlo.

**2 · `DONE` fuera de `ESTADOS_TERMINALES` es una decisión con filo.** Suena a terminado y no lo
es. Si alguien lo añade sin leer el contrato, apaga tres compuertas a la vez. El caso lo protege;
el nombre de la constante, no.

**3 · Los `EP` quedan exentos «por diseño»**, y eso lo decidí yo al mirar que su ciclo no tiene
fases de tarea. Es defendible y está escrito, pero nadie me lo pidió.

## Lo que NO he verificado

Que el campo sea **cierto**. `PT-044` hace que mentir se vea; esto hace que faltar cueste. Ninguna
de las dos hace que alguien lo mantenga al día — y con `phase` obligatoria, el riesgo nuevo es que
se rellene con cualquier número para que el verde llegue.

## Checklist

- [x] Todos los `AC` verificados con evidencia en disco
- [x] Sin huérfanos en `traceability.md`
- [x] El código hace lo que dice `design.md`
- [x] Delta registrado (arriba: los tres hallazgos y el alcance que creció)
- [x] Sin regresiones: `selftest` 479/479 · `verify-suite` sin errores · `verify-patrones` cumple
- [x] `11-Conventions.md` respetado
- [x] Commits atómicos con `PT-016` en el mensaje
- [x] Sin restos de depuración
- [x] `out-of-scope.md` intacto: no se adivina la fase, no se exige a `EP` ni a lo integrado
- [x] Sin problemas de seguridad evidentes (`FDGE-R45`)
- [x] Contrato público: `verify-fdge` conserva interfaz y códigos de salida
- [x] Rama propia creada en `PHASE 5` y declarada en el registro (`FDGE-R19`)

SELF_REVIEW_COMPLETE
