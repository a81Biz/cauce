# PT-043 — Diseño   `PHASE 4`

## El conductor

Un bloque al final de `migrate.mjs`, después del informe y de la verificación posterior, que solo
existe si hay decisiones pendientes:

```js
if (manual.length) {
  '-- que te toca decidir, y por que es tuyo --'
  `Son ${manual.length}. No es burocracia: …`
  for (const m of manual) {
    `  ${i}/${n} · ${resumen(m)}`     // el titular
    `        ${PORQUE(m)}`            // qué decides y por qué es tuyo
  }
  'Ninguna depende de otra… vuelve a ejecutar esto y te dirá cuáles quedan.'
  'Mientras queden pendientes, el proyecto sigue en modo restringido (SUITE-R17)…'
}
```

**Va después de la verificación** y no antes: lo último que se lee en una terminal es lo que se
recuerda, y lo que hay que recordar es lo que falta por decidir.

## `PORQUE` — se reconoce, no se adivina

```js
if (/llega nuevo/)          herramientas nuevas
if (/ESTADO/)               qué compuerta esperas y a quién
if (/phase/)                en qué fase está cada trabajo vivo
if (/secreto|SECRETOS/i)    falso positivo lo sabe quien conoce el dato
if (/plataforma de trabajo/) decisión de equipo, no técnica
if (/CLAUDE|suite_version/) el archivo que parametriza tu proyecto
return                      'No se reconoce el motivo… (RULE-06)'
```

El `return` final **no es un hueco**: es la tercera salida que `RULE-06` exige. Y es lo que hizo
visible `D1` — una fila cuyo motivo nadie sabe decir suele ser una fila que no debería existir.

## Las dos correcciones

**`D1` · fundir el rider del bloque `ESTADO`.** `migrate.mjs:211-218` son dos `need()`; el segundo
es una advertencia sobre el primero. Pasa a ser la última frase del primero:

```
antes   need('escribir el bloque ESTADO … Sin él, verify-fdge falla.')
        need('escribirlo AL CERRAR CADA FASE, no al terminar la sesión: …')
después need('escribir el bloque ESTADO … Sin él, verify-fdge falla. Y se escribe AL CERRAR
             CADA FASE, no al terminar la sesión: … SUITE-R34 lo comprueba contra git.')
```

Seis decisiones donde había siete, y ninguna se pierde.

**`D2` · cortar por palabra.** `resumen()` corta al último espacio antes del límite y lo marca:

```js
const resumen = (m) => {
  const t = String(m).trim();
  const j = t.search(/\.\s/);
  const s = j > 0 ? t.slice(0, j) : t;          // primera frase, si la hay
  if (s.length <= 96) return s;
  const c = s.lastIndexOf(' ', 96);             // último espacio antes del límite
  return `${s.slice(0, c > 40 ? c : 96)}…`;     // y se marca que hay más
};
```

`c > 40` protege el caso patológico —un texto de 96 caracteres sin un solo espacio— donde
`lastIndexOf` devolvería `-1` o un corte absurdamente corto. Ahí se cae al corte duro, que es
feo pero no pierde el titular.

## Lo que este diseño **no** hace

No decide ninguna de las seis, no propone valores por defecto y no toca `SUITE-R17`. Migrar sin
resolverlas sigue siendo imposible: `migration_pending` se escribe en el `REGISTRY` y el código de
salida sigue siendo `1`.
