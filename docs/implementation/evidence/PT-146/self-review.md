# `PT-146` · autorrevisión — `PHASE 6` Evidence

## 1. Lo medido

| Qué | Antes | Después |
|:---|:---|:---|
| Literales de componente en `build-core.mjs` | **4** | **0** |
| `CORE.md` y `CORE-PTSA.md` | — | **sincronizados** en los tres pasos |
| Campo `etiqueta` en `FAMILIAS` | no existía | **10**, contrastadas contra `label` |
| `verify-patrones` | 85 | **99** comprobaciones |

`build-core --check` se ejecutó **en cada paso**, no al final. La barra de esta tarea es identidad
byte a byte, no ausencia de errores.

## 2. El sitio dieciséis, y lo que dice del método de enumeración

El mapa `label` de `:184` **no lo cazó la enumeración de `EP-022`**, y el motivo es concreto: el
barrido se hizo con `grep` sobre patrones de **prefijo**, y `label` es un objeto — sus claves no
casan ninguna alternancia.

Es **una de las «otras formas de nombrar un componente»** que `PT-144` declaró explícitamente que
su barrido no cubría. La cuenta del lote:

```
EP-022 §1 declaraba                            13 sitios
PHASE 1, verificando una frase propia    ->    14   audit tiene DOS mapas
PHASE 5 de PT-144, RC-03 extrayendo      ->    15   verify-suite:716, e INCOMPLETO
PHASE 2 de PT-146, leyendo para analizar ->    16   build-core:184, el mapa label
```

**Tres veces, ninguna por ejecutar el lote.** Las tres salieron de **leer con una pregunta
concreta delante**.

## 3. Primera tarea que amplía el contrato, y el contrato aguantó

`PT-150` y `PT-145` lo consumieron sin tocarlo. Ésta le añadió `etiqueta` a `FAMILIAS`, y **no
hubo que reescribir nada**: los tres consumidores anteriores no se enteraron.

Era lo que `PT-144` no podía establecer por sí misma —«que el contrato sirva»— y es la cuarta vez
que se cobra.

**Y el campo fue a `FAMILIAS`, no a `COMPONENTES`**, porque `label` tiene **diez** entradas:
incluye `SUITE`, `LEX`, `EXEC` e `INTAKE`, que son familia de reglas y no componente. El hecho fue
a donde estaba el hecho.

## 4. El paso 4 cambió al ejecutarlo, y el cambio se declara

Se planificó como «derivar la mitad derivable» del bloque de triggers. Al medirlo:

**No se puede derivar sin salirse del alcance.** Byte a byte exigiría meter en el contrato la
maquetación —agrupamiento por línea, marcadores `<tipo>: <título>`, separadores `·` y las
operaciones de `LEX-R16`—: un campo con **un solo consumidor**, en el módulo cuya razón de ser es
que un hecho tenga un dueño.

**Y al intentarlo apareció algo mayor que la duplicación que venía a arreglar:**

```
el bloque de CORE.md publica    8 triggers
LEXICON §7 declara              13
faltan   [CIERRA] · [IMPLEMENTACIÓN] · [START RECONCILE] · [INSTALL SUITE] · [START MIGRATE]
```

`SUITE-R15` dice que `CORE.md` es **lo único que se carga**; `LEX-R18`, que sin trigger no hay
componente. Dos de los cinco gobiernan el bucle abierto de FDGE y la puerta del modo restringido
de `SUITE-R17`.

**No se arregló aquí porque `AC-02` lo prohíbe** —cambiaría `CORE.md`— y **tiene tarea propia**,
no una nota: está enlazado desde la parada de `#281`.

## 5. Un error mío que rompió dos casos de `PT-144`

Añadir `etiqueta` a `FAMILIAS` dejó sin casar los `sed` de dos casos permanentes:

```
s/{ prefijo: 'EXEC', documento: 'EXECUTION-MODES.md', orden: 3 }/…/
```

Casaban **la línea entera y literal**. Al crecer la línea, dejaron de casar y los dos casos
fallaron.

**El arnés lo cazó en alto** —`chk` exige que el texto esperado aparezca— así que no hubo verde
falso. Pero el fixture era frágil de la forma exacta que este lote persigue: **una copia literal
de otra cosa**. Corregidos para casar **sólo el campo que rompen**.

Es la cuarta instancia en cuatro tareas de la misma familia: `PT-144` con el caso que esperaba un
`SyntaxError`, `PT-150` afirmando sobre el identificador, `PT-145` con el fixture incompleto, y
ésta. **Una comprobación frágil no es una comprobación.**

## 6. Lo que esta tarea deja para la siguiente

`PT-147` hereda el hallazgo de que `audit` tiene **dos** mapas por componente que discrepan, y
`FPGE`/`FIDE` entran en la auditoría de fases por primera vez. Su `label` equivalente —el mapa
`PROMPTS`— ya tiene el contrato que necesita.
