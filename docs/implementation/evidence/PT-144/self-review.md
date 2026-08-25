# `PT-144` · autorrevisión — `PHASE 6` Evidence

> Lo que se midió, lo que salió mal, y lo que encontró equivocarse.

## 1. Lo medido

| Qué | Antes | Después | Cómo |
|:---|:---|:---|:---|
| Comprobaciones de `verify-patrones` | **58** | **78** | ejecutado sobre `976b8be` y sobre `HEAD` |
| Casos del `selftest` | **1695** | **1703** | la batería lo imprime |
| `CORE.md` · `CORE-PTSA.md` | — | **sincronizados** | `build-core --check` |
| `RC-03` comparaciones | — | **20, cero discrepancias** | `rc03-comparacion.mjs` |
| `RC-04` casos de rotura | — | **7, todos por aserción** | `ts08.sh`, y ocho permanentes en `selftest` |

Ninguna comprobación se perdió: el recuento **sube**. Un recuento que baja al refactorizar es
comprobación que se apagó sin decirlo.

## 2. Tres cosas salieron mal, y las tres enseñan algo

### 2.1 El sitio quince apareció **porque la comparación no se copió**

`RC-03` podía haberse escrito copiando los catorce literales al test. Habría comparado lo que yo
escribí contra lo que yo escribí, y habría salido verde. Se escribió **extrayendo de los
archivos**, y por eso salió una **sexta** alternancia en `verify-suite.mjs:708` — con ocho
prefijos donde las otras llevan diez.

No es una copia más: guarda `EXEC-R08` y una cita de `FPGE-Rnn` o `FIDE-Rnn` en la matriz de
compuertas **pasaría en verde**. Un guardarraíl con dos agujeros.

**La lección es de método**: una comprobación que compara contra una copia del dato no comprueba
nada. Es `RULE-01` aplicado al propio test.

### 2.2 Un agujero en mis aserciones, encontrado por romperlas

`TS-08` rompió siete campos. **Seis fallaron bien y uno pasó en verde**: duplicar el `orden` de
una familia. `ordenDePrefijos()` ordena de forma estable, así que dos familias con el mismo número
conservan su posición y la secuencia emitida no cambiaba.

Estaba **especificado** en `design.md` §6 —«orden con huecos o repetido → falla»— y no se había
escrito. Importa porque `CORE.md` se emite con ese campo: un empate hace que el núcleo dependa
del orden de declaración en vez del declarado.

**Sin `RC-04` el agujero habría viajado** hasta que alguien reordenara `FAMILIAS`. `RULE-02` no
es una recomendación de estilo: es lo único que separa una comprobación de un adorno.

### 2.3 El arnés rechazó un caso mío, con razón

Escribí un caso cuyo resultado esperado era un `SyntaxError` —quitar el export y ver que
`verify-patrones` no arranca—. `revento()` lo invalidó: *«una herramienta rota tampoco imprime el
patrón buscado y el arnés certificaba verificadores muertos»*.

Pedía certificar un verificador muerto. Eliminado.

**Y el mismo error estaba en mi evidencia de `FDGE-R17`**: el primer «rojo» que registré fue un
`SyntaxError`, no un fallo de aserción. Sirve como prueba de que la comprobación no podía pasar,
pero **no** como prueba de que puede fallar por lo que dice comprobar. Los ocho casos
permanentes sí lo son.

## 3. Un fallo de método, sin excusa

Se editó `selftest.sh` **mientras la batería corría**. Es el `no hacer` número **3** del
`HANDOFF`, escrito desde `EP-021`, leído al abrir la sesión y **citado en un commit de hoy**.

`bash` lee el script por desplazamiento de bytes: insertar 45 líneas en medio desplaza todo lo
que aún no había leído. La corrida se invalidó entera —incluidas las etapas que ya habían
pasado— y se relanzó.

**Estar escrito no bastó.** Queda en la parada de `#279` para que la próxima vez la cuenta sea
dos, no una.

## 4. Y un cuarto, del mismo día y la misma clase

`npm run verify | grep …` devuelve el exit code **del `grep`**. Se leyó un `0` como si fuera de
`verify` y por poco se declara verde sobre nueve divergencias reales de `SUITE-R51`.

Está en el `no hacer` desde hoy, y **se volvió a cometer una vez más** ejecutando `RC-03` con
`| tail`. La tercera vez ya se midió con redirección a archivo.

## 5. Lo que esta tarea deja para las siguientes

- **`PT-145` gana un sitio**: la sexta alternancia, `verify-suite.mjs:708`. Y con una consecuencia
  — al derivarla del contrato, `FPGE` y `FIDE` entran en esa comprobación **por primera vez**.
  Puede destapar citas de regla en la matriz de compuertas que hoy nadie ve.
- **`PT-145` necesita añadir un import**: `comparar-marco.mjs` no consume `patrones.mjs` hoy.
- **`PT-147` tiene dos mapas que unificar**, no uno, y `FPGE`/`FIDE` entran en la auditoría de
  fases por primera vez.
- **`PT-146` tiene la barra más alta**: `CORE.md` byte a byte idéntico.
