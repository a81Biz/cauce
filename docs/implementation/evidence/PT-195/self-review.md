# `PT-195` · self-review

## Lo que se sostiene

- **`AC` verificados: 3, ninguno huérfano.** Seis casos sobre cinco escenarios.
- **No se escribe ningún patrón nuevo.** `personaLocal` ya existía en `patrones.mjs` —*«el nombre
  canónico de quien usa esta máquina, si está declarado»*— y **ninguna compuerta la invocaba**.
  Eso es `CE-007` en su forma pura, y el arreglo es invocarla, no reescribirla.
- **Lo que cambia no es la severidad: es quién lo emite.** Pasa de `tracker personas` —que hay que
  invocar a mano y nadie invoca— a `verify-fdge`, que corre en `npm run verify` **y** en CI.
- **La consecuencia era real y está medida.** La config **local** de este repositorio fue la del
  arnés de pruebas, y firmó **tres commits de `EP-025`** como `T <t@t>`. `SUITE-R27` dice que lo
  que hace contrastable una firma es que el nombre esté en la lista: un commit atribuido a
  `T <t@t>` no es contrastable contra nada.

## El verde nombra a la persona, y eso no es adorno

```
✓ SUITE-R27  El commit siguiente se atribuira a «Alberto Martínez» · «Alberto Martínez <alberto@a81.biz>».
```

Una comprobación que **sólo habla cuando algo va mal es indistinguible de una que no corrió** —
`CE-005`, que es el nombre de este lote. Quien lo lea ve el nombre y sabe si es el suyo. Sin el
caso que lo fija, `AC-01` lo cumple un verificador que se queje siempre.

## Tres estados, no dos   `RULE-02`

```
SIN «personas»    no hay contra qué contrastar — y NO es lo mismo que estar averiado
NO DECLARADA      se nombra, con su valor y con el comando
DECLARADA         se dice a quién se atribuirá el commit siguiente
```

El primero importa: `SUITE-R22` declara soportado el proyecto de una sola persona, y uno que aún
no declaró `personas` no puede salir igual que uno cuya identidad **es de nadie**.

## `AC-03` decide la forma, y no es conveniencia

En CI la identidad es la del **runner** y no casa con `personas` — está documentado en
`selftest.sh:6549`, y `PT-068` se niega a atribuir la sesión de otro **a propósito**. Un error
dejaría `verificacion.yml` en rojo permanente el día que se pusiera, y una compuerta siempre roja
enseña a saltársela.

**Y no se detecta CI.** Sería inventar una dependencia de entorno que este marco no tiene, para
una distinción que un aviso ya resuelve en los dos sitios (`RULE-06`).

## Dos correcciones a mis propios casos

1. **Medía el código de salida.** `exit=0` sobre un fixture que puede fallar por **otras** reglas
   mide el árbol entero y se lo atribuye a esto — el proxy en vez del hecho (`CE-001`). La
   afirmación precisa es que **esta comprobación no emite nunca un error**, y su pareja: que aun
   así **la dice**, como aviso.
2. **El `grep` cogía otro `SUITE-R27`.** La regla tiene más de un emisor —la lista `firmantes` de
   `CLAUDE.md`— y `tail -1` devolvía el que no era. Acotado a los mensajes de esta comprobación.

## La identidad se planta por entorno, y eso importa aquí

`GIT_CONFIG_COUNT` —el mecanismo de `PT-067`— **no toca ninguna configuración de la máquina**. Que
el arnés escribiera en la config real fue exactamente el origen de esta tarea; repetirlo aquí sería
escribir el defecto dentro de su arreglo.

## Lo que NO se hace, y consta   `SUITE-R26`

- **Los 10 commits de `T <t@t>` no se reescriben** (`SUITE-R06f`, y están publicados). Tres son de
  `EP-025`. `tracker personas` los seguirá contando, que es lo correcto.
- **`T <t@t>` no se declara en `personas`**: sería atribuir a una persona los commits del fixture —
  el error contrario, y peor.
- **No se promete que quien commitee sea quien dice ser.** `SUITE-R27` ya declara que el marco no
  puede garantizarlo. Se promete que la identidad configurada **corresponda a alguien declarado**.
- **No se agrupan autores por parecido** (`LEXICON 6.5f`): quién es quién lo dice una persona.

## Sin bloqueadores
