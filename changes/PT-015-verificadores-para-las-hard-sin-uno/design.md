# PT-015 — Diseño   `PHASE 4`

## Las tres anónimas: una línea cada una

```js
// verify-patrones.mjs · ejecuta el contrato de SUITE-R38 y no lo nombraba
fail(`SUITE-R38 · ${nombre}: el patrón no casa «${muestra}», y su contrato dice que debe.`);

// revisar-secretos.mjs · ES la comprobacion de FND-R29, y bloquea
fail(`FND-R29 · huella sin firmar en ${ruta}:${linea}. Nada se publica sin revisar secretos.`);

// tracker.mjs · SUITE-R47 decide DONDE bloquea el espejo, y no se citaba
fail('SUITE-R47', `el espejo bloquea en «${rama}» …`);
```

**No cambia cuándo bloquean ni con qué código salen.** Cambia que el fallo lleve a la regla, que
es lo que `SUITE-R53` pide y lo que estas tres —las que existen **por** una regla— no hacían.

## `FDGE-R39`: la comprobación que falta

```js
// Los artefactos de fase de un PT viven bajo changes/PT-XXX-slug/ y en NINGUNA ruta global.
// Es donde v3 los tenia —PLAN_ACTUAL.md, PENDING_TASKS.md, CONTEXT_ANALYSIS.md en
// docs/implementation/— y de donde `migrate` los saca. Sin la comprobacion, volver a ponerlos
// ahi no lo detecta nadie, y dos PTs en vuelo se destruyen.
const GLOBALES_PROHIBIDOS = ['strategy.md', 'tasks.md', 'context.md', 'design.md',
  'test-scenarios.md', 'traceability.md', 'out-of-scope.md', 'spec-changes.md',
  'PLAN_ACTUAL.md', 'PENDING_TASKS.md', 'CONTEXT_ANALYSIS.md'];
for (const f of GLOBALES_PROHIBIDOS) {
  if (existsSync(join(IMPL, f))) {
    fail('FDGE-R39', `docs/implementation/${f} es un artefacto de PT en una ruta global …`);
  }
}
```

Corre **una vez por ejecución**, no por PT: es una propiedad del repositorio, no de una tarea.

## Por qué esto no infla `regla --fallos`

`regla --fallos` **deriva** su lista de los `fail()` y `warn()` del código: los cuatro IDs nuevos
aparecen **solos**, sin tocar ninguna lista escrita a mano. Es la prueba de que `PT-040` funciona,
y por eso esta tarea no añade ni una entrada manual en ningún sitio.

## Lo que este diseño **no** hace

No baja las 105 a cero, no promete `FDGE-R13` ni `FDGE-R20`, y no convierte en mecanizable lo que
describe el razonamiento. Lo que hace es que **lo que ya decide, diga su nombre**.
