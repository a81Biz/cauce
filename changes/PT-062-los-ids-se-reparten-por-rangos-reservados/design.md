# PT-062 — Diseño   `PHASE 4`

## El esquema

```json
{ "nombre": "Alberto Martínez",
  "git": [ … ],
  "rango": { "PT": [1, 999] } }
```

Un rango por **tipo de identificador**. `[desde, hasta]`, los dos inclusive. Opcional: sin `rango`
todo funciona como hoy.

## Las funciones puras

```js
/**
 * El siguiente ID del rango de una persona. Devuelve el numero, o null CON MOTIVO.
 *
 * Se DERIVA de lo ya asignado dentro del rango, no de un contador aparte: un contador por
 * persona seria un segundo sitio donde vive el mismo hecho, y divergiria (SUITE-R38).
 */
export function siguienteEnRango(prefijo, rango, usados = []) {
  if (!Array.isArray(rango) || rango.length !== 2) {
    return { numero: null, motivo: 'esta persona no declara rango para ' + prefijo };
  }
  const [desde, hasta] = rango;
  const dentro = usados.filter((n) => n >= desde && n <= hasta);
  const siguiente = dentro.length ? Math.max(...dentro) + 1 : desde;
  if (siguiente > hasta) {
    // AC-05 · invadir el rango del siguiente reproduce EXACTAMENTE la colision que esto evita,
    // pero mas tarde y con trabajo hecho encima. Se niega y se dice.
    return { numero: null,
      motivo: `rango ${prefijo} [${desde}-${hasta}] AGOTADO: ${dentro.length} usados y el ultimo `
        + `es ${Math.max(...dentro)}. Ampliar el rango es una decision humana; invadir el `
        + 'siguiente reproduce la colision que los rangos evitan.' };
  }
  return { numero: siguiente, motivo: null };
}

/** ¿Se solapan dos rangos? Solapados son PEORES que ninguno: dan confianza sin darla. */
export const seSolapan = (a, b) =>
  Array.isArray(a) && Array.isArray(b) && a[0] <= b[1] && b[0] <= a[1];

/** Todos los solapes de una tabla de personas, para un prefijo. */
export function solapes(personas = [], prefijo = 'PT') {
  const out = [];
  const con = personas.filter((p) => Array.isArray(p?.rango?.[prefijo]));
  for (let i = 0; i < con.length; i += 1) {
    for (let j = i + 1; j < con.length; j += 1) {
      if (seSolapan(con[i].rango[prefijo], con[j].rango[prefijo])) {
        out.push({ a: con[i].nombre, b: con[j].nombre,
          rangoA: con[i].rango[prefijo], rangoB: con[j].rango[prefijo] });
      }
    }
  }
  return out;
}
```

## La acción

```
tracker asignar PT --slug lo-que-sea      asigna y escribe
tracker asignar PT --slug lo-que-sea --ver   dice cuál sería, sin escribir
```

```
  PT-066 · lo-que-sea
  del rango de Alberto Martínez: PT [1-999] · 65 usados
```

Y sin rangos declarados:

```
  PT-066 · lo-que-sea
  sin rangos declarados: del contador global, como siempre
```

Es lo único que **escribe** un identificador. Hasta hoy lo hacía quien editaba el archivo a mano
—`PHASE 2` lo midió— y por eso `SUITE-R08` era una afirmación sin nadie que la ejecutara.

## Las dos comprobaciones en `verify-fdge`

```
SUITE-R08   dos rangos que se SOLAPAN                        →  FALLA
SUITE-R08   una allocation fuera del rango de todos          →  FALLA
```

La segunda es la que cubre el riesgo que la acción **no puede** impedir: alguien asigna a mano y se
salta su rango. Así se ve en la siguiente verificación, que es antes de cualquier compuerta.

**Las dos solo se comprueban si hay rangos declarados.** Sin ellos no hay nada que comprobar, y
exigirlos sería imponer trabajo a un proyecto de una persona.

## `tracker personas` enseña los rangos

```
  Alberto Martínez     PT [1-999] · 65 usados · siguiente 66
```

Repartir el espacio es una decisión de equipo; la herramienta pone los datos delante y no decide.

## Lo que NO se construye

| Qué | Por qué |
|:---|:---|
| Namespacear el ID (`PT-alberto-001`) | Decisión 2 · `LEX-R04` los declara permanentes |
| Un contador por persona | Segundo sitio para el mismo hecho · se **deriva** |
| Renumerar lo ya asignado | `LEX-R04` |
| Repartir rangos automáticamente | Es una decisión de equipo |
| Un servicio central | El registro es un archivo · asignar sin red es la razón de `SUITE-R08` |
| Resolver el conflicto de merge | Los rangos hacen que no lo haya **por el identificador** |
