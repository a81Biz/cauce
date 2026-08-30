# `PT-195` · `test-scenarios.md`

## `TS-01` — una identidad no declarada **se dice**, y donde se mira   → `AC-01`

```
DADO   un repositorio cuyo «personas» declara a alguien
Y      la identidad git configurada NO es ninguna de las suyas
CUANDO corre verify-fdge
ENTONCES lo dice, nombrando la identidad con su valor
```

Lo que se compra no es que **exista** el dato —`tracker personas` ya lo daba— sino que lo emita
**quien corre en `npm run verify` y en CI**.

## `TS-02` — y una declarada **también se dice**, con su nombre   → `AC-01`

```
DADO   el mismo repositorio y una identidad SÍ declarada
CUANDO corre verify-fdge
ENTONCES dice a quién se atribuirá el commit siguiente
```

**No es simetría decorativa.** Una comprobación que sólo habla cuando algo va mal es
indistinguible de una que no corrió — `CE-005`, el nombre de este lote. Y sin `TS-02`, `TS-01` lo
cumple un verificador que se queje **siempre**.

## `TS-03` — sin `personas` no se finge que se miró   → `AC-01`

```
DADO   un repositorio sin «personas» declaradas
CUANDO corre verify-fdge
ENTONCES dice que no hay contra qué contrastar
```

`SUITE-R22` declara soportado el proyecto de una sola persona. Uno que aún no declaró `personas` no
puede salir igual que uno cuya identidad **es de nadie**.

## `TS-04` — el aviso llega **antes** de commitear   → `AC-02`

```
DADO   la comprobación
CUANDO se mira desde dónde se emite
ENTONCES sale de verify-fdge, que corre en «npm run verify» — antes del commit
```

## `TS-05` — no bloquea, ni en CI ni fuera   → `AC-03`

```
DADO   una identidad NO declarada, como la del runner de CI
CUANDO corre verify-fdge
ENTONCES el veredicto sigue siendo «sin errores»
```

**Es el que impide arreglarlo en la dirección peligrosa.** Un error aquí dejaría `verificacion.yml`
en rojo permanente, y una compuerta siempre roja enseña a saltársela.

## Lo que NO se cubre, y consta   `SUITE-R26`

- **Los commits pasados no se rejuzgan.** Los 10 de `T <t@t>` —tres de `EP-025`— se quedan; los
  cuenta `tracker personas` y `SUITE-R09` no reescribe.
- **No se detecta CI**, ni hace falta: un aviso no bloquea en ningún sitio.
- **No se promete que quien commitee sea quien dice ser** (`SUITE-R27`).
- **La identidad se planta por entorno** (`GIT_CONFIG_COUNT`, el mecanismo de `PT-067`): ningún
  caso toca la configuración de la máquina. El defecto que originó esta tarea fue exactamente eso.
