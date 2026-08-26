# PT-146 · `out-of-scope.md`

```
OUT: audit.mjs. Es PT-147.

OUT: cambiar el contenido de CORE.md o CORE-PTSA.md. RC-01 es la barra: si el generado
     difiere en UN BYTE, la tarea fallo. Cambiar QUE carga el agente es otra decision.

OUT: colapsar las cuatro llamadas de :171-174 en un bucle sobre FAMILIAS. Cada una LEE UN
     ARCHIVO DISTINTO —RULES.md, LEXICON.md, EXECUTION-MODES.md y la especificacion de
     PTSA— asi que colapsarlas seria reescribir el mecanismo, no derivar su dato.

OUT: reescribir el mecanismo de overlay de PTSA (SUITE-R25). El contrato DECLARA «en_core»;
     no toca como se construye el overlay.

OUT: meter las operaciones de LEX-R16 en el contrato. «resume PT-XXX», «status FDGE»,
     «delta QA PT-XXX» y las demas NO estan en COMPONENTES, y anadirlas exigiria un campo
     con UN SOLO CONSUMIDOR — en el modulo cuya razon de ser es que un hecho tenga un dueno.
     Razonado en la parada de #281. El bloque queda mitad derivado y se DECLARA.

OUT: anadir a FAMILIAS ningun campo que no salga de un sitio medido. «etiqueta» entra
     porque «label» existe en :184; nada mas.
```

## Lo que se pensó y no se declara fuera de alcance

**Las operaciones de `LEX-R16` no las verifica nada.** Viven hoy en la tabla de `LEXICON` §7 y en
el bloque de texto de `build-core:433-437`, y ninguna comprobación las contrasta entre sí. Es un
candidato razonable a tarea propia **fuera de `EP-022`** —el lote va de componentes, no de
triggers— y queda en la parada de `#281` para que no se pierda.

**El barrido de `EP-022` tiene un sesgo medido.** Se hizo con `grep` sobre patrones de prefijo, y
por eso se le escaparon `audit`'s segundo mapa (sitio 14), `verify-suite:716` (sitio 15) y este
`label` (sitio 16). Los tres aparecieron **leyendo con una pregunta concreta delante**, no
ejecutando. Es el límite que `PT-144` declaró en su `HISTORY` y que este lote ha confirmado tres
veces; corregir el método de enumeración no es trabajo de esta tarea, pero **la cifra queda**.
