# Autorrevisión — `PT-140`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

Cuando falta `refs/heads/cauce/<usuario>`, `proyectar` deja de empezar de cero en silencio:

```
esta en origin      se NIEGA y describe el comando para traerla
no esta en ninguna  la crea, y DICE que es la primera vez
no se pudo mirar    tampoco escribe: no saber no es permiso
```

## Cómo apareció, y es la parte que importa

**Lo cometí yo**, el 2026-08-24, dejando una sola rama local a petición del firmante. El comando
dijo *«26 allocation(es), 2 archivo(s)»* — idéntico al caso bueno — habiendo arrancado un linaje
nuevo.

**No se perdió nada porque el `push` habría sido rechazado por no ser fast-forward.** Protegido
**por accidente, no por diseño**: con ese rechazo sin explicación, la lectura obvia —«la rama está
rara, la fuerzo»— sí destruye. Y `--publicar` lleva el `push` dentro.

Es `CE-005`, verde por no haber mirado. Y `CE-005` es una de las seis clases **sin regla que la
reclame**: ésta es su primera instancia cerrada con mecanismo.

## La mitad que ya existía

`SUITE-R31` tenía el criterio correcto para el caso hermano —un commit sin la marca
`cauce:proyeccion` **se reporta y no se borra**, porque decidir qué hacer con el trabajo de alguien
es humano—. Faltaba la simétrica, y ahora la regla las tiene las dos:

> un commit sin marca se **reporta** y no se borra · una rama que falta se **dice** y no se rehace

## `null` no es `false`, y es la mitad del diseño

`git ls-remote` puede fallar por red, por credenciales o porque no hay remoto. Tratar ese `null`
como «no existe» convertiría un fallo de acceso en **permiso para descartar historia**. Es
`RULE-06`.

## Por qué no trae la rama sola

Un `fetch` implícito dentro de un comando que **escribe** es exactamente el efecto colateral que
este marco evita. `EXEC-R07`: lo que no se automatiza se **describe**, y aquí el comando cabe en
una línea.

## El fixture lleva su propio remoto

Un `--bare` local. Un arnés que necesita la red no es un arnés: daría rojo el día que GitHub esté
lento, y ese rojo no diría nada del marco. `PT-126` lo pagó con la batería colgada tres minutos.

## `AC-04` no tiene caso, y se dice por qué

Forzar el fallo de `git ls-remote` sin tocar la red exigiría un remoto que **exista y falle a la
vez**. Lo que se establece es que el **código distingue** los tres estados; la rama está en la
evidencia. Escribir un caso que fingiera provocarlo sería peor que declarar el límite.

## Lo que esta tarea NO establece

- **Que ninguna otra acción asuma que una rama local existe.** Si las hay es un hallazgo aparte.
- **Que una rama divergente se pueda reconciliar.** Eso es reescritura de historia: `SUITE-R06f`.

## Estado

| | |
|:---|:---|
| Escenarios | 6 de 6 |
| Reproducción del caso real | sí — el fixture repite exactamente lo que ocurrió |
| Orphan Criterion | ninguno |
