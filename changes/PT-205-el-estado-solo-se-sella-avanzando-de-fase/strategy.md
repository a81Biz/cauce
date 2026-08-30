# `PT-205` · `strategy.md`

## La decisión

**Un aviso que mira el árbol de trabajo y dice qué romperá en CI, con el comando exacto para
evitarlo.** No una regla nueva: una **predicción** de las que ya existen.

```
$ npm run verify

  ! PENDIENTE AL EMPUJAR (3) — esto pasará en CI si empujas ahora:
      SUITE-R34   changes/ está sucio y HANDOFF.md no. Al commitear, el estado quedará atrás.
                  → commitea el HANDOFF EL ÚLTIMO, en su propio commit
      SUITE-R51   PT-204 #377, PT-205 #378: su cuerpo no enlaza y su intake ya está en el árbol.
                  → tras «git push»:  tracker abrir --aplicar
      FDGE-R55    PT-204: hay paradas/PT-204.md y su allocation no declara «origen_parada».
                  → tracker parada EP-026 --motivo hallazgo --texto … --desenlace abre --abre PT-204
```

## Por qué predicción y no compuerta

**Estas tres cosas no son incumplimientos todavía.** `changes/` sucio es trabajo en curso;
`MUDO_SIN_REF_DURABLE` es un estado legítimo mientras el ref no existe. Hacerlas fallar **hoy**
sería bloquear el trabajo normal — y eso es lo que `decisionDeEnlace` ya evita a propósito con su
freno.

Lo que falta no es severidad: es que **el momento en que dejan de ser legítimas** —el `push`— no
llegue por sorpresa. Un aviso que dice *«esto pasará»* con su comando cierra el hueco sin tocar
ninguna regla.

## De dónde sale cada predicción, y ninguna adivina

| | Se deriva de | Lo que pasará |
|:---|:---|:---|
| `SUITE-R34` | `git status --porcelain` sobre `changes/` y `HANDOFF.md` | Al commitear, `changes/` queda más nuevo |
| `SUITE-R51` | El intake **existe en el árbol** + el cuerpo del issue no enlaza | Al empujar, el ref se vuelve durable → `REPARAR_MUDO` |
| `FDGE-R55` | Existe `paradas/PT-NNN.md` + la allocation no declara `origen_parada` | El verificador lo reclamará |

Las tres se leen de lo que ya está delante. **`SUITE-R51` es la única que consulta la plataforma**,
y ya lo hace hoy: `compararEspejo` recibe los issues. Si no hay red, **se dice** —`SUITE-R22`
declara soportado el proyecto sin ella— y no se da por cuadrado, que es la lección de `PT-187`.

## Y el comando va en el aviso, no en un documento

`RULE-07` ya lo pide: un mensaje dice **cómo se arregla**. Aquí es lo único que separa un viaje de
CI de cinco segundos:

```
tras «git push»:  tracker abrir --aplicar
```

El mensaje de `FDGE-R55` **ya lo hace** —da el comando exacto— y por eso es el modelo. Lo que le
falta no es texto: es **llegar antes**.

## Lo que se descarta

| | Por qué no |
|:---|:---|
| Hook de `pre-commit` / `pre-push` | No corre en CI, se salta con `--no-verify`, hay que instalarlo. `SUITE-R06` no automatiza lo que el marco no controla |
| Que `abrir` republique solo tras el push | No hay nada que se entere del push. Y automatizar una escritura en la plataforma sin que nadie la pida es lo contrario de este marco |
| Hacer fallar `changes/` sucio | Bloquea el trabajo en curso: escribir el `discovery` de la tarea siguiente es trabajo legítimo |
| Quitar `SUITE-R34` o relajar su medida | Su rojo fue **verdad** las cuatro veces |

## `AC-04`: lo que quede como rodeo, escrito donde se ejecuta

`PT-196` demostró que **declarar el rodeo con su motivo** es a veces la respuesta correcta —el
doble viaje por `G4` no se quitó, se escribió—. Aquí pasa igual con la republicación: si la
conclusión es que `abrir` **debe** correr dos veces, eso se escribe en `PHASES.md` junto al acto,
no se descubre.

## Alcance, y su límite declarado   `SUITE-R26`

**Dentro:** predecir en `npm run verify` las tres roturas medidas, con su comando.

**Fuera, y consta:**
- **No se predice lo que de verdad no se puede saber en local.** Ése es el límite de `PT-201` y
  sigue en pie.
- **No se toca ninguna de las tres reglas.** Las tres son correctas.
- **No se promete cubrir toda rotura futura de esta clase.** Se cubren las **tres medidas**, y el
  mecanismo queda para que la cuarta se añada — no se declara completo lo que no se ha barrido.

## El riesgo, y cómo se acota

El riesgo es **un aviso más que se pierde entre los demás**, y con él el arreglo entero. Por eso el
bloque va **separado y con título propio** —«PENDIENTE AL EMPUJAR»—, y por eso hace falta el caso
que prueba que **cuando no hay nada pendiente, el bloque no aparece**: un aviso que sale siempre es
ruido, y el ruido no se lee.
