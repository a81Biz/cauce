# `PT-116` — Estrategia   `PHASE 3`

## La firma

```
tracker parada PT-NNN --motivo <clase> --texto <ruta> --desenlace <clase> [--abre PT-NNN|EP-NNN]
```

**`--texto` es una RUTA, no el texto.** `SUITE-R59`, y cinco roturas de escapado en esta sesión lo
respaldan. Pasar el contenido por la línea de comandos es el defecto, no una comodidad menor.

## Las tres decisiones

### 1 · El cuerpo se construye con una función **pura**

En `patrones.mjs`, como `mensajeDeCierre` y `cuerpoDeIssue`. Motivo declarado por `PT-009`:

> *«Es una función y no una plantilla en línea para que un caso pueda comprobarlo sin hablar con
> la plataforma — el defecto existía justo porque nadie comprobaba lo que se escribía.»*

Y lleva una condición que hay que **probar**: **no puede casar `RE_NOTA`** (`LEX-R30`).

### 2 · Las listas se comparan con `LEXICON`, no sólo se declaran

`MOTIVOS_DE_PARADA` y `DESENLACES_DE_PARADA` viven en `patrones.mjs` **y `verify-suite` las
compara con `LEXICON` §8.5**. Es exactamente lo que `PT-124` acaba de construir para
`TIPOS_DE_ITEM`, y por la misma razón: sin comparación, una constante única sigue siendo una
copia — sólo que una.

### 3 · El destino se reusa, no se reescribe

Issue si hay plataforma, `TRANSICIONES.log` si no. **El mismo código que `avanzar`**, extraído a
un ayudante que los dos usan. Escribir una segunda forma sería `SUITE-R38`.

## Y el desenlace `abre`

Cuando `--desenlace abre`, `--abre` es **obligatorio** y la allocation citada **tiene que existir**.
Sin eso, «abre trabajo» sería una afirmación sin contraste — y es justo el enlace que `PT-117`
necesita para exigir que toda allocation nueva cite su parada.

## Lo que NO se hace

- **No se exige la parada.** Es `PT-117`. Este comando da el **medio**.
- **No se inventa destino.** El que ya existe.
- **No se publica la conversación literal.** La nota es la explicación, no el transcript.
- **No se edita ni borra una parada publicada.** Append-only (`SUITE-R09`).

## El riesgo declarado

**Un comando que existe y nadie invoca no cambia nada.** Es literalmente la clase que este lote
persigue, y siete tareas de este mismo lote lo demuestran: la herramienta existía en las siete.

Por eso `PT-116` **no cierra el problema** — lo cierra `PT-117`, y las dos van seguidas. Decirlo
aquí evita que alguien lea esta tarea como suficiente.
