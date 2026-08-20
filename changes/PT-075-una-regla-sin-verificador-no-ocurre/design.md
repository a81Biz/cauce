# PT-075 — Diseño   `PHASE 4`

## `A1` · `FDGE-R54`, en `RULES.md`

> `FDGE-R54` · **HARD** · **No se empieza lo que no se puede terminar, y consta.** Antes de
> `G2` toda tarea consulta la viabilidad de su sesión (`LEXICON` §6.5d) y el veredicto queda
> **registrado** en `REGISTRY.allocations[].viabilidad`, con la cifra contra la que se midió y
> su naturaleza. `MARGINAL` no prohíbe: obliga a trabajo **atómico** con checkpoint entre pasos.
> `UNSAFE` detiene con checkpoint y handoff. **Consultar no basta si no consta**: una compuerta
> cuyo resultado no se escribe no se puede auditar, y `PT-059` la dejó sin regla, sin fase y sin
> verificador — de modo que durante cuatro lotes no se cumplió ni se incumplió: no ocurrió.

## `A2` · la cita en `PHASES.md`, `PHASE 4`

```
PARA G2. … · viabilidad consultada y REGISTRADA [FDGE-R54]
       node tools/tracker.mjs viabilidad PT-NNN --registrar
```

`CORE.md` **no se edita**: lo regenera `build-core` (`SUITE-R16`).

## `A3` · `tracker viabilidad --registrar`

```js
// escribe SOLO lo derivado. LEX-R26: ningun campo que solo pueda rellenar la memoria.
alloc.viabilidad = {
  veredicto,                    // SAFE | MARGINAL | UNSAFE
  coste: { valor, naturaleza }, // MEDIDO | ESTIMADO | SIN EVALUAR
  precedente: { valor, naturaleza },
  medido_en: marca.desde,       // contra QUE sesion se comparo
  fecha,                        // git log -1 --format=%cs
};
```

Sin `--registrar` sigue siendo consulta y no escribe: mismo contrato que `espejo` frente a
`abrir --aplicar`.

## `A4` · la comprobación en `verify-fdge`

```js
const v = alloc?.viabilidad;
if (!v) {
  const m = pt + ': no consta el veredicto de viabilidad. «tracker viabilidad ' + pt
    + ' --registrar» lo escribe. No empezar lo que no se puede terminar exige saberlo ANTES.';
  if (gate === 'G2' || fase >= 5) fail('FDGE-R54', m); else warn('FDGE-R54', m);
} else if (v.veredicto === 'UNSAFE' && fase >= 5) {
  fail('FDGE-R54', pt + ': viabilidad UNSAFE. PT-059: checkpoint, handoff y parada.');
}
```

## `B3` · la segunda mitad de `SUITE-R42`

```js
/**
 * PT-075 · SUITE-R42 dice que el agente NO abre el PR ni lo fusiona, y hasta aqui solo se
 * comprobaba que el PR EXISTIERA. Esta mitad detecta la CONSECUENCIA de saltarsela: trabajo
 * de un PT escrito directamente sobre la rama de integracion en vez de llegar por su PR.
 *
 * --first-parent: un PR fusionado es UN commit de merge, asi que lo integrado por la via
 * correcta no cuenta. --no-merges deja solo las escrituras DIRECTAS.
 *
 * Solo mira PTs que DECLARAN rama. Las anteriores a 8.3.0 no la declaran y quedan fuera, con
 * el criterio de FDGE-R19: pedir rama a lo ya integrado es pedir que se invente.
 */
const directos = git(['log', ramaIntegracion, '--first-parent', '--no-merges', '--format=%s']);
const suyos = directos.filter((s) => duenoDe(s) === pt);
if (alloc?.branch && suyos.length) {
  fail('SUITE-R42', pt + ': ' + suyos.length + ' commit(s) suyos estan directamente en «'
    + ramaIntegracion + '» y declara la rama «' + alloc.branch + '». La rama de integracion '
    + 'RECIBE el pull request de cada tarea (FDGE-R19); no se escribe en ella.');
}
```

## `B4` · el comando descrito

`EXEC-R07` manda **describir** el comando reservado al humano. Se exige el artefacto desde
`PHASE 9`:

```
changes/PT-NNN-slug/acciones-humanas.md

  G4 · merge del lote a la rama por defecto     <- comando exacto, sin ejecutar
  publicar                                       <- si aplica
```

Si el agente ejecutó en vez de describir, el archivo falta y `verify-fdge` lo dice. **No prueba
que no lo ejecutara** — igual que `SUITE-R27` no prueba que firmara una persona—, pero convierte
la omisión en observable.

## `B5` · lo que NO es comprobable, y se declara

`TD-14` en `10-Technical-Debt`: **quién abrió un pull request no se puede determinar desde el
repositorio.** El agente actúa con la identidad git de la persona, así que `gh pr view --json
author` devuelve el mismo login lo abra quien lo abra. Escribir un verificador aquí daría
«correcto» siempre, que es peor que no tenerlo (`PT-023`: 75 % de falsos positivos, cuatro
causas, ninguna afinable).

## Delta respecto a la estrategia

**Una, y la impuso un caso que ya existía.** `B3` y `B4` se diseñaron para emitirse bajo
`SUITE-R42`. Al ejecutar la batería completa cayó el caso «sin plataforma ⇒ G4 libre de R42»,
cuyo comentario dice: *«Sin plataforma declarada, G4 no gana ninguna exigencia. Es la garantía
de todo proyecto que no espeja: sin este caso, la regla nueva rompería a todos los destinos ya
instalados.»*

Tenía razón dos veces:

1. **`SUITE-R42` es condicional** a que el proyecto declare plataforma —declararla es opcional
   y humano—. La topología de ramas y el comando descrito **no** dependen de la plataforma:
   rigen siempre. Emitirlos bajo `SUITE-R42` los hacía desaparecer justo en los proyectos que
   no espejan.
2. **Estaba citando la regla equivocada.** «La rama de integración recibe el pull request de
   cada tarea; no se escribe en ella» es literalmente `FDGE-R19`. «Lo que no se automatiza se
   describe» es `EXEC-R07`. Citar mal es el defecto que `SUITE-R53` prohíbe — y el mismo que
   `regla.mjs` tiene abierto en `PT-066`.

`B3` pasa a emitirse como **`FDGE-R19`** y `B4` como **`EXEC-R07`**. De `SUITE-R42` queda
comprobado lo comprobable —que el PR exista— y declarado lo que no —`TD-14`—.

**No debilita lo pedido:** las dos reglas siguen teniendo quien las ejecute, y ahora además con
el ID correcto y sin depender de que el proyecto declare plataforma.
