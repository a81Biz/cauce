# `PT-120` — Autorrevisión   `PHASE 6`

## Qué estaba mal

La compuerta que autoriza **lo único irreversible del marco** no comprobaba lo que decía.

```
publicar.yml corría OCHO comprobaciones y ninguna era «sellar»
    y llamarlo no habría servido: «sellar» salía con código 0 SIEMPRE
    era un informe con forma de compuerta
```

La `12.0.0` salió a npm con dos reglas fuera de su guía de migración. No porque nadie mirara:
**porque lo que miraba no podía impedir nada**.

Y `verify-fdge --all` corría **sin `GH_TOKEN`** en los dos workflows. En la corrida `32600060157`
emitió **108 avisos `SUITE-R43 … SIN EVALUAR` sobre 108 PT** y cerró con *«Sin errores. PTs
verificados: 108»*. `FDGE-R34` llama a ese verde **precondición de `G4`**.

No se afirma que con token hubiera fallado. Se afirma que `SUITE-R43` **nunca se ha evaluado en
CI**, en ninguna corrida, desde que existe.

## Cuatro instancias de la misma avería, y dos las escribí yo

| | |
|:---|:---|
| 1 | `publicar.yml` corría ocho comprobaciones sin llamar a `sellar` |
| 2 | `sellar` salía con código `0` siempre |
| 3 | **mi `--gate`** imprimía *«No se publica»* y salía con `0` |
| 4 | **mi `--gate`** bloqueaba por no poder hablar con GitHub |

Las cuatro son **algo que parece una compuerta y no lo es**. Las dos últimas las escribí con el
defecto delante, mientras lo arreglaba.

**La tercera:** `process.exitCode = 1` funciona salvo si algo hace `process.exit(0)` después — y
la última línea del despachador lo hace, incondicional, **190 líneas más abajo y en otra
función**. Leyendo mi bloque no se ve. El arreglo no fue añadir nada: fue **lanzar**, que es la
vía que la herramienta ya tenía. Un segundo mecanismo de salida habría sido un hecho con dos
nombres (`LEX-R22`) y habría tenido el mismo problema.

**La cuarta:** `--gate` llamaba a `cerrarPasada()`, que sincroniza con la plataforma. En un
repositorio sin acceso —el fixture, o cualquier proyecto que `SUITE-R22` declara soportado— eso
lanza y la compuerta bloquea **porque no hubo red**. Convertir «no lo sé» en «no pasas» es tan
falso como convertirlo en verde (`RULE-06`), y una compuerta que falla por motivos ajenos se
acaba desactivando.

Ninguna de las cuatro se vio leyendo. Se vieron **ejecutando y mirando el código de salida**.

## Qué bloquea `--gate`, y qué deliberadamente no

Bloquea sólo lo **mecánico y evaluable ahí**: la guía de migración (`SUITE-R19`), los documentos
de entrada de `SELLO.md` (`FND-R22`) y las cifras del inventario (`FND-R14`).

**No** bloquea por el grafo: `graphify-out/` está en `.gitignore` y en CI sale `MISSING`. **No**
exige los pasos humanos: `SUITE-R06a` los reserva a una persona y una compuerta no puede pedir lo
que sólo una persona puede hacer.

## `AC-03` no convierte `SIN EVALUAR` en error, y es deliberado

`SIN EVALUAR` **no aprueba ni bloquea**. Hacerlo fallar dejaría sin salida a todo proyecto sin
plataforma, que `SUITE-R22` declara soportado. Lo que se arregla es que el resumen **no pueda
callarlo**: la cifra se **deriva** de los avisos emitidos, no se cuenta a mano.

## `AC-04` decae, y su historia importa

`AC-04` decía que `sellar` imprime `tag anterior v12.0.0` *«y ese tag no existe»*. **Existe**, y
`v10.0.0` y `v11.0.0` también. El error original fue mío —ordenar tags por texto— y lo corregí en
tres documentos; **aquí sobrevivió**.

Al venir a arreglarlo escribí `R-1`, que diagnostica mal la causa: **acusé al código del error que
había cometido yo**, sin abrir la función. `R-2` existe porque sí la abrí, dos pasos después.
`sellar` usa `--sort=-v:refname` y **siempre hizo lo que `AC-04` pedía**.

La diferencia entre `R-1` y `R-2` no es cuidado: es haber ejecutado un comando y haber leído
cuatro líneas.

## Lo que esta tarea no cierra

- **Nada comprueba que una corrección alcanzada en tres documentos no siga viva en un cuarto.**
  No lo cubre ningún `AC` de esta tarea y se declara como hueco.
- **Que la guía de migración *sirva*.** Nombrar la regla es el mínimo comprobable; que la
  instrucción sea útil lo lee una persona (`SUITE-R26`).
