# PT-056 — Diseño   `PHASE 4`

## La función, pura

```js
export function estadoDelArbol(cp, git = {}) {
  // Sin checkpoint no hay nada que contrastar: no es discrepancia, es que no hay foto.
  if (!cp) return { corresponde: null, motivo: 'sin checkpoint' };
  const d = [];
  if (cp.sha && git.sha && cp.sha !== git.sha) d.push({ campo: 'sha', declarado: cp.sha, real: git.sha });
  if (cp.rama && git.rama && cp.rama !== git.rama) d.push({ campo: 'rama', declarado: cp.rama, real: git.rama });
  return { corresponde: d.length === 0, discrepancias: d, pt: cp.pt ?? null };
}
```

**Solo `sha` y `rama`.** `sucio` y `archivos` describen **progreso**, no divergencia — medido: la
lista cambió de 3 a 5 en el tiempo de escribir tres párrafos, con el `sha` intacto.

**Pura y exportada** a propósito: se prueba sin repositorio, sin red y sin fixture. Igual que
`queSigue` y `checkpointDe`.

## Los tres resultados, y por qué son tres y no dos

```
corresponde: true     el arbol es el que el checkpoint describe
corresponde: false    hay discrepancia, y «discrepancias» dice CUAL
corresponde: null     no hay checkpoint: no hay nada que contrastar
```

`null` no es `false`. **No tener foto y tener una foto equivocada son cosas distintas** — es
`RULE-06` en la forma que este repositorio ya usa con `SIN EVALUAR`.

Y por eso el campo que falta —un checkpoint con `sha: null`, que `PT-052` ya avisa— tampoco se
convierte en discrepancia: no se puede contrastar lo que no se declaró.

## Los dos consumidores

**`tracker siguiente`** — al retomar. La discrepancia entra como un **bloqueo** de `queSigue`,
junto a los que ya existen (`SUITE-R43`, issue ausente). Así aparece **antes** de decir qué toca, y
«no continuar automáticamente» significa algo: lo primero que el agente lee en `PHASE 0` es que el
estado no cuadra.

**`verify-fdge`** — cumplimiento. `checkCheckpoint` ya comprueba que el `sha` sea alcanzable;
gana la correspondencia y **falla**, como el resto de `LEX-R26`.

## El mensaje dice **cuál** es   `AC-04`

```
STATE_MISMATCH · el arbol no corresponde al checkpoint de PT-056:
  sha    declarado 87710a9   real 3d0ac1d
  rama   declarada chore/PT-056-...   real trabajo
Reanudar con esta discrepancia es una decision humana (SUITE-R06). Si el checkpoint
esta viejo y el arbol es el bueno:  tracker checkpoint PT-056
```

**La salida propone el comando y no lo ejecuta.** Reescribir el checkpoint borraría la única prueba
de que hubo divergencia, y decidir si el árbol o la foto es lo bueno es exactamente lo que
`SUITE-R06` reserva a una persona.

## `LEX-R26`, la cláusula que ella dejó pendiente

```
antes    «Que el arbol corresponda a ese sha es otra comprobacion y no esta aqui.»
ahora    la exigencia real, con el nombre de la condicion: STATE_MISMATCH
```

**No hay regla nueva.** `LEX-R26` es la regla del contrato del checkpoint y esto es parte del
contrato: dos reglas para lo mismo serían dos sitios donde divergir (`SUITE-R38`).

`STATE_MISMATCH` entra en `LEXICON` como **nombre canónico de la condición**, no como estado del
registro: la tarea sigue `IN_PROGRESS` y lo que está mal es la correspondencia.

## Lo que este diseño **no** hace

No repara. No compara contenido archivo a archivo. No guarda el `tree` aparte del `sha`. No toca el
presupuesto, ni la compuerta, ni `SESSION.json` — eso es `PT-057`…`PT-060`. Y no convierte
`STATE_MISMATCH` en un `status` de tarea.
