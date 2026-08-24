# `PT-114` — Estrategia   `PHASE 3`

## Los tres caminos

```
A  republicar SIEMPRE, en cada corrida del espejo
B  que «abrir --aplicar» corra solo tras un push (hook de git)
C  DETECTAR y decirlo, con el comando que lo arregla     <- ELEGIDO
```

### `A` — republicar siempre

**Descartado.** El espejo es una comprobación de **lectura**: `tracker espejo` corre en CI y en
`npm run verify`. Escribir en la plataforma desde una comprobación mezcla informar con actuar, y
convierte cada corrida de CI en trece llamadas de escritura.

### `B` — un hook de git tras el push

**Descartado.** `SUITE-R06` no automatiza actos contra la plataforma sin decisión, y un hook local
se desactiva sin que nadie lo note — la misma razón por la que `PT-117` declara el hook `Stop`
como **segunda red** y no como mecanismo.

### `C` — detectar y decirlo — **ELEGIDO**

El comando que repara **ya existe** (`abrir --aplicar`). Lo que falta es que algo lo **eche de
menos**, que es literalmente el enunciado de la clase que este lote persigue.

Se detecta en el espejo, que ya corre con credencial en los dos workflows, y **bloquea**: un
cuerpo ilegible impide firmar, y sin firma no hay `G1`.

## El predicado, y su tercer desenlace

```
cuerpo publica «sin enlace»  Y  hay ref durable   ->  DIVERGENCIA, se dice el comando
cuerpo publica «sin enlace»  Y  NO hay ref durable ->  correcto (PT-096), no se toca
no se puede leer el cuerpo, o no se sabe si hay ref ->  SIN EVALUAR (RULE-06)
```

**El tercero es el que importa**: sin él, un runner sin acceso produciría el mismo informe que un
tablero perfecto — que es exactamente lo que `publicar.yml` hace hoy con `SUITE-R43`.

## Lo que NO se hace

- **No se repara desde el espejo.** Informar y actuar son cosas distintas, y `abrir --aplicar` ya
  actúa. Lo que faltaba era que alguien lo exigiera.
- **No se cambia la decisión de `PT-096`.** Sin ref durable se sigue publicando la ruta sin enlace
  y diciendo por qué.
