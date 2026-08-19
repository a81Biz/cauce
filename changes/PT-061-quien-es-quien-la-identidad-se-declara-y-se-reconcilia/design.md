# PT-061 — Diseño   `PHASE 4`

## El esquema

```json
"personas": [
  { "nombre": "Alberto Martínez",
    "git": [
      { "nombre": "Alberto Martínez", "correo": "alberto@a81.biz" },
      { "nombre": "a81Biz",           "correo": "albe.mtz@gmail.com" }
    ] }
]
```

`nombre` es el **canónico**: de él sale la rama (`PT-054`) y con él se firma. `git` son los pares
`(nombre, correo)` que la persona ha usado. **Nada se deriva de nada**: los dos campos los escribe
quien sabe la respuesta, y por eso `LEX-R26` no aplica — esto no es un checkpoint, es una
declaración, como `firmantes:`.

## Las funciones puras

```js
/**
 * ¿De quien es este autor de git? Devuelve la PERSONA declarada, o null CON MOTIVO.
 *
 * NO adivina por parecido. Mismo apellido o mismo dominio de correo convertiria una duda en un
 * dato, y las cuatro tareas siguientes de EP-016 construirian sobre el sin que sus casos lo
 * notaran: cada una comprobaria correctamente sobre una identidad falsa.
 *
 * El par (nombre, correo) casa ENTERO. Solo el correo no basta: dos personas pueden compartir un
 * buzon de equipo. Solo el nombre tampoco: «a81Biz» no se parece a nada.
 */
export function personaDe(autor, personas = []) {
  if (!autor?.correo && !autor?.nombre) {
    return { persona: null, motivo: 'el commit no declara autor' };
  }
  for (const p of personas) {
    for (const id of p.git ?? []) {
      if (id.correo === autor.correo && id.nombre === autor.nombre) {
        return { persona: p.nombre, motivo: null };
      }
    }
  }
  return { persona: null,
    motivo: `«${autor.nombre} <${autor.correo}>» no esta declarado en «personas». `
      + 'Si es de alguien ya declarado, anadelo a su lista «git»: no se adivina por parecido.' };
}

/** El nombre canonico de quien usa esta maquina, si esta declarado. */
export function personaLocal(configNombre, configCorreo, personas = []) {
  return personaDe({ nombre: configNombre, correo: configCorreo }, personas);
}
```

## La acción

```
tracker personas
```

```
  Alberto Martínez
    Alberto Martínez <alberto@a81.biz>        218 commits
    a81Biz <albe.mtz@gmail.com>                 9 commits

  SIN DECLARAR (1 autor · 1 commit)
    Alberto Martínez <albe.mtz@gmail.com>       1 commit
    → si es de una persona ya declarada, anadelo a su lista «git».
      No se agrupa por parecido: quien es quien lo dice una persona.

  Sin «personas» declaradas el marco funciona como hoy — y con una sola persona
  no hace falta declarar nada.
```

Los no declarados salen **siempre**, no bajo una bandera: el riesgo es que la tabla se quede vieja
en silencio, y esconderlo detrás de una opción es garantizar que nadie lo mire.

## `ramaDe` pasa por la tabla

```js
// PT-054 leia `git config user.name` a pelo. Desde la maquina que produjo los 9 commits de
// «a81Biz» habria escrito «cauce/a81biz»: OTRA rama, para la MISMA persona, sin que nada lo
// notara. Ahora resuelve la persona y usa su nombre canonico.
//
// Sin `personas` declaradas se comporta EXACTAMENTE como hoy: un proyecto de una persona no
// tiene que declarar nada (AC-05 · compatibilidad).
const usuario = personaLocal(gitDe(['config','user.name']), gitDe(['config','user.email']), PERSONAS)
  .persona ?? gitDe(['config', 'user.name']);
```

## La comprobación de `AC-04`, y su dirección

En `verify-suite`: **todo firmante de `CLAUDE.md` existe como persona**. En esa dirección y no en
la contraria.

```
firmante sin persona   →  FALLA · alguien que puede firmar y el marco no sabe quién es
persona sin firmar     →  bien   · tener identidad no es poder firmar
```

La asimetría es deliberada. Si la comprobación fuera en las dos direcciones, las dos listas serían
**copias del mismo hecho** y divergirían — que es exactamente lo que le pasó a las reglas en la v3
y lo que este marco existe para no repetir.

## Lo que NO se construye

| Qué | Por qué |
|:---|:---|
| Agrupar autores por parecido | `AC-03` · convertiría una duda en un dato |
| Reescribir la historia para unificar autores | `SUITE-R06f` · y la tabla lo resuelve sin tocar nada |
| Permisos: quién puede hacer qué | `out-of-scope` · esto dice quién **es** |
| Usar la identidad para el coste o la sesión | `PT-064` · `PT-065` |
| Generar `personas` automáticamente al instalar | Un dato inventado en la instalación es peor que ninguno |
