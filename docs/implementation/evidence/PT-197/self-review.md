# `PT-197` · self-review

## Lo que se sostiene

- **`AC` verificados: 3, ninguno huérfano.** Catorce casos sobre cinco escenarios.
- **El componente se dio de alta sin tocar herramienta**, que era la precondición técnica que
  `PT-149` dejó probada. Tres documentos: `LEXICON` (nombre y trigger), `RULES` (`DICT-R01`…`R03`)
  y `CASOS-DE-USO` (`D1`, con **qué lo hace válido**).
- **El Dictamen existe**: `docs/implementation/DICTAMEN.md`, 167 líneas, tres secciones, con
  veredicto de los **cuatro** productos declarados.

## La decisión que faltaba, y por qué no la tomé yo

El intake declaraba: *«no sabe todavía qué hace válido un Dictamen»*. `FND-R24` dice por qué — el
agente puede describir lo que un producto entrega, pero **si eso vale lo sabe quien conoce el
negocio**. Un `VoBo` autoriza a actuar; **no transfiere un conocimiento**.

Se preguntó con las cuatro lecturas y su coste delante, y la respuesta fue **«las tres, y el orden
importa»**. Eso es lo que define el componente, y sin ello `PTSA` no tendría contra qué auditarlo.

## El orden es criterio, no presentación — y tiene su caso

«Las tres secciones» se cumple con las tres **en cualquier orden**. Y la decisión primero es el
defecto típico de un entregable ejecutivo: **una recomendación buscando datos que la sostengan**.
Por eso `DICT-R03` dice *«va DESPUÉS»* y hay dos casos: uno que fija que las tres están, y su
pareja que fija que **la 3 es la última**.

## Por qué se produjo leyendo y no generando

**Porque todavía no se sabe qué se automatiza.** Escribir el generador antes de haber hecho uno
sería decidir la forma sin el dato — y este lote lleva diecisiete tareas demostrando qué pasa
entonces.

Y hay una razón de fondo: **la `§3` es un juicio**. Un generador produciría las dos primeras y
dejaría la tercera en blanco — que es exactamente el documento que `FND-R24` dice que el agente no
puede escribir solo.

## Lo que el Dictamen dice de este repositorio, y no es cómodo

`§1` da **cuatro veredictos**: `P-001` y `P-002` cumplen; `P-003` **cumple parcialmente** —142 de
247 reglas ejecutadas, 126 sin juzgar—; `P-004` cumple **con una divergencia declarada** —npm va
tres versiones por detrás—.

`§2` nombra **44 afirmaciones declaradas sin cubrir**, **126 reglas sin juzgar**, **26 firmas
certificadas** y **tres lotes abiertos sin admitir**.

`§3` concluye: **el marco normativo y el procedimiento están terminados y probados; la verificación
mecánica está a poco más de la mitad y nadie ha decidido cuánto de lo que falta es posible.**

**Un Dictamen que sólo contara lo entregado sería propaganda**, y `DICT-R02` existe exactamente
para impedirlo.

## `audit` me obligó a hacerlo bien, y es la mejor parte de esta tarea

Declaré las tres reglas y el trigger, y la auditoría **bloqueó con cuatro huecos**:

```
✗ DICT-R01 (HARD)      no llega a CORE.md
✗ DICT-R02 (HARD)      no la cita ningún documento operativo · no llega a CORE.md
✗ DICT-R03 (HARD)      no llega a CORE.md
✗ [START DICTAMEN]     ausente en: CORE.md, PHASES.md
```

**`CORE.md` es lo único que el agente carga** (`SUITE-R15`). Tres reglas `HARD` que no llegan ahí
son tres reglas que **nadie ejecutará** — que es exactamente lo que `PT-204` acaba de medir a
escala del marco entero, cometido por mí al declararlas.

Y al arreglarlo apareció un quinto: metí el procedimiento **dentro de la sección de `FDGE`**, y
`SUITE-R20` se lo imputaba a ese componente —*«`PHASES.md` cita 4 reglas que `FDGE-Prompts.md` no
menciona: el humano en modo `MANUAL` no las vería»*—. **El Dictamen es otro componente y necesita
su propia sección.**

Lo que faltaba en los cinco casos era lo mismo: **declarar no es suficiente si lo declarado no
llega a donde se ejecuta.**

## Dos suposiciones mías que el marco corrigió

1. **«Un `*-Prompts.md` de tres líneas nadie lo abriría».** Era una suposición, y `LEX-R15` dice lo
   contrario. Se resolvió dándole **sección propia en `PHASES.md`**, que es donde vive el
   procedimiento de los demás componentes.
2. **«El Dictamen no tiene fases porque no es un ciclo».** Declaré `fases: null` y a la vez tres
   secciones en `LEXICON`: **el mismo hecho con dos nombres** (`CE-008`). Alineado a `[1, 3]`, con
   la aclaración de que las tres se ejecutan **en una pasada** y la compuerta va al final.

## La poda que el séptimo componente obliga   `SUITE-R61`

Añadir un componente cambió **por diseño** el hecho que cuatro casos fijaban. La cuenta por patrón,
que `SUITE-R61` obliga a publicar aunque sea cero:

| Patrón | Cuántos | Cuáles |
|:---|---:|:---|
| **superado** — el hecho cambió por diseño | 4 | `la auditoria de fases cubre los SEIS` · `…y el arnes lo dice contando` · `…y lo dice contando, no de pasada` · el fixture de `PT-149` |
| **invertido** | 0 | — |
| **hueco** | 0 | — |

**Ninguno se retira: los cuatro se repuntan.** Tres fijaban `(6 de 6)` o `(7 de 7)` —**el número de
lo correcto**, `HANDOFF -18`— y lo que siempre quisieron decir es que **la anchura cubre a todos**:
ahora comparan los dos números **sin fijar ninguno**.

El cuarto es el fixture de `PT-149`, que declaraba su componente falso en el **orden 11** — el que
ahora ocupa `DICT`. `SUITE-R38` lo cazó: *«dos familias con el mismo orden hacen que `CORE.md`
dependa del orden de declaración en vez del declarado»*. **Tenía razón**, y el falso pasa al 12.

## Lo que NO se hace, y consta   `SUITE-R26`

- **Ningún generador.** Se decide con el dato de haberlo hecho a mano.
- **Ninguna herramienta nueva**: `PT-149` probó que no hace falta.
- **`PTSA` no cambia**: audita contra la Declaración de Valor; el Dictamen la **presenta** a quien
  no lee código. Confundirlos haría que uno de los dos sobrara.
- **El Dictamen de un proyecto DESTINO**: este repositorio es el único caso disponible, y
  `SUITE-R41` lo hace representativo **de la fuente**, no del destino.
- **Que el Dictamen SIRVA.** Lo dice el firmante — `AC-03` lo reserva desde el intake, y el
  documento lleva su bloque de firma **en blanco** a propósito.

## Y lo que esta tarea NO demuestra sobre el lote

Es la **única `FEATURE`** entre diecisiete. El criterio de éxito de `EP-026` —«nada da verde sin
mirar»— **no la cubre**, y el `§8` del intake del lote ya lo declaraba: **cerrarla no demuestra
nada sobre el objetivo del lote**. Va última porque construir el Dictamen sobre un marco cuya
verificación todavía miente sería **auditar con una regla torcida** — y las dieciséis anteriores
enderezaron la regla.

## Sin bloqueadores
