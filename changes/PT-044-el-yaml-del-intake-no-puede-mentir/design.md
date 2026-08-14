# PT-044 — Diseño   `PHASE 4`

## Una comprobación, tres direcciones

`SUITE-R35` hacia dentro: el registro asigna, y el YAML del intake y la línea de índice
**espejan**.

```js
const di = (campo, aqui, alla, cual) => {
  if (aqui == null || alla == null) return;          // falta un lado: nada que comparar
  if (String(aqui) === String(alla)) return;         // coinciden: ni una linea de mas
  const m = `${pt}: «${campo}» divergente — el registro dice «${alla}» y ${cual} «${aqui}». `
          + 'Se usa el del intake (PT-004: es lo que el PT dice de si mismo), y por eso se dice.';
  gate === 'G4' ? fail('SUITE-R35', m) : warn('SUITE-R35', m);
};
di('phase',  yamlPhase,  alloc?.phase,  'su intake dice');
di('status', yamlStatus, alloc?.status, 'su intake dice');
di('estado', idxStatus,  alloc?.status, 'su linea de indice dice');
```

Tres decisiones y su porqué:

**Aviso fuera de `G4`, error dentro.** Convertirlo en error de entrada pondría en rojo trabajo
válido ya integrado —aquí y en cualquier proyecto instalado—, y una compuerta que se pone roja
sobre comportamiento correcto enseña a saltársela: es lo que el propio `verify-fdge` declara en
el comentario de `exigible()`. En `G4` el estado tiene que ser uno solo, y ahí bloquea.

**Si falta un lado, no se compara.** Un `phase` ausente no es una divergencia: es un dato que no
existe, y afirmar sobre él sería inventarlo (`RULE-06`). Las ocho `DEFERRED` no declaran fase y
no deben generar ruido.

**Se declara cuál se usó.** La precedencia de `PT-004` no cambia; lo que cambia es que quien lea
la salida sepa **sobre qué valor** se comprobó todo lo demás. Sin eso el aviso sería una
curiosidad en vez de una explicación.

## El `status` del YAML

`RE_STATUS_YAML = /^\s*status\s*:\s*([A-Z_]+)/im` — mismo patrón que `RE_PHASE_YAML`, que ya
existe.

## La línea de índice

`checkIndex` ya la localiza y ya extrae el estado canónico: tenía el dato delante y no lo
comparaba con nada. Se le añade la comparación.

## Las cuatro de `EP-011`

```
1 · sincronizar sus cuatro YAML con el registro   (status: INTEGRATED · phase: 9)
2 · sincronizar sus cuatro lineas de REFACTOR_SCOPE.md
3 · ejecutar verify-fdge --all y MIRAR que se enciende
4 · lo que se encienda y no tenga rastro real se DECLARA en una entrada CORRIGE,
    no se fabrica
```

El paso 3 no es una formalidad: es el único sitio donde se ve qué comprobaciones estaban
apagadas. Es la razón de que esta tarea vaya **después** de `PT-046`, que abrió la vía del
paso 4.
