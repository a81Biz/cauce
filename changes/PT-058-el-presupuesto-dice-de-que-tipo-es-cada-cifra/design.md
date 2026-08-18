# PT-058 — Diseño   `PHASE 4`

## El vocabulario, con su orden

```js
export const MEDIDO = 'MEDIDO';
export const ESTIMADO = 'ESTIMADO';
export const SIN_EVALUAR = 'SIN EVALUAR';

// Cerrado (AC-02). Y ORDENADO de mejor a peor: el orden ES la regla de contagio, no una
// convencion de escritura. Anadir un cuarto valor aqui rompe la comprobacion de verify-suite,
// que es lo que lo hace cerrado de verdad.
export const NATURALEZAS = [MEDIDO, ESTIMADO, SIN_EVALUAR];
```

`SIN_EVALUAR` vale `'SIN EVALUAR'` **con espacio**: es la cadena que ya aparece 50 veces en trece
archivos. Cambiarla obligaría a tocarlos todos.

## El tipo

```js
/**
 * Una cifra que dice QUE ES. No es ceremonia: es lo unico que hace comprobable AC-04.
 *
 * Sin naturaleza LANZA. Podria asumirse la peor —SIN EVALUAR— y seria conservador, pero
 * convertiria un olvido del programador en un dato valido que se propaga en silencio. Lanzar lo
 * detiene donde se escribio.
 */
export function cifra(valor, naturaleza) {
  if (!NATURALEZAS.includes(naturaleza)) {
    throw new Error(`cifra(): naturaleza no declarada. `
      + `Tiene que ser una de: ${NATURALEZAS.join(', ')}. Una cifra sin naturaleza no entra.`);
  }
  // SIN EVALUAR no tiene valor. Un cero sobrevive a cualquier suma y desaparece del resultado;
  // un null no. AC-03.
  return Object.freeze({ valor: naturaleza === SIN_EVALUAR ? null : valor, naturaleza });
}

/** La PEOR de varias naturalezas. Una resta entre un dato medido y una estimacion ES estimacion. */
export const peorNaturaleza = (...ns) =>
  NATURALEZAS[Math.max(...ns.map((n) => {
    const i = NATURALEZAS.indexOf(n);
    return i < 0 ? NATURALEZAS.length - 1 : i;   // lo que no se reconoce se trata como lo peor
  }))];
```

## Las operaciones

```js
/**
 * Operar dos cifras. La naturaleza CONTAGIA hacia la peor, y con SIN EVALUAR el valor es null.
 *
 * No revienta: devuelve SIN EVALUAR con valor null, que es la respuesta correcta —no se sabe—.
 * Reventar invitaria a un fallback a cero en el llamador, que es el defecto que AC-03 persigue.
 */
function operar(a, b, f) {
  const n = peorNaturaleza(a?.naturaleza, b?.naturaleza);
  if (n === SIN_EVALUAR) return cifra(null, SIN_EVALUAR);
  return cifra(f(a.valor, b.valor), n);
}

export const sumar  = (a, b) => operar(a, b, (x, y) => x + y);
export const restar = (a, b) => operar(a, b, (x, y) => x - y);
```

**`restar` y `sumar` entran aquí aunque quien las necesite sea `PT-059`**: sin ellas el tipo no
tiene dónde demostrar que sirve, y `AC-03` —que `SIN EVALUAR` no valga cero— no sería comprobable.

## Cómo se lee

```js
/** El texto de una cifra. La naturaleza va PEGADA al numero, no en una nota al pie. */
export const textoCifra = (c) =>
  c?.naturaleza === SIN_EVALUAR ? 'SIN EVALUAR' : `${c.valor} (${c.naturaleza})`;
```

Que la naturaleza viaje **con** el número y no en una leyenda aparte es lo que impide leer «1974»
como una medida: en el momento en que se separan, la distinción se pierde.

## La comprobación de `AC-02`

En `verify-suite`: importa `NATURALEZAS` de `patrones.mjs` y falla si no son exactamente tres, o si
alguna no es la esperada. **Se comprueba la constante, no la prosa** — perseguir el idioma es lo
que `SUITE-R44` ya decidió no hacer, y la constante es donde el vocabulario es cerrado de verdad.

## Lo que NO se construye

| Qué | Por qué |
|:---|:---|
| Reescribir los 50 usos existentes | Son mensajes que funcionan · refactor de 13 archivos, riesgo en 7 herramientas |
| Un cuarto valor | `out-of-scope` del intake · una cifra poco fiable **es** una estimación |
| Multiplicar, dividir, porcentajes | `PT-059` dirá qué necesita; adelantarlo es inventar |
| Decidir con las cifras | `PT-059` |
| Serializar cifras a JSON con su naturaleza | `PT-060`, si `SESSION.json` las necesita |
